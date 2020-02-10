// pages/index/index.js
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
        /*	 	知识点      */
        articles: {
            "Bond": ["什么是收益率曲线倒挂？"],
            "Currency": ["什么是中间价？", "什么是不可能三角？"]
        }
    },
    //  更多指标数据
    indexes: [{
        category: "stock",
        url: "/pages/stock/search/search" //  股票市场
    }, {
        category: "food",
        url: "/pages/food/list" //  吃货美食
    }],

    lineCanvas: null, //  线形图

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getChinaBondYieldRate()
        this.getCurrencyExchange(this.data.fromCurrencyCode, this.data.toCurrencyCode)
    },

    /**
     *  知识点点击事件
     */
    onCellTap: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/knowledge/knowledge?subject=' + e.currentTarget.dataset.subject + "&title=" + e.currentTarget.dataset.title,
        })
    },

    /**
     *  汇率转换币种选择事件
     */
    onPickerChange: function(evt) {
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

    onIndexTap: function(e) {
        console.log(e)
        wx.redirectTo({
            url: this.indexes.find(item => {
                return item.category === e.currentTarget.dataset.index
            }).url,
        })
    },

    /**
     * 获取中债国债数据
     */
    getChinaBondYieldRate: function() {
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
                console.log(res)
                wx.hideLoading();
                this.showLineChart(res.result)
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
     *   显示拆线图
     */
    showLineChart: function(result) {
        //   记录数据数组长度
        this.data.totalLabels = result.date.length;
        const margin = [],
            oneYear = [],
            tenYear = [],
            date = [];
        //   计算不同期限的收益率差
        for (let i = 0, length = result.date.length; i < length; i++) {
            oneYear[i] = result.oneYear[length - 1 - i];
            tenYear[i] = result.tenYear[length - 1 - i];
            date[i] = result.date[length - 1 - i];
            margin[i] = (tenYear[i] - oneYear[i]).toFixed(4);
        }

        const categories = [];
        const series = [];

        /** Y坐标数据源 */
        // series.push({
        //     name: '一年期',
        //     data: oneYear
        // })
        // series.push({
        //     name: '十年期',
        //     data: tenYear
        // })
        series.push({
            name: '利差',
            data: margin
        })

        /** 绘制图表 */
        this.lineCanvas = new wxcharts({
            canvasId: "chinaBondYieldRate",
            type: "line",
            categories: date,
            series: series,
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                min: 0
            },
            animation: true,
            width: app.windowWidth,
            height: app.windowHeight,
            dataLabel: false,
            dataPointShape: false,
            extra: {
                lineStyle: 'curve'
            }
        });
    },

    /**
     *  点击显示详情处理逻辑
     */
    canvasTouchHandler: function(e) {
        console.log(e)
        if (e.target.dataset.category === 'line') {
            this.lineCanvas.showToolTip(e, {
                // background: '#7cb5ec',
                format: function(item, category) {
                    // console.log(item)
                    return '[' + category + '] ' + item.name + ':' + item.data
                }
            });
        }
    },

    /**
     * 	查询实时汇率
     */
    getCurrencyExchange: function(from, to) {
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
    },


})