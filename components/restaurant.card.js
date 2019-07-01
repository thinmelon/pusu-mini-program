// components/restaurant.card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // myProperty: { // 属性名
    //   type: String,
    //   value: ''
    // },
    // myProperty2: String // 简化的定义方式
    restaurant: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数，可以为函数，或一个在methods段中定义的方法名
   */
  lifetimes: {
    attached: function() {},
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  ready: function() {},

  /**
   * 组件所在页面的生命周期函数
   */
  pageLifetimes: {
    show: function() {},
    hide: function() {},
    resize: function() {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 	用户点击餐馆
     */
    onRestaurantClicked: function(evt) {
      if (evt.currentTarget.dataset.restaurant.location) {
        const latitude = evt.currentTarget.dataset.restaurant.location.lat;
        const longitude = evt.currentTarget.dataset.restaurant.location.lng;
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        });
      }
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
  }
})