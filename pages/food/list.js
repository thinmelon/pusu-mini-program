// pages/food/list.js
const __LIFE__ = require('../../services/life.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        environment: 'PRODUCTION',
        restaurants: [],
        tags: [],
        displayedTags: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        try {
            const restaurants = wx.getStorageSync('__RESTAURANT__'); //	尝试从缓存中读取餐馆列表
            if (restaurants) {
                this.setData({
                    restaurants: restaurants
                })
            }
        } catch (err) {
            console.error(err);
        }

        this.getTags();

        this.setData({
            environment: getApp().environment,
			displayedTags: getApp().tags
        });
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
     * 	关联标签
     */
    bindPickerChange: function(evt) {
        // console.log(evt);
        // console.log(evt.currentTarget.dataset.restaurantid);
        // console.log(this.data.tags[evt.detail.value]);
        __LIFE__.bindTag(evt.currentTarget.dataset.restaurantid, this.data.tags[evt.detail.value])
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    wx.showToast({
                        title: '成功'
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	移除标签
     */
    removeTag: function(evt) {
        console.log(evt);
        console.log(evt.currentTarget.dataset.restaurantid);
        console.log(evt.currentTarget.dataset.tag);
        __LIFE__.removeTag(evt.currentTarget.dataset.restaurantid, evt.currentTarget.dataset.tag)
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    wx.showToast({
                        title: '成功'
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	获取标签列表
     */
    getTags: function() {
        __LIFE__.getTags()
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    res.data.data.tags.map(tag => {
                        this.data.tags.push(tag.name);
                    })
                    this.setData({
                        tags: this.data.tags
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     *  跳转至微信公众号文章链接
     */
    catchTapArticle: function(evt) {
        console.log(evt);
        const url = evt.currentTarget.dataset.url;
        wx.navigateTo({
            url: '/pages/food/article?collection=' + url.substr('http://oss.pusudo.cn/life/'.length, 32)
        })
    }
})