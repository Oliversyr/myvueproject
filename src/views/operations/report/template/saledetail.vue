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
                            <p>查看店铺商品流水。</p>
                        </div>
                    </div>
                </span>
            </levelbar>
            <el-button size="small" @click="goToBack($route.name)" class="sl-back-btn">
                <icon-svg icon-class="fanhui"></icon-svg> 返回
            </el-button>

            <div style="float: right;">
                <span class="sl-content-handle-left">
                    <el-button-group>
                        <excel-import-export v-if="myModulePower.export" ref="expImp" :fileName="'店铺商品流水'" :header="gridCol" @getResultArr="importData" @goToExp="doExport" :exportData="expData" :isImport="false"></excel-import-export>
                    </el-button-group>
                </span>
            </div>

            <div class="sl-search-panel"  >
                <div class="slic-input-group sl-search-item mr" style="width: 250px;" v-if="!superiorParam.eid">
                    <el-input icon="search" placeholder="请输入店铺名称" size="small" v-model="queryParam.shopName" :icon="queryParam.shopName ? 'circle-close' : ''" :on-icon-click="()=>queryParam.shopName=''">
                        <template slot="prepend">店铺名称</template>
                    </el-input>
                </div>  
                <div class="slic-input-group sl-search-item" style="width: 300px;">
                    <sl-cascader-area prepend="所在区域" :area-val.sync="queryParam.areaid">
                    </sl-cascader-area>
                </div>
                <div class="slic-input-group sl-search-item mr" style="width: 250px;" v-if="!superiorParam.goodsId">
                    <el-input icon="search" placeholder="请输入商品名称" size="small" v-model="queryParam.goodsName" :icon="queryParam.goodsName ? 'circle-close' : ''" :on-icon-click="()=>queryParam.goodsName=''">
                        <template slot="prepend">商品</template>
                    </el-input>
                </div> 
                <div class="slic-input-group sl-search-item mr" style="width: 250px;" v-if="!superiorParam.sheetId">
                    <el-input icon="search" placeholder="请输入销售单号" size="small"  v-model="queryParam.sheetId" :icon="queryParam.sheetId? 'circle-close' : ''" :on-icon-click="()=>queryParam.sheetId=''">
                        <template slot="prepend">销售单号</template>
                    </el-input>
                </div>
                <div class="slic-input-group slic-input-group-date sl-search-item mr" style="width: 300px;">
                    <sl-date-picker prepend="销售日期" type="daterange" align="right" size="small" :dataType="8" :dataRange="['month',3]" placeholder="选择日期范围" :range-value.sync="queryParam.mydate">
                    </sl-date-picker>
                </div>
                <div class="slic-btn-group ">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()" :disabled="loading">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()" :disabled="loading">重置</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>

        <div class="slic-content" v-loading="loading">
            <div class="slic-content-info">
                <div class="sl-content-handle" style="text-align: left;height: 30px;">
                    <span class="sl-content-handle-right ">
                        <div class=" animated fadeIn sl-table-header sl-amount-panel">
                            <div class="sl-amount-panel-item" v-if="superiorParam.eid">【{{superiorParam.eid}}】 {{superiorParam.ename}}</div>
                            <div class="sl-amount-panel-item" v-if="superiorParam.goodsId">【{{superiorParam.goodsId}}】 {{superiorParam.goodsName}}（条码：{{superiorParam.barcode}} / 内码：{{superiorParam.myGoodsId}}）</div>
                            <div class="sl-amount-panel-item" v-if="superiorParam.sheetId">【销售单号：{{superiorParam.sheetId}}】</div>
                            <div class="sl-amount-panel-item"> 总计：</div>
                            <div class="sl-amount-panel-item"><label class="c-red">销售总金额：{{countMode.saleMoneyT}}</label></div>
                        </div>
                    </span>
                </div>

                <div class="sl-grid-container " >
                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg" @rowSelected="doSelected" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
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
import { getShopSaledetailList } from '@/api/operations/report/report';
import utils from '../utils';
import RouterMixins from '@/mixins/router';
import ViewPage from '@/mixins/viewPage';


