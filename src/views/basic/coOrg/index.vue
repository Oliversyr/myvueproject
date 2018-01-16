<template>
    <div class="sl-page-container flex-col partnerIndex">
        <div class="slic-head-panel">
            <levelbar>
                <span slot="tip-content" class="icon-help-wrap pst-rl">
                    <icon-svg icon-class="wenhao-fill"></icon-svg>
                    <div class="icon-help-alert animated zoomIn">
                        <div class="icon-help-alert-til">
                            <span class="left">【基础管理-合作伙伴管理】</span>
                        </div>
                        <div class="icon-help-alert-tcon">
                            <p>1. 管理合作伙伴；</p>
                            <p>2. 创建编辑合作伙伴信息；</p>
                            <p>3. 创建维护合作伙伴用户；</p>
                        </div>
                    </div>
                </span>
            </levelbar>
            <div style="float: right;">
                <el-button-group>
                    <el-button type="primary" size="small" @click="addNewPartner($event)" v-if="myModulePower.add">新增合作伙伴</el-button>
                    <el-button type="primary" size="small" @click="forbidPartner($event)" v-if="myModulePower.edit">禁用合作伙伴</el-button>
                </el-button-group>
            </div>
            <div class="sl-search-panel">

                <div class="slic-input-group  sl-search-item" style="width: 335px;">
                    <el-input icon="search" size="small" v-model="queryKey" :icon="queryKey ? 'circle-close' : ''" :on-icon-click="iconClose" placeholder="请输入合作伙伴名称">
                        <template slot="prepend">合作伙伴名称</template>
                    </el-input>
                </div>

                <div class="slic-input-group  sl-search-item" style="width: 260px;text-align: center;">
                    <sl-select prepend="合作伙伴类型">
                        <el-select filterable v-model="partnerType" placeholder="请选择合作伙伴类型" size="small" slot="ELSelect">
                            <el-option :key="0" :label="'全部'" :value="-1"></el-option>
                            <el-option :key="1" :label="'加盟商'" :value="0"></el-option>
                            <el-option :key="2" :label="'物业公司'" :value="1"></el-option>
                        </el-select>
                    </sl-select>

                </div>

                <div class="slic-btn-group ">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()">重置</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>

        <div class="slic-content">
            <div class="slic-content-info">
                <div style="flex: 1;height: 100%;">

                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                             @rowSelected="doSelected" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
                        <template slot="operate" scope="prop">
                            <el-button @click="operateSinglePartner(prop.scope.row)" type="text" size="small" v-if="myModulePower.edit">{{prop.scope.row.status == 1 ? '禁用' : '启用'}}</el-button>
                            <el-button type="text" size="small" @click="changeToDetail(prop.scope.row)">详情</el-button>
                        </template>

                        <template slot="orgType" scope="prop">
                            <span v-if="prop.scope.row.orgType === 0">加盟商</span>
                            <span v-if="prop.scope.row.orgType === 1">物业公司</span>
                            <span v-if="prop.scope.row.orgType === 2">加盟商/物业公司</span>
                        </template>

                        <template slot="status" scope="prop">
                            {{prop.scope.row.status == 0 ? '禁用' : '启用'}}
                        </template>
                    </sl-grid>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue';
    import {mapGetters} from 'vuex';
    import ViewPage from '@/mixins/viewPage';
    import {getPartnerList, operatePartner} from '@/api/basic/partner';

    export default {
        components: {Levelbar, SlGrid},
        mixins: [ViewPage],
        name: 'partnerman',
        data () {
            return {
                gridCol: [],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true
                },
                partnerType: -1,
                queryKey: ''
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.gridCol = [
                    {field: 'eid', name: '合作伙伴编码', width: '130', fixed: true},
                    {field: 'ename', name: '合作伙伴名称', width: '115',align:'left'},
                    {field: 'orgType', name: '类型', width: '70px', template: 'orgType'},
                    {field: 'areaName', name: '所在区域', width: '190',align:'left'},
                    {field: 'adderss', name: '地址', minWidth: '200',align:'left'},
                    {field: 'contact', name: '联系人', width: '100'},
                    {field: 'contactMobile', name: '联系电话', width: '100'},
                    {field: 'signTime', name: '合作开始日期', width: '200'},
                    {field: 'status', name: '状态', width: '100', template: 'status'},
                    {field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right'},

                ]
                this.getCoOrgList();

            })
        },
        activated: function () {
            this.doReset();
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
            }
        },
        methods: {
            // 获取合作伙伴列表
            getCoOrgList() {
                let opt = {
                    keyValue: this.queryKey,
                    orgType: this.partnerType,
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getPartnerList(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;

                      /*  for(let i = 0; i < 15; i++) {
                            this.gridVal.rows.push(JSON.parse(JSON.stringify(res.result[0])));
                        }*/


                        this.gridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord,
//                            totalRecord: this.gridVal.rows.length
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
//                    this.$message(res.retMsg);
                });
            },
            // 查询
            doSearch() {
                this.gridVal.footer.pageNum = 1;
                this.getCoOrgList();
            },
            // 重置
            doReset() {
                this.gridVal.footer.pageNum = 1;
                this.partnerType = -1;
                this.queryKey = '';
                this.getCoOrgList();
            },
            // 新增合作伙伴
            addNewPartner() {
                this.$router.push({path: '/basic/partnerEdit', query: {opType: 'add', title: '新增合作伙伴'}});
            },
            // 禁用合作伙伴
            forbidPartner() {
                if(!(this.selectedGridData && this.selectedGridData.length > 0)) {
                    this.$message('请选择合作伙伴！');
                } else {
                    let selectedPartner = '';
                    this.selectedGridData.forEach((item, i) => {
                        if(item.status == 1) {
                            selectedPartner  = selectedPartner  === '' ?  item.eid : `${selectedPartner},${item.eid}`;
                        }
                    });

                    if(!selectedPartner) {
                        this.$message('请选择状态为【启用】的合作伙伴！');
                    } else {
                        let opt = {
                            coOrgList: selectedPartner,
                            opType: 0
                        };
                        operatePartner(opt).then(res => {
                            if(res.retCode === 'SUCCESS') {
                                this.$message(res.retMsg);
                                this.getCoOrgList();
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.$message(res.retMsg);
                        });
                    }


                }
            },
            // 列表选中
            doSelected (data) {
                console.log('data==', data)
                this.selectedGridData = data;
            },
            // pageSize
            handleSizeChange (size) {
                console.log('size==', size);
                this.gridVal.footer.pageSize = size;
                this.getCoOrgList();
            },
            // pageNum
            handleCurrentChange (page) {
                console.log('page==', page);
                this.gridVal.footer.pageNum = page;
                this.getCoOrgList();
            },
            // 详情
            changeToDetail (partner) {
                this.$router.push({path: '/basic/partnerDetail', query: {coEid: partner.eid}});
            },
            // 表格中的单条操作
            operateSinglePartner(obj) {
                let opt = {
                    coOrgList: obj.eid,
                    opType: obj.status == 1 ? 0 : 1
                };
                operatePartner(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        if(obj.status == 1) {
                            obj.status = 0;
                            obj.ostatus = '禁用';
                        } else {
                            obj.status = 1;
                            obj.ostatus = '启用';
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });
            },
            iconClose(str) {
                this.queryKey = '';
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

    .partnerIndex{

        .slic-content-info{
            width: calc(100% - 286px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 10px 10px 0 10px !important;
            background-color: #fff;
            border-radius: 5px;
        }

    }


</style>



