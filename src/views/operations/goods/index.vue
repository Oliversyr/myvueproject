<template>
    <div class="sl-page-container flex-col goods-index">
        <div class="slic-head-panel">
            <div>
                <levelbar>
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【运营应用-商品管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 商品信息，包括商品的列表，详情，用于查看商品；</p>
                                <p>2. 以单据的形式提交商品的新建、修改、禁用等维护需求；</p>
                            </div>
                        </div>
                    </span>
                </levelbar>
                <div style="float: right">
                    <!--<span style="color: #28e;margin-right: 10px;"> <strong style="font-size: 16px;"> {{needCheck}} </strong> 个商品变更申请待审批</span>-->
                    <el-badge :value="needCheck" :max="99" :title="'您还有' + needCheck + '个商品变更申请待审批'" style="margin-right: 10px;" v-if="myChangeModulePower.check">
                        <el-button type="primary" size="small" @click="goToCheck()" style="margin-right: 5px;" :disabled="load2">去审批
                        </el-button>
                    </el-badge>

                    <el-button-group>
                        <el-button type="primary" size="small" @click="addGoods()" :disabled="load2" v-if="myChangeModulePower.add">新增商品</el-button>
                        <excel-import-export ref="expImp" fileName="商品列表" :header="gridCol" @getResultArr="importData" :exportData="expData" @goToExp="doExport" :isImport="false" v-if="myModulePower.export"></excel-import-export>
                    </el-button-group>
                        <!--<el-button-group>
                        <el-button type="primary" size="small" @click="addGoods()" :disabled="load2">新增商品</el-button>
                        &lt;!&ndash;<el-button type="primary" size="small" @click="forbidGoods()" :disabled="load2">禁用</el-button>&ndash;&gt;
                    </el-button-group>-->
                </div>
            </div>

            <div class="sl-search-panel">

                <div class="slic-input-group sl-search-item mr" style="width: 335px;">
                    <sl-autocomplete
                            :autoParams="autoParams"
                            :dataList="goodsList"
                            slWidth="750"
                            colWidths="20,30,30,20"
                            displayProp="goodsname"
                            @querykey="autoQuery"
                            @doAutoSelected="handleAutoSelect"
                            prepend="商品名称"
                            :clearInput="queryKey.clearInput"
                            placeholder="请输入商品名称、内码或条码"
                            selectedMode="SINGLE">
                    </sl-autocomplete>
                </div>

                <div class="slic-input-group sl-search-item mr" style="width: 250px;">
                    <sl-select :prepend="'品牌'">
                        <el-select v-model="queryKey.brandId" placeholder="请选择品牌" size="small" slot="ELSelect" filterable>
                            <el-option :key="-1" :label="'全部'" :value="-1"></el-option>
                            <el-option v-for="brand in brandList" :key="brand.brandId" :label="brand.brandName" :value="brand.brandId"></el-option>
                        </el-select>
                    </sl-select>
                </div>

                <div class="slic-input-group sl-search-item mr" style="width: 280px;">
                    <sl-tree-select-cat :showPrepend="true" @selectedNode="selectCatTree"
                                        :slTreeProps="catProps" :isShowThird="true"
                                        :resetCheck="resetCat">
                        <template slot="prepend">品类</template>
                    </sl-tree-select-cat>
                </div>

                <div class="slic-btn-group">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()" :disabled="load2">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()" :disabled="load2">重置</el-button>
                    </el-button-group>
                </div>

            </div>
        </div>

        <div class="slic-content" v-loading="load2">
            <div class="slic-content-info">
                <div style="flex: 1;height: 100%;">
                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                             @rowSelected="doSelected" @pageSizeChange="handleSizeChange"
                             @currentPageChange="handleCurrentChange">
                        <template slot="code" scope="prop">
                            <span class="sl-link"
                                  @click.stop="changeToDetail(prop.scope.row)">{{prop.scope.row.mygoodsid}}</span>
                        </template>

                    </sl-grid>
                </div>
            </div>
        </div>

        <el-dialog title="导出" :visible.sync="showExp">
            <div style="text-align: center;">
                <el-button type="primary" @click="doExport('all')" size="small">导出全部</el-button>
                <el-button type="primary" @click="doExport('select')" size="small">导出已选项</el-button>
                <el-button type="primary" @click="doExport('current')" size="small">导出当前页</el-button>
                <el-button @click="showExp = false" class="dialog-cancel" size="small">取 消</el-button>
            </div>


        </el-dialog>

    </div>
