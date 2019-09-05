// pages/stock/pledge.js
const economic = require('../../services/economic.service.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //	持股
        number: [],
        controller: [],
        concentration: [],
        holder: [],
        float: [],
        //	增减持
        change: [],
        manager: [],
        date: [],
        //	质押
        pledges: [],
        //	冻结
        freeze: [],
        //	解禁
        lifting: [],
        restricted: [],
        //	标签
        displayedTags: []
    },

    stockCode: '',
    retry: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options);
        this.stockCode = options.code;
        this.setData({
            displayedTags: [{
                name: '持股',
                icon: '/icons/stock/_gubenjiegou.png',
                disabledIcon: '/icons/stock/_gubenjiegou_grey.png',
                apiFuncs: [
                    this.getStockHolderNumber,
                    this.getStockHolderController,
                    // this.getStockHolderConcentration,
                    this.getStockHolder,
                    this.getStockFloatHolder
                ],
                enable: true
            }, {
                name: '增减持',
                icon: '/icons/stock/_guquanbiangeng.png',
                disabledIcon: '/icons/stock/_guquanbiangeng_grey.png',
                apiFuncs: [
                    this.getStockHolderChange,
                    this.getStockHolderManagerChange,
                    this.getStockHolderChangeDate
                ],
                enable: false
            }, {
                name: '质押',
                icon: '/icons/stock/_guquanchuzhi.png',
                disabledIcon: '/icons/stock/_guquanchuzhi_grey.png',
                apiFuncs: [
                    this.getStockSharePledge
                ],
                enable: false
            }, {
                name: '冻结',
                icon: '/icons/stock/_jingyingyichang.png',
                disabledIcon: '/icons/stock/_jingyingyichang_grey.png',
                apiFuncs: [
                    this.getStockFreeze
                ],
                enable: false
            }, {
                name: '解禁',
                icon: '/icons/stock/_huanbenqueren.png',
                disabledIcon: '/icons/stock/_huanbenqueren_grey.png',
                apiFuncs: [
                    this.getStockLiftingDate,
                    this.getStockRestrictedListDate
                ],
                enable: false
            }]
        })
        wx.setNavigationBarTitle({
            title: options.title
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // console.log('======== 	onReady	========')
        this.paint({
            code: this.stockCode
        });
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
        console.log("======= onPullDownRefresh =======");
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
     * 	十大股东持股情况
     */
    getStockHolder: function(request) {
        economic.getStockHolder(request.code)
            .then(res => {
                this.resultHandler('holder', res, this.getStockHolder, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	十大流通股东持股情况
     */
    getStockFloatHolder: function(request) {
        economic.getStockFloatHolder(request.code)
            .then(res => {
                this.resultHandler('float', res, this.getStockFloatHolder, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	公司股东人数
     */
    getStockHolderNumber: function(request) {
        economic.getStockHolderNumber(request.code)
            .then(res => {
                this.resultHandler('number', res, this.getStockHolderNumber, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	股东持股集中度
     */
    getStockHolderConcentration: function(request) {
        economic.getStockHolderConcentration(request.code)
            .then(res => {
                this.resultHandler('concentration', res, this.getStockHolderConcentration, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	公司股东实际控制人
     */
    getStockHolderController: function(request) {
        economic.getStockHolderController(request.code)
            .then(res => {
                this.resultHandler('controller', res, this.getStockHolderController, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	公司股本变动
     */
    getStockHolderChange: function(request) {
        economic.getStockHolderChange(request.code)
            .then(res => {
                this.resultHandler('change', res, this.getStockHolderChange, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	上市公司高管持股变动
     */
    getStockHolderManagerChange: function(request) {
        economic.getStockHolderManagerChange(request.code)
            .then(res => {
                this.resultHandler('manager', res, this.getStockHolderManagerChange, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	股东增（减）持情况
     */
    getStockHolderChangeDate: function(request) {
        economic.getStockHolderChangeDate(request.code)
            .then(res => {
                this.resultHandler('date', res, this.getStockHolderChangeDate, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	获取公司股权质押
     */
    getStockSharePledge: function(request) {
        economic.getStockSharePledge(request.code)
            .then(res => {
                this.resultHandler('pledges', res, this.getStockSharePledge, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	公司股东股份冻结
     */
    getStockFreeze: function(request) {
        economic.getStockFreeze(request.code)
            .then(res => {
                this.resultHandler('freeze', res, this.getStockFreeze, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	受限股份实际解禁日期
     */
    getStockLiftingDate: function(request) {
        economic.getStockLiftingDate(request.code)
            .then(res => {
                this.resultHandler('lifting', res, this.getStockLiftingDate, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	受限股份流通上市日期
     */
    getStockRestrictedListDate: function(request) {
        economic.getStockRestrictedListDate(request.code)
            .then(res => {
                this.resultHandler('restricted', res, this.getStockRestrictedListDate, request);
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	处理返回结果
     */
    resultHandler: function(key, res, callback, params) {
        console.log(res);
        if (res.statusCode === 200) {
            this.retry = 0;
            const data = JSON.parse(res.data);
            if (data.hasOwnProperty('resultcode') && data.resultcode === 200) {
                if (data.records.length > 0) {
                    let value = {};
                    value[key] = data.records;
                    this.setData(value);
                } else { //  返回的记录数组为空
                    wx.showToast({
                        title: '不存在相关记录',
                        icon: 'none'
                    })
                }
            } else { //  API调用失败
                wx.showToast({
                    title: data.resultmsg,
                    icon: 'none'
                })
            }
        } else if (res.statusCode === 503 && this.retry < getApp().maxRetry) {
            console.log('RETRY >>> ', this.retry);
            this.retry++;
            setTimeout(() => {
                callback(params);
            }, getApp().timeOut); //	如果是503错误（服务器在忙），1秒后发起重试
        } else { //  网络出错
            this.retry = 0;
            wx.showToast({
                title: '服务器开小差~~',
                icon: 'none'
            })
        }
    },

    /**
     *  绘制页面
     */
    paint: function(request) {
        this.data.displayedTags.map(tag => {
            if (tag.enable && tag.apiFuncs && tag.apiFuncs.length > 0) {
                tag.apiFuncs.map(apiFunc => {
                    apiFunc(request);
                })
            }
        })
    },

    /**
     *  选择类别
     */
    onTagClicked: function(evt) {
        this.setData({
            displayedTags: this.data.displayedTags.map(item => {
                item.enable = (item.name === evt.currentTarget.dataset.name) ? true : false;
                return item;
            })
        });
        this.paint({
            code: this.stockCode
        });
    }
})