<template>
    <div class="sl-page-container flex-col goodsChangeIndex" v-loading="load1">
        <div class="slic-head-panel">
            <levelbar>
                <span slot="tip-content" class="icon-help-wrap pst-rl">
                    <icon-svg icon-class="wenhao-fill"></icon-svg>
                    <div class="icon-help-alert animated zoomIn">
                        <div class="icon-help-alert-til">
                            <span class="left">【运营应用-商品变更管理】</span>
                        </div>
                        <div class="icon-help-alert-tcon">
                            <p>1. 新建商品；</p>
                            <p>2. 修改商品属性；</p>
                            <p>3. 禁用/启用商品。</p>
                        </div>
                    </div>
                </span>
            </levelbar>
            <div style="float: right;">
                <el-button-group>
                    <el-button type="primary" size="small" @click="addNewGoodsChange($event)" :disabled="load2" v-if="myModulePower.add">新增</el-button>
                    <el-button type="primary" size="small" @click="checkGoodsChangeList($event)" :disabled="load2" v-if="myModulePower.check">审核</el-button>
                </el-button-group>
            </div>
            <div class="sl-search-panel">
                <div class="slic-input-group sl-search-item mr" style="width: 230px;">
                    <sl-input :input-val.sync="queryKey.creator" placeholder="请输入变更人名称" prepend="变更人"></sl-input>
                </div>
                <div class="slic-input-group sl-search-item mr" style="width: 335px;">
                    <sl-autocomplete :autoParams="autoParams"
                                     :dataList="goodsList"
                                     slWidth="750"
                                     colWidths="20,30,50"
                                     displayProp="goodsname"
                                     @querykey="autoQuery"
                                     @doAutoSelected="handleAutoSelect"
                                     :nomore="true"
                                     prepend="商品名称"
                                     :clearInput="queryKey.clearInput"
                                     placeholder="请输入商品名称、内码或条码"
                                     selectedMode="SINGLE">
                    </sl-autocomplete>
                </div>
                <div class="slic-input-group slic-input-group-date sl-search-item mr" style="width: 280px;">
                    <sl-date-picker prepend="申请日期" type="daterange" align="right" size="small" :dataType="6" placeholder="选择日期范围" :range-value.sync="queryKey.mydate">
                    </sl-date-picker>
                </div>
                <div class="slic-input-group sl-search-item mr" style="width: 190px;">
                    <sl-select prepend="状态">
                        <el-select v-model="queryKey.status" placeholder="请选择" :default-first-option="true" filterable slot="ELSelect" size="small">
                            <el-option label="全部" :value="-1" :key="-1"></el-option>
                            <el-option label="编辑中" :value="0" :key="0"></el-option>
                            <el-option label="编辑完成" :value="1" :key="1"></el-option>
                            <el-option label="已审核" :value="2" :key="2"></el-option>
                            <el-option label="已否决" :value="3" :key="3"></el-option>
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
                            <el-button @click="submitSingleGoodsChange(prop.scope.row)" type="text" size="small" v-if="prop.scope.row.status === 0 && myModulePower.edit">编辑完成</el-button>
                            <el-button @click="checkSingleGoodsChange(prop.scope.row)" type="text" size="small" v-if="prop.scope.row.status === 1 && myModulePower.check">审核</el-button>
                            <el-button type="text" size="small" @click="deleteSingleGoodsChange(prop.scope.row)" v-if="prop.scope.row.status === 0 && myModulePower.delete">删除</el-button>
                        </template>
                        <template slot="changeCode" scope="prop">
                            <span class="link" @click.stop="toChangeDetail(prop.scope.row)">{{prop.scope.row.sheetid}}</span>
                        </template>
                        <template slot="detail" scope="prop">
                            <span>新增{{prop.scope.row.addnum}}个商品，修改{{prop.scope.row.updatenum}}个商品</span>
                        </template>
                        <template slot="status" scope="prop">
                            <span v-if="prop.scope.row.status === 0">编辑中</span>
                            <span v-if="prop.scope.row.status === 1">编辑完成</span>
                            <span v-if="prop.scope.row.status === 2">已审核</span>
                            <span v-if="prop.scope.row.status === 3">已否决</span>
                        </template>
                    </sl-grid>
                </div>
            </div>
        </div>

        <el-dialog title="审核" :visible.sync="showCheck" v-drag>
            <p style="padding: 20px;">
                您正在审核商品变更单【{{goodsChangeCode}}】，您可以审核也可以否决，审核后商品信息将会变更！
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="operateGoodsChange('approve')" size="small">审核通过</el-button>
                <el-button type="primary" @click="operateGoodsChange('veto')" size="small">否决</el-button>
                <el-button @click="showCheck = false" class="dialog-cancel" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Levelbar from '@/views/layout/Levelbar.vue';
import SlGrid from '@/components/sl-grid.vue';
import SlAutocomplete from '@/components/sl-autocomplete.vue';
import { mapGetters } from 'vuex';
import { getGoodsTip } from '@/api/operations/goods';
import SlInput from '@/components/sl-input.vue';
import { getGoodsChangeList, checkGoodsChange, submitGoodsChange, deleteGoodsChange, catchDataIn } from '@/api/operations/goodsChange';
import RouterMixins from '@/mixins/router';
import ViewPage from '@/mixins/viewPage';

