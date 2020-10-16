const MOMENT = require('moment')
const CLOUD = require('wx-server-sdk')
const AVAILABLE = require('./estates/available.js')
const ESTATES = require('./estates/estates.js')
const GOVERNMENT = require('./estates/government.js')
const MONEY = require('./money.js')
const STOCK = require('./stock.js')
const CONFIG = require('../utils/config.js')

// 初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = CLOUD.database()

// 数据库查询更新指令对象
const _ = db.command

/**
 *          移除任务
 */
async function removeTask(taskID) {
    return await db.collection('_task')
        .doc(taskID)
        .remove()
}

/**
 *          执行任务
 */
async function main() {
    try {
        //  领取任务（按任务优先级排序，之前未执行过）
        const record = await db.collection('_task')
            .where({
                subject: CONFIG.SUBJECT,
                status: 0
            })
            .orderBy('rank', 'desc')
            .limit(1)
            .get()

        if (record.data && record.data.length === 1) {
            //  更新任务状态，避免先前执行异常任务重复执行，先跳过执行后续任务
            const updated = await db.collection('_task')
                .doc(record.data[0]._id)
                .update({
                    data: {
                        status: 1,
                        executeTime: new Date()
                    }
                })
            console.log(updated)

            switch (record.data[0].category) {
                case "SEED": //  1 种子，抓取各县区所有项目
                    await AVAILABLE.grabProjectPaging(record.data[0].district)
                    break;
                case "COLLECTION": //  2 项目分页
                    await AVAILABLE.grabProjectList(record.data[0])
                    break;
                case "PROJECT": //  3 项目详情
                    await AVAILABLE.grabProjectInfo(record.data[0])
                    break;
                case "BUILDING": //  4 项目楼盘
                    await AVAILABLE.grabBuildingInfo(record.data[0])
                    break;
                case "STATISTIC": //  5  各县区楼盘成交均价统计
                    await ESTATES.updateDayDistrictStatistic(MOMENT())
                    break;
                case "GOVERNMENT": //  6  房地产开发投资集合
                    await GOVERNMENT.grabFinanceStatistic(record.data[0])
                    break;
                case "INVESTMENT": //  7  房地产开发投资 
                    await GOVERNMENT.grabEstateInvestmentStatistic(record.data[0])
                    break;
                case "LPR": //  8   LPR利率
                    await MONEY.grabLoanPrimeRate(record.data[0])
                    break;
                case "MORTGAGE": //  9   房贷利率
                    await MONEY.grabMortgageRate(record.data[0])
                    break;
                case "MARKET": //  10   股票账户数
                    await STOCK.grabStockAccountNumber(record.data[0])
                    break;
                case "STOCK": //  11   获取各大市场的股票列表
                    await STOCK.grabMarketStocks(record.data[0])
                    break;
                case "CONTRACT": //  12   商品房签约情况
                    await ESTATES.updateContractStatistic(record.data[0])
                    break;
                default:
                    break;
            }
            //  成功执行后移除任务
            await removeTask(record.data[0]._id)
        }

        return "DONE"

        // return await db.collection('_task')
        //     .where({
        //         category: "BUILDING"
        //     })
        //     .remove()

        // await db.collection('_task')
        //     .update({
        //         data: {
        //             status: 0
        //         }
        //     })

    } catch (err) {
        console.error(err)
        return err
    }
}

module.exports = {
    main
}