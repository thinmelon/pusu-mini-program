/**
 *          微信JSAPI支付
 *          微信小程序支付
 */
const __UNIFIED_ORDER__ = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
const __ORDER_QUERY__ = 'https://api.mch.weixin.qq.com/pay/orderquery';
const __CLOSE_ORDER__ = 'https://api.mch.weixin.qq.com/pay/closeorder';
const __REFUND__ = 'https://api.mch.weixin.qq.com/secapi/pay/refund';
const __REFUND_QUERY__ = 'https://api.mch.weixin.qq.com/pay/refundquery';
const __DOWNLOAD_BILL__ = 'https://api.mch.weixin.qq.com/pay/downloadbill';
const __DOWNLOAD_FUND_FLOW__ = 'https://api.mch.weixin.qq.com/pay/downloadfundflow';
const __REPORT__ = 'https://api.mch.weixin.qq.com/payitil/report';
const __COMMENT_QUERY__ = 'https://api.mch.weixin.qq.com/billcommentsp/batchquerycomment';
/**
 *          企业付款到个人银行卡
 */
const __PAY_BANK__ = 'https://api.mch.weixin.qq.com/mmpaysptrans/pay_bank';
const __GET_PUBLIC_KEY__ = 'https://fraud.mch.weixin.qq.com/risk/getpublickey';
/**
 *          企业付款到零钱
 */
const __PAY_CHARGE__ = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers';

module.exports = {
    __UNIFIED_ORDER__: __UNIFIED_ORDER__,
    __ORDER_QUERY__: __ORDER_QUERY__,
    __CLOSE_ORDER__: __CLOSE_ORDER__,
    __REFUND__: __REFUND__,
    __REFUND_QUERY__: __REFUND_QUERY__,
    __DOWNLOAD_BILL__: __DOWNLOAD_BILL__,
    __DOWNLOAD_FUND_FLOW__: __DOWNLOAD_FUND_FLOW__,
    __REPORT__: __REPORT__,
    __COMMENT_QUERY__: __COMMENT_QUERY__,
    __PAY_BANK__: __PAY_BANK__,
    __PAY_CHARGE__: __PAY_CHARGE__,
    __GET_PUBLIC_KEY__: __GET_PUBLIC_KEY__
};