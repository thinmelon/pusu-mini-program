// components/search.input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputPlaceHolder: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false, //  是否显示搜索结果面板
    focus: false, //  光标定位至input
    keyword: '' //  搜索关键词
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     *  光标定位至搜索框
     */
    onInputFocus: function(evt) {
      console.log(evt);
      this.setData({
        show: true
      });
    },
    /**
     *  光标移出搜索框
     */
    onInputBlur: function(evt) {
      console.log(evt);
      setTimeout(() => {
        this.setData({
          show: false,
          keyword: ''
        });
        this.triggerEvent('inputblur', {})
      }, 500);
    },
    /**
     *  输入
     */
    onInputKeyword: function(evt) {
      if (evt.detail.value && evt.detail.value.length > 0) {
        console.log(evt.detail.value)
        this.triggerEvent('inputkeyword', {
          keyword: evt.detail.value
        })
      } else {
        // this.setData({
        //   focus: false
        // })
      }
    },
  }
})