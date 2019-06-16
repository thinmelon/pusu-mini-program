// pages/stock/pledge.js
const economic = require('../../services/economic.service.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pledges: [],
    displayedTags: []
  },

  stockCode: '',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.stockCode = options.code;
    this.setData({
      displayedTags: [{
        name: '持股',
        icon: '/icons/stock/_gubenjiegou.png',
        disabledIcon: '/icons/stock/_gubenjiegou_grey.png',
        // apiFunc: this.getStockAnnouncement,
        enable: true
      }, {
        name: '质押',
        icon: '/icons/stock/_guquanchuzhi.png',
        disabledIcon: '/icons/stock/_guquanchuzhi_grey.png',
        apiFunc: this.getStockSharePledge,
        enable: false
      }, {
        name: '冻结',
        icon: '/icons/stock/_jingyingyichang.png',
        disabledIcon: '/icons/stock/_jingyingyichang_grey.png',
        // apiFunc: this.getStockSecondaryPublicOffering,
        enable: false
      }, {
        name: '解禁',
        icon: '/icons/stock/_huanbenqueren.png',
        disabledIcon: '/icons/stock/_huanbenqueren_grey.png',
        // apiFunc: this.getStockRationedShare,
        enable: false
      }]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('======== 	onReady	========')
    this.paint({
      code: this.stockCode
    });
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
   * 	获取公司股权质押
   */
  getStockSharePledge: function(request) {
    const that = this;
    economic.getStockSharePledge(request.code)
      .then(res => {
        this.resultHandler('pledges', res);
      })
      .catch(err => {
        console.error(err);
      })
  },

  resultHandler: function(key, res) {
    console.log(res);
    if (res.statusCode === 200) {
      const data = JSON.parse(res.data);
      if (data.hasOwnProperty('resultcode') && data.resultcode === 200) {
        if (data.records.length > 0) {
          let value = {};
          value[key] = data.records;
          this.setData(value);
        } else { //  返回的记录数组为空
          wx.showToast({
            title: '不存在相关记录',
            icon: 'none'
          })
        }
      } else { //  API调用失败
        wx.showToast({
          title: data.resultmsg,
          icon: 'none'
        })
      }
    } else { //  网络出错
      wx.showToast({
        title: '服务器开小差~~',
        icon: 'none'
      })
    }
  },

  /**
   *  绘制页面
   */
  paint: function(request) {
    this.data.displayedTags.map(tag => {
      if (tag.enable && tag.apiFunc) {
        tag.apiFunc(request);
        wx.setNavigationBarTitle({
          title: tag.name
        })
      }
    })
  }
})