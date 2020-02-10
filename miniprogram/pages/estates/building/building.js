// pages/estates/building/building.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        building: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const building = JSON.parse(decodeURIComponent(options._))
        console.log(building)
        this.setData({
            building
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    }
})