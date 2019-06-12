// pages/food/list.js
const __LIFE__ = require('../../services/life.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        environment: 'PRODUCTION',
        restaurants: [],						//	餐馆列表
        tags: [],									//	标签数组、调试模式下使用
        displayedTags: []					 //	 显示标签数组
    },

    offset: 0,										//	偏移量
    itemsPerTime: 10,						//	每次获取数量

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		console.log('======== onLoad ========');
        this.setData({
            environment: getApp().environment,
            displayedTags: getApp().tags
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log('======== onReady ========');
        if (this.data.environment === 'DEBUG') {
            this.getTags();
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        console.log('======== onShow ========');
        this.showRestaurants();
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
        // console.log('======== onReachBottom ========')
    },

    onScrollToButtom: function() {
        console.log('======== onScrollToButtom ========')
        this.showRestaurants();
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
     * 	获取餐馆列表
     */
    getRestaurants: function(request) {
        console.log('>>>>>>>>>>>>> getRestaurants');
        __LIFE__.getRestaurants(request)
            .then(res => {
                console.log(res.data);
                if (res.data.code === 0 && res.data.data.restaurants.length > 0) {
                    this.offset += res.data.data.restaurants.length;										//	下次获取数据时起点位置
                    this.setData({
                        restaurants: this.data.restaurants.concat(res.data.data.restaurants)
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	显示餐馆列表
     */
    showRestaurants: function() {
        let category = [];
        this.data.displayedTags.map(item => {								//	当前要显示的标签
            if (item.enable) {
                category = category.concat(item.category)
            }
        })
        // console.log('category:', category)
        this.getRestaurants({
            package: JSON.stringify({
                tags: category
            }),
            skip: this.offset,
            limit: this.itemsPerTime
        });
    },

    /**
     *  用户点击标签
     */
    onTagClicked: function(evt) {
        console.log(evt);
        this.offset = 0;
        this.setData({
            restaurants: [],
            displayedTags: this.data.displayedTags.map(tag => {
                if (tag.name === evt.currentTarget.dataset.name) {
                    tag.enable = !tag.enable;
                }
                return tag;
            })
        })
        this.showRestaurants();
    },

	/**
	 * 	用户点击餐馆
	 */
    onRestaurantClicked: function(evt) {
        console.log(evt);
        wx.navigateTo({
            url: '/pages/food/map?restaurant=' + encodeURIComponent(JSON.stringify(evt.currentTarget.dataset.restaurant)),
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