</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue'
    import ExcelImportExport from '@/components/excel-import-export.vue';
    import SlTreeSelectCat from '@/components/sl-tree-select-cat.vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import {mapGetters} from 'vuex';
    import {getGoodsTip, getGoodsList, goodsImport, operateGoods, getGoodsDetail, queryNeedCheckGoodsChange} from '@/api/operations/goods';
    import {getBrandList} from '@/api/basic/brand';
    export default {
        name: 'goods',
        components: {
            Levelbar,
            SlGrid,
            ExcelImportExport,
            SlTreeSelectCat,
            SlAutocomplete
        },
        data () {
            return {
                load2: false,
                gridCol: [],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true
                },
                queryKey: {
                    goodsId: '',
                    brandId: '',
                    catId: ''
                },
                brandList: [],
                goodsList: [],
                autoParams: {
                    mygoodsid: '商品内码',
                    goodsname: '商品名称',
                    catLName: '所属品类',
                    barcode: '条码'
                },
                resetCat: false,
                catProps: {
                    label: 'catName',
                    children: 'lowerCatList',
                    key: 'catId'
                },
                needCheck: 0,
                showExp: false,
                expData: []
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.getBrand();
                this.getGoods();
                this.gridCol = [
                    {field: 'mygoodsid', name: '商品内码', width: '100', template: 'code', fixed: true},
                    {field: 'goodsname', name: '商品名称', width: '150',align:'left'},
                    {field: 'barcode', name: '条码', width: '150px'},
                    {field: 'spec', name: '销售规格', width: '100'},
//                    {field: 'uame', name: '包装单位', width: '100'},
                    {field: 'catLName', name: '所属品类', minWidth: '200'},
//                    {field: 'brandName', name: '品牌', width: '150'},
                    {field: 'costPrice', name: '默认进价', width: '100',align:'right'},
                    {field: 'bulkprice', name: '建议售价', width: '100',align:'right'},
                    {field: 'ostatus', name: '状态', width: '100', fixed: 'right'},
//                    {field: 'notes', name: '备注'}
                ]

            })
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'user_power'
            ]),
            myModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === this.$route.meta.moduleid) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            },
            myChangeModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === 42) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            }
        },
        activated: function () {
            queryNeedCheckGoodsChange().then(res => {
                if(res.retCode === 'SUCCESS') {
                    this.needCheck = res.result;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.$message(res.retMsg);
            })
        },
        methods: {
            // 获取商品列表
            getGoods() {
                this.load2 = true;
                let opt = {
                    params: this.queryKey,
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getGoodsList(opt).then(res => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        console.log()

                        this.gridVal.rows = res.result;
                        this.gridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }

                        this.gridVal.rows.forEach((item, i) => {
                            this.$set(item, 'ostatus', item.status === 1 ? '正常' : '禁用');
                        })

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
                    /*this.$message(res.retMsg);*/
                })
            },
            // 获取品牌列表
            getBrand() {
                const _this = this;
                let opt = {
                    brandName: '',
                    status: -1
                }
                getBrandList(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.brandList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });
            },
            // 自动补全搜索
            autoQuery(key) {
                console.log(key, this.autoParams)
                getGoodsTip(key).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.goodsList = res.result;
                        this.goodsList.forEach((item, i) => {
                            if(item.mygoodsid == null) {
                                item.mygoodsid = '';
                            }
                        })
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 自动补全选中
            handleAutoSelect(sel) {
                console.log(sel);
                this.queryKey.goodsId = sel.goodsid;
                this.queryKey.clearInput = false;
            },
            // 品类树选中
            selectCatTree(val) {
                console.log(val)
                this.queryKey.catId = val.catId;
                this.resetCat = false;
            },
            // 查询
            doSearch() {
                this.gridVal.footer.pageNum = 1;
                this.getGoods();
            },
            // 重置
            doReset() {
                this.gridVal.footer.pageNum = 1;
                this.queryKey = {
                    goodsId: '',
                    brandId: '',
                    catId: '',
                    clearInput: true
                };
                this.resetCat = true;
                this.getGoods();
            },
            // 去审批
            goToCheck() {
                this.$router.push({path: '/operations/goodsChange', query: {opType: 'check'}})
            },
            // 新增商品
            addGoods() {
                this.$router.push({path: '/operations/goodsChangeEdit', query: {from: 'goods', opType: 'add'}});
            },
            // 禁用商品
            forbidGoods() {
                this.selectedGridData.forEach((item, i) => {
                    if(item.status != 0) {
                        operateGoods(item.goodsid, 0).then(res => {
                            if(res.retCode === 'SUCCESS') {
                                this.$message('操作成功！');
                                item.status = 0;
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
//                            this.$message(res.retMsg);
                        })
                    }

                });

            },

            doSelected (data) {
                console.log('data==', data);
                this.selectedGridData = data;
            },
            handleSizeChange (size) {
                console.log('size==', size)
                this.gridVal.footer.pageSize = size;
                this.getGoods();
            },
            handleCurrentChange (page) {
                console.log('page==', page)
                this.gridVal.footer.pageNum = page;
                this.getGoods();
            },
            // 商品详情
            changeToDetail (obj) {
                this.$router.push({path: '/operations/goodsDetail', query: {goodsId: obj.goodsid}})
            },
            // 导入
            importData() {

            },
            // 导出
            doExport(str) {
                if(str === 'current') {
                    this.expData = this.gridVal.rows;
                    console.log(this.expData);
                    this.$refs.expImp.doExport();
                    this.showExp = false;

                } else if(str === 'select') {
                    this.expData = this.selectedGridData;
                    this.$refs.expImp.doExport();
                    this.showExp = false;

                } else if(str === 'all') {
                    let opt = {
                        params: '',
                        pageNum: 1,
                        pageSize: this.gridVal.footer.totalRecord,
                        totalRecord: 0,
                        totalPage: 0
                    }
                    getGoodsList(opt).then(res => {
                        if(res.retCode === 'SUCCESS') {
                            this.expData = res.result;
                            this.expData.forEach((item, i) => {
                                item.ostatus = item.status == 1 ? '正常' : '禁用';
                            });
                            this.$refs.expImp.doExport();
                            this.showExp = false;

                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        /*this.$message(res.retMsg);*/
                    })
                }
            }

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

    .goods-index {
        .slic-content-info {
            width: calc(100% - 286px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 10px;
            background-color: #fff;
            border-radius: 5px;
        }

        .sl-link {
            color: #28e;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }

        }

        .sl-select__wrapper {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }

        .el-input el-input--small {
            width: 100%;
        }
        .sl-autocom-input {
            margin-bottom: 10px;
        }

    }

</style>


