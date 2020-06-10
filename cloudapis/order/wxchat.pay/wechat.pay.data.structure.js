const moment = require('moment')
const xmlParser = require('xml2js').parseString;
const helper = require('./wechat.pay.helper.js')
const config = require('./wechat.pay.config.js')

/**
 * 构建微信支付 统一订单 接口参数
 */
function constructUnifiedOrderParams(request) {
    const params = {
        appid: request.appId || config.__APP_ID__, //  微信分配的小程序ID
        mch_id: request.mchId || config.__MCH_ID__, //  微信支付分配的商户号
        device_info: request.deviceInfo || config.__DEVICE_INFO__, //  自定义参数，可以为终端设备号(门店号或收银设备ID)
        nonce_str: helper.getNonceStr(32), //  随机字符串
        sign_type: request.signType || config.__SIGN_TYPE__, //  签名类型，默认为MD5，支持HMAC-SHA256和MD5
        body: request.body, //  商品简单描述  String(128)
        detail: request.detail || '', //  商品详细描述
        attach: request.attach || '', //  附加数据，在查询API和支付通知中原样返回
        out_trade_no: request.outTradeNo, //  商户系统内部订单号
        fee_type: request.feeType || config.__FEE_TYPE__, //  符合ISO 4217标准的三位字母代码，默认人民币：CNY
        total_fee: request.totalFee, //  订单总金额
        spbill_create_ip: request.spbillCreateIp || config.__SPBILL_CREATE_IP__, //  APP和网页支付提交用户端ip
        time_start: request.timeStart || '', //  订单生成时间
        time_expire: request.timeExpire || '', //  订单失效时间，半小时内未
        goods_tag: request.goodsTag || '', //  订单优惠标记，使用代金券或立减优惠功能时需要的参数
        notify_url: request.notifyUrl || config.__NOTIFY_URL__, //  异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数
        trade_type: request.tradeType || config.__TRADE_TYPE__, //  交易类型
        product_id: request.productId || '', //  trade_type=NATIVE时（即扫码支付），此参数必传。此参数为二维码中包含的商品ID，商户自行定义
        limit_pay: request.limitPay || '', //  上传此参数no_credit--可限制用户不能使用信用卡支付
        openid: request.openid, //  trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识
        receipt: request.receipt || '', //  Y，传入Y时，支付成功消息和支付详情页将出现开票入口。需要在微信支付商户平台或微信公众平台开通电子发票功能，传此字段才可生效
        scene_info: request.sceneInfo || '' //  该字段常用于线下活动时的场景信息上报，支持上报实际门店信息，商户也可以按需求自己上报相关信息
    };
    // 生成签名
    params.sign = helper.makeSign(params, request.key || config.__KEY__);

    return params;
}

/**
 *
 *      解析统一支付接口的返回数据
 * 
 */
function parseReturnUnifiedOrder(rawData) {
    return new Promise((resolve, reject) => {
        xmlParser(rawData, (err, result) => {
            if (result.xml.return_code[0] !== 'SUCCESS') {
                reject({
                    return_code: result.xml.return_code[0],
                    return_msg: result.xml.return_msg[0]
                });
            } else {
                let data;

                if (result.xml.result_code[0] === 'SUCCESS') {
                    data = {
                        return_code: result.xml.return_code[0], // 通信标识，非交易标识
                        return_msg: result.xml.return_msg[0], // 返回信息，如非空，为错误原因
                        appid: result.xml.appid[0], // 调用接口提交的小程序ID
                        mch_id: result.xml.mch_id[0], // 调用接口提交的商户号
                        device_info: result.xml.device_info[0],
                        nonce_str: result.xml.nonce_str[0], // 微信返回的随机字符串
                        sign: result.xml.sign[0], // 微信返回的签名值
                        result_code: result.xml.result_code[0], // 业务结果
                        prepay_id: result.xml.prepay_id[0], // 微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
                        trade_type: result.xml.trade_type[0] // 交易类型
                    };
                    resolve(data)
                } else {
                    data = {
                        return_code: result.xml.return_code[0], // 通信标识，非交易标识
                        return_msg: result.xml.return_msg[0], // 返回信息，如非空，为错误原因
                        appid: result.xml.appid[0], // 调用接口提交的小程序ID
                        mch_id: result.xml.mch_id[0], // 调用接口提交的商户号
                        device_info: result.xml.device_info[0],
                        nonce_str: result.xml.nonce_str[0], // 微信返回的随机字符串
                        sign: result.xml.sign[0], // 微信返回的签名值
                        result_code: result.xml.result_code[0], // 业务结果
                        err_code: result.xml.err_code[0], // 微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
                        err_code_des: result.xml.err_code_des[0] // 交易类型
                    };
                    reject(data)
                }
            }
        });
    })
}

