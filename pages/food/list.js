// pages/food/list.js
const __LIFE__ = require('../../services/life.service.js');
const wxApiPromise = require('../../utils/wx.api.promise.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        environment: 'PRODUCTION',
        restaurants: [], //	餐馆列表
        tags: [], //	标签数组、调试模式下使用
        displayedTags: [], //	 显示标签数组
        showBar: true
    },

    region: '福州', //  地市
    waitingForResult: false, //  等待返回餐馆数据
    offset: 0, //	偏移量
    itemsPerTime: 10, //	每次获取数量
    currentScrollTop: 0, //  当前滚动条距离顶部位置
    actionSheetItemList: [{
            index: 0,
            name: '地图',
            url: '/pages/food/map'
        },
        {
            index: 1,
            name: '搜索',
            url: '/pages/food/search'
        },
        {
            index: 0,
            name: '更多内容',
            url: '/pages/index/index'
        }
    ],

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
        //  显示加载框
        wx.showLoading({
            title: '',
        });
        //  1. 获取当前位置 2. 转换成地级市 3. 当前地级市所有餐馆
        const that = this;
        wxApiPromise.getLocation()
            .then(result => {
                console.log(result);
                return new Promise((resolve, reject) => {
                    if (result.errMsg === "getLocation:ok") {
                        resolve({
                            location: {
                                latitude: result.latitude,
                                longitude: result.longitude
                            }
                        });
                    } else {
                        reject('获取当前位置失败')
                    }
                });
            })
            .then(wxApiPromise.reverseGeocoder)
            .then(this.showRestaurants)
            .catch(exception => {
                console.error(exception)
                // wx.hideLoading(); //  关闭loading对话框
                this.showRestaurants();
            })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        console.log('======== onShow ========');
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
        console.log('======== onPullDownRefresh ========')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        // console.log('======== onReachBottom ========')
    },

    /**
     *  滚动至底部，获取餐馆列表
     */
    onScrollToButtom: function() {
        console.log('======== onScrollToButtom ========')
        this.showRestaurants();
    },

    /**
     *  滚动至顶部，切换到地图模式
     */
    onScrollToTop: function(evt) {
        console.log('======== onScrollToTop ========')
        if (this.data.restaurants.length > 0) {
            wx.showActionSheet({
                itemList: this.actionSheetItemList.map(item => {
                    return item.name
                }),
                success: result => {
                    console.log(result);
                    wx.navigateTo({
                        url: this.actionSheetItemList[result.tapIndex].url
                    })
                }
            })

        }
    },

    /**
     *  向下滚动隐藏类别标签，向上滚动显示类别标签
     */
    onScroll: function(evt) {
        if (evt.detail.scrollTop > this.currentScrollTop && this.data.showBar) {
            this.setData({
                showBar: false
            })
        }

        if (evt.detail.scrollTop < this.currentScrollTop && !this.data.showBar) {
            this.setData({
                showBar: true
            })
        }

        this.currentScrollTop = evt.detail.scrollTop;
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
                this.waitingForResult = false; //  结果已返回
                wx.hideLoading(); //  关闭loading对话框
                if (res.data.code === 0 && res.data.data.restaurants.length > 0) {
                    this.offset += res.data.data.restaurants.length; //	下次获取数据时起点位置
                    this.setData({
                        restaurants: this.data.restaurants.concat(res.data.data.restaurants.map(restaurant => {
                            restaurant.articles = restaurant.articles.reverse();
                            return restaurant;
                        }))
                    })
                }
            })
            .catch(err => {
                this.waitingForResult = false;
                wx.hideLoading();
                throw new Error(err);
            })
    },

    /**
     * 	显示餐馆列表
     */
    showRestaurants: function() {
        console.log('==== showRestaurants ====', this.waitingForResult);
        if (this.waitingForResult) { //  正在请求数据
            return;
        }
        this.waitingForResult = true; //  开始请求餐馆数据
        let category = [];
        this.data.displayedTags.map(item => { //	当前要显示的标签
            if (item.enable) {
                category = category.concat(item.category)
            }
        })
        // console.log('category:', category)

        const params = {
            region: this.region,
            skip: this.offset,
            limit: this.itemsPerTime
        }
        if (this.data.environment === 'PRODUCTION') {
            params.package = JSON.stringify({
                tags: category
            });
        }
        this.getRestaurants(params);
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
                } else {
                    tag.enable = false;
                }
                return tag;
            })
        });
        wx.showLoading({
            title: '',
        });
        this.showRestaurants();
    }
})