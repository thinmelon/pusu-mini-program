'use strict';
const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
    console.log("Hello World")
    console.log(event)
    console.log(context)

    const {
        ENV,
        OPENID,
        APPID
    } = cloud.getWXContext()
    console.log(OPENID)

    return {
        sum: event.a + event.b,
        appid: APPID,
        openid: OPENID,
        env: ENV
    }
};