/**
 *      构造微信支付结果
 */
function constructWechatPayParams(request) {
    const wxPayResult = {
        appId: request.appid, // 调用接口提交的小程序ID
        timeStamp: helper.getTimestamp(),
        nonceStr: helper.getNonceStr(32),
        package: 'prepay_id=' + request.prepay_id, //  prepay_id
        signType: 'MD5'
    };
    wxPayResult.paySign = helper.makeSign(wxPayResult, request.key || config.__KEY__);

    return wxPayResult;
}

/**
 *      构造查询订单接口参数
 */
function constructQueryOrderParams(request) {
    const params = {
        out_trade_no: request.outTradeNo,
        appid: request.appid || config.__APP_ID__,
        mch_id: request.mch_id || config.__MCH_ID__,
        nonce_str: helper.getNonceStr(32)
    };
    // 生成签名
    params.sign = helper.makeSign(params, request.key || config.__KEY__);

    return params;
}

/**
 *
 *      解析查询订单接口的返回数据
 */
function parseReturnQueryOrder(rawData) {
    return new Promise((resolve, reject) => {
        xmlParser(rawData, (err, result) => {
            if (result.xml.return_code[0] !== 'SUCCESS') {
                reject({
                    return_code: result.xml.return_code[0],
                    return_msg: result.xml.return_msg[0]
                });
            } else {
                if (result.xml.result_code[0] === 'SUCCESS') {
                    if (result.xml.trade_state[0] === 'SUCCESS') {
                        resolve({
                            return_code: result.xml.return_code[0], // 通信标识，非交易标识
                            return_msg: result.xml.return_msg[0], // 返回信息，如非空，为错误原因
                            appid: result.xml.appid[0], // 调用接口提交的小程序ID
                            mch_id: result.xml.mch_id[0], // 调用接口提交的商户号
                            device_info: result.xml.device_info[0],
                            nonce_str: result.xml.nonce_str[0], // 微信返回的随机字符串
                            sign: result.xml.sign[0], // 微信返回的签名值
                            result_code: result.xml.result_code[0], // 业务结果
                            openid: result.xml.openid[0], // 用户在商户appid下的唯一标识
                            is_subscribe: result.xml.is_subscribe[0], // 用户是否关注公众账号
                            trade_type: result.xml.trade_type[0], // 调用接口提交的交易类型
                            bank_type: result.xml.bank_type[0], // 银行类型，采用字符串类型的银行标识
                            total_fee: result.xml.total_fee[0], // 订单总金额，单位为分
                            fee_type: result.xml.fee_type[0], // 货币类型
                            transaction_id: result.xml.transaction_id[0], // 微信支付订单号
                            out_trade_no: result.xml.out_trade_no[0], // 商户系统内部订单号
                            attach: result.xml.attach[0], // 附加数据，原样返回
                            time_end: result.xml.time_end[0], // 订单支付时间
                            trade_state: result.xml.trade_state[0], // 交易状态
                            cash_fee: result.xml.cash_fee[0], // 业务结果                            
                            trade_state_desc: result.xml.trade_state_desc[0], // 对当前查询订单状态的描述和下一步操作的指引
                            cash_fee_type: result.xml.cash_fee_type[0] // 货币类型
                        });
                    } else {
                        // 如果trade_state不为 SUCCESS，则只返回out_trade_no（必传）和attach（选传）
                        let ret = {
                            return_code: result.xml.return_code[0], // 通信标识，非交易标识
                            return_msg: result.xml.return_msg[0], // 返回信息，如非空，为错误原因
                            appid: result.xml.appid[0], // 调用接口提交的小程序ID
                            mch_id: result.xml.mch_id[0], // 调用接口提交的商户号
                            nonce_str: result.xml.nonce_str[0], // 微信返回的随机字符串
                            sign: result.xml.sign[0], // 微信返回的签名值
                            result_code: result.xml.result_code[0], // 业务结果
                            out_trade_no: result.xml.out_trade_no[0], // 商户系统内部订单号
                            trade_state: result.xml.trade_state[0], // 交易状态
                            trade_state_desc: result.xml.trade_state_desc[0] // 对当前查询订单状态的描述和下一步操作的指引
                        }
                        if (ret.trade_state === "CLOSED") {
                            ret.attach = result.xml.attach[0]; // 附加数据，原样返回
                        } else if (ret.trade_state === "NOTPAY") {
                            ret.device_info = result.xml.device_info[0];
                            ret.total_fee = result.xml.total_fee[0];
                        }
                        resolve(ret);
                    }
                } else {
                    reject({
                        return_code: result.xml.return_code[0], // 通信标识，非交易标识
                        return_msg: result.xml.return_msg[0], // 返回信息，如非空，为错误原因
                        result_code: result.xml.result_code[0], // 业务结果
                        err_code: result.xml.err_code[0], // 错误码
                        err_code_des: result.xml.err_code_des[0] // 结果信息描述
                    });
                }
            }
        });

    });
}

