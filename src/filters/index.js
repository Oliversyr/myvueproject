/* 实现模糊查询：正则匹配 */
export function searchByRegExp(keyWord, list, prop){
    if(!(list instanceof Array)){
        return ;
    }
    const len = list.length;
    var arr = [];
    var reg = new RegExp(keyWord);
    for(var i=0;i<len;i++){
        //如果字符串中不包含目标字符会返回-1
        let test = !prop ? list[i] : list[i][prop];
        if(test.match(reg)){
            arr.push(list[i]);
        }
    }
    return arr;
}

/*js 将数值四舍五入(保留2位小数)后格式化成金额形式
 * 参数说明：
 * s：要格式化的数字
 * n：保留几位小数
 formatMoney(9.7,2);//9.70
 formatMoney('12345.675910', 3);//12,345.676
 * */
export function formatMoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1],
        t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
}
