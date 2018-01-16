/* 
*utils 公共方法
*/

var filter = {
    //店铺状态 0：未开业 1：营业中 2：休息中 3：已停业
    shopStatus: (key) => {
        switch (key * 1) {
            case 0:
                return '未开业'
            case 1:
                return '营业中'
            case 2:
                return '休息中'
            case 3:
                return '已停业'
            default:
                return '未知'
        }
    },
    //支付方式  3：支付宝 4：微信
    payType: (key) => {
        switch (key * 1) {
            case 3:
                return '支付宝'
            case 4:
                return '微信'
            default:
                return '未知'
        }
    },
    //商品状态  0：停用 1：启用
    status: (key) => {
        switch (key * 1) {
            case 0:
                return '停用'
            case 1:
                return '启用'
            default:
                return '未知'
        }
    },
}

var date = {
    //格式化日期：yyyy-MM-dd
    formatDate: (date) => {
        let myyear = date.getFullYear();
        let mymonth = date.getMonth() + 1;
        let myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
}


export default {
    filter,
    date

}