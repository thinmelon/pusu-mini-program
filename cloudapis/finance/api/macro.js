const UTIL = require('util')
const AXIOS = require('axios')
const MOMENT = require('moment')
const CHEERIO = require('cheerio')
const CLOUD = require('wx-server-sdk')
const URL = require('../utils/url.js')
const COMMON = require('../utils/common.js')

//  初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

//  可在入口函数外缓存 db 对象
const db = CLOUD.database()

/**
 *      全国居民消费价格指数
 */
async function grabCPIData() {

    return await update(URL.CNINFO_MACRO_CPI, '_macro', (rawData) => {
        return {
            "cpiYearOnYear": rawData.F007N,
            "cpiMonthOnMonth": rawData.F004N,
            "cpiCityYearOnYear": rawData.F008N,
            "cpiCityMonthOnMonth": rawData.F005N,
            "cpiCountryYearOnYear": rawData.F009N,
            "cpiCountryMonthOnMonth": rawData.F006N
        }
    })
}

/**
 *      采购经理指数（月度）
 */
async function grabPMIData(request) {
    return await update(URL.CNINFO_MACRO_PMI, '_macro', (rawData) => {
        return {
            "purchasingManagersIndex": rawData.F003N, //   采购经理指数
            "productionIndex": rawData.F004N, //  生产指数
            "newOrdersIndex": rawData.F005N, // 新订单指数
            "newExportOrdersIndex": rawData.F006N, //  新出口订单指数
            "backlogOrdersIndex": rawData.F007N, //  积压订单指数
            "manufacturedInventoryIndex": rawData.F008N, //  产成品库存指数
            "purchasedIndex": rawData.F009N, //  采购量指数
            "importIndex": rawData.F010N, //  进口指数
            "purchasingPriceIndex": rawData.F011N, //  购进价格指数
            "rawMaterialsInventoryIndex": rawData.F012N, //  原材料库存指数
            "employeeIndex": rawData.F013N, //  从业人员指数
            "supplierDeliveryIndex": rawData.F014N, //  供应商配送时间
            "cycleActionIndex": rawData.F015N, //  周期活动指数
        }
    })
}

/**
 *      工业生产者出厂价格指数
 */
async function grabPPIData(request) {
    return await update(URL.CNINFO_MACRO_PPI, '_macro', (rawData) => {
        return {
            "ppiYearOnYear": rawData.F005N, //   全国同比
        }
    })
}

/**
 *      货币供应量月度统计表
 */
async function grabMoneySupply(request) {
    return await update(URL.CNINFO_MACRO_MONEY_SUPPLY, '_money', (rawData) => {
        return {
            "M0": rawData.F002N,
            "M0YearOnYear": rawData.F003N,
            "M1": rawData.F004N,
            "M1YearOnYear": rawData.F005N,
            "M2": rawData.F006N,
            "M2YearOnYear": rawData.F007N
        }
    })
}

/**
 *  如果返回结果中存在上个月数据，比对数据库，存在则更新，不存在则添加
 */
async function update(url, collection, factory) {
    const token = await COMMON.getCNInfoAPIOauthToken()
    const response = await AXIOS.get(UTIL.format(url, token.access_token))
    console.log(response)

    const lastMonth = MOMENT().subtract(1, 'months')
    const year = lastMonth.year()
    const month = lastMonth.month() + 1
    console.log('上个月：', year, month)

    if (response.status === 200 && response.data.resultmsg === "success") {
        const target = response.data.records.filter(item => {
            return item.YEAR === year && item.MONTH === month;
        })
        console.log(target)

        if (target.length === 1) {
            const _id = MOMENT(`${target[0].YEAR}.${target[0].MONTH}`, 'YYYY-M').format('YYYY.MM')
            const data = factory(target[0])
            const result = await db.collection(collection)
                .where({
                    "_id": _id
                })
                .limit(1)
                .get()
            console.log(_id, result)

            if (result.data && result.data.length > 0) {
                await db.collection(collection)
                    .doc(_id)
                    .update({
                        data
                    })
                return "Update"
            } else {
                await db.collection(collection)
                    .doc(_id)
                    .set({
                        data
                    })
                return "Add"
            }
        }

    } else {
        return {
            errMsg: "无法获取数据"
        }
    }
}

/**
 *  社会融资规模存量统计表（存量及增量数据）
 */
async function grabFinancingAggregate(request) {
    //  中国人民银行官网设置反爬虫，需要在headers中添加Cookie访问，Cookie值需要实时更新，在官网的F12中查看
    const response = await AXIOS.get(
        'http://www.pbc.gov.cn/diaochatongjisi/resource/cms/2020/08/2020081415420479749.htm', {
            withCredentials: true,
            headers: {
                'Cookie': 'wzws_cid=ab7c5f7c5a3cfbc9a26e20c5836b701835e64e29f1ffbf7204820b383c6f9de59b757eaea6c46f88a8cfe1bcca9f9ac1ccbef814e38c98962065d88e1cab9a352d81d9f0945d2d335c48580d1987656c',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9;',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
            }
        }
    );
    const $ = CHEERIO.load(response.data, {
        xml: {
            normalizeWhitespace: true
        }
    });
    const target = $('table tr');
    const lastMonth = MOMENT().subtract(1, 'months').format('YYYY.MM')

    for (let i = 1; i <= 12; i++) {
        const month = MOMENT(target.eq(4).children('td').eq(i).text().trim().replace(/&nbsp;/g, ""), 'YYYY.M').format('YYYY.MM')
        // console.log(month, lastMonth)
        //  解析上一个月的数据，更新至数据库中
        if (month === lastMonth) {
            //  社会融资规模存量
            const financingAggregateStock = parseFloat(target.eq(8).children('td').eq(2 * i - 1).text().trim().replace(/&nbsp;/g, ""))
            //  社会融资规模增速
            const financingAggregateGrowthRate = parseFloat(target.eq(8).children('td').eq(2 * i).text().trim().replace(/&nbsp;/g, ""))
            //  数据不存在，则中止
            if (financingAggregateStock) {
                const data = {
                    financingAggregateStock,
                    financingAggregateGrowthRate
                }
                console.log(data)

                const record = await db.collection('_money').where({
                    "_id": month
                }).get()

                if (record.data && record.data.length > 0) {
                    await db.collection('_money')
                        .doc(month)
                        .update({ //  更新
                            data
                        })
                } else {
                    await db.collection('_money')
                        .doc(month)
                        .set({ //  添加
                            data
                        })
                }

            }

            break;
        }
    }

    return 'DONE'
}

/**
 *      增量更新宏观数据
 */
async function refresh() {
    await grabCPIData()
    await grabPMIData()
    await grabPPIData()
    await grabMoneySupply()
    await grabFinancingAggregate()

    return 'DONE'
}

module.exports = {
    refresh,
    grabCPIData,
    grabPMIData,
    grabPPIData,
    grabMoneySupply,
    grabFinancingAggregate
}