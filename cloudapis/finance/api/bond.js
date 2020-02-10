const UTIL = require('util')
const MOMENT = require('moment')
const CHEERIO = require('cheerio')
const CLOUD = require('wx-server-sdk')
const URL = require('../utils/url.js')
const HTTP_CLIENT = require('../utils/http.client.js')

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
 *          中债国债收益率曲线
 * 
 * 获取一年期及十年期国债收益率数据算出收益率差 判断短期及长期信心指数
 * 数据来源： 中国人民银行官网
 */
async function grabChinaTreasuryYields(request) {
    let date = [],
        oneYear = [],
        tenYear = [],
        children;
    const url = UTIL.format(URL.HISTORY_CHINA_TREASURY_YIELDS, request.from, request.to)
    const response = await HTTP_CLIENT.getPromisify(url)
    console.log(url)

    // 加载网页
    const $ = CHEERIO.load(response, {
        xml: {
            normalizeWhitespace: true
        }
    });

    if ($('tr', '#gjqxData').is('tr')) {
        // 开始解析
        $('tr', '#gjqxData').next().each(function(i, element) {
            children = $(this).children('td');
            date[i] = children.eq(1).text(); // 日期
            oneYear[i] = children.eq(4).text(); // 一年国债
            tenYear[i] = children.eq(8).text(); // 十年国债
        });

        return {
            date,
            oneYear,
            tenYear
        };
    } else {
        return {
            errMsg: '解析过程发生错误'
        }
    }
}

async function main(request) {
    return await grabChinaTreasuryYields({
        from: MOMENT().subtract(1, 'years').format('YYYY-MM-DD'),
        to: MOMENT().format('YYYY-MM-DD')
    })
}

module.exports = {
    main
}