//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//                                                                  //
//                      每日凌晨分发任务                              // 
//                                                                  //
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    env: 'diandi-software-cloud'
})

//  可在入口函数外缓存 db 对象
const db = cloud.database()

//  数据库查询更新指令对象
const _ = db.command

//  行政区域
const DISTRICT = ['城厢区', '荔城区', '涵江区', '秀屿区']

/**
 *          可售楼盘统计信息
 */
async function seed() {
    for (let i = 0; i < DISTRICT.length; i++) {
        let ret = await db.collection('_task')
            .add({
                data: {
                    rank: 1,
                    subject: 'FINANCE',
                    category: 'SEED',
                    district: DISTRICT[i],
                    status: 0,
                    addTime: new Date()
                }
            })
        console.log(ret)
    }
}

/**
 *          每日小结（统计本月、上月、本日、昨日的商品房签约情况）
 */
async function contract() {
    const ret = await db.collection('_task')
        .add({
            data: {
                rank: 12,
                subject: 'FINANCE',
                category: 'CONTRACT',
                status: 0,
                addTime: new Date()
            }
        })
    console.log(ret)
}

/**
 *          每日小结（统计各县区楼盘的成交量及成交均价）
 */
async function statistic() {
    const ret = await db.collection('_task')
        .add({
            data: {
                rank: 5,
                subject: 'FINANCE',
                category: 'STATISTIC',
                status: 0,
                addTime: new Date()
            }
        })
    console.log(ret)
}

/**
 *          莆田市人民政府 - 统计数据 - 房地产开发投资
 */
async function investment() {
    const ret = await db.collection('_task')
        .add({
            data: {
                rank: 6,
                subject: 'FINANCE',
                category: 'GOVERNMENT',
                page: 1,
                status: 0,
                addTime: new Date()
            }
        })
    console.log(ret)
}

/**
 *          中国人民银行 - LPR利率
 */
async function lpr() {
    const ret = await db.collection('_task')
        .add({
            data: {
                rank: 8,
                subject: 'FINANCE',
                category: 'LPR',
                status: 0,
                addTime: new Date()
            }
        })
    console.log(ret)
}

/**
 *          融360大数据研究所 - 房贷利率
 */
async function mortgage() {
    const ret = await db.collection('_task')
        .add({
            data: {
                rank: 9,
                subject: 'FINANCE',
                category: 'MORTGAGE',
                status: 0,
                addTime: new Date()
            }
        })
    console.log(ret)
}

/**
 *          金融街  -   股票帐户数
 */
async function market() {
    const ret = await db.collection('_task')
        .add({
            data: {
                rank: 10,
                subject: 'FINANCE',
                category: 'MARKET',
                status: 0,
                addTime: new Date()
            }
        })
    console.log(ret)
}

/**
 *  初始化所有任务
 */
async function init() {
    const now = new Date()
    const hour = parseInt(now.getHours()) + 8
    console.log('init >>> now: ', hour)
    //  每天早上8点重启失败任务
    if (hour >= 7 && hour <= 9) {
        await restart()
    }
    //  每天下午2点清理失败任务
    else if (hour >= 13 && hour <= 15) {
        await clear()
    }
    //  每天晚上8点启动爬虫
    else if (hour >= 19 && hour <= 20) {
        //  任务一：抓取各县区各楼盘信息（已售、可售、成交均价）
        await seed()
        //  任务二：统计各县区楼盘成交数量及均价（住宅、商业、写字楼、车库）
        await statistic()
        //  任务三：抓取房地产开发投资统计数据
        await investment()
        //  任务四：抓取LPR利率
        await lpr()
        //  任务五：抓取房货利率
        await mortgage()
        //  任务六：抓取人口数据（一年抓取一次，政府发布去年统计年鉴后）

        //  任务七：抓取A股市场的股票账户数
        await market()
        //  任务八：抓取商品房签约情况
        await contract()
    }

    return "DONE"
}

/**
 *  重启任务
 */
async function restart() {
    return await db.collection('_task')
        .where({
            status: 1
        })
        .update({
            data: {
                status: 0
            }
        })
}

/**
 *  移除所有失败任务
 */
async function clear() {
    return await db.collection('_task')
        .where({
            status: 1
        })
        .remove()
}

// 云函数入口函数
exports.main = async(event, context) => {
    const entry = [{
        action: "restart", //  重启任务
        fn: restart
    }, {
        action: "clear", //  移除所有未开始任务
        fn: clear
    }]

    const item = entry.find(item => item.action === event.action)
    const params = event.data ? JSON.parse(decodeURIComponent(event.data)) : {};
    return item ? await item.fn(params) : await init();
}