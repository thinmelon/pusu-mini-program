const UTIL = require('util');
const AXIOS = require('axios')
const MOMENT = require('moment')
const CLOUD = require('wx-server-sdk')
const URL = require('../utils/url.js')
const CONFIG = require('../utils/config.js')
const HTTP_CLIENT = require('../utils/http.client.js')

//  初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

//  可在入口函数外缓存 db 对象
const db = CLOUD.database()
//  数据库查询更新指令对象
const _ = db.command
const $ = _.aggregate

//  网页 table 字段
const FIELDS = [{
    name: "enddate",
    start: "enddate",
    end: "invstr_new"
}, {
    name: "invstr_new",
    start: "invstr_new",
    end: "invstr_new_a"
}, {
    name: "invstr_num",
    start: "invstr_num",
    end: "};"
}]

/**
 *      获取 巨潮资讯网 ACCESS TOKEN
 * 
 * 通过POST方式请求 http://webapi.cninfo.com.cn/api-cloud-platform/oauth2/token 接口
 * 传入 我的凭证 下面二个参数client_id=Access Key的值，client_secret=Access Secret的值来获取token
 * 
 */
async function getCNInfoAPIOauthToken() {
    const data = {
        grant_type: 'client_credentials',
        client_id: CONFIG.CNINFO_ACCESS_KEY,
        client_secret: CONFIG.CNINFO_ACCESS_SECRET
    };

    const result = await HTTP_CLIENT.postPromisify(
        URL.CNINFO_API_HOST,
        80,
        URL.CNINFO_API_OAUTH_TOKEN_PATH,
        data);

    return JSON.parse(result);
}

/**
 *      分配抓取各大股票市场的所有股票任务
 * 
 * 聚合数据接口返回结果分页，统计结果总数及每页记录数，计算出各市场抓取页面数，即任务数
 */
async function grabMarketStocksTask(request) {
    // const response = await AXIOS.get(UTIL.format(URL.JUHE_STOCK_SZ_LIST, CONFIG.JUHE_STOCK_APP_KEY, request.page || 1, request.type || 4))
    // const response = await AXIOS.get(UTIL.format(URL.JUHE_STOCK_SH_LIST, CONFIG.JUHE_STOCK_APP_KEY, request.page || 1, request.type || 4))
    const response = await AXIOS.get(UTIL.format(URL.JUHE_STOCK_HK_LIST, CONFIG.JUHE_STOCK_APP_KEY, request.page || 1, request.type || 4))
    // const response = await AXIOS.get(UTIL.format(URL.JUHE_STOCK_USA_LIST, CONFIG.JUHE_STOCK_APP_KEY, request.page || 1, request.type || 3))

    if (response.status === 200 &&
        response.data.error_code === 0 &&
        response.data.result.data.length > 0
    ) {
        const totalCount = parseInt(response.data.result.totalCount) //  总记录数
        const totalPage = Math.ceil(totalCount / parseInt(response.data.result.num))
        console.log("grabMarketStocksTask >>> ", totalCount, totalPage, response.data.result.data.length)
        for (let i = 1; i <= totalPage; i++) {
            const result = await db.collection('_task')
                .add({
                    data: {
                        rank: 11,
                        subject: 'FINANCE',
                        category: 'STOCK',
                        // market: 'SHEN ZHEN',
                        // market: 'SHANG HAI',
                        market: 'HONG KONG',
                        // market: 'USA',
                        page: i,
                        type: request.type || 3,
                        status: 0,
                        addTime: new Date()
                    }
                })
        }
        return 'DONE'
    } else {
        return {
            errMsg: "无法获取数据"
        }
    }
}

/**
 *      各市场股票列表
 * 
 * 第一次作全局更新
 * TODO: 之后做增量更新，从数据库取回所有股票，比对接口返回的股票总数
 * 相同则不更新，不同则找出新增的股票，插入数组
 */
