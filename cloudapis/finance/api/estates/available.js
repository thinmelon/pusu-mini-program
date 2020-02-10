const UTIL = require('util');
const AXIOS = require('axios')
const CHEERIO = require('cheerio')
const MOMENT = require('moment')
const CLOUD = require('wx-server-sdk')
const ESTATES = require('./estates.js')
const URL = require('../../utils/url.js')
const CONFIG = require('../../utils/config.js')

// 初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = CLOUD.database()

// 数据库查询更新指令对象
const _ = db.command

/**
 *          项目分页
 */
async function grabProjectPaging(district) {
    const uri = UTIL.format(URL.AVAILABLE_FOR_SALE, encodeURIComponent(district))
    console.log("URL  >>>>  ", uri)
    const response = await AXIOS.get(uri)

    if (response.status === 200) {
        const $ = CHEERIO.load(response.data, {
            xml: {
                normalizeWhitespace: true
            }
        });
        //  获取总分页数
        const target = $('.info')
        const count = parseInt(target.text().split('/')[1].split('页'))

        for (let i = 1; i <= count; i++) {
            await db.collection('_task')
                .add({
                    data: {
                        rank: 2,
                        subject: CONFIG.SUBJECT,
                        category: 'COLLECTION',
                        district: district,
                        href: UTIL.format(URL.AVAILABLE_FOR_SALE_PAGING, i, encodeURIComponent(district)),
                        status: 0,
                        addTime: new Date()
                    }
                })
        }
    } else {
        throw new Error("无法获取可售楼盘分页信息")
    }
}

/**
 *          项目列表
 */
async function grabProjectList(project) {
    console.log("URL  >>>>  ", project.href)
    const response = await AXIOS.get(project.href)

    if (response.status === 200) {
        let projects = []
        const $ = CHEERIO.load(response.data, {
            xml: {
                normalizeWhitespace: true
            }
        });
        const target1 = $('table a')
        target1.map((i, ele) => {
            const name = ele.children[0].data
            const href = ele.attribs.href
            const options = href ? href.split('?') : []
            const params = options.length === 2 ? options[1].split('=') : []
            const projectID = params.length === 2 ? params[1] : ''

            projects.push({
                projectID,
                name,
                href: URL.BUREAU_HOUSING_HOST + href
            })
        })
        console.log(projects)

        for (let i = 0; i < projects.length; i++) {
            await db.collection('_task')
                .add({
                    data: {
                        rank: 3,
                        subject: CONFIG.SUBJECT,
                        category: 'PROJECT',
                        projectID: projects[i].projectID,
                        name: projects[i].name,
                        district: project.district,
                        href: projects[i].href,
                        status: 0,
                        addTime: new Date()
                    }
                })
        }
    } else {
        throw new Error("无法获取可售楼盘列表信息")
    }
}

/**
 *          项目信息
 */
