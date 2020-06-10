// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')
const crypto = require('crypto')
const querystring = require('querystring')
const http = require('http');
const config = require('./aliyun.sms.config.js')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

/**
 *  签名算法
 */
function sign(param) {
    let json = {},
        p = Object.keys(param).sort();

    for (let i = 0; i < p.length; i++) {
        json[p[i]] = param[p[i]];
    }
    return crypto
        .createHmac('sha1', config.Aliyun.AccessKeySecret + '&')
        .update(Buffer.from('POST&' + encodeURIComponent('/') + '&' + encodeURIComponent(querystring.stringify(json, '&', '=')), 'utf-8'))
        .digest('base64');
}

/**
 *  生成验证码
 */
function generateVCode(length) {
    let
        i,
        chars = '0123456789',
        verificationCode = '',
        count = chars.length - 1;

    for (i = 0; i < length; i++) {
        verificationCode = verificationCode.concat(chars.substr(parseInt(Math.random() * count), 1));
    }
    return verificationCode;
}

/**
 *  HTTP Post 请求
 */
function postRequest(request) {
    const postData = querystring.stringify(request.data);
    const options = {
        host: request.host,
        port: request.port,
        path: request.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('=====  doHttpPost ==> options: ' + JSON.stringify(options));

    return new Promise((resolve, reject) => {
        const req = http.request(options, res => {
            let data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                // console.log('=====  返回结果：' + data);
                resolve(data);
            });
        });
        req.on('error', err => {
            console.error(err.message);
            reject(err);
        });
        req.write(postData);
        req.end();
    })
}

/**
 *  保存短信记录
 */
function saveSms(data) {
    return db.collection('_sms')
        .add({
            data
        })
        .then(res => {
            return new Promise((resolve, reject) => {
                if (res.errMsg === "collection.add:ok") {
                    resolve({
                        requestId: data.RequestId,
                        bizId: data.BizId
                    })
                } else {
                    reject(res.errMsg)
                }
            });
        })
}

/**
 *  发送验证码
 */
function trigger(request) {
    const code = generateVCode(config.CodeLength);

    let data = {
        SignName: config.SignName, //   短信签名
        TemplateCode: config.Template.__SMS_TEMPLATE_LOGIN__, //   短信模板
        PhoneNumbers: request.mobile, //   接收短信的手机，逗号隔开，最多20个号码
        TemplateParam: JSON.stringify({ //   短信模板中参数指定
            code: code
        })
    },
        params;

    data.SignatureNonce = Math.random().toString();
    data.Timestamp = new Date().toISOString();
    params = Object.assign(data, config.Aliyun);
    params.Signature = sign(params);

    return new Promise((resolve, reject) => {
        //  POST 请求
        postRequest({
            host: config.ProductDomain,
            port: 80,
            path: "",
            data: params
        })
            .then(rawData => {
                let res = JSON.parse(rawData);
                console.log(res);
                if (res.Code === "OK") {
                    res.mobile = request.mobile;
                    res.vcode = code; //  加入验证码
                    res.smsTime = new Date();
                    resolve(res);
                } else {
                    reject(res.Message);
                }
            })
            .catch(err => {
                console.error(err);
                reject(err)
            })
    })
}

/**
 *  查询短信验证码
 */
function queryVCode(request) {
    return db.collection('_sms')
        .where({
            RequestId: request.requestId || "",
            BizId: request.bizId || "",
            mobile: request.mobile || "",
            vcode: request.vcode || ""
        })
        .get();
}

/**
 *  验证一致性
 */
async function checkVCode(request) {
    console.log("checkVCode", request)

    let ret;
    const result = await queryVCode(request);

    if (result.data && result.data.length === 1) {
        let current = moment(Date.now());
        let expireIn = moment(result.data[0].smsTime).add(180, 's').format('YYYY-MM-DD HH:mm:ss');
        console.log('CURRENT ==> ', current.format('YYYY-MM-DD HH:mm:ss'));
        console.log('EXPIRE IN ==> ', expireIn);
        if (current.isBefore(expireIn, 'second')) {
            ret = {
                errMsg: "OK"
            }
        } else {
            ret = {
                errMsg: "验证码已失效，请重新获取"
            }
        }

    } else {
        ret = {
            errMsg: "请输入正确的验证码"
        }
    }

    return ret;
}

// 云函数入口函数
exports.main = async (event, context) => {
    if (event.action === "trigger") {
        return await trigger({
            mobile: event.phone
        })
            .then(saveSms);
    } else {
        return checkVCode(event);
    }
}