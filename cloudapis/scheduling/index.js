// 云函数入口文件
const add = require('./api/add.js')
const remove = require('./api/remove.js')
const troupe = require('./api/troupe.js')

// 云函数入口函数
exports.main = async(event, context) => {
    const entry = [{
            action: "add",
            fn: add.main
        },
        {
            action: "remove",
            fn: remove.main
        },
        {
            action: "troupe",
            fn: troupe.main
        }
    ];

    console.log(event)

    const item = entry.find(item => item.action === event.action)
    const params = event.data ? JSON.parse(decodeURIComponent(event.data)) : {};
    return item ? await item.fn(params) : null;
    // return item ? await item.fn({
    //     outTradeNo: "66c996965dde39fb00bae95762d16073"
    //     // troupeName: "莆田市荔城区莆仙戏二团戏剧有限公司"
    // }) : null;
}