<template>
    <div class="sl-page-container flex-col report">
        <div class="slic-head-panel">
            <levelbar :levelList="levelList">
                <span slot="tip-content" class="icon-help-wrap pst-rl">
                    <icon-svg icon-class="wenhao-fill"></icon-svg>
                    <div class="icon-help-alert animated zoomIn">
                        <div class="icon-help-alert-til">
                            <span class="left">【{{levelList.join('-')}}】</span>
                        </div>
                        <div class="icon-help-alert-tcon">
                            <p>查看商品汇总</p>
                        </div>
                    </div>
                </span>
            </levelbar>
            <div style="float: right;">
                <span class="sl-content-handle-left">
                    <el-button-group>
                        <el-button type="primary" class="slic-btn-theme3" size="small" @click="goToShopSummary">按店铺汇总</el-button>
                        <excel-import-export v-if="myModulePower.export" ref="expImp" :fileName="'商品汇总'" :header="gridCol" @getResultArr="importData" @goToExp="doExport" :exportData="expData" :isImport="false"></excel-import-export>
                    </el-button-group>
                </span>
            </div>
            <div class="sl-search-panel">
                <div class="slic-input-group sl-search-item" style="width: 300px;">
                    <sl-cascader-area prepend="所在区域" :area-val.sync="queryParam.areaid">
                    </sl-cascader-area>
                </div>
                <div class="slic-input-group sl-search-item mr" style="width: 250px;">
                    <el-input icon="search" placeholder="请输入商品名称" size="small" v-model="queryParam.goodsName" :icon="queryParam.goodsName ? 'circle-close' : ''" :on-icon-click="()=>queryParam.goodsName=''">
                        <template slot="prepend">商品</template>
                    </el-input>
                </div>
                <div class="slic-input-group slic-input-group-date sl-search-item mr" style="width: 300px;">
                    <sl-date-picker prepend="销售日期" type="daterange" align="right" size="small" :dataType="8" :dataRange="['month',3]" placeholder="选择日期范围" :range-value.sync="queryParam.mydate">
                    </sl-date-picker>
                </div>
                <div class="slic-btn-group">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()" :disabled="loading">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()" :disabled="loading">重置</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>

        <div class="slic-content" v-loading="loading">
            <div class="slic-content-info">
                <div class="sl-content-handle" >
                    <span class="sl-content-handle-right ">
                        <div class="animated fadeIn sl-table-header sl-amount-panel">
                            <div class="sl-amount-panel-item"> 总计：<label class="c-red">{{countMode.goodsCountT}} </label> 种商品</div>
                            <div class="sl-amount-panel-item"> 销售总金额：<label class="c-red">{{countMode.saleMoneyT}}</label> </div>
                            <div class="sl-amount-panel-item"> 总客单数：<label class="c-red">{{countMode.sheetCountT}}</label> </div>
                            <div class="sl-amount-panel-item"> 客单均价：<label class="c-red">{{countMode.sheetCountT === 0 ? 0 :(countMode.saleMoneyT/countMode.sheetCountT).toFixed(2)}}</label></div>
                        </div>
                    </span>
                </div>

                <div class="sl-grid-container " >
                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg" @rowSelected="doSelected" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
                        <template slot="operate" scope="prop">
                            <span slot="tip-content" class="icon-help-wrap pst-rl" title="商品店铺销售" @click="goToGoodshopSummary(prop.scope.row)">
                                <icon-svg icon-class="goods_store_sales"></icon-svg>
                            </span>
                        </template>
                    </sl-grid>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import slCascaderArea from '@/components/sl-cascader-area/sl-cascader-area.vue';
import ExcelImportExport from '@/components/excel-import-export.vue';
import Levelbar from '@/views/layout/Levelbar.vue';
import SlGrid from '@/components/sl-grid.vue';
import { getGoodsummaryList } from '@/api/operations/report/report';
import utils from '../utils';
import RouterMixins from '@/mixins/router';
import ViewPage from '@/mixins/viewPage';


