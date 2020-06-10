// 云函数入口文件
const cloud = require('wx-server-sdk')

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
    const {
        OPENID
    } = cloud.getWXContext();

    try {
        const result = await db.collection('_order')
            //  指定筛选条件
            .where({
                openid: OPENID
            })
            //  最多添加两项排序规则
            .orderBy(request.sort1 || "createTime", request.sortOption1 || "desc")
            //  指定查询返回结果时从指定序列后的结果开始返回，用于分页
            .skip(request.skip || 0)
            //  指定查询结果集数量上限
            .limit(request.limit || 20)
            .get()

        return result;
    } catch (err) {
        return err;
    }
}

module.exports = {
    main
}