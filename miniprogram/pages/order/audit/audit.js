// pages/order/audit/audit.js
const app = getApp()

Page({

    /**
     *  页面的初始数据
     */
    data: {
        order: {}, //  订单
        formData: {
            totalFee: "", //  订单金额 
            refundFee: 0, //  退款金额 
            penalty: 0, //  违约金
            rejectMsg: "" // 拒绝理由
        },
        rules: [{
            name: 'totalFee',
            rules: [{
                required: true,
                message: '请输入订单金额'
            }],
        }]
    },

    /**
     *  生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options._)
        const _ = JSON.parse(decodeURIComponent(options._));
        this.outTradeNo = _.outTradeNo
        this.outRefundNo = _.outRefundNo
        this.getOrder(this.outTradeNo)
    },

    /**
     *  获取订单详情
     */
    getOrder: function(outTradeNo) {
        app.wxp.cloud.callFunction({
                name: "database",
                data: {
                    collection: "_order",
                    where: encodeURIComponent(JSON.stringify({
                        _id: outTradeNo
                    })),
                    skip: 0,
                    limit: 1
                }
            })
            .then(res => {
                console.log(res)
                if (res.result.data && res.result.data.length > 0) {
                    const order = res.result.data[0];
                    //  订单状态为 CHECK
                    if (order.status === 1) {
                        this.setData({
                            order: order,
                            [`formData.totalFee`]: order.totalFee
                        })
                    }
                    //  订单状态为 REFUND
                    else if (order.status === 4) {
                        const refund = order.refund.find(item => {
                            return item.outRefundNo === this.outRefundNo
                        })

                        this.setData({
                            order: order,
                            [`formData.totalFee`]: order.totalFee,
                            [`formData.refundFee`]: refund.refundFee,
                            [`formData.penalty`]: refund.penalty || 0
                        })
                    }
                    // 都不是则跳转至订单列表页
                    else {

                    }


                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  输入框失去焦点时触发
     *  event.detail = {value: value}
     */
    onAuditInputBlur(e) {
        console.log(e)
        const {
            field
        } = e.currentTarget.dataset

        if (field === "totalFee") {
            this.setData({
                [`formData.${field}`]: e.detail.value * 100
            })
        } else {
            this.setData({
                [`formData.${field}`]: e.detail.value
            })
        }

    },

    onTap: function(e) {
        //  通过光标失焦事件获取控件的输入值，当响应其它控件的点击事件时，可能出现未及时取得值的情况
        //  延时 100 毫秒后响应
        setTimeout(() => {
            this.wrapper(e);
        }, 100);
    },

    wrapper: function(e) {
        console.log(e);
        //  订单状态为 CHECK
        if (this.data.order.status === 1) {
            this.check(e)
        }
        //  订单状态为 REFUND
        else if (this.data.order.status === 4) {
            this.refund(e)
        }

    },

    /**
     *  审核订单
     */
    check: function(e) {
        //  初步验证各步骤提交数据的有效性
        this.selectComponent("#audit")
            .validate((valid, errors) => {
                if (!valid) {
                    const firstError = Object.keys(errors)
                    if (firstError.length) {
                        this.setData({
                            error: errors[firstError[0]].message
                        })
                    }
                }
            })
            .then(() => {
                const code = parseInt(e.detail.target.dataset.answer);
                const fee = parseInt(this.data.formData.totalFee);
                if (code === 1 && this.data.formData.rejectMsg === "") {
                    this.setData({
                        error: "请输入拒绝理由"
                    })
                } else if (!fee) {
                    this.setData({
                        error: "请输入有效的订单金额"
                    })
                } else {
                    app.wxp.cloud.callFunction({
                            name: "order",
                            data: {
                                action: "audit",
                                data: encodeURIComponent(JSON.stringify({
                                    status: this.data.order.status,
                                    code: code,
                                    message: this.data.formData.rejectMsg || "剧团已接单",
                                    outTradeNo: this.data.order._id, //   outTradeNo
                                    totalFee: fee, //  修改价格
                                    openid: this.data.order.openid, //  客户openid
                                    formId: e.detail.formId, //  表单ID
                                    troupeName: this.data.order.troupeName //  剧团名称
                                }))
                            }
                        })
                        .then(res => {
                            console.log(res)
                            this.goNext();
                        })
                        .catch(err => {
                            console.error(err)
                            this.goNext();
                        })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  审核退款单
     */
    refund: function(e) {
        const code = parseInt(e.detail.target.dataset.answer);

        if (code === 1 && this.data.formData.rejectMsg === "") {
            this.setData({
                error: "请输入拒绝理由"
            })
        } else {
            app.wxp.cloud.callFunction({
                    name: "order",
                    data: {
                        action: "audit",
                        data: encodeURIComponent(JSON.stringify({
                            status: this.data.order.status, //  订单状态
                            code: code, //  审核结果
                            outTradeNo: this.outTradeNo, //   订单编号 
                            outRefundNo: this.outRefundNo, //   退款单号
                            totalFee: this.data.order.totalFee, //  订单金额
                            refundFee: parseInt(this.data.formData.refundFee), //  退款金额
                            penalty: parseInt(this.data.formData.penalty), //  违约金
                            message: this.data.formData.rejectMsg || "剧团同意退款", //  拒绝理由 
                            openid: this.data.order.openid, //  客户openid
                            formId: e.detail.formId //  表单ID
                        }))
                    }
                })
                .then(res => {
                    console.log(res)
                    this.goNext();
                })
                .catch(err => {
                    console.error(err)
                    this.goNext();
                })
        }
    },

    goNext: function() {
        wx.redirectTo({
            url: '/pages/order/list/list',
        })
    }

})