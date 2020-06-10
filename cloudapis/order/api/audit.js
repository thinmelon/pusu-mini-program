const cloud = require('wx-server-sdk')

const wxpayConfig = require('../wxchat.pay/wechat.pay.config.js')
const wxpayService = require('../wxchat.pay/wxchat.pay.service.js')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

//  审批结果通知	审批结果、订单号、审批时间、组织名称
// const ApprovalOrderTemplateId = "BXM8JgDALOXqKluhZlqaloX0lCR8B2iBgXQJZ-FYS8M"

//  退款通知    订单编号、退款编号、退款说明、退款金额、违约金、处理时间
// const ApprovalRefundTemplateId = "A8umRTPRO8VeY7nidq3M6NnaoP6qO91ZrcGH4qNF_54"

/**
 *  审核结果通知的模板消息
 */
// function sendApprovalOrderNotification(request) {
//     return cloud.callFunction({
//         name: 'callOpenAPI',
//         data: {
//             action: 'sendTemplateMessage',
//             page: 'pages/order/details/details?_=' + request.outTradeNo,
//             data: {
//                 //  审批结果
//                 keyword1: {
//                     value: request.checkMsg,
//                 },
//                 //  订单号
//                 keyword2: {
//                     value: request.outTradeNo,
//                 },
//                 //  审批时间
//                 keyword3: {
//                     value: request.checkTime,
//                 },
//                 //  组织名称
//                 keyword4: {
//                     value: request.troupeName
//                 }
//             },
//             templateId: ApprovalOrderTemplateId,
//             formId: request.formId,
//             openid: request.openid,
//             emphasisKeyword: "keyword1.DATA"
//         }
//     })
// }

/**
 *  审核结果通知的模板消息
 */
// function sendApprovalRefundNotification(request) {
//     return cloud.callFunction({
//         name: 'callOpenAPI',
//         data: {
//             action: 'sendTemplateMessage',
//             page: 'pages/order/details/details?_=' + request.outTradeNo,
//             data: {
//                 //  订单编号
//                 keyword1: {
//                     value: request.outTradeNo,
//                 },
//                 //  退款编号
//                 keyword2: {
//                     value: request.outRefundNo,
//                 },
//                 //  退款说明
//                 keyword3: {
//                     value: request.checkMsg,
//                 },
//                 //  退款金额
//                 keyword4: {
//                     value: (request.refundFee / 100).toFixed(2) + '元',
//                 },
//                 //  违约金
//                 keyword5: {
//                     value: ((request.penalty || 0) / 100).toFixed(2) + '元',
//                 },
//                 //  处理时间
//                 keyword6: {
//                     value: request.checkTime,
//                 }
//             },
//             templateId: ApprovalRefundTemplateId,
//             formId: request.formId,
//             openid: request.openid
//         }
//     })
// }

/**
 *  更新排班
 */
function updateScheduling(request) {
    console.log('updateScheduling >>> ', request)
    return cloud.callFunction({
        name: 'scheduling',
        data: {
            action: 'add',
            data: encodeURIComponent(JSON.stringify({
                outTradeNo: request.outTradeNo
            }))
        }
    })
}

/**
 *  剧团审核客户提交的预约请求
 */
