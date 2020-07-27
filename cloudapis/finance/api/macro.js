const UTIL = require('util')
const AXIOS = require('axios')
const MOMENT = require('moment')
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
 *      增量更新宏观数据
 */
async function refresh() {
    await grabCPIData()
    await grabPMIData()
    await grabPPIData()
    await grabMoneySupply()

    return 'DONE'
}

module.exports = {
    refresh,
    grabCPIData,
    grabPMIData,
    grabPPIData,
    grabMoneySupply,
}