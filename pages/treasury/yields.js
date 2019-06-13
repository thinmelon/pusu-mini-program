// pages/treasury/yields.js
const wxApiPromise = require('../../utils/wx.api.promise.js');
const economic = require('../../services/economic.service.js');
const chart = require('../../services/chart.service.js');
const config = require('../../services/chart.config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: '',
    canvasHeight: '',
    canvasId: 'myCanvas',
    canvasOptions: {},
    totalLabels: 0,
    maskerCanvasId: 'myMasker',
    maskerCanvasCtx: undefined,
    maskerLeft: config.leftPadding,
    maskerTop: 0,
    maskerWidth: 0,
    maskerHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getChinaBondYieldRateWrapper();
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
   * 	中债国债收益率曲线API的Wrapper
   *  判断用户是否已登录
   */
  getChinaBondYieldRateWrapper: function() {
    if (getApp().isLogIn) {
      this.getChinaBondYieldRate();
    } else {
      setTimeout(() => {
        this.getChinaBondYieldRateWrapper();
      }, 1000);
    }
  },
  /**
   * 获取中债国债数据
   */
  getChinaBondYieldRate: function() {
    wx.showLoading({
      title: '正在抓取数据',
      mask: true
    });
    wxApiPromise
      .getSystemInfo() //  获取设备系统信息
      .then(this.setMyCanavsStyle) //  设置Canvas的样式
      .then(economic.getChinaBondYieldRate) //  获取中债国债收益率数据 
      .then(this.changeLoadingContent) //  更换加载提示内容
      .then(this.showLineChart) //  将数据绘制成拆线图
      .then(wxApiPromise.setStorage) // 将数据保存在本地
      .then(() => {
        wx.hideLoading();
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err,
          icon: 'none'
        })
      });
  },
  /**
   * 更换加载提示内容
   */
  changeLoadingContent: function(res) {
    wx.hideLoading();
    wx.showLoading({
      title: '绘制图表中',
      mask: true
    });
    return new Promise((resolve, reject) => {
      if (res.data) {
        resolve(res);
      } else {
        reject('获取数据失败，请重新进入')
      }

    });
  },
  /**
   * 触碰开始
   */
  bindTouchStart: function(e) {
    this.showIndexLine(e);
  },
  /**
   * 滑动
   */
  bindTouchMove: function(e) {
    this.showIndexLine(e);
  },
  /**
   * 触碰结束
   */
  bindTouchEnd: function(e) {
    chart.clearIndexLine(this.maskerCanvasCtx);
  },
  /**
   *   设置myCanvas的样式 
   */
  setMyCanavsStyle: function(result) {
    return new Promise((resolve, reject) => {
      this.setData({
        canvasHeight: (result.windowHeight - 2) / 2,
        canvasWidth: result.windowWidth - 2,
        maskerHeight: (result.windowHeight - 2) / 2,
        maskerWidth: result.windowWidth - 2 - config.leftPadding
      })
      resolve();
    });
  },
  /**
   *   显示拆线图
   */
  showLineChart: function(res) {
    return new Promise((resolve, reject) => {
      const result = res.data;
      console.log(result)
      if (result.code === 0) {
        //   记录数据数组长度
        this.data.totalLabels = result.date.length;
        const margin = [],
          oneYear = [],
          tenYear = [],
          date = [];
        //   计算不同期限的收益率差
        for (let i = 0, length = result.date.length; i < length; i++) {
          oneYear[i] = result.oneYear[length - 1 - i];
          tenYear[i] = result.tenYear[length - 1 - i];
          date[i] = result.date[length - 1 - i];
          margin[i] = (tenYear[i] - oneYear[i]).toFixed(4);
        }
        //   绘制
        this.data.canvasOptions = chart.createLineChart({
          canvasId: this.data.canvasId,
          height: this.data.canvasHeight,
          width: this.data.canvasWidth,
          data: [{
              value: oneYear,
              legend: '一年期'
            },
            {
              value: tenYear,
              legend: '十年期'
            },
            {
              value: margin,
              legend: '利差'
            }
          ],
          labels: date
        });
        resolve({
          key: 'chinaBondYieldRate',
          data: {
            oneYear: oneYear,
            tenYear: tenYear,
            margin: margin,
            date: date
          }
        });
      } else {
        //  TODO: 给出相关错误提示
        reject('Fail');
      }

    });
  },
  /**	
   * 	显示辅助线
   */
  showIndexLine: function(e) {
    const index = Math.floor(e.touches[0].x / this.data.canvasOptions.unitX);
    if (index >= 0 && index < this.data.totalLabels) {
      const rate = wx.getStorageSync('chinaBondYieldRate');
      this.maskerCanvasCtx = chart.showIndexLine(
        'myMasker',
        index * this.data.canvasOptions.unitX,
        this.data.canvasHeight, [
          rate.oneYear[index],
          rate.tenYear[index],
          rate.margin[index]
        ],
        rate.date[index],
        this.data.canvasWidth);
    }
  }
})