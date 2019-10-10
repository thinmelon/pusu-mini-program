// pages/stock/balance.js
const economic = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: [],
        income: [],
        cash: [],
        indicators: [],
        displayedTags: []
    },

    stockCode: '',
	retry: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('======== 	onLoad	========')
        console.log(options);
        this.stockCode = options.code;
        this.setData({
            displayedTags: [{
                name: '资产负债',
                icon: '/icons/stock/_balance.png',
                disabledIcon: '/icons/stock/_balance_grey.png',
                apiFunc: this.getStockBalanceSheet,
                enable: true
            }, {
                name: '现金流',
                icon: '/icons/stock/_cash.png',
                disabledIcon: '/icons/stock/_cash_grey.png',
                apiFunc: this.getStockCashFlowStatement,
                enable: false
            }, {
                name: '利润表',
                icon: '/icons/stock/_income.png',
                disabledIcon: '/icons/stock/_income_grey.png',
                apiFunc: this.getStockIncomeStatement,
                enable: false
            }, {
                name: '指标',
                icon: '/icons/stock/_report.png',
                disabledIcon: '/icons/stock/_report_grey.png',
                apiFunc: this.getStockIndicators,
                enable: false
            }]
        })
        wx.setNavigationBarTitle({
            title: options.title
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.paint({
            code: this.stockCode
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 	个股报告期资产负债表
     */
    getStockBalanceSheet: function(request) {
        economic.getStockBalanceSheet(request.code)
            .then(res => {
                this.resultHandler('balance', res, this.getStockBalanceSheet, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	个股报告期利润表
     */
    getStockIncomeStatement: function(request) {
        economic.getStockIncomeStatement(request.code)
            .then(res => {
                this.resultHandler('income', res, this.getStockIncomeStatement, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	个股报告期现金表
     */
    getStockCashFlowStatement: function(request) {
        economic.getStockCashFlowStatement(request.code)
            .then(res => {
                this.resultHandler('cash', res, this.getStockCashFlowStatement, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	个股报告期指标表
     */
    getStockIndicators: function(request) {
        economic.getStockIndicators(request.code)
            .then(res => {
                this.resultHandler('indicators', res, this.getStockIndicators, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 处理返回结果
     */
    resultHandler: function(key, res, callback, params) {
        console.log(res);
        if (res.statusCode === 200) {
            this.retry = 0;
            const data = JSON.parse(res.data);
            if (data.hasOwnProperty('resultcode') && data.resultcode === 200) {
                if (data.records.length > 0) {
                    let value = {};
                    value[key] = data.records;
                    this.setData(value);
                } else { //  返回的记录数组为空
                    wx.showToast({
                        title: '不存在相关记录',
                        icon: 'none'
                    })
                }
            } else { //  API调用失败
                wx.showToast({
                    title: data.resultmsg,
                    icon: 'none'
                })
            }
        } else if (res.statusCode === 503 && this.retry < getApp().maxRetry) {
            console.log('RETRY >>> ', this.retry);
            this.retry++;
            setTimeout(() => {
                callback(params);
            }, getApp().timeOut); //	如果是503错误（服务器在忙），1秒后发起重试
        } else { //  网络出错
            this.retry = 0;
            wx.showToast({
                title: '服务器开小差~~',
                icon: 'none'
            })
        }
    },

    /**
     *  绘制页面
     */
    paint: function(request) {
        this.data.displayedTags.map(tag => {
            if (tag.enable && tag.apiFunc) {
                tag.apiFunc(request);
            }
        })
    },

    /**
     *  选择类别
     */
    onTagClicked: function(evt) {
        console.log(evt);
        this.setData({
            displayedTags: this.data.displayedTags.map(item => {
                item.enable = (item.name === evt.currentTarget.dataset.name) ? true : false;
                return item;
            })
        });
        this.paint({
            code: this.stockCode
        });
    },

    onFieldClicked: function(evt) {
        // console.log(evt);
        wx.showToast({
            title: evt.currentTarget.dataset.hint,
            icon: 'none',
            duration: 5000
        })
    }
})