export default {
    name: 'goodList',
    components: {
        Levelbar, SlGrid, ExcelImportExport, slCascaderArea
    },
    mixins: [RouterMixins, ViewPage],
    data() {
        return {
            levelList: ['运营应用', '运营报表', '商品汇总'],
            // 查询对象
            queryParam: {
                shopName: '',
                areaid: '',
                goodsName: '',
                mydate: '',
            },
            countMode: {
                goodsCountT: '0',
                saleMoneyT: 0,
                sheetCountT: '0'
            },
            //表格
            gridVal: { rows: [], footer: {} },
            gridCol: [],
            gridCfg: {
                selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                frozen: true
            },
            //导出
            showExp: false,
            expData: [],
            selectedGridData: [],
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            // 获取组织机构列表
            this.gridCol = [
                { field: 'goodStr', name: '商品', minWidth:'200', fixed: true, align: 'left'},
                { field: 'barcode', name: '条码', minWidth: '120' },
                { field: 'saleMoney', name: '销售金额', minWidth: '100' , align: 'right'},
                { field: 'sheetCount', name: '客单数', minWidth: '100'  , align: 'right'},
                { field: 'sheetPrice', name: '客单价', minWidth: '100'  , align: 'right'},
                { field: 'specStr', name: '销售规格', minWidth: '100' },
                { field: 'brandName', name: '品牌', minWidth: '100' },
                { field: 'statusStr', name: '状态', minWidth: '60' },
                { field: 'operate', name: '操作', width: '100', fixed: 'right', template: 'operate', isSort: false, align: 'left' }
            ];
            this.doSearch();
        })
    },
    methods: {
        getGoodsummaryList(params) {
            this.loading = true;
            getGoodsummaryList(params).then((res) => {
                this.loading = false;
                if (res.retCode === 'SUCCESS') {
                    this.gridVal.rows = res.result;
                    this.gridVal.rows.map((row) => {
                        row.goodStr = `【${row.myGoodsId}】 ${row.goodsName}`;
                        row.specStr = row.spec + ' ' + row.spec2;
                        row.statusStr = utils.filter.status(row.status);
                    });
                    this.gridVal.footer = {
                        pageNum: res.pageNum,
                        pageSize: res.pageSize,
                        totalRecord: res.totalRecord
                    }
                    this.countMode = {
                        goodsCountT: res.goodsCountT,
                        saleMoneyT: res.saleMoneyT,
                        sheetCountT: res.sheetCountT,
                    }
                } else {
                    this.$message(res.retMsg);
                }

            }).catch((err) => {
                this.loading = false;
            })
        },
        goToShopSummary() {
            this.$emit('switchTag', 'shopList');
        },
        goToGoodshopSummary(item) {
            let param = {
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                barcode:item.barcode,
                myGoodsId:item.myGoodsId,
                areaid: this.queryParam.areaid,
                mydate: this.queryParam.mydate,
            }
            this.$router.push({ path: '/operations/reportGoodShop', query: param });
        },
        // 查询
        doSearch() {
            setTimeout(()=> {
                let params = {
                    eid: this.userInfo.loginEid,
                    shopName: this.queryParam.shopName,
                    areaid: this.queryParam.areaid,
                    goodsName: this.queryParam.goodsName,
                    bDate: this.queryParam.mydate.split(' - ')[0],
                    eDate: this.queryParam.mydate.split(' - ')[1],
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                this.getGoodsummaryList(params);
            }, 100);
        },
        // 重置
        doReset() {
            this.queryParam = {
                shopName: '',
                areaid: '',
                goodsName: '',
                mydate: '',
            };
            this.gridVal.footer.pageNum = 1;
            this.doSearch();
        },
        // 表格选中
        doSelected(data) {
            this.selectedGridData = data;
        },
        // 每页显示条数
        handleSizeChange(size) {
            this.gridVal.footer.pageSize = size;
            this.doSearch();
        },
        // 页码改变
        handleCurrentChange(page) {
            this.gridVal.footer.pageNum = page;
            this.doSearch();
        },
        // 导入
        importData(data) {
            this.gridVal.rows = this.gridVal.rows.concat(data)
        },
        // 导出
        doExport(str) {
            if (str === 'current') {
                this.expData = this.gridVal.rows;
                this.$refs.expImp.doExport();
                this.showExp = false;
            } else if (str === 'select') {
                this.expData = this.selectedGridData;
                this.$refs.expImp.doExport();
                this.showExp = false;
            } else if (str === 'all') {
                let params = {
                    eid: this.userInfo.loginEid,
                    bDate: this.queryParam.mydate.split(' - ')[0],
                    eDate: this.queryParam.mydate.split(' - ')[1],
                    pageNum: 1,
                    pageSize: this.gridVal.footer.totalRecord,
                    totalRecord: 0,
                    totalPage: 0
                }
                getGoodsummaryList(params).then((res) => {
                    if (res.retCode === 'SUCCESS') {
                        this.expData = res.result;
                        this.expData.map((row) => {
                            row.goodStr = `【${row.myGoodsId}】 ${row.goodsName}`;
                            row.specStr = row.spec + ' ' + row.spec2;
                            row.statusStr = utils.filter.status(row.status);
                        });
                        this.$refs.expImp.doExport();
                        this.showExp = false;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.loading = false;
                })

            }
        },
    }

}


</script>

<style rel="stylesheet/css" lang="scss">
.report {
    .sl-grid-container {
        flex: 1;
        height: calc(100% - 40px);
    }
    .slic-content-info {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 0 10px !important;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 5px;
        .sl-content-handle {
            margin-bottom: 0;
        }
    }
}
</style>