/**
 * 构造关闭订单接口参数
 */
function constructCloseOrderParams(request) {
    const params = {
        out_trade_no: request.outTradeNo,
        appid: request.appid || config.__APP_ID__,
        mch_id: request.mch_id || config.__MCH_ID__,
        nonce_str: helper.getNonceStr(32)
    };
    // 生成签名
    params.sign = helper.makeSign(params, request.key || config.__KEY__);

    return params;
}

/**
 *      解析关闭订单的返回结果
 *
 */
function parseReturnCloseOrder(rawData) {
    return new Promise((resolve, reject) => {
        xmlParser(rawData, (err, result) => {
            if (result.xml.return_code[0] !== 'SUCCESS') {
                reject({
                    return_code: result.xml.return_code[0],
                    return_msg: result.xml.return_msg[0]
                });
            } else {
                if (result.xml.result_code[0] === 'SUCCESS') {
                    resolve({
                        return_code: result.xml.return_code[0],
                        return_msg: result.xml.return_msg[0],
                        appid: result.xml.appid[0],
                        mch_id: result.xml.mch_id[0],
                        sub_mch_id: result.xml.sub_mch_id[0],
                        nonce_str: result.xml.nonce_str[0],
                        sign: result.xml.sign[0],
                        result_code: result.xml.result_code[0]
                    });
                } else {
                    reject({
                        return_code: result.xml.return_code[0],
                        return_msg: result.xml.return_msg[0],
                        result_code: result.xml.result_code[0],
                        err_code: result.xml.err_code[0],
                        err_code_des: result.xml.err_code_des[0]
                    });
                }
            }
        });
    });
}

/**
 *      构造重新支付的参数
 *  
 * 与立即支付不同的是package参数不用重复构建
 */
function constructWechatRepayParams(request) {
    const wxPayResult = {
        appId: request.appid || config.__APP_ID__,
        timeStamp: helper.getTimestamp(),
        nonceStr: helper.getNonceStr(32),
        package: request.package, //  prepay_id
        signType: 'MD5'
    };
    // 生成签名
    wxPayResult.paySign = helper.makeSign(wxPayResult, request.key || config.__KEY__);

    return wxPayResult;
}

/**
 *      构造发起退款的接口参数
 * 
 */
