const pay = require('./pay.js')
const wxpayService = require('../wxchat.pay/wxchat.pay.service.js')

async function main(request) {
    try {
        const order = await wxpayService.queryOrder(request);
        const result = await pay.paySuccess(order);
        return result;
    } catch (err) {
        console.error(err)
        return err
    };
}

module.exports = {
    main
}