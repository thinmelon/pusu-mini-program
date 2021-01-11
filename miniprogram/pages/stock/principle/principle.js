// pages/stock/principle/principle.js
const MOMENT = require('../../../lib/moment.min.js');
const wxcharts = require('../../../lib/wxcharts.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        evaluate: [{
            "name": "买入分",
            "field": "buy"
        }, {
            "name": "卖出分",
            "field": "sell"
        }, {
            "name": "可信度",
            "field": "reliability"
        }],
        scores: [],
        principles: [],
        show: false,
        target: 11, //关注企业的目标财报在历史财报数据中的位置
        contrast: 7, //  关注企业的同比财报在历史财报数据中的位置
        // offset: 4, //  计算自由现金流当期财报距上一年报的偏移量
        page: 0,
        market: '',   //  市场，默认为沪深
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            market: options.market ? options.market : "CN"
        })

        this.getPrinciples()
        this.getStockInfo(options.code, "stock")
        this.getStockHistory(options.code)
        //  获取对比公司代码，如果有
        const storage = wx.getStorageSync("OPTIONAL")
        if (storage) {
            const stock = storage.find(item => {
                return item.optional === options.code
            })
            if (stock && stock.peer) {
                this.getStockInfo(stock.peer, "peer")
            }
        }
    },

    onPrevStepTap: function () {
        if (this.data.page - 1 >= 0) {
            this.setData({
                page: --this.data.page
            })

            if (this.data.principles[this.data.page].type === 'trend') {
                this.setData({
                    ["principles[" + this.data.page + "].showCanvas"]: "display: block;"
                })
            } else {
                this.setData({
                    ["principles[" + this.data.page + "].showCanvas"]: "display: none;"
                })
            }
        }
    },

    onNextStepTap: function () {
        console.log('onNextStepTap >>> ', this.data.page, this.data.principles[this.data.page].name)
        if (!this.data.stock.principle[this.data.page]) {
            const item = {}
            item.name = this.data.principles[this.data.page].name;
            item.sell = 0;
            item.buy = 0;
            item.reliability = 100;
            this.data.stock.principle.push(item)
        } else {
            this.data.stock.principle[this.data.page].name = this.data.principles[this.data.page].name; //  原则名称
        }
        console.log(this.data.stock.principle)

        app.wxp.showLoading()
        app.wxp.cloud.callFunction({
            name: 'finance',
            data: {
                action: 'score',
                data: encodeURIComponent(JSON.stringify({
                    code: this.data.stock.code,
                    principle: this.data.stock.principle
                }))
            }
        })
            .then(res => {
                console.log(res)
                app.wxp.hideLoading()
                if (this.data.page + 1 < this.data.principles.length) {
                    this.data.page = this.data.page + 1; //  下一页
                    this.afterPageChanged()
                } else {
                    wx.redirectTo({
                        url: '/pages/stock/index/index?code=' + this.data.stock.code,
                    })
                }

            })
            .catch(err => {
                console.error(err)
            })
    },

    onCanvasTouched: function (e) {
        // console.log(e)
        const target = this.data.principles.find(principle => {
            return principle.name === e.target.dataset.id
        })
        // console.log(target)

        target.handler.showToolTip(e, {
            format: function (item, category) {
                return '[' + MOMENT(category).format('YYYY.MM') + '] ' + item.name + '：' + item.data
            }
        });
    },

    onCellTap: function (e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/knowledge/knowledge?subject=Stock&title=' + e.currentTarget.dataset.title
        })
    },

    /**
     *  响应输入事件
     */
    onInput: function (e) {
        if (this.data.stock.principle[this.data.page]) {
            // this.data.stock.principle[this.data.page].name = this.data.principles[this.data.page].name; //  原则名称
            this.data.stock.principle[this.data.page][e.currentTarget.dataset.field] = parseInt(e.detail.value); //  评分标准的值 
        } else {
            const item = {}
            // item.name = this.data.principles[this.data.page].name;
            item[e.currentTarget.dataset.field] = parseInt(e.detail.value);
            this.data.stock.principle.push(item)
        }
        // console.log('onInput >>> ', this.data.stock.principle)
    },

    /**
     *  财报设置参数发生改变
     */
    onSettingChanged: function (e) {
        const setting = {}
        setting[e.currentTarget.dataset.field] = parseInt(e.detail.value)
        this.setData(setting)
    },

    /**
     *  跳转至指定页
     */
    onPageChanged: function (e) {
        const page = parseInt(e.detail.value)
        if (page > 0 && page <= this.data.principles.length) {
            this.data.page = page - 1; //  跳转至指定页
            this.afterPageChanged()
        }
    },

    /**
     *  增加/减少
     */
    onAddMinusTap: function (e) {
        console.log('onAddMinusTap >>> ', this.data.page, this.data.stock.principle[this.data.page])

        const step = e.currentTarget.dataset.field === 'reliability' ? 10 : 1;
        let original = e.currentTarget.dataset.field === 'reliability' ? 100 : 0;
        let value = original + (e.currentTarget.dataset.op === "add" ? step : -step)
        if (this.data.stock.principle[this.data.page]) {
            if (this.data.stock.principle[this.data.page][e.currentTarget.dataset.field]) {
                original = parseInt(this.data.stock.principle[this.data.page][e.currentTarget.dataset.field])
            }
            value = original + (e.currentTarget.dataset.op === "add" ? step : -step)
            this.setData({
                ["stock.principle[" + this.data.page + "]." + e.currentTarget.dataset.field]: value
            })
        } else {
            const item = {}
            // item.name = this.data.principles[this.data.page].name;
            item[e.currentTarget.dataset.field] = value;
            this.data.stock.principle.push(item)
            this.setData({
                "stock.principle": this.data.stock.principle
            })
        }
    },

    /**
     *  页面切换后
     */
    afterPageChanged: function (e) {
        this.setData({
            "page": this.data.page,
            "stock.principle": this.data.stock.principle,
            "show": false
        })

        wx.setNavigationBarTitle({
            title: this.data.principles[this.data.page].stage
        })

        if (this.data.principles[this.data.page].type === 'trend') {
            //  创建线形图
            if (this.data.principles[this.data.page].handler) {

            } else {
                this.createLineCanvas(this.data.history)
            }
            this.setData({
                ["principles[" + this.data.page + "].showCanvas"]: "display: block;"
            })
        } else if (this.data.principles[this.data.page].type === 'ring') {
            //  创建环形图
            if (this.data.principles[this.data.page].handler) {

            } else {
                this.createRingChart(this.data.history)
            }
            this.setData({
                ["principles[" + this.data.page + "].showCanvas"]: "display: block;"
            })
        } else {
            this.setData({
                ["principles[" + this.data.page + "].showCanvas"]: "display: none;"
            })
        }

    },

    /**
     *  我的原则
     */
    getPrinciples: function () {
        app.wxp.cloud.callFunction({
            name: 'finance',
            data: {
                action: 'principle',
                data: encodeURIComponent(JSON.stringify({
                    market: this.data.market
                }))
            }
        })
            .then(res => {
                console.log("getPrinciples >>> ", res)
                if (res.result && res.result.data.length > 0) {
                    this.setData({
                        principles: res.result.data
                    })
                    //  设置当前页面标题
                    wx.setNavigationBarTitle({
                        title: res.result.data[this.data.page].stage
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  获取上市公司的财务数据
     */
    getStockInfo: function (code, object) {
        app.wxp.showLoading()
        app.wxp.cloud.callFunction({
            name: 'search',
            data: {
                action: 'stock',
                data: encodeURIComponent(JSON.stringify({
                    keyword: code
                }))
            }
        })
            .then(res => {
                console.log("getStockInfo >>> ", res)
                if (res.result && res.result.list.length > 0) {
                    const stock = res.result.list[0]
                    //  如果有股权质押，过滤到已解押，并且质押终止日未到期的记录
                    if (stock.pledge) {
                        stock.pledge = stock.pledge.filter(item => {
                            return !!!item.F010D || (!!!item.F011D && MOMENT(item.F010D).isAfter())
                        })
                        // console.log(stock.pledge)
                    }
                    //  过滤没有经审计的年报
                    if (stock.audit) {
                        stock.audit = stock.audit.filter(item => {
                            return item.F002C === "1"
                        })
                    }
                    //  初始化评分标准
                    stock.principle = stock.principle || []
                    //  设置
                    const data = {}
                    data[object] = stock
                    this.setData(data)
                }
                app.wxp.hideLoading()
            })
            .catch(err => {
                console.error(err)
                app.wxp.hideLoading()
            })
    },

    /**
     *  获取上市公司的财务数据
     */
    getStockHistory: function (code) {
        app.wxp.cloud.callFunction({
            name: 'search',
            data: {
                action: 'history',
                data: encodeURIComponent(JSON.stringify({
                    keyword: code
                }))
            }
        })
            .then(res => {
                console.log("getStockHistory >>> ", res)
                if (res.result && res.result.data.length > 0) {
                    const history = res.result.data[0]
                    history.balance = history.balance.reverse()
                    history.cashflow = history.cashflow.reverse()
                    history.indicators = history.indicators.reverse()
                    history.profit = history.profit.reverse()
                    this.setData({
                        history
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  创建线形图表
     */
    createLineCanvas: function (data) {
        console.log(">>> createLineCanvas：", data)
        let seriesData = []; //  Y轴数组
        const categories = []; //  X轴
        const series = []; //  Y轴
        const target = data[this.data.principles[this.data.page].nCategory[0]]; //  计数 一般为12个季度
        const principle = this.data.principles[this.data.page]; //  原则
        const that = this;

        /** X坐标数据源 */
        target.map(item => {
            categories.push(item.ENDDATE);
        })

        /** Y坐标数据源 */
        if (this.data.principles[this.data.page].subtype === 'margin') {
            /**     子类型为计算差值     */
            for (let k = 0; k < target.length; k++) {
                let total1 = 0,
                    total2 = 0;
                //  计算分子总和
                for (let i = 0; i < principle.numerator.length; i++) {
                    total1 += data[principle.nCategory[i]][k] ? parseInt(data[principle.nCategory[i]][k][principle.numerator[i]] || 0) : 0
                }
                //  计算分母总和
                for (let i = 0; i < principle.denominator.length; i++) {
                    // console.log(k, ' >>> ', principle.dCategory[i], principle.denominator[i], data[principle.dCategory[i]][k])
                    total2 += data[principle.dCategory[i]][k] ? parseInt(data[principle.dCategory[i]][k][principle.denominator[i]] || 0) : 0
                }
                //  被除数不为零
                seriesData.push(((total1 - total2) / 100000000).toFixed(2))
            }
            // console.log(seriesData)

            series.push({
                name: principle.state[0],
                data: seriesData,
                format: function (val, name) {
                    return val + that.data.principles[that.data.page].unit;
                }
            })
        } else {
            /**     没有指定子类型     */
            if (this.data.principles[this.data.page].denominator) {
                for (let k = 0; k < target.length; k++) {
                    let total1 = 0,
                        total2 = 0;
                    //  计算分子总和
                    for (let i = 0; i < principle.numerator.length; i++) {
                        total1 += data[principle.nCategory[i]][k] ? parseInt(data[principle.nCategory[i]][k][principle.numerator[i]] || 0) : 0
                    }
                    //  计算分母总和
                    for (let i = 0; i < principle.denominator.length; i++) {
                        // console.log(k, ' >>> ', principle.dCategory[i], principle.denominator[i], data[principle.dCategory[i]][k])
                        total2 += data[principle.dCategory[i]][k] ? parseInt(data[principle.dCategory[i]][k][principle.denominator[i]] || 0) : 0
                    }
                    //  被除数不为零
                    seriesData.push(total2 !== 0 ? ((principle.multiple || 1) * total1 / total2).toFixed(2) : 0)
                }
                // console.log(seriesData)

                series.push({
                    name: principle.state[0],
                    data: seriesData,
                    format: function (val, name) {
                        return val;
                    }
                })
            } else {
                //  如果无需求和计算，则默认为多指标显示
                for (let i = 0; i < principle.numerator.length; i++) {
                    seriesData = [];
                    //  各季度不同指标的数据
                    for (let k = 0; k < target.length; k++) {
                        seriesData.push(data[principle.nCategory[i]][k][principle.numerator[i].trim()] || 0)
                    }
                    // console.log(seriesData)
                    if (seriesData.length > 0) {
                        series.push({
                            name: principle.state[i],
                            data: seriesData,
                            format: function (val, name) {
                                return val;
                            }
                        })
                    }
                }
            }
        }

        if (series.length > 0) {
            /** 绘制图表 */
            this.data.principles[this.data.page].handler = new wxcharts({
                canvasId: principle.name,
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
    },

    /**
     *  创建环形图表
     */
    createRingChart: function (data) {
        console.log(">>> createRingChart", data)
        const series = []
        const principle = this.data.principles[this.data.page]; //  原则

        for (let i = 0; i < principle.numerator.length; i++) {
            const value = data[principle.nCategory[i]][this.data.target][principle.numerator[i]]
            series.push({
                name: principle.state[i],
                data: value && value > 0 ? value : 0
            })
        }

        if (series.length > 0) {
            this.data.principles[this.data.page].handler = new wxcharts({
                canvasId: principle.name,
                type: 'ring',
                title: {
                    // name: principle.name,
                    name: "",
                    fontSize: 11
                },
                series: series,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: true,
                animation: false
            });
        }
    },
})