export default {
    name: 'goodsChangeMan',
    components: { Levelbar, SlGrid, SlAutocomplete, SlInput },
    mixins: [RouterMixins, ViewPage],
    data() {
        return {
            load1: false,
            load2: false,
            gridCol: [],
            gridVal: { rows: [], footer: {} },
            gridCfg: {
                selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                frozen: true
            },
            selectedGridData: [],
            queryKey: {
                creator: '',
                goodsId: '',
                mydate: '',
                status: -1,
                clearInput: false
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
        if (this.$route.query) {
            if (this.$route.query.opType === 'check') {
                this.queryKey.status = 1;
            }
        }
        this.doSearch();
    },
    mounted: function() {
        this.$nextTick(function() {
            //                sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
            this.gridCol = [
                { field: 'sheetid', name: '变更单号', width: '100', template: 'changeCode', fixed: true },
                { field: 'ename', name: '变更机构', width: '200' },
                { field: 'detail', name: '详情摘要', width: '200', template: 'detail' },
                { field: 'notes', name: '备注', minWidth: '200' },
                { field: 'editdateStr', name: '申请时间', width: '160px' },
                { field: 'editor', name: '申请人', width: '100px' },
                { field: 'checkdateStr', name: '审核时间', width: '200' },
                { field: 'checker', name: '审核人', width: '100' },
                { field: 'status', name: '状态', width: '100', template: 'status', fixed: 'right' },
                { field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right', isSort: false }
            ]

            console.log(this.myModulePower)
        })
    },
    methods: {
        onContentChange() { },
        // 获取变更单
        getGoodsChange() {
            this.load2 = true;
            setTimeout(() => {
                let opt = {
                    params: {
                        creator: this.queryKey.creator,
                        goodsId: this.queryKey.goodsId || -1,
                        bDate: this.queryKey.mydate.split(' - ')[0] || '',
                        eDate: this.queryKey.mydate.split(' - ')[1] || '',
                        status: this.queryKey.status
                    },
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getGoodsChangeList(opt).then(res => {
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
                    //                    this.$message(res.retMsg);
                })
            }, 120)

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
            if (!sel) {
                this.queryKey.goodsId = -1;
            } else {
                this.queryKey.goodsId = sel.goodsid;
            }

            this.queryKey.clearInput = false;
        },
        // 查询
        doSearch() {
            this.gridVal.footer.pageNum = 1;
            this.getGoodsChange();
        },
        // 重置
        doReset() {
            this.gridVal.footer.pageNum = 1;
            this.queryKey = {
                creator: '',
                goodsId: -1,
                mydate: '',
                status: -1,
                clearInput: true
            };
            this.doSearch();
        },

        // 审核变更单
        checkGoodsChangeList() {
            let checkArr = [];
            this.selectedGridData.forEach((item, i) => {
                //编辑完成的才能审核
                if (item.status === 1) {
                    checkArr.push(item.sheetid);
                }
            });
            if (checkArr.length === 0) {
                this.$message({
                    message: '未选择可审核的变更单！',
                    duration: 1000
                });
            } else {
                this.showCheck = true;
                this.goodsChangeCode = checkArr.join(',');
            }
        },
        // 表格中的单个审核
        checkSingleGoodsChange(obj) {
            this.showCheck = true;
            this.goodsChangeCode = obj.sheetid.toString();
        },
        // 审核弹窗选择
        operateGoodsChange(str) {
            this.load1 = true;
            let opType = 0;
            if (str === 'approve') {
                opType = 2;
            } else if (str === 'veto') {
                opType = 3;
            }
            checkGoodsChange(this.goodsChangeCode, opType).then(res => {
                this.load1 = false;
                if (res.retCode === 'SUCCESS') {
                    this.$message(res.retMsg);
                    this.doSearch();
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load1 = false;
                //                    this.$message(res.retMsg);
            })
            this.showCheck = false;
        },
        // 提交变更单
        submitSingleGoodsChange(obj) {
            this.load2 = true;
            submitGoodsChange(obj.sheetid).then(res => {
                this.load2 = false;
                if (res.retCode === 'SUCCESS') {
                    this.$message('提交成功！');
                    obj.status = 1;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load2 = false;
                //                        this.$message(res.retMsg);
            })

        },
        // 表格中的单个删除
        deleteSingleGoodsChange(obj) {
            this.$confirm('确认删除该变更单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.load2 = true;
                deleteGoodsChange(obj.sheetid).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
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
            this.selectedGridData = data;
        },
        handleSizeChange(size) {
            this.gridVal.footer.pageSize = size;
            this.getGoodsChange();
        },
        handleCurrentChange(page) {
            this.gridVal.footer.pageNum = page;
            this.getGoodsChange();
        },
        // 新增变更单
        addNewGoodsChange() {
            this.$router.push({ path: '/operations/goodsChangeEdit', query: { title: '新增商品变更单', opType: 'add' } });
        },
        // 跳转到变更单详情
        toChangeDetail(obj) {
            sessionStorage.setItem('gcInfo', JSON.stringify(obj));
            this.$router.push({ path: '/operations/goodsChangeEdit', query: { title: '商品变更单详情', opType: 'edit', sheetId: obj.sheetid } });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.goodsChangeIndex {
    .slic-content-info {
        width: calc(100% - 286px);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 10px 10px 0 10px !important;
        background-color: #fff;
        border-radius: 5px;
    }
    .el-dialog--small {
        width: 350px;
    }
    .link {
        color: #28e;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
            color: #0152a3;
        }
    }
}
</style>


