// pages/estate/statistics.js
const __ECONOMIC__ = require('../../services/economic.service.js');
const __WX_CHARTS__ = require('../../lib/wxcharts.js');
const __MOMENT__ = require('../../lib/moment.min.js');
var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    characters: [{
        name: "房地产企业月末数",
        subIndex: [{
          key: "realEstateEnterprisesNumber",
          name: "月末数",
          unit: "个"
        }]
      },
      {
        name: "开发投资完成额",
        subIndex: [{
          key: "realEstateInvestment",
          name: "投资额",
          unit: "亿元"
        }]
      },
      {
        name: "商品房屋施工面积",
        subIndex: [{
          key: "constructionArea",
          name: "施工面积",
          unit: "万平方米"
        }, {
          key: "houseConstructionArea",
          name: "#住宅",
          unit: "万平方米"
        }, {
          key: "ninetyMinusHouseConstructionArea",
          name: "#90平方米",
          unit: "万平方米"
        }, {
          key: "newStartConstructionArea",
          name: "新开工面积",
          unit: "万平方米"
        }]
      },
      {
        name: "商品房屋竣工面积",
        subIndex: [{
          key: "completedArea",
          name: "竣工面积",
          unit: "万平方米"
        }, {
          key: "houseCompletedArea",
          name: "#住宅",
          unit: "万平方米"
        }]
      },
      {
        name: "商品房屋竣工价值",
        subIndex: [{
          key: "completedValue",
          name: "竣工价值",
          unit: "亿元"
        }]
      },
      {
        name: "商品房屋销售",
        subIndex: [{
          key: "saleArea",
          name: "销售面积",
          unit: "万平方米"
        }, {
          key: "houseSaleArea",
          name: "#住宅销售",
          unit: "万平方米"
        }, {
          key: "toBeSoldArea",
          name: "待售面积",
          unit: "万平方米"
        }, {
          key: "houseToBeSoldArea",
          name: "#住宅待售",
          unit: "万平方米"
        }, ]
      },
      {
        name: "商品房屋销售额",
        subIndex: [{
          key: "saleQuantity",
          name: "销售额",
          unit: "亿元"
        }]
      },
      {
        name: "土地购置面积",
        subIndex: [{
          key: "landAcquisitionArea",
          name: "购置面积",
          unit: "万平方米"
        }]
      },
      {
        name: "本年资金来源总额",
        subIndex: [{
          key: "totalFundsSource",
          name: "资金来源总额",
          unit: "亿元"
        }, {
          key: "loanFunds",
          name: "国内贷款",
          unit: "亿元"
        }, {
          key: "selfRaisedFunds",
          name: "自筹资金",
          unit: "亿元"
        }, {
          key: "otherFund",
          name: "其他",
          unit: "亿元"
        }]
      }

    ],
    index: 0
  },

  offset: 0, //	偏移量
  itemsPerTime: 10, //	每次获取数量
  estate: [], //  近一年房地产指标数组
  windowWidth: 320, //  设备窗口宽度
  windowHeight: 200, //  设备窗口高度

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    try {
      this.windowWidth = wx.getSystemInfoSync().windowWidth;
    } catch (e) {
      console.error('获取设备系统信息失败 >>> ', e);
    }

    this.searchRealEstateStatistics({
      from: __MOMENT__().subtract(1, 'years').format('YYYY-MM-DD'),
      to: __MOMENT__().format('YYYY-MM-DD')
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
   *  Picker选择事件
   */
  bindCharactersPickerChange: function(evt) {
    this.setData({
      index: parseInt(evt.detail.value)
    });
    this.createWxChart();
  },

  /**
   * 	获取莆田房地产开发投资数据
   */
  searchRealEstateStatistics: function(request) {
    __ECONOMIC__.searchRealEstateStatistics(request)
      .then(res => {
        console.log(res);
        if (res.statusCode === 200) {
          if (res.data.code === 0 && res.data.data.estate.length > 0) {
            this.estate = res.data.data.estate.reverse();
            this.createWxChart();
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
   *  创建微信图表
   */
  createWxChart: function() {
    const categories = [];
    const series = [];
    /** X坐标数据源 */
    this.estate.map(item => {
      categories.push(__MOMENT__(item.publishTime).format('YYYY.MM'));
    });
    /** 各指标数据源 */
    this.data.characters[this.data.index].subIndex.map(character => {
      series.push({
        name: character.name,
        data: this.estate.map(item => {
          return item[character.key];
        }),
        format: function(val, name) {
          return val + character.unit;
        }
      })
    })

    /** 绘制图表 */
    lineChart = new __WX_CHARTS__({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: categories,
      series: series,
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        min: 0
      },
      animation: true,
      width: this.windowWidth,
      height: this.windowHeight,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  /**
   *  点击显示详情处理逻辑
   */
  touchHandler: function(e) {
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function(item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  }
})