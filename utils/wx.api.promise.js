const Promise = require('../lib/es6-promise.js').Promise;

/**
 *  封装
 */
function wxPromisify(fn) {
	return function (options = {}) {
		return new Promise((resolve, reject) => {
			options.success = function (result) {
				resolve(result);
			}
			options.fail = function (reason) {
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
	return wxPromisify(wx.request)({
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
	return wxPromisify(wx.request)({
		url: url,
		method: 'POST',
		data: data,
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
}

function wxGetSystemInfoPromise(){
	return wxPromisify(wx.getSystemInfo)();
}

module.exports = {
	getRequest: wxGetRequestPromise,
	postRequest: wxPostRequestPromise,
	getSystemInfo: wxGetSystemInfoPromise
}
