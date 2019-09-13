// components/navigation.bar.js
// const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: {
      type: String,
      value: ""
    },
    navbarHeight: {
      type: Number,
      value: 0
    },
    navbarTop: {
      type: Number,
      value: 0
    },
    showNav: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    buttons: [{
        index: 0,
        name: '搜索',
        url: '/pages/food/search'
      },
      {
        index: 1,
        name: '地图',
        url: '/pages/food/map'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onNavbarBtnClicked: function(evt) {
      console.log(evt)
      let url = this.data.buttons[parseInt(evt.currentTarget.dataset.tapindex)].url;
      if (url) {
        wx.navigateTo({
          url: url
        })
      }
    }
  }
})