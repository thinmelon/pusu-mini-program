// pages/gold/gold.js
const economic = require('../../services/economic.service.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBar: true, //  显示标签栏
    displayedTags: [], //	 显示标签数组
    goldShangHai: [], //  上海黄金交易所
    goldBank: [], //  银行账户黄金
    futureShangHai: [] //  上海期货交易所
  },

  currentScrollTop: 0, //  当前滚动条距离顶部位置

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      displayedTags: [{
        name: '上海黄金交易所',
        apiFunc: this.getShangHaiGold,
        enable: true
      }, {
        name: '银行账户黄金',
        apiFunc: this.getShanagHaiFuture,
        enable: false
      }, {
        name: '上海期货交易所',
        apiFunc: this.getBankGold,
        enable: false
      }]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.paint();
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
   * 	上海黄金交易所
   */
  getShangHaiGold: function() {
    economic.getShangHaiGold() // API
      .then(res => {
        this.resultHandler('goldShangHai', res, this.getShangHaiGold, {})
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 	上海期货交易所
   */
  getShanagHaiFuture: function() {
    economic.getShanagHaiFuture() // API
      .then(res => {
        this.resultHandler('futureShangHai', res, this.getShanagHaiFuture, {})
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 	银行账户黄金
   */
  getBankGold: function() {
    economic.getBankGold() // API
      .then(res => {
        this.resultHandler('goldBank', res, this.getBankGold, {})
      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   * 处理返回结果
   */
  resultHandler: function(key, res, callback, params) {
    if (res.statusCode === 200) {
      const data = JSON.parse(res.data);
      console.log(data);
      if (data.hasOwnProperty('resultcode') && data.resultcode === "200") {
        if (data.result.length > 0) {
          let value = {},
            propertyNumber = 0,
            tempArray = [];
          for (let key in data.result[0]) {
            ++propertyNumber; //  记录数组属性个数
          }
          for (let i = 1; i <= propertyNumber; i++) {
            if (data.result[0][i]) {
              tempArray.push(data.result[0][i]); //  将数据放入临时数组
            }
          }
          value[key] = tempArray;
          this.setData(value); //  更新数据
        } else { //  返回的记录数组为空
          wx.showToast({
            title: '不存在相关记录',
            icon: 'none'
          })
        }
      } else { //  API调用失败
        wx.showToast({
          title: data.reason,
          icon: 'none'
        })
      }
    } else if (res.statusCode === 503) {
      setTimeout(() => {
        callback(params);
      }, getApp().timeOut); //	如果是503错误（服务器在忙），1秒后发起重试
    } else { //  网络出错
      wx.showToast({
        title: '服务器开小差~~',
        icon: 'none'
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
   *  选择类别
   */
  onTagClicked: function(evt) {
    this.setData({
      displayedTags: this.data.displayedTags.map(item => {
        item.enable = (item.name === evt.currentTarget.dataset.name) ? true : false;
        return item;
      })
    });
    this.paint();
  },

  /**
   *  绘制页面
   */
  paint: function(request) {
    this.data.displayedTags.map(tag => {
      if (tag.enable && tag.apiFunc) {
        tag.apiFunc(request);
      }
    })
  },
})