function checkNewOrder(request) {
    let checkTime = new Date(),
        message = request.code === wxpayConfig.__AUDIT_STATUS__.AGREE ? "剧团已接单" : request.message;

    return db.collection('_order')
        .doc(request.outTradeNo)
        .update({
            data: {
                status: request.code === wxpayConfig.__AUDIT_STATUS__.AGREE ? wxpayConfig.__ORDER_STATUS__.NOTPAY : wxpayConfig.__ORDER_STATUS__.INIT,
                totalFee: request.totalFee,
                checkTime: checkTime,
                checkCode: request.code,
                checkMsg: message
            }
        })
        .then(res => {
            console.log("更新订单  >>>  ", res)
            return new Promise((resolve, reject) => {
                if (res.errMsg === "document.update:ok") {
                    resolve({
                        outTradeNo: request.outTradeNo, //   outTradeNo
                    })
                } else {
                    reject({
                        errMsg: res.errMsg
                    })
                }
            })
        })
        .then(updateScheduling)
        // .then(res => {
        //     console.log("更新排班  >>>  ", res)
        //     return new Promise((resolve, reject) => {
        //         if (res.result && res.result.stats.updated === 1) {
        //             resolve({
        //                 outTradeNo: request.outTradeNo, //   outTradeNo
        //                 openid: request.openid, //  客户openid
        //                 formId: request.formId, //  表单ID
        //                 checkTime: checkTime, //  审核时间
        //                 checkMsg: message, //  审核结果
        //                 troupeName: request.troupeName //  剧团名称
        //             })
        //         } else {
        //             reject({
        //                 errMsg: res.result.errMsg
        //             })
        //         }
        //     })
        // })
        // .then(sendApprovalOrderNotification)
        .then(res => {
            console.log("更新排班  >>>  ", res)
            return new Promise((resolve, reject) => {
                if (res.result && res.result.stats.updated === 1) {
                    resolve({
                        errMsg: "订单审核完成"
                    });
                } else {
                    reject({
                        errMsg: res.result.errMsg
                    })
                }
            })
        })
        .catch(err => {
            return err;
        });
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

/**
 *  剧团审核客户的退款请求
 */
async function checkRefundOrder(request) {
    let checkTime = new Date(),
        updated;

    if (request.code === wxpayConfig.__AUDIT_STATUS__.AGREE) {
        //  剧团同意客户的退款请求
        try {
            const result = await submitRefund({
                out_trade_no: request.outTradeNo,
                out_refund_no: request.outRefundNo,
                total_fee: request.totalFee,
                refund_fee: request.refundFee
            });
            //  调用微信支付申请退款API后的返回结果
            console.log("提交退款申请  >>>  ", result)
            if (result.return_code === "SUCCESS" && result.result_code === "SUCCESS") {
                //  释放剧团的排班资源
                const scheduling = await cloud.callFunction({
                    name: 'scheduling',
                    data: {
                        action: 'remove',
                        data: encodeURIComponent(JSON.stringify({
                            outTradeNo: request.outTradeNo
                        }))
                    }
                })
                console.log("释放排班资源  >>>  ", scheduling)

                updated = {
                    "refund.$.checkCode": request.code, //  审核结果
                    "refund.$.checkMsg": request.message, //  同意，或者拒绝理由
                    "refund.$.checkTime": checkTime, //  审核时间
                    "refund.$.status": wxpayConfig.__REFUND_STATUS__.REFUNDING //  退款订单状态
                }
            } else {
                return result;
            }
        } catch (err) {
            console.error(err)
            return err
        };

    } else {
        //  拒绝，构建退款订单参数
        updated = {
            "status": wxpayConfig.__ORDER_STATUS__.SUCCESS,
            "refund.$.checkCode": request.code, //  审核结果
            "refund.$.checkMsg": request.message, //  同意，或者拒绝理由
            "refund.$.checkTime": checkTime, //  审核时间
            "refund.$.status": wxpayConfig.__REFUND_STATUS__.CLOSED //  退款订单状态
        }
    }

    return db.collection('_order')
        .where({
            "_id": request.outTradeNo,
            "status": wxpayConfig.__ORDER_STATUS__.REFUND,
            "refund.outRefundNo": request.outRefundNo
        })
        .update({
            data: updated
        })
        // .then(res => {
        //     console.log("更新订单：", res)
        //     return new Promise((resolve, reject) => {
        //         if (res.stats.updated === 1) {
        //             resolve({
        //                 outTradeNo: request.outTradeNo, // 订单编号
        //                 outRefundNo: request.outRefundNo, // 退款单号
        //                 openid: request.openid, //  客户openid
        //                 formId: request.formId, //  表单ID
        //                 refundFee: request.refundFee, //  退款金额 
        //                 penalty: request.penalty, //  违约金
        //                 checkTime: checkTime, //  审核时间
        //                 checkMsg: request.message //  审核结果
        //             })
        //         } else {
        //             reject({
        //                 errMsg: res.errMsg
        //             })
        //         }
        //     })
        // })
        // .then(sendApprovalRefundNotification)
        .then(res => {
            console.log("更新订单：", res)
            return new Promise((resolve, reject) => {
                if (res.stats.updated === 1) {
                    resolve({
                        errMsg: "退款订单审核完成"
                    });
                } else {
                    reject({
                        errMsg: res.result.errMsg
                    })
                }
            })
        })
        .catch(err => {
            return err;
        });
}

/**
 *  剧团审核订单，同意后更新订单信息
 *  修改订单价格
 */
async function main(request) {
    //  预约请求
    if (request.status === wxpayConfig.__ORDER_STATUS__.CHECK) {
        return checkNewOrder(request);
    }
    //  退款申请
    else if (request.status === wxpayConfig.__ORDER_STATUS__.REFUND) {
        return await checkRefundOrder(request);
    }
    //  其它
    else {
        return null;
    }
}

module.exports = {
    main
}