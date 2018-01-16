/**
 * 获取校验格式
 * 
 * @export
 * @param {any} params 
 * @returns 
 */
export function getValidateFormat(params) {
    return {
        min:params.min,
        max:params.max,
        isNegative:params.isNegative,
    }
}

/**
 * 基础校验
 * 
 * @export
 * @param {any} value 需要校验的值
 * @param {Object} validateFormat 校验规格
 *          min:                //最小值
            max:                //最大值
            isNegative          //是否支持负数
 * @returns string
 * 
 */
export function basicValidate(value, validateFormat) {
    //最大值
    if (value > validateFormat.max) {
        value = validateFormat.max;
    }
    //最小值
    if (value < validateFormat.min) {
        value = validateFormat.min;
    }
    //是否支持负数
    if (!validateFormat.isNegative) {
        value = value < 0 ? value * -1 : value;
    }
    return value;
}

/**
 * 整形校验 可"",可0
 * 
 * @export
 * @param {any} value 
 * @returns string
 */
export function integerValidate(value) {
    return  parseInt(value) || parseInt(value) === 0 ? parseInt(value) : '';
}