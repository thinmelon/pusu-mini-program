const AXIOS = require('axios')
const CHEERIO = require('cheerio')
const MOMENT = require('moment')
const CLOUD = require('wx-server-sdk')
const URL = require('../../utils/url.js')


// 初始化 cloud
CLOUD.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = CLOUD.database()

// 数据库查询更新指令对象
const _ = db.command
const $ = db.command.aggregate

/**
 *      抓取商品房签约统计数据
 */
function grabHousingContractStatistic(target1) {
    const children = target1.children();

    //  月签约套数
    let monthTotalContract = children.eq(1).text()
    monthTotalContract = parseInt(monthTotalContract.substr(0, monthTotalContract.length - 1).trim())

    //  月签约住宅套数
    let monthHousingContract = children.eq(2).text()
    monthHousingContract = parseInt(monthHousingContract.substr(0, monthHousingContract.length - 1).trim())

    //  月签约面积
    let monthTotalArea = parseFloat(children.eq(3).text())

    //  月签约住宅面积
    let monthHousingArea = parseFloat(children.eq(4).text())

    //  日签约套数
    let dayTotalContract = children.eq(6).text()
    dayTotalContract = parseInt(dayTotalContract.substr(0, dayTotalContract.length - 1).trim())

    //  日签约住宅套数
    let dayHousingContract = children.eq(7).text()
    dayHousingContract = parseInt(dayHousingContract.substr(0, dayHousingContract.length - 1).trim())

    //  日签约面积
    let dayTotalArea = parseFloat(children.eq(8).text())

    //  日签约住宅面积
    let dayHousingArea = parseFloat(children.eq(9).text())

    return {
        monthTotalContract,
        monthHousingContract,
        monthTotalArea,
        monthHousingArea,
        dayTotalContract,
        dayHousingContract,
        dayTotalArea,
        dayHousingArea
    }
}

/**
 *      抓取各县区可售楼盘数量及成交数据
 */
function grabDistrictContractStatistic(element) {
    const children = element.children()
    const totalProjects = parseInt(children.eq(1).text())
    const housingProjects = parseInt(children.eq(2).text())
    const availableTotalEstates = parseInt(children.eq(3).text())
    const availableHousingEstates = parseInt(children.eq(4).text())
    const availableTotalArea = parseFloat(children.eq(5).text())
    const availableHousingArea = parseFloat(children.eq(6).text())
    const todayTotalDeal = parseInt(children.eq(7).text())
    const todayHousingDeal = parseInt(children.eq(8).text())
    const todayTotalDealArea = parseFloat(children.eq(9).text())
    const todayHousingDealArea = parseFloat(children.eq(10).text())

    return {
        totalProjects,
        housingProjects,
        availableTotalEstates,
        availableHousingEstates,
        availableTotalArea,
        availableHousingArea,
        todayTotalDeal,
        todayHousingDeal,
        todayTotalDealArea,
        todayHousingDealArea
    }
}

/**
 *      更新月商品房成交数据
 */
async function updateMonthContractStatistic(month, statistic) {
    const ret = await db.collection('_daily')
        .where({
            "_id": month
        })
        .get()
    const data = {
        "monthTotalContract": statistic.monthTotalContract,
        "monthHousingContract": statistic.monthHousingContract,
        "monthTotalArea": statistic.monthTotalArea,
        "monthHousingArea": statistic.monthHousingArea
    }

    if (ret.data && ret.data.length > 0) {
        await db.collection('_daily')
            .doc(month)
            .update({
                data: data
            })
    } else {
        data._id = month;
        await db.collection('_daily')
            .add({
                data: data
            })
    }
}

/**
 *      更新每日商品房签约数据以及每日各县区的可售楼盘数量及成交量
 */
async function updateDayContractStatistic(day, statistic, ...districts) {
    let ret3, data1, data2;
    const today = day.format('YYYY-MM-DD')
    const thisMonth = day.format('YYYY.MM')
    const ret2 = await db.collection('_daily')
        .where({
            "_id": thisMonth,
            "day.date": today
        })
        .get()

    if (districts.length === 4) {
        data1 = {
            "day.$.dayTotalContract": statistic.dayTotalContract,
            "day.$.dayHousingContract": statistic.dayHousingContract,
            "day.$.dayTotalArea": statistic.dayTotalArea,
            "day.$.dayHousingArea": statistic.dayHousingArea,
            "day.$.chengxiang": districts[0],
            "day.$.licheng": districts[1],
            "day.$.hanjiang": districts[2],
            "day.$.xiuyu": districts[3]
        }

        data2 = {
            "date": today,
            "dayTotalContract": statistic.dayTotalContract,
            "dayHousingContract": statistic.dayHousingContract,
            "dayTotalArea": statistic.dayTotalArea,
            "dayHousingArea": statistic.dayHousingArea,
            "chengxiang": districts[0],
            "licheng": districts[1],
            "hanjiang": districts[2],
            "xiuyu": districts[3]
        }
    } else {
        data1 = {
            "day.$.dayTotalContract": statistic.dayTotalContract,
            "day.$.dayHousingContract": statistic.dayHousingContract,
            "day.$.dayTotalArea": statistic.dayTotalArea,
            "day.$.dayHousingArea": statistic.dayHousingArea
        }

        data2 = {
            "date": today,
            "dayTotalContract": statistic.dayTotalContract,
            "dayHousingContract": statistic.dayHousingContract,
            "dayTotalArea": statistic.dayTotalArea,
            "dayHousingArea": statistic.dayHousingArea
        }
    }

    if (ret2.data && ret2.data.length > 0) {
        ret3 = await db.collection('_daily')
            .where({
                "_id": thisMonth,
                "day.date": today
            })
            .update({
                data: data1
            })
    } else {
        ret3 = await db.collection('_daily')
            .doc(thisMonth)
            .update({
                data: {
                    day: _.push(data2)
                }
            })
    }

    return ret3

}

