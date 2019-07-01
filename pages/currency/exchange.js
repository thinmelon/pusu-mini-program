// pages/currency/exchange.js
const economic = require('../../services/economic.service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*	 货币名称	  */
    fromCurrencyName: '美元',
    fromCurrencyCode: 'USD',
    /*	   货币名称	  */
    toCurrencyName: '人民币',
    toCurrencyCode: 'CNY',
    currencyFD: '1',
    /*	 	当前汇率	 */
    result: '',
    /*	 更新时间     */
    updateTime: '',
    /*	 货币列表     */
    // multiCurrencyList: [],
    multiIndex: [1, 0],
    currencyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCurrencyList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.queryCurrencyExchange(this.data.fromCurrencyCode, this.data.toCurrencyCode);
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
   * 	货币列表
   */
  getCurrencyList: function() {
    const that = this;
    economic.getCurrencyList() // API
      .then(res => {
        console.log(res);
        const data = JSON.parse(res.data);
        if (data.hasOwnProperty('error_code') && data.error_code === 0) {
          that.setData({
            currencyList: data.result.list
          })
        }
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 	查询实时汇率
   */
  queryCurrencyExchange: function(from, to) {
    const that = this;
    economic.queryCurrencyExchange(from, to) // API
      .then(res => {
        console.log(res);
        const data = JSON.parse(res.data);
        if (data.hasOwnProperty('error_code') && data.error_code === 0) {
          const result = data.result[0];
          that.setData({
            fromCurrencyName: result.currencyF_Name,
            toCurrencyName: result.currencyT_Name,
            fromCurrencyCode: result.currencyF,
            toCurrencyCode: result.currencyT,
            currencyFD: result.currencyFD,
            result: result.result,
            updateTime: result.updateTime
          })
        } else {
          wx.showToast({
            title: data.reason,
            icon: 'none'
          })
          setTimeout(() => {
            this.queryCurrencyExchange(from, to);
          }, getApp().timeOut); //	如果是503错误（服务器在忙），1秒后发起重试
        }
      })
      .catch(err => {
        console.error(err);
      })
  },

  bindPickerChange: function(evt) {
    console.log(evt);
    if (evt.currentTarget.dataset.direction === 'from') {
      this.data.multiIndex[0] = evt.detail.value;
    }
    if (evt.currentTarget.dataset.direction === 'to') {
      this.data.multiIndex[1] = evt.detail.value;
    }
    this.setData({
      multiIndex: this.data.multiIndex
    });
    this.queryCurrencyExchange(
      this.data.currencyList[this.data.multiIndex[0]].code,
      this.data.currencyList[this.data.multiIndex[1]].code
    )
  }
  // /**
  //  * 	Picker 确定
  //  */
  // bindMultiPickerChange: function(evt) {
  //     console.log(evt);
  //     this.setData({
  //         multiIndex: evt.detail.value
  //     })
  //     this.queryCurrencyExchange(
  //         this.data.multiCurrencyList[0][evt.detail.value[0]].code,
  //         this.data.multiCurrencyList[1][evt.detail.value[1]].code
  //     )
  // },
  // /**
  //  * 	Picker Column 变化
  //  */
  // bindMultiPickerColumnChange: function(evt) {
  //     console.log(evt);
  // }
})