/**数组根据数组对象中的某个属性值进行排序的方法
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * */
export function sortBy(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }

    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

/**判断对象是否是空对象
 * @param obj 需要判断的对象
 * 使用例子：var a = {}; isEmptyObject(a);
 * */
export function isEmptyObject(obj) {
    for (var key in obj) {
        return false
    }
    ;
    return true;
}

// 格式化上传文件参数
export function buildUploadParam(filename, data) {
    var bas64Buffer = new Buffer(data, 'base64');
    var param = {
        "storage": {
            "owner": 'zdb@skylink', // 所有者，不能为空
            "sign": '123456', // 签名信息
            "ssoToken": '' // 统一登录令牌,保留
        },
        "file": {
            "name": filename, // 文件名称
            "format": "hex", // 数据格式 hex 16进制 base64 base64编码，可以为空，默认为hex
            "data": bas64Buffer.toString('hex'),
            "thumbnails": ""
        }
    };
    return param;
}

/**js 数字前面自动补零
 * @param num 传入的数字
 * @param n 需要的字符长度
 * 使用例子：传入6，需要的字符长度为3，调用方法后字符串结果为：006
 * */
export function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
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

/*
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
 console.log(formatNumber(2, 2, ".", ","))//"2.00"
 console.log(formatNumber(3.7, 2, ".", ","))//"3.70"
 console.log(formatNumber(3, 0, ".", ",")) //"3"
 console.log(formatNumber(9.0312, 2, ".", ","))//"9.03"
 console.log(formatNumber(9.00, 2, ".", ","))//"9.00"
 console.log(formatNumber(39.715001, 2, ".", ",", "floor")) //"39.71"
 console.log(formatNumber(9.7, 2, ".", ","))//"9.70"
 console.log(formatNumber(39.7, 2, ".", ","))//"39.70"
 console.log(formatNumber(9.70001, 2, ".", ","))//"9.71"
 console.log(formatNumber(39.70001, 2, ".", ","))//"39.71"
 console.log(formatNumber(9996.03, 2, ".", ","))//"9996.03"
 console.log(formatNumber(1.797, 3, ".", ",", "floor"))//"1.797"
 * */
export function formatNumber(number, decimals, dec_point, thousands_sep, roundtag) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || "ceil"; //"ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {

            var k = Math.pow(10, prec);
            console.log();

            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

/**js 获取文件后缀字符
 * @param fileName 传入的文件完整名称
 * */
export function getFileNameSuffix(fileName) {
    let pos = fileName.lastIndexOf(".");
    return fileName.substring(pos + 1);
}
