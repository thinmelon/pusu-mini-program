// pages/food/article.js
const __URI__ = require('../../utils/uri.constant.js');
const wxApiPromise = require('../../utils/wx.api.promise.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        source: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        wx.setNavigationBarTitle({
            title: options.source
        })
        wxApiPromise.showLoading({
            title: '加载中'
        });
        this.setData({
            source: __URI__.fetchOfficialNews(options.collection)
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
    onShareAppMessage: function(options) {
        console.log('==== onShareAppMessage ====')
        console.log(options.webViewUrl)
    },

    bindload: function(evt) {
        console.log('==== bindload ====')
        console.log(evt);
        wxApiPromise.hideLoading();
    },

    binderror: function(evt) {
        console.log('==== binderror ====')
        console.log(evt);
        wxApiPromise.hideLoading();
    },

    bindmessage: function(evt) {
        console.log('==== bindmessage ====')
        console.log(evt);
    }
})