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
 *      返回该支股票最新数据
 */
async function newest(request) {
    const _ = db.command;
    console.log("newest ==> ", request.keyword)

    return await db.collection('_stocks')
        .aggregate()
        .match(_.or([{
                "code": request.keyword || ""
            },
            {
                "name": request.keyword || ""
            }
        ]))
        .project({
            "name": "$name", //  名称
            "code": "$code", //  代号
            "market": "$market", //  市场
            "follow": "$follow", //   关注
            "principle": "$principle", //   评分
            "balance": $.arrayElemAt(["$balance", 0]), //  资产负债表
            "profit": $.arrayElemAt(["$profit", 0]), //  利润表
            "cashflow": $.arrayElemAt(["$cashflow", 0]), //  现金流量表
            "indicators": $.arrayElemAt(["$indicators", 0]), //  各项指标
            "pledge": "$pledge", //   股份质押
            "holder": "$holder", //   十大流通股东
            "fund": "$fund", //   募资来源
            "investment": "$investment", //   募资投资项目
            "audit": "$audit", //   审计意见
            "guarantee": "$guarantee", //   对外担保
            "punishment": "$punishment", //   公司受处罚表
            "change": "$change", //  主要股东股权变动
        })
        .end()

    // return await db.collection('_stock')
    //     .aggregate()
    //     //  指定筛选条件
    //     .project({
    //         "stocks": $.filter({
    //             input: '$stocks',
    //             as: 'item',
    //             cond: $.or([$.eq(['$$item.name', request.keyword]), $.eq(['$$item.code', request.keyword])])
    //         })
    //     })
    //     .project({
    //         "result": $.map({
    //             input: "$stocks",
    //             as: "item",
    //             in: {
    //                 "name": "$$item.name", //  名称
    //                 "code": "$$item.code", //  代号
    //                 "follow": "$$item.follow", //   关注
    //                 "principle": "$$item.principle", //   评分
    //                 "balance": $.arrayElemAt(["$$item.balance", 0]), //  资产负债表
    //                 "profit": $.arrayElemAt(["$$item.profit", 0]), //  利润表
    //                 "cashflow": $.arrayElemAt(["$$item.cashflow", 0]), //  现金流量表
    //                 "indicators": $.arrayElemAt(["$$item.indicators", 0]), //  各项指标
    //                 "pledge": "$$item.pledge", //   股份质押
    //                 "holder": "$$item.holder", //   十大流通股东
    //                 "fund": "$$item.fund", //   募资来源
    //                 "investment": "$$item.investment", //   募资投资项目
    //                 "audit": "$$item.audit", //   审计意见
    //                 "guarantee": "$$item.guarantee", //   对外担保
    //                 "punishment": "$$item.punishment", //   公司受处罚表
    //             }
    //         })
    //     })
    //     .unwind("$result")
    //     .end()
}

/**
 *      返回该支股票的所有信息（历史数据）
 */
async function history(request) {
    const _ = db.command;
    console.log("history ==> ", request.keyword)

    return await db.collection('_stocks')
        .where(_.or([{
                "code": request.keyword || ""
            },
            {
                "name": request.keyword || ""
            }
        ]))
        .limit(1)
        .get()
}

/**
 *      返回自选股
 */
async function optional(request) {
    return await db.collection('_stocks')
        .where({
            'follow': true
        })
        .field({
            'name': true,
            'code': true,
            'market': true
        })
        .get()
}

module.exports = {
    newest,
    history,
    optional
}