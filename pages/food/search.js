// pages/food/search.js
const life = require('../../services/life.service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    restaurant: null,
    searchResult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   *  搜索组件
   *  输入关键词后触发事件
   *  通知页面开始搜索
   */
  onInputKeyword: function(evt) {
    console.log(evt);
    this.searchRestaurants(evt.detail.keyword);
  },

  /**
   *  搜索组件
   *  输入框失去光标后触发事件
   */
  onInputBlur: function(evt) {
    console.log(evt);
    this.setData({
      searchResult: []
    })
  },

  searchRestaurants: function(keyword) {
    life.searchRestaurants({
        name: keyword
      })
      .then(res => {
        console.log(res);
        if (res.statusCode === 200 && res.data.code === 0) {
          this.setData({
            searchResult: res.data.data
          })
        }
      })
      .catch(err => {
        console.error(err);
      })
  },

  onSearchResultClicked: function(evt) {
    console.log(evt);
    this.setData({
      restaurant: evt.currentTarget.dataset.restaurant
    })
  }
})