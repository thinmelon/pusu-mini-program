const util = require('util');
const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')
const cloud = require('wx-server-sdk')
const url = require('../utils/url.js')


// 初始化 cloud
cloud.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command


/**
 *          项目分页
 */
async function grabProjectPaging(district) {
    const uri = util.format(url.AVAILABLE_FOR_SALE, encodeURIComponent(district))
    console.log("URL  >>>>  ", uri)
    const response = await axios.get(uri)
    // console.log(response)
    if (response.status === 200) {
        const $ = cheerio.load(response.data, {
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
                        category: 'COLLECTION',
                        district: district,
                        href: util.format(url.AVAILABLE_FOR_SALE_PAGING, i, encodeURIComponent(district)),
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
    const response = await axios.get(project.href)

    if (response.status === 200) {
        let projects = []
        const $ = cheerio.load(response.data, {
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
                href: url.BUREAU_HOUSING_HOST + href
            })
        })
        console.log(projects)

        for (let i = 0; i < projects.length; i++) {
            await db.collection('_task')
                .add({
                    data: {
                        rank: 3,
                        category: 'PROJECT',
                        projectID: projects[i].projectID,
                        name: projects[i].name,
                        district: project.district,
                        href: projects[i].href,
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
    const response = await axios.get(info.href);
    console.log(response);

    if (response.status === 200) {
        let project = {}
        const $ = cheerio.load(response.data, {
            xml: {
                normalizeWhitespace: true
            }
        });
        const target = $('table tr')
        const _id = info.projectID //  ID
        project.district = info.district //  所在行政区域
        project.leader = target.eq(0).children('td').eq(1).text() //  公司名称
        project.name = target.eq(0).children('td').eq(3).text() //  项目名称
        project.license = target.eq(1).children('td').eq(1).text() //  预售许可证
        project.phone = target.eq(1).children('td').eq(3).text() //  售楼电话
        project.address = target.eq(2).children('td').eq(1).text() //  项目坐落
        project.use = target.eq(3).children('td').eq(1).text() //  规划用途
        project.plotRatio = target.eq(6).children('td').eq(1).text() //  容积率
        project.greeningRate = target.eq(6).children('td').eq(3).text() //  绿地率
        project.buildingDensity = target.eq(7).children('td').eq(1).text() //  建筑密度

        project.availableNumberHousing = parseInt(target.eq(13).children('td').eq(1).text()) //  住宅可售套数
        project.availableAreaHousing = parseFloat(target.eq(13).children('td').eq(2).text()) //  住宅可售面积
        project.availableNumberBusiness = parseInt(target.eq(13).children('td').eq(3).text()) //  商业可售套数
        project.availableAreaBusiness = parseFloat(target.eq(13).children('td').eq(4).text()) //  商业可售面积
        project.availableNumberOffice = parseInt(target.eq(13).children('td').eq(5).text()) //  写字楼可售套数
        project.availableAreaOffice = parseFloat(target.eq(13).children('td').eq(6).text()) //  写字楼可售面积
        project.availableNumberGarage = parseInt(target.eq(13).children('td').eq(7).text()) //  车库可售套数
        project.availableAreaGarage = parseFloat(target.eq(13).children('td').eq(8).text()) //  车库可售面积
        project.availableNumberOther = parseInt(target.eq(13).children('td').eq(9).text()) //  其它可售套数
        project.availableAreaOther = parseFloat(target.eq(13).children('td').eq(10).text()) //  其它可售面积

        project.soldNumberHousing = parseInt(target.eq(14).children('td').eq(1).text()) //  住宅已售套数
        project.soldAreaHousing = parseFloat(target.eq(14).children('td').eq(2).text()) //  住宅已售面积
        project.soldNumberBusiness = parseInt(target.eq(14).children('td').eq(3).text()) //  商业已售套数
        project.soldAreaBusiness = parseFloat(target.eq(14).children('td').eq(4).text()) //  商业已售面积
        project.soldNumberOffice = parseInt(target.eq(14).children('td').eq(5).text()) //  写字楼已售套数
        project.soldAreaOffice = parseFloat(target.eq(14).children('td').eq(6).text()) //  写字楼已售面积
        project.soldNumberGarage = parseInt(target.eq(14).children('td').eq(7).text()) //  车库已售套数
        project.soldAreaGarage = parseFloat(target.eq(14).children('td').eq(8).text()) //  车库已售面积
        project.soldNumberOther = parseInt(target.eq(14).children('td').eq(9).text()) //  其它已售套数
        project.soldAreaOther = parseFloat(target.eq(14).children('td').eq(10).text()) //  其它已售面积

        project.buildings = []

        for (let i = 0, length = $('table a').length; i < length; i++) {
            const buildingName = $('table a').eq(i).text()
            const buildingHref = url.BUREAU_HOUSING_HOST + $('table a').eq(i).attr('href')
            console.log($('table a').eq(i).attr('href'), $('table a').eq(i).text())
            project.buildings.push({
                name: buildingName,
                href: buildingHref
            })

            await db.collection('_task')
                .add({
                    data: {
                        rank: 4,
                        category: 'BUILDING',
                        name: buildingName,
                        href: buildingHref,
                        projectID: info.projectID,
                        addTime: new Date()
                    }
                })
        }

        //  TODO:  获取项目的地理位置

        await db.collection('_project')
            .doc(_id)
            .set({
                data: project
            })


    } else {
        throw new Error("无法获取可售楼盘项目信息")
    }
}

/**
 *          项目预售信息（幢号）
 */
async function grabBuildingInfo(building) {
    console.log("URL  >>>>  ", building.href)
    const response = await axios.get(building.href);
    // console.log(response);

    if (response.status === 200) {
        const $ = cheerio.load(response.data, {
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
 *          移除任务
 */
async function removeTask(taskID) {
    return await db.collection('_task')
        .doc(taskID)
        .remove()
}


async function main(request) {
    try {
        const record = await db.collection('_task')
            .orderBy('rank', 'asc')
            .limit(1)
            .get()

        if (record.data && record.data.length === 1) {
            switch (record.data[0].category) {
                case "SEED":
                    await grabProjectPaging(record.data[0].district)
                    break;
                case "COLLECTION":
                    await grabProjectList(record.data[0])
                    break;
                case "PROJECT":
                    await grabProjectInfo(record.data[0])
                    break;
                case "BUILDING":
                    await grabBuildingInfo(record.data[0])
                    break;
                default:
                    break;
            }
            await removeTask(record.data[0]._id)
        }

        return "DONE"

        // return await db.collection('_task')
        //     .where({
        //         category: "PROJECT"
        //     })
        //     .remove()

    } catch (err) {
        console.error(err)
        return err
    }
}

module.exports = {
    main
}