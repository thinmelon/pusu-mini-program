// miniprogram/pages/knowledge/item/item.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            content: JSON.parse(decodeURIComponent(options._))
        })
    }

})