const cloud = require('wx-server-sdk')

// const wxpayConfig = require('../wxchat.pay/wechat.pay.config.js')
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

async function main(request) {
    try {
        const order = await db.collection('_order').doc(request.outTradeNo).get();
        console.log(order)

        if (order.data && order.data.wxpay && order.data.wxpay.package) {
            return wxpayService.repayOrder({
                package: order.data.wxpay.package
            });
        } else {
            return {
                errMsg: "发起支付失败"
            }
        }
    } catch (err) {
        return err
    };
}

module.exports = {
    main
}