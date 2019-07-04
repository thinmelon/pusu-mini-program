// pages/tendering/bid.js
const __ECONOMIC__ = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    offset: 0, //	偏移量
    itemsPerTime: 10, //	每次获取数量

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.searchTenderings({
            name: '福建广电网络集团股份有限公司莆田分公司',
            min: 50,
            max: 100,
            skip: this.offset,
            limit: this.itemsPerTime
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
     * 	获取餐馆列表
     */
    searchTenderings: function(request) {
        console.log('>>>>>>>>>>>>> searchTenderings');
        __ECONOMIC__.searchTenderings(request)
            .then(res => {
                console.log(res.data);

            })
            .catch(err => {
                console.error(err);
            })
    },
})