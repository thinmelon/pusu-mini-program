const pay = require('./pay.js')
const wxpayConfig = require('../wxchat.pay/wechat.pay.config.js')
const wxpayService = require('../wxchat.pay/wxchat.pay.service.js')

async function main(request) {
    let orders, refunds;
    try {
        //  未支付订单
        orders = await pay.getOrders({
            where: { 
                "status": wxpayConfig.__ORDER_STATUS__.NOTPAY
            }
        });
        //  退款订单
        refunds = await pay.getOrders({
            where: {
                "status": wxpayConfig.__ORDER_STATUS__.REFUND,
                "refund.status": wxpayConfig.__REFUND_STATUS__.REFUNDING
            }
        });
    } catch (err) {
        return err;
    }

    /**
     *  处理所有的未支付订单
     */
    if (orders.data && orders.data.length > 0) {
        for (let i = 0; i < orders.data.length; i++) {
            try {
                const order = await wxpayService.queryOrder({
                    outTradeNo: orders.data[i]._id
                });

                //  分若干种情况进行处理
                console.log('wxpayService.queryOrder >>>> ', order)
                //  第一种： 用户已支付成功     trade_state: SUCCESS
                let result = await pay.paySuccess(order);
                console.log('pay.paySuccess >>>> ', result)
                //  第二种： 用户已超时未支付   trade_state: NOTPAY
                //  从剧团同意时间开始计算，超过两小时未付款
                result = await pay.payExpire(order);
                console.log('pay.payExpire >>>> ', result)
                //  第三种： 订单已关闭        trade_state: CLOSED
                result = await pay.alreadyClosed(order);
                console.log('pay.alreadyClosed >>>> ', result)
            } catch (err) {
                //  第四种： 剧团同意后用户一直未支付   err_code: 'ORDERNOTEXIST'
                err.out_trade_no = orders.data[i]._id;
                result = await pay.payExpire(err);
                console.log('pay.payExpire >>>> ', result)
            }
        }
    }

    /**
     *  处理所有已发起退款的订单
     */
    if (refunds.data && refunds.data.length > 0) {
        for (let i = 0; i < refunds.data.length; i++) {
            try {
                const order = refunds.data[i];
                const refund = await wxpayService.queryRefund({
                    out_trade_no: order._id
                });
                //  成功退款
                const result = await pay.refundSuccess(order, refund)
                console.log('pay.refundSuccess >>>> ', result)
            } catch (err) {
                console.error(err)
            }
        }
    }

    return "本次任务已完成"
}

module.exports = {
    main
}