export default {
    name: 'saledetail',
    components: {
        Levelbar, SlGrid, ExcelImportExport, slCascaderArea
    },
    mixins: [RouterMixins, ViewPage],
    data() {
        return {
            levelList: ['运营应用', '运营报表', '店铺商品流水'],
            loading: false,
            // 查询对象
            queryParam: {
                shopName: this.$route.query.ename || '',
                areaid: this.$route.query.areaid || '',
                goodsName: this.$route.query.goodsName ||'',
                mydate: this.$route.query.mydate || '',
            },
            superiorParam: this.$route.query,
            countMode: {
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
                { field: 'eidStr', name: '店铺', minWidth:'200', fixed: true, align: 'left', isShow:!this.superiorParam.eid },
                { field: 'goodStr', name: '商品', minWidth: '200', align: 'left', isShow:!this.superiorParam.goodsId },
                { field: 'sheetId', name: '销售单号', minWidth: '100', isShow:!this.superiorParam.sheetId },
                { field: 'barcode', name: '条码', minWidth: '120', isShow:!this.superiorParam.goodsId },
                { field: 'myGoodsId', name: '商品内码', minWidth: '100', isShow:!this.superiorParam.goodsId },
                { field: 'price', name: '售价', minWidth: '100'  , align: 'right'},
                { field: 'saleQty', name: '销售数量', minWidth: '100'  , align: 'right'},
                { field: 'saleMoney', name: '销售金额', minWidth: '100'  , align: 'right'},
                { field: 'specStr', name: '规格', minWidth: '100' },
                { field: 'saleDate', name: '销售时间', minWidth: '140' },
            ];
            this.doSearch();
        })
    },
    methods: {
        getShopSaledetailList(params) {
            this.loading = true;
            getShopSaledetailList(params).then((res) => {
                this.loading = false;
                if (res.retCode === 'SUCCESS') {
                    this.gridVal.rows = res.result;
                    this.gridVal.rows.map((row)=>{
                        row.eidStr = `【${row.eid}】 ${row.ename}`;
                        row.goodStr = `【${row.myGoodsId}】 ${row.goodsName}`;
                        row.specStr = row.spec + ' ' + row.spec2;
                    });
                    this.gridVal.footer = {
                        pageNum: res.pageNum,
                        pageSize: res.pageSize,
                        totalRecord: res.totalRecord
                    }
                    this.countMode = {
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
        // 查询
        doSearch() {
            setTimeout(()=> {
                let params = {
                    eid: this.userInfo.loginEid,
                    shopEid: this.$route.query.eid,
                    goodsId: this.$route.query.goodsId,
                    sheetId: this.$route.query.sheetId || this.queryParam.sheetId,
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
                this.getShopSaledetailList(params);
            }, 100);
        },
        // 重置
        doReset() {
            this.queryParam.areaid = '';
            this.queryParam.mydate = '';
            if (!this.superiorParam.eid) {
                this.queryParam.shopName = '';
            }
            if (!this.superiorParam.goodsId) {
                this.queryParam.goodsName = '';
            }
            if (!this.superiorParam.sheetId) {
                this.queryParam.sheetId = '';
            }
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
                    shopEid: this.$route.query.eid,
                    goodsId: this.$route.query.goodsId,
                    sheetId: this.$route.query.sheetId,
                    bDate: this.queryParam.mydate.split(' - ')[0],
                    eDate: this.queryParam.mydate.split(' - ')[1],
                    pageNum: 1,
                    pageSize: this.gridVal.footer.totalRecord,
                    totalRecord: 0,
                    totalPage: 0
                }
                getShopSaledetailList(params).then((res) => {
                    if (res.retCode === 'SUCCESS') {
                        this.expData = res.result;
                        this.expData.map((row)=>{
                            row.eidStr = `【${row.eid}】 ${row.ename}`;
                            row.goodStr = `【${row.myGoodsId}】 ${row.goodsName}`;
                            row.specStr = row.spec + ' ' + row.spec2;
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