async function grabProjectInfo(info) {
    console.log("URL  >>>>  ", info.href)
    const response = await AXIOS.get(info.href);

    if (response.status === 200) {
        const $ = CHEERIO.load(response.data, {
            xml: {
                normalizeWhitespace: true
            }
        });
        const target = $('table tr')
        const _id = info.projectID //  ID
        const project = {
            district: info.district, //  所在行政区域
            leader: target.eq(0).children('td').eq(1).text(), //  公司名称
            name: target.eq(0).children('td').eq(3).text(), //  项目名称
            license: target.eq(1).children('td').eq(1).text(), //  预售许可证
            phone: target.eq(1).children('td').eq(3).text(), //  售楼电话
            address: target.eq(2).children('td').eq(1).text(), //  项目坐落
            use: target.eq(3).children('td').eq(1).text(), //  规划用途
            plotRatio: target.eq(6).children('td').eq(1).text(), //  容积率
            greeningRate: target.eq(6).children('td').eq(3).text(), //  绿地率
            buildingDensity: target.eq(7).children('td').eq(1).text(), //  建筑密度

            availableNumberHousing: parseInt(target.eq(13).children('td').eq(1).text()), //  住宅可售套数
            availableAreaHousing: parseFloat(target.eq(13).children('td').eq(2).text()), //  住宅可售面积
            availableNumberBusiness: parseInt(target.eq(13).children('td').eq(3).text()), //  商业可售套数
            availableAreaBusiness: parseFloat(target.eq(13).children('td').eq(4).text()), //  商业可售面积
            availableNumberOffice: parseInt(target.eq(13).children('td').eq(5).text()), //  写字楼可售套数
            availableAreaOffice: parseFloat(target.eq(13).children('td').eq(6).text()), //  写字楼可售面积
            availableNumberGarage: parseInt(target.eq(13).children('td').eq(7).text()), //  车库可售套数
            availableAreaGarage: parseFloat(target.eq(13).children('td').eq(8).text()), //  车库可售面积
            availableNumberOther: parseInt(target.eq(13).children('td').eq(9).text()), //  其它可售套数
            availableAreaOther: parseFloat(target.eq(13).children('td').eq(10).text()), //  其它可售面积

            soldNumberHousing: parseInt(target.eq(14).children('td').eq(1).text()), //  住宅已售套数
            soldAreaHousing: parseFloat(target.eq(14).children('td').eq(2).text()), //  住宅已售面积
            soldNumberBusiness: parseInt(target.eq(14).children('td').eq(3).text()), //  商业已售套数
            soldAreaBusiness: parseFloat(target.eq(14).children('td').eq(4).text()), //  商业已售面积
            soldNumberOffice: parseInt(target.eq(14).children('td').eq(5).text()), //  写字楼已售套数
            soldAreaOffice: parseFloat(target.eq(14).children('td').eq(6).text()), //  写字楼已售面积
            soldNumberGarage: parseInt(target.eq(14).children('td').eq(7).text()), //  车库已售套数
            soldAreaGarage: parseFloat(target.eq(14).children('td').eq(8).text()), //  车库已售面积
            soldNumberOther: parseInt(target.eq(14).children('td').eq(9).text()), //  其它已售套数
            soldAreaOther: parseFloat(target.eq(14).children('td').eq(10).text()) //  其它已售面积
        }
        //  获取项目坐落位置的坐标
        const qqMap = UTIL.format(
            'https://apis.map.qq.com/ws/geocoder/v1/?address=%s&region=%s&key=%s',
            encodeURIComponent(project.address + project.name),
            encodeURIComponent('莆田'),
            'MWXBZ-GUH6V-3M6P3-U75XD-TMEQH-HZB4U')
        console.log("URL  >>>>  ", qqMap)
        const geo = await AXIOS.get(qqMap)

        if (geo.data.message === "query ok" && geo.data.result && geo.data.result.location) {
            project.location = geo.data.result.location
        }

        const one = await db.collection('_project')
            .where({
                _id
            })
            .get()
        //  判断是否为首次抓取
        if (one.data && one.data.length === 1) {
            //  更新
            return await db.collection('_project')
                .doc(_id)
                .update({
                    data: project
                })
        } else {
            //  新增，并添加楼盘信息抓取任务
            project.buildings = []

            for (let i = 0, length = $('table a').length; i < length; i++) {
                const buildingName = $('table a').eq(i).text()
                const buildingHref = URL.BUREAU_HOUSING_HOST + $('table a').eq(i).attr('href')
                console.log(buildingName, buildingHref)
                project.buildings.push({
                    name: buildingName,
                    href: buildingHref
                })
            }
            //  先添加项目信息
            await db.collection('_project')
                .doc(_id)
                .set({
                    data: project
                })
            //  再添加抓取任务
            for (let i = 0, length = project.buildings.length; i < length; i++) {
                await db.collection('_task')
                    .add({
                        data: {
                            rank: 4,
                            subject: CONFIG.SUBJECT,
                            category: 'BUILDING',
                            name: project.buildings[i].name,
                            href: project.buildings[i].href,
                            projectID: info.projectID,
                            status: 0,
                            addTime: new Date()
                        }
                    })
            }
        }
    } else {
        throw new Error("无法获取可售楼盘项目信息")
    }
}

/**
 *          项目预售信息（幢号）
 */
