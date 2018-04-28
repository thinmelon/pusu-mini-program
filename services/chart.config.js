function getRandomColor() {
	return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
}

module.exports = {
	leftPadding: 5,							// 坐标轴左部边距
	rightPadding: 15,							// 右部边距
	reduceAxisY: 100,			 			// 坐标轴Y的预留空间
	topMarginAxisY: 50,		  			// 点坐标Y值的顶部边距，值小于预留空间
	legendLineWidth: 30,				// 图例示例线长度
	legendPadding: 11,			 			// 图例间隔
	legendFontSize: 9,			  			// 图例字体大小
	portion: 10,								// 格子线份数
	indexLineColor: '#990000',			// 指示线颜色
	labelFontSize: 13,							// Label字体大小
	getRandomColor: getRandomColor
}