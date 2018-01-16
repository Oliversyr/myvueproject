<template>
    <span class="orgSelectPartner">
        <sl-autocomplete :autoParams="autoParams"
                         :dataList="orgList"
                         slWidth="750"
                         colWidths="20,30,20,30"
                         displayProp="ename"
                         :defaultVal="defaultVal"
                         @querykey="autoQuery"
                         @doAutoSelected="handleAutoSelect"
                         :prepend="prepend"
                         :clearInput="clearSel"
                         placeholder="请输入公司名称"
                         selectedMode="SINGLE">
            <template slot="icon-more">
                <i class="el-icon-more" @click.stop="moreOrg()"></i>
            </template>
        </sl-autocomplete>


        <el-dialog title="机构选择" :visible.sync="showMyOrg" :close-on-click-modal="true" size="small" class="comon-co">
            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                     @rowSelected="doSelected">
                <template slot="shopstatus" scope="prop">
                    <span>{{prop.scope.row.status == 1 ? '正常' : '禁用'}}</span>
                </template>
            </sl-grid>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSure()" size="small">确定</el-button>
                <el-button @click="showMyOrg = false" class="dialog-cancel" size="small">取消</el-button>
            </span>

        </el-dialog>
    </span>


</template>

<script>
    import {getMyOrg} from '@/api/basic/org';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import SlGrid from '@/components/sl-grid.vue';
    import {mapGetters} from 'vuex';
    import {getPartnerList} from '@/api/basic/partner';
    export default {
        name: 'org-select',
        components: {SlAutocomplete, SlGrid},
        props: ['searchParam', 'prepend', 'selMode'],
        data() {
            return {
                gridCol: [],
                gridVal: {rows: [], footer: {
                    pageNum: 1,
                    pageSize: 25,
                    totalRecord: 0
                }},
                gridCfg: {
                    selectMode: 'SINGLE', // 'MULT'--多选，'SINGLE'--单选
                    frozen: undefined,
                    noPage: true
                },
                selectObj: {},
                showMyOrg: false,
                clearSel: false,
                defaultVal: {},
                orgList: [],
                autoParams: {
                    eid: '企业编码',
                    ename: '企业名称',
                    contact: '联系人',
                    ostatus: '状态'
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
//                this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
//                console.log(this.userInfo);

                this.gridCol = [
                    {field: 'eid', name: '合作伙伴编码', width: '150'},
                    {field: 'ename', name: '合作伙伴名称', width: '150'},
                    {field: 'areaName', name: '所在区域', width: '200',align:'left'},
                    {field: 'adderss', name: '地址', width: '200',align:'left'},
                    {field: 'contact', name: '联系人', width: '100'},
                    {field: 'contactMobile', name: '联系电话', width: '100'},
                    {field: 'signTime', name: '合作开始日期', width: '200'},
                    {field: 'status', name: '状态', width: '100', template: 'shopstatus' }
                ]
            })
        },
        activated: function () {
            console.log(12345679)
            this.clearSel = true;
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        methods: {
            // 获取表格数据
            getGridData() {
                let opt = {
                    keyValue: '',
                    orgType: this.searchParam.orgType,
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getPartnerList(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = [];
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
//                    this.$message(res.retMsg);
                });
            },
            // 自动补全搜索
            autoQuery(key) {
                let opt = {
                    keyValue: key,
                    orgType: this.searchParam.orgType,
                    pageNum: 1,
                    pageSize: 10,
                    totalRecord: 0,
                    totalPage: 0
                }
                getPartnerList(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.orgList = res.result;
                        this.orgList.forEach((item, i) => {
                            this.$set(item, 'ostatus', item.status === 0 ? '禁用' : '启用');
                        })
                    } else {
                        this.orgList = [];
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.orgList = [];
//                    this.$message(res.retMsg);
                });
            },

            // 更多
            moreOrg() {
                console.log('this.searchParam.orgType==', this.searchParam.orgType)
                this.showMyOrg = true;
                setTimeout(() => {
                    document.getElementsByClassName('v-modal')[0].click();
                }, 100)

                this.getGridData();
            },

            // 自动补全选中
            handleAutoSelect(sel) {
                console.log(sel);
//                this.queryKey.eid = sel.eid;
                this.selectObj = sel;
                this.$emit('doSelectOrg', this.selectObj);
                this.clearSel = false;
            },
            // 选中
            doSelected (data) {
                console.log('data==', data);
                this.selectObj = data;
            },
            // pagesize改变
            handleSizeChange (size) {
                console.log('size==', size);
                this.gridVal.footer.pageSize = size;
                this.getGoods();
            },
            // pagenum改变
            handleCurrentChange (page) {
                console.log('page==', page);
                this.gridVal.footer.pageNum = page;
                this.getGoods();
            },
            // 表格确定选中
            doSure() {
                this.showMyOrg = false;
                this.$emit('doSelectOrg', this.selectObj);
                this.clearSel = false;
                this.defaultVal = this.selectObj;
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .orgSelectPartner {
        .el-dialog__wrapper.comon-co {
            z-index: 2015 !important;
        }

        .el-dialog__wrapper.comon-co .el-dialog__body{
            height: 400px;
        }
        .el-dialog__wrapper.comon-co .el-dialog__body .el-table__body-wrapper {
            max-height: 337px !important;
        }
    }
</style>