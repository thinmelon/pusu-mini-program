// pages/index/index.js
const MOMENT = require('../../lib/moment.min.js');
const wxcharts = require('../../lib/wxcharts.js');
const config = require('./config.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /*	 货币名称	    */
        fromCurrencyName: '美元',
        fromCurrencyCode: 'USD',
        /*	   货币名称	    */
        toCurrencyName: '人民币',
        toCurrencyCode: 'CNY',
        currencyFD: '1',
        /*	 	当前汇率    */
        result: '',
        /*	    更新时间    */
        updateTime: '',
        /*	    货币列表    */
        multiIndex: [1, 0],
        currencyList: config.CURRENCY_LIST,
        //  更多指标数据
        indexes: [{
            name: "商品",
            src: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/commodity.png",
            category: "commodity",
            url: "/pages/commodity/commodity" //  商品
        }, {
            name: "股票",
            src: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/stock.png",
            category: "stock",
            url: "/pages/stock/search/search" //  股票
        }, {
            name: "房产",
            src: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/estates.png",
            category: "estates",
            url: "/pages/estates/estates" //  房地产
        }, {
            name: "莆仙戏",
            src: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/troupe.png",
            category: "troupe",
            url: "/pages/order/troupe/troupe" //  莆仙戏
        }, {
            name: "知识树",
            src: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/knowledge.png",
            category: "knowledge",
            url: "/pages/knowledge/collections/collections" //  知识树
        }, {
            name: "工具盒",
            src: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/tools.png",
            category: "tools",
            url: "/pages/tools/tools" //  工具盒
        }],
        /*	 	知识点      */
        articles: {
            "Bond": ["什么是收益率曲线倒挂？"],
            "Money": ["货币信用框架理论"],
            "Macro": ["社融、人民币贷款和广义货币M2如何解读？", "如何透过社融数据看经济"],
            "Currency": ["什么是中间价？", "什么是不可能三角？"]
        }
    },

    /**
     *  图表列表
     */
    lineCanvases: [{
        _id: "aStockMarketAccount",
        unit: "万户",
        subIndex: [{
            name: "新增账户数",
            value: "newInvestors"
        }],
        handler: null
    }, {
        _id: "chinaBondYieldRate",
        unit: "",
        subIndex: [{
            name: "利差",
            value: "margin"
        }],
        handler: null
    }, {
        _id: "GDP",
        unit: "%",
        subIndex: [{
            name: "同比",
            value: "GDPYearOnYear"
        }],
        handler: null
    }, {
        _id: "CPI",
        unit: "%",
        handler: null
    }, {
        _id: "CCI",
        unit: "%",
        handler: null
    }, {
        _id: "totalRetailSales",
        unit: "%",
        handler: null
    }, {
        _id: "PPI",
        unit: "%",
        handler: null
    }, {
        _id: "PMI",
        unit: "%",
        handler: null
    }, {
        _id: "moneySupply",
        unit: "%",
        handler: null
    }, {
        _id: "importsExportsBalance",
        unit: "亿美元",
        handler: null
    }, {
        _id: "importsExportsBalanceMonthOnMonth",
        unit: "%",
        handler: null
    }, {
        _id: "financingAggregate",
        unit: "%",
        handler: null
    }, {
        _id: "financingAggregateFlow",
        unit: "亿",
        handler: null
    }, {
        _id: "shibor",
        unit: "%",
        subIndex: [{
            name: "3个月",
            value: "3M"
        }],
        handler: null
    }, {
        _id: "fixedAssetInvestmentPriceIndex",
        unit: "%",
        subIndex: [{
            name: "同比",
            value: "fixedAssetInvestmentPriceIndex"
        }],
        handler: null
    }],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getChinaBondYieldRate()
        this.getStockMarketAccountStatistic()
        this.getCurrencyExchange(this.data.fromCurrencyCode, this.data.toCurrencyCode)
        this.getMacroIndexes()
        this.getMoneySupply()
        this.getShibor()
        this.getQuaterIndex()
    },

    /**
     *  知识点点击事件
     */
    onCellTap: function (e) {
        // console.log(e)
        wx.navigateTo({
            url: '/pages/knowledge/knowledge?subject=' + e.currentTarget.dataset.subject + "&title=" + e.currentTarget.dataset.title,
        })
    },

    /**
     *  汇率转换币种选择事件
     */
    onPickerChange: function (evt) {
        console.log(evt);
        if (evt.currentTarget.dataset.direction === 'from') {
            this.data.multiIndex[0] = evt.detail.value;
        }
        if (evt.currentTarget.dataset.direction === 'to') {
            this.data.multiIndex[1] = evt.detail.value;
        }
        this.setData({
            multiIndex: this.data.multiIndex
        });
        this.getCurrencyExchange(
            this.data.currencyList[this.data.multiIndex[0]].code,
            this.data.currencyList[this.data.multiIndex[1]].code
        )
    },

    onIndexTap: function (e) {
        console.log(e)
        wx.redirectTo({
            url: this.data.indexes.find(item => {
                return item.category === e.currentTarget.dataset.index
            }).url,
        })
    },

    /**
     * 获取中债国债数据
     */
    getChinaBondYieldRate: function () {
        wx.showLoading({
            title: '正在抓取数据',
            mask: true
        });

        app.wxp.cloud.callFunction({
            name: 'finance',
            data: {
                action: 'bond'
            }
        })
            .then(res => {
                console.log('getChinaBondYieldRate >>> ', res)
                const margin = [],
                    oneYear = [],
                    tenYear = [],
                    date = [],
                    series = [];

                //   计算不同期限的收益率差
                for (let i = 0, length = res.result.date.length; i < length; i++) {
                    oneYear[i] = res.result.oneYear[length - 1 - i];
                    tenYear[i] = res.result.tenYear[length - 1 - i];
                    date[i] = res.result.date[length - 1 - i];
                    margin[i] = (tenYear[i] - oneYear[i]).toFixed(4);
                }

                //   Y坐标数据源
                series.push({
                    name: '利差',
                    data: margin
                })

                //   创建线形图表
                this.createLineCanvas("chinaBondYieldRate", date, series)

                wx.hideLoading();
            })
            .catch(err => {
                wx.hideLoading();
                wx.showToast({
                    title: err,
                    icon: 'none'
                })
            })
    },

    /**
     *      获取A股市场股票账户数
     */
    getStockMarketAccountStatistic: function () {
        app.wxp.cloud.callFunction({
            name: 'finance',
            data: {
                action: 'market'
            }
        })
            .then(res => {
                console.log('getStockMarketAccountStatistic >>> ', res)
                if (res.result.data && res.result.data.length > 0) {
                    this.simpleProcessing([{
                        name: "aStockMarketAccount",
                        data: [],
                        subIndex: [{
                            name: "新增账户数",
                            value: "newInvestors"
                        }]
                    }], res.result.data)
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  获取季度指标，如GDP，固定资产投资价格指数
     */
    getQuaterIndex: function () {
        app.wxp.cloud.callFunction({
            name: "database",
            data: {
                collection: "_quater",
                limit: 10 * 4,
                sort1: "_id",
                sortOption1: "desc"
            }
        })
            .then(res => {
                console.log('getQuaterIndex >>> ', res)
                if (res.result && res.result.data.length > 0) {
                    const rawData = res.result.data.reverse()
                    this.simpleProcessing([{
                        name: "GDP",
                        data: [],
                        subIndex: [{
                            name: "同比",
                            value: "GDPYearOnYear"
                        }]
                    }, {
                        name: "fixedAssetInvestmentPriceIndex",
                        data: [],
                        subIndex: [{
                            name: "同比",
                            value: "fixedAssetInvestmentPriceIndex"
                        }]
                    }], rawData)
                }
            })
    },

    /**
     *      货币信贷（Shibor）
     */
    getShibor: function () {
        app.wxp.cloud.callFunction({
            name: "database",
            data: {
                collection: "_shibor",
                limit: 360 * 5,
                sort1: "_id",
                sortOption1: "desc"
            }
        })
            .then(res => {
                console.log('getShibor >>> ', res)
                if (res.result && res.result.data.length > 0) {
                    const rawData = res.result.data.reverse()
                    this.simpleProcessing([{
                        name: "shibor",
                        data: [],
                        subIndex: [{
                            name: "3个月",
                            value: "3M"
                        }]
                    }], rawData)
                }
            })
    },

    /**
     *      货币信贷
     */
    getMoneySupply: function () {
        app.wxp.cloud.callFunction({
            name: "database",
            data: {
                collection: "_money",
                limit: 60,
                sort1: "_id",
                sortOption1: "desc"
            }
        })
            .then(res => {
                console.log('getMoneySupply >>> ', res)
                const date = [],
                    m1Growth = [],
                    m2Growth = [],
                    m1m2Margin = [],
                    series = [];

                for (let i = 0, length = res.result.data.length; i < length; i++) {
                    const item = res.result.data[i];
                    //  无记录，继续
                    if (!!!item.M1) {
                        continue;
                    }
                    //  计算M1增速
                    const lastYear = MOMENT(item._id, 'YYYY.MM').subtract(1, 'years').format('YYYY.MM') //  一年前
                    const lastYearItem = res.result.data.filter(record => {
                        return record._id === lastYear
                    })
                    if (lastYearItem.length > 0 && lastYearItem[0].M1 && lastYearItem[0].M2) {
                        const m1Increase = (((item.M1 - lastYearItem[0].M1) / lastYearItem[0].M1) * 100).toFixed(2)
                        const m2Increase = (((item.M2 - lastYearItem[0].M2) / lastYearItem[0].M2) * 100).toFixed(2)

                        date.push(item._id)
                        m1Growth.push(m1Increase)
                        m2Growth.push(m2Increase)
                        m1m2Margin.push((m1Increase - m2Increase).toFixed(2))
                    } else {
                        break
                    }
                }

                series.push({
                    name: "M1增速",
                    data: m1Growth.reverse(),
                    format: function (val, name) {
                        return val;
                    }
                })
                series.push({
                    name: "M2增速",
                    data: m2Growth.reverse(),
                    format: function (val, name) {
                        return val;
                    }
                })
                series.push({
                    name: "M1M2剪刀差",
                    data: m1m2Margin.reverse(),
                    format: function (val, name) {
                        return val;
                    }
                })
                //  绘制图形
                this.createLineCanvas("moneySupply", date.reverse(), series)

                const indexSeries = [{
                    name: "financingAggregate",
                    data: [],
                    subIndex: [{
                        name: "社融存量增速",
                        value: "financingAggregateGrowthRate"
                    }]
                }]
                //  简单加工
                this.simpleProcessing(indexSeries, res.result.data.reverse());
            })
    },

    /**
     *      宏观数据
     */
    getMacroIndexes: function () {
        app.wxp.cloud.callFunction({
            name: "database",
            data: {
                collection: "_macro",
                limit: 20,
                sort1: "_id",
                sortOption1: "desc"
            }
        })
            .then(res => {
                console.log('getMacroIndexes >>> ', res)
                if (res.result && res.result.data.length > 0) {
                    //  简单加工各宏观数据
                    const series = [{
                        name: "CPI",
                        data: [],
                        subIndex: [{
                            name: "环比",
                            value: "cpiMonthOnMonth"
                        }]
                    }, {
                        name: "totalRetailSales",
                        data: [],
                        subIndex: [{
                            name: "同比",
                            value: "retailSalesYearOnYear"
                        }]
                    }, {
                        name: "PPI",
                        data: [],
                        subIndex: [{
                            name: "同比",
                            value: "ppiYearOnYear"
                        }]
                    }, {
                        name: "PMI",
                        data: [],
                        subIndex: [{
                            name: "PMI",
                            value: "purchasingManagersIndex"
                        }, {
                            name: "新订单指数",
                            value: "newOrdersIndex"
                        }, {
                            name: "生产指数",
                            value: "productionIndex"
                        }]
                    }, {
                        name: "importsExportsBalance",
                        data: [],
                        subIndex: [{
                            name: "当月值",
                            value: "importsExportsBalanceMonthly"
                        }
                            // , {
                            //     name: "累计",
                            //     value: "importsExportsBalanceTotal"
                            // }
                        ]
                    }];

                    this.simpleProcessing(series, res.result.data.reverse());
                    //  进出口贸易差额累计环比及同比增速
                    this.secondaryProcessing(res.result.data.reverse(), "importsExportsBalanceTotal", "importsExportsBalanceMonthOnMonth")
                }

            })
    },

    /**
     *  简单加工（原数值上加减乘除）
     */
    simpleProcessing: function (series, rawData) {
        const date = [];

        //  日期    X轴是时间轴
        rawData.map(item => {
            date.push(item._id)
        })
        //  各宏观指标  Y轴
        for (let i = 0, length = series.length; i < length; i++) {
            //  各项子指标
            series[i].subIndex.map(field => {
                series[i].data.push({
                    name: field.name,
                    data: rawData.map(item => {
                        if (series[i].name === "totalRetailSales"
                            || series[i].name === "financingAggregate"
                            || series[i].name === "shibor"
                            || series[i].name === "GDP") {
                            return item[field.value] ? item[field.value] : 0
                        } else if (series[i].name === "importsExportsBalance") {
                            return item[field.value] ? (item[field.value] / 100000).toFixed(1) : 0
                        } else if (series[i].name === "PMI") {
                            return item[field.value] ? (item[field.value] - 50).toFixed(1) : 0
                        } else if (series[i].name === "aStockMarketAccount") {
                            return item.day[0][field.value] || 0
                        } else {
                            return item[field.value] ? (item[field.value] - 100).toFixed(1) : 0
                        }
                    }),
                    format: function (val, name) {
                        return val;
                    }
                })
            })
            //  绘制图形
            this.createLineCanvas(series[i].name, date, series[i].data)
        }
    },

    /**
     *  二次加工（计算环比及同比增速）
     *  当前应用在进出口贸易差额累计环比及同比增速
     */
    secondaryProcessing: function (rawData, field, canvasId) {
        const date = [],
            monthOnMonthGrowth = [],
            yearOnYearGrowth = [],
            series = [];

        for (let i = 0, length = rawData.length; i < length - 1; i++) {
            //  环比比较值不能为空
            if (!!!rawData[i][field] || !!!rawData[i + 1][field]) {
                continue;
            }
            //  计算环比增速
            const monthOnMonth = (((rawData[i][field] - rawData[i + 1][field]) / rawData[i + 1][field]) * 100).toFixed(2)

            date.push(rawData[i]._id)
            monthOnMonthGrowth.push(monthOnMonth)

            //  计算同比增速
            if (i * 2 < length) {
                const lastYear = MOMENT(rawData[i]._id, 'YYYY.MM').subtract(1, 'years').format('YYYY.MM') //  一年前
                const lastYearItem = rawData.filter(record => {
                    return record._id === lastYear
                })
                //  同比比较值不能为空
                if (lastYearItem.length > 0 && lastYearItem[0][field]) {
                    const yearOnYear = (((rawData[i][field] - lastYearItem[0][field]) / lastYearItem[0][field]) * 100).toFixed(2)
                    yearOnYearGrowth.push(yearOnYear)
                } else {
                    yearOnYearGrowth.push(0)
                }
            } else {
                yearOnYearGrowth.push(0) //  未参与的比较项用 0 填充
            }

        }

        series.push({
            name: "环比",
            data: monthOnMonthGrowth.reverse(),
            format: function (val, name) {
                return val;
            }
        })
        series.push({
            name: "同比",
            data: yearOnYearGrowth.reverse(),
            format: function (val, name) {
                return val;
            }
        })
        //  绘制图形
        this.createLineCanvas(canvasId, date.reverse(), series)
    },

    /**
     *  绘制图表
     */
    createLineCanvas: function (_id, categories, series) {
        this.lineCanvases = this.lineCanvases.map(canvas => {
            if (canvas._id === _id) {
                canvas.handler = new wxcharts({
                    canvasId: canvas._id,
                    type: 'line',
                    categories: categories,
                    series: series,
                    xAxis: {
                        disableGrid: true
                    },
                    yAxis: {
                        min: 0
                    },
                    animation: false,
                    width: app.windowWidth,
                    height: app.windowHeight,
                    dataLabel: false,
                    dataPointShape: false,
                    extra: {
                        lineStyle: 'curve'
                    }
                });
            }

            return canvas
        });
    },

    /**
     *  点击显示详情处理逻辑
     */
    onCanvasTouched: function (e) {
        const target = this[e.target.dataset.category].find(canvas => {
            return canvas._id === e.target.dataset.id
        })
        // console.log(target)

        target.handler.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                // console.log(item)
                return '[' + category + ']  ' + item.name + ':' + item.data + target.unit
            }
        });
    },

    /**
     * 	查询实时汇率
     */
    getCurrencyExchange: function (from, to) {
        app.wxp.cloud.callFunction({
            name: 'finance',
            data: {
                action: 'currency',
                data: encodeURIComponent(JSON.stringify({
                    from: this.data.currencyList[this.data.multiIndex[0]].code,
                    to: this.data.currencyList[this.data.multiIndex[1]].code
                }))
            }
        })
            .then(res => {
                console.log(res.result[0])
                this.setData({
                    fromCurrencyName: res.result[0].currencyF_Name,
                    toCurrencyName: res.result[0].currencyT_Name,
                    fromCurrencyCode: res.result[0].currencyF,
                    toCurrencyCode: res.result[0].currencyT,
                    currencyFD: res.result[0].currencyFD,
                    result: res.result[0].result,
                    updateTime: res.result[0].updateTime
                })
            })
            .catch(err => {
                wx.showToast({
                    title: err,
                    icon: 'none'
                })
            })
    }
})