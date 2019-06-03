const __URI__ = require('../utils/uri.constant.js');
const __WX_API_PROMISE__ = require('../utils/wx.api.promise.js');

/**
 * 	获取餐馆列表
 */
const getRestaurants = () => {
  return __WX_API_PROMISE__.getRequest(__URI__.getRestaurants(), {});
}

const bindTag = (id, tag) => {
  return __WX_API_PROMISE__.postRequest(__URI__.bindTag(), {
    id: id,
    tag: tag
  });
}

module.exports = {
  getRestaurants: getRestaurants,
  bindTag: bindTag
}