// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sections: [{
                index: 1,
                src: '/icons/currency.png',
                mode: 'aspectFit',
                text: '汇率',
                url: '/pages/currency/exchange'
            },
            {
                index: 2,
                src: '/icons/treasury.png',
                mode: 'aspectFit',
                text: '国债',
                url: '/pages/treasury/yields'
            },
			{
				index: 3,
				src: '/icons/gold.png',
				mode: 'aspectFit',
				text: '黄金',
				url: '/pages/gold/gold'
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