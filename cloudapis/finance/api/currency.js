const UTIL = require('util')
const AXIOS = require('axios')
const CLOUD = require('wx-server-sdk')
const URL = require('../utils/url.js')
const CONFIG = require('../utils/config.js')

// 初始化 cloud
CLOUD.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = CLOUD.database()

/**
 *          实时货币汇率查询换算
 * 
 * 数据仅供参考，交易时以银行柜台成交价为准
 * 数据来源： 聚合数据
 * 网址：https://www.juhe.cn/
 */
async function queryCurrencyExchange(request) {
    console.log("queryCurrencyExchange", request)
    const url = UTIL.format(
        URL.JUHE_CURRENCY_EXCHANGE,
        CONFIG.JUHE_CURRENCY_APP_KEY,
        request.from || "USD",
        request.to || "CNY");
    console.log(url)
    const result = await AXIOS.get(url)

    if (result.data.error_code === 0) {
        return result.data.result
    } else {
        return {
            errMsg: result.data.reason
        }
    }
}

async function main(request) {
    return queryCurrencyExchange(request)
}

module.exports = {
    main
}