/**
 *      更新商品房签约统计数据
 */
async function updateContractStatistic() {
    try {
        const response = await AXIOS.get(URL.HOUSE_CONTRACT_STATISTICS)

        if (response.status === 200) {
            const $ = CHEERIO.load(response.data, {
                xml: {
                    normalizeWhitespace: true
                }
            });

            //  抓取商品房签约的统计数据（本月、今日、上月、昨日）
            const target1 = $('table').eq(0).children().eq(3)
            const target2 = $('table').eq(0).children().eq(7)

            if (target1.children().length === 0 || target2.children().length === 0) {
                return {
                    errMsg: "暂无数据更新！"
                }
            }

            const thisStatistic = grabHousingContractStatistic(target1)
            const lastStatistic = grabHousingContractStatistic(target2)
            console.log(thisStatistic)
            console.log(lastStatistic)
            // //  抓取不同县区可售楼盘的统计数据
            // const chengxiang = grabDistrictContractStatistic($('table').eq(1).children().eq(2))
            // const licheng = grabDistrictContractStatistic($('table').eq(1).children().eq(3))
            // const hanjiang = grabDistrictContractStatistic($('table').eq(1).children().eq(4))
            // const xiuyu = grabDistrictContractStatistic($('table').eq(1).children().eq(5))
            // console.log(chengxiang)
            // console.log(licheng)
            // console.log(hanjiang)
            // console.log(xiuyu)

            //  今天，昨天，本月，上月
            const today = MOMENT()
            const yesterday = MOMENT().subtract(1, 'days')
            const thisMonth = MOMENT().format('YYYY.MM')
            const lastMonth = MOMENT().subtract(1, 'months').format('YYYY.MM')

            /**
             *  更新月商品房签约数据（总签约数、住宅签约数、总签约面积、住宅签约面积）
             */
            await updateMonthContractStatistic(thisMonth, thisStatistic) //  本月
            await updateMonthContractStatistic(lastMonth, lastStatistic) //  上月

            /**
             *  更新每日商品房签约数据（总签约数、住宅签约数、总签约面积、住宅签约面积）
             *  以及每日各县区的可售楼盘数量及成交量
             */
            // return await updateDayContractStatistic(today, thisStatistic, chengxiang, licheng, hanjiang, xiuyu) //  今天
            await updateDayContractStatistic(today, thisStatistic) //  今天
            await updateDayContractStatistic(yesterday, lastStatistic) //  昨天

            return 'DONE'
        } else {
            return {
                errMsg: "无法获取到数据！"
            }
        }
    } catch (err) {
        console.error(err)
        return err
    }
}

/**
 *      统计各县区成交量
 */
async function getDistrictDealStatistic() {
    return db
        .collection('_project')
        .aggregate()
        .group({
            // 按 district 字段分组
            _id: '$district',
            // 聚合操作符。计算并且返回该县区内所有不同字段的总和
            availableNumberHousing: $.sum('$availableNumberHousing'),
            availableAreaHousing: $.sum('$availableAreaHousing'),
            availableNumberBusiness: $.sum('$availableNumberBusiness'),
            availableAreaBusiness: $.sum('$availableAreaBusiness'),
            availableNumberOffice: $.sum('$availableNumberOffice'),
            availableAreaOffice: $.sum('$availableAreaOffice'),
            availableNumberGarage: $.sum('$availableNumberGarage'),
            availableAreaGarage: $.sum('$availableAreaGarage'),
            availableNumberOther: $.sum('$availableNumberOther'),
            availableAreaOther: $.sum('$availableAreaOther'),

            soldNumberHousing: $.sum('$soldNumberHousing'),
            soldAreaHousing: $.sum('$soldAreaHousing'),
            soldNumberBusiness: $.sum('$soldNumberBusiness'),
            soldAreaBusiness: $.sum('$soldAreaBusiness'),
            soldNumberOffice: $.sum('$soldNumberOffice'),
            soldAreaOffice: $.sum('$soldAreaOffice'),
            soldNumberGarage: $.sum('$soldNumberGarage'),
            soldAreaGarage: $.sum('$soldAreaGarage'),
            soldNumberOther: $.sum('$soldNumberOther'),
            soldAreaOther: $.sum('$soldAreaOther')
        })
        .end()
}

