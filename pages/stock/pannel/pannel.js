// pages/stock/pannel/pannel.js
const economic = require('../../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        CHStock: [{
            name: '光迅科技',
            code: '002281'
        }, {
            name: '通宇通讯',
            code: '002792'
        }],
        USStock: [],
        HKStock: [{
            name: '小米集团-W',
            code: '01810'
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getStockSharePledge({
            code: '600225'
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
                if (data.hasOwnProperty('error_code') && data.error_code === 0) {

                }
            })
            .catch(err => {
                console.error(err);
            })
    },
})