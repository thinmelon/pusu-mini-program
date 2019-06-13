// pages/stock/pledge.js
const economic = require('../../services/economic.service.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pledges: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.getStockSharePledge({
            code: options.code
        });
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

    /**
     * 	获取公司股权质押
     */
    getStockSharePledge: function(request) {
        const that = this;
        economic.getStockSharePledge(request.code)
            .then(res => {
                console.log(res);
                const data = JSON.parse(res.data);
                if (data.hasOwnProperty('resultcode') && data.resultcode === 200 && data.records.length > 0) {
                    let index = 0;
                    this.data.pledges = data.records.map(record => {
                        record.index = ++index;
                        return record;
                    })
                    this.setData({
                        pledges: this.data.pledges
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },
})