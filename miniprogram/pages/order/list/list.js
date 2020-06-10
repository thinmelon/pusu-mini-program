// miniprogram/pages/order/list/list.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMyOrders()
    },

    onCellsTap(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/order/details/details?_=' + e.currentTarget.dataset.id,
        })
    },

    getMyOrders: function () {
        app.wxp.cloud.callFunction({
            name: "order",
            data: {
                "action": "list"
            }
        })
            .then(res => {
                console.log(res)
                if (res.result && res.result.data && res.result.data.length > 0) {
                    this.setData({
                        orders: res.result.data
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
})