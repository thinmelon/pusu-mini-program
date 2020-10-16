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
 *      全国工业主要产品产量及增长速度
 */
async function grabIndustrialProductsOutput(request) {
    return await update(URL.CNINFO_MACRO_INDUSTRIAL_PRODUCTS, '_products',
        [(item) => {
            return item.F002V === 'I030167' //  手机
        }, (item) => {
            return item.F002V === 'I030164' //  彩色电视机
        }, (item) => {
            return item.F002V === 'I030147' //  汽车
        }, (item) => {
            return item.F002V === 'I030126' //  水泥
        }, (item) => {
            return item.F002V === 'I030163' //  集成电路
        }, (item) => {
            return item.F002V === 'I030159' //  基站设备
        }],

        [(rawData) => {
            return {
                "mobileMonthlyYearToYear": rawData.F007N, //  本月数同比
                "mobileGrandYearToYear": rawData.F008N //  本年累计数同比
            }
        }, (rawData) => {
            return {
                "tvMonthlyYearToYear": rawData.F007N,
                "tvGrandYearToYear": rawData.F008N
            }
        }, (rawData) => {
            return {
                "carMonthlyYearToYear": rawData.F007N,
                "carGrandYearToYear": rawData.F008N
            }
        }, (rawData) => {
            return {
                "cementMonthlyYearToYear": rawData.F007N,
                "cementGrandYearToYear": rawData.F008N
            }
        }, (rawData) => {
            return {
                "integratedCircuitMonthlyYearToYear": rawData.F007N,
                "integratedCircuitGrandYearToYear": rawData.F008N
            }
        }, (rawData) => {
            return {
                "baseStationMonthlyYearToYear": rawData.F007N,
                "baseStationGrandYearToYear": rawData.F008N
            }
        }])
}

/**
 *      全国房地产建设与销售
 */
async function grabRealEstateConstructionAndSales(request) {
    return await update(URL.CNINFO_MACRO_REAL_ESTATE, '_products',
        [(item) => {
            return item.F003V === '商品住宅' && item.F006N;
        }, (item) => {
            return item.F003V === '商品房' && item.F010N && item.F013N;
        }],
        [(rawData) => {
            return {
                "newHousingSpace": rawData.F006N //  累计本年新开工面积
            }
        }, (rawData) => {
            return {
                "housingSalesArea": rawData.F010N, //  累计销售面积
                "housingSales": rawData.F013N //  累计销售额
            }
        }])
}

/**
 *  如果返回结果中存在上个月数据，比对数据库，存在则更新，不存在则添加
 */
async function update(url, collection, filter, factory) {
    const lastMonth = MOMENT().subtract(1, 'months')
    const year = lastMonth.year()
    const month = lastMonth.month() + 1
    console.log('上个月：', year, month)

    const token = await COMMON.getCNInfoAPIOauthToken()
    const response = await AXIOS.get(UTIL.format(url, token.access_token, year, month))
    console.log(response)

    if (response.status === 200 && response.data.resultmsg === "success") {
        for (let i = 0; i < filter.length; i++) {
            const target = response.data.records.filter(filter[i])
            console.log(target)

            if (target.length === 1) {
                const _id = MOMENT(`${target[0].YEAR}.${target[0].MONTH}`, 'YYYY-M').format('YYYY.MM')
                const data = factory[i](target[0])
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
                } else {
                    await db.collection(collection)
                        .doc(_id)
                        .set({
                            data
                        })
                }
            }
        }

        return "Done"

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
    await grabIndustrialProductsOutput()
    await grabRealEstateConstructionAndSales()

    return 'DONE'
}


module.exports = {
    refresh,
    grabIndustrialProductsOutput,
    grabRealEstateConstructionAndSales
}