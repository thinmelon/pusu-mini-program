// pages/order/create/create.js
import FormValidator from './validator.js'

const app = getApp()

const SubmitTemplateId = "QaY75X_jKWzByvh3ZCrRGBnHqttneFqTbpuQQUPPnnM";
const SubmitSubscribeId = "e9FCrh1H6cexbD6MhAlN8t6RWi6kolPfk-C3pkVjhqY";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageType: 0, //  0: 模板消息 1: 订阅消息

        step: 1, //  计步数
        /**
         *  表单ID
         */
        formID: [
            "", '#contact', '#primary', '#secondary'
        ],

        /**
         *  表单数据
         */
        formData: {
            //  步骤一 - 手机号
            customer: "",
            mobile: "",
            //  步骤二 - 主要信息
            troupeName: "",
            dramaDate: [],
            dramaAddress: "",
            //  步骤三 - 次要信息
            preferred: [],
            stage: false,
            basePrice: 0,
            totalFee: 0
        },

        /**
         *  各步骤的表单校验规则
         */
        contactRules: [{
            name: 'customer',
            rules: [{
                required: true,
                message: '联系人必填'
            }, {
                maxlength: 64,
                message: '名称长度不得超过64个字符'
            }],
        }],
        //  主要信息
        primaryRules: [{
            name: "troupeName",
            rules: [{
                validator: FormValidator.troupeName,
                message: '请选择剧团'
            }]
        }, {
            name: "dramaDate",
            rules: [{
                validator: FormValidator.dramaDate,
                message: '请选择演出日期'
            }]
        }, {
            name: "dramaAddress",
            rules: [{
                validator: FormValidator.dramaAddress,
                message: '请选择演出地点'
            }]
        }],
        //  次要信息
        secondaryRules: []
    },

    _id: "",

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.hasOwnProperty('_')) {
            const _ = JSON.parse(options._);
            console.log(_);
            this._id = _._id;
            this.setData({
                [`formData.troupeName`]: _.name,
                [`formData.basePrice`]: _.basePrice
            });
        }
        //  清空Storage内的缓存数据
        wx.clearStorage();
    },

    onShow: function() {
        app.wxp.getStorage({
                key: "__SCHEDULING__"
            })
            .then(res => {
                this.setData({
                    [`formData.dramaDate`]: res.data,
                    [`formData.totalFee`]: res.data.length * this.data.formData.basePrice
                });
            })
            .catch(err => {
                console.error(err)
            })

        app.wxp.getStorage({
                key: "__DRAMA__"
            })
            .then(res => {
                this.setData({
                    [`formData.preferred`]: res.data
                });
            })
            .catch(err => {
                console.error(err)
            })

    },

    /**
     *  输入框失去焦点时触发
     *  event.detail = {value: value}
     */
    onContactInputBlur(e) {
        const {
            field
        } = e.currentTarget.dataset
        this.setData({
            [`formData.${field}`]: e.detail.value
        })
    },

    /**
     *  验证码输入框失焦事件
     */
    onReceiveVCode(e) {
        this.sms = e.detail;
        this.setData({
            [`formData.mobile`]: this.sms.mobile
        });
    },

    /**
     *  处理演出日期的点击事件
     */
    onDramaDateTap(e) {
        console.log(e)
        wx.navigateTo({
            url: "/pages/order/scheduling/scheduling?_=" + e.currentTarget.dataset.name
        })
    },

    /**
     *  处理演出地点的点击事件
     */
    onDramaAddressTap(e) {
        app.wxp.chooseLocation()
            .then(res => {
                console.log(res)
                if (res.errMsg === "chooseLocation:ok") {
                    this.setData({
                        [`formData.dramaAddress`]: res.address
                    });
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  选择心仪剧目
     */
    onDramaListTap(e) {
        console.log(e);
        wx.navigateTo({
            url: `/pages/order/drama/drama?_=${JSON.stringify({
                _id: this._id
            })}`,
        })
    },

    /**
     *  是否自有戏台
     */
    onStageChanged(e) {
        this.setData({
            [`formData.stage`]: e.detail.value
        });
    },

    /**
     *  上一步
     */
    prevStep: function() {
        this.setData({
            step: this.data.step - 1
        })
    },

    /**
     *  下一步
     */
    nextStep: function() {
        //  通过光标失焦事件获取控件的输入值，当响应其它控件的点击事件时，可能出现未及时取得值的情况
        //  延时 100 毫秒后响应
        setTimeout(() => {
            this.wrapper();
        }, 100)
    },

    wrapper: function() {
        //  初步验证各步骤提交数据的有效性
        this.selectComponent(this.data.formID[this.data.step])
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
            .then(res => {
                console.log(res)
                if (res.isValid) {
                    //  步骤一
                    if (this.data.step === 1) {
                        this.sms.action = "check";
                        console.log(this.sms)
                        //  验证手机号的有效性
                        app.wxp.cloud.callFunction({
                                name: "sms",
                                data: this.sms
                            })
                            .then(validity => {
                                console.log(validity);
                                //  验证码核实无误，下一步
                                if (validity.result.errMsg === "OK") {
                                    this.setData({
                                        step: this.data.step + 1
                                    })
                                } else {
                                    this.setData({
                                        error: validity.result.errMsg
                                    })
                                }
                            })
                    } else {
                        this.setData({
                            step: this.data.step + 1
                        })
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  创建订单
     */
    createOrder: function(e) {
        console.log(e)
        // this.data.formData.createTime = new Date(); //  创建时间
        this.data.formData.formId = e.detail.formId; // 表单ID
        this.data.formData.totalFee = parseInt(this.data.formData.totalFee * 100); // 订单金额单位转换为分
        //  订单金额有效，则发起创建订单的流程
        if (this.data.formData.totalFee && this.data.formData.totalFee > 0) {
            app.wxp.cloud.callFunction({
                    name: "order",
                    data: {
                        action: "create",
                        data: encodeURIComponent(JSON.stringify(this.data.formData))
                    }
                })
                .then(res => {
                    console.log(res)
                    //  清空 storage
                    wx.clearStorage()
                    wx.redirectTo({
                        url: '/pages/order/list/list',
                    })
                })
                .catch(err => {
                    console.error(err)
                    wx.clearStorage()
                })
        }
    },

    /**
     *  发送订阅消息
     */
    submitSubscribeMessage: function(e) {
        wx.requestSubscribeMessage({
            tmplIds: [SubmitSubscribeId],
            success: res => {
                console.log(res)
                wx.cloud.callFunction({
                    name: 'callOpenAPI',
                    data: {
                        action: 'sendSubscribeMessage',
                        page: 'pages/order/order',
                        data: {
                            //  订单编号
                            character_string1: {
                                value: '20191020000001',
                            },
                            //  订单状态
                            thing2: {
                                value: '已下单',
                            },
                            //  时间
                            time3: {
                                value: '2019/10/21 15:06:01',
                            },
                            //  温馨提示
                            thing4: {
                                value: '订单已下单成功',
                            }
                        },
                        templateId: SubmitSubscribeId
                    },
                    success: res => {
                        console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
                    },
                    fail: err => {
                        console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
                    }
                })
            },
            fail: err => {
                console.error(err)
            }
        })


    }
})