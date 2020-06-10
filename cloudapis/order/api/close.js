const cloud = require('wx-server-sdk')

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

async function main(request) {
    try {
        const result = await wxpayService.closeOrder(request);

        if (result.return_code === 'SUCCESS' &&
            result.result_code === 'SUCCESS') {
            return db.collection('_order')
                .where({
                    "_id": request.outTradeNo || "",
                    "status": wxpayConfig.__ORDER_STATUS__.NOTPAY
                })
                .update({
                    data: {
                        'status': wxpayConfig.__ORDER_STATUS__.CLOSE,
                        'closeTime': new Date()
                    }
                })
                .then(res => {
                    console.log("更新订单：", res)
                    return {
                        errMsg: "OK"
                    }
                })
                .catch(err => {
                    return err
                });
        } else {
            return {
                errMsg: order.err_code_des ? order.err_code_des : "Fail"
            };
        }

    } catch (err) {
        return err
    };
}

module.exports = {
    main
}