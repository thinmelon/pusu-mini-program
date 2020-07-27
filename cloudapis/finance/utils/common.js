const URL = require('./url.js')
const CONFIG = require('./config.js')
const HTTP_CLIENT = require('./http.client.js')

/**
 *      获取 巨潮资讯网 ACCESS TOKEN
 * 
 * 通过POST方式请求 http://webapi.cninfo.com.cn/api-cloud-platform/oauth2/token 接口
 * 传入 我的凭证 下面二个参数client_id=Access Key的值，client_secret=Access Secret的值来获取token
 * 
 */
async function getCNInfoAPIOauthToken() {
    const data = {
        grant_type: 'client_credentials',
        client_id: CONFIG.CNINFO_ACCESS_KEY,
        client_secret: CONFIG.CNINFO_ACCESS_SECRET
    };

    const result = await HTTP_CLIENT.postPromisify(
        URL.CNINFO_API_HOST,
        80,
        URL.CNINFO_API_OAUTH_TOKEN_PATH,
        data);

    return JSON.parse(result);
}

module.exports = {
    getCNInfoAPIOauthToken
}