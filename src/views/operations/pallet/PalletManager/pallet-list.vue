<template>
    <div class="pallet-list flex-col" v-loading="loading">
        <!-- 货道管理List：表格头部 -->
        <div class="grid-top clearfix">
            <div class="grid-top-left mt-xs">
                <dl class="grid-sort">
                    <dt class="active" v-show="false">综合</dt>
                    <dd @click="sortByStockQty">货道库存
                        <i class="icon-sort icon-sort-up-gray" v-show="isSortValueUp"></i>
                        <i class="icon-sort icon-sort-down-gray" v-show="!isSortValueUp"></i>
                    </dd>
                </dl>
            </div>
            <div class="grid-top-right export-btn">
                <excel-expimp ref="expImp" :fileName="'货道列表详情'" :header="gridCol" @getResultArr="importData" v-if="myModulePower.export"
                              @goToExp="doExport" :exportData="expData" :isImport="false"></excel-expimp>
            </div>
        </div>
        <!-- 货道管理List：表格内容 -->
        <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                 @rowSelected="handleSelectionChange"
                 @pageSizeChange="handleSizeChange"
                 @currentPageChange="handleCurrentChange">
            <template slot="MYQTYMAX" scope="prop">
                <span v-bind:style="{color: prop.scope.row.MYQTY === 0 ? 'red' : ''}">{{prop.scope.row.MYQTYMAX}}</span>
            </template>
            <template slot="MYSHORTSTOCK" scope="prop">
                <span v-bind:style="{color: prop.scope.row.MYSHORTSTOCK > 0 ? 'red' : ''}">{{prop.scope.row.MYSHORTSTOCK}}</span>
            </template>
            <template slot="operate" scope="prop">
                <div class="row-op">
                    <el-button type="text" title="商品调整" @click="openAdjustPalletGoodsDialog(prop.scope.row)"
                               v-mouseEnter>
                        <span class="row-op-icon"><icon-svg :iconClass="'shangpinguanli'"></icon-svg></span>
                        <span class="row-op-icon-active"><icon-svg
                                :iconClass="'shangpinguanli-highligh'"></icon-svg></span>
                    </el-button>
                    <el-button type="text" title="暂停销售" @click="updatePosStatus(prop.scope.row)"
                               v-show="prop.scope.row.status === 0" v-mouseEnter>
                        <span class="row-op-icon"><icon-svg :iconClass="'zantingxiaoshou'"></icon-svg></span>
                        <span class="row-op-icon-active"><icon-svg
                                :iconClass="'zantingxiaoshou-highlight'"></icon-svg></span>
                    </el-button>
                    <el-button type="text" title="恢复销售" @click="updatePosStatus(prop.scope.row)"
                               v-show="prop.scope.row.status === 3" v-mouseEnter>
                        <span class="row-op-icon"><icon-svg :iconClass="'jixuxiaoshou'"></icon-svg></span>
                        <span class="row-op-icon-active"><icon-svg
                                :iconClass="'jixuxiaoshou-highligh'"></icon-svg></span>
                    </el-button>
                    <el-button type="text" title="故障详情" v-show="prop.scope.row.status === 1" disabled v-mouseEnter >
                        <span class="row-op-icon"><icon-svg :iconClass="'guzhangxiangqing'"></icon-svg></span>
                        <span class="row-op-icon-active"><icon-svg :iconClass="'guzhangxiangqing-highligh'"></icon-svg></span>
                    </el-button>
                </div>
            </template>
        </sl-grid>
        <!-- 货道管理List：商品调整弹出框 -->
        <el-dialog :visible.sync="adjustPalletGoodsDialogVisible" size="tiny">
            <span slot="title" class="dialog-header">
                <span>{{goodsTemplateInfo.palletId + '货道'}}</span>
            </span>
            <el-form :model="goodsTemplateInfo" :inline="true" :rules="rules" ref="goodsTemplateInfo" label-width="90px"
                     style="width: 100%;">
                <el-form-item label="商品名称：" prop="goodsName" style="width: 525px;" class="mt10">
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
                                             :max="goodsTemplateInfo.chnmaxsize"
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
                                             :max="goodsTemplateInfo.chnmaxsize"
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
    import {getTemplateGoodsList} from '@/api/basic/group/group';
    import {getGoodsTip} from '@/api/operations/goods';
    import {getBomList} from '@/api/operations/bom/bom';
    import {getShopPalletInfo, adjustPalletGoods, updatePosStatus} from '@/api/operations/pallet/pallet';
    import {getShopGoodsList} from '@/api/operations/shop/shop';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import ExcelExpimp from '@/components/excel-import-export.vue';
    import SlGrid from '@/components/sl-grid';
    import ElInput from "../../../../../node_modules/element-ui/packages/input/src/input";
    import Event from '@/utils/event';
    import Doc from '@/utils/doc';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'pallet-list',
        mixins: [ViewBtnsPower],
        components: {
            ElInput,
            ExcelExpimp,
            SlAutocomplete,
            SlGrid
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
                // 默认按照【货道库存降序】排列
                isSortValueUp: false,
                // 操作列的【右键菜单功能】
                transferElem: null,
                contextMenuData: {
                    menuName: 'pallet-list-more',
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [{
                        fnHandler: 'updatePosStatus',
                        btnName: '暂停/恢复销售'
                    }]
                },
                // 【"商品"选择弹出框】自动完成功能
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
                // 表格配置信息
                gridCol: [
                    {field: 'MYPOSINFO', name: '货柜', width: '150', align: 'center', fixed: true},
                    {field: 'palletId', name: '货道号', align: 'center', fixed: true},
                    {field: 'goodsName', name: '商品名称', minWidth: '100', align: 'left'},
                    {field: 'uname', name: '销售单位', width: '90', align: 'center'},
                    {field: 'price', name: '售价', align: 'right'},
                    {field: 'MYQTYMAX', name: '库存数', align: 'right', template: 'MYQTYMAX'},
                    {field: 'MYSHORTSTOCK', name: '缺货数', align: 'right', template: 'MYSHORTSTOCK'},
                    {field: 'barcode', name: '商品条码', width: '120', align: 'center'},
                    {field: 'MYSPEC', name: '规格', width: '120', align: 'center', template: ''},
                    {field: 'MYDEVTYPE', name: '货柜类型', width: '100', align: 'center', template: ''},
                    {field: 'rowx', name: '所在行', align: 'center'},
                    {field: 'rowy', name: '所在列', align: 'center'},
                    {field: 'MYSTATUS', name: '状态', width: '100', align: 'center', fixed: 'right', template: ''},
                    {
                        field: 'operate',
                        name: '操作',
                        width: '120',
                        fixed: 'right',
                        align: 'center',
                        isSort: false,
                        template: 'operate'
                    }
                ],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer'
                },
                multipleSelection: [],// 表格数据选择
                // 表格导出功能
                showExp: false,
                expData: [],
                // 页面表单校验规则
                rules: {}
            }
        },
        methods: {
            // 获取货道列表信息
            getShopPalletInfo(isSortValueUp, sortField){
                let params = {
                        posId: this.searchParams.posId || -1,
                        palletId: this.searchParams.palletId || -1,
                        goodsId: this.searchParams.goodsId || -1,
                        counterid: this.searchParams.counterid || -1,
                        status: this.searchParams.status || -1,
                        sortValue: isSortValueUp ? 'asc' : 'desc', // 默认按照货道库存降序排列
                        sortBy: !sortField ? -1 : sortField,// -1默认，1售卖机号，2货柜号，3货道号，4货道库存
                        eid: this.$parent.palletInfo.eid
                    },
                    page = {
                        pageNum: this.gridVal.footer.pageNum || 1,
                        pageSize: this.gridVal.footer.pageSize || 25,
                        totalRecord: 0,
                        totalPage: 0,
                    };
                this.$emit('update:loading', true);
                return getShopPalletInfo(page, params).then((res) => {
                    console.log('[PalletManager][货道管理-店铺货道详情]获取店铺货道列表信息：', res);
                    this.$emit('update:loading', false);
                    if (res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.gridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                        this.gridVal.rows.map((item) => {
                            item.MYPOSINFO = item.posId + '号机' + item.counterId + '号柜';
                            item.MYQTY = item.stockQty || 0;
                            item.MYQTYMAX = item.stockQty + '/' + item.maxQty;
                            item.MYSHORTSTOCK = item.maxQty - item.stockQty;
                            item.MYDEVTYPE = item.devType === 1 ? "弹簧机" :
                                item.devType === 2 ? "蛇形机" :
                                    item.devType === 3 ? "格子柜" : "";
                            item.MYSTATUS = item.status === 1 ? "故障" :
                                item.status === 2 ? "缺货" :
                                    item.status === 3 ? "暂停销售" : "正常";
                            item.MYSPEC = (item.spec1 === 'null' ? '-' : item.spec1) + '  ' + (item.spec2 === 'null' ? '-' : item.spec2);
                        })
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.$emit('update:loading', false);
                })
            },
            // 根据货道库存手动排序
            sortByStockQty(){
                this.isSortValueUp = !this.isSortValueUp;
                this.getShopPalletInfo(this.isSortValueUp, 4);
            },
            // 更多按钮菜单
            showMenu () {
                this.transferElem = event.currentTarget.nextSibling.nextElementSibling;
                var x = event.clientX - 110;
                var y = event.clientY;
                this.contextMenuData.axios = {
                    x, y
                }
            },
            // 打开调整商品弹出框
            openAdjustPalletGoodsDialog(goodsTemplateInfo) {
                console.log('[货道管理-List-货道设置设置]打开调整商品弹出框: data =>', goodsTemplateInfo);
                this.goodsTemplateInfo = {};
                this.$nextTick(() => {
                    this.$refs['goodsAuto'].clearItem && this.$refs['goodsAuto'].clearItem(0);
                    this.$refs['bomGoodsAuto'].clearItem && this.$refs['bomGoodsAuto'].clearItem(0);
                })
                this.adjustPalletGoodsDialogVisible = true;
                this.goodsTemplateInfo.palletId = goodsTemplateInfo.palletId;
                this.goodsTemplateInfo.posId = goodsTemplateInfo.posId;
                this.goodsTemplateInfo.counterId = goodsTemplateInfo.counterId;
                this.goodsTemplateInfo.maxQty = goodsTemplateInfo.maxQty;
                this.goodsTemplateInfo.chnmaxsize = goodsTemplateInfo.chnmaxsize;
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
            // 调整商品
            adjustPalletGoods() {
                console.log('[货道管理-列表详情-调整商品]商品信息: ', this.goodsTemplateInfo,);
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
                    console.log('[货道管理-列表详情-调整商品]调整商品API返回结果: ', res);
                    this.$message({
                        message: '调整商品成功',
                        type: 'success'
                    });
                    this.getShopPalletInfo();
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 暂停/恢复销售
            updatePosStatus (data) {
                console.log('[货道管理-列表详情-暂停/恢复销售]暂停/恢复销售传入数据: ', data);
                let posId = data.posId,
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
                    console.log('[货道管理-列表详情-调整商品]暂停/恢复销售API返回结果: ', res);
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getShopPalletInfo();
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 处理表格数据选择
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 处理表格数据分页大小
            handleSizeChange(size) {
                this.gridVal.footer.pageSize = size;
                this.getShopPalletInfo();
            },
            // 处理表格数据当期页
            handleCurrentChange(page) {
                this.gridVal.footer.pageNum = page;
                this.getShopPalletInfo();
            },
            // 导入
            importData(data) {
                console.log('importData==', data);
                this.gridVal.rows = this.gridVal.rows.concat(data);
            },
            // 导出
            doExport(str) {
                let _this = this,
                    _doExport = function (expData) {
                        console.log("货道列表详情数据导出:", expData);
                        _this.$refs['expImp'].doExport();
                        _this.showExp = false;
                    }
                this.expData = [];
                if (str === 'current') {
                    this.expData = this.gridVal.rows;
                    _doExport(this.expData);
                } else if (str === 'select') {
                    this.expData = this.multipleSelection;
                    _doExport(this.expData);
                } else if (str === 'all') {
                    console.log(this.searchParams)
                    let params = {
                            posId: this.searchParams.posId || -1,
                            palletId: this.searchParams.palletId || -1,
                            goodsId: this.searchParams.goodsId || -1,
                            counterid: this.searchParams.counterid || -1,
                            status: this.searchParams.status || -1,
                            sortValue: 'desc', // 默认按照货道库存降序排列
                            sortBy: -1,// -1默认，1售卖机号，2货柜号，3货道号，4货道库存
                            eid: this.$parent.palletInfo.eid
                        },
                        page = {
                            pageNum: 1,
                            pageSize: this.gridVal.footer.totalRecord,
                            totalRecord: 0,
                            totalPage: 0,
                        };
                    this.$emit('update:loading', true);
                    return getShopPalletInfo(page, params).then((res) => {
                        this.$emit('update:loading', false);
                        if (res.retCode === 'SUCCESS') {
                            this.expData = res.result;
                            this.expData.map((item) => {
                                item.MYPOSINFO = item.posId + '号机' + item.counterId + '号柜';
                                item.MYQTYMAX = item.stockQty + '/' + item.maxQty;
                                item.MYSHORTSTOCK = item.maxQty - item.stockQty;
                                item.MYDEVTYPE = item.devType === 1 ? "弹簧机" :
                                    item.devType === 2 ? "蛇形机" :
                                        item.devType === 3 ? "格子柜" : "";
                                item.MYSTATUS = item.status === 1 ? "故障" :
                                    item.status === 2 ? "缺货" :
                                        item.status === 3 ? "暂停销售" : "正常";
                                item.MYSPEC = (item.spec1 === 'null' ? '-' : item.spec1) + '  ' + (item.spec2 === 'null' ? '-' : item.spec2);
                            })
                            _doExport(this.expData);
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
                        console.log(err);
                        this.$emit('update:loading', false);
                    })
                }
            },
            // 组件初始化
            init() {
                if(!this.myModulePower.edit){
                    let colIndex = this.gridCol.length - 1;
                    this.$set(this.gridCol, colIndex, Object.assign({}, this.gridCol[colIndex], {
                        isShow: false
                    }));
                }
                this.getShopPalletInfo();
            }
        },
        directives: {
            // 处理操作按钮的指令
            mouseEnter: {
                inserted: function (el) {
                    Event.addEvent(el, 'mouseenter', () => {
                        Doc.addClass(el, 'active');
                    })
                    Event.addEvent(el, 'mouseleave', () => {
                        Doc.removeClass(el, 'active');
                    })
                }
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .pallet-list {
        .grid-top-right.export-btn {
            float: right;
            /*margin-top: 10px!important;*/
            margin-right: 70px !important;
            /*.import-export-wrap {*/
            /*height: 20px!important;*/
            /*.el-dropdown {*/
            /*line-height: 20px!important;*/
            /*overflow: hidden;*/
            /*.el-button {*/
            /*height: 20px!important;*/
            /*line-height: 20px!important;*/
            /*}*/
            /*}*/
            /*}*/
        }

        .el-table {
            .row-op {
                &:hover {
                    color: #28e !important;
                }
                color: #999;
                cursor: pointer;
                .row-op-icon {
                    display: inline-block;
                }
                .row-op-icon-active {
                    display: none;
                }
                .active {
                    .row-op-icon {
                        display: none;
                    }
                    .row-op-icon-active {
                        display: inline-block;
                    }
                }
            }
        }

        .el-dialog--tiny {
            width: 580px;
        }

        .el-input-number__decrease, .el-input-number__increase {
            top: 0;
        }
    }
</style>