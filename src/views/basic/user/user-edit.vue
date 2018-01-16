<template>
    <div class="sl-page-container flex-col userEdit" v-loading.body="load1">

        <div class="slic-head-panel">
            <span style="width: 260px;display: inline-block;">
                <levelbar :levelList="['基础管理', this.opType === 'add' ? '新增用户' : '用户编辑']">
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
                <el-button-group>
                    <!--<el-button type="primary" size="small" @click="forbidUser()" v-if="opType === 'change'">{{myUserInfo.status == 1 ? '禁用' : '启用'}}</el-button>-->
                    <el-button type="primary" size="small" @click="doSave()">保存</el-button>
                    <el-button type="primary" size="small" @click="doCancel()">取消</el-button>
                </el-button-group>
            </div>
        </div>



        <div class="slic-content">
            <div class="slic-content-info">
                <el-form class="sl-form-group" :model="myUserInfo" :rules="rules" ref="userForm" label-width="95px">
                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            基础信息
                            <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo">
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="用户名称：" prop="realname">
                                    <sl-input :input-val.sync="myUserInfo.realname" placeholder="请输入用户名称" :maxlength="16"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="所在机构：" prop="eid" v-show="opType === 'add'">
                                    <sl-tree-select :slTreeData="orgTreeData" @selectedNode="selectOrgTree"
                                                    :isShowThird="true"
                                                    :defaultCheck="myUserInfo.eid"
                                                    :slTreeProps="orgTreeProps"></sl-tree-select>
                                </el-form-item>

                                <el-form-item label="所在机构：" prop="eid" v-if="opType !== 'add'">
                                    {{myUserInfo.eName}}
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="登录账号：" prop="loginname">
                                    <sl-input :input-val.sync="myUserInfo.loginname" placeholder="请输入登录账号" :maxlength="16"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="登录密码：" prop="pswd" v-show="opType === 'add'">
                                    <el-input type="password" size="small" v-model="myUserInfo.pswd"  placeholder="请输入登录密码"></el-input>
                                </el-form-item>

                                <el-form-item label="登录密码：" v-show="opType !== 'add'">
                                    <span  class="sl-content-row-item-link" @click="changePwd()">重置密码</span>
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row" v-if="opType === 'edit'">
                            <el-col :span="8" >

                                <el-form-item label="用户状态：">
                                    <el-switch @change="forbidUser"
                                               :width="60"
                                               v-model="mystatus"
                                               on-text="启用"
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
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >
                                <el-form-item label="性别：" >
                                    <!--<el-input size="small" v-model="myUserInfo.sex"></el-input>-->
                                    <!--<el-select v-model="myUserInfo.sex" placeholder="请选择性别" size="small" style="width: 100%;">
                                        <el-option key="0" label="男" :value="1"></el-option>
                                        <el-option key="1" label="女" :value="2"></el-option>
                                    </el-select>-->

                                    <el-radio-group v-model="myUserInfo.sex">
                                        <el-radio :label="1">男</el-radio>
                                        <el-radio :label="2">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="手机：" prop="mobilephone">
                                    <sl-input :input-val.sync="myUserInfo.mobilephone" placeholder="请输入手机号码" :onlynum="true" :maxlength="11"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="联系电话：" prop="telephone">
                                    <sl-input :input-val.sync="myUserInfo.telephone" placeholder="请输入联系电话"></sl-input>
                                </el-form-item>

                            </el-col>


                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" style="position: relative">

                                <el-form-item label="身份证号：" prop="idcard">
                                    <sl-input :input-val.sync="myUserInfo.idcard" placeholder="请输入身份证号"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="邮箱：" prop="email">
                                    <sl-input :input-val.sync="myUserInfo.email" placeholder="请输入邮箱"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8">

                                <el-form-item label="QQ：" >
                                    <sl-input :input-val.sync="myUserInfo.qq" placeholder="请输入QQ号码" :onlynum="true" :maxlength="16"></sl-input>
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

                                <el-form-item label="所属角色：" >
                                    <!--<el-input size="small" v-model="myUserInfo.role" @focus="doSetRole()" placeholder="请选择所属角色"></el-input>-->
                                    <el-select v-model="myUserInfo.roleIdList" multiple placeholder="请选择所属角色" size="small" style="width: 100%;">
                                        <el-option
                                                v-for="(role, key) in roles"
                                                :key="key"
                                                :label="role.roleName"
                                                :value="role.roleId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>


                            </el-col>

                        </el-row>

                        <el-row class="sl-form-row">
                            <el-col :span="16" >

                                <el-form-item label="管理机构：" >
                                    <el-radio-group v-model="myUserInfo.type">
                                        <el-radio :label="0">本机构</el-radio>
                                        <el-radio :label="1">本机构及下级机构</el-radio>
                                        <el-radio :label="4">自定义机构</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20" v-show="myUserInfo.type === 4">
                            <el-col :span="16">
                                <el-form-item label="" >
                                    <el-select v-model="myUserInfo.eidList" multiple filterable placeholder="请选择管理机构" size="small" style="width: 100%;">
                                        <el-option-group
                                                v-for="item in orgOptions"
                                                :key="item.label"
                                                :label="item.label">
                                            <el-option
                                                  v-for="org in item.options"
                                                  :key="org.eid"
                                                  :label="org.ename"
                                                  :value="org.eid">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="4" >
                                <el-button @click="myUserInfo.eidList = []" size="small">清空</el-button>
                            </el-col>

                        </el-row>
                        </span>


                    </div>


                </el-form>

                <el-dialog :visible.sync="showChangePwd" title="重置密码" size="tiny">

                    <el-form :model="changepwd" :rules="rules2" ref="changepwdForm" label-width="95px">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="新密码：" prop="newpwd">
                                    <el-input size="small" type="password" v-model="changepwd.newpwd"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="确认密码：" prop="newpwd2" >
                                    <el-input size="small" type="password" v-model="changepwd.newpwd2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>


                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="doChangePwd()" size="small">确 定</el-button>
                        <el-button @click="showChangePwd = false" class="dialog-cancel" size="small">取 消</el-button>
                    </span>

                </el-dialog>
            </div>
        </div>




    </div>

