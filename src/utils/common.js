/* 处理浏览器兼容性的函数
 *
 */
// 1. toFixed重写，统一精度
Number.prototype.toFixed = function (s) {
    var changeNum = (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString(),
        index = changeNum.indexOf(".");
    if (index < 0 && s > 0) {
        changeNum = changeNum + ".";
        for (let i = 0; i < s; i++) {
            changeNum = changeNum + "0";
        }
    } else {
        index = changeNum.length - index;
        for (let i = 0; i < (s - index) + 1; i++) {
            changeNum = changeNum + "0";
        }
    }
    return changeNum;
}