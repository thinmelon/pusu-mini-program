// pages/estate/statistics.js
const wxApiPromise = require('../../utils/wx.api.promise.js');
const __ECONOMIC__ = require('../../services/economic.service.js');
const __WX_CHARTS__ = require('../../lib/wxcharts.js');
const app = getApp();
var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  offset: 0, //	偏移量
  itemsPerTime: 10, //	每次获取数量
  estate: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new __WX_CHARTS__({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: simulationData.data,
        format: function(val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function(val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function(val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });


    // wxApiPromise
    //     .getSystemInfo() //  获取设备系统信息
    //     .then(this.setMyCanavsStyle) //  设置Canvas的样式

    // this.searchRealEstateStatistics({
    //   from: '2017-08-01 00:00:00',
    //   to: '2019-09-01 00:00:00'
    // });
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
   * 	搜索中标结果
   */
  searchRealEstateStatistics: function(request) {
    console.log('>>>>>>>>>>>>> searchRealEstateStatistics');
    __ECONOMIC__.searchRealEstateStatistics(request)
      .then(res => {
        console.log(res);
        if (res.statusCode === 200) {
          if (res.data.code === 0 && res.data.data.estate.length > 0) {
            this.estate = res.data.data.estate;
          }
        } else if (res.statusCode === 503) {
          //	如果是503错误（服务器在忙），1秒后发起重试
          setTimeout(() => {
            this.searchRealEstateStatistics(request);
          }, getApp().timeOut);
        } else {
          //  网络出错
          wx.showToast({
            title: '服务器开小差~~',
            icon: 'none'
          })
        }

      })
      .catch(err => {
        console.error(err);
      })
  },

  /**
   *  处理逻辑
   */
  touchHandler: function(e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function(item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  /**
   *  创建
   */
  createSimulationData: function() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },

  updateData: function() {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function(val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  }
})