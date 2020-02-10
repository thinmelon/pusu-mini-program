// pages/knowledge/knowledge.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        article: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const target = app.hierarchy.find(item => {
            return item.subject === options.subject
        }).articles.find(item => {
            return item.title === options.title
        })
        console.log(target)

        this.setData({
            article: target
        })
    }
})