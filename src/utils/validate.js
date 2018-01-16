/* 是否是公司邮箱*/
export function isWscnEmail(str) {
    const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wallstreetcn\.com$/i;
    return reg.test(str.trim());
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

// 验证正浮点数
export function validateGTFloatingNumber(str) {
    const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
    if (str === '') {
        return false;
    } else if (str > 1000000000000) {
        return false;
    }
    return reg.test(str);
}

// 验证非零的正整数
export function validateSignlessInteger(str) {
    const reg = /^\+?[1-9][0-9]*$/;
    if (str === '') {
        return false;
    } else if (str > 1000000000000) {
        return false;
    }
    return reg.test(str);
}

// 验证非负整数和空（正整数 + 0 + 空）
export function validateNonnegativeIntegers(str) {
    const reg = /^\d+$/;
    if (str === '') {
        return true;
    } else if (str > 1000000000000) {
        return false;
    }
    return reg.test(str);
}

// 验证金额, 可以为空( = 0.00)
export function validateMoney(str) {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (str === '') {
        return true;
    } else if (str > 1000000000000) {
        return false;
    }
    return reg.test(str);
}

/* 校验手机号码*/
export function validateTeleNum(rule, value, callback) {
    if (!(/^[0-9]{11}$/).test(value)) {
        return callback(new Error('请输入有效的手机号码'));
    }
    setTimeout(() => {
        if (value.toString().length >= 12) {
            callback(new Error('请输入11位有效的数字值'));
        } else {
            callback();
        }
    }, 1000);
}

/* 校验密码：只能输入6-20个字母、数字、下划线*/
export function validatePassWD(rule, value, callback) {
    if (!(/^(\w){6,20}$/).test(value)) {
        return callback(new Error('请输入6-20个字母、数字、下划线'));
    }
}

/* 控制金额输出 限制2位小数 输入非法时重置为0*/
export function validateInputPrice(price) {
    let f = parseFloat(price);
    if (isNaN(f) || f <= 0 || f > 2147483647) {
        return 0;
    }
    let str = f + '';
    if (str.indexOf('.') !== -1) {
        return (str.substring(0, str.indexOf('.') + 3)) * 1;
    }
    return str * 1;
}

/* 控制整形输出 默认最大值9999*/
export function validateInputInt(price,max) {
    let f = parseInt(price);
    if (isNaN(f) || f <= 0) {
        return 0;
    }
    if (max && f > max) {
        f = max;
    }else if (f > 2147483647) {
        f = 2147483647;
    }
    return f;
}