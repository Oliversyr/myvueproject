<template>
    <div class="sl-table-col flex-col">
        <el-table :data="tableData" :show-header="false"
                  :row-style="{display:'inline-block','margin-bottom':'10px'}"
                  height="custom" style="width: 100%">

            <el-table-column fixed label="行序号" align="center" width="45" class-name="row-index">
                <template scope="scope">
                    <span>{{ scope.row.rowIndex }}</span>
                </template>
            </el-table-column>

            <el-table-column fixed label="行标题" width="70" class-name="row-title">
                <template scope="scope">
                    <div v-for="item in rowTitle" class="row-title-label">{{ item.label }}</div>
                </template>
            </el-table-column>

            <el-table-column v-for="(colIndex,index) in colMaxNum" :key="'table-col' + colIndex"
                             :label="'第' + colIndex + '列'" align="center" width="180" class-name="row-col">
                <template scope="scope">
                    <div class="row-col-content">
                        <span title="编辑" @click="editAisleGoods(false, scope.row.rowIndex, colIndex)"><icon-svg
                                iconClass="brush"></icon-svg></span>
                        <div v-for="data in scope.row.rowColData" :key="'table-row-col' + colIndex">
                            <div v-if="data.rowy === colIndex">
                                <span title="编辑" @click="editAisleGoods(data, scope.row.rowIndex, colIndex)"><icon-svg
                                        iconClass="brush"></icon-svg></span>
                                <div v-for="(name,index) in rowTitle" class="tx-overflow" :title="data[name.name]">
                                    {{ data[name.name] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column v-for="o in colMaxEmpty" :key="'col-max-empty' + o" label="空列" width="180" class-name="row-col-empty">
                <template scope="scope"></template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" align="center" width="200" class-name="row-control">
                <template scope="scope">
                    <div class="control">
                        <div class="control-col">
                            <div class="row-index-hide"><span>{{scope.row.rowIndex}}</span></div>
                            <el-input-number @click.native="handleColNumChange($event, scope.row, scope.row.rowIndex, scope.row.rowColNum)" :min="1" :max="colMaxNum"
                                             size="small" v-model="scope.row.rowColNum" class="col-num"
                                             :key="scope.row.rowIndex">
                            </el-input-number>
                            <span>列</span>
                        </div>
                        <el-button class="control-row" type="text" size="small" v-waves @click="delRow(scope.row)">删除行</el-button>
                    </div>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'SLTableCol',
        props: {
            rowTitle: {// 行标题
                type: Array,
                require: true,
                default: [{}]
            },
            colMaxNum: {// 默认最大列数8
                type: Number,
                require: true,
                default: 5
            },
            tableData: {// 表格数据
                type: Array,
                require: true,
                default: [{}]
            }
        },
        data() {
            return {

            }
        },
        computed: {// 最大空列数,8 列为标准
            colMaxEmpty: function () {
                if (this.colMaxNum < 8) {
                    return 8 - this.colMaxNum;
                }
            }
        },
        methods: {
            handleColNumChange(even, row, rowIndex, rowColNum) {
                this.$emit('handleColNumChange', even, row, rowIndex, rowColNum);
            },
            editAisleGoods(data, rowx, rowy) {
                this.$emit('edit', data, rowx, rowy);
            },
            delRow(rowInfo) {
                this.$emit('delSlaveRow', rowInfo)
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .sl-table-col {
        .el-table {
            // 组件内 element-ui 样式覆盖
            &::after, &::before {
                background-color: #fff !important;
            }
            border: none !important;
            .el-table__row {
                td {
                    border: 1px solid #dfe6ec;
                }
                td.row-col-empty {
                    border-left-color: #f3f3f3;
                    border-right-color: #f3f3f3;
                }
            }
            .el-table__body-wrapper {
                height: 100%;
                .row-col {
                    &.disabled {
                        background-color: #f3f3f3;
                        border-left-color: #f3f3f3;
                        border-right-color: #f3f3f3;
                        &:hover {
                            background: #f3f3f3 !important;
                        }
                        .cell {
                            opacity: 0;
                        }
                    }
                }
            }
            .el-table__fixed {
                &::before {
                    background-color: #fff !important;
                }
                box-shadow: none !important;
                table {
                    border-collapse: collapse;
                }
            }
            .el-table__fixed-right {
                &::before {
                    background-color: #fff !important;
                }
                box-shadow: none !important;
                table {
                    border-collapse: separate;
                }
                .row-index {
                    .cell {
                        width: 43px;
                    }
                }
                .row-title {
                    .cell {
                        width: 68px;
                    }
                }
                .row-col-empty, .row-col {
                    .cell {
                        width: 178px;
                    }
                }
                .row-control {
                    .cell {
                        width: 198px;
                    }
                }
            }
            // 组件样式
            .row-index,
            .row-title,
            .row-col-empty,
            .row-control {
                background-color: #f3f3f3;
            }
            .row-index {
                .cell {
                    width: 44px;
                    padding: 0 5px;
                }
            }
            .row-title {
                .cell {
                    width: 69px;
                    .row-title-label {
                        margin: 0 -18px;
                        text-align: center
                    }
                }
            }
            .row-col-empty {
                .cell {
                    width: 179px;
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
                .cell {
                    width: 179px;
                }
                .svg-icon {
                    display: none;
                }
            }
            .row-control {
                .cell {
                    width: 199px;
                    .control {
                        .control-col {
                            .row-index-hide {
                                display: none;
                            }
                            .col-num {
                                margin-right: 10px;
                            }
                        }
                        .control-row {
                            margin-top: 5px;
                        }
                    }
                }
            }
        }
        .el-input-number--small {
            width: 125px;
        }
    }
</style>
