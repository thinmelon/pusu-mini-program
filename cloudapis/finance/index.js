// 云函数入口文件
const estates = require('../finance/api/estates.js')
const available = require('../finance/api/available.js')

// 云函数入口函数
exports.main = async(event, context) => {
    const entry = [{
        action: "estates",
        fn: estates.main
    }, {
        action: "available",
        fn: available.main
    }];

    console.log(event)

    const item = entry.find(item => item.action === event.action)
    const params = event.data ? JSON.parse(decodeURIComponent(event.data)) : {};
    return item ? await item.fn(params) : await available.main();
}