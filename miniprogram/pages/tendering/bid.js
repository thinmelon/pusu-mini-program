// pages/tendering/bid.js
const __ECONOMIC__ = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        companies: [
            '集团',
            '平潭',
            '福州',
            '厦门',
            '泉州',
            '莆田',
            '三明',
            '南平',
            '龙岩',
            '漳州',
            '宁德'
        ],
        bidAmount: [
            '不限',
            '小于100万',
            '100万至500万',
            '500万至1000万',
            '1000万以上'
        ],
        tenderings: [],
        companyPickerName: '福建广电网络集团',
        bidAmountPickerName: '不限'
    },

    offset: 0, //	偏移量
    itemsPerTime: 10, //	每次获取数量
    minBidAmount: 0, //	最少中标金额
    maxBidAmount: 100000000, //	最多中标金额

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.showTenderings();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
     *  滚动至底部，获取餐馆列表
     */
    onScrollToButtom: function() {
        console.log('======== onScrollToButtom ========')
        this.showTenderings();
    },

    /**
     * 	显示中标结果
     */
    showTenderings: function() {
        this.searchTenderings({
            name: this.data.companyPickerName,
            min: this.minBidAmount,
            max: this.maxBidAmount,
            skip: this.offset,
            limit: this.itemsPerTime
        });
    },

    /**
     * 	搜索中标结果
     */
    searchTenderings: function(request) {
        console.log('>>>>>>>>>>>>> searchTenderings');
        __ECONOMIC__.searchTenderings(request)
            .then(res => {
                console.log(res);
                if (res.statusCode === 200) {
                    if (res.data.code === 0 && res.data.data.tenderings.length > 0) {
                        this.offset += res.data.data.tenderings.length; //	下次获取数据时起点位置
                        this.setData({
                            tenderings: this.data.tenderings.concat(res.data.data.tenderings.map(item => {
                                if (item.announcementDate) {
                                    item.announcementDate = item.announcementDate.substr(0, 10)
                                }
                                if (item.resultDate) {
                                    item.resultDate = item.resultDate.substr(0, 10)
                                }
                                item.supplier = item.supplier.map(value => {
                                    value.price = value.price.toFixed(2);
                                    return value;
                                })
                                return item;
                            }))
                        });
                    }
                } else if (res.statusCode === 503) {
                    setTimeout(() => {
                        this.searchTenderings(request);
                    }, getApp().timeOut); //	如果是503错误（服务器在忙），1秒后发起重试
                } else { //  网络出错
                    wx.showToast({
                        title: '服务器开小差~~',
                        icon: 'none'
                    })
                }

            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 		公司Picker Change
     */
    bindCompanyPickerChange: function(evt) {
        const index = parseInt(evt.detail.value);
        let companyName = '';

        if (index === 0) {
            companyName = '福建广电网络集团';
        } else if (index === 1) {
            companyName = '福建广电网络集团股份有限公司平潭综合实验区分公司';
        } else if (index > 0) {
            companyName = '福建广电网络集团股份有限公司' + this.data.companies[index] + '分公司';
        }

        this.setData({
            tenderings: [], //	清空结果集
            companyPickerName: companyName //	设置Picker内容
        });
        this.offset = 0; // 重置偏移量
        this.showTenderings();
    },

    /**
     * 		中标金额Picker Change
     */
    bindBidAmountPickerChange: function(evt) {
        console.log(evt);
        const index = parseInt(evt.detail.value);
        switch (index) {
            case 1: //	'小于100万',
                this.minBidAmount = 0;
                this.maxBidAmount = 100;
                break;
            case 2: //	'100万至500万',
                this.minBidAmount = 100;
                this.maxBidAmount = 500;
                break;
            case 3: //	'500万至1000万',
                this.minBidAmount = 500;
                this.maxBidAmount = 1000;
                break;
            case 4: //	'1000万以上'
                this.minBidAmount = 1000;
                this.maxBidAmount = 100000000;
                break;
            default: //	'不限',
                this.minBidAmount = 0;
                this.maxBidAmount = 100000000;
                break;
        }

        this.setData({
            tenderings: [], //	清空结果集
            bidAmountPickerName: this.data.bidAmount[index] //	设置Picker内容
        });
        this.offset = 0; // 重置偏移量
        this.showTenderings();
    },

    /**
     *  跳转至微信公众号文章链接
     */
    catchTapTendering: function(evt) {
        console.log(evt);
        const url = evt.currentTarget.dataset.tendering.demo;
        wx.navigateTo({
            url: '/pages/food/article?collection=' + url.substr('http://oss.pusudo.cn/life/'.length, 32) + '&source=' + evt.currentTarget.dataset.tendering.number
        })
    }
})