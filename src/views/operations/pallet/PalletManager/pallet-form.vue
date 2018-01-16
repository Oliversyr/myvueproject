<template>
    <!-- 货道详情管理: Form详情 -->
    <div class="pallet-form flex-col" v-loading="loading">
        <!-- 货道详情管理: 货柜tabs -->
        <el-tabs v-model="activeTabName" @tab-click="doSwitchCounter">
            <el-tab-pane v-for="(item, index) in posCounterList" :label="item.myposid + '号机' + item.counterid + '号柜'"
                         :name="item.devid + ''">
            </el-tab-pane>
        </el-tabs>
        <!-- 货道详情管理: 表格内容 -->
        <div class="sl-table-col flex-col">
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
                            <div v-for="(data,index) in scope.row.rowColData"
                                 :key="'table-row-col' + colIndex">
                                <div v-if="data.rowy === colIndex">
                                    <div class="aisle-status"
                                         :class="{'aisle-status-0': data.status === 2, 'aisle-status-1': data.status === 1, 'aisle-status-2': data.status === 3}"
                                         v-show="data.status != 0">
                                        {{
                                        data.status === 1 ? "故障" :
                                            data.status === 2 ? "缺货" :
                                                data.status === 3 ? "暂销" : ""
                                        }}
                                    </div>
                                    <div class="more-op" v-show="myModulePower.edit">
                                        <icon-svg iconClass="gengduo" @mouseenter.native.prevent="showMenu"></icon-svg>
                                        <sl-contextmenu :contextMenuData="contextMenuData"
                                                        :transferElem="transferElem"
                                                        @goToPalletFaultDetail="goToPalletFaultDetail(data)"
                                                        @adjustPalletGoods="openAdjustPalletGoodsDialog(data)"
                                                        @updatePosStatus="updatePosStatus(data)"></sl-contextmenu>
                                    </div>
                                    <div class="palletId tx-overflow" :title="data.MYPALLETID">
                                        <span>{{ data.MYPALLETID }}</span>
                                    </div>
                                    <div class="goodsName tx-overflow" :title="data.MYGOODSNAME">
                                        <span v-show="data.ISSHOWGOODSINFO">{{ data.MYGOODSNAME }}</span>
                                    </div>
                                    <div class="qtyMax tx-overflow">
                                        <span v-show="data.ISSHOWGOODSINFO"
                                              v-bind:style="{ color: Number(data.MYQTY) === 0 ? 'red': ''}">{{ data.MYQTY}}</span>
                                        <span v-show="data.ISSHOWGOODSINFO"
                                              v-bind:style="{ color: Number(data.MYQTY) === 0 ? 'red': ''}">/</span>
                                        <span v-show="data.ISSHOWGOODSINFO"
                                              v-bind:style="{ color: Number(data.MYQTY) === 0 ? 'red': '', 'margin-right': '5px'}">{{ data.MYMAXQTY}}</span>
                                        <span v-show="data.ISSHOWGOODSINFO"> {{data.MYUNAME }}</span>
                                    </div>
                                    <div class="price tx-overflow">
                                        <span v-show="data.ISSHOWGOODSINFO">{{ data.MYPRICE | formatMoney(2) }}</span>
                                    </div>
                                </div>
                            </div>
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
                            <el-input size="small" v-model="goodsTemplateInfo.packunit" :disabled="true"
                                      style="width: 150px;"></el-input>
                        </el-form-item>
                        <el-form-item label="最大存货：" prop="maxQty" style="width: 240px;">
                            <el-input-number size="small" v-model="goodsTemplateInfo.maxQty"
                                             @change="handleMaxStoreChange"
                                             :min="1"
                                             :max="chnMaxSize"
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
                                             :max="chnMaxSize"
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
    import {getShopGoodsList, getShopSlaveList, getShopSlaveDetail} from '@/api/operations/shop/shop';
    import {getGoodsTip} from '@/api/operations/goods';
    import {getBomList} from '@/api/operations/bom/bom';
    import {adjustPalletGoods, updatePosStatus} from '@/api/operations/pallet/pallet';
    import {prefixInteger} from 'utils/index';
    import doc from 'utils/doc';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'pallet-form',
        mixins: [ViewBtnsPower],
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
                // 店铺售卖机货柜信息
                posCounterList: [],
                // 最大列数
                maxCol: 0,
                // 最大行数
                maxRow: 0,
                // 最大存货
                chnMaxSize: 1,
                // 当前激活的货柜tab
                activeTabName: '',
                // 货道标题设置
                rowTitle: [
                    {
                        label: '货道',
                        name: 'MYAISLE'
                    }, {
                        label: '商品',
                        name: 'MYGOODSNAME'
                    }, {
                        label: '存货/最大',
                        name: 'MYQTYMAX'
                    }, {
                        label: '售价',
                        name: 'MYPRICE'
                    }
                ],
                // 货柜的货道详情(后台返回数据)
                slaveDetailList: [],
                // 设备模板数据
                tableData: [],
                // 右键菜单功能
                transferElem: null,
                contextMenuData: {
                    menuName: 'demo',
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [
                        {
                            fnHandler: 'goToPalletFaultDetail',
                            btnName: '故障详情',
                            disabled: true
                        },
                        {
                            fnHandler: 'adjustPalletGoods',
                            btnName: '商品调整'
                        }
                        ,
                        {
                            fnHandler: 'updatePosStatus',
                            btnName: '暂停/恢复销售'
                        }
                    ]
                },
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
            // 当前激活的货柜信息
            posCounterInfo(){
                var posCounterInfo = {};
                if (Array.isArray(this.posCounterList)) {
                    posCounterInfo = this.posCounterList.filter((item, index) => {
                        return item.devid === Number(this.activeTabName);
                    })[0];
                }
                return posCounterInfo;
            }
        },
        watch: {
            // 用途：监测当前货柜信息
            'posCounterInfo': {
                handler: function (val, oldVal) {
                    this.maxCol = this.posCounterInfo.hasOwnProperty('maxcol') ? this.posCounterInfo.maxcol : 0;
                    this.maxRow = this.posCounterInfo.hasOwnProperty('maxrow') ? this.posCounterInfo.maxrow : 0;
                    this.chnMaxSize = this.posCounterInfo.hasOwnProperty('chnmaxsize') ? this.posCounterInfo.chnmaxsize : 1;
                    console.log('最大行列存货', this.maxRow, this.maxCol, this.chnMaxSize);
                },
                deep: true
            }
        },
        methods: {
            // 【API】查询店铺的所有货柜
            getShopSlaveList() {
                let shopEid = this.$parent.palletInfo.eid,
                    posId = this.searchParams.posId || -1,
                    goodsId = this.searchParams.goodsId || -1,
                    palletid = this.searchParams.palletId || -1,
                    counterid = this.searchParams.counterid || -1,
                    status = this.searchParams.status || -1;
                return getShopSlaveList(shopEid, posId, goodsId, palletid, counterid, status).then((res) => {
                    let data = res.result;
                    this.$parent['posCounterList'] = data;
                    this.posCounterList = data;
                    if (this.posCounterList.length === 0) {
                        this.tableData = [];
                        return;
                    }
                    this.activeTabName = this.posCounterList[0].devid + '';
                    this.getShopSlaveDetail(this.posCounterInfo);
                    console.log('[PalletManager][货道管理-店铺货道详情]获取店铺的所有货柜信息：', res);
                    return Promise.resolve(res);
                }).catch((err) => {
                    console.log(err);
                    return Promise.reject(err);
                })
            },
            // 【API】获取【店铺】货柜的货道详情
            getShopSlaveDetail(item) {
                console.log('[货道管理-店铺货道详情-FORM]后台返回的货道信息posCounterInfo: ', item);
                if (!item.devid) {
                    this.tableData = [];
                    return;
                }
                let shopEid = this.$parent.palletInfo.eid,
                    devId = item.devid;
                this.$emit('update:loading', true);
                return getShopSlaveDetail(shopEid, devId).then((res) => {
                    console.log('[货道管理-店铺货道详情-FORM]后台返回的货道信息: ', res);
                    let data = res.result;
                    this.slaveDetailList = data;
                    this.tableData = this.generatorTableData();
                    this.$emit('update:loading', false);
                }).catch((err) => {
                    console.log(err);
                    this.tableData = [];
                    this.$emit('update:loading', false);
                })
            },
            // 切换店铺货柜信息
            doSwitchCounter(tab, event) {
                console.log('切换店铺货柜信息', tab, event);
                // 清空展示数据
                this.tableData = [];
                // 根据 devid 获取货柜的货道详情
                let item = {devid: Number(this.activeTabName)};
                this.getShopSlaveDetail(item);
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
                                _slaveDetailList[col].MYGOODSNAME = _slaveDetailList[col].gInfo.goodsname || '';
                                _slaveDetailList[col].MYMAXQTY = _slaveDetailList[col].chnMaxGoods || 0;
                                _slaveDetailList[col].MYQTY = _slaveDetailList[col].gInfo.qty || 0;
                                _slaveDetailList[col].MYUNAME = _slaveDetailList[col].gInfo.uname || '';
                                _slaveDetailList[col].MYPRICE = _slaveDetailList[col].gInfo.price || 0;
                                _tableData[i].rowColData.push(_slaveDetailList[col])
                            }
                        }
                    }
                }
                _tableData = this.generatorPalletNum(this.posCounterInfo.counterid, this.posCounterInfo.devtype, _tableData);
                console.log('[货道管理-店铺货道详情-FORM]货道信息前台展示数据: ', _tableData)
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
            // 右键菜单功能
            showMenu () {
                this.transferElem = event.currentTarget.nextSibling.nextElementSibling;
                var x = event.clientX - 110;
                var y = event.clientY - 5;
                this.contextMenuData.axios = {
                    x, y
                }
            },
            // 打开调整商品弹出框
            openAdjustPalletGoodsDialog(goodsTemplateInfo) {
                console.log('[货道管理-Form-货道设置设置]打开调整商品弹出框: data =>', goodsTemplateInfo);
                this.goodsTemplateInfo = {};
                this.$nextTick(() => {
                    this.$refs['goodsAuto'].clearItem && this.$refs['goodsAuto'].clearItem(0);
                    this.$refs['bomGoodsAuto'].clearItem && this.$refs['bomGoodsAuto'].clearItem(0);
                })
                this.adjustPalletGoodsDialogVisible = true;
                this.goodsTemplateInfo.palletId = goodsTemplateInfo.palletId;
                this.goodsTemplateInfo.posId = this.posCounterInfo.posid;
                this.goodsTemplateInfo.counterId = this.posCounterInfo.counterid;
                this.goodsTemplateInfo.maxQty = goodsTemplateInfo.chnMaxGoods;
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
                this.goodsTemplateInfo = Object.assign({}, this.goodsTemplateInfo, sel);
            },
            // 处理最大存货数
            handleMaxStoreChange(val) {
                this.goodsTemplateInfo = Object.assign({}, this.goodsTemplateInfo, {
                    maxQty: val
                });
            },
            // 跳转到故障详情
            goToPalletFaultDetail (data) {
                console.log(data)
            },
            // 调整商品
            adjustPalletGoods () {
                console.log('[货道管理-店铺货道详情-Form]调整商品的商品模板信息: ', this.goodsTemplateInfo);
                let posId = this.goodsTemplateInfo.posId,
                    palletId = this.goodsTemplateInfo.palletId,
                    goodsId = this.selectGoodsType === 1 ? this.goodsTemplateInfo.goodsid : this.goodsTemplateInfo.bomId,
                    counterid = this.goodsTemplateInfo.counterId,
                    eid = this.$parent.palletInfo.eid,
                    weightprop = this.selectGoodsType === 1 ? 0 : 6,
                    maxQty = this.goodsTemplateInfo.maxQty;
                if (!goodsId) {
                    this.$message({
                        message: '请选择相应商品进行调整',
                        type: 'error'
                    });
                    this.adjustPalletGoodsDialogVisible = true;
                    return;
                }
                return adjustPalletGoods(posId, palletId, goodsId, counterid, weightprop, eid, maxQty).then((res) => {
                    console.log('[货道管理-店铺货道详情-Form]调整商品API返回结果: ', res);
                    this.$message({
                        message: '调整商品成功',
                        type: 'success'
                    });
                    this.getShopSlaveDetail(this.posCounterInfo);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 暂停/恢复销售
            updatePosStatus (data) {
                console.log('[货道管理-店铺货道详情-Form]暂停/恢复销售传入数据: ', data);
                let posId = this.posCounterInfo.posid,
                    status = data.status === 0 ? 3 : 0,
                    palletId = data.palletId,
                    eid = this.$parent.palletInfo.eid;
                if (status != 0 && status != 3 && !!status) {
                    this.$message({
                        message: `只对'正常'或者'暂停销售'状态有效`,
                        type: 'error'
                    });
                    return;
                }
                return updatePosStatus(posId, status, palletId, eid).then((res) => {
                    console.log('[货道管理-店铺货道详情-Form]暂停/恢复销售API返回结果: ', res);
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getShopSlaveDetail(this.posCounterInfo);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 货道设置
            palletAisle() {
                this.$parent.currentView = "PalletAisle";
                this.$parent['posCounterInfo'] = this.posCounterInfo;
            },
            // 组件初始化
            init() {
                // 获取店铺售卖机货柜信息
                this.getShopSlaveList();
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
            // fix bug: 解决货柜tab保留问题
//            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .pallet-form {
        .el-tabs {
            margin-right: 60px;
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
                    .aisle-status {
                        position: absolute;
                        top: 0;
                        left: 0;
                        color: #fff;
                        padding: 0 5px;
                        &.aisle-status-0 {
                            background-color: #ffbb00;
                        }
                        &.aisle-status-1 {
                            background-color: #ff4949;
                        }
                        &.aisle-status-2 {
                            background-color: #ff4949;
                        }
                    }
                    .more-op {
                        overflow: hidden;
                        .svg-icon {
                            display: inline-block;
                            color: #ccc;
                            position: absolute;
                            top: 0px;
                            right: 5px;
                            height: 2em;
                            width: 2em;
                        }
                    }
                    .row-col-content {
                        .palletId, .goodsName, .qtyMax, .price {
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
        .el-input-number__decrease, .el-input-number__increase {
            top: 0;
        }
    }
</style>