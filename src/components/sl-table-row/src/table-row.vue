<template>
    <div class="sl-table-row">
        <el-table :data="[{}]" :show-header="false" :highlight-current-row="true" style="width: 100%">
            <el-table-column fixed label="序号" align="center" width="50" class-name="row-index">
                <template scope="scope">
                    <span>{{ rowIndex }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed label="行标题" width="65" class-name="row-title">
                <template scope="scope">
                    <div v-for="item in rowTitle" class="row-title-label">{{ item.label }}</div>
                </template>
            </el-table-column>

            <el-table-column v-for="(colIndex,index) in colNum" :key="'table-col' + colIndex"
                             :label="'第' + colIndex + '列'" align="center" width="180" class-name="row-col">
                <template scope="scope">
                    <div v-for="(data,index) in tableData" v-if="data.colIndex === colIndex">
                        <span title="编辑" @click="editAisleGoods(data)"><icon-svg iconClass="brush"></icon-svg></span>
                        <div v-for="(colName,index) in rowTitle" class="tx-overflow" :title="data[colName.name]">
                            {{ data[colName.name] }}
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" align="center" width="200" class-name="row-control">
                <template scope="scope">
                    <div class="control">
                        <div class="control-col">
                            <el-input-number @change="handleColNumChange()" :min="1" :max="colMaxNum" size="small"
                                             v-model="colNum" class="col-num" :key="rowIndex">
                            </el-input-number>
                            <span>列</span>
                        </div>
                        <el-button class="control-row" type="text" size="small" v-waves>删除行</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import IconSvg from "../../Icon-svg/index";
    export default {
        components: {IconSvg},
        name: 'SLTableRow',
        props: {
            rowTitle: {// 行标题
                type: Array,
                default: function () {
                    let rowTitle = [{
                        label: '货道',
                        name: 'aisle'
                    }, {
                        label: '商品',
                        name: 'goods'
                    }, {
                        label: '存货/价格',
                        name: 'price'
                    }];
                    return rowTitle;
                }
            },
            rowIndex: {// 行序号
                type: Number,
                default: 1
            },
            colMaxNum: {// 行最大列数
                type: Number,
                default: 8
            },
            tableData: {// 行表格数据
                type: Array,
                default: function () {
                    return [{}];
                }
            }
        },
        data(){
            return {
                colNum: this.colMaxNum
            }
        },
        methods: {
            handleColNumChange(newVal, oldVal) {

            },
            editAisleGoods(data) {
                this.$emit('edit', data);
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .sl-table-row {
        .el-table {
            margin-bottom: 10px;
            .el-table__body-wrapper, .row-index, .row-title, .row-control {
                background-color: #f3f3f3;
            }
            .row-title {
                .row-title-label {
                    margin: 0 -18px;
                    text-align: center
                }
            }
            .row-col {
                &:hover {
                    background: #e7f3fd !important;
                    .svg-icon {
                        color: #2288ee;
                        display: inline-block;
                        position: absolute;
                        top: 0px;
                        right: 5px;
                        height: 2em;
                        width: 2em;
                    }
                }
                background-color: #fff;
                .svg-icon {
                    display: none;
                }
            }
            .row-control {
                &.is-hidden {
                    border-right: none !important;
                }
                .control {
                    .col-num {
                        margin-right: 10px;
                    }
                    .control-row {
                        margin-top: 5px;
                    }
                }
            }
            td {
                border-right: 1px solid #dfe6ec !important;
            }
        }
    }
</style>
