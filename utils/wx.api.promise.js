const Promise = require('../lib/es6-promise.js').Promise;

/**
 *  封装
 */
function Promisify(fn) {
    return function(options = {}) {
        return new Promise((resolve, reject) => {
            options.success = function(result) {
                resolve(result);
            }
            options.fail = function(reason) {
                reject(reason);
            }
            fn(options);
        });
    }
}

//无论promise对象最后状态如何都会执行
// Promise.prototype.finally = function (callback) {
// 	let P = this.constructor;
// 	return this.then(
// 		value => P.resolve(callback()).then(() => value),
// 		reason => P.resolve(callback()).then(() => { throw reason })
// 	);
// };

/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function wxGetRequestPromise(url, data) {
    return Promisify(wx.request)({
        url: url,
        method: 'GET',
        data: data,
        header: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 微信请求post方法封装
 */
function wxPostRequestPromise(url, data) {
    return Promisify(wx.request)({
        url: url,
        method: 'POST',
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

/**
 * 微信请求delete方法封装
 */
function wxDeleteRequestPromise(url, data) {
    return Promisify(wx.request)({
        url: url,
        method: 'DELETE',
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

/**
 * 获取系统信息
 * brand	手机品牌	1.5.0
 * model	手机型号
 * pixelRatio	设备像素比
 * screenWidth	屏幕宽度	1.1.0
 * screenHeight	屏幕高度	1.1.0
 * windowWidth	可使用窗口宽度
 * windowHeight	可使用窗口高度
 * statusBarHeight	状态栏的高度	1.9.0
 * language	微信设置的语言
 * version	微信版本号
 * system	操作系统版本
 * platform	客户端平台
 * fontSizeSetting	用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px	1.5.0
 * SDKVersion	客户端基础库版本
 */
function wxGetSystemInfoPromise() {
    return Promisify(wx.getSystemInfo)();
}

/**
 * 本地存储
 * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
 */
function wxSetStoragePromise(data) {
    wx.removeStorageSync(data.key);
    return Promisify(wx.setStorage)(data);
}

function wxGetStoragePromise(data) {
    return Promisify(wx.getStorage)(data);
}

/**
 * 调用接口wx.login() 获取临时登录凭证（code）
 */
function wxLoginPromise() {
    return Promisify(wx.login)();
}

/**
 * 	  显示加载框
 */
function wxShowLoadingPromise(options) {
    return Promisify(wx.showLoading)(options);
}

/**
 *    关闭加载框
 */
function wxHideLoadingPromise() {
    return Promisify(wx.hideLoading)();
}

/**
 *    显示模态对话框
 */
function wxShowModalPromise(options) {
    return Promisify(wx.showModal)(options);
}

/**
 * 	获取第三方平台自定义的数据字段
 */
function wxGetExtConfigPromise(options) {
    return Promisify(wx.getExtConfig)();
}

/**
 *  获取当前的地理位置、速度
 */
function wxGetLocationPromise() {
    return Promisify(wx.getLocation)();
}

module.exports = {
    login: wxLoginPromise,
    getRequest: wxGetRequestPromise,
    postRequest: wxPostRequestPromise,
    deleteRequest: wxDeleteRequestPromise,
    getSystemInfo: wxGetSystemInfoPromise,
    setStorage: wxSetStoragePromise,
    getStorage: wxGetStoragePromise,
    showLoading: wxShowLoadingPromise,
    showModal: wxShowModalPromise,
    hideLoading: wxHideLoadingPromise,
    getExtConfig: wxGetExtConfigPromise,
    getLocation: wxGetLocationPromise
}