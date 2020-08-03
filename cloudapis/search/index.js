// 云函数入口文件
const FINANCE = require('./category/finance.js')
const STOCK = require('./category/stock.js')
const NOTE = require('./category/note.js')

// 云函数入口函数
exports.main = async (event, context) => {
    const entry = [{
        action: "finance",
        fn: FINANCE.main
    }, {
        action: "stock",
        fn: STOCK.newest
    }, {
        action: "history",
        fn: STOCK.history
    }, {
        action: "note",
        fn: NOTE.main
    }, {
        action: "optional",
        fn: STOCK.optional
    }];

    console.log(event)

    const item = entry.find(item => item.action === event.action)
    const params = event.data ? JSON.parse(decodeURIComponent(event.data)) : {};
    return item ? await item.fn(params) : null;
    // return item ? await item.fn({
    //     keyword: "601398",
    // }) : null;
}