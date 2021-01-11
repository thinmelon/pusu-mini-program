// pages/stock/search/search.js

const app = getApp()
const CONFIG = require('./config')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //  特别关注
        optionals: [],
        banks: CONFIG.BANK_LIST
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            search: this.search.bind(this)
        })
    },

    onReady: function () {
        this.getOptionals()
    },

    /**
     *  搜索
     */
    search: function (value) {
        console.log('Search >>> ', value)
        return app.wxp.cloud.callFunction({
            name: 'search',
            data: {
                action: 'stock',
                data: encodeURIComponent(JSON.stringify({
                    keyword: value
                }))
            }
        })
            .then(res => {
                console.log(res)
                return new Promise((resolve, reject) => {
                    if (res.result.list && res.result.list.length > 0) {
                        resolve(
                            res.result.list.map(item => {
                                return {
                                    text: item.name,
                                    value: item.code
                                }
                            }))
                    } else {
                        resolve([])
                    }
                })
            })
    },

    /**
     *  选择搜索结果
     */
    onSearchResultSelected: function (e) {
        console.log('select result', e.detail)
        wx.navigateTo({
            url: '/pages/stock/index/index?code=' + e.detail.item.value,
        })
    },

    onCellTap: function (e) {
        let url = ""
        e.currentTarget.dataset.type === "general" ? url = `/pages/stock/index/index?code=${e.currentTarget.dataset.code}` : url = `/pages/stock/bank/bank?code=${e.currentTarget.dataset.code}`
        wx.navigateTo({
            url
        })
    },

    /**
     *      获取自选股 
     */
    getOptionals: function () {
        app.wxp.cloud.callFunction({
            name: 'search',
            data: {
                action: 'optional'
            }
        })
            .then(res => {
                console.log('getOptionals >>> ', res)
                if (res.result.data && res.result.data.length > 0) {
                    this.setData({
                        optionals: res.result.data
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
})