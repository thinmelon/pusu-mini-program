// pages/food/list.js
const __LIFE__ = require('../../services/life.service.js');
const wxApiPromise = require('../../utils/wx.api.promise.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        environment: 'PRODUCTION', //  生产模式 or 调试模式
        pageName: '食莆', //  当面页名称 
        navbarHeight: 0, //  导航栏高度
        navbarTop: 0, //  导航栏上边距
        navbarButtons: [{ //  导航栏按钮
                index: 0,
                name: '搜索',
                icon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/search.png',
                url: '/pages/food/search'
            },
            {
                index: 1,
                name: '地图',
                icon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/map.png',
                url: '/pages/food/map'
            }
        ],
        restaurants: [], //	餐馆列表
        tags: [], //	标签数组、调试模式下使用
        displayedTags: [], //	 显示标签数组
        showBar: true //  显示标签栏

    },

    waitingForResult: false, //  等待返回餐馆数据
    showActionSheet: false, //  显示更多内容
    offset: 0, //	偏移量
    itemsPerTime: 10, //	每次获取数量
    currentScrollTop: 0, //  当前滚动条距离顶部位置
    actionSheetItemList: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /** 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点 */
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        /** 获取系统信息 */
        wx.getSystemInfo({
            success: res => {
                console.log(res);
                this.setData({
                    navbarHeight: res.statusBarHeight + menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight) * 2,
                    navbarTop: menuButtonObject.top
                })
            },
            fail(err) {
                console.log(err);
            }
        })

        this.actionSheetItemList = [{
                index: 1,
                name: '切换城市',
                callback: this.switchCity
            },
            {
                index: 2,
                name: '更多内容',
                url: '/pages/index/index'
            }
        ];

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

        wx.showLoading({ //  显示加载框
            title: '',
        });

        //  1. 获取当前位置 2. 转换成地级市 3. 当前地级市所有餐馆
        const that = this;
        wxApiPromise.getLocation()
            .then(result => {
                // console.log(result);
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
            .then(getApp().reverseGeocoder)
            .then(this.showRestaurants)
            .catch(exception => {
                console.error(exception)
                this.showRestaurants();
            })

        // this.recycleContext = CreateRecycleContext({
        //     //  对应 recycle-view 的 id 属性的值
        //     id: 'recycleId',
        //     //  对应 recycle-item 的 wx:for 属性设置的绑定变量名
        //     dataKey: 'projects',
        //     //  recycle-view 所在的页面或者组件的实例，页面或者组件内可以直接传 this
        //     page: this,
        //     //  此参数用来生成recycle-item的宽和高
        //     itemSize: this.itemSizeFunc,
        //     //  是否整个页面只有recycle-view
        //     //  主要是用在页面级别的长列表，并且需要用到onPullDownRefresh的效果
        //     useInPage: true,
        //     //  当前页面对象，可以通过getCurrentPages获取, 当useInPage为true必须提供
        //     root: getCurrentPages()
        // })
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
        if (this.data.restaurants.length > 0 && !this.showActionSheet) {
            this.showActionSheet = true;
            wx.showActionSheet({
                itemList: this.actionSheetItemList.map(item => {
                    return item.name
                }),
                success: result => {
                    console.log(result);
                    if (this.actionSheetItemList[result.tapIndex].url) {
                        wx.navigateTo({
                            url: this.actionSheetItemList[result.tapIndex].url
                        })
                    }
                    if (this.actionSheetItemList[result.tapIndex].callback) {
                        this.actionSheetItemList[result.tapIndex].callback();
                    }
                },
                complete: data => {
                    this.showActionSheet = false;
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
    },

    // onPageScroll: function () {

    // },

    // /**
    //  *      recycle-item大小设置
    //  *      
    //  * itemSize可以为包含{width, height}的Object，所有数据只有一种宽高信息。
    //  * 如果有多种，则可以提供一个函数，长列表组件会调用这个函数生成每条数据的宽高信息
    //  * 
    //  * 注意：
    //  *  1.  recycle-item的宽高必须和itemSize设置的宽高一致，否则会出现跳动的bug。
    //  *  2.  cycle-view设置的高度必须和其style里面设置的样式一致。
    //  *  3.  当使用了useInPage参数的时候，必须在Page里面定义onPageScroll事件
    //  */
    // itemSizeFunc: function (item, idx) {
    //     return {
    //         width: 162,
    //         height: 182
    //     }
    // },

    // getProjects: function () {
    //     app.wxp.cloud.callFunction({
    //         name: 'finance',
    //         data: {
    //             action: 'available',
    //             data: encodeURIComponent(JSON.stringify({
    //                 where: {
    //                     district: '荔城区'
    //                 }
    //             }))
    //         }
    //     })
    //         .then(res => {
    //             console.log(res)
    //             if (res.result.data && res.result.data.length > 0) {
    //                 this.recycleContext.append(res.result.data)
    //             }
    //         })
    //         .catch(err => {
    //             console.error(err)
    //         })
    // }

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
        console.log('>>>>>>>>>>>>> getRestaurants >>>>>>>>>>>>>', getApp().region);
        __LIFE__.getRestaurants(request)
            .then(res => {
                console.log(res.data);
                this.waitingForResult = false; //  结果已返回
                wx.hideLoading(); //  关闭loading对话框
                if (res.data.code === 0 && res.data.data.restaurants.length > 0) {
                    this.offset += res.data.data.restaurants.length; //	下次获取数据时起点位置
                    this.setData({
                        restaurants: this.data.restaurants.concat(res.data.data.restaurants.map(restaurant => {
                            restaurant.articles = restaurant.articles.reverse().slice(0, 3);
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
            region: getApp().region,
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
     *      切换城市
     */
    switchCity: function(options) {
        console.log('======== switchCity ========', getApp().region)
        wx.showActionSheet({
            itemList: getApp().cities,
            success: result => {
                console.log(result);
                getApp().region = getApp().cities[result.tapIndex];
                this.offset = 0;
                this.setData({
                    restaurants: [],
                });
                wx.showLoading({
                    title: '',
                });
                this.showRestaurants();
            }
        })

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
    }
})