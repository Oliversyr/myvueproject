<template>
    <div class="block slic-area-group">
        <span class="demonstration slic-area-group__prepend" v-if="prepend">{{prepend}}</span>
        <el-cascader class="slic-area-group__inner" size="small" placeholder="选择或者输入区域名称" @change="changeFun" :options="areaList" :value="valArr" filterable change-on-select clearable></el-cascader>
    </div>
</template>

<script>
import { getAreaList } from './areaList';

export default {
    name: 'sl-cascader-area',
    props: {
        areaVal: {
            type: String,
            default: ""
        },
        prepend: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            areaList: [],
            valArr: []
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.areaList = getAreaList();
            if (this.areaVal.length !== 0) {
                this.valArr = [this.areaVal.substring(0, 2) + '0000', this.areaVal.substring(0, 4) + '00', this.areaVal.substring(0, 6)];
            }
        })
    },
    methods: {
        changeFun(arr) {
            //为空时
            if (arr.length === 0) {
                this.$emit('update:areaVal', '');
                return
            }

            let id = '-1';
            //此判断是饿了么组件的坑1
            if (arr.length === 2 && arr[0].indexOf("0000")!=-1 && arr[1].indexOf("0000")!=-1) {
                id = arr[0];
            }
            //此判断是饿了么组件的坑2
            else if (arr.length === 3 && arr[1].length !== 6 && arr[2].length !== 6) {
                id = arr[0];
            }
            else {
                //正常选项时
                id = arr[arr.length - 1];
            }
            
            if (id.length === 2) {
                id += '0000';
            } else if (id.length === 4) {
                id += '00';
            }
            this.$emit('update:areaVal', id);
        }
    },
    watch: {
        areaVal: function(val) {
            this.$nextTick(function() {
                this.valArr = [val.substring(0, 2) + '0000', val.substring(0, 4) + '00', val.substring(0, 6)];
            })
        }

    }

}
</script>

<style rel="stylesheet/scss" lang="scss">
.slic-area-group {
    line-height: normal;
    display: inline-table;
    width: 100%;
    border-collapse: separate;

    .slic-area-group__prepend {
        /*左侧*/
        display: inline-block;
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

    .slic-area-group__inner {
        /*右侧*/
        display: inline-block;
        width: calc(100% - 90px);

        .el-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
}

.el-cascader__label {
    font-size: 12px;
}
</style>