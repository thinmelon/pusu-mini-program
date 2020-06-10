const cloud = require('wx-server-sdk')
const moment = require('moment')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

async function main(request) {
    try {
        const troupe = await db.collection('_scheduling')
            //  指定筛选条件
            .where({
                name: request.troupeName
            })
            .get()

        let scheduling = [];
        if (troupe.data && troupe.data.length > 0) {
            troupe.data[0].scheduling.map(item => {
                const a = moment(item.year + '-' + item.month + '-' + item.day)
                const b = request.target ? moment(request.target.year + '-' + request.target.month + '-' + request.target.day) : moment()
                if (a.isAfter(b)) {
                    scheduling.push(item)
                }
            })
        }

        return scheduling;
    } catch (err) {
        return err;
    }
}

module.exports = {
    main
}