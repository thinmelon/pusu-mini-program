// pages/estates/project/project.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        project: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)

        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'available',
                    data: encodeURIComponent(JSON.stringify({
                        where: {
                            _id: options._
                        },
                        limit: 1
                    }))
                }
            })
            .then(res => {
                console.log(res)
                if (res.result.data && res.result.data.length === 1) {
                    this.setData({
                        project: res.result.data[0]
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })

    },

    /**
     *      关注事件
     */
    onFollowTap: function(e) {
        console.log(e)
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'follow',
                    data: encodeURIComponent(JSON.stringify({
                        projectID: this.data.project._id,
                        follow: !!!this.data.project.follow
                    }))
                }
            })
            .then(res => {
                console.log(res)
                if (res.result && res.result.stats.updated === 1) {
                    wx.showToast({
                        icon: 'none',
                        title: !!!this.data.project.follow ? '关注成功' : '取消关注'
                    })
                    this.setData({
                        "project.follow": !!!this.data.project.follow
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    onCellTap: function(e) {
        wx.navigateTo({
            url: '/pages/estates/building/building?_=' +
                encodeURIComponent(JSON.stringify(e.currentTarget.dataset.building))
        })
    }
})