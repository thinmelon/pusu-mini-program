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
        .project(request.field || {
            "name": "$name", //  名称
            "code": "$code", //  代号
            "market": "$market", //  市场
            "follow": "$follow", //   关注
            "principle": "$principle", //   评分
            "balance": $.arrayElemAt(["$balance", 0]), //  资产负债表
            "profit": $.arrayElemAt(["$profit", 0]), //  利润表
            "cashflow": $.arrayElemAt(["$cashflow", 0]), //  现金流量表
            "indicators": $.arrayElemAt(["$indicators", 0]), //  各项指标
            "freezingShare": "$freezingShare", //   股份冻结
            "pledge": "$pledge", //   股份质押
            "holder": "$holder", //   十大股东
            "tradable": "$tradable", //   十大流通股东
            "restricted": "$restricted", //   受限股份流通上市日期
            "change": "$change", //  主要股东股权变动
            "dividends": "$dividends", //   分红转增信息
            "fund": "$fund", //   募集资金来源
            "plan": "$plan", //   募资投资项目
            "audit": "$audit", //   审计意见
            "related": "$related", //   关联交易
            "arbitration": "$arbitration", //   公司仲裁的说明及结构
            "punishment": "$punishment", //   公司受处罚表
            "license": "$license", //   行政许可
            "guarantee": "$guarantee", //   对外担保
            "invest": "$invest", //   对外投资
            "employee": "$employee", //   公司员工情况表
            "freezingAssets": "$freezingAssets", //   公司资产冻结表
            "capital": "$capital", //   股本结构
            "director": "$director", //   董事变动
        })
        .end()
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
            'market': true,
            'icon': true
        })
        .get()
}

module.exports = {
    newest,
    history,
    optional
}