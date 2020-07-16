// miniprogram/pages/knowledge/folder/folder.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        album: "", //  设置文章列表的合集名称
        folder: []
    },

    subject: "", //  分类主题
    skip: 0, //  分页
    limit: 20, //  每页数量

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.subject = options.folder
        this.setData({
            album: options.album
        })

        this.getItems()

    },

    onReachBottom: function () {
        this.getItems()
    },

    onItemTap: function (e) {
        wx.navigateTo({
            url: '/pages/knowledge/item/item?_=' + encodeURIComponent(JSON.stringify(e.currentTarget.dataset.article)),
        })
    },

    getItems: function () {
        app.wxp.cloud.callFunction({
                name: "database",
                data: {
                    collection: "_knowledge",
                    where: encodeURIComponent(JSON.stringify({
                        folder: this.subject
                    })),
                    skip: this.skip,
                    limit: this.limit
                }
            })
            .then(res => {
                console.log(res);
                if (res.result && res.result.data && res.result.data.length > 0) {
                    this.skip += res.result.data.length;
                    this.setData({
                        folder: this.data.folder.concat(res.result.data)
                    })
                }
            })
    }

})