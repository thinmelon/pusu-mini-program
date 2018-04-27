const uri = require('../utils/uri.constant.js');
const moment = require('../utils/moment/moment.js');
const wxApiPromise = require('../utils/wx.api.promise.js');

/**
 *  中债国债收益率 API
 *  	start: 起始日期
 *  	end:  截止日期
 *      默认取近一月的数据
 */
const getChinaBondYieldRate = (
	start = moment().subtract(1, 'years').format('YYYY/MM/DD'),
	end = moment().format('YYYY/MM/DD')) => {
	const url = uri.getChinaBondYieldRate(encodeURIComponent(start), encodeURIComponent(end));
	return wxApiPromise.getRequest(url, {});
}

module.exports = {
	getChinaBondYieldRate: getChinaBondYieldRate
}