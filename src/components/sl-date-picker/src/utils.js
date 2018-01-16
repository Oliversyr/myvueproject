let now = new Date(); //当前日期 
let nowDayOfWeek = now.getDay(); //今天本周的第几天 
let nowDay = now.getDate(); //当前日 
let nowMonth = now.getMonth(); //当前月 
let nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0;

let lastMonthDate = new Date(); //上月日期 
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
let lastYear = lastMonthDate.getYear();
let lastMonth = lastMonthDate.getMonth();

//格式化日期：yyyy-MM-dd hh:mm:ss
function formatDate(date, fmt) {
    if (!fmt) {
        fmt = 'yyyy-MM-dd'
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
        }
    }
    return fmt;
}

//获得某月的天数 
function getMonthDays(myMonth) {
    let monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth + 1, 1);
    let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}

//获得本季度的开端月份 
function getQuarterStartMonth() {
    let quarterStartMonth = 0;
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}

//获取本周时间段
function getWeekDate() {
    let end = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
    let start = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
    return {
        start: start,
        end: end
    }
}

//获得本月时间段
function getMonthDate() {
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    let monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return {
        start: formatDate(monthStartDate),
        end: formatDate(monthEndDate)
    }
}

//获得上月时间段
function getLastMonthDate() {
    let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return {
        start: formatDate(lastMonthStartDate),
        end: formatDate(lastMonthEndDate)
    }
}

//获得本季度时间段 
function getQuarterDate() {
    let quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    let quarterEndMonth = getQuarterStartMonth() + 2;
    let quarterEndDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return {
        start: formatDate(quarterStartDate),
        end: formatDate(quarterEndDate)
    }
}

/* 
** description: 获取去年，今年，明年时间段
** params: 
     type: Number //不传或0代表今年, -1代表去年, 1代表明年
*/
function getAYear(type) {
    let n = type || 0;
    let year = now.getFullYear() + Number(n);
    return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31)
    };
};

/* ************************** */

/* 
* 获取今日
* param: fmt String  如：'yyyy-MM-dd hh:mm:ss'  
* 默认和不传返回Data类型日期
*/
function getToday(fmt) {
    return {
        start: fmt ? formatDate(now, fmt) : now,
        end: fmt ? formatDate(now, fmt) : now
    }
}

/* 
* 获取本周
* param: fmt String  如：'yyyy-MM-dd hh:mm:ss'  
* 默认和不传返回Data类型日期
*/
function getWeek(fmt) {
    let end = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
    let start = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
    return {
        start: fmt ? formatDate(start, fmt) : start,
        end: fmt ? formatDate(end, fmt) : end
    }
}

/* 
* 获取本月
* param: fmt String  如：'yyyy-MM-dd hh:mm:ss'  
* 默认和不传返回Data类型日期
*/
function getMonth(fmt) {
    let start = new Date(nowYear, nowMonth, 1);
    let end = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return {
        start: fmt ? formatDate(start, fmt) : start,
        end: fmt ? formatDate(end, fmt) : end
    }
}

/* 
* 获取上月
* param: fmt String  如：'yyyy-MM-dd hh:mm:ss'  
* 默认和不传返回Data类型日期
*/
function getLastMonth(fmt) {
    let start = new Date(nowYear, lastMonth, 1);
    let end = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return {
        start: fmt ? formatDate(start, fmt) : start,
        end: fmt ? formatDate(end, fmt) : end
    }
}

/* 
* 获取本季度
* param: fmt String  如：'yyyy-MM-dd hh:mm:ss'  
* 默认和不传返回Data类型日期
*/
function getQuarter(fmt) {
    let start = new Date(nowYear, getQuarterStartMonth(), 1);
    let quarterEndMonth = getQuarterStartMonth() + 2;
    let end = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return {
        start: fmt ? formatDate(start, fmt) : start,
        end: fmt ? formatDate(end, fmt) : end
    }
}

/* 
* 获取本年
* param: fmt String  如：'yyyy-MM-dd hh:mm:ss'  
* 默认和不传返回Data类型日期
*/
function getYear(fmt) {
    let start = new Date(now.getFullYear(), 0, 1);
    let end = new Date(now.getFullYear(), 11, 31);
    return {
        start: fmt ? formatDate(start, fmt) : start,
        end: fmt ? formatDate(end, fmt) : end
    }
}



export default {
    formatDate,
    getMonthDays,
    getWeekDate,
    getMonthDate,
    getLastMonthDate,
    getQuarterDate,
    getAYear,
    getToday,getWeek,getMonth,getLastMonth,getQuarter,getYear

}