async function grabBuildingInfo(building) {
    console.log("URL  >>>>  ", building.href)
    const response = await AXIOS.get(building.href);
    // console.log(response);

    if (response.status === 200) {
        const $ = CHEERIO.load(response.data, {
            xml: {
                normalizeWhitespace: true
            }
        });

        const target = $('table tr')
        await db.collection('_project')
            .where({
                "_id": building.projectID,
                "buildings.name": building.name
            })
            .update({
                data: {
                    "buildings.$.floors": parseInt(target.eq(3).children('td').eq(0).text()), //  总层数
                    "buildings.$.area": parseFloat(target.eq(3).children('td').eq(1).text()), //  总面积
                    "buildings.$.availableNumberHousing": parseInt(target.eq(8).children('td').eq(1).text()), //  住宅可售套数
                    "buildings.$.availableAreaHousing": parseFloat(target.eq(8).children('td').eq(2).text()), //  住宅可售面积
                    "buildings.$.availableNumberBusiness": parseInt(target.eq(8).children('td').eq(3).text()), //  商业可售套数
                    "buildings.$.availableAreaBusiness": parseFloat(target.eq(8).children('td').eq(4).text()), //  商业可售面积
                    "buildings.$.availableNumberOffice": parseInt(target.eq(8).children('td').eq(5).text()), //  写字楼可售套数
                    "buildings.$.availableAreaOffice": parseFloat(target.eq(8).children('td').eq(6).text()), //  写字楼可售面积
                    "buildings.$.availableNumberGarage": parseInt(target.eq(8).children('td').eq(7).text()), //  车库可售套数
                    "buildings.$.availableAreaGarage": parseFloat(target.eq(8).children('td').eq(8).text()), //  车库可售面积
                    "buildings.$.availableNumberOther": parseInt(target.eq(8).children('td').eq(9).text()), //  其它可售套数
                    "buildings.$.availableAreaOther": parseFloat(target.eq(8).children('td').eq(10).text()), //  其它可售面积

                    "buildings.$.soldNumberHousing": parseInt(target.eq(9).children('td').eq(1).text()), //  住宅已售套数
                    "buildings.$.soldAreaHousing": parseFloat(target.eq(9).children('td').eq(2).text()), //  住宅已售面积
                    "buildings.$.soldNumberBusiness": parseInt(target.eq(9).children('td').eq(3).text()), //  商业已售套数
                    "buildings.$.soldAreaBusiness": parseFloat(target.eq(9).children('td').eq(4).text()), //  商业已售面积
                    "buildings.$.soldNumberOffice": parseInt(target.eq(9).children('td').eq(5).text()), //  写字楼已售套数
                    "buildings.$.soldAreaOffice": parseFloat(target.eq(9).children('td').eq(6).text()), //  写字楼已售面积
                    "buildings.$.soldNumberGarage": parseInt(target.eq(9).children('td').eq(7).text()), //  车库已售套数
                    "buildings.$.soldAreaGarage": parseFloat(target.eq(9).children('td').eq(8).text()), //  车库已售面积
                    "buildings.$.soldNumberOther": parseInt(target.eq(9).children('td').eq(9).text()), //  其它已售套数
                    "buildings.$.soldAreaOther": parseFloat(target.eq(9).children('td').eq(10).text()), //  其它已售面积

                    "buildings.$.averagePriceHousing": parseFloat(target.eq(10).children('td').eq(1).text()), //  住宅成交均价(元/㎡)
                    "buildings.$.averagePriceBusiness": parseFloat(target.eq(10).children('td').eq(2).text()),
                    "buildings.$.averagePriceOffice": parseFloat(target.eq(10).children('td').eq(3).text()),
                    "buildings.$.averagePriceGarage": parseFloat(target.eq(10).children('td').eq(4).text()),
                    "buildings.$.averagePriceOther": parseFloat(target.eq(10).children('td').eq(5).text())
                }
            })

    } else {
        throw new Error("无法获取可售楼盘幢号信息")
    }
}

/**
 *  获取项目
 */
async function getProjects(field, where, skip, limit, sort1, sortOption1, sort2, sortOption2) {
    return await db.collection('_project')
        //  指定返回字段
        .field(field)
        //  指定筛选条件
        .where(where)
        //  最多添加两项排序规则
        .orderBy(sort1, sortOption1)
        .orderBy(sort2, sortOption2)
        //  指定查询返回结果时从指定序列后的结果开始返回，用于分页
        .skip(skip)
        //  指定查询结果集数量上限
        .limit(limit)
        .get()
}

async function main(request) {
    const result = await getProjects(
        request.field || {},
        request.where || {},
        parseInt(request.skip) || 0,
        parseInt(request.limit) || 20,
        request.sort1 || "mock",
        request.sortOption1 || "asc",
        request.sort2 || "mock",
        request.sortOption2 || "desc");

    // const result = grabProjectInfo({
    //     projectID: "PT-1527-01",
    //     href: "http://110.89.45.7:8082/House/ProjectInfo?ProjectId=PT-1527-01",
    //     district: "城厢区"

    // })

    // const result = await db.collection('_task')
    //     .where({
    //         "category": "PROJECT"
    //     })
    //     .update({
    //         data: {
    //             "status": 0
    //         }
    //     })

    return result;
}

module.exports = {
    grabProjectPaging,
    grabProjectList,
    grabProjectInfo,
    grabBuildingInfo,
    main
}