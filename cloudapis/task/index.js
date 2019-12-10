// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    env: 'diandi-software-cloud'
})

//  可在入口函数外缓存 db 对象
const db = cloud.database()

//  数据库查询更新指令对象
const _ = db.command

//  行政区域
const DISTRICT = ['城厢区', '荔城区', '涵江区', '秀屿区']

/**
 *          可售楼盘统计信息
 */
async function seed() {
    for (let i = 0; i < DISTRICT.length; i++) {
        await db.collection('_task')
            .add({
                data: {
                    rank: 1,
                    category: 'SEED',
                    district: DISTRICT[i],
                    addTime: new Date()
                }
            })
    }
}

// 云函数入口函数
exports.main = async(event, context) => {
    await seed()

    return "DONE"
    // return await db.collection('_task')
    //     .where({
    //         category: "SEED"
    //     })
    //     .remove()
}