//index.js
//获取应用实例
const app = getApp()
const wxApiPromise = require('../../utils/wx.api.promise.js');
const economic = require('../../services/economic.service.js');
const chart = require('../../services/chart.service.js');
const config = require('../../services/chart.config.js');

Page({
	data: {
		canvasWidth: '',
		canvasHeight: '',
		canvasId: 'myCanvas',
		canvasOptions: {},
		totalLabels: 0,
		maskerCanvasId: 'myMasker',
		maskerCanvasCtx: undefined,
		maskerLeft: config.leftPadding,
		maskerTop: 0,
		maskerWidth: 0,
		maskerHeight: 0
	},
	onLoad: function () {
		wx.showLoading({ title: '请稍等一会儿', mask: true });
		wxApiPromise
			.getSystemInfo()												  //  获取设备系统信息
			.then(this.setMyCanavsStyle)					    	  //  设置Canvas的样式
			.then(economic.getChinaBondYieldRate)		    //  获取中债国债收益率数据 
			.then(this.showLineChart)								    //  将数据绘制成拆线图
			.then(wxApiPromise.setStorage)							// 将数据保存在本地
			.then(() => {
				wx.hideLoading();
			});
	},
	bindTouchStart: function (e) {
		this.showIndexLine(e);
	},
	bindTouchMove: function (e) {
		this.showIndexLine(e);
	},
	bindTouchEnd: function (e) {
		chart.clearIndexLine(this.maskerCanvasCtx);
	},
	/**
	 *   设置myCanvas的样式 
	 */
	setMyCanavsStyle: function (result) {
		return new Promise((resolve, reject) => {
			this.setData({
				canvasHeight: (result.windowHeight - 2) / 2,
				canvasWidth: result.windowWidth - 2,
				maskerHeight: (result.windowHeight - 2) / 2,
				maskerWidth: result.windowWidth - 2 - config.leftPadding
			})
			resolve();
		});
	},
	/**
	 *   显示拆线图
	 */
	showLineChart: function (result) {
		return new Promise((resolve, reject) => {
			if (result.data.code === 0) {
				//   记录数据数组长度
				this.data.totalLabels = result.data.date.length;
				const margin = [], oneYear = [], tenYear = [], date = [];
				//   计算不同期限的收益率差
				for (let i = 0, length = result.data.date.length; i < length; i++) {
					oneYear[i] = result.data.oneYear[length - 1 - i];
					tenYear[i] = result.data.tenYear[length - 1 - i];
					date[i] = result.data.date[length - 1 - i];
					margin[i] = tenYear[i] - oneYear[i];
				}
				//   绘制
				this.data.canvasOptions = chart.createLineChart({
					canvasId: this.data.canvasId,
					height: this.data.canvasHeight,
					width: this.data.canvasWidth,
					data: [
						{ value: oneYear, legend: '一年期' },
						{ value: tenYear, legend: '十年期' },
						{ value: margin, legend: '利差' }
					],
					labels: date
				});
				resolve({
					key: 'chinaBondYieldRate',
					data: {
						oneYear: oneYear,
						tenYear: tenYear,
						margin: margin,
						date: date
					}
				});
			} else {
				//  TODO: 给出相关错误提示
				reject('Fail');
			}

		});
	},
	showIndexLine: function (e) {
		const index = Math.floor(e.touches[0].x / this.data.canvasOptions.unitX);
		if (index >= 0 && index < this.data.totalLabels) {
			const rate = wx.getStorageSync('chinaBondYieldRate');
			this.maskerCanvasCtx = chart.showIndexLine(
				'myMasker',
				index * this.data.canvasOptions.unitX,
				this.data.canvasHeight,
				[
					rate.oneYear[index],
					rate.tenYear[index],
					rate.margin[index]
				],
				rate.date[index],
				this.data.canvasWidth);
		}
	}
})
