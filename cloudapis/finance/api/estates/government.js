const UTIL = require('util')
const AXIOS = require('axios')
const MOMENT = require('moment')
const CHEERIO = require('cheerio')
const CLOUD = require('wx-server-sdk')
const URL = require('../../utils/url.js')
const HTTP_CLIENT = require('../../utils/http.client.js')

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
 *  房地产开发投资
 */
const ESTATE_FIELDS = [{
        key: 'realEstateEnterprisesNumber',
        /* 房地产企业月末数（个） */
        name: '房地产企业'
    },
    {
        key: 'realEstateInvestment',
        /* 房地产开发投资完成额 */
        name: '房地产开发投资完成额'
    },
    {
        key: 'constructionArea',
        /* 商品房屋施工面积 */
        name: '面积'
    },
    {
        key: 'houseConstructionArea',
        /* #住宅  */
        name: '#住宅'
    },
    {
        key: 'ninetyMinusHouseConstructionArea',
        /* #90平方米以下   */
        name: '#90平方米'
    },
    {
        key: 'newStartConstructionArea',
        /* 本年新开工面积   */
        name: '新开工面积'
    },
    {
        key: 'completedArea',
        /* 商品房屋竣工面积   */
        name: '竣工面积'
    },
    {
        key: 'houseCompletedArea',
        /* #住宅    */
        name: '#住宅'
    },
    {
        key: 'completedValue',
        /* 商品房屋竣工价值    */
        name: '竣工价值'
    },
    {
        key: 'saleArea',
        /* 商品房屋销售面积    */
        name: '销售面积'
    },
    {
        key: 'houseSaleArea',
        /* #住宅     */
        name: '#住宅'
    },
    {
        key: 'saleQuantity',
        /* 商品房屋销售额     */
        name: '销售额'
    },
    {
        key: 'houseSaleQuantity',
        /* #住宅     */
        name: '#住宅'
    },
    {
        key: 'toBeSoldArea',
        /* 商品房屋待售面积     */
        name: '面积'
    },
    {
        key: 'houseToBeSoldArea',
        /* #住宅     */
        name: '#住宅'
    },
    {
        key: 'landAcquisitionArea',
        /* 土地购置面积     */
        name: '土地购置面积'
    },
    {
        key: 'totalFundsSource',
        /* 本年资金来源总额     */
        name: '资金来源总额'
    },
    {
        key: 'loanFunds',
        /* #国内贷款     */
        name: '国内贷款'
    },
    {
        key: 'selfRaisedFunds',
        /* #自筹资金     */
        name: '自筹资金'
    },
    {
        key: 'otherFund',
        /* #其他     */
        name: '其他'
    }
];

/**
 *  常住总人口
 */
const POPULATION_FIELDS = [{
        key: "year",
        name: "年份",
        index: 0
    },
    {
        key: "resident",
        name: "常住总人口",
        index: 1
    },
    {
        key: "residentMale",
        name: "常住人口（男）",
        index: 2
    },
    {
        key: "residentFemale",
        name: "常住人口（女）",
        index: 3
    },
    {
        key: "residentTown",
        name: "常住人口（城镇）",
        index: 4
    },
    {
        key: "residentCountry",
        name: "常住人口（农村）",
        index: 5
    },
    {
        key: "birthRate",
        name: "出生率",
        index: 7
    },
    {
        key: "deathRate",
        name: "死亡率",
        index: 8
    }
];

/**
 *      抓取莆田市人民政府官网统计数据
 */
