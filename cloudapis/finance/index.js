// 云函数入口文件
const estates = require('../finance/api/estates.js')

// 云函数入口函数
exports.main = async(event, context) => {
    const entry = [{
        action: "estates",
        fn: estates.main
    }];

    console.log(event)

    const item = entry.find(item => item.action === event.action)
    const params = event.data ? JSON.parse(decodeURIComponent(event.data)) : {};
    return item ? await item.fn(params) : null;
}