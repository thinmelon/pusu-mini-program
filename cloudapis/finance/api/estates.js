const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')
const cloud = require('wx-server-sdk')
const url = require('../utils/url.js')


// 初始化 cloud
cloud.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

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
    const today = day.date()
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

async function main(request) {
    try {
        const response = await axios.get(url.HOUSE_CONTRACT_STATISTICS)

        if (response.status === 200) {
            const $ = cheerio.load(response.data, {
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
            //  抓取不同县区可售楼盘的统计数据
            const chengxiang = grabDistrictContractStatistic($('table').eq(1).children().eq(2))
            const licheng = grabDistrictContractStatistic($('table').eq(1).children().eq(3))
            const hanjiang = grabDistrictContractStatistic($('table').eq(1).children().eq(4))
            const xiuyu = grabDistrictContractStatistic($('table').eq(1).children().eq(5))
            console.log(chengxiang)
            console.log(licheng)
            console.log(hanjiang)
            console.log(xiuyu)

            //  今天，昨天，本月，上月
            const today = moment()
            const yesterday = moment().subtract(1, 'days')
            const thisMonth = moment().format('YYYY.MM')
            const lastMonth = moment().subtract(1, 'months').format('YYYY.MM')

            /**
             *  更新月商品房签约数据（总签约数、住宅签约数、总签约面积、住宅签约面积）
             */
            await updateMonthContractStatistic(thisMonth, thisStatistic) //  本月
            await updateMonthContractStatistic(lastMonth, lastStatistic) //  上月

            /**
             *  更新每日商品房签约数据（总签约数、住宅签约数、总签约面积、住宅签约面积）
             *  以及每日各县区的可售楼盘数量及成交量
             */
            return await updateDayContractStatistic(today, thisStatistic, chengxiang, licheng, hanjiang, xiuyu) //  今天
            return await updateDayContractStatistic(yesterday, lastStatistic) //  昨天
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

module.exports = {
    main
}