const cloud = require('wx-server-sdk')

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
    const {
        OPENID
    } = cloud.getWXContext();

    try {
        request.openid = OPENID;
        const params = await wxpayService.submitUnifiedOrder(request);

        if (params.return_code === 'SUCCESS' &&
            params.result_code === 'SUCCESS'
        ) {
            await db.collection('_order')
                .where({
                    "_id": request.outTradeNo || "",
                    "totalFee": request.totalFee
                })
                .update({
                    data: {
                        'wxpay.package': params.package,
                        'prepayTime': new Date()
                    }
                })

        }

        return params;

    } catch (err) {
        return err
    };
}

module.exports = {
    main
}