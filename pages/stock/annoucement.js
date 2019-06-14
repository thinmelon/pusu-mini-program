// pages/stock/annoucement.js
const economic = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
	data: {
		announcements: [],
		dividends: [],
		spo: [],
		rationed: [],
		raising: [],
		displayedTags: []
	},

	stockCode: '002281',

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {
		console.log('======== 	onLoad	========')
		this.setData({
			displayedTags: [{
				name: '公告',
				icon: '/icons/stock/_gonggao.png',
				disabledIcon: '/icons/stock/_gonggao_grey.png',
				apiFunc: this.getStockAnnouncement,
				enable: true
			}, {
				name: '分红',
				icon: '/icons/stock/_fenhong.png',
				disabledIcon: '/icons/stock/_fenhong_grey.png',
				apiFunc: this.getStockDividends,
				enable: false
			}, {
				name: '增发',
				icon: '/icons/stock/_zengfa.png',
				disabledIcon: '/icons/stock/_zengfa_grey.png',
				apiFunc: this.getStockSecondaryPublicOffering,
				enable: false
			}, {
				name: '配股',
				icon: '/icons/stock/_peigu.png',
				disabledIcon: '/icons/stock/_peigu_grey.png',
				apiFunc: this.getStockRationedShare,
				enable: false
			}, {
				name: '募集',
				icon: '/icons/stock/_muji.png',
				disabledIcon: '/icons/stock/_muji_grey.png',
				apiFunc: this.getStockRaisingFundUsage,
				enable: false
			}]
		})
	},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
	onReady: function () {
		console.log('======== 	onReady	========')
		this.paintAnnouncement({
			code: this.stockCode
		});
	},

    /**
     * 生命周期函数--监听页面显示
     */
	onShow: function () {

	},

    /**
     * 生命周期函数--监听页面隐藏
     */
	onHide: function () {

	},

    /**
     * 生命周期函数--监听页面卸载
     */
	onUnload: function () {

	},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
	onPullDownRefresh: function () {

	},

    /**
     * 页面上拉触底事件的处理函数
     */
	onReachBottom: function () {

	},

    /**
     * 用户点击右上角分享
     */
	onShareAppMessage: function () {

	},

    /**
     * 	获取公告资讯（近一个月）
     */
	getStockAnnouncement: function (request) {
		economic.getStockAnnouncement(request.code)
			.then(res => {
				console.log(res);
				const data = JSON.parse(res.data);
				if (data.hasOwnProperty('resultcode') && data.resultcode === 200 && data.records.length > 0) {
					this.setData({
						announcements: data.records
					})
				}
			})
			.catch(err => {
				console.error(err);
			})
	},

    /**
     * 	点击公告查看详情
     */
	onAnnouncementClicked: function (evt) {
		console.log(evt);
	},

    /**
     * 	获取上市公司公告资讯
     */
	getStockAnnouncement: function (request) {
		economic.getStockAnnouncement(request.code)
			.then(res => {
				console.log(res);
				const data = JSON.parse(res.data);
				if (data.hasOwnProperty('resultcode') && data.resultcode === 200 && data.records.length > 0) {
					this.setData({
						announcements: data.records
					})
				}
			})
			.catch(err => {
				console.error(err);
			})
	},

    /**
     * 	获取上市公司分红转增
     */
	getStockDividends: function (request) {
		economic.getStockDividends(request.code)
			.then(res => {
				console.log(res);
				const data = JSON.parse(res.data);
				if (data.hasOwnProperty('resultcode') && data.resultcode === 200 && data.records.length > 0) {
					this.setData({
						dividends: data.records
					})
				}
			})
			.catch(err => {
				console.error(err);
			})
	},

    /**
     * 	公司增发股票实施方案
     */
	getStockSecondaryPublicOffering: function (request) {
		economic.getStockSecondaryPublicOffering(request.code)
			.then(res => {
				console.log(res);
				const data = JSON.parse(res.data);
				if (data.hasOwnProperty('resultcode') && data.resultcode === 200 && data.records.length > 0) {
					this.setData({
						spo: data.records
					})
				}
			})
			.catch(err => {
				console.error(err);
			})
	},

    /**
     * 	公司配股实施方案
     */
	getStockRationedShare: function (request) {
		economic.getStockRationedShare(request.code)
			.then(res => {
				console.log(res);
				const data = JSON.parse(res.data);
				if (data.hasOwnProperty('resultcode') && data.resultcode === 200 && data.records.length > 0) {
					this.setData({
						rationed: data.records
					})
				}
			})
			.catch(err => {
				console.error(err);
			})
	},

    /**
     * 	募集资金投资项目计划
     */
	getStockRaisingFundUsage: function (request) {
		economic.getStockRaisingFundUsage(request.code)
			.then(res => {
				console.log(res);
				const data = JSON.parse(res.data);
				if (data.hasOwnProperty('resultcode') && data.resultcode === 200 && data.records.length > 0) {
					this.setData({
						raising: data.records
					})
				}
			})
			.catch(err => {
				console.error(err);
			})
	},

    /**
     *  绘制页面
     */
	paintAnnouncement: function (request) {
		this.data.displayedTags.map(tag => {
			if (tag.enable) {
				tag.apiFunc(request);
			}
		})
	},

    /**
     *  选择类别
     */
	onTagClicked: function (evt) {
		this.setData({
			displayedTags: this.data.displayedTags.map(item => {
				item.enable = (item.name === evt.currentTarget.dataset.name) ? true : false;
				return item;
			})
		});
		this.paintAnnouncement({
			code: this.stockCode
		});
	}
})