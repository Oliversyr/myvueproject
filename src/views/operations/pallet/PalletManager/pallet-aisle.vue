<template>
    <!-- 货道详情管理: 货道设置内容 -->
    <div class="pallet-aisle flex-col">
        <!-- 货道详情管理: 货道设置头部内容 -->
        <div class="pallet-aisle-header">
            <el-tag type="success">
                {{posCounterInfo.myposid}}号机{{posCounterInfo.counterid}}号柜
            </el-tag>
            <el-tag type="warning">{{
                posCounterInfo.devtype === 1 ? "弹簧机" :
                    posCounterInfo.devType === 2 ? "蛇形机" :
                        posCounterInfo.devType === 3 ? "格子柜" : "未知设备类型"
                }}
            </el-tag>
        </div>
        <!-- 货道详情管理: 表格内容 -->
        <div class="sl-table-col flex-col" ref="palletAisle"
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
                                 :label="'第' + colIndex + '列'" align="center" width="110" class-name="row-col">
                    <template scope="scope">
                        <div class="row-col-content">
                            <div v-for="data in scope.row.rowColData" :key="'table-row-col' + colIndex">
                                <div v-if="data.rowy === colIndex">
                                        <span title="编辑"
                                              @click="openAdjustPalletGoodsDialog(data, scope.row.rowIndex, colIndex)">
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
                                        :min="1" :max="maxCol"
                                        :disabled="loading"
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
        <!-- 货道详情管理: 商品调整弹出框 -->
        <el-dialog :visible.sync="adjustPalletGoodsDialogVisible">
            <span slot="title" class="dialog-header">
                <span>{{goodsTemplateInfo.palletId + '货道'}}</span>
            </span>
            <el-form :model="goodsTemplateInfo" :inline="true" :rules="rules" ref="goodsTemplateInfo" label-width="90px"
                     style="width: 100%;">
                <el-form-item label="商品名称：" prop="goodsName" style="width: 755px;">
                    <el-select v-model="selectGoodsType" placeholder="请选择" size="small" style="width: 100px;">
                        <el-option label="普通商品" :value="1"></el-option>
                        <el-option label="组合商品" :value="2"></el-option>
                    </el-select>
                    <span v-show="selectGoodsType === 1">
                        <sl-autocomplete
                                ref="goodsAuto"
                                :autoParams="goodsAutoModel.autoParams"
                                :dataList="goodsAutoModel.goodsList"
                                slWidth="550"
                                colWidths="20,30,50"
                                displayProp="goodsname"
                                @querykey="goodsAutoQuery"
                                @doAutoSelected="handleGoodsAutoSelect"
                                selectedMode="SINGLE"
                                style="width: 300px;display: inline-block;">
                        </sl-autocomplete>
                    </span>
                    <span v-show="selectGoodsType === 2">
                        <sl-autocomplete
                                ref="bomGoodsAuto"
                                :autoParams="bomGoodsAutoModel.autoParams"
                                :dataList="bomGoodsAutoModel.bomGoodsList"
                                slWidth="550"
                                colWidths="20,30,50"
                                displayProp="bomName"
                                @querykey="goodsAutoQuery"
                                @doAutoSelected="handleGoodsAutoSelect"
                                selectedMode="SINGLE"
                                style="width: 300px;display: inline-block;">
                        </sl-autocomplete>
                    </span>
                </el-form-item>
                <el-collapse-transition>
                    <div v-show="selectGoodsType === 1">
                        <el-form-item label="条码：" prop="barcode" style="width: 240px;">
                            <el-input size="small" v-model="goodsTemplateInfo.barcode" :disabled="true"
                                      style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="内码：" prop="mygoodsid" style="width: 240px;">
                            <el-input size="small" v-model="goodsTemplateInfo.mygoodsid" :disabled="true"
                                      style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="规格：" prop="spec" style="width: 240px;">
                            <el-input size="small" v-model="goodsTemplateInfo.spec" :disabled="true"
                                      style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="包装单位：" prop="packunit" style="width: 240px;">
                            <el-input size="small" v-model="goodsTemplateInfo.uname" :disabled="true"
                                      style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="最大存货：" prop="maxQty" style="width: 240px;">
                            <el-input-number size="small" v-model="goodsTemplateInfo.maxQty"
                                             @change="handleMaxStoreChange"
                                             :min="1"
                                             :max="posCounterInfo.chnmaxsize"
                                             style="width: 150px;"></el-input-number>
                        </el-form-item>
                        <el-form-item label="售价：" prop="price" style="width: 240px;">
                            <el-input size="small" v-model="goodsTemplateInfo.price" :disabled="true"
                                      style="width: 150px;"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-transition>
                <el-collapse-transition>
                    <div v-show="selectGoodsType === 2">
                        <el-form-item label="包含商品：" prop="bomGoodsName">
                            <el-input size="small" v-model="goodsTemplateInfo.bomGoodsName" :disabled="true"
                                      style="width: 405px;"></el-input>
                        </el-form-item>
                        <el-form-item label="最大存货：" prop="maxQty" style="width: 240px;">
                            <el-input-number size="small" v-model="goodsTemplateInfo.maxQty"
                                             @change="handleMaxStoreChange"
                                             :min="1"
                                             :max="posCounterInfo.chnmaxsize"
                                             style="width: 150px;"></el-input-number>
                        </el-form-item>
                        <el-form-item label="售价：" prop="price" style="width: 240px;">
                            <el-input size="small" v-model="goodsTemplateInfo.price" :disabled="true"
                                      style="width: 150px;"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-transition>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="btn-sure" type="primary"
                           @click="adjustPalletGoodsDialogVisible = false;adjustPalletGoods()"
                           title="热键(暂无实现)">保存</el-button>
                <el-button size="small" class="btn-cancel" @click="adjustPalletGoodsDialogVisible = false"
                           title="热键(ESC)">取 消(ESC)</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    // 公共库，组件
    import Vue from 'vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    // 工具库
    import {prefixInteger} from 'utils/index';
    import doc from 'utils/doc';
    // API库
    import {getGoodsTip} from '@/api/operations/goods';
    import {getBomList} from '@/api/operations/bom/bom';
    import {getShopGoodsList, getShopSlaveDetail, setPalletSlave, operateSlaveRowCol} from '@/api/operations/shop/shop';

    export default {
        name: 'pallet-aisle',
        components: {
            SlAutocomplete
        },
        props: {
            // 查询参数
            searchParams: {
                type: Object,
                default: {
                    posId: -1,
                    palletId: -1,
                    goodsId: -1,
                    counterid: -1,
                    status: -1
                }
            },
            // 数据加载进度条
            loading: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 货柜信息
                posCounterInfo: {},
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
                // "商品"选择弹出框自动完成功能
                adjustPalletGoodsDialogVisible: false, // 编辑货道商品弹出框是否显示
                goodsTemplateInfo: {},// 货道商品模型数据
                selectGoodsType: 1, // 1 普通商品 2 组合商品
                goodsAutoModel: {
                    goodsList: [],
                    autoParams: {
                        goodsid: '商品内码',
                        goodsname: '商品名称',
                        catLName: '所属品类'
                    }
                },
                bomGoodsAutoModel: {
                    bomGoodsList: [],
                    autoParams: {
                        bomId: '组合商品编码',
                        bomName: '组合商品名称',
                        bomGoodsName: '包含商品'
                    }
                },
                rules: { // 页面表单校验规则

                }
            }
        },
        computed: {
            // 最大空列数,8 列为标准
            colMaxEmpty: function () {
                if (this.maxCol < 8) {
                    return 8 - this.maxCol;
                }
            },
            // 默认为货柜设备的最大列数
            maxCol() {
                return this.$parent['posCounterInfo'].maxcol;
            },
            // 默认为货柜设备的最大行数
            maxRow() {
                return this.$parent['posCounterInfo'].maxrow;
            }
        },
        methods: {
            // 【API】获取【店铺】货柜的货道详情
            getShopSlaveDetail() {
                let shopEid = this.$parent.palletInfo.eid,
                    devId = this.posCounterInfo.devid;
                this.$emit('update:loading', true);
                return getShopSlaveDetail(shopEid, devId).then((res) => {
                    console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]后台返回的货道信息: ', res);
                    let data = res.result;
                    this.slaveDetailList = data;
                    this.tableData = this.generatorTableData();
                    // 结束加载进度条
                    this.$emit('update:loading', false);
                }).catch((err) => {
                    console.log(err);
                    this.tableData = [];
                    this.$emit('update:loading', false);
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
                                _tableData[i].rowColData.push(_slaveDetailList[col])
                            }
                        }
                    }
                }
                _tableData = this.generatorPalletNum(this.posCounterInfo.counterid, this.posCounterInfo.devtype, _tableData);
                console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]货道信息前台展示数据: ', _tableData)
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
                        _maxNum = this.posCounterInfo.maxrow*this.posCounterInfo.maxcol,
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
            // 货柜行列操作:  (新增type=1;删除type=2);(rowcolList操作行列信息)
            operateSlaveRowCol(type, rowcolList) {
                let slaveRowColOperRequest = {
                    groupId: this.$parent.palletInfo.groupId || -1,
                    modelId: this.posCounterInfo.devid || -1,
                    eid: this.$parent.palletInfo.eid || -1,
                    type: type,
                    rowcolList: rowcolList
                }
                return operateSlaveRowCol(slaveRowColOperRequest).then((res) => {
                    console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]货柜行列操作: ', res);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 货道设置新增一行
            addSlaveRow() {
                this.$emit('update:loading', true);
                if (this.tableData.length >= this.posCounterInfo.maxrow) {
                    this.$message({
                        message: `新增一行失败，不能超出设备最大行 ${this.posCounterInfo.maxrow} 行`,
                        type: 'error'
                    });
                    this.$emit('update:loading', false);
                    return;
                }

                // 新增一行数据
                const curRow = this.tableData.length + 1,
                    maxCol = this.posCounterInfo.maxcol;
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
                this.tableData = this.generatorPalletNum(this.posCounterInfo.counterid, this.posCounterInfo.devtype, this.tableData);

                // 生成后台新增行参数: rowcolList
                let rowcolList = [];
                this.tableData.forEach((item, index) => {
                    item.rowIndex = index + 1;
                    item.rowColData.forEach((data) => {
                        rowcolList.push({
                            rowx: item.rowIndex,
                            rowy: data.rowy,
                            palletId: data.MYPALLETID,
                            goodsId: !data.gInfo ? -1 : data.gInfo.goodsid,
                            devId: this.posCounterInfo.devid,
                            posId: this.posCounterInfo.posid,
                            counterid: this.posCounterInfo.counterid,
                            maxQty: data.chnMaxGoods || 0,
                            weightProp: data.weightProp || 0
                        })
                    })
                })
                console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]生成后台【新增行】参数: rowcolList =>', rowcolList);

                // 发送新增行请求
                this.operateSlaveRowCol(1, rowcolList).then((res) => {
                    console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]新增一行->货柜的货道详情: ', res);
                    this.$emit('update:loading', false);
                    this.$message({
                        message: `新增一行成功`,
                        type: 'success'
                    });
                    this.getShopSlaveDetail();
                }).catch((err) => {
                    this.$emit('update:loading', false);
                    console.log(err);
                });
            },
            // 货道设置删除一行
            delSlaveRow(curItem) {
                this.$confirm('确定删除一行?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.$emit('update:loading', true);
                    this.maxRow = this.maxRow - 1;
                    console.log("[货道管理-店铺货道详情-FORM-货柜行列设置]删除一行->删除行详情:", curItem);

                    // 删除该行记录
                    this.tableData = this.tableData.filter(function (obj) {
                        return obj.rowIndex != curItem.rowIndex;
                    });

                    // 重新编排行序号
                    this.tableData.map(function (obj) {
                        return obj.rowIndex > curItem.rowIndex ? obj.rowIndex -= 1 : obj.rowIndex = obj.rowIndex;
                    });

                    // 生成全新货道号
                    this.tableData = this.generatorPalletNum(this.posCounterInfo.counterid, this.posCounterInfo.devtype, this.tableData);

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
                                devId: this.posCounterInfo.devid,
                                posId: this.posCounterInfo.posid,
                                counterid: this.posCounterInfo.counterid,
                                maxQty: data.chnMaxGoods || 0,
                                weightProp: data.weightProp || 0
                            })
                        })
                    })
                    console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]生成后台【删除行】参数: rowcolList =>', rowcolList);

                    // 发送删除行请求
                    this.operateSlaveRowCol(2, rowcolList).then((res) => {
                        console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]删除一行->货柜的货道详情: ', res);
                        this.$emit('update:loading', false);
                        this.$message({
                            message: `删除一行成功`,
                            type: 'success'
                        });
                        this.getShopSlaveDetail();
                    }).catch((err) => {
                        console.log(err);
                        this.$emit('update:loading', false);
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
                    that.tableData = that.generatorPalletNum(that.posCounterInfo.counterid, that.posCounterInfo.devtype, that.tableData);

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
                                devId: that.posCounterInfo.devid,
                                posId: that.posCounterInfo.posid,
                                counterid: that.posCounterInfo.counterid,
                                maxQty: data.chnMaxGoods || 0,
                                weightProp: data.weightProp || 0
                            })
                        })
                    })
                    console.log('[货道管理-店铺货道详情-FORM-货柜行列设置]生成后台【新增、删除列】参数: rowcolList =>', rowcolList);

                    // 发送删除新增列请求
                    that.$emit('update:loading', true);
                    that.operateSlaveRowCol(type, rowcolList).then((res) => {
                        that.$emit('update:loading', false);
                        that.getShopSlaveDetail().then(() => {
                            that.$message({
                                message: type === 1 ? `新增一列成功` : `删除一列成功`,
                                type: 'success'
                            });
                        });
                    }).catch((err) => {
                        that.$emit('update:loading', false);
                        console.log(err);
                    });
                };

                // 发送删除新增列请求
                if (type === 2) {
                    // 【最后一列删除】判断按钮是否可以进行删除操作
                    let colNum = this.tableData[rowIndex - 1].rowColData.length;
                    if(colNum === 1) return;
                    // 【删除其它列】
                    this.$confirm('确定删除一列?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        _handleColNumChange();
                    }).catch((err) => {
                        console.log('val, rowColNum', val, rowColNum)
                        row.rowColNum = rowColNum;
                    });
                } else {
                    // 判断按钮是否可以进行新增操作
                    let colNum = this.tableData[rowIndex - 1].rowColData.length;
                    if(colNum === this.posCounterInfo.maxcol) return;
                    // 新增操作
                    _handleColNumChange();
                }
            },
            /*
             * 以下是编辑"货道商品"弹出框中的设备类型名称自动完成功能
             */
            // 打开调整商品弹出框
            openAdjustPalletGoodsDialog(data, rowIndex, colIndex) {
                console.log('[货道管理-Aisle-货道设置]货道商品设置:', data, this.posCounterInfo)
                this.goodsTemplateInfo = {};
                this.$nextTick(()=>{
                    this.$refs['goodsAuto'].clearItem && this.$refs['goodsAuto'].clearItem(0);
                    this.$refs['bomGoodsAuto'].clearItem && this.$refs['bomGoodsAuto'].clearItem(0);
                })
                this.adjustPalletGoodsDialogVisible = true;
                this.goodsTemplateInfo.palletId = data.palletId;
                this.goodsTemplateInfo.posId = this.posCounterInfo.posid;
                this.goodsTemplateInfo.counterId = this.posCounterInfo.counterid;
                this.goodsTemplateInfo.maxQty = data.chnMaxGoods;
                this.goodsTemplateInfo.rowx = rowIndex;
                this.goodsTemplateInfo.rowy = colIndex;
            },
            // 自动补全搜索
            goodsAutoQuery(key){
                if (this.selectGoodsType === 1) {
                    let params = {
                            shopEid: this.$parent.palletInfo.eid,
                            goodsName: key,
                            brandId: -1,
                            catId: -1,
                            status: 1,
                            goodsId: -1
                        },
                        page = {
                            pageNum: 1,
                            pageSize: 10000,
                            totalRecord: 0,
                            totalPage: 0,
                        };
                    return getShopGoodsList(page, params).then((res) => {
                        if (res.retCode === 'SUCCESS') {
                            this.goodsAutoModel.goodsList = res.result;
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    let goodsId = -1,
                        bomGoodsName = key,
                        ename = this.$parent.palletInfo.ename,
                        shopEid = this.$parent.palletInfo.eid,
                        status = 1,
                        page = {
                            pageNum: 1,
                            pageSize: 100000,
                            totalRecord: 0,
                            totalPage: 0,
                        };
                    return getBomList(page, goodsId, bomGoodsName, ename, shopEid, status).then((res) => {
                        this.bomGoodsAutoModel.bomGoodsList = res.result;
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            },
            // 自动补全选中
            handleGoodsAutoSelect(sel){
                console.log('[货道管理-店铺货道详情-FORM-货道商品设置]商品自动补全商品原信息',sel)
                this.goodsTemplateInfo = Object.assign({}, this.goodsTemplateInfo, sel);
            },
            // 处理最大存货数
            handleMaxStoreChange(val) {
                this.goodsTemplateInfo = Object.assign({}, this.goodsTemplateInfo, {
                    maxQty: val
                });
            },
            // 调整商品
            adjustPalletGoods () {
                console.log('[货道管理-店铺货道详情-FORM-货道商品设置]调整商品的商品模板信息: ', this.goodsTemplateInfo);
                let shopEid = this.$parent.palletInfo.eid,
                    slaveRowCol = {
                        devId: this.posCounterInfo.devid,
                        palletId: this.goodsTemplateInfo.palletId ,
                        goodsId: this.selectGoodsType === 1 ? this.goodsTemplateInfo.goodsid : this.goodsTemplateInfo.bomId,
                        maxQty: this.goodsTemplateInfo.maxQty,
                        rowx: this.goodsTemplateInfo.rowx,
                        rowy: this.goodsTemplateInfo.rowy,
                        posId: this.posCounterInfo.posid,
                        counterid: this.posCounterInfo.counterid,
                        weightProp: this.selectGoodsType === 1 ? 0 : 6
                    };
                if(!slaveRowCol.goodsId){
                    this.$message({
                        message: '请选择相应商品进行调整',
                        type: 'error'
                    });
                    this.adjustPalletGoodsDialogVisible = true;
                    return;
                }
                return setPalletSlave(shopEid, slaveRowCol).then((res) => {
                    console.log('[货道管理-店铺货道详情-FORM-货道商品设置]调整商品API返回结果: ', res);
                    this.getShopSlaveDetail().then(() => {
                        this.$message({
                            message: `货道商品设置成功`,
                            type: 'success'
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 组件初始化
            init() {
                this.aisleTempTableWidth = this.$refs.palletAisle.clientWidth;
                this.aisleTempTableActualWidth = 22 + 70 + 110 * this.maxCol + 200 * 2;
                this.posCounterInfo = this.$parent['posCounterInfo'];
                this.getShopSlaveDetail();
            }
        },
        mounted () {
            const that = this;
            console.log('pallet aisle mounted', that);
            window.onresize = () => {
                return (() => {
                    that.aisleTempTableWidth = that.$refs.palletAisle.clientWidth;
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
            this.init();
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
    .pallet-aisle {
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