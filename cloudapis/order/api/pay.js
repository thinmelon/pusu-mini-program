const cloud = require('wx-server-sdk')
const moment = require('moment')

const wxpayConfig = require('../wxchat.pay/wechat.pay.config.js')
const wxpayService = require('../wxchat.pay/wxchat.pay.service.js')

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
 * 获取订单列表
 */
function getOrders(request) {
    return db.collection('_order')
        .where(request.where)
        .get();
}

/**
 *          支付成功
 * 
 */
function paySuccess(order) {
    //  判断支付是否成功
    //  成功，保存微信支付返回结果，并修改订单的状态为已支付
    //  失败，暂无操作。后续可加入超时处理机制
    if (order.return_code === 'SUCCESS' &&
        order.result_code === 'SUCCESS' &&
        order.trade_state === 'SUCCESS') {
        return db.collection('_order')
            .where({
                "_id": order.out_trade_no || "",
                "status": wxpayConfig.__ORDER_STATUS__.NOTPAY
            })
            .update({
                data: {
                    'status': wxpayConfig.__ORDER_STATUS__.SUCCESS,
                    'endTime': new Date(),
                    'wxpay.bank_type': order.bank_type, //  银行类型，采用字符串类型的银行标识
                    'wxpay.total_fee': order.total_fee, //  订单总金额，单位为分
                    'wxpay.cash_fee': order.cash_fee, //  现金支付金额订单现金支付金额
                    'wxpay.device_info': order.device_info, //  微信支付分配的终端设备号
                    'wxpay.fee_type': order.fee_type, //  货币类型，符合ISO4217标准的三位字母代码，默认人民币：CNY
                    'wxpay.is_subscribe': order.is_subscribe, //  用户是否关注公众账号，Y-关注，N-未关注
                    'wxpay.openid': order.openid, //  用户在商户appid下的唯一标识
                    'wxpay.time_end': order.time_end, //  支付完成时间
                    'wxpay.trade_type': order.trade_type, //  交易类型    JSAPI、NATIVE、APP
                    'wxpay.transaction_id': order.transaction_id, //  微信支付订单号
                    'wxpay.attach': order.attach, //  附加数据，原样返回
                    'wxpay.trade_state': order.trade_state, // 现金支付金额订单现金支付金额
                    'wxpay.trade_state_desc': order.trade_state_desc // 对当前查询订单状态的描述和下一步操作的指引
                }
            })
            .then(res => {
                console.log("更新订单：", res)
                return new Promise((resolve, reject) => {
                    if (res.errMsg === "collection.update:ok") {
                        resolve({
                            errMsg: "OK",
                            data: {
                                "outTradeNo": order.out_trade_no,
                                "totalFee": order.total_fee,
                                "tradeState": order.trade_state,
                                "tradeStateDesc": order.trade_state_desc
                            }
                        })
                    } else {
                        reject({
                            errMsg: res.errMsg
                        })
                    }
                })
            })
            .catch(err => {
                return err
            });
    } else {
        return {
            errMsg: order.err_code_des ? order.err_code_des : "Fail"
        };
    }
}

/**
 *          超时未支付
 */