</template>

<script>
    import SlTreeSelect from '@/components/sl-tree-select.vue'
    import Levelbar from '@/views/layout/Levelbar.vue'
    import {mapGetters} from 'vuex';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';
    import SlInput from '@/components/sl-input.vue';
    import {validatePassWD} from '@/utils/validate';
    import {getOrgList} from '@/api/basic/org';
    import {getRoleList, addNewRole} from '@/api/basic/role';
    import {getUserList, operateUser, getUserDetail, addUser, changeUser, myRoleList, changePswd} from '@/api/basic/user';

    export default {
        components: {
            Levelbar,
            SlTreeSelect,
            SlInput
        },
        name: 'useredit',
        mixins: [RouterMixins, ViewPage],
        data () {
            let validatePass = (rule, value, callback) => {
                console.log(1231, value)
                if (!(/^(\w){6,20}$/).test(value)) {
                    callback(new Error('请输入6-20个字母、数字、下划线'));
                }else {
                    if (this.changepwd.newpwd2 !== '') {
                        this.$refs.changepwdForm.validateField('newpwd2');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.changepwd.newpwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            let teleValid = (rule, value, callback) => {

                console.log('1234==', !(/^[0-9]{11}$/).test(value));
                if (!value) {
                    callback();
                } else if (!(/^[0-9]{11}$/).test(value)) {
//                    console.log('12345555555555555==', !(/^[0-9]{11}$/).test(value));
                    callback(new Error('请输入11位有效的手机号码'));
                } else {
                    callback();
                }
            };
            let teleValid2 = (rule, value, callback) => {
                if(!value) {
                    callback();
                } else if (!(/^[0-9]/).test(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
            };
            let loginValid = (rule, value, callback) => {
                if (!(/^[^\u4e00-\u9fa5]{0,}$/).test(value)) {
                    return callback(new Error('登录账号只能是数字或字母'));
                } else if(!value) {
                    callback(new Error('请输入登录账号'));
                } else {
                    callback();
                }
            };
            let idCardValid = (rule, value, callback) => {
                if(!value) {
                    callback();
                } else if ((/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/).test(value)) {
                    callback();
                } else if((/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/).test(value)) {
                    callback();
                } else {
                    callback('请输入正确的身份证号');
                }
            };
            let emailValid = (rule, value, callback) => {
                if(!value) {
                    callback();
                } else if ((/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ).test(value)) {
                    callback();
                } else {
                    callback('请输入正确的邮箱');
                }
            };

            return {
                load1: false,
                opType: '',
                iconInfo: true,
                iconInfo1: true,
                iconInfo2: true,
                pageType: 0, //1--保存后跳转, 2--返回, 3--取消后跳转
                mystatus: false,
                thisRoleList: [],
                myEidList: [],
                myUserInfo: {
                    sex: 1,
                    eid: '',
                    roleIdList: [],
                    eidList: [],
                    type: '',
                    realname: '',
                    loginname: '',
                    pswd: '',
                    mobilephone: '',
                    telephone: '',
                    idcard: '',
                    qq: '',
                    email: ''
                },
                showUserRole: false,
                showUserGrade: false,
                showAddRole: false,
                showChangePwd: false,
                userGradeShow: 3,
                userGradeSelect: '',
                newUser: {},
                currentEid: '',
                orgOptions: [],
                orgList: [],
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
                rules: {
                    realname: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    eid: [
                        {required: true, message: '请选择所在机构', trigger: 'change', type: 'number'}
                    ],
                    loginname: [
                        {validator: loginValid},
                        {required: true, message: '请输入登录账号', trigger: 'blur'}
                    ],
                    pswd: [
                        {validator: validatePass, trigger: 'blur', required: true}
                    ],
                    mobilephone: [
                        { validator: teleValid, trigger: 'blur' }
                    ],
                    telephone: [
                        { validator: teleValid2, trigger: 'blur'}
                    ],
                    idcard: [
                        { validator: idCardValid, trigger: 'blur'}
                    ],
                    email: [
                        { validator: emailValid, trigger: 'blur'}
                    ]
                },

                rules2: {
                    newpwd: [
                        {validator: validatePass, trigger: 'blur', required: true}
                    ],
                    newpwd2: [
                        { validator: validatePass2, trigger: 'blur', required: true }
                    ],
                }

            }
        },
        mounted: function () {
            this.$nextTick(function () {
                if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
                    let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
                    console.log('this.catahData==>', this.$route);
                    this.myUserInfo = catahData;
                    this.currentEid = this.$route.query.eid;
                    this.getOrg();
                    this.getMyRole();

                } else {
                    this.opType = this.$route.query.opType;
                    this.currentEid = this.$route.query.eid;
                    this.getMyRole();
                    if(this.opType === 'add') {
                        this.changePageType(1, '新增用户');
                        this.myUserInfo.eid = parseInt(this.$route.query.eid);
                        this.myUserInfo.type = 0;
//                    this.$set(this.myUserInfo, 'eid', );
                        this.getOrg();

                        this.getMyRole();

                        this.$set(this.myUserInfo, 'eName', this.$route.query.ename);
                    } else {
                        this.changePageType(2, '用户编辑');

                        this.getOrg();
                        this.getUserInfo(this.$route.query.eid, this.$route.query.userId);

                        console.log(this.$route.query.eid, this.$route.query.userId)
                    }

                    console.log(this.myUserInfo)
                }
            })
        },
        beforeRouteLeave(to, from, next) {
            console.log('this.myUserInfo==>', this.myUserInfo);
            this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify(this.myUserInfo)), name: this.$route.path});
            next();
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
        activated: function () {
//            this.pageType = 0;
        },
        methods: {
            // 获取组织机构列表
            getOrg() {
                getOrgList().then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        this.orgTreeData = JSON.parse(JSON.stringify(res.result));
                        this.orgList = JSON.parse(JSON.stringify(res.result));
                        for(let i = 0; i < this.orgList.length; i++) {
                            if(this.orgList[i].eid == this.$route.query.eid) {

                                this.getOrgFormat(this.orgList[i]);
                                break;
                            }
                        }

                    } else {
                        this.$message('获取组织机构列表失败！');
                    }
                }).catch((err) => {
                    this.$message('获取组织机构列表失败！');
                })
            },
            // 管理机构选择列表数据格式化
            getOrgFormat(myorg) {
                console.log('myorg===', myorg)
                let firstLevel = [];
                let secondLevel = [];
                let thirdLevel = [];
                let myOrgList = [];

                this.orgList.forEach((item, i) => {
                    if(item.levelId == 0) {
//                        _this.$set(item, 'children', []);
                        firstLevel.push(item);
                    } else if(item.levelId == 1) {
//                        _this.$set(item, 'children', []);
                        secondLevel.push(item);
                    } else {
                        thirdLevel.push(item);
                    }

                });

                if(myorg.levelId == 0) {
                    firstLevel.forEach((item1, i) => {
                        myOrgList.push({label: item1.ename, options: [item1]});
                    });

                    secondLevel.forEach((item2, j) => {
                        let children = [];
                        children.push(item2);
                        thirdLevel.forEach((item3, k) => {
                            if(item3.parentid === item2.eid) {
                                children.push(item3);
                            }
                        })
                        myOrgList.push({label: item2.ename, options: children});
                    });

                } else if(myorg.levelId == 1) {
                    let children = [];
                    children.push(myorg);
                    thirdLevel.forEach((item3, k) => {
                        if(item3.parentid === myorg.eid) {
                            children.push(item3);
                        }
                    })
                    myOrgList.push({label: myorg.ename, options: children});

                } else {
                    myOrgList.push({label: myorg.ename, options: [myorg]});
                }

                this.orgOptions = JSON.parse(JSON.stringify(myOrgList));

                setTimeout(() => {
                    console.log('this.myOrgList==', this.myEidList);
                    if(this.myEidList && this.myEidList.length > 0) {
                        this.$set(this.myUserInfo, 'eidList', this.myEidList);
                    }
                }, 200);
//                console.log('myEidList===', this.orgOptions);

            },
            // 获取我的角色列表
            getMyRole() {
                const _this = this;
                myRoleList(_this.currentEid).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.roles = res.result;
                        this.roles.forEach((item, i) => {
                            _this.$set(item, 'selectVal', false);
                        })

                        setTimeout(() => {
                            if(this.thisRoleList && this.thisRoleList.length > 0) {
                                this.$set(this.myUserInfo, 'roleIdList', this.thisRoleList);
                            }

                        }, 200);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(err.retMsg);
                });
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
                        console.log(this.myUserInfo);

                        this.$set(this.myUserInfo, 'mobilephone',  res.result.userInfo.mobilephone);
                        this.$set(this.myUserInfo, 'pswd',  'nochange');
                        this.$set(this.myUserInfo, 'type',  res.result.userInfo.dataright);

                        let roles = [];
                        res.result.roleList.forEach((item, i) => {
                            roles.push(item.roleId);
                        })
                        this.thisRoleList = roles;
                        this.$set(this.myUserInfo, 'roleIdList', roles);

                        let eidList = [];
                        res.result.orgList.forEach((item, i) => {
                            eidList.push(item.eid);
                        })

                        this.myEidList = eidList;
                        this.$set(this.myUserInfo, 'eidList',  eidList);

                        console.log('this.myUserInfo11111111111111==', JSON.parse(JSON.stringify(this.myUserInfo)))

                        if(!this.myUserInfo.eName) {
                            this.myUserInfo.eName = this.$route.query.ename;
                        }

                        this.mystatus = this.myUserInfo.status === 1;

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
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                    this.$router.push({path: '/basic/user'});

                })

            },
            // 保存
            doSave: function (event) {
//                console.log(this.$refs['userForm'])
                console.log('this.myUserInfo==', this.myUserInfo);
                this.myUserInfo.mobilephone = this.myUserInfo.mobilephone === null ? '' : this.myUserInfo.mobilephone;
//                this.myUserInfo.mobilephone = (typeof this.myUserInfo.mobilephone === 'string') ? this.myUserInfo.mobilephone : this.myUserInfo.mobilephone.toString();
                this.$refs['userForm'].validate((valid) => {
                    console.log('this.myUserInfo');
                    if (valid) {
//                        this.load1 = true;
                        if(this.opType === 'add') {
                            addUser(this.myUserInfo).then(res => {
                                this.load1 = false;
                                if(res.retCode === 'SUCCESS') {
                                    this.pageType = 1;
                                    this.$message(res.retMsg);
                                    this.$store.dispatch('delVisitedViews', this.$route.name);
                                    this.$router.push({path: '/basic/userDetail', query: {title: '用户详情', eid: this.myUserInfo.eid, userId: res.result, ename: this.myUserInfo.eName}});
                                } else {
                                    this.$message(res.retMsg);
                                }
                            }).catch(err => {
                                this.load1 = false;
//                                this.$message(err.retMsg);
                            });
                        } else {
                            if(this.myUserInfo.pswd === 'nochange') this.myUserInfo.pswd = '';
                            changeUser(this.myUserInfo).then(res => {
                                this.load1 = false;
                                if(res.retCode === 'SUCCESS') {
                                    this.pageType = 1;
                                    this.$message(res.retMsg);
                                    this.$store.dispatch('delVisitedViews', this.$route.name);
                                    this.$router.push({path: '/basic/userDetail', query: {title: '用户详情', eid: this.$route.query.eid, userId: this.myUserInfo.userid, ename: this.myUserInfo.eName}});
                                } else {
                                    this.$message(res.retMsg);
                                    this.myUserInfo.pswd = 'nochange'
                                }
                            }).catch(err => {
                                this.load1 = false;
//                                this.$message(err.retMsg);
                                this.myUserInfo.pswd = 'nochange'
                            });
                        }
                    } else {
                        console.log('error submit!!', valid);
                        return false;
                    }
                })


            },
            // 取消
            doCancel() {
                const _this = this;
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(_this.opType === 'add') {

                        this.myUserInfo.sex = 1;
                        this.myUserInfo.roleIdList = [];
                        this.myUserInfo.eidList = [];
                        this.myUserInfo.type = '';
                        this.myUserInfo.realname = '';
                        this.myUserInfo.loginname = '';
                        this.myUserInfo.pswd = '';
                        this.myUserInfo.mobilephone = '';
                        this.myUserInfo.telephone = '';
                        this.myUserInfo.idcard = '';
                        this.myUserInfo.qq = '';
                        this.myUserInfo.email = '';

                        this.$refs['userForm'].resetFields();

                        this.myUserInfo.eid = this.$route.query.eid;

//                        this.$store.dispatch('delVisitedViews', this.$route.name);
                    } else {
                        this.getUserInfo(this.$route.query.eid, this.$route.query.userId);
                    }
                })
            },
            // 禁用
            forbidUser() {
                this.myUserInfo.status = this.myUserInfo.status == 1 ? 0 : 1;
                /*this.load1 = true;
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
                });*/
            },
            // 等级树选中事件
            selectOrgTree (data) {
                console.log('data>>', data);
                this.myUserInfo.eName = data.ename;
                this.myUserInfo.eid = data.eid;
                this.currentEid = data.eid;
                this.getMyRole();
                this.myUserInfo.roleIdList = [];
                this.myUserInfo.eidList = [];

                this.getOrgFormat(data);
            },
            // 管理机构树选中事件
            selectManTree (data) {
                console.log('data>>', data);
//                this.userGradeSelect
                this.userGradeSelect = data;
            },
            // 角色选择弹窗确认
            setRole() {
                let str = '';
                this.myUserInfo.roleIdList = [];
                this.roles.forEach((item, i) => {
                    if(item.selectVal) {
                        this.myUserInfo.roleIdList.push(item.roleId);
                        if(str === '') {
                            str = item.roleName;
                        } else {
                            str = str + `、 ${item.roleName}`;
                        }
                    }
                })
                this.myUserInfo.role = str;

                this.showUserRole = false;
            },
            /*// 管理机构弹窗确认
            setManOrg() {
//                console.log(this.userGradeShow);
                this.myUserInfo.eidList = [];
                if(this.userGradeShow !== 2) {
                    this.myUserInfo.manOrg = this.userGradeShow === 0 ? '本机构' : '本机构及下级机构';
                    this.myUserInfo.type = this.userGradeShow === 0 ? 1 : 2;
                } else {
                    this.myUserInfo.type = 3;
                    console.log(this.userGradeSelect);
                    let str = '';
                    this.userGradeSelect.forEach((item, i) => {
                        this.myUserInfo.eidList.push(item.eid)
                        if(str === '') {
                            str = item.ename;
                        } else {
                            str = str + `、 ${item.ename}`;
                        }
                    });
                    this.myUserInfo.manOrg = str;
                }
                this.showUserGrade = false;
            },*/
            // 修改密码
            changePwd() {
                this.showChangePwd = true;

                this.changepwd.newpwd = '';
                this.changepwd.newpwd2 = '';
            },
            // 修改密码确认
            doChangePwd() {
                this.$refs['changepwdForm'].validate((valid) => {
                    if (valid) {
                        console.log('newpwd==', this.changepwd)
//                        this.myUserInfo.pswd = this.changepwd.newpwd;
                        let newpwd = this.changepwd.newpwd.toString();
                        console.log('newpwd==', newpwd)
                        changePswd(this.myUserInfo.userid, newpwd).then(res => {
                            this.load1 = false;
                            if(res.retCode === 'SUCCESS') {
                                this.$message('密码重置成功！');
//                                this.$router.push({path: '/basic/userDetail', query: {title: '用户详情', eid: this.$route.query.eid, userId: res.result, ename: this.$route.query.ename}});
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.load1 = false;
//                                this.$message(err.retMsg);
                        });

                        this.showChangePwd = false;
                    } else {
                        console.log('error submit!!', valid);
                        return false;
                    }

                });
            },
            // 设置角色
            doSetRole() {
                this.getMyRole();
                this.showUserRole = true;
            },
            // 设置机构
            setOrg() {
                this.getOrg();
                this.showUserGrade = true;
            },
            // 删除当前页
            delCurView(){
                this.$store.dispatch('delVisitedViews', this.$route.name);
            }

        }
        /*beforeRouteLeave (to, from, next) {
            if(this.pageType === 1 ) {
                this.delCurView();
                next()
                return;
            }
            this.$confirm('确定放弃编辑？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delCurView();
                next()
            }).catch(() => {
                next(false)
                this.$store.dispatch('updateActiveTab', this.$store.state.tabs.view.activeTab);
            });
        }*/
    }

</script>

<style rel="stylesheet/scss" lang="scss">
    .userEdit {
        .sl-content-row-item-link{
            margin-left: 20px;
            color: #28e;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }
        }

    }

</style>
