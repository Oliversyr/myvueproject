<template>
    <div class="sl-page-container flex-col partnerDetail">

        <div class="slic-head-panel">
            <span style="width: 280px;display: inline-block;">
                <levelbar>
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【基础管理-合作伙伴】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>您可以查看到合作伙伴的详细信息。</p>
                            </div>
                        </div>
                    </span>
                </levelbar>
                <el-button size="small" @click="doBack()" class="sl-back-btn" style="float: right;">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </span>
            <div style="float: right;">
                <el-button-group>
                    <el-button type="primary" size="small" @click="toEdit()" v-if="myModulePower.edit">编辑</el-button>
                    <el-button class="slic-btn-theme3 "  type="primary" size="small" @click="doNewUser()" v-if="myModulePower.add" :disabled="load1">新建用户</el-button>
                    <el-button class="slic-btn-theme3 "  type="primary" size="small" @click="doForbidUser()" v-if="myModulePower.edit" :disabled="load1">禁用用户</el-button>
                    <!--<el-button type="primary" size="small" @click="toEdit()" >编辑</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doNewUser()" >新建用户</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doForbidUser()" >禁用用户</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doForbidCoOrg()" >{{partnerInfo.status === 1 ? '禁用合作伙伴' : '启用合作伙伴'}}</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doSave()">保存</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doCancel()">取消</el-button>-->
                </el-button-group>


            </div>
        </div>

        <div class="slic-content" v-loading="load1">
            <div class="sl-content-info">
                <div class="slic-content-info-up">

                    <el-form class="sl-form-group" :model="partnerInfo" ref="partnerForm" label-width="120px">
                        <div class="sl-row-group" style="margin-bottom: 0;">
                            <el-row>
                                <el-col :span="8" >
                                    <div class="sl-row-group-title">
                                        机构信息
                                        <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                                    </div>
                                </el-col>

                                <el-col :span="6" >
                                    <el-form-item label="状态：" class="el-form-item-detail" >
                                        <!--{{myUserInfo.status === 0 ? '禁用' : '启用'}}-->
                                        <el-switch
                                                :width="60"
                                                v-model="mystatus"
                                                on-text="启用"
                                                :disabled="true"
                                                @change="doForbidCoOrg"
                                                off-text="禁用">
                                        </el-switch>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="10" >
                                    <el-form-item label="" class="el-form-item-detail">
                                        <label class="">已签署{{partnerInfo.propertyNum + partnerInfo.franchiseNum}}份合作协议</label>
                                        <span class="sl-content-row-item-link" @click="toProtocol(1)" v-if="partnerInfo.propertyNum > 0 && myProModulePower.look">查看物业协议</span>
                                        <span class="sl-content-row-item-link" @click="toProtocol(2)" v-if="partnerInfo.franchiseNum > 0 && myJoiModulePower.look">查看加盟协议</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>


                            <span class="animated fadeIn" v-show="iconInfo">
                                <el-row :gutter="20" class="sl-form-row">
                                <el-col :span="8" >

                                    <el-form-item label="机构编码："  class="el-form-item-detail" :title="partnerInfo.coEid">
                                        {{partnerInfo.coEid}}
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">

                                    <el-form-item label="合作伙伴名称："  class="el-form-item-detail" :title="partnerInfo.ename">
                                        {{partnerInfo.ename}}
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8" >
                                    <!--<label class="sl-form-label">合作类型：</label>-->
                                    <el-form-item label="合作类型：" class="el-form-item-detail">
                                        <el-checkbox v-model="partnerInfo.orgPro" disabled>物业公司</el-checkbox>
                                        <el-checkbox v-model="partnerInfo.orgJoi" disabled>加盟商</el-checkbox>
                                    </el-form-item>

                                </el-col>

                            </el-row>

                            <el-row :gutter="20" class="sl-form-row">

                                <el-col :span="8">

                                    <el-form-item label="联系人：" class="el-form-item-detail" :title="partnerInfo.contact">
                                        {{partnerInfo.contact}}
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8" >

                                    <el-form-item label="联系电话：" class="el-form-item-detail"  :title="partnerInfo.contactMobile">
                                        {{partnerInfo.contactMobile}}
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8" >

                                    <el-form-item label="邮箱："class="el-form-item-detail"  :title="partnerInfo.email">
                                        {{partnerInfo.email}}
                                    </el-form-item>

                                </el-col>
                            </el-row>


                            <el-row :gutter="20" class="sl-form-row">

                                <el-col :span="8" >

                                    <el-form-item label="所在地区：" class="el-form-item-detail" :title="partnerInfo.areaName">
                                        <sl-area-select :areaId="partnerInfo.areaId" @getAreaId="getOrgArea" v-show="false"></sl-area-select>
                                        {{partnerInfo.areaName}}
                                    </el-form-item>

                                </el-col>

                                <el-col :span="16" >

                                    <el-form-item label="地址：" class="el-form-item-detail"  :title="partnerInfo.adderss">
                                        {{partnerInfo.adderss}}
                                    </el-form-item>

                                </el-col>

                            </el-row>

                            <el-row class="sl-form-row">
                                <el-col :span="24" >
                                    <el-form-item label="备注：" class="el-form-item-detail"  :title="partnerInfo.profiles">
                                        {{partnerInfo.notes}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            </span>



                        </div>

                    </el-form>
                </div>

                    <div class="table-container" v-loading="load2">
                        <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                                 @rowSelected="doSelected" @pageSizeChange="handleSizeChange"
                                 @currentPageChange="handleCurrentChange">
                            <template slot="operate" scope="prop">
                                <el-button @click.stop="forbidden(prop.scope.row)" type="text" size="small" v-if="myModulePower.edit">{{prop.scope.row.status === 1 ? '禁用' : '启用'}}</el-button>
                                <el-button type="text" size="small" @click.stop="changeToDetail(prop.scope.row)">详情</el-button>
                            </template>

                            <template slot="status" scope="prop">
                                {{prop.scope.row.status === 1 ? '启用' : '禁用'}}
                            </template>
                        </sl-grid>
                    </div>
            </div>
        </div>

    </div>


</template>

<script>
    import SlAreaSelect from '@/components/sl-areaSelect/sl-areaSelect.vue';
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue';
    import {mapGetters} from 'vuex';
    import RouterMixins from '@/mixins/router';
    import {addNewPartner, getPartnerDetail, operatePartner, changePartner, getPartnerUserList} from '@/api/basic/partner';
    import {operateUser} from '@/api/basic/user';

    export default {
        components: {
            Levelbar,
            SlGrid,
            SlAreaSelect
        },
        name: 'partnerdetailman',
        mixins: [RouterMixins],
        data () {
            return {
                load1: false,
                load2: false,
                iconInfo: true,
                gridCol: [],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true

                },
                selectedGridData: [],
                opType: '',
                mystatus: false,
                coEid: 0,
                userRole: '',
                queryKey: '',
                partnerInfo: {areaId:''},
                areaInfo: {},
                showOrgArea: false

            }
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
            myUserModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === 12) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            },
            myProModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === 71) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            },
            myJoiModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === 72) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            }
        },
        mounted: function () {
            this.$nextTick(function () {

                this.gridCol = [
                    {field: 'realname', name: '用户姓名', width: '100px', fixed: true},
                    {field: 'mobilephone', name: '用户手机', width: '150px'  },
                    {field: 'loginname', name: '登录账号', width: '100px'},
                    {field: 'lastloginStr', name: '上次登录', width: '200px'},
                    {field: 'createtimeStr', name: '创建时间', minWidth: '150px'},
                    {field: 'status', name: '状态', width: '150px', template: 'status'},
                    {field: 'operate', name: '操作', template: 'operate', isSort: false, fixed: 'right',align:'left',width: '120px'}
                ];

                this.opType = this.$route.query.opType;
                this.coEid = this.$route.query.coEid;
                this.getCoOrgDetail();
                this.getUserListInfo();
            })
        },
        methods: {
            // 获取合作伙伴详情
            getCoOrgDetail() {
                this.load1 = true;
                getPartnerDetail(this.coEid).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.load1 = false;
                        this.partnerInfo = res.result;
                        if(res.result.orgType === 0) {
                            this.$set(this.partnerInfo, 'orgPro', false);
                            this.$set(this.partnerInfo, 'orgJoi', true);

                        } else if(res.result.orgType === 1) {
                            this.$set(this.partnerInfo, 'orgPro', true);
                            this.$set(this.partnerInfo, 'orgJoi', false);

                        } else if(res.result.orgType === 2) {
                            this.$set(this.partnerInfo, 'orgPro', true);
                            this.$set(this.partnerInfo, 'orgJoi', true);
                        }
                        this.partnerInfo.contactMobile = parseInt(res.result.contactMobile);
                        this.partnerInfo.coEid = this.coEid;
                        this.mystatus = this.partnerInfo.status === 1;
//                        this.getUserListInfo();
                        this.$set(this.partnerInfo, 'areaId', res.result.areaId);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 用户列表
            getUserListInfo() {
                let param = {
                    params: {
                        eid: this.coEid,
                        keyValue: '',
                        roleId: -1
                    },
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                this.load2 = true;
                getPartnerUserList(param).then((res) => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {

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
//                    this.$message(res.retMsg);
                })
            },
            // 禁用合作伙伴
            doForbidCoOrg() {
                let opt = {
                    coOrgList: this.partnerInfo.coEid,
                    opType: this.partnerInfo.status == 1 ? 0 : 1
                };
                operatePartner(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        if(this.partnerInfo.status == 1) {
                            this.partnerInfo.status = 0;
                        } else {
                            this.partnerInfo.status = 1;
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });
            },
            // 返回
            doBack() {
                if(this.$route.query.from === 'joining') {
                    this.$router.push({path: '/business/joining'});
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                } else if(this.$route.query.from === 'property') {
                    this.$router.push({path: '/business/property'});
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                } else {
                    this.$router.push({path: '/basic/coOrg'});
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                }
            },
            doSelected (data) {
                console.log('data==', data);
                this.selectedGridData = data;
            },
            handleSizeChange (size) {
                console.log('size==', size)
                this.gridVal.footer.pageSize = size;
                this.getUserListInfo();
            },
            handleCurrentChange (page) {
                console.log('page==', page)
                this.gridVal.footer.pageNum = page;
                this.getUserListInfo();
            },
            // 跳转到用户详情
            changeToDetail (obj) {
                console.log(obj)
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/basic/partnerUserEdit', query: {opType: 'view', title: '合作伙伴用户详情', coEid: this.coEid, userId: obj.userid, coEName: this.partnerInfo.ename }});
            },
            // 表格中的单个用户禁用
            forbidden (obj) {
                console.log('obj==', obj)

                let opt = {
                    eid: this.coEid,
                    userIdList: obj.userid,
                    opType: obj.status == 1 ? 0 : 1
                };
                operateUser(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
//                        this.getUserListInfo();
                        if(obj.status == 1) {
                            obj.status = 0;
                        } else {
                            obj.status = 1;
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });
            },
            // 新建用户
            doNewUser() {
                this.$router.push({path: '/basic/partnerUserEdit', query: {opType: 'add', title: '新增合作伙伴用户', coEid: this.coEid, coEName: this.partnerInfo.ename}});
            },
            // 禁用用户
            doForbidUser() {
                if(!this.selectedGridData.length > 0) {
                    this.$message({
                        message: '请选择用户！',
                        duration: 1500
                    });

                } else {

                    let selectedUser = '';
                    this.selectedGridData.forEach((item, i) => {
                        if(item.status == 1) {
                            selectedUser = selectedUser === '' ?  item.userid : `${selectedUser},${item.userid}`;
                        }
                    });

                    if(!selectedUser) {
                        this.$message('请选择状态为【启用】的用户！');
                    } else {
                        let opt = {
                            eid: this.partnerInfo.coEid,
                            userIdList: selectedUser,
                            opType: 0
                        };
                        this.load2 = true;
                        operateUser(opt).then(res => {
                            this.load2 = false;
                            if(res.retCode === 'SUCCESS') {
                                this.$message(res.retMsg);
                                this.getUserListInfo();
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.load2 = false;
//                        this.$message(res.retMsg);
                        });
                    }
                }
            },
            // 地区选择
            getOrgArea(areaId, areaName) {
                console.log('areaId>>>', areaId)
                this.partnerInfo.areaId = areaId;
                this.partnerInfo.areaname = areaName;
            },
            // 去看看
            toProtocol(num) {
                if(num === 1) {
                    this.$router.push({path: '/business/property', query: {from: 'partner', coEid: this.coEid, coEName: this.partnerInfo.ename}});
                } else if(num === 2) {
                    this.$router.push({path: '/business/joining', query: {from: 'partner', coEid: this.coEid, coEName: this.partnerInfo.ename}});
                }
            },
            // 编辑
            toEdit() {
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/basic/partnerEdit', query: {opType: 'edit', title: '合作伙伴编辑', coEid: this.coEid}});
            },
            // 日期格式化
            dateFormat(mydate, myfmt) {
                Date.prototype.Format = function (fmt) { //author: meizz
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }

                return mydate.Format(myfmt);
            }
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss">
.partnerDetail {
    .sl-content-info{
        width: calc(100% - 286px);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 0;
        flex: 1;
    }

    .slic-content-info-up{
        background-color: #fff;
        border-radius: 5px;
        /*padding-bottom: 10px;*/
        margin-bottom: 20px;
    }

    .table-container{
        flex: 1;
        position: relative;
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;
    }

    .sl-content-row-item-link{
        margin-left: 20px;
        color: #28e;
        cursor: pointer;
    }

    .sl-content-row-item-link:hover{
        text-decoration: underline;
    }

	.el-checkbox__label {
		font-size: 12px;	
	}
	
	.el-form-item.el-form-item-detail {
	    margin-bottom: 5px;
	}
	      

        .el-form-item__content {
            margin-left: 120px !important;
            overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
        }
   

}
</style>
