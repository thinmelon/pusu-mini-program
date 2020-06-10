const structure = require('./wechat.pay.data.structure.js')
const helper = require('./wechat.pay.helper.js')
const config = require('./wechat.pay.config.js')
const api = require('./wechat.pay.api.url.js')

/**
 *              统一下单
 *
 * 商户在小程序中先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易后调起支付
 * 
 */
function submitUnifiedOrder(request) {
    // 生成POST Data
    const postData = helper.convertToXml(structure.constructUnifiedOrderParams(request));
    console.log(postData)

    // // 调用统一下单API
    return new Promise((resolve, reject) => {
        helper.sendHttpsPostRequest(api.__UNIFIED_ORDER__, postData, rawData => {
            structure
                // 对返回结果进行解析【XML转JSON】
                .parseReturnUnifiedOrder(rawData)
                // 验证结果的正确性
                .then(helper.checkSign)
                .then(result => {
                    if (result.return_code === 'SUCCESS' &&
                        result.result_code === 'SUCCESS'
                    ) {
                        const wxPayResult = structure.constructWechatPayParams(result);
                        // 回传参数：outTradeNo | timeStamp | nonceStr | package | paySign | signType
                        resolve({
                            return_code: result.return_code,
                            result_code: result.result_code,
                            prepay_id: result.prepay_id,
                            appid: wxPayResult.appId,
                            timeStamp: wxPayResult.timeStamp,
                            nonceStr: wxPayResult.nonceStr,
                            package: wxPayResult.package,
                            paySign: wxPayResult.paySign,
                            signType: wxPayResult.signType
                        });
                    } else {
                        reject(result);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        }, null);
    })
}

/**
 *              查询订单
 * 
 * 该接口提供所有微信支付订单的查询，商户可以通过查询订单接口主动查询订单状态，完成下一步的业务逻辑。需要调用查询接口的情况：
 *        ◆ 当商户后台、网络、服务器等出现异常，商户系统最终未接收到支付通知；
 *        ◆ 调用支付接口后，返回系统错误或未知交易状态情况；
 *        ◆ 调用刷卡支付API，返回USERPAYING的状态；
 *        ◆ 调用关单或撤销接口API之前，需确认支付状态；
 * 
 */
function queryOrder(request) {
    // 生成POST Data
    const postData = helper.convertToXml(structure.constructQueryOrderParams(request));
    console.log(postData)

    // 调用查询订单API
    return new Promise((resolve, reject) => {
        helper.sendHttpsPostRequest(api.__ORDER_QUERY__, postData, rawData => {
            structure
                // 对返回结果进行解析【XML转JSON】
                .parseReturnQueryOrder(rawData)
                .then(helper.checkSign)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        }, null);
    });
}

/**
 *          关闭订单
 * 
 * 以下情况需要调用关单接口：
 * 1.  商户订单支付失败需要生成新单号重新发起支付，要对原订单号调用关单，避免重复支付；
 * 2.  系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
 * 
 */

function closeOrder(request) {
    // 生成POST Data
    const postData = helper.convertToXml(structure.constructCloseOrderParams(request));
    console.log(postData);

    // 调用关闭订单API
    return new Promise((resolve, reject) => {
        helper.sendHttpsPostRequest(api.__CLOSE_ORDER__, postData, rawData => {
            structure
                // 对返回结果进行解析【XML转JSON】
                .parseReturnCloseOrder(rawData)
                // 验证结果的正确性
                .then(helper.checkSign)
                .then(result => { // 确认无误后回传给 Controller
                    if (result.return_code === 'SUCCESS' &&
                        result.result_code === 'SUCCESS'
                    ) {
                        resolve({
                            return_code: result.return_code,
                            result_code: result.result_code
                        });
                    } else {
                        reject({
                            return_code: result.return_code,
                            result_code: result.result_code
                        });
                    }
                })
                .catch(err => {
                    reject(err);
                });
        }, null);
    });
}

/**
 *                      重新支付
 *
 * 重新发起一笔支付要使用原订单号，避免重复支付
 * 已支付过或已调用关单、撤销（请见后文的API列表）的订单号不能重新发起支付
 */
function repayOrder(request) {
    return structure.constructWechatRepayParams(request);
}

/**
 *                      申请退款
 * 
 *  当交易发生之后一段时间内，由于买家或者卖家的原因需要退款时，卖家可以通过退款接口将支付款退还给买家
 *  微信支付将在收到退款请求并且验证成功之后，按照退款规则将支付款按原路退到买家帐号上。
 * 
 *  注意：
 *  1、交易时间超过一年的订单无法提交退款
 *  2、微信支付退款支持单笔交易分多次退款，多次退款需要提交原支付订单的商户订单号和设置不同的退款单号。
 *      申请退款总金额不能超过订单金额。 一笔退款失败后重新提交，请不要更换退款单号，请使用原商户退款单号
 *  3、请求频率限制：150qps，即每秒钟正常的申请退款请求次数不超过150次
 *     错误或无效请求频率限制：6qps，即每秒钟异常或错误的退款申请请求不超过6次
 *  4、每个支付订单的部分退款次数不能超过50次
 * 
 */
function refund(request) {
    // 生成POST Data
    const postData = helper.convertToXml(structure.constructRefundParams(request));
    console.log(postData);

    const agentOptions = {
        pfx: request.certFileBuffer,
        passphrase: request.mch_id || config.__MCH_ID__
    };

    // 调用申请退款API
    return new Promise((resolve, reject) => {
        helper.sendHttpsPostRequest(api.__REFUND__, postData, rawData => {
            structure
                //  对返回结果进行解析【XML转JSON】
                .parseReturnRefund(rawData)
                //  验签
                .then(helper.checkSign)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        }, agentOptions);
    });
}

/**
 *                      查询退款
 * 
 * 提交退款申请后，通过调用该接口查询退款状态。
 * 退款有一定延时，用零钱支付的退款20分钟内到账，银行卡支付的退款3个工作日后重新查询退款状态。
 * 
 * 注意：如果单个支付订单部分退款次数超过20次请使用退款单号查询
 * 
 * 
 */
function queryRefund(request) {
    // 生成POST Data
    const postData = helper.convertToXml(structure.constructQueryRefundParams(request));
    console.log(postData)

    // 调用查询订单API
    return new Promise((resolve, reject) => {
        helper.sendHttpsPostRequest(api.__REFUND_QUERY__, postData, rawData => {
            console.log(rawData)
            structure
                // 对返回结果进行解析【XML转JSON】
                .parseReturnQueryRefund(rawData)
                .then(helper.checkSign)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        }, null);
    });
}

module.exports = {
    submitUnifiedOrder,
    queryOrder,
    closeOrder,
    repayOrder,
    refund,
    queryRefund
}