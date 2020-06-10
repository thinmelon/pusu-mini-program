// 云函数入口文件
const cloud = require('wx-server-sdk')
const wxpayConfig = require('../wxchat.pay/wechat.pay.config.js')
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
 *      创建订单
 * 
 *  返回 _id 值作为 outTradeNo
 */
function main(request) {
    const {
        OPENID
    } = cloud.getWXContext();

    let outTradeNo = wxpayHelper.getNonceStr(32);

    return db.collection('_order')
        .add({
            data: {
                _id: outTradeNo,
                openid: OPENID,
                customer: request.customer, //  联系人
                mobile: request.mobile, //  联系方式
                troupeName: request.troupeName, //  剧团名称
                dramaDate: request.dramaDate, //  演出日期
                dramaAddress: request.dramaAddress, //  演出地点
                preferred: request.preferred || [], //  心仪剧目
                stage: request.stage || false, //  是否自有戏台
                status: request.status || wxpayConfig.__ORDER_STATUS__.CHECK, //  订单状态
                basePrice: request.basePrice, //  基准价格
                discount: request.discount || 0, //  折扣
                totalFee: request.totalFee, //  订单价格
                wxpay: request.wxpay || {}, //  微信支付信息
                refund: request.refund || [], //  退款信息
                createTime: new Date() //  创建时间
            }
        })
        .then(record => {
            console.log("创建订单 >>> ", record)
            return new Promise((resolve, reject) => {
                if (record.errMsg === "collection.add:ok") {
                    resolve({
                        errMsg: "创建订单成功"
                    })
                } else {
                    reject({
                        errMsg: record.errMsg
                    })
                }
            })
        })
        .catch(err => {
            return err
        });

}

module.exports = {
    main
}