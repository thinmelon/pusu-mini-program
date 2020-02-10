// pages/food/map.js
const __LIFE__ = require('../../services/life.service.js');
const wxApiPromise = require('../../utils/wx.api.promise.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        centerLatitude: 25.43034,
        centerLongitude: 119.003326,
        scale: 15,
        markers: [],
        chosenMarker: {},
        displayedTags: [] //	 显示标签数组
    },

    cities: [{
        name: '福州',
        latitude: 26.086036,
        longitude: 119.299284
    }, {
        name: '厦门',
        latitude: 24.467581,
        longitude: 118.115937
    }, {
        name: '莆田',
        latitude: 25.454210,
        longitude: 119.007670
    }, {
        name: '泉州',
        latitude: 24.907450,
        longitude: 118.586850
    }, {
        name: '漳州',
        latitude: 24.512060,
        longitude: 117.666070
    }],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('======== onLoad ========');
        const restaurant = options.restaurant ? JSON.parse(decodeURIComponent(options.restaurant)) : null; //	解析传入options参数，获取餐馆基础元信息
        if (restaurant && restaurant.location) { //	如果餐馆元信息内存在地址信息
            this.data.centerLongitude = restaurant.location.lng; //	 经度
            this.data.centerLatitude = restaurant.location.lat; //	纬度
            this.data.chosenMarker = { //	 显示内容
                latitude: restaurant.location.lat,
                longitude: restaurant.location.lng,
                attach: {
                    name: restaurant.name,
                    articles: restaurant.articles
                }
            };
        }

        this.cities.map(city => {
            if (city.name === getApp().region) {
                this.data.centerLongitude = city.longitude;
                this.data.centerLatitude = city.latitude;
            }
        });

        this.setData({
            displayedTags: getApp().tags,
            centerLongitude: this.data.centerLongitude,
            centerLatitude: this.data.centerLatitude,
            chosenMarker: this.data.chosenMarker
        });

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log('======== onReady ========');
        //  1. 获取当前位置 2. 转换成地级市
        const that = this;
        let location = null;
        wxApiPromise.getLocation()
            .then(result => {
                // console.log(result);
                return new Promise((resolve, reject) => {
                    if (result.errMsg === "getLocation:ok") {
                        location = {
                            latitude: result.latitude,
                            longitude: result.longitude
                        };

                        resolve({
                            location: location
                        });
                    } else {
                        reject('获取当前位置失败')
                    }
                });
            })
            .then(getApp().reverseGeocoder)
            .then(change => {
                if (change && location) {
                    that.setData({
                        centerLongitude: location.longitude,
                        centerLatitude: location.latitude,
                    });
                }
                return new Promise((resolve, reject) => {
                    resolve('DONE');
                });
            })
            .then(that.paintMarkers) //	绘制Marker
            .catch(exception => {
                console.error(exception)
                that.paintMarkers();
            })
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
        console.log('=====	onUnload =====');
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
     *  用户点击标签
     */
    onTagClicked: function(evt) {
        console.log(evt);
        this.setData({
            displayedTags: this.data.displayedTags.map(tag => {
                if (tag.name === evt.currentTarget.dataset.name) {
                    tag.enable = !tag.enable;
                }
                return tag;
            })
        })
        this.paintMarkers();
    },

    /**
     * 		获取餐馆列表
     */
    getRestaurants: function(request, callback) {
        console.log('>>>>>>>>>>>>> getRestaurants >>>>>>>>>>>>>', getApp().region);
        __LIFE__.getRestaurants(request)
            .then(res => {
                console.log(res.data);
                if (callback && res.data.code === 0 && res.data.data.restaurants.length > 0) {
                    // callback(res.data.data.restaurants);
                    callback(res.data.data.restaurants.map(restaurant => {
                        restaurant.articles = restaurant.articles.reverse().slice(0, 1);
                        return restaurant;
                    }))
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	在地图上绘制Marker
     */
    paintMarkers: function() {
        let category = [];
        this.data.displayedTags.map(item => { //	当前要显示的标签
            if (item.enable) {
                category = category.concat(item.category)
            }
        })

        this.getRestaurants({
            region: getApp().region,
            package: JSON.stringify({
                tags: category
            })
        }, result => {
            let index = 0;
            this.data.markers = [];
            result.map(item => {
                this.data.displayedTags.map(tag => {
                    let isFound = false;
                    for (let i = 0; i < item.tags.length; i++) {
                        if (tag.category.indexOf(item.tags[i]) >= 0) {
                            isFound = true;
                            break;
                        }
                    }
                    if (tag.enable && item.location && isFound) {
                        this.data.markers.push({
                            id: index++,
                            iconPath: tag.icon,
                            latitude: item.location.lat,
                            longitude: item.location.lng,
                            width: 25,
                            height: 25,
                            attach: {
                                name: item.name,
                                articles: item.articles
                            }
                        })

                    } /** end of if */
                }); /** end of this.data.displayedTags.map */
            }); /** end of result.map */

            this.data.markers.push({
                id: -1,
                iconPath: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/position.png',
                latitude: this.data.centerLatitude,
                longitude: this.data.centerLongitude,
                width: 25,
                height: 25
            });
            this.setData({
                markers: this.data.markers
            })
        });
    },

    /**
     * 	点击地图上的Marker
     */
    bindMarkerTap: function(evt) {
        console.log(evt);
        if (evt.markerId >= 0) {
            console.log(this.data.markers[evt.markerId])
            this.setData({
                chosenMarker: this.data.markers[evt.markerId]
            });
        }
    },

    /**
     *  跳转至微信公众号文章链接
     */
    catchTapArticle: function(evt) {
        console.log(evt);
        const url = evt.currentTarget.dataset.article.url;
        wx.navigateTo({
            url: '/pages/food/article?collection=' + url.substr('http://oss.pusudo.cn/life/'.length, 32) + '&source=' + evt.currentTarget.dataset.article.source
        })
    },

    /**
     *  关闭浮层
     */
    closeCoverView: function(evt) {
        console.log(evt);
        this.setData({
            chosenMarker: {}
        });
    }
})