async function grabFinanceStatistic(request) {
    try {
        let response = await HTTP_CLIENT.getPromisify(UTIL.format(URL.ESTATES_DEVELOPMENT_INVESTMENT, request.page || 6));
        response = response.replace(/\'/g, '"').replace(/<br>/g, '').replace(/\n/g, '').replace(/&nbsp/g, '');
        const rawData = JSON.parse(response)

        if (rawData.count && parseInt(rawData.count) > 0 && rawData.docs) {
            for (let i = 0; i < rawData.docs.length; i++) {
                if (rawData.docs[i].title.indexOf('房地产开发投资') > 0) {
                    await db.collection('_task')
                        .add({
                            data: {
                                rank: 7,
                                subject: 'FINANCE',
                                category: 'INVESTMENT',
                                title: rawData.docs[i].title,
                                href: rawData.docs[i].url,
                                status: 0,
                                addTime: new Date()
                            }
                        })
                }
            }
            return 'DONE'
        } else {
            return {
                errMsg: "无法获取数据！"
            }
        }
    } catch (err) {
        return err
    }
}

/**
 *      抓取房地产开发投资统计数据
 */
function grabEstateInvestmentStatistic(request) {
    return new Promise((resolve, reject) => {
        HTTP_CLIENT.get(request.href, response => {
            const $ = CHEERIO.load(response, {
                xml: {
                    normalizeWhitespace: true
                }
            });
            const investment = {};
            const element = $('tr');
            if (element.is('tr')) {
                // 开始解析
                let index = 0;
                element.each(function(i, elem) { //  跳过前三个tr元素
                    let children = $(this).children('td'), //  获取tr下所有子元素td
                        key = ESTATE_FIELDS[index] ? ESTATE_FIELDS[index].key : null, //  对象键
                        field = children.eq(0).text().trim(), //  对象键解释
                        value = parseFloat(children.eq(1).text().trim()); //  对象值
                    if (key && field.indexOf(ESTATE_FIELDS[index].name) > 0 && value) {
                        investment[key] = value; //  赋值
                        index++;
                    }
                });

                investment.title = request.title //  标题
                const statisticMonth = MOMENT(investment.title.substr(0, investment.title.indexOf('月') + 1), 'YYYY年MM月').format('YYYY.MM'); //  发布时间
                //  加入 _invsetment 集合
                db.collection('_investment')
                    .doc(statisticMonth)
                    .set({
                        data: investment
                    })
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err)
                    })
            } else {
                reject({
                    errMsg: '解析过程发生错误'
                });
            }
        })
    });
}

/**
 *      抓取常住总人口数据
 */
async function grabResidentPopulation(request) {
    try {
        const response = await AXIOS.get(URL.RESIDENT_POPULATION)
        const $ = CHEERIO.load(response.data, {
            xml: {
                normalizeWhitespace: true
            }
        });

        const element = $('tr');
        if (element.is('tr')) {
            // 开始解析
            let index = 0,
                residents = [];
            element.each(function(i, elem) {
                //  截取从2000年至2018年的常住人口数据
                if (i >= 20 && i <= 38) {
                    let item = {}
                    POPULATION_FIELDS.map(field => {
                        item[field.key] = $(this).children().eq(field.index).text()
                    })
                    residents.push(item)
                }
            });
            //  更新至数据库
            for (let i = 0; i < residents.length; i++) {
                await db.collection('_population')
                    .doc(residents[i].year)
                    .set({
                        data: residents[i]
                    })
            }

            return 'DONE'

        } else {
            return {
                errMsg: '解析过程发生错误'
            }
        }
    } catch (err) {
        console.error(err)
        return err
    }
}

/**
 *      获取过去 5 年房产开发投资的指标数据
 */
async function investment(request) {
    const fiveYearsAgo = MOMENT().subtract(5, 'years')
    const monthRange = []
    const theLastMonth = await db.collection('_investment').orderBy('_id', 'desc').limit(1).get()
    console.log(theLastMonth)
    //  取最近一月数据，并与过去五年同期相比较
    if (theLastMonth.data && theLastMonth.data.length > 0) {
        let day = MOMENT(theLastMonth.data[0]._id, 'YYYY.MM')
        //  月范围
        while (day.isAfter(fiveYearsAgo)) {
            monthRange.push(day.format('YYYY.MM'))
            day = day.subtract(1, 'years')
        }

        return await db.collection('_investment')
            .field(request.field || {
                houseConstructionArea: true, //  住宅施工面积
                houseCompletedArea: true, //  住宅竣工面积
                houseSaleArea: true, //  住宅销售面积
                houseToBeSoldArea: true, //  住宅待售面积
                landAcquisitionArea: true, //  土地购置面积
                realEstateInvestment: true //  房地产开发投资完成额
            })
            .where({
                _id: _.in(monthRange)
            })
            .orderBy('_id', 'asc')
            .get()
    } else {
        return {
            errMsg: "暂无数据"
        }
    }
    // return await grabFinanceStatistic(request)
    // return await grabEstateInvestmentStatistic({
    //     title: "2015年6月 房地产开发投资",
    //     href: "http://www.putian.gov.cn/zwgk/tjxx_222/tjsj/201507/t20150720_198647.htm"
    // })
}

/**
 *      获取常住人口数据
 */
async function population(request) {
    return await db.collection('_population')
        .orderBy('_id', 'asc')
        .get()
    // return await grabResidentPopulation(request)
}

module.exports = {
    grabFinanceStatistic,
    grabEstateInvestmentStatistic,
    investment,
    population
}