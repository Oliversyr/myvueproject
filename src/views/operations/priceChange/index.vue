<template>
    <div class="sl-page-container flex-col priceChangeIndex">
        <div class="slic-head-panel">
            <levelbar>
                <span slot="tip-content" class="icon-help-wrap pst-rl">
                    <icon-svg icon-class="wenhao-fill"></icon-svg>
                    <div class="icon-help-alert animated zoomIn">
                        <div class="icon-help-alert-til">
                            <span class="left">【运营应用-售价调整管理】</span>
                        </div>
                        <div class="icon-help-alert-tcon">
                            <p>您可以查看到所有的店组并对其进行管理。</p>
                            <p>1. 对商品进行调价，支持一次调整多个店铺的售价；</p>
                            <p>2. 售价支持立即生效或按时生效；</p>
                            <p>3. 支持永久调价和到期恢复的临时（促销）调价；</p>
                            <p>4. 调价单需要审核后生效。</p>
                        </div>
                    </div>
                </span>
            </levelbar>
            <div style="float: right;">
                <el-button type="primary" size="small" @click="addPriceChange($event)" :disabled="load2" v-if="myModulePower.add">新增调价单</el-button>
                <!--<el-button-group>-->
                    <!--<el-button type="primary" size="small" @click="addPriceChange($event)" :disabled="load2" v-if="myModulePower.add">新增调价单</el-button>-->
                    <!--<el-button type="primary" size="small" @click="checkPriceChanges($event)" :disabled="load2" v-if="myModulePower.check">审核调价单</el-button>-->
                <!--</el-button-group>-->
            </div>
            <div class="sl-search-panel">

                <div class="slic-input-group sl-search-item mr" style="width: 230px;">
                    <!--<sl-input :input-val.sync="queryKey.eName" prepend="调价机构" placeholder="请输入调价机构名称"></sl-input>-->
                    <sl-tree-select-org @selectedNode="selectOrgTree" prepend="调价机构" placeholder="请选择调价机构" :resetCheck="queryKey.resetOrg" :isShowThird="true">
                    </sl-tree-select-org>
                </div>

                <div class="slic-input-group sl-search-item mr" style="width: 335px;">
                    <sl-autocomplete :autoParams="autoParams" :dataList="goodsList" slWidth="750" colWidths="20,30,50" displayProp="goodsname" @querykey="autoQuery" @doAutoSelected="handleAutoSelect" prepend="商品名称" placeholder="请输入商品名称" selectedMode="SINGLE">
                    </sl-autocomplete>
                </div>

                <div class="slic-input-group sl-search-item mr" style="width: 280px;">
                    <sl-date-picker prepend="调价生效日期" type="daterange" :dataType="7" align="right" size="small" placeholder="选择日期范围" :range-value.sync="queryKey.mydate">
                    </sl-date-picker>
                </div>

                <div class="slic-input-group sl-search-item mr" style="width: 180px;">
                    <sl-select prepend="状态">
                        <el-select v-model="queryKey.status" placeholder="请选择" :default-first-option="true" filterable slot="ELSelect" size="small">
                            <el-option :key="-1" label="全部" :value="-1"></el-option>
                            <el-option :key="0" label="编辑中" :value="0"></el-option>
                            <el-option :key="1" label="编辑完成" :value="1"></el-option>
                            <el-option :key="2" label="已审核" :value="2"></el-option>
                            <el-option :key="3" label="已否决" :value="3"></el-option>
                        </el-select>
                    </sl-select>
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

                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg" @rowSelected="doSelected" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
                        <template slot="operate" scope="prop">
                            <el-button @click="submitSinglePriceChange(prop.scope.row)" type="text" size="small" v-if="prop.scope.row.status === 0 && myModulePower.edit" >编辑完成</el-button>
                            <el-button @click="checkSinglePriceChange(prop.scope.row)" type="text" size="small" v-if="prop.scope.row.status === 1 && myModulePower.check">审核</el-button>
                            <el-button type="text" size="small" @click="deleteSinglePriceChange(prop.scope.row)" v-if="prop.scope.row.status === 0 && myModulePower.delete">删除</el-button>
                        </template>

                        <template slot="sheetdetail" scope="prop">
                            <span class="link" @click="toChangeDetail(prop.scope.row)">{{prop.scope.row.sheetid}}</span>
                        </template>

                        <template slot="otime" scope="prop">

                            <span v-if="prop.scope.row.eDateStr">{{prop.scope.row.bDateStr}} ~ {{prop.scope.row.eDateStr}}</span>
                            <span v-else>{{prop.scope.row.bDateStr}}</span>
                        </template>

                        <template slot="status" scope="prop">
                            <span v-if="prop.scope.row.status === 0">编辑中</span>
                            <span v-if="prop.scope.row.status === 1">编辑完成</span>
                            <span v-if="prop.scope.row.status === 2">审核通过</span>
                            <span v-if="prop.scope.row.status === 3">已否决</span>
                        </template>

                        <template slot="adjtype" scope="prop">
                            <span>{{prop.scope.row.adjtype === 0 ? '永久调价' : '促销调价'}}</span>
                        </template>

                        <template slot="title" scope="prop">
                            <span>{{prop.scope.row.orgnum}}个机构，{{prop.scope.row.goodsnum}}个商品</span>
                        </template>
                    </sl-grid>
                </div>
            </div>
        </div>

        <el-dialog title="审核" :visible.sync="showCheck">
            <p style="padding: 20px;">
                您正在审核售价调整单【{{goodsChangeCode}}】，您可以审核也可以否决，审核后商品信息将会变更！
            </p>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="operatePriceChange('approve')" size="small">审核通过</el-button>
                <el-button type="primary" @click="operatePriceChange('veto')" size="small">否决</el-button>
                <el-button @click="showCheck = false" class="dialog-cancel" size="small">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import Levelbar from '@/views/layout/Levelbar.vue';
