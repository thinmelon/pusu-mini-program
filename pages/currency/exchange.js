// pages/currency/exchange.js
const economic = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        /*	 货币名称	  */
        fromCurrencyName: '美元',
        fromCurrencyCode: 'USD',
        /*	   货币名称	  */
        toCurrencyName: '人民币',
        toCurrencyCode: 'CNY',
        currencyFD: '1',
        /*	 	当前汇率	 */
        result: '',
        /*	 更新时间     */
        updateTime: '',
        /*	 货币列表     */
        // multiCurrencyList: [],
        multiIndex: [1, 0],
		currencyList: [{
			"name": "人民币",
			"code": "CNY"
		}, {
			"name": "美元",
			"code": "USD"
		}, {
			"name": "日元",
			"code": "JPY"
		}, {
			"name": "欧元",
			"code": "EUR"
		}, {
			"name": "英镑",
			"code": "GBP"
		}, {
			"name": "韩元",
			"code": "KRW"
		}, {
			"name": "港币",
			"code": "HKD"
		}, {
			"name": "澳大利亚元",
			"code": "AUD"
		}, {
			"name": "加拿大元",
			"code": "CAD"
		}, {
			"name": "阿尔及利亚第纳尔",
			"code": "DZD"
		}, {
			"name": "阿根廷比索",
			"code": "ARS"
		}, {
			"name": "爱尔兰镑",
			"code": "IEP"
		}, {
			"name": "埃及镑",
			"code": "EGP"
		}, {
			"name": "阿联酋迪拉姆",
			"code": "AED"
		}, {
			"name": "阿曼里亚尔",
			"code": "OMR"
		}, {
			"name": "奥地利先令",
			"code": "ATS"
		}, {
			"name": "澳门元",
			"code": "MOP"
		}, {
			"name": "百慕大元",
			"code": "BMD"
		}, {
			"name": "巴基斯坦卢比",
			"code": "PKR"
		}, {
			"name": "巴拉圭瓜拉尼",
			"code": "PYG"
		}, {
			"name": "巴林第纳尔",
			"code": "BHD"
		}, {
			"name": "巴拿马巴尔博亚",
			"code": "PAB"
		}, {
			"name": "保加利亚列弗",
			"code": "BGN"
		}, {
			"name": "巴西雷亚尔",
			"code": "BRL"
		}, {
			"name": "比利时法郎",
			"code": "BEF"
		}, {
			"name": "冰岛克朗",
			"code": "ISK"
		}, {
			"name": "博茨瓦纳普拉",
			"code": "BWP"
		}, {
			"name": "波兰兹罗提",
			"code": "PLN"
		}, {
			"name": "玻利维亚诺",
			"code": "BOB"
		}, {
			"name": "丹麦克朗",
			"code": "DKK"
		}, {
			"name": "德国马克",
			"code": "DEM"
		}, {
			"name": "法国法郎",
			"code": "FRF"
		}, {
			"name": "菲律宾比索",
			"code": "PHP"
		}, {
			"name": "芬兰马克",
			"code": "FIM"
		}, {
			"name": "哥伦比亚比索",
			"code": "COP"
		}, {
			"name": "古巴比索",
			"code": "CUP"
		}, {
			"name": "哈萨克坚戈",
			"code": "KZT"
		}, {
			"name": "荷兰盾",
			"code": "NLG"
		}, {
			"name": "加纳塞地",
			"code": "GHC"
		}, {
			"name": "捷克克朗",
			"code": "CZK"
		}, {
			"name": "津巴布韦元",
			"code": "ZWD"
		}, {
			"name": "卡塔尔里亚尔",
			"code": "QAR"
		}, {
			"name": "克罗地亚库纳",
			"code": "HRK"
		}, {
			"name": "肯尼亚先令",
			"code": "KES"
		}, {
			"name": "科威特第纳尔",
			"code": "KWD"
		}, {
			"name": "老挝基普",
			"code": "LAK"
		}, {
			"name": "拉脱维亚拉图",
			"code": "LVL"
		}, {
			"name": "黎巴嫩镑",
			"code": "LBP"
		}, {
			"name": "林吉特",
			"code": "MYR"
		}, {
			"name": "立陶宛立特",
			"code": "LTL"
		}, {
			"name": "卢布",
			"code": "RUB"
		}, {
			"name": "罗马尼亚新列伊",
			"code": "RON"
		}, {
			"name": "毛里求斯卢比",
			"code": "MUR"
		}, {
			"name": "蒙古图格里克",
			"code": "MNT"
		}, {
			"name": "孟加拉塔卡",
			"code": "BDT"
		}, {
			"name": "缅甸缅元",
			"code": "BUK"
		}, {
			"name": "秘鲁新索尔",
			"code": "PEN"
		}, {
			"name": "摩洛哥迪拉姆",
			"code": "MAD"
		}, {
			"name": "墨西哥元",
			"code": "MXN"
		}, {
			"name": "南非兰特",
			"code": "ZAR"
		}, {
			"name": "挪威克朗",
			"code": "NOK"
		}, {
			"name": "葡萄牙埃斯库多",
			"code": "PTE"
		}, {
			"name": "瑞典克朗",
			"code": "SEK"
		}, {
			"name": "瑞士法郎",
			"code": "CHF"
		}, {
			"name": "沙特里亚尔",
			"code": "SAR"
		}, {
			"name": "斯里兰卡卢比",
			"code": "LKR"
		}, {
			"name": "索马里先令",
			"code": "SOS"
		}, {
			"name": "泰国铢",
			"code": "THB"
		}, {
			"name": "坦桑尼亚先令",
			"code": "TZS"
		}, {
			"name": "土耳其新里拉",
			"code": "TRY"
		}, {
			"name": "突尼斯第纳尔",
			"code": "TND"
		}, {
			"name": "危地马拉格查尔",
			"code": "GTQ"
		}, {
			"name": "委内瑞拉玻利瓦尔",
			"code": "VEB"
		}, {
			"name": "乌拉圭新比索",
			"code": "UYU"
		}, {
			"name": "西班牙比塞塔",
			"code": "ESP"
		}, {
			"name": "希腊德拉克马",
			"code": "GRD"
		}, {
			"name": "新加坡元",
			"code": "SGD"
		}, {
			"name": "新台币",
			"code": "TWD"
		}, {
			"name": "新西兰元",
			"code": "NZD"
		}, {
			"name": "匈牙利福林",
			"code": "HUF"
		}, {
			"name": "牙买加元",
			"code": "JMD"
		}, {
			"name": "义大利里拉",
			"code": "ITL"
		}, {
			"name": "印度卢比",
			"code": "INR"
		}, {
			"name": "印尼盾",
			"code": "IDR"
		}, {
			"name": "以色列谢克尔",
			"code": "ILS"
		}, {
			"name": "约旦第纳尔",
			"code": "JOD"
		}, {
			"name": "越南盾",
			"code": "VND"
		}, {
			"name": "智利比索",
			"code": "CLP"
		}, {
			"name": "白俄罗斯卢布",
			"code": "BYR"
		}]
    },

    retry: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.getCurrencyList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.queryCurrencyExchange(this.data.fromCurrencyCode, this.data.toCurrencyCode);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 	货币列表
     */
    getCurrencyList: function() {
        const that = this;
        economic.getCurrencyList() // API
            .then(res => {
                console.log(res);
                const data = JSON.parse(res.data);
                if (data.hasOwnProperty('error_code') && data.error_code === 0) {
                    that.setData({
                        currencyList: data.result.list
                    })
                } else {
                    setTimeout(() => {
                        this.getCurrencyList();
                    }, getApp().timeOut); //	如果是503错误（服务器在忙），1秒后发起重试
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	查询实时汇率
     */
    queryCurrencyExchange: function(from, to) {
        const that = this;
        economic.queryCurrencyExchange(from, to) // API
            .then(res => {
                console.log(res);
                const data = JSON.parse(res.data);
                if (data.hasOwnProperty('error_code') && data.error_code === 0) {
                    const result = data.result[0];
                    that.setData({
                        fromCurrencyName: result.currencyF_Name,
                        toCurrencyName: result.currencyT_Name,
                        fromCurrencyCode: result.currencyF,
                        toCurrencyCode: result.currencyT,
                        currencyFD: result.currencyFD,
                        result: result.result,
                        updateTime: result.updateTime
                    })
                    //	如果是503错误（服务器在忙），1秒后发起重试
                } else if (res.statusCode === 503 && this.retry < getApp().maxRetry) {
                    console.log('RETRY >>> ', this.retry);
                    this.retry++;
                    setTimeout(() => {
                        this.queryCurrencyExchange(from, to);
                    }, getApp().timeOut);
                    //  网络出错
                } else {
                    this.retry = 0;
                    wx.showToast({
                        title: data.reason || '未知错误',
                        icon: 'none'
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    bindPickerChange: function(evt) {
        console.log(evt);
        if (evt.currentTarget.dataset.direction === 'from') {
            this.data.multiIndex[0] = evt.detail.value;
        }
        if (evt.currentTarget.dataset.direction === 'to') {
            this.data.multiIndex[1] = evt.detail.value;
        }
        this.setData({
            multiIndex: this.data.multiIndex
        });
        this.queryCurrencyExchange(
            this.data.currencyList[this.data.multiIndex[0]].code,
            this.data.currencyList[this.data.multiIndex[1]].code
        )
    }
})