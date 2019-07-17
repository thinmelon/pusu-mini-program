//app.js
const __WX_API_PROMISE__ = require('./utils/wx.api.promise.js');
const __FUN_DEBUG__ = require('./lib/fundebug.1.3.1.min.js');
__FUN_DEBUG__.init({
    apikey: '5deb327332863618ddb0691554c9febfc1ae98db0266ba7620a33d97e258dbd3'
})
const __QQ_MAP_WX_JSSDK__ = require('./lib/qqmap-wx-jssdk.min.js'); // 引入QQ MAP SDK核心类

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
    }],
    region: '莆田', //  地市	默认莆田
    /**
     * 	由坐标到坐标所在位置的文字描述的转换
     * 	输入坐标返回地理位置信息和附近poi列表
     */
    reverseGeocoder: function(options) {
        let qqMapInstance = new __QQ_MAP_WX_JSSDK__({ // 实例化API核心类
            key: 'MWXBZ-GUH6V-3M6P3-U75XD-TMEQH-HZB4U'
        });
        const that = this;
        return new Promise((resolve, reject) => {
            options.success = function(result) {
                console.log('reverseGeocoder	>>>	', result)
                if (result.status === 0 && result.message === "query ok") {
                    that.region = result.result.ad_info.city.substr(0, result.result.ad_info.city.indexOf('市'));
                }
                resolve(result);
            }
            options.fail = function(reason) {
                console.error(reason)
                reject(reason);
            }
            qqMapInstance.reverseGeocoder(options);
        });
    }
})