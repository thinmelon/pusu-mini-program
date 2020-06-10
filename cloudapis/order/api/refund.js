const cloud = require('wx-server-sdk')

const wxpayConfig = require('../wxchat.pay/wechat.pay.config.js')
const wxpayService = require('../wxchat.pay/wxchat.pay.service.js')
const wxpayHelper = require('../wxchat.pay/wechat.pay.helper.js')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

/**
 *  获取剧团信息
 */
function getTroupeInfo(request) {
    return db.collection('_troupe')
        //  指定筛选条件
        .where({
            name: request.troupeName
        })
        .get()
}

/**
 *  提交退款申请
 */
async function applyForRefund(request) {
    const outRefundNo = wxpayHelper.getNonceStr(32); //  退款单号
    const refundFee = parseInt(request.refundFee); //  退款金额
    const penalty = parseInt(request.penalty); //  违约金
    const applyTime = new Date(); //  申请时间
    //  保存退款申请至目标订单
    const result = await db.collection('_order')
        .doc(request.outTradeNo)
        .update({
            data: {
                status: wxpayConfig.__ORDER_STATUS__.REFUND,
                refund: _.push({
                    outRefundNo: outRefundNo,
                    refundFee: refundFee,
                    penalty: penalty,
                    status: wxpayConfig.__REFUND_STATUS__.APPLY,
                    applyTime: applyTime,
                    reason: request.reason
                })
            }
        })

    return result;
}

/**
 *  剧团发起退款流程
 */
async function submitRefund(request) {
    //  下载API证书
    const certFile = await cloud.downloadFile({
        fileID: wxpayConfig.__WECHAT_PAY_API_CLIENT_CERT__, // 文件 ID
    });

    if (certFile.statusCode === 200) {
        //  调用申请退款API
        request.certFileBuffer = certFile.fileContent
        const result = await wxpayService.refund(request);
        return result;
    } else {
        return certFile.errMsg
    }
}

async function main(request) {
    try {
        //  客户申请退款
        if (request.process === 0) {
            return await applyForRefund(request);
        }
        //  剧团同意发起退款
        else if (request.process === 1) {
            return await submitRefund(request);
        } else {
            return null;
        }
    } catch (err) {
        console.error(err)
        return err
    };
}

module.exports = {
    main
}