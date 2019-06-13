// pages/food/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        identity: [{
            index: 0,
            name: '老饕',
            src: '/icons/food/laotao.png',
            url: '/pages/food/list'
        }, {
            index: 1,
            name: '游客',
            src: '/icons/food/youke.png',
            url: '/pages/food/map'
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

    onIdentityClicked: function(evt) {
        console.log(evt);
        wx.navigateTo({
            url: evt.currentTarget.dataset.url
        })
    }
})