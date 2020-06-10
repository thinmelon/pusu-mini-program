// 云函数入口文件
const create = require('./api/create.js')
const audit = require('./api/audit.js')
const submit = require('./api/submit.js')
const query = require('./api/query.js')
const close = require('./api/close.js')
const repay = require('./api/repay.js')
const trigger = require('./api/trigger.js')
const refund = require('./api/refund.js')
const list = require('./api/list.js')

// 云函数入口函数
exports.main = async(event, context) => {
    const entry = [{
            action: "create",
            fn: create.main
        },
        {
            action: "submit",
            fn: submit.main
        },
        {
            action: "audit",
            fn: audit.main
        },
        {
            action: "query",
            fn: query.main
        },
        {
            action: "close",
            fn: close.main
        },
        {
            action: "repay",
            fn: repay.main
        },
        {
            action: "refund",
            fn: refund.main
        },
        {
            action: "list",
            fn: list.main
        }
    ];

    console.log(event)

    const item = entry.find(item => item.action === event.action)
    const params = event.data ? JSON.parse(decodeURIComponent(event.data)) : {};
    return item ? await item.fn(params) : await trigger.main();
    // return item ? await item.fn({
    //     status: 1,
    //     code: 0,
    //     outTradeNo: "66c996965dde39fb00bae95762d16073",
    //     totalFee: 99
    // }) : null;

    // return item ? await item.fn({
    //     status: 4,
    //     code: 0,
    //     outTradeNo: "9937ce8a5ddb8abc0042a93a29ebb79b",
    //     outRefundNo: "sfRVwYsH6l2SdI8iGfPiSRGgmilW6zdP",
    //     openid: "on7MR5Xmqfv_Da3PdrhCVXybZuLU",
    //     formId: "222",
    //     totalFee: 300,
    //     refundFee: 1,
    //     penalty: 1,
    //     message: "行程冲突"
    //     // troupeName: "莆田市荔城区莆仙戏二团戏剧有限公司"
    // }) : null;
}