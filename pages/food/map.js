// pages/food/map.js
// 引入QQ MAP SDK核心类
const QQMapWXJSSDK = require('../../lib/qqmap-wx-jssdk.min.js');
const __LIFE__ = require('../../services/life.service.js');

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
    tags: [{
        name: '火锅',
        icon: '/icons/food/_huoguo.png',
        disabledIcon: '/icons/food/_huoguo_grey.png',
        enable: true
      },
      {
        name: '小吃',
        icon: '/icons/food/_baozi.png',
        disabledIcon: '/icons/food/_baozi_grey.png',
        enable: true
      }, {
        name: '酒吧',
        icon: '/icons/food/_jiuba.png',
        disabledIcon: '/icons/food/_jiuba_grey.png',
        enable: true
      }, {
        name: '烧烤',
        icon: '/icons/food/_shaokao.png',
        disabledIcon: '/icons/food/_shaokao_grey.png',
        enable: true
      }, {
        name: '日料',
        icon: '/icons/food/_riliao.png',
        disabledIcon: '/icons/food/_riliao_grey.png',
        enable: true
      }, {
        name: '西餐',
        icon: '/icons/food/_xican.png',
        disabledIcon: '/icons/food/_xican_grey.png',
        enable: true
      }, {
        name: '中餐',
        icon: '/icons/food/_zhongcan.png',
        disabledIcon: '/icons/food/_zhongcan_grey.png',
        enable: true
      }, {
        name: '自助',
        icon: '/icons/food/_zizhu.png',
        disabledIcon: '/icons/food/_zizhu_grey.png',
        enable: true
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    QQMapInstance = new QQMapWXJSSDK({
      key: this.data.key
    });
    this.getRestaurants();
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

  onTagClicked: function(evt) {
    console.log(evt);
  },

  /**
   * 		获取餐馆列表
   */
  getRestaurants: function() {
    const that = this;

    __LIFE__.getRestaurants() // API
      .then(res => {
        console.log(res.data);
        if (res.data.code === 0) {
          let index = 0;
          res.data.data.restaurants.map(item => {
            if (item.location) {
              that.data.markers.push({
                id: index++,
                iconPath: "/icons/food/_baozi.png",
                latitude: item.location.lat,
                longitude: item.location.lng,
                width: 25,
                height: 25,
                attach: {
                  name: item.name,
                  articles: item.articles
                }
              });
            }
          })
          that.setData({
            markers: that.data.markers
          })
        }
      })
      .catch(err => {
        console.error(err);
      })
  },

  bindMarkerTap: function(evt) {
    const url = this.data.markers[evt.markerId].attach.articles[0].url;
    console.log(url);
    wx.navigateTo({
      url: '/pages/food/article?collection=' + url.substr('http://oss.pusudo.cn/life/'.length, 32)
    })
  },

  bindTag: function() {
    __LIFE__.bindTag("5cf27c5a83760ae340b32a11", "火锅")
      .then(res => {
        console.log(res);
      })

  }
})