// 云函数入口文件
const ESTATES = require('./api/estates/estates.js')
const AVAILABLE = require('./api/estates/available.js')
const GOVERNMENT = require('./api/estates/government.js')
const TOP = require('./api/estates/top.js')
const BOND = require('./api/bond.js')
const CURRENCY = require('./api/currency.js')
const MONEY = require('./api/money.js')
const STOCK = require('./api/stock.js')
const MACRO = require('./api/macro.js')
const COMMODITY = require('./api/commodity.js')
const TRIGGER = require('./api/trigger.js')

// 云函数入口函数
exports.main = async (event, context) => {
    const entry = [{
        action: "history", //  莆田房产首页 - 统计数据
        fn: ESTATES.history
    }, {
        action: "month", //  莆田房产首页 - 商品房月签约 
        fn: ESTATES.month
    }, {
        action: "follow", //  关注/取消关注项目信息
        fn: ESTATES.follow
    }, {
        action: "available", //  获取项目信息
        fn: AVAILABLE.main
    }, {
        action: "investment", //  房产开发投资
        fn: GOVERNMENT.investment
    }, {
        action: "top", //  热点排行
        fn: TOP.main
    }, {
        action: "population", //  常住人口数据
        fn: GOVERNMENT.population
    }, {
        action: "test",
        fn: STOCK.shareholder
    },
    /**
     *      
     *      宏观
     * 
     */
    {
        action: "macro",
        fn: MACRO.refresh //  每月执行一次增量更新
    },
    /**
     *      
     *      货币
     * 
     */
    {
        action: "money",
        fn: MONEY.main
    },
    /**
     *      
     *      债券
     * 
     */
    {
        action: "bond",
        fn: BOND.main
    },
    /**
     *      外汇
     */
    {
        action: "currency",
        fn: CURRENCY.main
    },
    /**
     *      股票
     */
    {
        action: "market", //  获取过去一年内A股市场的股票账户数
        fn: STOCK.market
    },
    {
        action: "optional", //  自选股
        fn: STOCK.follow
    },
    {
        action: "basic", //  公司概况
        fn: STOCK.basic
    },
    {
        action: "refresh", //  财务报表
        fn: STOCK.refresh
    },
    {
        action: "shareholder", //  股本股东
        fn: STOCK.shareholder
    },
    {
        action: "fund", //  分红募资
        fn: STOCK.fund
    },
    {
        action: "issue", //  重大事项
        fn: STOCK.issue
    },
    {
        action: "principle", //  原则
        fn: STOCK.principle
    },
    {
        action: "score", //  评分
        fn: STOCK.score
    },
    {
        action: "note", //  交易日记
        fn: STOCK.note
    }
    ];

    console.log(event)

    const item = entry.find(item => item.action === event.action)
    const params = event.data ? JSON.parse(decodeURIComponent(event.data)) : {};
    return item ? await item.fn(params) : await TRIGGER.main();
}