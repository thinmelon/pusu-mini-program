const CLOUD = require('wx-server-sdk')

// 初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = CLOUD.database()

// 数据库查询更新指令对象
const _ = db.command
const $ = _.aggregate

/**
 *      获取自选股
 */
async function main(request) {
    return await db.collection('_stock')
        .aggregate()
        //  指定筛选条件
        .project({
            "stocks": $.filter({
                input: '$stocks',
                as: 'item',
                cond: $.eq(['$$item.follow', true])
            })
        })
        .project({
            "result": $.map({
                input: "$stocks",
                as: "item",
                in: {
                    "name": "$$item.name",
                    "code": "$$item.code"
                }
            })
        })
        .unwind("$result")
        .end()
}

module.exports = {
    main
}