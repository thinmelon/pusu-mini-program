const https = require('https');
const urlParser = require('url');
const crypto = require('crypto');
const util = require('util');

const config = require('./wechat.pay.config.js')

/**
 *          获取时间戳
 * 
 * 标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数。
 * 注意：部分系统取到的值为毫秒级，需要转换成秒(10位数字)
 * 
 */
function getTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}


/**
 *          产生随机字符串
 */
function getNonceStr(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const count = chars.length;
    let i, nonceStr = '';
    for (i = 0; i < length; i++) {
        nonceStr += chars.substr(Math.floor(Math.random() * (count - 1) + 1), 1);
    }
    return nonceStr;
}

/**
 *
 *          按字典序排序参数
 *
 *  设所有发送或者接收到的数据为集合M
 *  将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序）
 *  使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA
 *  参数名ASCII码从小到大排序（字典序）
 *  如果参数的值为空不参与签名；
 *  参数名区分大小写；
 *  验证调用返回或微信主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验。
 *  微信接口可能增加字段，验证签名时必须支持增加的扩展字段
 * 
 */
function convertToUrlParams(args) {
    let keys = Object.keys(args);
    keys = keys.sort();
    let newArgs = {};
    keys.forEach(key => {
        newArgs[key] = args[key];
    });
    let string = '';
    for (let k in newArgs) {
        if (k === 'sign') {
            continue;
        }
        if (k === 'apiKey') {
            continue;
        }
        if (newArgs[k] === '') {
            continue;
        }
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
}

/**
 *          
 *          设置签名
 * 
 * 对convertToUrlParams生成的String进行MD5运算，
 * 再将得到的字符串所有字符转换为大写，得到sign值signValue
 * 
 */
function makeSign(args, key) {
    let string = convertToUrlParams(args);
    string = string + '&key=' + key;
    let sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
    return sign.toUpperCase();
}

/**
 * 校验签名
 * @param args
 * @returns {*|promise}
 */
function checkSign(args) {
    return new Promise((resolve, reject) => {
        if (args.return_code !== 'SUCCESS') {
            reject({
                return_code: args.return_code,
                return_msg: args.return_msg
            });
        } else if (makeSign(args, args.key || config.__KEY__) !== args.sign) {
            reject({
                return_msg: '签名验证错误'
            });
        } else {
            resolve(args);
        }
    })
}

/**
 *          转换为XML
 * 
 * 生成Post方式的Https的携带参数
 * 
 */
function convertToXml(args) {
    let postData = '<xml>';

    for (let key in args) {
        postData += util.format('<%s>%s</%s>', key, args[key], key);
    }
    postData += '</xml>';

    return postData;
}

/**
 * GET 请求 -- HTTPS
 * 
 */
function sendHttpsGetRequest(url, encoding) {
    console.log('sendHttpsGetRequest >>>> ' + url);

    return new Promise((resovle, reject) => {
        https.get(url, response => {
            let data = '';
            if (encoding) {
                response.setEncoding(encoding);
            }
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                console.log('=====  返回结果：' + data);
                resovle(data);
            });
        }).on('error', error => {
            console.error(error);
            reject(error)
        });
    })
}

/**
 * 
 * POST 请求 -- HTTPS
 * 
 */
function sendHttpsPostRequest(url, data, callback, agentOptions, contentType) {
    const tmp = urlParser.parse(url);
    // 对于微信支付开发接口，提交和返回数据都为XML格式，根节点名为xml    
    const isHttp = tmp.protocol === 'http:';
    const postData = agentOptions && agentOptions.wechatPay ? data : JSON.stringify(data);
    const options = {
        host: tmp.hostname,
        port: tmp.port || (isHttp ? 80 : 443),
        path: tmp.path,
        method: 'POST',
        headers: {
            'Content-Type': contentType ? contentType : 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    if (agentOptions) {
        options.pfx = agentOptions.pfx;
        options.passphrase = agentOptions.passphrase;
    }

    console.log('=====  sendHttpsPostRequest ==> URL: ' + url);
    const req = https.request(options, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('=====  返回结果：' + data);
            callback(data);
        });
    });

    req.on('error', err => {
        console.error(err);
    });

    req.write(postData);
    req.end();
}


module.exports = {
    getTimestamp,
    getNonceStr,
    convertToXml,
    makeSign,
    checkSign,
    sendHttpsGetRequest,
    sendHttpsPostRequest
}