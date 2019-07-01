//app.js
const __WX_API_PROMISE__ = require('./utils/wx.api.promise.js');

App({
  environment: 'PRODUCTION', //	测试环境：DEBUG		生产环境：PRODUCTION
  timeOut: 1000, //	超时重试：1000毫秒
  /**
   *  股票市场
   *  
   */
  markets: [{
    name: 'A股', //  名称
    abbreviation: 'hs', //  缩写
    icon: '/icons/stock/China.png', //  启用图标
    disabledIcon: '/icons/stock/Grey.png', //  禁用图标
    /**
     *  点击股票弹出的ActionSheet显示内容荐
     */
    properties: [{
      tapIndex: 0, //  索引
      name: '公司资讯', //  项目名
      url: '/pages/stock/announcement?market=hs' //  跳转页面路径 
    }, {
      tapIndex: 1,
      name: '股权结构',
      url: '/pages/stock/pledge?market=hs'
    }, {
      tapIndex: 2,
      name: '资产负债',
      url: '/pages/stock/balance?market=hs'
    }, {
      tapIndex: 3,
      name: 'K线',
      url: '/pages/stock/k.line?market=hs'
    }],
    enable: true
  }, {
    name: '港股',
    abbreviation: 'hk',
    icon: '/icons/stock/HongKong.png',
    disabledIcon: '/icons/stock/Grey.png',
    properties: [{
      tapIndex: 0,
      name: 'K线',
      url: '/pages/stock/k.line?market=hk'
    }],
    enable: false
  }, {
    name: '美股',
    abbreviation: 'usa',
    icon: '/icons/stock/UnitedStates.png',
    disabledIcon: '/icons/stock/Grey.png',
    properties: [{
      tapIndex: 0,
      name: 'K线',
      url: '/pages/stock/k.line?market=usa'
    }],
    enable: false
  }],
  /**
   *  类别标签 
   * 
   */
  tags: [{
    name: '中餐',
    icon: '/icons/food/tags/zhongcan.png',
    disabledIcon: '/icons/food/tags/zhongcan_grey.png',
    category: ['中餐'],
    enable: true
  }, {
    name: '烧烤串串',
    icon: '/icons/food/tags/shaokao.png',
    disabledIcon: '/icons/food/tags/shaokao_grey.png',
    category: ['烧烤', '串串'],
    enable: false
  }, {
    name: '火锅自助',
    icon: '/icons/food/tags/huoguo.png',
    disabledIcon: '/icons/food/tags/huoguo_grey.png',
    category: ['火锅', '自助'],
    enable: false
  }, {
    name: '日韩料理',
    icon: '/icons/food/tags/riliao.png',
    disabledIcon: '/icons/food/tags/riliao_grey.png',
    category: ['日料', '韩餐'],
    enable: false
  }, {
    name: '甜点茶饮',
    icon: '/icons/food/tags/tiandian.png',
    disabledIcon: '/icons/food/tags/tiandian_grey.png',
    category: ['甜点', '茶饮'],
    enable: false
  }, { //	餐馆标签
    name: '小吃简餐',
    icon: '/icons/food/tags/xiaochi.png',
    disabledIcon: '/icons/food/tags/xiaochi_grey.png',
    category: ['小吃', '简餐'],
    enable: false
  }, {
    name: '西餐',
    icon: '/icons/food/tags/xican.png',
    disabledIcon: '/icons/food/tags/xican_grey.png',
    category: ['西餐'],
    enable: false
  }, {
    name: '酒吧',
    icon: '/icons/food/tags/jiuba.png',
    disabledIcon: '/icons/food/tags/jiuba_grey.png',
    category: ['酒吧'],
    enable: false
  }]
})