function constructRefundParams(request) {
    const params = {
        appid: request.appid || config.__APP_ID__, //  微信分配的小程序ID
        mch_id: request.mch_id || config.__MCH_ID__, //  微信支付分配的商户号
        nonce_str: helper.getNonceStr(32), //  随机字符串
        sign_type: request.sign_type || 'MD5', //  签名类型，默认为MD5，支持HMAC-SHA256和MD5
        out_trade_no: request.out_trade_no, //  商户系统内部订单号
        out_refund_no: request.out_refund_no, //  商户系统内部的退款单号
        total_fee: request.total_fee, //  订单总金额   单位为分，只能为整数
        refund_fee: request.refund_fee, //  退款总金额   单位为分，只能为整数
        refund_fee_type: request.fee_type || 'CNY', //  货币类型，符合ISO 4217标准的三位字母代码，默认人民币：CNY
        refund_desc: request.refund_desc || '', //  若商户传入，会在下发给用户的退款消息中体现退款原因
        refund_account: request.refund_account || 'REFUND_SOURCE_UNSETTLED_FUNDS', //  针对老资金流商户使用
        notify_url: config.__REFUND_NOTIFY_URL__ //  异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数
    };
    // 生成签名
    params.sign = helper.makeSign(params, request.key || config.__KEY__);

    return params;
}

/**
 *      解析退款接口的返回结果
 *
 */
function parseReturnRefund(rawData) {
    return new Promise((resolve, reject) => {
        xmlParser(rawData, (err, result) => {
            if (result.xml.return_code[0] !== 'SUCCESS') {
                reject({
                    return_code: result.xml.return_code[0],
                    return_msg: result.xml.return_msg[0]
                });
            } else {
                if (result.xml.result_code[0] === 'SUCCESS') {
                    resolve({
                        return_code: result.xml.return_code[0],
                        return_msg: result.xml.return_msg[0],
                        appid: result.xml.appid[0], // 调用接口提交的小程序ID
                        mch_id: result.xml.mch_id[0], // 调用接口提交的商户号
                        nonce_str: result.xml.nonce_str[0], // 微信返回的随机字符串
                        sign: result.xml.sign[0], // 微信返回的签名值
                        result_code: result.xml.result_code[0], // 业务结果
                        transaction_id: result.xml.transaction_id[0],
                        out_trade_no: result.xml.out_trade_no[0],
                        out_refund_no: result.xml.out_refund_no[0],
                        refund_id: result.xml.refund_id[0],
                        refund_channel: result.xml.refund_channel[0],
                        refund_fee: result.xml.refund_fee[0],
                        coupon_refund_fee: result.xml.coupon_refund_fee[0],
                        total_fee: result.xml.total_fee[0],
                        cash_fee: result.xml.cash_fee[0],
                        coupon_refund_count: result.xml.coupon_refund_count[0],
                        cash_refund_fee: result.xml.cash_refund_fee[0]
                    });
                } else {
                    reject({
                        return_code: result.xml.return_code[0],
                        result_code: result.xml.result_code[0],
                        err_code: result.xml.err_code[0],
                        err_code_des: result.xml.err_code_des[0]
                    });
                }
            }
        });
    });
}

/**
 *      构造查询退款结果的接口参数
 */
function constructQueryRefundParams(request) {
    const params = {
        appid: request.appid || config.__APP_ID__, //  微信分配的小程序ID
        mch_id: request.mch_id || config.__MCH_ID__, //  微信支付分配的商户号
        nonce_str: helper.getNonceStr(32), //  随机字符串
        sign_type: request.sign_type || 'MD5', //  签名类型，默认为MD5，支持HMAC-SHA256和MD5
        out_trade_no: request.out_trade_no, //  商户系统内部订单号
    };
    // 生成签名
    params.sign = helper.makeSign(params, request.key || config.__KEY__);

    return params;
}

/**
 *      解析查询退款结果的返回结果
 * 
 */