import SlGrid from '@/components/sl-grid.vue';
import SlInput from '@/components/sl-input.vue';
import SlTreeSelectOrg from '@/components/sl-tree-select-org.vue';
import SlAutocomplete from '@/components/sl-autocomplete.vue';
import { getGoodsTip } from '@/api/operations/goods';
import { mapGetters } from 'vuex';
import { getPriceChangeList, submitPriceChange, checkPriceChange, deletePriceChange, checkBatchFun } from '@/api/operations/priceChange';

export default {
    components: { Levelbar, SlGrid, SlAutocomplete, SlInput, SlTreeSelectOrg },
    name: 'goodsChangeMan',
    data() {
        return {
            load2: false,
            gridCol: [],
            gridVal: { rows: [], footer: {} },
            gridCfg: {
                selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                frozen: true
            },
            selectedGridData: [],
            queryKey: {
                eName: '',
                goodsId: -1,
                mydate: '',
                status: -1,
                resetOrg: false
            },
            showCheck: false,
            goodsChangeCode: '',
            goodsList: [],
            autoParams: {
                mygoodsid: '商品内码',
                goodsname: '商品名称',
                catLName: '所属品类'
            }
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.gridCol = [
                { field: 'sheetid', name: '调价单号', minWidth: '90', template: 'sheetdetail', fixed: 'left' },
                { field: 'fullname', name: '申请机构', minWidth: '120' },
                { field: 'title', name: '详情摘要', minWidth: '130', template: 'title', align: 'left' },
                { field: 'adjtype', name: '类型', minWidth: '80', template: 'adjtype' },
                { field: 'otime', name: '调价时段', minWidth: '250', template: 'otime' },
                { field: 'editdateStr', name: '申请时间', minWidth: '140' },
                { field: 'editor', name: '申请人', minWidth: '80' },
                { field: 'checkdateStr', name: '审核时间', minWidth: '140' },
                { field: 'checker', name: '审核人', minWidth: '80' },
                { field: 'notes', name: '备注', minWidth: "180", align: 'left' },
                { field: 'status', name: '状态', minWidth: '80', template: 'status' },
                { field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right', align: 'left' },
            ];
        })
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'user_power'
        ]),
        myModulePower: function() {
            const _this = this;
            let modulePower = {};
            this.user_power.forEach((item, i) => {
                if (item.moduleid === this.$route.meta.moduleid) {
                    modulePower = item.powerlist;
                }
            })
            return modulePower;
        }
    },
    activated: function() {
        this.doSearch();
        //            dataType
    },
    methods: {
        // 获取调价单
        getPriceChange() {
            this.load2 = true;
            console.log(this.queryKey)
            let opt = {
                params: {
                    eName: this.queryKey.eName,
                    goodsId: this.queryKey.goodsId || -1,
                    bDate: this.queryKey.mydate.split(' - ')[0],
                    eDate: this.queryKey.mydate.split(' - ')[1],
                    status: this.queryKey.status
                },
                pageNum: this.gridVal.footer.pageNum || 1,
                pageSize: this.gridVal.footer.pageSize || 25,
                totalRecord: 0,
                totalPage: 0
            }
            getPriceChangeList(opt).then(res => {
                this.load2 = false;
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
            }).catch(err => {
                this.load2 = false;
            })
        },
        // 自动补全搜索
        autoQuery(key) {
            console.log(key, this.autoParams)
            getGoodsTip(key).then(res => {
                if (res.retCode === 'SUCCESS') {
                    this.goodsList = res.result;
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
        },
        // 调价机构弹窗-上级机构选择
        selectOrgTree(sel) {
            this.queryKey.eName = sel.ename;
            this.queryKey.resetOrg = false;
        },
        // 查询
        doSearch() {
            setTimeout(() => {
                this.gridVal.footer.pageNum = 1;
                this.getPriceChange();
            }, 100);
        },
        // 重置
        doReset() {
            this.gridVal.footer.pageNum = 1;
            this.queryKey.eName = '';
            this.queryKey.goodsId = -1;
            this.queryKey.mydate = '';
            this.queryKey.status = -1;
            this.queryKey.resetOrg = true;
            setTimeout(() => {
                this.getPriceChange();
            }, 200)
            
        },
        // 新增调价单
        addPriceChange() {
            sessionStorage.setItem('editPriceChange', JSON.stringify({}));
            this.$router.push({ path: '/operations/priceChangeEdit', query: { opType: 'add', title: '新增调价单' } })
        },
        // 批量审核
        checkPriceChanges() {
            let checkArr = [];
            this.selectedGridData.forEach((item, i) => {
                //编辑完成的才能审核
                if (item.status === 1) {
                    checkArr.push(item.sheetid);
                }
            });
            if (checkArr.length === 0) {
                this.$message({
                    message: '未选择可审核的调价单！',
                    duration: 1000
                });
            } else {
                this.showCheck = true;
                this.goodsChangeCode = checkArr.join(',');
            }
        },

        // 表格中的审核调价单
        checkSinglePriceChange(obj) {
            this.showCheck = true;
            this.goodsChangeCode = obj.sheetid;
        },
        // 审核弹窗选择
        operatePriceChange(str) {
            this.load2 = true;
            let opType = 0;
            if (str === 'approve') {
                opType = 2;
            } else if (str === 'veto') {
                opType = 3;
            }
            checkBatchFun(this.goodsChangeCode, opType).then(res => {
                if (res.retCode === 'SUCCESS') {
                    this.doSearch();
                }
                this.$message(res.retMsg);
                this.load2 = false;
                this.showCheck = false;
            }).catch(err => {
                this.load2 = false;
            })
        },
        // 表格中的提交
        submitSinglePriceChange(opt) {
            this.load2 = true;
            submitPriceChange(opt.sheetid).then(res => {
                this.load2 = false;
                if (res.retCode === 'SUCCESS') {
                    this.$message('提交成功！');
                    opt.status = 1;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load2 = false;
                //                    this.$message(res.retMsg);
            })
        },
        // 表格中的删除
        deleteSinglePriceChange(opt) {
            this.$confirm('确认删除该调价单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.load2 = true;
                deletePriceChange(opt.sheetid).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.$message('删除成功！');
                        this.doSearch();
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
                    //                        this.$message(res.retMsg);
                })
            }).catch()

        },
        doSelected(data) {
            console.log('data==', data);
            this.selectedGridData = data;
        },
        handleSizeChange(size) {
            console.log('size==', size);
            this.gridVal.footer.pageSize = size;
            this.getPriceChange();
        },
        handleCurrentChange(page) {
            console.log('page==', page);
            this.gridVal.footer.pageNum = page;
            this.getPriceChange();
        },
        // 跳转到调价单详情
        toChangeDetail(obj) {
            console.log('obj==', obj)
            sessionStorage.setItem('editPriceChange', JSON.stringify(obj));
            this.$router.push({ path: '/operations/priceChangeDetail', query: { sheetId: obj.sheetid } })
        },
        iconClose(str) {
            this.queryKey.eName = '';
        }

    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.priceChangeIndex {
    .sl-content-row-item-textarea {
        width: 80%;
        /*height: 200px;*/
        vertical-align: top;
    }

    .sl-search-showPart {
        text-align: justify;
        padding-top: 15px;
    }

    .sl-search-showPart::after {
        content: '';
        width: 100%;
        height: 0;
        display: inline-block;
    }

    .sl-search-showPart-item {
        box-sizing: border-box;
        /*width: 20%;*/
        min-height: 28px;
        height: auto;
        padding: 10px;
        background-color: #fff;
        border-radius: 4px;
        display: inline-block;
    }

    .slic-content-info {
        width: calc(100% - 286px);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 10px 10px 0 10px !important;
        background-color: #fff;
        border-radius: 5px;
    }

    .sl-content-row-item-input {
        display: inline-block;
    }

    .el-dialog--small {
        width: 400px;
    }

    .link {
        color: #28e;
        text-decoration: none;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
}
</style>


