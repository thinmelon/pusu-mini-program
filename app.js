//app.js
const __WX_API_PROMISE__ = require('./utils/wx.api.promise.js');
const __USER__ = require('./services/user.service.js');
const __RESOURCE__ = require('./services/resource.service.js');

App({
    isLogIn: true,
	environment: 'PRODUCTION', //	测试环境：DEBUG		生产环境：PRODUCTION
    timeOut: 1000, //	超时重试：1000毫秒
    markets: [{ //	股票市场
        name: 'A股',
        abbreviation: 'hs',
        icon: '/icons/stock/China.png',
        disabledIcon: '/icons/stock/Grey.png',
        properties: [{
            tapIndex: 0,
            name: '公司资讯',
            url: '/pages/stock/announcement?market=hs'
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
    tags: [{ //	餐馆标签
        name: '小吃简餐',
        icon: '/icons/food/tags/xiaochi.png',
        disabledIcon: '/icons/food/tags/xiaochi_grey.png',
        category: ['小吃', '简餐'],
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
    }, {
        name: '西餐',
        icon: '/icons/food/tags/xican.png',
        disabledIcon: '/icons/food/tags/xican_grey.png',
        category: ['西餐'],
        enable: false
    }, {
        name: '中餐',
        icon: '/icons/food/tags/zhongcan.png',
        disabledIcon: '/icons/food/tags/zhongcan_grey.png',
        category: ['中餐'],
        enable: false
    }, {
        name: '酒吧',
        icon: '/icons/food/tags/jiuba.png',
        disabledIcon: '/icons/food/tags/jiuba_grey.png',
        category: ['酒吧'],
        enable: false
    }],
    // onLaunch: function() {
    //     let that = this;

    //     __WX_API_PROMISE__
    //         .showLoading({ //  开始，显示加载框
    //             title: '玩命加载中',
    //             mask: true
    //         })
    //         .then(__WX_API_PROMISE__.getExtConfig) //	获取第三方平台自定义的数据字段( appid )
    //         .then(config => {
    //             console.log(config);
    //             return new Promise((resolve, reject) => {
    //                 if (config.hasOwnProperty('errMsg') && config.errMsg === "getExtConfig: ok") {
    //                     console.log("app.js | userid  ===> ", config.extConfig.userid);
    //                     console.log("app.js | templateid  ===> ", config.extConfig.templateid);
    //                     wx.setStorageSync('__AUTHORIZER_APPID__', config.extConfig.appid || 'wxc91180e424549fbf')
    //                     resolve({
    //                         userid: config.extConfig.userid,
    //                         templateid: config.extConfig.templateid
    //                     });
    //                 } else {
    //                     reject(config); //	发生错误
    //                 }
    //             });
    //         })
    //         .then(__RESOURCE__.checkTemplateValidity)
    //         .then(validity => {
    //             console.log(validity)
    //             return new Promise((resolve, reject) => {
    //                 if (validity.data.code === 0) {
    //                     resolve("OK");
    //                 } else {
    //                     reject(validity.data.msg);
    //                 }
    //             })
    //         })
    //         .then(that.wxLogin)
    //         .catch(exception => {
    //             console.error('Login failed!')
    //             console.error(exception);
    //         })
    //         .finally(() => {
    //             __WX_API_PROMISE__.hideLoading();
    //         });
    // },

    /**
     * 		第三方登录
     */
    wxLogin: function() {
        let that = this,
            startTime;

        return __WX_API_PROMISE__.login() //	  调用登录接口获取临时登录凭证（code）
            .then(message => {
                console.log(message);
                return new Promise((resolve, reject) => {
                    if (message.hasOwnProperty('errMsg') && message.errMsg === 'login:ok') {
                        startTime = Date.now();
                        resolve({
                            authorizer_appid: wx.getStorageSync('__AUTHORIZER_APPID__'),
                            code: message.code
                        });
                    } else {
                        reject(message); //	发生错误
                    }
                });
            })
            .then(__USER__.userLogin) //  	访问后端，用code获取session key
            .then(result => { //   对结果进行转换
                console.log(result);
                return new Promise((resolve, reject) => {
                    if (result.statusCode === 404) {
                        reject('Not found'); //	发生错误
                    } else if (result.data.hasOwnProperty('errcode') && result.data.errcode !== 0) {
                        reject(result.data); //	发生错误
                    } else if (result.data.hasOwnProperty('code') && result.data.code === 0) {
                        resolve({
                            key: '__KEY__',
                            data: {
                                session: result.data.data.value.session,
                                publicKey: result.data.data.publicKey,
                                //	与服务端的系统时间进行校准
                                //	将请求时间 + 网络延误与系统时间进行比较，计算误差
                                duration: Math.round(result.data.data.serverTime - ((startTime + Date.now()) / 2))
                            }
                        });
                    } else {
                        reject(result.data); //	发生错误
                    }
                });
            })
            .then(__WX_API_PROMISE__.setStorage) //  存入本地
            .then(result => {
                that.isLogIn = true;
                return new Promise((resolve, reject) => {
                    resolve('Log in.')
                })
            });
    }
})