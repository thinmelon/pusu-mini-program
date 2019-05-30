// pages/food/map.js
// 引入QQ MAP SDK核心类
const QQMapWXJSSDK = require('../../lib/qqmap-wx-jssdk.min.js');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    QQMapInstance = new QQMapWXJSSDK({
      key: this.data.key
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
    // 调用接口
    QQMapInstance.geocoder({
      address: '莆田华天金叶',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
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

  }
})