async function payExpire(order) {
    if ((order.return_code === 'SUCCESS' &&
            order.result_code === 'SUCCESS' &&
            order.trade_state === 'NOTPAY') ||
        (order.return_code === 'SUCCESS' &&
            order.result_code === 'FAIL' &&
            order.err_code === 'ORDERNOTEXIST')) {
        //  获取订单详情，判断订单支付时间是否已超时
        const temp = await db.collection('_order').doc(order.out_trade_no).get();
        if (temp.data && temp.data.checkTime && moment().isAfter(moment(temp.data.checkTime).add(2, 'h'))) {
            const result = await wxpayService.closeOrder({
                outTradeNo: order.out_trade_no
            });

            if (result.return_code === 'SUCCESS' &&
                result.result_code === 'SUCCESS') {
                //  释放剧团的排班资源
                const scheduling = await cloud.callFunction({
                    name: 'scheduling',
                    data: {
                        action: 'remove',
                        data: encodeURIComponent(JSON.stringify({
                            outTradeNo: order.out_trade_no
                        }))
                    }
                })
                console.log("释放排班资源  >>>  ", scheduling)

                //  更新订单状态
                return db.collection('_order')
                    .where({
                        "_id": order.out_trade_no || "",
                        "status": wxpayConfig.__ORDER_STATUS__.NOTPAY
                    })
                    .update({
                        data: {
                            'status': wxpayConfig.__ORDER_STATUS__.CLOSE,
                            'closeTime': new Date()
                        }
                    })
                    .then(res => {
                        console.log("更新订单  >>>  ", res)
                        return new Promise((resolve, reject) => {
                            if (res.errMsg === "collection.update:ok") {
                                resolve({
                                    errMsg: "OK"
                                })
                            } else {
                                reject({
                                    errMsg: res.errMsg
                                })
                            }
                        })
                    })
                    .catch(err => {
                        return err
                    });
            } else {
                return {
                    errMsg: order.err_code_des ? order.err_code_des : "Fail"
                };
            }
        }
    }
}

/**
 *      订单已关闭
 */
function alreadyClosed(order) {
    if (order.return_code === 'SUCCESS' &&
        order.result_code === 'SUCCESS' &&
        order.trade_state === 'CLOSED') {
        return db.collection('_order')
            .where({
                "_id": order.out_trade_no || "",
                "status": wxpayConfig.__ORDER_STATUS__.NOTPAY
            })
            .update({
                data: {
                    'status': wxpayConfig.__ORDER_STATUS__.CLOSE,
                    'closeTime': new Date()
                }
            })
            .then(res => {
                console.log("更新订单  >>>  ", res)
                return new Promise((resolve, reject) => {
                    if (res.errMsg === "collection.update:ok") {
                        resolve({
                            errMsg: "OK"
                        })
                    } else {
                        reject({
                            errMsg: res.errMsg
                        })
                    }
                })
            })
            .catch(err => {
                return err
            });
    }
}

/**
 *      成功退款
 */
function refundSuccess(order, refund) {
    if (refund.return_code === 'SUCCESS' &&
        refund.result_code === 'SUCCESS' &&
        refund.refund_status_0 === "SUCCESS" &&
        order.refund.some(item => {
            return refund.out_refund_no_0 === item.outRefundNo
        })) {
        return db.collection('_order')
            .where({
                "_id": refund.out_trade_no || "",
                "refund.outRefundNo": refund.out_refund_no_0 || ""
            })
            .update({
                data: {
                    "refund.$.status": wxpayConfig.__REFUND_STATUS__.SUCCESS, //  退款订单状态
                    "refund.$.refund_account": refund.refund_account_0, //  退款资金来源
                    "refund.$.refund_channel": refund.refund_channel_0, //  退款渠道
                    "refund.$.refund_count": refund.refund_count, //  退款笔数
                    "refund.$.refund_fee_0": parseInt(refund.refund_fee_0), //  申请退款金额
                    "refund.$.refund_id_0": refund.refund_id_0, //  微信退款单号
                    "refund.$.refund_recv_accout_0": refund.refund_recv_accout_0, //  退款入账账户
                    "refund.$.refund_status_0": refund.refund_status_0, //  退款状态
                    "refund.$.completeTime": refund.refund_success_time_0, //  退款成功时间
                }
            })
            .then(res => {
                console.log("更新订单：", res)
                return new Promise((resolve, reject) => {
                    if (res.errMsg === "collection.update:ok") {
                        resolve({
                            errMsg: "OK"
                        })
                    } else {
                        reject({
                            errMsg: res.errMsg
                        })
                    }
                })
            })
            .catch(err => {
                return err
            });
    }
}

module.exports = {
    getOrders,
    paySuccess,
    payExpire,
    alreadyClosed,
    refundSuccess
}