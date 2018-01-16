<template>
    <div class="sl-page-container flex-col userDetail" v-loading.body="load1">

        <div class="slic-head-panel">
            <span style="width: 260px;display: inline-block;">
                <levelbar>
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【基础管理-用户管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 用于管理企业的内部用户。</p>
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
                <el-button type="primary" size="small" @click="toEdit()" v-if="myModulePower.edit">编辑</el-button>
                <!--<el-button-group>-->
                    <!--<el-button type="primary" size="small" @click="forbidUser()" v-if="myModulePower.edit">{{myUserInfo.status == 1 ? '禁用' : '启用'}}</el-button>-->

                <!--</el-button-group>-->
            </div>
        </div>



        <div class="slic-content ">
            <div class="slic-content-info detailView">
                <el-form class="sl-form-group" :model="myUserInfo" ref="userForm" label-width="95px">
                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            基础信息
                            <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo">
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="用户名称：" class="el-form-item-detail">
                                    {{myUserInfo.realname}}
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="所在机构：" class="el-form-item-detail"  :title=myUserInfo.eName>
                                    {{myUserInfo.eName}}
                                </el-form-item>


                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="登录账号：" prop="loginname" class="el-form-item-detail">
                                    {{myUserInfo.loginname}}
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="用户状态：" class="el-form-item-detail" >
                                    <!--{{myUserInfo.status === 0 ? '禁用' : '启用'}}-->
                                    <el-switch
                                            :width="60"
                                            v-model="mystatus"
                                            on-text="启用"
                                            @change="forbidUser"
                                            :disabled="true"
                                            off-text="禁用">
                                    </el-switch>
                                </el-form-item>

                            </el-col>

                        </el-row>
                        </span>



                    </div>



                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            个人信息
                            <sl-icon-info :is-information-opened.sync="iconInfo1"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo1">
                            <el-row :gutter="20" class="sl-form-row " >
                            <el-col :span="8" >
                                <el-form-item label="性别：" class="el-form-item-detail">
                                    <span v-if="myUserInfo.sex === 1">男</span>
                                    <span v-if="myUserInfo.sex === 2">女</span>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="手机：" prop="mobilephone" class="el-form-item-detail">
                                    {{myUserInfo.mobilephone}}
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="联系电话：" prop="telephone" class="el-form-item-detail">
                                    {{myUserInfo.telephone}}
                                </el-form-item>

                            </el-col>


                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">


                            <el-col :span="8" style="position: relative">

                                <el-form-item label="身份证号：" class="el-form-item-detail">
                                    {{myUserInfo.idcard}}
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="邮箱：" class="el-form-item-detail">
                                    {{myUserInfo.email}}
                                </el-form-item>

                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="QQ：" class="el-form-item-detail">
                                    {{myUserInfo.qq}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        </span>

                    </div>




                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            权限信息
                            <sl-icon-info :is-information-opened.sync="iconInfo2"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo2">
                            <el-row class="sl-form-row">
                            <el-col :span="16" >

                                <el-form-item label="所属角色：" class="el-form-item-detail">
                                    {{myUserInfo.role}}
                                </el-form-item>


                            </el-col>

                        </el-row>

                        <el-row class="sl-form-row">
                            <el-col :span="16" >

                                <el-form-item label="管理机构：" class="el-form-item-detail"  :title=myUserInfo.manOrg>

                                    {{myUserInfo.manOrg}}
                                </el-form-item>

                            </el-col>
                        </el-row>
                        </span>

                    </div>


                </el-form>

            </div>
        </div>




    </div>

</template>

<script>
    import SlTreeSelect from '../../../components/sl-tree-select.vue'
    import Levelbar from '@/views/layout/Levelbar.vue'
    import {mapGetters} from 'vuex';
    import RouterMixins from '@/mixins/router';
    import {getOrgList} from '@/api/basic/org';
    import {getRoleList, addNewRole} from '@/api/basic/role';
    import {getUserList, operateUser, getUserDetail, addUser, changeUser, myRoleList} from '@/api/basic/user';
    import ElDialog from '../../../../node_modules/element-ui/packages/dialog/src/component'

    export default {
        components: {
            ElDialog,
            Levelbar,
            SlTreeSelect
        },
        name: 'userdetailman',
        mixins: [RouterMixins],
        data () {
            return {
                currentUser: {},
                iconInfo: true,
                iconInfo1: true,
                iconInfo2: true,
                load1: false,
                mystatus: false,
                opType: '',
                myUserInfo: {sex: 1},
                showUserRole: false,
                showUserGrade: false,
                showAddRole: false,
                showChangePwd: false,
                userGradeShow: 3,
                userGradeSelect: '',
                newUser: {},
                currentEid: '',
                orgOptions: [],
                roles: [],
                orgTreeData:[],
                orgTreeProps: {
                    label: 'ename',
                    key: 'eid'
                },
                changepwd: {
                    newpwd: '',
                    newpwd2: '',
                },
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.getUserInfo(this.$route.query.eid, this.$route.query.userId);
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
                console.log('我的权限==', modulePower, this.user_power);
                return modulePower;
            }
        },
        methods: {
            // 编辑
            toEdit() {
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/basic/userEdit', query: {title: '用户编辑',opType: 'edit', eid: this.myUserInfo.eid, userId: this.myUserInfo.userid, ename: this.myUserInfo.eName}});

            },
            // 获取用户信息
            getUserInfo(eid, userId) {
                this.load1 = true;
                const _this = this;
                let opt = {
                    eid: eid,
                    userId: userId
                };
                getUserDetail(opt).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.myUserInfo = res.result.userInfo;
                        if(!this.myUserInfo.eName) {
                            this.myUserInfo.eName = this.$route.query.ename;
                        }

                        this.mystatus = this.myUserInfo.status === 1;

                        let roleList = res.result.roleList;
                        let roleStr = '';
                        roleList.forEach((item, i) => {
                            roleStr = roleStr === '' ? item.roleName : (roleStr + '、' + item.roleName);
                            _this.roles.forEach((item1, j) => {
                                if(item.roleId === item1.roleId) {
                                    item1.selectVal = true;
                                }
                            })
                        })

                        this.myUserInfo.role = roleStr;

                        if(res.result.userInfo.dataright == 4) {
                            let orgList = res.result.orgList;
                            let orgStr = '';
                            orgList.forEach((item, i) => {
                                orgStr = orgStr === '' ? item.eName : (orgStr + '、' + item.eName);
                            })

                            this.myUserInfo.manOrg = orgStr;
                        } else {
                            this.myUserInfo.manOrg = res.result.userInfo.dataright === 0 ? '本机构' : '本机构及下级机构';
                        }

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
                    console.log(err);
                });
            },
            // 返回
            doBack () {
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/basic/user'});

            },
            // 禁用
            forbidUser() {
                this.load1 = true;
                let opt = {
                    eid: this.$route.query.eid,
                    userIdList: this.$route.query.userId,
                    opType: this.myUserInfo.status == 1 ? 0 : 1
                }
                operateUser(opt).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        this.$set(this.myUserInfo, 'status', this.myUserInfo.status == 1 ? 0 : 1)
                        console.log(this.myUserInfo);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                    this.$message(res.retMsg);
                });
            }
        }
    }

</script>

<style rel="stylesheet/scss" lang="scss" >
    .userDetail {
        .sl-content-row-item-link{
            margin-left: 20px;
            color: #28e;
            cursor: pointer;
        }

        .sl-content-row-item-link:hover{
            text-decoration: underline;
        }
        
        .el-form-item__content{
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
    }





</style>
