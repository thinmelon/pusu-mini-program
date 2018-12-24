const __URI__ = require('../utils/uri.constant.js');
const __WX_API_PROMISE__ = require('../utils/wx.api.promise.js');

/**
 * 	验证模板有效性
 */
const checkTemplateValidity = (data) => {
	const url = __URI__.checkTemplateValidity();
	console.log('checkTemplateValidity	===> ', url);
	return __WX_API_PROMISE__.postRequest(
		url, {
			user_id: data.userid,
			template_id: data.templateid
		});
}

module.exports = {
	checkTemplateValidity: checkTemplateValidity
}