async function grabMarketStocks(request) {
    let url = ""

    switch (request.market) {
        case "SHEN ZHEN": //  深圳证券交易所
            url = URL.JUHE_STOCK_SZ_LIST;
            break;
        case "SHANG HAI": //  上海证券交易所
            url = URL.JUHE_STOCK_SH_LIST;
            break;
        case "HONG KONG": //  联交所
            url = URL.JUHE_STOCK_HK_LIST;
            break;
        case "USA": //  美股市场
            url = URL.JUHE_STOCK_USA_LIST;
            break;
        default:
            return "DONE"
    }
    console.log("grabMarketStocks >>> ", url, request.page, request.type)
    const response = await AXIOS.get(UTIL.format(url, CONFIG.JUHE_STOCK_APP_KEY, request.page, request.type))

    if (response.status === 200 && response.data.error_code === 0) {
        let stocks = response.data.result.data.map(record => {
            return {
                name: request.market === "USA" ? record.cname : record.name,
                code: request.market === "USA" || request.market === "HONG KONG" ? record.symbol : record.code,
                shortened: record.engname
            }
        })

        const result = await db.collection('_stock')
            .doc(request.market)
            .update({
                data: {
                    stocks: _.push({
                        each: stocks,
                        sort: {
                            name: 1
                        }
                    }),

                }
            })
        console.log(result)
        return "DONE"
    } else {
        return {
            errMsg: "无法获取数据"
        }
    }
}

/**
 *      抓取今年的股票账户数（新增、总数）
 */
async function grabStockAccountNumber(request) {
    const response = await AXIOS.get(URL.STOCK_ACCOUNT_NUMBER)

    if (response.status === 200) {
        let info = {}
        FIELDS.map(field => {
            let item = response.data.substring(response.data.indexOf(field.start), response.data.indexOf(field.end))
            item = JSON.parse(`{"data": ${item.substring(item.indexOf('['), item.indexOf(']') + 1).replace(/\'/g, '"')}}`)
            info[field.name] = item
        })

        let length = info.enddate.data.length,
            index = length;

        //  截取过去一年至今年的数据
        for (let i = 0; i < info.enddate.data.length; i++) {
            if (MOMENT(info.enddate.data[i], 'YYYY-MM-DD').year() === MOMENT().subtract(1, 'years').year()) {
                index = i;
                break;
            }
        }

        const date = info.enddate.data.slice(index, length) //  日期
        const newInvestors = info.invstr_new.data.slice(index, length) //  新增投资者
        const totalInvestors = info.invstr_num.data.slice(index, length) //  投资者总数

        for (let i = 0; i < date.length; i++) {
            const month = MOMENT(date[i], 'YYYY-MM-DD').format('YYYY.MM') //  转换成月
            console.log(month)
            let ret = db.collection('_market')
                .where({
                    "_id": month
                })
                .get()

            const data = {
                "date": date[i],
                "newInvestors": newInvestors[i],
                "totalInvestors": totalInvestors[i]
            }
            //  是否存在当月数据
            if (ret.data && ret.data.length > 0) {
                ret = db.collection('_market')
                    .where({
                        "_id": month,
                        "day.date": date[i]
                    })
                    .get()
                //  是否存在当日数据
                if (ret2.data && ret2.data.length === 0) {
                    await db.collection('_market')
                        .doc(month)
                        .update({
                            data: {
                                day: _.push(data)
                            }
                        })
                }
            } else {
                await db.collection('_market')
                    .doc(month)
                    .set({
                        data: {
                            day: [data]
                        }
                    })
            }
        }

        return "DONE"
    } else {
        return {
            errMsg: "无法获取数据"
        }
    }
}

/**
 *  定期报告审计意见
 */
async function grabStockInfo(request, url, field) {
    const token = await getCNInfoAPIOauthToken()
    const response = await AXIOS.get(UTIL.format(url, request.code, token.access_token))
    const data = {}
    // console.log(response)

    if (response.status === 200 && response.data.resultcode === 200) {
        data[field] = response.data.records
        return await db.collection('_stock')
            .where({
                "stocks.code": request.code
            })
            .update({
                data: data
            })
    } else {
        return {
            errMsg: response.data.resultmsg || "无法获取数据"
        }
    }
}

/**
 *      港股
 */
async function grabHKBalanceSheet(request) {
    const token = await getCNInfoAPIOauthToken()
    const response = await AXIOS.get(UTIL.format(URL.CNINFO_STOCK_HK_BALANCE_SHEET, request.code, token.access_token))
    console.log(response)
    return 'DONE'
}

/**
 *      获取过去一年内A股市场的股票账户数
 */
