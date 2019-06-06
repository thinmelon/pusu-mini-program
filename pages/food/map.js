// pages/food/map.js
// 引入QQ MAP SDK核心类
const QQMapWXJSSDK = require('../../lib/qqmap-wx-jssdk.min.js');
const __LIFE__ = require('../../services/life.service.js');
const wxApiPromise = require('../../utils/wx.api.promise.js');
let QQMapInstance;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        key: 'MWXBZ-GUH6V-3M6P3-U75XD-TMEQH-HZB4U',
        centerLongitude: 119.003326,
        centerLatitude: 25.43034,
        scale: 15,
        markers: [],
        chosenMarker: {},
        tags: [{
                name: '中餐',
                icon: '/icons/food/_zhongcan.png',
                disabledIcon: '/icons/food/_zhongcan_grey.png',
                enable: false
            },
            {
                name: '西餐',
                icon: '/icons/food/_xican.png',
                disabledIcon: '/icons/food/_xican_grey.png',
                enable: false
            },
            {
                name: '火锅',
                icon: '/icons/food/_huoguo.png',
                disabledIcon: '/icons/food/_huoguo_grey.png',
                enable: true
            },
            {
                name: '日料',
                icon: '/icons/food/_riliao.png',
                disabledIcon: '/icons/food/_riliao_grey.png',
                enable: false
            },
            {
                name: '小吃',
                icon: '/icons/food/_baozi.png',
                disabledIcon: '/icons/food/_baozi_grey.png',
                enable: false
            },
            {
                name: '烧烤',
                icon: '/icons/food/_shaokao.png',
                disabledIcon: '/icons/food/_shaokao_grey.png',
                enable: false
            },
            {
                name: '酒吧',
                icon: '/icons/food/_jiuba.png',
                disabledIcon: '/icons/food/_jiuba_grey.png',
                enable: false
            },
            {
                name: '自助',
                icon: '/icons/food/_zizhu.png',
                disabledIcon: '/icons/food/_zizhu_grey.png',
                enable: false
            },
            {
                name: '串串',
                icon: '/icons/food/_chuanchuan.png',
                disabledIcon: '/icons/food/_chuanchuan_grey.png',
                enable: false
            },
            {
                name: '甜点',
                icon: '/icons/food/_tiandian.png',
                disabledIcon: '/icons/food/_tiandian_grey.png',
                enable: false
            },
            {
                name: '简餐',
                icon: '/icons/food/_jiancan.png',
                disabledIcon: '/icons/food/_jiancan_grey.png',
                enable: false
            },
            {
                name: '茶饮',
                icon: '/icons/food/_chayin.png',
                disabledIcon: '/icons/food/_chayin_grey.png',
                enable: false
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        QQMapInstance = new QQMapWXJSSDK({ // 实例化API核心类
            key: this.data.key
        });
        this.paintMarkers(); //	绘制Marker
        // TODO: 隔上一段时间在后台更新数据
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
        // 调用接口
        // QQMapInstance.geocoder({
        //     address: '莆田华天金叶',
        //     success: function(res) {
        //         console.log(res);
        //     },
        //     fail: function(res) {
        //         console.log(res);
        //     },
        //     complete: function(res) {
        //         console.log(res);
        //     }
        // });
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
        wx.removeStorageSync('__RESTAURANT__');
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
            tags: this.data.tags.map(tag => {
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
    getRestaurants: function(callback) {
        const that = this;

        console.log('>>>>>>>>>>>>> getRestaurants');
        __LIFE__.getRestaurants() // API
            .then(res => {
                // console.log(res.data);
                if (res.data.code === 0) {
                    wxApiPromise.setStorage({ //	保存至缓存中
                        key: '__RESTAURANT__',
                        data: res.data.data.restaurants
                    })
                    if (callback) { //	获取列表完成后回调
                        callback();
                    }
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
        wxApiPromise.getStorage({
                'key': '__RESTAURANT__'
            }).then(storage => {
                console.log(storage.data);
                if (storage.data) {
                    let index = 0;
                    this.data.markers = [];
                    storage.data.map(item => {
                        this.data.tags.map(tag => {
                            if (tag.enable && item.location && item.tags.indexOf(tag.name) >= 0) {
                                // console.log(item);
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
                            } /**	end of if */
                        }) /**	end of this.data.tags.map */
                    }) /**	end of storage.data.map */
                    this.setData({
                        markers: this.data.markers
                    })
                }
            })
            .catch(err => {
                console.error(err);
                this.getRestaurants(this.paintMarkers); //	如果缓存中不存在餐馆列表，发起异步请求获取数据
            })
    },

    /**
     * 	点击地图上的Marker
     */
    bindMarkerTap: function(evt) {
        console.log(evt);
        this.setData({
            chosenMarker: this.data.markers[evt.markerId]
        });
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
    },

    /**
     *  关闭浮层
     */
    closeCoverView: function(evt) {
        console.log(evt);
        this.setData({
            chosenMarker: {}
        });
    },

    /**
     *  切换至列表样式
     */
    changeStyle: function() {
        wx.navigateTo({
            url: '/pages/food/list'
        })
    }
})