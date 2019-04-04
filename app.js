//app.js
const __WX_API_PROMISE__ = require('./utils/wx.api.promise.js');
const __USER__ = require('./services/user.service.js');
const __RESOURCE__ = require('./services/resource.service.js');

App({
	isLogIn: true,

    onLaunch: function() {
        let that = this;

        // __WX_API_PROMISE__
        //     .showLoading({ //  开始，显示加载框
        //         title: '玩命加载中',
        //         mask: true
        //     })
        //     .then(__WX_API_PROMISE__.getExtConfig) //	获取第三方平台自定义的数据字段( appid )
        //     .then(config => {
        //         console.log(config);
        //         return new Promise((resolve, reject) => {
        //             if (config.hasOwnProperty('errMsg') && config.errMsg === "getExtConfig: ok") {
        //                 console.log("app.js | userid  ===> ", config.extConfig.userid);
        //                 console.log("app.js | templateid  ===> ", config.extConfig.templateid);
        //                 wx.setStorageSync('__AUTHORIZER_APPID__', config.extConfig.appid || 'wxc91180e424549fbf')
        //                 resolve({
        //                     userid: config.extConfig.userid,
        //                     templateid: config.extConfig.templateid
        //                 });
        //             } else {
        //                 reject(config); //	发生错误
        //             }
        //         });
        //     })
        //     .then(__RESOURCE__.checkTemplateValidity)
        //     .then(validity => {
        //         console.log(validity)
        //         return new Promise((resolve, reject) => {
        //             if (validity.data.code === 0) {
        //                 resolve("OK");
        //             } else {
        //                 reject(validity.data.msg);
        //             }
        //         })
        //     })
        //     .then(that.wxLogin)
        //     .catch(exception => {
        //         console.error('Login failed!')
        //         console.error(exception);
        //     })
        //     .finally(() => {
        //         __WX_API_PROMISE__.hideLoading();
        //     });
    },

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