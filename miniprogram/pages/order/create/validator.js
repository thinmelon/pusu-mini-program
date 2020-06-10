/**
 *  演出日期为必填项
 */
function validateTroupeName(rule, value, param, models) {
    if (models.troupeName === "") {
        return rule.message;
    }
}

/**
 *  演出日期为必填项
 */
function validateDramaDate(rule, value, param, models) {
    if (models.dramaDate.length === 0) {
        return rule.message;
    }
}

/**
 *  演出地点为必填项
 */
function validateDramaAddress(rule, value, param, models) {
    if (models.dramaAddress === "") {
        return rule.message;
    }
}


module.exports = {
    troupeName: validateTroupeName,
    dramaDate: validateDramaDate,
    dramaAddress: validateDramaAddress
}