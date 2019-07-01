const __URI__ = require('../utils/uri.constant.js');
const __WX_API_PROMISE__ = require('../utils/wx.api.promise.js');

/**
 * 	获取餐馆列表
 */
const getRestaurants = (request) => {
  return __WX_API_PROMISE__.postRequest(__URI__.getRestaurants(), request);
}

/**
 *  搜索餐馆
 */
const searchRestaurants = (request) => {
  return __WX_API_PROMISE__.postRequest(__URI__.searchRestaurants(), request);
}


/**
 * 	获取标签列表
 */
const getTags = () => {
  return __WX_API_PROMISE__.getRequest(__URI__.getTags(), {});
}

/**
 * 	绑定标签
 */
const bindTag = (id, tag) => {
  return __WX_API_PROMISE__.postRequest(__URI__.bindTag(), {
    id: id,
    tag: tag
  });
}

/**
 * 	移除标签
 */
const removeTag = (id, tag) => {
  return __WX_API_PROMISE__.deleteRequest(__URI__.removeTag(id, encodeURIComponent(tag)), {});
}

module.exports = {
  getRestaurants: getRestaurants,
  searchRestaurants: searchRestaurants,
  getTags: getTags,
  bindTag: bindTag,
  removeTag: removeTag
}