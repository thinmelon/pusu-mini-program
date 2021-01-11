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
 *      消费者信心指数月度统计
 */
async function grabCCIData(request) {
    return await update(URL.CNINFO_MACRO_CCI, '_macro', (rawData) => {
        return {
            "consumerExpectationIndex": rawData.F003N,
            "consumerSatisfactionIndex": rawData.F004N,
            "consumerConfidenceIndex": rawData.F005N
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
 *      全国消费品零售总额综合数据（月度）
 */
async function grabTotalRetailSales(request) {
    return await update(URL.CNINFO_MACRO_RETAIL_SALES, '_macro', (rawData) => {
        return {
            "retailSales": rawData.F004N,
            "retailSalesYearOnYear": rawData.F005N
        }
    })
}

/**
 *      全国进出口贸易数据（月度）
 */
async function grabImportsExportsBalance(request) {
    return await update(URL.CNINFO_MACRO_IMPORTS_EXPORTS_BALANCE,
        '_macro',
        (rawData) => {
            return {
                "importsExportsBalanceMonthly": rawData.F004N,
                "importsExportsBalanceTotal": rawData.F007N
            }
        },
        'C0305')
}

/**
 *  如果返回结果中存在上个月数据，比对数据库，存在则更新，不存在则添加
 */
async function update(url, collection, factory, options) {
    const lastMonth = MOMENT().subtract(1, 'months')
    const year = lastMonth.year()
    const month = lastMonth.month() + 1
    console.log('上个月：', year, month)

    const token = await COMMON.getCNInfoAPIOauthToken()
    const response = await AXIOS.get(options ?
        UTIL.format(url, token.access_token, year, month, options) :
        UTIL.format(url, token.access_token, year, month))
    // console.log(response)

    if (response.status === 200 && response.data.resultmsg === "success") {
        const target = response.data.records.filter(item => {
            return item.YEAR === year && item.MONTH === month;
        })

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
 *  社会融资规模存量统计表（存量及增速）
 */
async function grabFinancingAggregate(request) {
    //  中国人民银行官网设置反爬虫，需要在headers中添加Cookie访问，Cookie值需要实时更新，在官网的F12中查看
    const response = await AXIOS.get(
        'http://www.pbc.gov.cn/diaochatongjisi/resource/cms/2020/12/2020121416212449196.htm', {
            withCredentials: true,
            headers: {
                'Cookie': 'wzws_cid=ff090a254f80fb65d5c26d5a9be868facf696c231907b68c84ce50a22fb729331df026be39f56dbbadbd1144689fe5d0ef2c71bc971c889edc7319c09666a6acb4665e040bf1297d7fd59e5bed3c5473',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36'
            }
        }
    );
    // console.log(response.data)
    const $ = CHEERIO.load(response.data, {
        xml: {
            normalizeWhitespace: true
        }
    });
    const target = $('table tr');
    const lastMonth = MOMENT().subtract(1, 'months').format('YYYY.MM')

    for (let i = 1; i <= 12; i++) {
        const month = MOMENT(target.eq(4).children('td').eq(i).text().trim().replace(/&nbsp;/g, ""), 'YYYY.M').format('YYYY.MM')
        console.log(month, lastMonth)
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
 *  社会融资规模增量统计表（含人民币贷款、政府债券、非金融企业境内股票融资等细项）
 */
async function grabFinancingAggregateFlow(request) {
    const response = await AXIOS.get(
        'http://www.pbc.gov.cn/diaochatongjisi/resource/cms/2020/11/2020111616044569755.htm', {
            withCredentials: true,
            headers: {
                'Cookie': 'wzws_cid=45bc11bfada4c23fc3ed3c87df38393febff58978182f74d567d5e9130fddcc63aa1f891cc84a84276731e05d7c2f2231a52d1497c84a6ef561d50b8f3c0dc429f2d2f2ef30618fd3240f047fdaffe06',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Mobile Safari/537.36'
            }
        }
    );
    // console.log(response.data)
    const $ = CHEERIO.load(response.data, {
        xml: {
            normalizeWhitespace: true
        }
    });
    const target = $('table tr');
    const lastMonth = MOMENT().subtract(1, 'months').format('YYYY.MM')

    for (let i = 7; i <= 18; i++) {
        const month = MOMENT(target.eq(i).children('td').eq(0).text().trim().replace(/&nbsp;/g, ""), 'YYYY.M').format('YYYY.MM')
        console.log(month, lastMonth)
        if (month === lastMonth) {
            //  社会融资规模增量
            const financingAggregateFlow = parseFloat(target.eq(i).children('td').eq(1).text().trim().replace(/&nbsp;/g, ""))
            if (financingAggregateFlow) {
                //  人民币贷款
                const RMBLoans = parseFloat(target.eq(i).children('td').eq(2).text().trim().replace(/&nbsp;/g, ""))
                //  企业债券
                const corporateBonds = parseFloat(target.eq(i).children('td').eq(7).text().trim().replace(/&nbsp;/g, ""))
                //  政府债券
                const governmentBonds = parseFloat(target.eq(i).children('td').eq(8).text().trim().replace(/&nbsp;/g, ""))
                //  非金融企业境内股票融资
                const equityFinancingOnStockMarket = parseFloat(target.eq(i).children('td').eq(9).text().trim().replace(/&nbsp;/g, ""))
                const data = {
                    financingAggregateFlow,
                    RMBLoans,
                    corporateBonds,
                    governmentBonds,
                    equityFinancingOnStockMarket
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
    await grabCCIData()
    await grabMoneySupply()
    await grabTotalRetailSales()
    await grabImportsExportsBalance()

    return 'DONE'
}

/**
 *      增量更新社融数据（手动）
 *  
 *  社融指实体经济从金融体系拿到的钱，可以作为GDP的前置指标，因为资本可以作为GDP的驱动因素之一
 */
async function manual() {
    await grabFinancingAggregate()
    await grabFinancingAggregateFlow()

    return 'DONE'
}

module.exports = {
    refresh,
    manual,
    grabCPIData,
    grabPMIData,
    grabPPIData,
    grabCCIData,
    grabMoneySupply,
    grabTotalRetailSales,
    grabImportsExportsBalance,
    grabFinancingAggregate,
    grabFinancingAggregateFlow
}