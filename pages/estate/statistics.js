// pages/estate/statistics.js
const wxApiPromise = require('../../utils/wx.api.promise.js');
const __ECONOMIC__ = require('../../services/economic.service.js');
const __CHART_SERVICE__ = require('../../services/chart.service.js');
const __CHART_CONFIG__ = require('../../services/chart.config.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        canvasId: 'myCanvas',
        maskerCanvasId: 'myMasker',

        canvasWidth: 0,
        canvasHeight: 0,
        maskerLeft: __CHART_CONFIG__.leftPadding,
        maskerTop: 0,
        maskerWidth: 0,
        maskerHeight: 0
    },

    offset: 0, //	偏移量
    itemsPerTime: 10, //	每次获取数量
    estate: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wxApiPromise
            .getSystemInfo() //  获取设备系统信息
            .then(this.setMyCanavsStyle) //  设置Canvas的样式

        // this.searchRealEstateStatistics({
        //     from: '2017-08-01 00:00:00',
        //     to: '2019-05-01 00:00:00'
        // });
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
     *   设置myCanvas的样式 
     */
    setMyCanavsStyle: function(result) {
		console.log(result);
        return new Promise((resolve, reject) => {
            this.setData({
                canvasHeight: (result.windowHeight - 2) / 2,
                canvasWidth: result.windowWidth - 2,
                maskerHeight: (result.windowHeight - 2) / 2,
                maskerWidth: result.windowWidth - 2 - config.leftPadding
            })
            resolve();
        });
    },

    /**
     * 	搜索中标结果
     */
    searchRealEstateStatistics: function(request) {
        console.log('>>>>>>>>>>>>> searchRealEstateStatistics');
        __ECONOMIC__.searchRealEstateStatistics(request)
            .then(res => {
                console.log(res);
                if (res.statusCode === 200) {
                    if (res.data.code === 0 && res.data.data.estate.length > 0) {
                        this.estate = res.data.data.estate;
                    }
                } else if (res.statusCode === 503) {
                    setTimeout(() => {
                        this.searchRealEstateStatistics(request);
                    }, getApp().timeOut); //	如果是503错误（服务器在忙），1秒后发起重试
                } else { //  网络出错
                    wx.showToast({
                        title: '服务器开小差~~',
                        icon: 'none'
                    })
                }

            })
            .catch(err => {
                console.error(err);
            })
    },
})