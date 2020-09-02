const UTIL = require('util');
const AXIOS = require('axios')
const MOMENT = require('moment')
const CLOUD = require('wx-server-sdk')
const URL = require('../utils/url.js')

//  初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

//  可在入口函数外缓存 db 对象
const db = CLOUD.database()

//  数据库查询更新指令对象
const _ = db.command

/**
 *  贷款基础利率，又名贷款市场报价利率（Loan Prime Rate, LPR）是商业银行对其最优质客户执行的贷款利率
 */
async function grabLoanPrimeRate(request) {
    //  抓取过去一年的LPR数据
    const oneYearAgo = MOMENT().subtract(1, 'years').format('YYYY-MM-01') //  一年前
    const url = UTIL.format(URL.LOAN_PRIME_RATE, oneYearAgo) //  
    const response = await AXIOS.get(url)

    if (response.status === 200) {
        const rawData = response.data.data.csv.split('\r\n')
        for (let i = 1, length = rawData.length - 1; i < length; i++) {
            const data = rawData[i].split(',')
            const count = data.length
            const month = MOMENT(data[0], 'YYYY-MM-DD').format('YYYY.MM')
            const lpr = {
                oneYearLpr: data[count - 2], //  一年期
                fiveYearLpr: data[count - 1] //  五年期
            }
            const record = await db.collection('_money').where({
                "_id": month
            }).get()

            if (record.data && record.data.length > 0) {
                await db.collection('_money')
                    .doc(month)
                    .update({ //  更新
                        data: lpr
                    })
            } else {
                await db.collection('_money')
                    .doc(month)
                    .set({ //  添加
                        data: lpr
                    })
            }
        }

        return 'DONE'
    } else {
        return {
            errMsg: '无法获取数据'
        }
    }
}

/**
 *  房贷利率
 */
async function grabMortgageRate(request) {
    const response = await AXIOS.get(URL.MORTGAGE_RATE)
    // console.log(response)

    if (response.status === 200) {
        for (let i = 0; i < response.data.date_list.length; i++) {
            const month = MOMENT(response.data.date_list[i], 'YYYY-MM').format('YYYY.MM')
            const rate = {
                firstAverageRate: response.data.first_avg_rate_list[i], //  首套平均利率
                secondAverageRate: response.data.second_avg_rate_list[i], //  二套平均利率
                staticAverageRate: response.data.static_avg_rate_list[i] //  同期基准利率
            }

            const record = await db.collection('_money').where({
                "_id": month
            }).get()

            if (record.data && record.data.length > 0) {
                await db.collection('_money')
                    .doc(month)
                    .update({ //  更新
                        data: rate
                    })
            } else {
                await db.collection('_money')
                    .doc(month)
                    .set({ //  添加
                        data: rate
                    })
            }
        }

        return 'DONE'
    } else {
        return {
            errMsg: '无法获取数据'
        }
    }
}

async function main() {
    return await db.collection('_money')
        .orderBy('_id', 'desc')
        .limit(20)
        .get()
}

module.exports = {
    grabLoanPrimeRate,
    grabMortgageRate,
    main
}