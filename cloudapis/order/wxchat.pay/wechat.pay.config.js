/**
 *          订单状态
 * 
 *      - INIT-创建订单                                        0
 *      - CHECK - 剧团审核                                     1 
 *      - NOTPAY — 未支付                                      2
 *      - SUCCESS — 支付成功                                   3
 *      - REFUND — 转入退款                                    4
 *      - CLOSED — 已关闭                                      5
 *      - REVOKED — 已撤销（刷卡支付）                          6
 *      - USERPAYING — 用户支付中                              7
 *      - PAYERROR — 支付失败(其他原因，如银行返回失败)          8
 *      - ABNORMAL — 状态异常                                  9
 */
const __ENUM_ORDER_STATUS__ = {
    INIT: 0,
    CHECK: 1,
    NOTPAY: 2,
    SUCCESS: 3,
    REFUND: 4,
    CLOSE: 5,
    REVOKED: 6,
    USERPAYING: 7,
    PAYERROR: 8,
    ABNORMAL: 9
};

/**
 *          审核状态
 * 
 *      -   AGREE - 同意        
 *      -   REJECT - 拒绝
 */
const __ENUM_AUDIT_STATUS__ = {
    AGREE: 0,
    REJECT: 1
};

/**
 *          退款订单状态
 * 
 *      -   APPLY       -   客户提交申请
 *      -   REFUNDING   -   剧团发起退款
 *      -   SUCCESS     -   退款成功
 *      -   CHANGE      -   退款异常
 *      -   CLOSED      -   退款关闭
 */
const __ENUM_REFUND_STATUS__ = {
    APPLY: 0,
    REFUNDING: 1,
    SUCCESS: 2,
    CHANGE: 3,
    CLOSED: 4
};

/**
 *          莆仙点戏 APPID
 */
const __APP_ID__ = "wx0a72bd7d41e0b066"

/**
 * MCHID：微信支付商户号（必须配置，开户邮件中可查看）
 */
const __MCH_ID__ = "1329741401"

/**
 * 自定义参数，可以为终端设备号(门店号或收银设备ID)
 */
const __DEVICE_INFO__ = "MINI-PROGRAM"

/**
 * KEY：商户支付密钥，参考开户邮件设置（必须配置，登录商户平台自行设置）
 * 设置地址：https://pay.weixin.qq.com/index.php/account/api_cert
 */
// const __KEY__ = '1u7blt3a6qlwjf1xg2d9cnsiiiewr95g'
const __KEY__ = 'LmYIlzeJiPMuVZobxSs1f454OPxXP1wM'

/**
 * 回传通知地址
 * 同时接收从微信支付商户平台内发起的扫码支付结果通知，请做好区分
 */
const __NOTIFY_URL__ = 'https://www.pusudo.cn/platform/wechat_pay/miniprogram/notify'

/**
 * 退款结果回调通知地址
 * 同时接收从微信支付商户平台内发起的退款结果通知，请做好区分
 * 当退款单的状态由退款中变为退款成功、退款关闭或者退款异常时，我们都会按照商户配置的回调地址，主动通知商户（仅限通知该订单的发起商户）
 * 若配置多个回调地址，我们将依序通知，前一个地址通知成功后，我们将不再通知后一个地址
 */
const __REFUND_NOTIFY_URL__ = 'https://www.pusudo.cn/platform/wechat_pay/miniprogram/refund'

/**
 * 设置商户证书路径
 * 证书路径,注意应该填写绝对路径（仅退款、撤销订单时需要，可登录商户平台下载）
 * API证书下载地址：https://pay.weixin.qq.com/index.php/account/api_cert，下载之前需要安装商户操作证书）
 */
const __WECHAT_PAY_API_CLIENT_CERT__ = 'cloud://putian-theatre-8clim.7075-putian-theatre-8clim-1300653270/1329741401/wxpay/apiclient_cert.p12'

/**
 * RSA 公钥
 */
const __RSA_PUBLIC_KEY_PKCS_ONE__ = 'rsa.public_key.PKCS_1.pem'

/**
 * APP和网页支付提交用户端ip
 * 默认为调用微信支付API的机器IP
 */
const __SPBILL_CREATE_IP__ = '106.14.149.225'

/**
 * 签名类型，默认为MD5，支持HMAC-SHA256和MD5
 */
const __SIGN_TYPE__ = 'MD5'

/**
 * 符合ISO 4217标准的三位字母代码，默认人民币：CNY
 */
const __FEE_TYPE__ = 'CNY'

/**
 *  交易类型
 */
const __TRADE_TYPE__ = 'JSAPI'

module.exports = {
    __ORDER_STATUS__: __ENUM_ORDER_STATUS__,
    __AUDIT_STATUS__: __ENUM_AUDIT_STATUS__,
    __REFUND_STATUS__: __ENUM_REFUND_STATUS__,

    __APP_ID__,
    __MCH_ID__,
    __DEVICE_INFO__,
    __KEY__,
    __NOTIFY_URL__,
    __REFUND_NOTIFY_URL__,
    __WECHAT_PAY_API_CLIENT_CERT__,
    __RSA_PUBLIC_KEY_PKCS_ONE__,
    __SPBILL_CREATE_IP__,
    __SIGN_TYPE__,
    __FEE_TYPE__,
    __TRADE_TYPE__
}