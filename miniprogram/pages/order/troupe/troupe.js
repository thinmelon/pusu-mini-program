// miniprogram/pages/order/troupe.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        troupes: []
    },

    skip: 0, //  分页
    limit: 20, //  每页数量

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            search: this.search.bind(this)
        })

        this.getTroupes();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // console.log('======== onReachBottom ========')
        this.getTroupes();
    },

    /**
     *  Cell 点击事件
     */
    onTroupeTap: function (e) {
        console.log(e);
        wx.navigateTo({
            url: `/pages/order/create/create?_=${JSON.stringify(e.currentTarget.dataset.troupe)}`,
        })
    },

    /**
     *  获取剧团列表
     */
    getTroupes: function () {
        // console.log('======== getTroupes ========')
        app.wxp.cloud.callFunction({
            name: "database",
            data: {
                collection: "_troupe",
                skip: this.skip,
                limit: this.limit,
                sort1: "rank",
                sort2: "like"
            }
        })
            .then(res => {
                console.log(res);
                if (res.result && res.result.data && res.result.data.length > 0) {
                    this.skip += res.result.data.length;
                    this.setData({
                        troupes: this.data.troupes.concat(res.result.data)
                    })
                }
            })
    },

    search: function (value) {
        console.log('======= search =======', value)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                    text: '搜索结果',
                    value: 1
                }, {
                    text: '搜索结果2',
                    value: 2
                }])
            }, 200)
        })
    },

    selectResult: function (e) {
        console.log('select result', e.detail)
    },
})