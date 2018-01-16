<template>
    <div class="sl-date-picker__wrapper">
        <div class="sl-date-picker__prepend" v-show="!!prepend">{{prepend}}
        </div><el-date-picker class="sl-date-picker__input" v-model="dateValue" type="daterange" :align="align" size="small" :picker-options="pickerOptions" @change="rangeValueChange" :placeholder="placeholder" :clearable="false">
        </el-date-picker>
    </div>
</template>

<script>
import utils from './utils';
export default {
    name: 'SLDatePicker',
    props: {
        prepend: {
            type: String,
            default: ""
        },
        align: {
            type: String,
            default: "left"
        },
        rangeValue: {
            type: String, //不为""时，dataRange 和 dataType 限制条件无效
            default: ''
        },
        placeholder: {
            type: String,
            default: '请选择日期范围'
        },
        dataRange: {
            type: Array, //[type,value] 限制类型 type : day=天 month=月 year=年 ； 限制最大值 value 
            default: function() {
                return [];
            }
        },
        dataType: {
            type: Number, //1=今天 2=本周 3=本月 4=本年 5=本季度 6=近7天 7=近30天 8=本月1号取上月，否则取本页
            default: 1
        }
    },
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    dataVal: 1,
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近七天',
                    dataVal: 7,
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '近三十天',
                    dataVal: 30,
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '本周',
                    dataVal: 7,
                    onClick(picker) {
                        let weekDate = utils.getWeekDate();
                        picker.$emit('pick', [weekDate.start, weekDate.end]);
                    }
                }, {
                    text: '本月',
                    dataVal: 30,
                    onClick(picker) {
                        let monthDate = utils.getMonthDate();
                        picker.$emit('pick', [monthDate.start, monthDate.end]);
                    }
                }, {
                    text: '本年',
                    dataVal: 365,
                    onClick(picker) {
                        let aYear = utils.getAYear();
                        picker.$emit('pick', [aYear.start, aYear.end]);
                    }
                }]
            },
            dateValue: []


        }
    },
    methods: {
        //组件初始化
        init() {
            //通过范围过滤快捷选项
            this.doFilterOptions();
            //初始值input值
            if (this.rangeValue) {
                this.$children[0].refInput.value = this.rangeValue;
            } else {
                this.$children[0].refInput.value = this.getValForDataType('yyyy-MM-dd');
            }
            this.rangeValueChange(this.$children[0].refInput.value);
        },
        //通过范围过滤快捷选项
        doFilterOptions() {
            let dataVal = 365*3;
            if (this.dataRange[0] === 'year') {
                dataVal = this.dataRange[1] * 365;
            }
            else if (this.dataRange[0] === 'month') {
                dataVal = this.dataRange[1] * 30;
            }
            else if (this.dataRange[0] === 'day') {
                dataVal = this.dataRange[1] * 1;
            }
            //删除不符合快捷选项，倒序删除最安全
            for (let i = this.pickerOptions.shortcuts.length - 1; i > 0; i--) {
                let element = this.pickerOptions.shortcuts[i];
                if (element.dataVal > dataVal) {
                    this.pickerOptions.shortcuts.splice(i,1);
                }
            }
        },
        //改变父类值
        rangeValueChange(value) {
            if (!value) {
                value = this.getValForDataType('yyyy-MM-dd');
            }
            if (this.dataRange.length !== 0) {
                value = this.getValForDataRange(value);
            }
            let arr = value.split(' - ');
            let sdateArr = arr[0].split('-');
            let edateArr = arr[1].split('-');
            let newDateValue = [new Date(sdateArr[0], sdateArr[1] - 1, sdateArr[2]), new Date(edateArr[0], edateArr[1] - 1, edateArr[2])];
            this.dateValue = newDateValue;
            this.$emit('update:rangeValue', value);
        },
        //判断是否超过最大范围，超过就给默认
        getValForDataRange(value) {
            let arr = value.split(' - ');
            let sdateArr = arr[0].split('-');
            let edateArr = arr[1].split('-');
            if (this.dataRange[0] === 'year') {
                if (edateArr[0] * 1 - sdateArr[0] * 1 > this.dataRange[1]) {
                    this.$message(`日期范围不能超过${this.dataRange[1]}年`);
                    return this.getValForDataType('yyyy-MM-dd');
                }
            }
            else if (this.dataRange[0] === 'month') {
                if (sdateArr[0] * 1 !== edateArr[0] * 1 || edateArr[1] * 1 - sdateArr[1] * 1 > this.dataRange[1]) {
                    this.$message(`日期范围不能超过${this.dataRange[1]}个月`);
                    return this.getValForDataType('yyyy-MM-dd');
                }

            }
            else if (this.dataRange[0] === 'day') {
                if (sdateArr[0] * 1 !== edateArr[0] * 1 || sdateArr[1] * 1 !== edateArr[1] * 1 && edateArr[2] * 1 - sdateArr[2] * 1 > this.dataRange[1]) {
                    this.$message(`日期范围不能超过${this.dataRange[1]}天`);
                    return this.getValForDataType('yyyy-MM-dd');
                }
            }
            return value;
        },
        getValForDataType(fmt, type) {
            switch (type || this.dataType) {
                case 1://本天
                    let today = utils.getToday();
                    return fmt ? `${utils.formatDate(today.start, fmt)} - ${utils.formatDate(today.end, fmt)}` : today;
                case 2://本周
                    let week = utils.getWeek();
                    return fmt ? `${utils.formatDate(week.start, fmt)} - ${utils.formatDate(week.end, fmt)}` : week;
                case 3://本月
                    let month = utils.getMonth();
                    return fmt ? `${utils.formatDate(month.start, fmt)} - ${utils.formatDate(month.end, fmt)}` : month;
                case 4://本年
                    let year = utils.getYear();
                    return fmt ? `${utils.formatDate(year.start, fmt)} - ${utils.formatDate(year.end, fmt)}` : year;
                case 5://本季度
                    let quarter = utils.getQuarter();
                    return fmt ? `${utils.formatDate(quarter.start, fmt)} - ${utils.formatDate(quarter.end, fmt)}` : quarter;
                case 6://近7天
                    const last7Start = new Date();
                    last7Start.setTime(last7Start.getTime() - 3600 * 1000 * 24 * 7);
                    let last7 = {
                        start: last7Start,
                        end: new Date(),
                    }
                    return fmt ? `${utils.formatDate(last7.start, fmt)} - ${utils.formatDate(last7.end, fmt)}` : last7;
                case 7://近30天
                    const last30Start = new Date();
                    last30Start.setTime(last30Start.getTime() - 3600 * 1000 * 24 * 30);
                    let last30 = {
                        start: last30Start,
                        end: new Date(),
                    }
                    return fmt ? `${utils.formatDate(last30.start, fmt)} - ${utils.formatDate(last30.end, fmt)}` : last30;
                case 8://本页第一天取上月日期，否则取本月日期
                    let dateType8Val;
                    if (new Date().getDate() === 1) {
                        dateType8Val = utils.getLastMonth();
                    } else {
                        dateType8Val = utils.getMonth();
                    }
                    return fmt ? `${utils.formatDate(dateType8Val.start, fmt)} - ${utils.formatDate(dateType8Val.end, fmt)}` : dateType8Val;
                case 9://未来一年
                    const oneYearStart = new Date();
                    let thisYear = oneYearStart.getFullYear();
                    let oneYearLater = new Date();
                        oneYearLater.setFullYear(thisYear + 1);
                    let year1 = {
                        start: new Date(),
                        end: oneYearLater,
                    }
                    return fmt ? `${utils.formatDate(year1.start, fmt)} - ${utils.formatDate(year1.end, fmt)}` : year1;
                default:
                    break;
            }
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    watch: {
        rangeValue(val) {
            // this.$children[0].refInput.value = val;
            if (!val) {
                this.rangeValueChange();
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.sl-date-picker__wrapper {
    display: inline-block;
    width: 100%;
    .sl-date-picker__prepend {
        display: inline-block;
        /*min-width: 80px;*/
        width: 90px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #ccc;
        border-right: 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        vertical-align: top;
        text-align: center;
        background-color: #f3f3f3;
        color: #555;
    }
    .sl-date-picker__input {
        display: inline-block;
        width: calc(100% - 90px);
    }
    .el-input__inner {
        /*display: inline-block;
            width: calc(100% - 90px);*/
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}
</style>
