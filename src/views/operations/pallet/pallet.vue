<template>
    <div class="pallet sl-page-container flex-col">
        <div class="sl-search-panel" style="padding-bottom: 0;">
            <div class="slic-input-group sl-search-item" style="width:265px ;">
                <sl-input :prepend="'店铺名称'" placeholder="请输入店铺名称"
                          :input-val.sync="searchModel.eName"></sl-input>
            </div>
            <sl-select prepend="所属店组" class="sl-search-item" style="width:265px ;">
                <el-select v-model="belongGroupValue" placeholder="请输入或选择店组" :default-first-option="true"
                           clearable
                           filterable
                           :loading="searchModel.belongGroup.loading"
                           slot="ELSelect" size="small">
                    <el-option
                            v-for="item in searchModel.belongGroup.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </sl-select>
            <div v-show="false" class="slic-input-group sl-search-item" style="width:265px ;">
                <sl-autocomplete
                        ref="goodsAuto"
                        :autoParams="goodsAutoModel.autoParams"
                        :dataList="goodsAutoModel.goodsList"
                        slWidth="750"
                        colWidths="20,30,50"
                        displayProp="goodsname"
                        @querykey="goodsAutoQuery"
                        @doAutoSelected="handleGoodsAutoSelect"
                        prepend="商品名称"
                        selectedMode="SINGLE">
                </sl-autocomplete>
            </div>
            <el-collapse-transition>
                <span v-show="true" style="margin-right: 15px;">
                    <sl-select prepend="状态" class="sl-search-item" style="width: 265px;">
                        <el-select v-model.value="searchModelStatus" placeholder="请选择"
                                   filterable
                                   slot="ELSelect" size="small">
                            <el-option label="全部" :value="-1"></el-option>
                            <el-option label="未开业" :value="0"></el-option>
                            <el-option label="营业中" :value="1"></el-option>
                            <el-option label="休息中" :value="2"></el-option>
                            <el-option label="已停业" :value="3"></el-option>
                        </el-select>
                    </sl-select>
                </span>
            </el-collapse-transition>
            <div class="slic-btn-group sl-search-item" style="vertical-align: baseline;">
                <el-button-group>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="search" :disabled="loading">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="reset">重置</el-button>
                    <!--<el-button type="primary" size="small" class="slic-btn-theme3"
                               @click.native.stop="isShowMoreBtn = !isShowMoreBtn">
                        更多
                    </el-button>-->
                </el-button-group>
            </div>
        </div>

        <div class="sl-operator-panel">
            <div class="sl-operator-right" v-show="false">
                <el-button-group class="mr-xsmall">
                    <el-button type="primary" size="small" class="shop-status-opening slic-btn-theme3">导入
                    </el-button>
                </el-button-group>
                <el-button-group>
                    <el-button type="primary" size="small" class="shop-status-opening slic-btn-theme3">通知运营人员排障
                    </el-button>
                    <el-button type="primary" size="small" class="shop-status-closed slic-btn-theme3">通知运营人员上货
                    </el-button>
                </el-button-group>
            </div>
        </div>

        <div class="sl-content-panel flex-col overflow-y" v-loading="loading">
            <div class="grid-top clearfix">
                <div class="grid-top-left mt-xs">
                    <dl class="grid-sort">
                        <dt class="active" v-show="false">综合</dt>
                        <dd @click="sortByInSaleRate">商品有货率
                            <i class="icon-sort icon-sort-up-gray" v-show="isSortValueUp"></i>
                            <i class="icon-sort icon-sort-down-gray" v-show="!isSortValueUp"></i>
                        </dd>
                    </dl>
                </div>
            </div>
            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                     @rowSelected="handleSelectionChange" @pageSizeChange="handleSizeChange"
                     @currentPageChange="handleCurrentChange">
                <template slot="eid" scope="prop">
                    <el-button type="text" size="small" @click.native="goToShopDetail(prop.scope.row)" v-if="shopModulePower.look">
                        {{prop.scope.row.eid}}
                    </el-button>

                    <span v-else>{{prop.scope.row.eid}}</span>
                </template>
                <template slot="inSaleRate" scope="prop">
                    <span v-bind:style="{color: prop.scope.row.inSaleRate < 60 ? 'red' : ''}">
                        {{prop.scope.row.inSaleRate + '%'}}
                    </span>
                </template>
                <template slot="errorCount" scope="prop">
                    <span v-bind:style="{color: prop.scope.row.errorCount > 0 ? 'red' : ''}">
                        {{prop.scope.row.errorCount}}
                    </span>
                </template>
                <template slot="scPalletRate" scope="prop">
                    <span v-bind:style="{color: prop.scope.row.scPalletRate < 60 ? 'red' : ''}">
                        {{prop.scope.row.scPalletRate + '%'}}
                    </span>
                </template>
                <template slot="ccPalletRate" scope="prop">
                    <span v-bind:style="{color: prop.scope.row.ccPalletRate < 50 ? 'red' : ''}">
                        {{prop.scope.row.ccPalletRate + '%'}}
                    </span>
                </template>
                <template slot="status" scope="prop">
                    <div>
                        {{prop.scope.row.status === 0 ? "未开业" :
                        prop.scope.row.status === 1 ? "营业中" :
                            prop.scope.row.status === 2 ? "休息中" :
                                prop.scope.row.status === 3 ? "已停业" : "休息中"
                        }}
                    </div>
                </template>
                <template slot="operate" scope="prop">
                    <el-button @click.native="goToPalletManager(prop.scope.row)" type="text" size="small">详情</el-button>
                </template>
            </sl-grid>
        </div>
    </div>
