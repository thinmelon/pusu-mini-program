const UTIL = require('util')
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

const TOP_NUM_MONTH_SELL = 5
const TOP_NUM_PRE_SELL = 10
const TOP_AVAILABLE = 5

/**
 *      抓取商品住宅销售排行榜
 */
async function grabTopMonthSell(request) {
    try {
        const response = await AXIOS.get(URL.TOP_MONTH_SELL)
        // console.log(response)

        if (response.status === 200) {
            const $ = CHEERIO.load(response.data, {
                xml: {
                    normalizeWhitespace: true
                }
            });

            const topMonthSell = []
            for (let i = 1, length = request.top || TOP_NUM_MONTH_SELL; i <= length; i++) {
                const target1 = $('table tr').eq(i).children()
                topMonthSell.push({
                    "id": target1.find('a').eq(0).attr('href').split('?')[1].split('=')[1],
                    "project": target1.eq(2).text(),
                    "deal": target1.eq(3).text(),
                    "area": target1.eq(4).text()
                })
            }
            return topMonthSell
        } else {
            return []
        }
    } catch (err) {
        console.error(err)
        return err
    }
}

/**
 *      抓取商品住宅销售排行榜
 */
async function grabTopPreSell(request) {
    try {
        const response = await AXIOS.get(UTIL.format(URL.TOP_PRE_SELL, encodeURIComponent(request.district || '')))
        // console.log(response)

        if (response.status === 200) {
            const $ = CHEERIO.load(response.data, {
                xml: {
                    normalizeWhitespace: true
                }
            });

            const topPreSell = []
            for (let i = 1, length = request.top || TOP_NUM_PRE_SELL; i <= length; i++) {
                const target1 = $('table tr').eq(i).children()
                topPreSell.push({
                    "id": target1.find('a').eq(0).attr('href').split('?')[1].split('=')[1],
                    "project": target1.eq(3).text(),
                    "location": target1.eq(4).text(),
                    "date": target1.eq(5).text()
                })
            }
            return topPreSell
        } else {
            return []
        }
    } catch (err) {
        console.error(err)
        return err
    }
}

/**
 *      统计各县区可售住宅排行
 */
async function getTopAvailableEstates(request) {
    const field = {
        name: true
    }
    field[request.target || "availableNumberHousing"] = true;

    return await db.collection('_project')
        .field(request.field || field)
        .where(request.where || {
            district: "城厢区"
        })
        .orderBy(request.orderBy || (request.target || "availableNumberHousing"), "desc")
        .limit(request.top || TOP_AVAILABLE)
        .get()
}

async function main(request) {
    const topMonthSell = await grabTopMonthSell(request)
    const topPreSell = await grabTopPreSell(request)
    const topAvailableEstates = await getTopAvailableEstates(request)

    return {
        topMonthSell,
        topPreSell,
        topAvailableEstates
    }
}

module.exports = {
    main
}