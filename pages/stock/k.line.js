// pages/stock/k.line.js
const economic = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        kLines: []
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.getStockKLine(options);
        wx.setNavigationBarTitle({
            title: options.title
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
     * 	获取美股基本面数据
     */
    getStockKLine: function(request) {
        economic.getStockKLine(request)
            .then(res => {
                console.log(res);
                if (res.statusCode === 200) {
                    if (res.data.hasOwnProperty('resultcode') && res.data.resultcode === "200") {
                        this.data.kLines.push({
                            name: '日K线图',
                            src: res.data.result[0].gopicture.dayurl
                        });
                        this.data.kLines.push({
                            name: '5日K线图',
                            src: res.data.result[0].gopicture.min_weekpic
                        });
                        this.data.kLines.push({
                            name: '分时K线图',
                            src: res.data.result[0].gopicture.minurl
                        });
                        this.data.kLines.push({
                            name: '月K线图',
                            src: res.data.result[0].gopicture.monthurl
                        });
                        this.data.kLines.push({
                            name: '周K线图',
                            src: res.data.result[0].gopicture.weekurl
                        });
                        this.setData({
                            kLines: this.data.kLines
                        });
                    }
                } else {
                    setTimeout(() => {
                        this.getStockKLine(request);
                    }, getApp().timeOut);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
})