/**
 *      统计各县区成交均价
 */
async function getDistrictAveragePriceStatistic() {
    return await db.collection('_project')
        .aggregate()
        .project({
            district: "$district",
            averagePriceHousing: $.avg("$buildings.averagePriceHousing"),
            averagePriceBusiness: $.avg("$buildings.averagePriceBusiness"),
            averagePriceOffice: $.avg("$buildings.averagePriceOffice"),
            averagePriceGarage: $.avg("$buildings.averagePriceGarage"),
            averagePriceOther: $.avg("$buildings.averagePriceOther")
        })
        .group({
            _id: '$district',
            averagePriceHousing: $.avg("$averagePriceHousing"), //  住宅
            averagePriceBusiness: $.avg("$averagePriceBusiness"), //  商业
            averagePriceOffice: $.avg("$averagePriceOffice"), //  写字楼
            averagePriceGarage: $.avg("$averagePriceGarage"), //  车库
            averagePriceOther: $.avg("$averagePriceOther") //  其它
        })
        .end()
}

/**
 *      合并各县区的成交量及成交均价数据
 */
async function statistic() {
    const markets = await getDistrictDealStatistic()
    const averagePrice = await getDistrictAveragePriceStatistic()
    //  合并返回数据
    return markets.list.map(market => {
        for (let i = 0; i < averagePrice.list.length; i++) {
            if (averagePrice.list[i]._id === market._id) {
                Object.assign(market, averagePrice.list[i])
                break;
            }
        }
        return market
    })
}

/**
 *      更新每天县区统计数据
 */
async function updateDayDistrictStatistic(day) {
    const today = day.format('YYYY-MM-DD')
    const thisMonth = day.format('YYYY.MM')
    const market = await statistic()
    const ret1 = await db.collection('_daily')
        .where({
            "_id": thisMonth
        })
        .get()
    const data = {
        "date": today,
        "chengxiang": market.find(item => {
            return item._id === '城厢区'
        }),
        "licheng": market.find(item => {
            return item._id === '荔城区'
        }),
        "hanjiang": market.find(item => {
            return item._id === '涵江区'
        }),
        "xiuyu": market.find(item => {
            return item._id === '秀屿区'
        })
    }
    console.log(today, ' >>> ', market)

    let ret3;
    if (ret1.data && ret1.data.length > 0) {
        const ret2 = await db.collection('_daily')
            .where({
                "_id": thisMonth,
                "day.date": today
            })
            .get()


        if (ret2.data && ret2.data.length > 0) {
            ret3 = await db.collection('_daily')
                .where({
                    "_id": thisMonth,
                    "day.date": today
                })
                .update({
                    data: {
                        "day.$.chengxiang": market.find(item => {
                            return item._id === '城厢区'
                        }),
                        "day.$.licheng": market.find(item => {
                            return item._id === '荔城区'
                        }),
                        "day.$.hanjiang": market.find(item => {
                            return item._id === '涵江区'
                        }),
                        "day.$.xiuyu": market.find(item => {
                            return item._id === '秀屿区'
                        })
                    }
                })
        } else {
            ret3 = await db.collection('_daily')
                .doc(thisMonth)
                .update({
                    data: {
                        day: _.push(data)
                    }
                })
        }
    } else {
        ret3 = await db.collection('_daily')
            .doc(thisMonth)
            .set({
                data: {
                    day: [data]
                }
            })
    }

    console.log(ret3)

    return ret3;
}

/**
 *      历史数据
 */
async function history() {
    const oneMonthAgo = MOMENT().subtract(1, 'months')
    const twentyDaysAgo = MOMENT().subtract(20, 'days')
    const monthRange = []
    const dayRange = []

    let day = MOMENT()
    //  月范围
    while (day.isAfter(oneMonthAgo)) {
        monthRange.push(day.format('YYYY.MM'))
        day = day.subtract(1, 'months').add(1, 'days')
    }

    day = MOMENT()
    //  日范围
    while (day.isAfter(twentyDaysAgo)) {
        dayRange.push(day.format('YYYY-MM-DD'))
        day = day.subtract(1, 'days')
    }

    console.log(monthRange)
    console.log(dayRange)

    return await db.collection('_daily')
        .aggregate()
        .match({
            _id: _.in(monthRange)
        })
        .project({
            _id: 0,
            day: $.filter({
                input: '$day',
                as: 'item',
                cond: $.in(['$$item.date', dayRange])
            })
        })
        .unwind('$day')
        .end()
}

/**
 *      关注项目信息
 */
async function follow(request) {
    return await db.collection('_project')
        .doc(request.projectID)
        .update({
            data: {
                follow: request.follow
            }
        })
}

module.exports = {
    updateContractStatistic,
    updateDayDistrictStatistic,
    history,
    follow
}