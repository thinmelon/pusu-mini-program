const cloud = require('wx-server-sdk')

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
        const order = await db.collection('_order').doc(request.outTradeNo).get()
        const result = await db.collection('_scheduling')
            .where({
                name: order.data.troupeName
            })
            .update({
                data: {
                    scheduling: _.pull({
                        outTradeNo: _.eq(request.outTradeNo || "")
                    })
                }
            })

        return result;
    } catch (err) {
        return err;
    }
}

module.exports = {
    main
}