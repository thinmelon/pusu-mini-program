// pages/stock/search/search.js
const wxcharts = require('../../../lib/wxcharts.js');

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //  网络规划
        networkDesign: [{
            "code": "002093",
            "name": "国脉科技",
            "market": "深交所"
        }, {
            "code": "002544",
            "name": "杰赛科技",
            "market": "深交所"
        }, {
            "code": "300597",
            "name": "吉大通信",
            "market": "创业板"
        }, {
            "code": "300513",
            "name": "恒实科技",
            "market": "创业板"
        }],
        //  基站天线
        baseStationAntenna: [{
            "code": "002792",
            "name": "通宇通讯",
            "market": "深交所"
        }, {
            "code": "002796",
            "name": "世嘉科技",
            "market": "深交所"
        }, {
            "code": "002229",
            "name": "鸿博股份",
            "market": "深交所"
        }, {
            "code": "002384",
            "name": "东山精密",
            "market": "深交所"
        }, {
            "code": "002475",
            "name": "立讯精密",
            "market": "深交所"
        }],
        //  功放器件
        powerAmplifier: [{
            "code": "300782",
            "name": "卓胜微",
            "market": "创业板"
        }, {
            "code": "603501",
            "name": "韦尔股份",
            "market": "上交所"
        }],
        //  滤波器件
        filtering: [{
            "code": "002194",
            "name": "武汉凡谷",
            "market": "深交所"
        }, {
            "code": "002384",
            "name": "东山精密",
            "market": "深交所"
        }, {
            "code": "002796",
            "name": "世嘉科技",
            "market": "深交所"
        }, {
            "code": "002547",
            "name": "春兴精工",
            "market": "深交所"
        }, {
            "code": "300134",
            "name": "大富科技",
            "market": "创业板"
        }],
        //  其它器件/材料
        otherDevice: [{
            "code": "002935",
            "name": "天奥电子",
            "market": "深交所"
        }, {
            "code": "300414",
            "name": "中光防雷",
            "market": "创业板"
        }, {
            "code": "300615",
            "name": "欣天科技",
            "market": "创业板"
        }, {
            "code": "300731",
            "name": "科创新源",
            "market": "创业板"
        }],
        //  PCB
        pcb: [{
            "code": "002916",
            "name": "深南电路",
            "market": "深交所"
        }, {
            "code": "002463",
            "name": "沪电股份",
            "market": "深交所"
        }, {
            "code": "603228",
            "name": "景旺电子",
            "market": "上交所"
        }, {
            "code": "002938",
            "name": "鹏鼎控股",
            "market": "深交所"
        }, {
            "code": "002815",
            "name": "崇达技术",
            "market": "深交所"
        }, {
            "code": "300476",
            "name": "胜宏科技",
            "market": "创业板"
        }, {
            "code": "600183",
            "name": "生益科技",
            "market": "上交所"
        }, {
            "code": "000823",
            "name": "超声电子",
            "market": "深交所"
        }, {
            "code": "603328",
            "name": "依顿电子",
            "market": "上交所"
        }, {
            "code": "002436",
            "name": "兴森科技",
            "market": "深交所"
        }, {
            "code": "300657",
            "name": "弘信电子",
            "market": "创业板"
        }],
        //  光模块
        lightModule: [{
            "code": "002281",
            "name": "光迅科技",
            "market": "深交所"
        }, {
            "code": "300308",
            "name": "中际旭创",
            "market": "创业板"
        }, {
            "code": "300502",
            "name": "新易盛",
            "market": "创业板"
        }, {
            "code": "300394",
            "name": "天孚通信",
            "market": "创业板"
        }, {
            "code": "300548",
            "name": "博创科技",
            "market": "创业板"
        }, {
            "code": "000988",
            "name": "华工科技",
            "market": "深交所"
        }],
        //  光纤光缆
        fiber: [{
            "code": "600487",
            "name": "亨通光电",
            "market": "上交所"
        }, {
            "code": "000836",
            "name": "富通鑫茂",
            "market": "深交所"
        }, {
            "code": "600498",
            "name": "烽火通信",
            "market": "上交所"
        }, {
            "code": "600522",
            "name": "中天科技",
            "market": "上交所"
        }, {
            "code": "002491",
            "name": "通鼎互联",
            "market": "深交所"
        }, {
            "code": "000070",
            "name": "特发信息",
            "market": "深交所"
        }],
        //  配套设备
        supportingEquipment: [{
            "code": "002364",
            "name": "中恒电气",
            "market": "深交所"
        }, {
            "code": "600405",
            "name": "动力源",
            "market": "上交所"
        }, {
            "code": "002837",
            "name": "英维克",
            "market": "深交所"
        }, {
            "code": "600487",
            "name": "亨通光电",
            "market": "上交所"
        }, {
            "code": "002491",
            "name": "通鼎互联",
            "market": "深交所"
        }, {
            "code": "600522",
            "name": "中天科技",
            "market": "上交所"
        }],
        //  SDN / NFV
        sdn: [{
            "code": "600498",
            "name": "烽火通信",
            "market": "上交所"
        }, {
            "code": "000938",
            "name": "紫光股份",
            "market": "深交所"
        }, {
            "code": "002396",
            "name": "星网锐捷",
            "market": "深交所"
        }, {
            "code": "000063",
            "name": "中兴通讯",
            "market": "深交所"
        }, {
            "code": "603803",
            "name": "瑞斯康达",
            "market": "上交所"
        }],
        //  连接器供应链
        connector: [{
            "code": "002475",
            "name": "立讯精密",
            "market": "深交所"
        }, {
            "code": "300136",
            "name": "信维通信",
            "market": "创业板"
        }, {
            "code": "300602",
            "name": "飞荣达",
            "market": "创业板"
        }, {
            "code": "300322",
            "name": "硕贝德",
            "market": "创业板"
        }, {
            "code": "300679",
            "name": "电连技术",
            "market": "创业板"
        }, {
            "code": "002897",
            "name": "意华股份",
            "market": "深交所"
        }, {
            "code": "300115",
            "name": "长盈精密",
            "market": "创业板"
        }, {
            "code": "002179",
            "name": "中航光电",
            "market": "深交所"
        }, {
            "code": "002055",
            "name": "得润电子",
            "market": "深交所"
        }, {
            "code": "002025",
            "name": "航天电器",
            "market": "深交所"
        }],
        //  小基站
        smallBaseStation: [{
            "code": "600198",
            "name": "大唐电信",
            "market": "上交所"
        }, {
            "code": "002313",
            "name": "日海智能",
            "market": "深交所"
        }, {
            "code": "300312",
            "name": "邦讯技术",
            "market": "创业板"
        }, {
            "code": "603322",
            "name": "超讯通信",
            "market": "上交所"
        }, {
            "code": "300366",
            "name": "创意信息",
            "market": "创业板"
        }, {
            "code": "603803",
            "name": "瑞斯康达",
            "market": "上交所"
        }],
        //  站址
        ironTower: [{
            "code": "00788",
            "name": "中国铁塔",
            "market": "联交所"
        }, {
            "code": "603679",
            "name": "华体科技",
            "market": "上交所"
        }],
        //  传输设备
        transferDevice: [{
            "code": "600498",
            "name": "熄火通信",
            "market": "上交所"
        }, {
            "code": "000063",
            "name": "中兴通讯",
            "market": "深交所"
        }],
        //  网络优化
        networkOptimization: [{
            "code": "300050",
            "name": "世纪鼎利",
            "market": "创业板"
        }, {
            "code": "002115",
            "name": "三维通信",
            "market": "深交所"
        }, {
            "code": "300025",
            "name": "华星创业",
            "market": "创业板"
        }, {
            "code": "002465",
            "name": "海格通信",
            "market": "深交所"
        }, {
            "code": "300560",
            "name": "中富通",
            "market": "创业板"
        }, {
            "code": "603559",
            "name": "中通国脉",
            "market": "上交所"
        }],
        //  手机镜头
        phoneCamera: [
            //  图像传感器
            {
                "code": "603501",
                "name": "韦尔股份", //  由台积电（16%）、中芯国际（8%）与华力微电子（5%）代工
                "market": "上交所"
            },
            //  镜头
            {
                "code": "02382",
                "name": "舜宇光学",
                "market": "联交所"
            }, {
                "code": "02018",
                "name": "瑞声科技",
                "market": "联交所"
            }, {
                "code": "002456",
                "name": "欧菲光",
                "market": "深交所"
            }, {
                "code": "01478",
                "name": "丘钛科技",
                "market": "联交所"
            }, {
                "code": "002217",
                "name": "合力泰",
                "market": "深交所"
            }, {
                "code": "002036",
                "name": "联创电子",
                "market": "深交所"
            }, {
                "code": "002845",
                "name": "同兴达",
                "market": "深交所"
            }
        ],
        //  LED 屏幕
        led: [{
            "code": "600703",
            "name": "三安光电",
            "market": "上交所"
        }, {
            "code": "002429",
            "name": "兆驰股份",
            "market": "深交所"
        }, {
            "code": "300323",
            "name": "华灿光电",
            "market": "创业板"
        }, {
            "code": "300102",
            "name": "乾照光电",
            "market": "创业板"
        }, {
            "code": "002449",
            "name": "国星光电",
            "market": "深交所"
        }, {
            "code": "300303",
            "name": "聚飞光电",
            "market": "创业板"
        }, {
            "code": "300219",
            "name": "鸿利智汇",
            "market": "创业板"
        }, {
            "code": "300241",
            "name": "瑞丰光电",
            "market": "创业板"
        }, {
            "code": "000725",
            "name": "京东方A",
            "market": "深交所"
        }, {
            "code": "000050",
            "name": "深天马A",
            "market": "深交所"
        }, {
            "code": "000100",
            "name": "TCL科技",
            "market": "深交所"
        }, {
            "code": "002587",
            "name": "奥拓电子",
            "market": "深交所"
        }, {
            "code": "300232",
            "name": "洲明科技",
            "market": "创业板"
        }, {
            "code": "300296",
            "name": "利亚德",
            "market": "创业板"
        }, {
            "code": "300088",
            "name": "长信科技",
            "market": "创业板"
        }],
        //  手机终端
        phoneTerminal: [{
            "code": "002138",
            "name": "顺络电子",
            "market": "深交所"
        }, {
            "code": "300319",
            "name": "麦捷科技",
            "market": "创业板"
        }, {
            "code": "000829",
            "name": "天音控股",
            "market": "深交所"
        }, {
            "code": "002416",
            "name": "爱施德",
            "market": "深交所"
        }, {
            "code": "002902",
            "name": "铭普光磁",
            "market": "深交所"
        }, {
            "code": "002885",
            "name": "京泉华",
            "market": "深交所"
        }, {
            "code": "300433",
            "name": "蓝思科技",
            "market": "创业板"
        }, {
            "code": "300408",
            "name": "三环集团",
            "market": "创业板"
        }, {
            "code": "300207",
            "name": "欣旺达",
            "market": "创业板"
        }, {
            "code": "600745",
            "name": "闻泰科技",
            "market": "上交所"
        }],
        //  芯片
        chip: [{
            "code": "300458",
            "name": "全志科技",
            "market": "创业板"
        }, {
            "code": "300223",
            "name": "北京君正",
            "market": "创业板"
        }, {
            "code": "000938",
            "name": "紫光展锐",
            "market": "深交所"
        }, {
            "code": "603160",
            "name": "汇顶科技",
            "market": "上交所"
        }, {
            "code": "000997",
            "name": "新大陆",
            "market": "深交所"
        }, {
            "code": "002151",
            "name": "北斗星通",
            "market": "深交所"
        }, {
            "code": "002156",
            "name": "通富微电",
            "market": "深交所"
        }, {
            "code": "002185",
            "name": "华天科技",
            "market": "深交所"
        }, {
            "code": "600584",
            "name": "长电科技",
            "market": "上交所"
        }, {
            "code": "300493",
            "name": "润欣科技",
            "market": "创业板"
        }, {
            "code": "300184",
            "name": "力源信息",
            "market": "创业板"
        }, {
            "code": "300007",
            "name": "汉威科技",
            "market": "创业板"
        }, {
            "code": "002241",
            "name": "歌尔股份",
            "market": "深交所"
        }, {
            "code": "000988",
            "name": "华工科技",
            "market": "深交所"
        }, {
            "code": "600460",
            "name": "士兰微",
            "market": "上交所"
        }, {
            "code": "002414",
            "name": "高德红外",
            "market": "深交所"
        }, {
            "code": "002079",
            "name": "苏州固碍",
            "market": "深交所"
        }, {
            "code": "300456",
            "name": "耐威科技",
            "market": "创业板"
        }, {
            "code": "002011",
            "name": "盾安环境",
            "market": "深交所"
        }],
        //  智能表计
        sensor: [{
            "code": "300066",
            "name": "三川智慧",
            "market": "创业板"
        }, {
            "code": "603700",
            "name": "宁波水表",
            "market": "上交所"
        }, {
            "code": "300349",
            "name": "金卡智能",
            "market": "创业板"
        }, {
            "code": "300259",
            "name": "新天科技",
            "market": "创业板"
        }, {
            "code": "300371",
            "name": "汇中股份",
            "market": "创业板"
        }, {
            "code": "300552",
            "name": "万集科技",
            "market": "创业板"
        }],
        //  MCU/电子标签/SIM卡/eSIM
        eSim: [{
            "code": "002139",
            "name": "拓邦股份",
            "market": "深交所"
        }, {
            "code": "002402",
            "name": "和而泰",
            "market": "深交所"
        }, {
            "code": "002161",
            "name": "远望谷",
            "market": "深交所"
        }, {
            "code": "300098",
            "name": "高新兴",
            "market": "创业板"
        }, {
            "code": "300078",
            "name": "思创医惠",
            "market": "创业板"
        }, {
            "code": "002017",
            "name": "东信和平",
            "market": "深交所"
        }, {
            "code": "002049",
            "name": "紫光国微",
            "market": "深交所"
        }, {
            "code": "002104",
            "name": "恒宝股份",
            "market": "深交所"
        }, {
            "code": "300205",
            "name": "天喻信息",
            "market": "创业板"
        }],
        //  通信模组
        communicationModules: [{
            "code": "603236",
            "name": "移远通信",
            "market": "上交所"
        }, {
            "code": "002313",
            "name": "日海智能",
            "market": "深交所"
        }, {
            "code": "300590",
            "name": "移为通信",
            "market": "创业板"
        }, {
            "code": "300638",
            "name": "广和通",
            "market": "创业板"
        }, {
            "code": "002402",
            "name": "和而泰",
            "market": "深交所"
        }, {
            "code": "002881",
            "name": "美格智能",
            "market": "深交所"
        }],
        //  应用使能平台
        platform: [{
            "code": "300310",
            "name": "宜通世纪",
            "market": "创业板"
        }, {
            "code": "002313",
            "name": "日海智能",
            "market": "深交所"
        }, {
            "code": "002402",
            "name": "和而泰",
            "market": "深交所"
        }, {
            "code": "002355",
            "name": "兴民智通",
            "market": "深交所"
        }],
        //  系统集成与应用服务
        application: [{
            "code": "002396",
            "name": "星网锐捷",
            "market": "深交所"
        }, {
            "code": "300007",
            "name": "汉威科技",
            "market": "创业板"
        }, {
            "code": "300098",
            "name": "高新兴",
            "market": "创业板"
        }, {
            "code": "300353",
            "name": "东土科技",
            "market": "创业板"
        }, {
            "code": "002439",
            "name": "启明星辰",
            "market": "深交所"
        }, {
            "code": "002405",
            "name": "四维图新",
            "market": "深交所"
        }, {
            "code": "300369",
            "name": "绿盟科技",
            "market": "创业板"
        }],
        //  车载摄像头/镜头
        carCamera: [{
            "code": "002036",
            "name": "联创电子",
            "market": "深交所"
        }, {
            "code": "02382",
            "name": "舜宇光学",
            "market": "联交所"
        }, {
            "code": "002920",
            "name": "德赛西威",
            "market": "深交所"
        }, {
            "code": "002456",
            "name": "欧菲光",
            "market": "深交所"
        }, {
            "code": "01478",
            "name": "丘钛科技",
            "market": "联交所"
        }, {
            "code": "002906",
            "name": "华阳集团",
            "market": "深交所"
        }, {
            "code": "600699",
            "name": "均胜电子",
            "market": "上交所"
        }],
        //  小家电
        homeAppliances: [{
            "code": "002242",
            "name": "九阳股份",
            "market": "深交所"
        }, {
            "code": "002705",
            "name": "新宝股份",
            "market": "深交所"
        }, {
            "code": "002959",
            "name": "小熊电器",
            "market": "深交所"
        }, {
            "code": "002032",
            "name": "苏泊尔",
            "market": "深交所"
        }],
        //  特别关注
        optionals: []
    },

    lineCanvases: [{
        _id: "aStockMarketAccount",
        value: "aStockMarketAccount",
        name: "A股市场股票账户数",
        unit: "万户",
        subIndex: [{
            name: "新增账户数",
            value: "newInvestors"
        }],
        handler: null
    }],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            search: this.search.bind(this)
        })
    },

    onReady: function() {
        this.getStockMarketAccountStatistic()
        this.getOptionals()
    },

    /**
     *  搜索
     */
    search: function(value) {
        console.log('Search >>> ', value)
        return app.wxp.cloud.callFunction({
                name: 'search',
                data: {
                    action: 'stock',
                    data: encodeURIComponent(JSON.stringify({
                        keyword: value
                    }))
                }
            })
            .then(res => {
                console.log(res)
                return new Promise((resolve, reject) => {
                    if (res.result.list && res.result.list.length > 0) {
                        resolve(
                            res.result.list.map(item => {
                                return {
                                    text: item.result.name,
                                    value: item.result.code
                                }
                            }))
                    } else {
                        resolve([])
                    }
                })
            })
    },

    /**
     *  选择搜索结果
     */
    onSearchResultSelected: function(e) {
        console.log('select result', e.detail)
        wx.navigateTo({
            url: '/pages/stock/stock?code=' + e.detail.item.value,
        })
    },

    /**
     *  点击显示详情处理逻辑
     */
    onCanvasTouched: function(e) {
        const target = this[e.target.dataset.category].find(canvas => {
            return canvas._id === e.target.dataset.id
        })
        // console.log(target)

        target.handler.showToolTip(e, {
            // background: '#7cb5ec',
            format: function(item, category) {
                // console.log(item)
                return '[' + category + ']' + item.name + ':' + item.data + target.unit
            }
        });
    },

    onCellTap: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/stock/stock?code=' + e.currentTarget.dataset.code,
        })
    },

    /**
     *      获取A股市场股票账户数
     */
    getStockMarketAccountStatistic: function() {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'market'
                }
            })
            .then(res => {
                console.log('getStockMarketAccountStatistic >>> ', res)
                if (res.result.data && res.result.data.length > 0) {
                    this.createLineCanvas(res.result.data)
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    createLineCanvas: function(target) {
        this.lineCanvases = this.lineCanvases.map(canvas => {
            const categories = [];
            const series = [];

            /** X坐标数据源 */
            target.map(item => {
                categories.push(item._id);
            })
            /** Y坐标数据源 */
            canvas.subIndex.map(field => {
                series.push({
                    name: field.name,
                    data: target.map(item => {
                        return item.day[0][field.value] || 0
                    }),
                    format: function(val, name) {
                        return val;
                    }
                })
            })

            /** 绘制图表 */
            canvas.handler = new wxcharts({
                canvasId: canvas._id,
                type: 'line',
                categories: categories,
                series: series,
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    min: 0
                },
                animation: false,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: false,
                dataPointShape: false,
                extra: {
                    lineStyle: 'curve'
                }
            });

            return canvas
        });
    },

    /**
     *      获取自选股
     */
    getOptionals: function() {
        app.wxp.cloud.callFunction({
                name: 'search',
                data: {
                    action: 'optional'
                }
            })
            .then(res => {
                console.log('getOptionals >>> ', res)
                if (res.result.list && res.result.list.length > 0) {
                    this.setData({
                        optionals: res.result.list.map(item => {
                            return {
                                name: item.result.name,
                                code: item.result.code
                            }
                        })
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
})