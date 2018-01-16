<template>
    <div class="aisle-template sl-page-container flex-col">
        <div class="sl-header-panel" style="height: 36px;">
            <el-button class="back slic-btn-theme3 fl mr" size="small" @click="goToDevice">
                <icon-svg icon-class="fanhui"></icon-svg>
                返回
            </el-button>
            <span class="panel-title fl">
                <el-tag type="primary">{{$parent.groupInfo.groupName}}</el-tag>
                <el-tag type="success">{{$parent.posInfo.posName}}{{devIndex}}号柜</el-tag>
                <el-tag type="warning">
                    {{
                    this.$parent.deviceInfo.devType === 1 ? "弹簧机" :
                        this.$parent.deviceInfo.devType === 2 ? "蛇形机" :
                            this.$parent.deviceInfo.devType === 3 ? "格子柜" : "未知设备类型"
                    }}
                </el-tag>
            </span>
            <span class="fl ml">
                <div class="slic-input-group" style="width: 215px;">
                    <sl-input placeholder="请输入商品信息查询"
                              :input-val.sync="searchModel.goodsName"></sl-input>
                </div>
                <div class="slic-btn-group">
                    <el-button-group style="margin-top: -2px;">
                        <el-button type="primary" size="small" class="slic-btn-theme3" @click="search">查询</el-button>
                        <el-button type="primary" size="small" class="slic-btn-theme3" @click="reset">重置</el-button>
                    </el-button-group>
                </div>
            </span>
            <el-button type="primary" size="small" class="slic-btn-theme3 fr" @click="addSlaveRow" :disabled="loading">
                新增一行
            </el-button>
        </div>
        <div v-loading="loading" class="aisle-list overflow-y flex-col">
            <div class="sl-table-col flex-col" ref="aisleTempTable"
                 :class="{'hiddenFixedRight': aisleTempTableWidth > aisleTempTableActualWidth}">
                <el-table :data="tableData" :show-header="false"
                          :row-style="{display:'inline-block','margin-bottom':'10px'}"
                          height="custom" style="width: 100%">

                    <el-table-column fixed label="行序号" align="center" width="22" class-name="row-index">
                        <template scope="scope">
                            <span>{{ scope.row.rowIndex }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column fixed label="行标题" width="70" class-name="row-title">
                        <template scope="scope">
                            <div v-for="item in rowTitle" class="row-title-label">{{ item.label }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column v-for="(colIndex,index) in maxCol" :key="'table-col' + colIndex"
                                     :label="'第' + colIndex + '列'" align="center" width="110"
                                     :class-name="'row-col'">
                        <template scope="scope">
                            <div class="row-col-content">
                                <div v-if="data.rowy === colIndex" v-for="data in scope.row.rowColData"
                                     :key="'table-row-col' + colIndex"
                                     :class="{highLight: data.HIGHLIGHT && data.rowy === colIndex}">
                                    <div v-if="data.rowy === colIndex">
                                        <span title="编辑" @click="editAisleGoods(data, scope.row.rowIndex, colIndex)">
                                            <icon-svg iconClass="brush"></icon-svg>
                                        </span>
                                        <div class="palletId tx-overflow" :title="data.MYPALLETID">
                                            <span>{{ data.MYPALLETID }}</span>
                                        </div>
                                        <div class="goodsName tx-overflow" :title="data.MYGOODSNAME">
                                            <span v-show="data.ISSHOWGOODSINFO">{{ data.MYGOODSNAME }}</span>
                                        </div>
                                        <div class="price tx-overflow">
                                            <span v-show="data.ISSHOWGOODSINFO">{{ data.MYMAXQTY }}</span>
                                            <span v-show="data.ISSHOWGOODSINFO">/</span>
                                            <span v-show="data.ISSHOWGOODSINFO">{{ data.MYPRICE | formatMoney(2)
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <!--<el-table-column v-for="o in colMaxEmpty" :key="'col-max-empty' + o" label="空列" width="110"-->
                    <!--class-name="row-col-empty">-->
                    <!--<template scope="scope"></template>-->
                    <!--</el-table-column>-->

                    <el-table-column fixed="right" label="操作" align="center" width="200" class-name="row-control">
                        <template scope="scope">
                            <div class="control">
                                <div class="control-col">
                                    <div class="row-index-hide"><span>{{scope.row.rowIndex}}</span></div>
                                    <el-input-number
                                            v-disabled
                                            @change="handleColNumChange($event, scope.row);"
                                            :min="1" :max="maxCol" :disabled="loading"
                                            size="small" v-model="scope.row.rowColNum" class="col-num"
                                            :key="scope.row.rowIndex">
                                    </el-input-number>
                                    <span>列</span>
                                </div>
                                <el-button class="control-row" type="text" size="small" v-waves
                                           @click="delSlaveRow(scope.row)">删除行
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog class="add-goods-dialog" :visible.sync="editAisleGoodsDialogVisible" :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <span slot="title" class="dialog-header">
                <span>{{aisleTemplateGoodsInfo.palletId + '货道'}}</span>
            </span>
            <div style="margin-bottom: 10px;">
                <span style="width: 95px;margin-right: 10px;">商品名称: </span>
                <sl-input placeholder="请输入商品名称" :input-val.sync="addSearchGoods"
                          style="width: 250px;"></sl-input>
                <el-button type="primary" @click="getGoods()" size="small">查询</el-button>
            </div>
            <div style="height: calc(100% - 30px);" v-loading="goodsDialogLoading">
                <sl-grid :gridCol="gridColNewGoods" :gridValue="gridValNewGoods" :gridConfig="gridCfgNewGoods"
                         @rowSelected="doSelectedNewGoods" @pageSizeChange="handleSizeChangeNewGoods"
                         @currentPageChange="handleCurrentChangeNewGoods">
                    <template slot="spec" scope="prop">
                        <div>
                            {{ !prop.scope.row.spec2 ? prop.scope.row.spec : (prop.scope.row + ',' + prop.scope.row.spec2)
                            }}
                        </div>
                    </template>
                    <template slot="maxQty" scope="prop">
                        <!--<el-input size="small" placeholder="请输入最大存货数" v-model="prop.scope.row.maxQty"></el-input>-->
                        <el-input-number size="small" placeholder="请输入最大存货数" v-model="prop.scope.row.maxQty"
                                         :min="1"
                                         :max="$parent.deviceInfo.chnMaxSize"></el-input-number>
                    </template>
                </sl-grid>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="btn-sure" type="primary"
                           @click="editAisleGoodsDialogVisible = false;saveAisleGoods(aisleTemplateGoodsInfo)"
                           title="热键(暂无实现)">保存</el-button>
                <el-button size="small" class="btn-cancel" @click="editAisleGoodsDialogVisible = false"
                           title="热键(ESC)">取 消(ESC)</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import SlAutocomplete from '@/components/sl-autocomplete';
    import SlInput from '@/components/sl-input';
    import SlGrid from '@/components/sl-grid';
    import {getSlaveDetail} from '@/api/basic/group/group';
    import {isEmptyObject, prefixInteger} from 'utils/index';
    import doc from 'utils/doc';
    import {validateSignlessInteger} from 'utils/validate';
    import {getTemplateGoodsList, setPalletSlave, operateSlaveRowCol} from '@/api/basic/group/group';

    export default {
        name: 'aisle-template',
        components: {
            SlAutocomplete,
            SlInput,
            SlGrid
        },
        data() {
            return {
                // 页面加载进度
                loading: false,
                // 商品名称查询
                searchModel: {
                    goodsName: '',
                },
                // 当前售卖机信息
                posInfo: {},
                // 当前货柜信息
                posCounterInfo: {},
                // 最大列数
                maxCol: 0,
                // 最大行数
                maxRow: 0,
                // 货柜号
                devIndex: 0,
                // 货道标题设置
                rowTitle: [{
                    label: '货道',
                    name: 'palletId'
                }, {
                    label: '商品',
                    name: 'goodsname'
                }, {
                    label: '最大/价格',
                    name: 'price'
                }],
                // 表格随窗口变化而变化宽度
                aisleTempTableWidth: 0,
                // 表格实际固定宽度
                aisleTempTableActualWidth: 0,
                // 货柜的货道详情(后台返回数据)
                slaveDetailList: [],
                // 设备模板数据
                tableData: [],
                // "商品"选择弹出框
                editAisleGoodsDialogVisible: false, // 编辑货道商品弹出框是否显示
                aisleTemplateGoodsInfo: {},// 货道商品模型数据
                goodsDialogLoading: false,
                addSearchGoods: '',
                gridColNewGoods: [
                    {field: 'mygoodsid', name: '商品内码', width: '100px'},
                    {field: 'goodsname', name: '商品名称', width: '150px', align: 'left'},
                    {field: 'barcode', name: '条码', width: '120px'},
                    {field: 'spec', name: '规格', width: '200px', template: 'spec'},
                    {field: 'uname', name: '包装单位', width: '200px'},
                    {field: 'bulkprice', name: '模板售价', width: '100px', fixed: 'right'},
                    {field: 'maxQty', name: '最大存货数', width: '150px', fixed: 'right', template: 'maxQty'}
                ],
                gridValNewGoods: {rows: [], footer: {}},
                gridCfgNewGoods: {
                    selectMode: 'SINGLE', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    uniqueProp: 'goodsid',
                    radioValue: ''
                },
                selectedGridDataNewGoods: [],
            }
        },
        computed: {
            colMaxEmpty: function () {// 最大空列数,8 列为标准
                if (this.maxCol < 8) {
                    return 8 - this.maxCol;
                }
            }
        },
        methods: {
            // 跳转到设备模板列表
            goToDevice() {
                this.$parent.currentView = 'DeviceTemplate';
            },
            // 获取货柜的货道详情
            getSlaveDetailList() {
                let groupId = this.$parent.groupInfo.groupId,
                    devId = this.$parent.deviceInfo.devId;
                this.loading = true;
                return getSlaveDetail(groupId, devId).then((res) => {
                    console.log('[店组管理-设备模板-货道设置]货柜的货道详情: ', res);
                    let data = res.result;
                    this.slaveDetailList = data;
                    this.tableData = this.generatorTableData();
                    this.search();
                    this.loading = false;
                }).catch((err) => {
                    console.log(err);
                    this.tableData = [];
                    this.loading = false;
                })
            },
            // 获取商品列表
            getGoods(){
                let groupId = this.$parent.groupInfo.groupId,
                    goodsName = this.addSearchGoods,
                    catId = -1,
                    brandId = -1,
                    page = {
                        pageNum: this.gridValNewGoods.footer.pageNum || 1,
                        pageSize: this.gridValNewGoods.footer.pageSize || 25,
                        totalRecord: 0,
                        totalPage: 0,
                    };
                return getTemplateGoodsList(page, groupId, goodsName, brandId, catId).then((res) => {
                    this.goodsDialogLoading = false;
                    if (res.retCode === 'SUCCESS') {
                        this.gridValNewGoods.rows = res.result;
                        this.gridValNewGoods.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                        this.gridValNewGoods.rows.forEach((item, i) => {
                            this.$set(item, 'maxQty', this.aisleTemplateGoodsInfo.chnMaxGoods);
                        })
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.goodsDialogLoading = false;
                })
            },
            // 根据后台返回数据生成真实需要的数据
            generatorTableData(){
                let _slaveDetailList = this.slaveDetailList,
                    _tableData = [];
                if (_slaveDetailList.length > 0) {
                    // 构造行数据
                    for (let i = 0; i < _slaveDetailList.length; i++) {
                        let isTrue = _tableData.some((element, index, array) => {
                            return element.rowIndex === _slaveDetailList[i].rowx
                        })
                        if (isTrue) continue;
                        _tableData.push({
                            rowIndex: _slaveDetailList[i].rowx, // 行号
                            rowColNum: 0,// 展示列数
                            rowActualColNum: 0, // 代表有货的列数
                            rowColData: []
                        });
                    }
                    // 构造列数据
                    for (let i = 0; i < _tableData.length; i++) {
                        for (let col = 0; col < _slaveDetailList.length; col++) {
                            if (_tableData[i].rowIndex === _slaveDetailList[col].rowx) {
                                _tableData[i].rowColNum++
                                _slaveDetailList[col].ISSHOWGOODSINFO = false;
                                if (_slaveDetailList[col].gInfo && _slaveDetailList[col].gInfo.goodsid != -1) {
                                    _tableData[i].rowActualColNum++;
                                    _slaveDetailList[col].ISSHOWGOODSINFO = true;
                                }
                                _slaveDetailList[col].MYGOODSNAME = _slaveDetailList[col].gInfo.goodsname;
                                _slaveDetailList[col].MYMAXQTY = _slaveDetailList[col].chnMaxGoods || 0;
                                _slaveDetailList[col].MYPRICE = _slaveDetailList[col].gInfo.price || 0;
                                _tableData[i].rowColData.push(_slaveDetailList[col]);
                            }
                        }
                    }
                }
                _tableData = this.generatorPalletNum(this.posCounterInfo.devindex, this.posCounterInfo.devType, _tableData);
                console.log('[店组管理-设备模板-货道设置]货道设置前台展示数据: ', _tableData)
                return _tableData;
            },
            // 根据货柜号devIndex，设备类型sType和展示数据tableData生成货道号规则
            generatorPalletNum(devIndex, sType, tableData) {
                if (sType === 1 || sType === 2) {// 1-弹簧机 2-蛇形机 : 第一位数字是货柜号，第二位数字行号(从1开始), 第三位数字列号(从0开始)
                    for (let i = 0; i < tableData.length; i++) {
                        for (let col = 0, rowColData = tableData[i].rowColData, len = rowColData.length; col < len; col++) {
                            rowColData[col].MYPALLETID = '' + devIndex + tableData[i].rowIndex + col + '';
                        }
                    }
                } else if (sType === 3) { // 3-格子柜: (累加的)第一位数字是货柜号, 第二位，第三位从1开始累加，第二位(1,2,3,...,9)补0
                    var _MYPALLETID = 1,
                        _maxNum = this.posCounterInfo.maxRow*this.posCounterInfo.maxCol,
                        _prefixNum = _maxNum < 100 ? 2 : String(_maxNum).length;
                    for (let i = 0; i < tableData.length; i++) {
                        for (let col = 0, rowColData = tableData[i].rowColData, len = rowColData.length; col < len; col++) {
                            rowColData[col].MYPALLETID = '' + devIndex + prefixInteger(_MYPALLETID, _prefixNum) + '';
                            _MYPALLETID++;
                        }
                    }
                } else {
                    this.$message({
                        message: `货柜的设备类型不存在，请联系管理员`,
                        type: 'error'
                    });
                    return [];
                }
                return tableData;
            },
            // 货柜行列操作
            operateSlaveRowCol(type, rowcolList) {
                let slaveRowColOperRequest = {
                    groupId: this.$parent.groupInfo.groupId,
                    modelId: this.$parent.deviceInfo.modelId,
                    devId: this.$parent.deviceInfo.devId,
                    type: 3, // 统一特殊处理=>3
                    rowcolList: rowcolList
                }
                return operateSlaveRowCol(slaveRowColOperRequest).then((res) => {
                    console.log('[店组管理-设备模板-货道设置]货柜行列操作: ', res);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 根据查询条件过滤符合条件的商品
            search() {
                var reg = new RegExp(this.searchModel.goodsName);
                this.tableData.length > 0 && this.tableData.forEach((item, index, arr) => {
                    item.rowColData.length > 0 && item.rowColData.forEach((item, index, arr) => {
                        if (item.hasOwnProperty('MYGOODSNAME') && item['MYGOODSNAME'].match(reg)) {
                            this.$set(item, 'HIGHLIGHT', true && !!this.searchModel.goodsName);
                        } else {
                            this.$set(item, 'HIGHLIGHT', false);
                        }
                    })
                });
                console.log(this.tableData);
            },
            // 重置查询条件
            reset() {
                this.searchModel.goodsName = '';
                this.search();
            },
            // 货道设置新增一行
            addSlaveRow() {
                this.loading = true;
                if (this.tableData.length >= this.$parent.deviceInfo.maxRow) {
                    this.$message({
                        message: `新增一行失败，不能超出设备最大行 ${this.$parent.deviceInfo.maxRow} 行`,
                        type: 'error'
                    });
                    this.loading = false;
                    return;
                }

                // 新增一行数据
                const curRow = this.tableData.length + 1,
                    maxCol = this.posCounterInfo.maxCol;
                this.tableData.push({
                    rowIndex: curRow,
                    rowColNum: maxCol,
                    rowActualColNum: 0,
                    rowColData: []
                });

                // 根据设备的最大列数，新增该行的列数据
                for (let col = 1; col <= maxCol; col++) {
                    this.tableData[curRow - 1].rowColData.push({
                        rowx: curRow,
                        rowy: col
                    })
                }

                // 生成全新货道号
                this.tableData = this.generatorPalletNum(this.posCounterInfo.devindex, this.posCounterInfo.devType, this.tableData);

                // 生成后台新增行参数: rowcolList
                let rowcolList = [];
                this.tableData.forEach((item, index) => {
                    item.rowIndex = index + 1;
                    item.rowColData.forEach((data) => {
                        console.log('data', data);
                        rowcolList.push({
                            rowx: item.rowIndex,
                            rowy: data.rowy,
                            palletId: data.MYPALLETID,
                            goodsId: !data.gInfo ? -1 : data.gInfo.goodsid,
                            maxQty: data.MYMAXQTY
                        })
                    })
                })
                console.log('[店组管理-设备模板-货柜行列设置]生成后台【新增行】参数: rowcolList =>', rowcolList);

                // 发送新增行请求
                this.operateSlaveRowCol(1, rowcolList).then((res) => {
                    console.log('[店组管理-设备模板-货柜行列设置]新增一行->货柜的货道详情: ', res);
                    this.loading = false;
                    if (!!res && !!res.retCode && res.retCode === 'SUCCESS') {
                        this.$message({
                            message: `新增一行成功`,
                            type: 'success'
                        });
                    }
                    this.getSlaveDetailList();
                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
            },
            // 货道设置删除一行
            delSlaveRow(curItem) {
                this.$confirm('确定删除一行?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    this.maxRow = this.maxRow - 1;
                    console.log("[店组管理-设备模板-货道设置]删除一行->删除行详情:", curItem);

                    // 删除该行记录
                    this.tableData = this.tableData.filter(function (obj) {
                        return obj.rowIndex != curItem.rowIndex;
                    });

                    // 重新编排行序号
                    this.tableData.map(function (obj) {
                        return obj.rowIndex > curItem.rowIndex ? obj.rowIndex -= 1 : obj.rowIndex = obj.rowIndex;
                    });

                    // 生成全新货道号
                    this.tableData = this.generatorPalletNum(this.posCounterInfo.devindex, this.posCounterInfo.devType, this.tableData);

                    // 生成后台删除行参数: rowcolList
                    let rowcolList = [];
                    this.tableData.forEach((item, index) => {
                        item.rowIndex = index + 1;
                        item.rowColData.forEach((data) => {
                            rowcolList.push({
                                rowx: item.rowIndex,
                                rowy: data.rowy,
                                palletId: data.MYPALLETID,
                                goodsId: !data.gInfo ? -1 : data.gInfo.goodsid,
                                maxQty: data.MYMAXQTY
                            })
                        })
                    })
                    console.log('[店组管理-设备模板-货道设置]生成后台【删除行】参数: rowcolList =>', rowcolList);

                    // 发送删除行请求
                    this.operateSlaveRowCol(2, rowcolList).then((res) => {
                        console.log('[店组管理-设备模板-货道设置]删除一行->货柜的货道详情: ', res);
                        this.loading = false;
                        if (!!res && !!res.retCode && res.retCode === 'SUCCESS') {
                            this.$message({
                                message: `删除一行成功`,
                                type: 'success'
                            });
                        }
                        this.getSlaveDetailList();
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
                    });
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 某行记录的新增，删除列操作
            handleColNumChange(val, row) {
                var that = this,
                    rowIndex = row.rowIndex,
                    rowColNum = row.rowColNum,
                    type = rowColNum < val ? 1 : 2;
                let _handleColNumChange = function () {
                    // 更新tableData该行rowIndex的列数据
                    for (let i = 0, len = that.tableData.length; i < len; i++) {
                        if (that.tableData[i].rowIndex === rowIndex) {
                            if (type === 1) {// 新增列操作
                                that.tableData[i].rowColData.push({
                                    rowx: rowIndex,
                                    rowy: val
                                })
                            } else {// 删除列操作
                                that.tableData[i].rowColData.splice(val, 1)
                            }
                            break;
                        }
                    }

                    // 生成全新货道号
                    that.tableData = that.generatorPalletNum(that.posCounterInfo.devindex, that.posCounterInfo.devType, that.tableData);

                    // 生成后台新增删除列参数: rowcolList
                    let rowcolList = [];
                    that.tableData.forEach((item, index) => {
                        item.rowIndex = index + 1;
                        item.rowColData.forEach((data) => {
                            rowcolList.push({
                                rowx: item.rowIndex,
                                rowy: data.rowy,
                                palletId: data.MYPALLETID,
                                goodsId: !data.gInfo ? -1 : data.gInfo.goodsid,
                                maxQty: data.MYMAXQTY
                            })
                        })
                    })
                    console.log('[店组管理-设备模板-货道设置]生成后台【新增、删除列】参数: rowcolList =>', rowcolList);

                    // 发送删除新增列请求
                    that.loading = true;
                    that.operateSlaveRowCol(type, rowcolList).then((res) => {
                        that.loading = false;
                        if (!!res && !!res.retCode && res.retCode === 'SUCCESS') {
                            that.$message({
                                message: type === 1 ? `新增一列成功` : `删除一列成功`,
                                type: 'success'
                            });
                        }
                        that.getSlaveDetailList();
                    }).catch((err) => {
                        that.loading = false;
                        console.log(err);
                    });
                };

                // 发送删除新增列请求
                if (type === 2) {
                    // 【最后一列删除】判断按钮是否可以进行删除操作
                    let colNum = this.tableData[rowIndex - 1].rowColData.length;
                    if (colNum === 1) return;
                    // 【删除其它列】
                    this.$confirm('确定删除一列?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        // 删除操作
                        _handleColNumChange();
                    }).catch((err) => {
                        console.log('val, rowColNum', val, rowColNum)
                        row.rowColNum = rowColNum;
                    });
                } else {
                    // 判断按钮是否可以进行新增操作
                    let colNum = this.tableData[rowIndex - 1].rowColData.length;
                    if (colNum === this.posCounterInfo.maxCol) return;
                    // 新增操作
                    _handleColNumChange();
                }
            },
            // 弹出货道商品设置界面
            editAisleGoods(data, rowx, rowy){
                console.log('[店组管理-设备模板-货道设置]货道商品设置:', data)
                this.aisleTemplateGoodsInfo = {};
                this.addSearchGoods = '';
                this.selectedGridDataNewGoods = [];
                this.gridCfgNewGoods.radioValue = '';
                this.editAisleGoodsDialogVisible = true;
                this.aisleTemplateGoodsInfo = data;
                this.aisleTemplateGoodsInfo.rowx = rowx;
                this.aisleTemplateGoodsInfo.rowy = rowy;
                this.getGoods();
            },
            // 添加商品表格选中
            doSelectedNewGoods (data) {
                this.selectedGridDataNewGoods = data;
            },
            // 添加商品表格pageSize改变
            handleSizeChangeNewGoods (size) {
                this.selectedGridDataNewGoods = [];
                this.gridValNewGoods.footer.pageSize = size;
                this.getGoods();
            },
            // 添加商品页码改变
            handleCurrentChangeNewGoods (page) {
                this.selectedGridDataNewGoods = [];
                this.gridValNewGoods.footer.pageNum = page;
                this.getGoods();
            },
            // 保存货道商品设置
            saveAisleGoods(aisleTemplateGoodsInfo) {
                // 1. 校验数据
                if (Array.isArray(this.selectedGridDataNewGoods) && this.selectedGridDataNewGoods.length <= 0) {
                    this.$message({
                        message: `请选择商品！`,
                        type: 'error'
                    });
                    this.editAisleGoodsDialogVisible = true;
                    return;
                }
                if(!validateSignlessInteger(this.selectedGridDataNewGoods.maxQty + '')){
                    this.$message.error('请输入合法的最大存货数！');
                    this.editAisleGoodsDialogVisible = true;
                    return false;
                };
                // 2. 执行保存
                aisleTemplateGoodsInfo = Object.assign({}, this.aisleTemplateGoodsInfo, this.selectedGridDataNewGoods);
                let modelId = this.$parent.deviceInfo.modelId,
                    palletid = aisleTemplateGoodsInfo.palletId,
                    goodsid = aisleTemplateGoodsInfo.goodsid,
                    maxQty = aisleTemplateGoodsInfo.maxQty,
                    rowx = aisleTemplateGoodsInfo.rowx,
                    rowy = aisleTemplateGoodsInfo.rowy;
                setPalletSlave(modelId, palletid, goodsid, maxQty, rowx, rowy).then((res) => {
                    this.$message({
                        message: `保存成功`,
                        type: 'success'
                    })
                    this.getSlaveDetailList();
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        mounted () {
            const that = this;
            console.log('group aisle template mounted', that);
            window.onresize = () => {
                return (() => {
                    that.aisleTempTableWidth = that.$refs['aisleTempTable'].clientWidth;
                })()
            }
        },
        updated: function () {
            this.$nextTick(function () {
                // 没有货道信息数据的添加disabled样式
                this.tableData.forEach((item) => {
                    let $tbody = this.$el.getElementsByClassName('el-table__body-wrapper')[0].getElementsByTagName("tbody")[0],
                        elem = $tbody.rows[item.rowIndex - 1].cells[item.rowColNum + 1];
                    if (!!elem) doc.controlsSiblingElemDisabledClass(elem);
                })
            })
        },
        activated() {
            console.log('[店组管理-设备模板-货道设置]货柜设备->详情: ', this.$parent.deviceInfo);
            this.maxCol = this.$parent.deviceInfo.maxCol;
            this.maxRow = this.$parent.deviceInfo.maxRow;
            this.devIndex = this.$parent.deviceInfo.devindex;
            this.posCounterInfo = this.$parent.deviceInfo;
            this.posInfo = this.$parent.posInfo;
            this.aisleTempTableWidth = this.$refs.aisleTempTable.clientWidth;
            this.aisleTempTableActualWidth = 22 + 70 + 110 * this.maxCol + 200 * 2;
            if (this.$parent.deviceInfo.hasOwnProperty('devId')) this.getSlaveDetailList();
            this.$nextTick(() => {
                this.reset();
            })
        },
        deactivated() {
            this.$parent.posInfo = {};
            this.$parent.deviceInfo = {};
        },
        directives: {
            disabled: {
                // 指令的定义
                inserted: function (el, binding, vnode) {
                    el.getElementsByTagName('input')[0].setAttribute('readonly', 'readonly');
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .aisle-template {
        .sl-header-panel {
            span {
                height: 28px;
                line-height: 28px;
            }
        }
        .sl-search-panel {
            margin: 0 -10px;
            .search-goods-name {

            }
        }
        .sl-table-col {
            &.hiddenFixedRight {
                .el-table {
                    .el-table__body-wrapper {
                        .row-control {
                            .cell {
                                visibility: visible;
                            }
                        }
                    }
                    .el-table__fixed-right {
                        .el-table__fixed-body-wrapper {
                            .row-control {
                                display: none;
                                .cell {
                                    visibility: visible;
                                }
                            }
                        }
                    }
                }
            }
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
                            width: 20px;
                        }
                    }
                    .row-title {
                        .cell {
                            width: 68px;
                        }
                    }
                    .row-col-empty, .row-col {
                        .cell {
                            width: 108px;
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
                        width: 21px;
                        padding: 0 5px;
                        word-break: normal;
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
                        width: 109px;
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
                        width: 109px;
                    }
                    .svg-icon {
                        display: none;
                    }
                    .row-col-content {
                        .highLight {
                            border: 2px solid #28e;
                            margin: 0 -5px;
                        }
                        .palletId, .goodsName, .price {
                            height: 24px;
                        }
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
        .add-goods-dialog {
            &.el-dialog__wrapper {
                .el-dialog {
                    &.el-dialog--small {
                        width: 800px;
                        height: 480px;
                        .el-dialog__body {
                            height: 400px;
                        }
                    }
                }
            }
        }
    }

    .goods-name-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .goods-id {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .goods-id {
                color: #ddd;
            }
        }
    }
</style>