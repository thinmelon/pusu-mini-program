const __RSA__ = require('../lib/wxapp_rsa.js');

function encryptData(data) {
    let encryptRsa = new __RSA__.RSAKey();
    encryptRsa = __RSA__.KEYUTIL.getKey(wx.getStorageSync('__KEY__').publicKey);

    var encStr = encryptRsa.encrypt(JSON.stringify({
        appid: wx.getStorageSync('__AUTHORIZER_APPID__'), //	当前小程序appid
        session: wx.getStorageSync('__KEY__').session, //	 token
        timestamp: Date.now() + wx.getStorageSync('__KEY__').duration, //	时间戳
        data: data //	数据
    }))
    return __RSA__.hex2b64(encStr);
}

module.exports = {
    encryptData: encryptData
}