async function market() {
    const oneYearAgo = MOMENT().subtract(1, 'years')
    const monthRange = []
    const theLastMonth = await db.collection('_market').orderBy('_id', 'desc').limit(1).get()
    console.log(theLastMonth)
    //  取最近一月数据，并与过去五年同期相比较
    if (theLastMonth.data && theLastMonth.data.length > 0) {
        let day = MOMENT(theLastMonth.data[0]._id, 'YYYY.MM')
        //  月范围
        while (day.isAfter(oneYearAgo)) {
            monthRange.push(day.format('YYYY.MM'))
            day = day.subtract(1, 'months')
        }

        return await db.collection('_market')
            .where({
                _id: _.in(monthRange)
            })
            .orderBy('_id', 'asc')
            .get()
    } else {
        return {
            errMsg: "暂无数据"
        }
    }
}

/**
 *      添加/移除自选股
 */
async function follow(request) {
    return await db.collection('_stock')
        .where({
            "stocks.code": request.code
        })
        .update({
            data: {
                "stocks.$.follow": request.follow
            }
        })
}

/**
 *      手动更新单支股票信息
 */
async function manual(request) {
    return await db.collection('_stock')
        .where({
            "stocks.code": request.code
        })
        .update({
            data: {
                "stocks.$.balance": request.balance,
                "stocks.$.cashflow": request.cashflow,
                "stocks.$.profit": request.profit,
                "stocks.$.indicators": request.indicators
            }
        })
}

/**
 *      刷新上市公司三张财务报表
 */
async function refresh(request) {
    console.log("refresh >>> ", request)
    switch (request.market) {
        case "SHEN ZHEN":
        case "SHANG HAI":
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_BALANCE_SHEET, "stocks.$.balance") //  资产负债表
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_PROFIT_STATEMENT, "stocks.$.profit") //  利润表
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_CASH_FLOW_STATEMENT, "stocks.$.cashflow") //  现金流量表
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_INDICATORS, "stocks.$.indicators") //  指标表
            break;
        default:
            break;
    }

    return 'DONE'
}

/**
 *      刷新上市公司股本股东
 */
async function shareholder(request) {
    console.log("shareholder >>> ", request)
    switch (request.market) {
        case "SHEN ZHEN":
        case "SHANG HAI":
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_SHARE_PLEDGE, "stocks.$.pledge") //  股权质押
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_FLOAT_HOLDER, "stocks.$.holder") //  十大流通股东持股情况
            break;
        default:
            break;
    }

    return 'DONE'
}

/**
 *      刷新上市公司分红募资情况
 */
async function fund(request) {
    console.log("fund >>> ", request)
    switch (request.market) {
        case "SHEN ZHEN":
        case "SHANG HAI":
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_FUND_SOURCE, "stocks.$.fund") //  募集资金来源
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_INVESTMENT, "stocks.$.investment") //  募集资金计划投资项目
            break;
        default:
            break;
    }

    return 'DONE'
}

/**
 *      刷新上市公司重大事项
 */
async function issue(request) {
    console.log("issue >>> ", request)
    switch (request.market) {
        case "SHEN ZHEN":
        case "SHANG HAI":
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_AUDIT, "stocks.$.audit") //  审计意见
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_EXTERNAL_GUARANTEE, "stocks.$.guarantee") //  对外担保
            await grabStockInfo(request, URL.CNINFO_STOCK_HS_PUNISHMENT, "stocks.$.punishment") //  公司受处罚表
            break;
        default:
            break;
    }

    return 'DONE'
}

/**
 *  返回所有原则
 */
async function principle(request) {
    return await db.collection('_principle')
        .where({
            "status": 1
        })
        .orderBy("index", "asc")
        .get()
}

/**
 *  更新评分
 */
async function score(request) {
    return await db.collection('_stock')
        .where({
            "_id": request.market,
            "stocks.code": request.code
        })
        .update({
            data: {
                "stocks.$.principle": request.principle
            }
        })
}

/**
 *  交易日记
 */
async function note(request) {
    const _id = request._id || request.code + new Date().getTime()
    return await db.collection('_note')
        .doc(_id)
        .set({
            data: {
                "code": request.code,
                "type": request.type,
                "summary": request.summary,
                "price": request.price,
                "count": request.count,
                "transaction": request.transaction,
                "expiration": request.expiration,
                "range": request.range,
                "addTime": new Date()
            }
        })
}


module.exports = {
    grabStockAccountNumber,
    grabMarketStocksTask,
    grabMarketStocks,
    grabHKBalanceSheet,
    market,
    follow,
    manual,
    refresh,
    shareholder,
    fund,
    issue,
    principle,
    score,
    note
}