function parseReturnQueryRefund(rawData) {
    return new Promise((resolve, reject) => {
        xmlParser(rawData, (err, result) => {
            if (result.xml.return_code[0] !== 'SUCCESS') {
                reject({
                    return_code: result.xml.return_code[0],
                    return_msg: result.xml.return_msg[0]
                });
            } else {
                if (result.xml.result_code[0] === 'SUCCESS') {
                    if (result.xml.refund_status_0[0] === 'SUCCESS') {
                        resolve({
                            return_code: result.xml.return_code[0],
                            return_msg: result.xml.return_msg[0],
                            appid: result.xml.appid[0], // 调用接口提交的小程序ID
                            mch_id: result.xml.mch_id[0], // 调用接口提交的商户号
                            nonce_str: result.xml.nonce_str[0], // 微信返回的随机字符串
                            sign: result.xml.sign[0], // 微信返回的签名值
                            cash_fee: result.xml.cash_fee[0], //  现金支付金额                        
                            out_refund_no_0: result.xml.out_refund_no_0[0], //  商户退款单号
                            out_trade_no: result.xml.out_trade_no[0], //  商户订单号
                            refund_account_0: result.xml.refund_account_0[0], //  退款资金来源
                            refund_channel_0: result.xml.refund_channel_0[0], //  退款渠道
                            refund_count: result.xml.refund_count[0], //  退款笔数
                            refund_fee: result.xml.refund_fee[0], //  
                            refund_fee_0: result.xml.refund_fee_0[0], //  申请退款金额
                            refund_id_0: result.xml.refund_id_0[0], //  微信退款单号
                            refund_recv_accout_0: result.xml.refund_recv_accout_0[0], //  退款入账账户
                            refund_status_0: result.xml.refund_status_0[0], //  退款状态
                            refund_success_time_0: result.xml.refund_success_time_0[0], //  退款成功时间
                            result_code: result.xml.result_code[0], // 业务结果
                            total_fee: result.xml.total_fee[0], //  订单金额
                            transaction_id: result.xml.transaction_id[0] //  微信订单号
                        });
                    } else {
                        reject({
                            return_code: result.xml.return_code[0],
                            return_msg: result.xml.return_msg[0],
                            cash_fee: result.xml.cash_fee[0], //  现金支付金额                        
                            out_refund_no_0: result.xml.out_refund_no_0[0], //  商户退款单号
                            out_trade_no: result.xml.out_trade_no[0], //  商户订单号
                            refund_account_0: result.xml.refund_account_0[0], //  退款资金来源
                            refund_channel_0: result.xml.refund_channel_0[0], //  退款渠道
                            refund_count: result.xml.refund_count[0], //  退款笔数
                            refund_fee: result.xml.refund_fee[0], //  
                            refund_fee_0: result.xml.refund_fee_0[0], //  申请退款金额
                            refund_id_0: result.xml.refund_id_0[0], //  微信退款单号
                            refund_recv_accout_0: result.xml.refund_recv_accout_0[0], //  退款入账账户
                            refund_status_0: result.xml.refund_status_0[0], //  退款状态
                            result_code: result.xml.result_code[0], // 业务结果
                            total_fee: result.xml.total_fee[0], //  订单金额
                            transaction_id: result.xml.transaction_id[0] //  微信订单号
                        })
                    }
                } else {
                    reject({
                        return_code: result.xml.return_code[0],
                        return_msg: result.xml.return_msg[0],
                        result_code: result.xml.result_code[0],
                        err_code: result.xml.err_code[0],
                        err_code_des: result.xml.err_code_des[0]
                    });
                }
            }
        });
    });
}

module.exports = {
    constructUnifiedOrderParams,
    parseReturnUnifiedOrder,
    constructWechatPayParams,
    constructQueryOrderParams,
    parseReturnQueryOrder,
    constructCloseOrderParams,
    parseReturnCloseOrder,
    constructWechatRepayParams,
    constructRefundParams,
    parseReturnRefund,
    constructQueryRefundParams,
    parseReturnQueryRefund
}