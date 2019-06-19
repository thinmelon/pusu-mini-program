// pages/stock/balance.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        displayedTags: []
    },

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
                apiFunc: this.getStockAnnouncement,
                enable: true
            }, {
                name: '现金流',
                icon: '/icons/stock/_cash.png',
                disabledIcon: '/icons/stock/_cash_grey.png',
                apiFunc: this.getStockDividends,
                enable: false
            }, {
                name: '利润表',
                icon: '/icons/stock/_income.png',
                disabledIcon: '/icons/stock/_income_grey.png',
                apiFunc: this.getStockSecondaryPublicOffering,
                enable: false
            }, {
                name: '指标',
                icon: '/icons/stock/_report.png',
                disabledIcon: '/icons/stock/_report_grey.png',
                apiFunc: this.getStockRationedShare,
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

    getStockBalanceSheet: function() {

    },

    getStockIncomeStatement: function() {

    },

    getStockCashFlowStatement: function() {

    },

    getStockIndicators: function() {

    }
})