<template>
    <div class="myGrid flex-col" ref="myGrid">
        <!-- 表体内容 -->
        <div class="grid-table" ref="myGridTable" :class="{'nopage': gridConfig.noPage}">
            <el-table
                    :data="gridValue.rows"
                    style="width: 100%"
                    border
                    highlight-current-row
                    :height="gridConfig.height || 'customer'"
                    :max-height="gridConfig.maxHeight"
                    @selection-change="multSelected"
                    @current-change="singleSelect"
                    @cell-mouse-enter="cellMouseEnter"
                    @cell-mouse-leave="cellMouseLeave"
                    scope="scope">
                <el-table-column
                        type="index"
                        label="序号"
                        :fixed="gridConfig.frozen"
                        v-if="gridConfig.noPage"
                        align="center"
                        width="40">
                </el-table-column>

                <el-table-column
                        type="index"
                        label="序号"
                        :fixed="gridConfig.frozen"
                        v-if="!gridConfig.noPage"
                        align="center"
                        width="40">
                    <template scope="scope">
                        <span>{{ (scope.$index + 1) + (gridValue.footer.pageNum - 1) * gridValue.footer.pageSize}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        v-if="gridConfig.selectMode === 'MULT'"
                        class-name="sl-table-checkbox"
                        type="selection"
                        align="center"
                        :fixed="gridConfig.frozen"
                        width="33">
                </el-table-column>

                <el-table-column
                        v-if="gridConfig.selectMode === 'SINGLE'"
                        :fixed="gridConfig.frozen"
                        align="center"
                        width="40">
                    <template scope="scope">
                        <el-radio class="radio" v-model="radio" :label="scope.$index" v-if="!gridConfig.uniqueProp">&nbsp;</el-radio>
                        <el-radio class="radio" v-model="gridConfig.radioValue" :label="scope.row[gridConfig.uniqueProp]" v-else>&nbsp;</el-radio>
                    </template>
                </el-table-column>

                <el-table-column
                        v-for="(col, index) in gridColInner"
                        :key="index"
                        :prop="col.field"
                        :label="col.name"
                        :width="col.width"
                        :min-width="col.minWidth"
                        :align="col.align || 'center'"
                        :fixed="col.fixed"
                        :class-name="col.class || ''"
                        :show-overflow-tooltip="col.overflowTip === undefined"
                        :sortable="col.isSort == undefined ? true : col.isSort">
                    <template scope="scope">
                        <slot :name="col.template" v-if="col.template" :scope="scope">
                        </slot>
                        <span v-else>{{scope.row[col.field]}}</span>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <!-- 表格分页内容 -->
        <div class="grid-pagination" v-if="!gridConfig.noPage">
            <el-pagination
                    class="pagination-style"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="gridValue.footer.pageNum"
                    :page-sizes="[10, 20, 25, 50, 70]"
                    :page-size="gridValue.footer.pageSize"
                    layout="total, prev, pager, next, jumper, sizes"
                    :total="gridValue.footer.totalRecord">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'sl-grid',
        props: ['gridCol', 'gridValue', 'gridConfig'],
        data() {
            return {
                radio: ''
            }
        },
        computed: {
            gridColInner: function () {
                let _gridColInner = this.gridCol.filter((item, index, arr) => {
                    if (typeof(item.isShow) == "undefined") {
                        item.isShow = true;
                    }
                    return item.isShow;
                })
                return _gridColInner;
            }
        },
        methods: {
            // 表格选中--多选
            multSelected (data) {
                this.$emit('rowSelected', data);
            },
            // 表格选中--单选
            singleSelect(data) {
                if (this.gridConfig.selectMode === 'SINGLE' && !!data) {
                    if(!this.gridConfig.uniqueProp) {
                        this.radio = data.$index;
                    }else {
                        this.gridConfig.radioValue = data[this.gridConfig.uniqueProp];
                    }
                    this.$emit('rowSelected', data);
                }
            },
            // 每页显示条数
            handleSizeChange (size) {
                this.radio = this.gridConfig.radioValue = '';
                this.$emit('pageSizeChange', size);
            },
            // 页码改变
            handleCurrentChange (page) {
                this.radio = this.gridConfig.radioValue = '';
                this.$emit('currentPageChange', page);
            },
            // 当单元格 hover 进入时会触发该事件
            cellMouseEnter(row, column, cell, event) {
                this.$emit('cellMouseEnter', row, column, cell, event);
            },
            // 当单元格 hover 退出时会触发该事件
            cellMouseLeave(row, column, cell, event) {
                this.$emit('cellMouseLeave', row, column, cell, event);
            },
            // 表格初始化
            init() {
                this.radio = this.gridConfig.radioValue = '';
            }
        },
        mounted(){
            this.init();
        }
    }

</script>

<style rel="stylesheet/css" lang="scss">
    .myGrid {
        height: 100%;
        .grid-table {
            height: calc(100% - 48px);
            .el-table {
                overflow-x: auto !important;
            }
        }
        .nopage {
            height: 100%;
        }
        .grid-pagination {
            position: relative;
            height: 48px;
        }

        .el-table__fixed, .el-table__fixed-right {
            box-shadow: none;
        }

        .el-table__body-wrapper {
            .el-table__empty-block {
                min-height: 200px;
            }
        }

        .gridStyle {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            min-width: 80px;

            .cell {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;

                span {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }

        .el-table {
            &.el-table--border tr > td {
                border-right: none;
            }

            &.el-table--border tr > td {
                position: relative;

                &:last-child::after {
                    content:"";
                    position: absolute;
                    top:0;
                    right: 0px;
                    width: 0px;
                    height: 100%;
                    border-right: 1px solid #dfe6ec;
                }

            }
        }



    }
</style>