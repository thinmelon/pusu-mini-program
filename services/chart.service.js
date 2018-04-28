const wxApiPromise = require('../utils/wx.api.promise.js');
const config = require('./chart.config.js');

/**
 *   初始化
 */
function init(context, options) {
	//  设置坐标轴区域大小
	const axisWidth = options.width - config.leftPadding;
	const axisHeight = options.height - config.reduceAxisY;
	//  绘制X坐标轴
	context.moveTo(config.leftPadding, options.height);
	context.lineTo(options.width, options.height);
	context.stroke();
	//  绘制Y坐标轴
	context.moveTo(config.leftPadding, config.topMarginAxisY);
	context.lineTo(config.leftPadding, options.height);
	context.stroke();
	//  绘制格子线
	context.beginPath();
	context.setStrokeStyle('#F0F0F0');
	context.moveTo(config.leftPadding, config.topMarginAxisY);
	context.lineTo(options.width, config.topMarginAxisY);
	context.stroke();

	for (let i = 1; i < config.portion; i++) {
		const spaceY = (options.height - config.topMarginAxisY) / config.portion;
		context.moveTo(config.leftPadding, i * spaceY + config.topMarginAxisY);
		context.lineTo(options.width, i * spaceY + config.topMarginAxisY);
		context.stroke();

		const spaceX = (options.width - config.leftPadding) / config.portion;
		context.moveTo(i * spaceX + config.leftPadding, config.topMarginAxisY);
		context.lineTo(i * spaceX + config.leftPadding, options.height);
		context.stroke();
	}

	return {
		axisWidth: axisWidth,
		axisHeight: axisHeight
	}
}

/**
 *   绘制图例
 */
function drawLegend(context, legend, index) {
	context.setStrokeStyle(config.getRandomColor());
	context.moveTo(config.leftPadding, config.legendPadding * index);
	context.lineTo(config.leftPadding + config.legendLineWidth, config.legendPadding * index);
	context.setFontSize(config.legendFontSize);
	context.setTextAlign('left');
	context.setTextBaseline('middle');
	context.fillText(legend, config.leftPadding * 2 + config.legendLineWidth, config.legendPadding * index);
}

/**
 *  创建拆线图
 *  		 canvasId 
 */
function createLineChart(options) {
	// console.log(options);
	// 初始化
	const ctx = wx.createCanvasContext(options.canvasId)
	const axis = init(ctx, options);
	//  计算Y轴数组中最大值、最小值
	let max = [], min = [];
	for (let i = 0; i < options.data.length; i++) {
		max[i] = Math.max.apply(null, options.data[i].value);
		min[i] = Math.min.apply(null, options.data[i].value);
	}
	const maxValue = Math.max.apply(null, max);
	const minValue = Math.min.apply(null, min);
	//  设置坐标轴单位大小
	const unitX = axis.axisWidth / options.labels.length;
	const unitY = axis.axisHeight / (maxValue - minValue);
	//  绘制
	for (let k = 0; k < options.data.length; k++) {
		ctx.beginPath();
		// 图例
		drawLegend(ctx, options.data[k].legend, k + 1);
		for (let i = 0, length = options.data[k].value.length; i < length; i++) {
			const startY = axis.axisHeight - (options.data[k].value[i] - minValue) * unitY + config.topMarginAxisY;
			// 连接点
			// ctx.fillRect(config.leftPadding + i * unitX, startY, 3, 3);
			if (i + 1 < length) {
				// 连接线
				const endY = axis.axisHeight - (options.data[k].value[i + 1] - minValue) * unitY + config.topMarginAxisY;
				ctx.moveTo(config.leftPadding + i * unitX, startY);
				ctx.lineTo(config.leftPadding + (i + 1) * unitX, endY);
				ctx.stroke();
			}
		}
	}
	ctx.draw();
	return {
		unitX: unitX
	};
}

function showIndexLine(canvasid, spacing, length, rate, label, locationX) {
	const context = wx.createCanvasContext(canvasid)
	context.beginPath();
	context.setStrokeStyle(config.indexLineColor);
	context.moveTo(spacing, config.topMarginAxisY);
	context.lineTo(spacing, length);
	context.stroke();

	context.setFontSize(config.legendFontSize);
	context.setTextAlign('center');
	context.setTextBaseline('middle');
	for (let index = 0; index < rate.length; index++) {
		context.strokeText(rate[index], locationX / 2, config.legendPadding * (index + 1));
	}

	context.setFontSize(config.labelFontSize);
	context.setTextAlign('right');
	context.setTextBaseline('middle');
	context.strokeText(label, locationX - config.rightPadding, config.legendPadding)
	context.draw();
	return context;
}

function clearIndexLine(context) {
	context.draw();
}

module.exports = {
	createLineChart: createLineChart,
	showIndexLine: showIndexLine,
	clearIndexLine: clearIndexLine
}