</template>

<script>
    import {getShopPalletSummalyInfo} from '@/api/operations/pallet/pallet';
    import {getGroupList} from '@/api/basic/group/group';
    import {getGoodsTip} from '@/api/operations/goods';
    import {sortBy} from 'utils/index';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import SlGrid from '@/components/sl-grid';
    import SlInput from '@/components/sl-input.vue';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'pallet',
        mixins: [ViewBtnsPower],
        components: {
            SlAutocomplete,
            SlGrid,
            SlInput
        },
        data() {
            return {
                // 页面数据加载
                loading: false,
                // 查询参数
                belongGroupValue: '',
                searchModelStatus: 1,
                searchModel: {
                    eName: '',
                    belongGroup: {
                        options: [],
                        list: [],
                        loading: false
                    },
                    goodsId: -1
                },
                goodsAutoModel: {
                    goodsList: [],
                    autoParams: {
                        goodsid: '商品内码',
                        goodsname: '商品名称',
                        catLName: '所属品类'
                    }
                },
                // 是否显示更多按钮
                isShowMoreBtn: false,
                // 默认按照商品有货率降序排列
                isSortValueUp: false,
                // 货道列表表格配置信息
                gridCol: [
                    {field: 'eid', name: '店铺编码', width: '120', align: 'center', fixed: 'left', template: 'eid'},
                    {field: 'ename', name: '店铺名称', minWidth: '120', align: 'left',},
                    {field: 'inSaleCount', name: '店铺在售商品数', width: '130', align: 'right'},
                    {field: 'inSaleRate', name: '在售商品有货率', width: '130', align: 'right', template: 'inSaleRate'},
                    {field: 'errorCount', name: '货道故障数', width: '130', align: 'right', template: 'errorCount'},
                    {field: 'scabinet', name: '弹簧柜', width: '85', align: 'right'},
                    {field: 'scPalletCount', name: '弹簧柜货道数', width: '130', align: 'right'},
                    {field: 'scPalletRate', name: '弹簧柜货道有货率', width: '130', align: 'right', template: 'scPalletRate'},
                    {field: 'ccabinet', name: '格子柜', width: '85', align: 'right'},
                    {field: 'ccPalletCount', name: '格子柜货道数', width: '130', align: 'right'},
                    {field: 'ccPalletRate', name: '格子柜货道有货率', width: '130', align: 'right', template: 'ccPalletRate'},
                    {field: 'status', name: '状态', width: '100', align: 'center', fixed: 'right', template: 'status'},
                    {
                        field: 'operate',
                        name: '操作',
                        width: '80',
                        template: 'operate',
                        fixed: 'right',
                        align: 'center',
                        isSort: false
                    }
                ],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer'
                },
                multipleSelection: [],// 表格数据选择
            }
        },
        computed: {},
        methods: {
            // 跳转到店铺货道列表
            goToPalletManager(palletInfo) {
                this.$parent.palletInfo = palletInfo;
                this.$router.push({path: 'palletDetail', query: {palletInfo: JSON.stringify(palletInfo)}});
            },
            // 跳转到店铺详情
            goToShopDetail(shopInfo) {
                this.$router.push({path: 'shopInfo', query: {shopId: shopInfo.eid, pageType: 3}});
            },
            // 获取货道店铺汇总信息
            getShopPalletSummalyInfo(isSortValueUp, sortField){
                this.loading = true;
                let params = {
                        groupId: this.belongGroupValue || -1,
                        goodsId: this.searchModel.goodsId || -1,
                        ename: this.searchModel.eName || '',
                        status: this.searchModelStatus,
                        sortValue: isSortValueUp ? 'asc' : 'desc', // 默认按照商品有货率降序排列
                        sortBy: !sortField ? -1 : sortField,
                    },
                    page = {
                        pageNum: this.gridVal.footer.pageNum || 1,
                        pageSize: this.gridVal.footer.pageSize || 25,
                        totalRecord: 0,
                        totalPage: 0,
                    };
                return getShopPalletSummalyInfo(page, params).then((res) => {
                    console.log('[货道管理]获取货道店铺汇总信息：', res);
                    this.loading = false;
                    if (res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.gridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                })
            },
            // 获取店组列表
            getGroupList() {
                let keyValue = '',
                    status = -1;
                return getGroupList({keyValue, status}).then((res) => {
                    let data = res.result.sort(sortBy('storeNum', false))
                    this.searchModel.belongGroup.list = data.map(item => {
                        return {value: item.groupId, label: item.groupName};
                    });
                    // [fix bug] 13032
//                    this.searchModel.belongGroup.list.unshift({
//                        value: -1,
//                        label: '请选择'
//                    })
                    console.log('[货道管理-列表界面-查询字段]获取获取店组列表: ', this.searchModel.belongGroup.list);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 根据查询条件过滤符合条件的商品
            search() {
                this.getShopPalletSummalyInfo();
            },
            // 重置查询条件
            reset() {
                this.searchModel.eName = '';
                this.belongGroupValue = '';
                this.searchModel.goodsId = -1;
                this.searchModelStatus = 1;
                this.$refs['goodsAuto'].clearItem && this.$refs['goodsAuto'].clearItem(0);
                this.search();
            },
            // 根据商品有货率手动排序
            sortByInSaleRate(){
                this.isSortValueUp = !this.isSortValueUp;
                this.getShopPalletSummalyInfo(this.isSortValueUp, 2);
            },
            // 商品名称自动补全搜索
            goodsAutoQuery(key) {
                getGoodsTip(key).then(res => {
                    if (res.retCode === 'SUCCESS') {
                        this.goodsAutoModel.goodsList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 商品名称自动补全选中
            handleGoodsAutoSelect(sel) {
                this.searchModel.goodsId = sel.goodsid;
            },
            // 处理表格数据选择
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 处理表格数据分页大小
            handleSizeChange(val) {
                this.gridVal.footer.pageSize = val;
                this.search();
            },
            // 处理表格数据当期页
            handleCurrentChange(val) {
                this.gridVal.footer.pageNum = val;
                this.search();
            }
        },
        mounted() {
            // 只渲染一次，获取店组列表
            this.getGroupList().then(() => {
                this.searchModel.belongGroup.options = this.searchModel.belongGroup.list
            });
        },
        activated: function () {
            this.reset();
            this.search();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .pallet {
        .sl-search-panel {

        }
        .sl-select__wrapper {
            .sl-select__prepend {
                min-width: 73px;
            }
        }
    }
</style>