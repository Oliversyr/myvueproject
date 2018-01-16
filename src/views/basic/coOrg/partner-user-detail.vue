<template>
    <div class="sl-page-container flex-col userDetail" v-loading="load1">

        <div class="slic-head-panel">
            <span style="width: 300px;display: inline-block;">
                <levelbar :levelList="['基础管理', this.opType === 'add' ? '新增合作伙伴用户' : (this.opType === 'edit' ? '合作伙伴用户编辑' : '合作伙伴用户详情')]">
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【基础管理-合作伙伴用户管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 用于管理合作伙伴的用户。</p>
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
                <el-button type="primary" size="small" @click="doEdit()" v-if="opType === 'view' && myModulePower.edit">编辑</el-button>
                <el-button-group>
                    <!--<el-button type="primary" size="small" @click="forbidUser()" v-if="opType !== 'add' && myUserModulePower.edit">{{myUserInfo.status == 1 ? '禁用' : '启用'}}</el-button>-->
                    <el-button type="primary" size="small" @click="doSave()" v-if="opType !== 'view'">保存</el-button>
                    <el-button type="primary" size="small" @click="doCancel()" v-if="opType !== 'view'">取消</el-button>
                </el-button-group>
            </div>
        </div>



        <div class="slic-content">
            <div class="slic-content-info">
                <el-form class="sl-form-group" :model="myUserInfo" ref="viewForm" label-width="95px" v-if="opType === 'view'">
                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            基础信息
                            <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo" >
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="用户名称：" class="el-form-item-detail">
                                    <span >{{myUserInfo.realname}}</span>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="所在机构：" class="el-form-item-detail">
                                    {{myUserInfo.eName}}
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="登录账号：" class="el-form-item-detail">
                                    <span >{{myUserInfo.loginname}}</span>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <!--<el-form-item label="登录密码：" prop="pswd" v-if="opType !== 'view'">
                                    <el-input type="password" size="small" v-model="myUserInfo.pswd" v-if="opType === 'add'"></el-input>
                                    <span v-else class="sl-content-row-item-link" @click="changePwd()">修改密码</span>
                                </el-form-item>-->

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row" >
                            <el-col :span="8" >

                                <el-form-item label="用户状态：" class="el-form-item-detail">
                                    <el-switch @change="forbidUser"
                                               :width="60"
                                               v-model="mystatus"
                                               on-text="启用"
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

                        <span class="animated fadeIn" v-show="iconInfo1" >
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="性别：" class="el-form-item-detail">
                                    <span >{{myUserInfo.sex === 1 ? '男' : '女'}}</span>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="手机：" class="el-form-item-detail">
                                    <span>{{myUserInfo.mobilephone}}</span>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8" style="position: relative">

                                <el-form-item label="联系电话：" class="el-form-item-detail">
                                    <span >{{myUserInfo.telephone}}</span>
                                </el-form-item>

                            </el-col>
                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" style="position: relative">
                                <el-form-item label="身份证号：" class="el-form-item-detail">
                                    <span >{{myUserInfo.idcard}}</span>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="邮箱：" class="el-form-item-detail">
                                    <span >{{myUserInfo.email}}</span>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8">

                                <el-form-item label="QQ：" class="el-form-item-detail">
                                    <span >{{myUserInfo.qq}}</span>
                                </el-form-item>

                            </el-col>
                        </el-row>
                        </span>
                    </div>
                </el-form>


                <el-form class="sl-form-group" :model="myUserInfo" :rules="rules" ref="editForm" label-width="95px" v-show="opType === 'edit'">
                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            基础信息
                            <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo" >
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="用户名称：" prop="realname" >
                                    <sl-input :input-val.sync="myUserInfo.realname" placeholder="请输入用户名称" ></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="所在机构：">
                                    {{myUserInfo.eName}}
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="登录账号：" prop="loginname">
                                    <sl-input :input-val.sync="myUserInfo.loginname" placeholder="请输入登录账号" ></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="登录密码："  >
                                    <span class="sl-content-row-item-link" @click="changePwd()">修改密码</span>
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row" >
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

                        <span class="animated fadeIn" v-show="iconInfo1" >
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="性别：" >
                                    <el-radio-group v-model="myUserInfo.sex" >
                                        <el-radio :label="1">男</el-radio>
                                        <el-radio :label="2">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="手机：" prop="mobilephone">
                                    <sl-input :input-val.sync="myUserInfo.mobilephone" placeholder="请输入手机号码" :onlynum="true" :maxlength="11" ></sl-input>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8" style="position: relative">

                                <el-form-item label="联系电话：" prop="telephone">
                                    <sl-input :input-val.sync="myUserInfo.telephone" placeholder="请输入联系电话" :maxlength="16"></sl-input>
                                </el-form-item>

                            </el-col>
                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" style="position: relative">
                                <el-form-item label="身份证号：" prop="idcard">
                                    <sl-input :input-val.sync="myUserInfo.idcard" placeholder="请输入身份证号" ></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="邮箱：" prop="email">
                                    <sl-input :input-val.sync="myUserInfo.email" placeholder="请输入邮箱" ></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8">

                                <el-form-item label="QQ：">
                                    <sl-input :input-val.sync="myUserInfo.qq" placeholder="请输入QQ号码" :onlynum="true" :maxlength="15"></sl-input>
                                </el-form-item>

                            </el-col>
                        </el-row>
                        </span>

                    </div>

                </el-form>

                <el-form class="sl-form-group" :model="newUserInfo" :rules="rules" ref="addForm" label-width="95px" v-show="opType === 'add'">
                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            基础信息
                            <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo" >
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="用户名称：" prop="realname" >
                                    <sl-input :input-val.sync="newUserInfo.realname" placeholder="请输入用户名称" ></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="所在机构：">
                                    {{newUserInfo.eName}}
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="登录账号：" prop="loginname">
                                    <sl-input :input-val.sync="newUserInfo.loginname" placeholder="请输入登录账号"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" style="position: relative">

                                <el-form-item label="登录密码：" prop="pswd" >
                                    <el-input type="password" size="small" v-model="newUserInfo.pswd" placeholder="请输入登录密码"></el-input>
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row" v-if="opType === 'edit'">
                            <!--<el-col :span="8" >

                                <el-form-item label="用户状态：">
                                    <el-switch @change="forbidUser"
                                               :width="60"
                                               v-model="mystatus"
                                               on-text="启用"
                                               off-text="禁用">
                                    </el-switch>
                                </el-form-item>

                            </el-col>-->

                        </el-row>
                        </span>
                    </div>



                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            个人信息
                            <sl-icon-info :is-information-opened.sync="iconInfo1"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo1" >
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" >

                                <el-form-item label="性别：" >
                                    <el-radio-group v-model="newUserInfo.sex" >
                                        <el-radio :label="1">男</el-radio>
                                        <el-radio :label="2">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="手机：" prop="mobilephone">
                                    <sl-input :input-val.sync="newUserInfo.mobilephone" placeholder="请输入手机号码" :onlynum="true" :maxlength="11"></sl-input>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8" style="position: relative">

                                <el-form-item label="联系电话：" prop="telephone">
                                    <sl-input :input-val.sync="newUserInfo.telephone" placeholder="请输入联系电话" :maxlength="16"></sl-input>
                                </el-form-item>

                            </el-col>
                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="8" style="position: relative">
                                <el-form-item label="身份证号：" prop="idcard">
                                    <sl-input :input-val.sync="newUserInfo.idcard" placeholder="请输入身份证号" ></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8" >

                                <el-form-item label="邮箱：" prop="email">
                                    <sl-input :input-val.sync="newUserInfo.email" placeholder="请输入邮箱"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="8">

                                <el-form-item label="QQ：">
                                    <sl-input :input-val.sync="newUserInfo.qq" placeholder="请输入QQ号码" :onlynum="true" :maxlength="15"></sl-input>
                                </el-form-item>

                            </el-col>
                        </el-row>
                        </span>

                    </div>

                </el-form>

                <el-dialog :visible.sync="showChangePwd" title="重置密码" size="tiny">

                    <el-form :model="changepwd" :rules="rules2" ref="changepwdForm" label-width="95px">
                        <el-form-item label="新密码：" prop="newPwd">
                            <el-input size="small" type="password" v-model="changepwd.newPwd"></el-input>
                        </el-form-item>

                        <el-form-item label="确认密码：" prop="newPwd2" >
                            <el-input size="small" type="password" v-model="changepwd.newPwd2"></el-input>
                        </el-form-item>
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
    import SlTreeSelect from '../../../components/sl-tree-select.vue'
    import Levelbar from '@/views/layout/Levelbar.vue'
    import {mapGetters} from 'vuex';
    import SlInput from '@/components/sl-input.vue';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';
    import {validatePassWD} from '@/utils/validate';
    import {getOrgList} from '@/api/basic/org';
    import {getRoleList, addNewRole} from '@/api/basic/role';
    import {getUserList, operateUser, getUserDetail, addUser, changeUser, changePswd} from '@/api/basic/user';
    import ElButton from '../../../../node_modules/element-ui/packages/button/src/button'

    export default {
        components: {
            ElButton,
            Levelbar,
            SlTreeSelect,
            SlInput
        },
        name: 'partnerUserDetail',
        mixins: [RouterMixins, ViewPage],
        data () {

            let validatePass = (rule, value, callback) => {
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
                } else if (value !== this.changepwd.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            let teleValid = (rule, value, callback) => {
                if (!value) {
                    callback();
                } else if (!(/^[0-9]{11}$/).test(value)) {
                    return callback(new Error('请输入11位有效的手机号码'));
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
                myUserInfo: {},
                newUserInfo: {
                    realname: '',
                    qq: '',
                    eName: this.$route.query.coEName,
                    loginname: '',
                    pswd: '',
                    sex: 1,
                    mobilephone: '',
                    telephone: '',
                    idcard: '',
                    email: ''

                },
                showUserRole: false,
                showUserGrade: false,
                showAddRole: false,
                mystatus: false,
                pageType: 0, //1--保存后跳转, 2--返回, 3--取消后跳转
                userGradeShow: 3,
                userGradeSelect: '',
                newUser: {},
                orgOptions: [],
                roles: [],
                showChangePwd: false,
                changepwd: {
                    newpwd: '',
                    newpwd2: '',
                },
                orgTreeData:[],
                orgTreeProps: {
                    label: 'ename',
                    key: 'eid'
                },

//                rules: {},
                rules2: {
                    newpwd: [
                        { validator: validatePass, trigger: 'blur', required: true }
                    ],
                    newpwd2: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                },
                rules: {
                    /*eid: [
                        {required: true, message: '请选择所在机构', trigger: 'change', type: 'number'}
                    ],*/
                    realname: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    loginname: [
                        {validator: loginValid},
                        {required: true, message: '请输入登录账号', trigger: 'blur'}
                    ],
                    pswd: [
                        { validator: validatePass, trigger: 'blur', required: true }
                    ],
                    mobilephone: [
                        { validator: teleValid, trigger: 'blur'}
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

                }

            }
        },
        activated: function () {
            this.pageType = 0;

        },
        mounted: function () {
            this.$nextTick(function () {
                this.opType = this.$route.query.opType;

                if(this.opType === 'edit') {
                    if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
                        let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
                        console.log('this.catahData==>', this.$route);
                        this.myUserInfo = catahData;

                    }
                } else if(this.opType === 'add') {
                    this.changePageType(1, '新增合作伙伴用户');
                    if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
                        let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
                        console.log('this.catahData==>', this.$route);
                        this.newUserInfo = catahData;
                    }
                } else {
                    console.log('this.opType==', this.opType);
//            this.$refs['userForm'].resetFields();
                    if(this.opType === 'add') {
                        this.changePageType(1, '新增合作伙伴用户');

                        this.newUserInfo.sex = 1;
                        this.newUserInfo.qq = '';
                        this.newUserInfo.eName = this.$route.query.coEName;
//                this.getOrg();
//                this.getMyRole();
                    } else if(this.opType === 'edit') {
                        this.getUserInfo(this.$route.query.userId);

                    } else if(this.opType === 'view') {
                        this.getUserInfo(this.$route.query.userId);
                    }
                }
            })
        },
        beforeRouteLeave(to, from, next) {
            console.log('this.myUserInfo==>', this.myUserInfo);
            if(this.opType === 'add') {
                this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify(this.newUserInfo)), name: this.$route.path});
            } else if(this.opType === 'edit') {
                this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify(this.myUserInfo)), name: this.$route.path});
            }
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
            }
        },
        methods: {

            /*// 获取组织机构列表
            getOrg() {
                getOrgList().then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        this.orgTreeData = JSON.parse(JSON.stringify(res.result));
                        this.orgOptions = JSON.parse(JSON.stringify(res.result));
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.$message(err.retMsg);
                })
            },*/
            // 获取用户信息
            getUserInfo(userId) {
                let opt = {
                    eid: this.$route.query.coEid,
                    userId: userId
                };
                getUserDetail(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
//                        this.myUserInfo = res.result.userInfo;
                        console.log('res==', res)
                        for(let item in res.result.userInfo) {
                            this.$set(this.myUserInfo, item, res.result.userInfo[item]);
                        }
                        this.myUserInfo.eName = res.result.userInfo.eName || this.$route.query.coEName;
                        this.mystatus = this.myUserInfo.status === 1;
                        console.log('res==', this.myUserInfo)

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 编辑
            doEdit() {

                console.log('queryParams===', this.$store.state.tabs.view.menus);

                this.$router.push({path: '/basic/partnerUserEdit', query: {opType: 'edit', coEid: this.$route.query.coEid, userId: this.$route.query.userId, coEName: this.$route.query.coEName }});
                this.opType = 'edit';
                this.changePageType(2, '合作伙伴用户编辑');
                let activeIndex = this.$store.state.tabs.view.activeTab,
                    queryParams = this.$route.query;
                this.$store.state.tabs.view.menus[activeIndex].query = queryParams;

                this.getUserInfo(this.$route.query.userId);
            },
            // 返回
            doBack () {
                if(this.opType === 'view') {
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                    this.$router.push({path: '/basic/partnerDetail', query: {coEid: this.$route.query.coEid}});
                } else {
                    this.$confirm('确定放弃编辑？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$store.dispatch('delVisitedViews', this.$route.name);
                        this.$router.push({path: '/basic/partnerDetail', query: {coEid: this.$route.query.coEid}});
                    })
                }
            },
            // 保存
            doSave: function (event) {
                console.log(this.myUserInfo);

                if(this.opType === 'add') {
                    this.newUserInfo.eid = this.$route.query.coEid;
                    this.$refs['addForm'].validate((valid) => {
                        if(valid) {
                            this.load1 = true;
                            addUser(this.newUserInfo).then(res => {
                                this.load1 = false;
                                if(res.retCode === 'SUCCESS') {
                                    this.$message(res.retMsg);
                                    this.opType = 'view';

                                    this.$router.push({path: '/basic/partnerUserEdit', query: {opType: 'view', title: '合作伙伴用户详情', coEid: this.$route.query.coEid, userId: res.result, coEName: this.$route.query.coEName }});
                                    this.changePageType(3, '合作伙伴用户详情');
                                    this.getUserInfo(res.result);
                                } else {
                                    this.$message(res.retMsg);
                                }
                            }).catch(err => {
                                this.load1 = false;
//                                this.$message(err.retMsg);
                            });
                        } else {
                            console.log('error submit!!', valid);
                            return false;
                        }
                    })

                } else if(this.opType === 'edit') {
                    this.myUserInfo.eid = this.$route.query.coEid;
                    this.$refs['editForm'].validate((valid) => {
                        if (valid) {
                            this.load1 = true;
//                            if(this.myUserInfo.pswd === 'nochange') this.myUserInfo.pswd = '';
                            changeUser(this.myUserInfo).then(res => {
                                this.load1 = false;
                                if(res.retCode === 'SUCCESS') {
                                    this.$message(res.retMsg);
                                    this.opType = 'view';
                                    this.changePageType(3, '合作伙伴用户详情');
                                    this.getUserInfo(this.$route.query.userId);
                                } else {
                                    this.$message(res.retMsg);
                                }
                            }).catch(err => {
                                this.load1 = false;
//                                this.$message(err.retMsg);
                            });
                        } else {
                            console.log('error submit!!', valid);
                            return false;
                        }
                    })
                }

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

                        this.$refs['addForm'].resetFields();
                        this.newUserInfo.sex = 1;
//                        this.myUserInfo.roleIdList = [];
//                        this.myUserInfo.eidList = [];
//                        this.myUserInfo.type = '';
                        this.newUserInfo.realname = '';
                        this.newUserInfo.loginname = '';
                        this.newUserInfo.pswd = '';
                        this.newUserInfo.mobilephone = '';
                        this.newUserInfo.telephone = '';
                        this.newUserInfo.idcard = '';
                        this.newUserInfo.qq = '';

                        this.$set(this.newUserInfo, 'qq', '');
                        this.newUserInfo.email = '';



//                        this.myUserInfo.eName = this.$route.query.eid;
                    } else {
                        this.$refs['editForm'].resetFields();

                        this.getUserInfo( this.$route.query.userId);
                    }
                })
            },
            // 禁用
            forbidUser() {
                this.myUserInfo.status = this.myUserInfo.status == 1 ? 0 : 1;
                /*let opt = {
                    eid: this.$route.query.coEid,
                    userIdList: this.$route.query.userId,
                    opType: this.myUserInfo.status == 1 ? 0 : 1
                }
                operateUser(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        this.$set(this.myUserInfo, 'status', this.myUserInfo.status == 1 ? 0 : 1)
                        console.log(this.myUserInfo);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });*/
            },
            // 等级树选中事件
            selectOrgTree (data) {
                console.log('data>>', data);
                this.myUserInfo.ename = data.ename;
                this.myUserInfo.eid = data.eid;
            },
            // 修改密码
            changePwd() {
                this.showChangePwd = true;

                this.changepwd.newPwd = '';
                this.changepwd.newPwd2 = '';
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
            // 删除当前页
            delCurView(){
                this.$store.dispatch('delVisitedViews', this.$route.name);
            }
        }


    }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .sl-content-row-item-textarea{
        width: 80%;
        /*height: 200px;*/
        vertical-align: top;
    }

    .sl-search-showPart{
        text-align: justify;
        padding-top: 15px;
    }

    .sl-search-showPart::after{
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

    .sl-content-row-item-input{
        display: inline-block;
    }

    .sl-dropdown{
        text-align: left;
        position: absolute;
        z-index: 999;
        left: calc(50% - 50px);
        width: 200px;
    }

    hr{
        border:none;
        border-bottom: 1px solid #ccc;
    }


</style>
