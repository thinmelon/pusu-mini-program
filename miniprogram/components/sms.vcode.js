// components/sms.vcode.js
Component({
    options: {
        /**
         * isolated 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响（一般情况下的默认值）；
         * apply-shared 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
         * shared 表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 中指定的样式也会影响页面和其他设置了 apply-shared 或 shared 的自定义组件。
         * （这个选项在插件中不可用。）
         */
        styleIsolation: 'apply-shared',
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        //  手机号码
        mobile: {
            type: String,
            value: ''
        },
        //  手机号码是否使能
        isMobileDisabled: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     * - 私有数据，可用于模板渲染
     */
    data: {
        // 组件内部数据
        sendBtnText: '获取验证码', // 发送使能键
        timerId: 0, //  Timer ID
        countDownSeconds: 60, //  倒计时秒数  
        hasSent: false, //  验证码是否已发送 
        requestId: '',
        bizId: '',
        vcode: ''
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    lifetimes: {
        attached: function () { },
        moved: function () { },
        detached: function () { },
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function () { },

    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () { },
        hide: function () { },
        resize: function () { },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //  输入框失焦
        _onInputBlur: function (e) {
            this.data[e.currentTarget.dataset.field] = e.detail.value;

            if (e.currentTarget.dataset.field === "vcode") {
                this.triggerEvent('onReceiveVCode', {
                    requestId: this.data.requestId,
                    bizId: this.data.bizId,
                    mobile: this.data.mobile,
                    vcode: this.data.vcode
                }, {})
            }
        },

        //  校验手机号码有效性
        _checkPhoneValidity: function (phone) {
            const reg = /^1[0-9]{10}$/;
            return reg.test(phone);
        },

        //  清空Timer
        _clearTimer: function () {
            clearInterval(this.data.timerId);
        },

        //  倒计时
        _countDown: function () {
            this._clearTimer();
            this.data.timerId = setInterval(() => {
                this.data.countDownSeconds--;
                if (this.data.countDownSeconds <= 0) {
                    this._clearTimer();
                    this.setData({
                        countDownSeconds: 60,
                        hasSent: false,
                        sendBtnText: '重新发送'
                    })
                } else {
                    this.setData({
                        sendBtnText: `${this.data.countDownSeconds} 秒`
                    });
                }
            }, 1000);
        },

        //  发送验证码
        _onTapSendBtn: function (e) {
            setTimeout(() => {
                if (!this.data.hasSent) {
                    console.log('_onTapSendBtn', e)

                    const that = this;
                    //  校验手机号码的有效性
                    if (this._checkPhoneValidity(this.data.mobile)) {
                        this.setData({
                            hasSent: true
                        });

                        //  调用发送短信验证码的接口
                        wx.cloud.callFunction({
                            name: "sms",
                            data: {
                                action: "trigger",
                                phone: this.data.mobile
                            }
                        })
                            .then(res => {
                                console.log(res)
                                if (res.result && res.result.requestId && res.result.bizId) {
                                    that._countDown();
                                    that.data.requestId = res.result.requestId;
                                    that.data.bizId = res.result.bizId;
                                } else {
                                    wx.showToast({
                                        title: '发送验证码失败',
                                        icon: 'none',
                                        duration: 3000
                                    });
                                }
                            })
                            .catch(err => {
                                console.error(err);
                            })

                    } else {
                        wx.showToast({
                            title: '请输入正确手机号',
                            icon: 'none',
                            duration: 3000
                        });
                    }
                }
            }, 100)
        }

    }
})