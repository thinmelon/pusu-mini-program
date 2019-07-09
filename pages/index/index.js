// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sections: [{
                index: 1,
                text: '汇',
                url: '/pages/currency/exchange'
            },
            {
                index: 2,
                text: '债',
                url: '/pages/treasury/yields'
            },
            {
                index: 3,
                text: '金',
                url: '/pages/gold/gold'
            },
            {
                index: 4,
                text: '股',
                url: '/pages/stock/pannel'
            },
            {
                index: 5,
                text: '标',
                url: '/pages/tendering/bid'
            },
            {
                index: 6,
                text: '房',
                url: '/pages/estate/statistics'
            }
        ]
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
        console.log("======= onPullDownRefresh =======");
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
     * 	点击图标
     */
    onClick: function(evt) {
        // console.log(evt);
        wx.navigateTo({
            url: evt.currentTarget.dataset.url
        })
    }
})