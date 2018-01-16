<template>
    <div class="sl-page-container flex-col partnerEdit">

        <div class="slic-head-panel">
            <span style="width: 280px;display: inline-block;">
                <levelbar :levelList="['基础管理', this.opType === 'add' ? '新增合作伙伴' : '合作伙伴编辑']">
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【基础管理-合作伙伴】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>您可以编辑或新增到合作伙伴。</p>
                            </div>
                        </div>
                    </span>
                </levelbar>
                <el-button size="small" @click="doBack()" class="sl-back-btn " style="float: right;">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </span>
            <div style="float: right;">
                <el-button-group>
                    <el-button class="slic-btn-theme3 " type="primary" size="small" @click="doSave()" :disabled="load2">保存</el-button>
                    <!--<el-button class="slic-btn-theme3 "  type="primary" size="small" @click="doNewUser()" v-if="opType === 'edit' && myUserModulePower.add" :disabled="load2">新建用户</el-button>-->
                    <!--<el-button class="slic-btn-theme3 "  type="primary" size="small" @click="doForbidUser()" v-if="opType === 'edit' && myUserModulePower.edit" :disabled="load2">禁用用户</el-button>-->
                    <!--<el-button class="slic-btn-theme3 "  type="primary" size="small" @click="doForbidCoOrg()" v-if="opType === 'edit'" :disabled="load2">{{partnerInfo.status === 1 ? '禁用合作伙伴' : '启用合作伙伴'}}</el-button>-->

                    <el-button type="primary" size="small" @click="doCancel()">取消</el-button>
                </el-button-group>
            </div>
        </div>

        <div class="slic-content" v-loading="load2">
            <div class="sl-content-info">
                <div class="slic-content-info-up">

                    <el-form class="sl-form-group" :model="partnerInfo" :rules="rules" ref="partnerForm" label-width="120px">
                        <div class="sl-row-group" style="margin-bottom: 0; padding-bottom: 0;">
                            <el-row>
                                <el-col :span="8" >
                                    <div class="sl-row-group-title">
                                        机构信息
                                        <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                                    </div>
                                </el-col>

                                <el-col :span="8" >
                                    <el-form-item label="状态：" class="el-form-item-detail" v-if="opType === 'edit'">
                                        <!--{{myUserInfo.status === 0 ? '禁用' : '启用'}}-->
                                        <el-switch
                                                :width="60"
                                                v-model="mystatus"
                                                on-text="启用"
                                                @change="doForbidCoOrg"
                                                off-text="禁用">
                                        </el-switch>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8" >
                                    <el-form-item label="" class="el-form-item-detail" v-if="opType === 'edit'">
                                        <label class="">已签署{{partnerInfo.propertyNum + partnerInfo.franchiseNum}}份合作协议</label>
                                        <span class="sl-content-row-item-link" @click="toProtocol(1)" v-if="partnerInfo.propertyNum > 0 && myProModulePower.look">查看物业协议</span>
                                        <span class="sl-content-row-item-link" @click="toProtocol(2)" v-if="partnerInfo.franchiseNum > 0 && myJoiModulePower.look">查看加盟协议</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <span class="animated fadeIn" v-show="iconInfo" >
                                <el-row :gutter="20" class="sl-form-row">

                                <el-col :span="8" >

                                    <el-form-item label="合作伙伴编码：" class="longLabel">
                                        <el-input size="small" class="noedit" v-model="partnerInfo.coEid" readonly></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">

                                    <el-form-item label="合作伙伴名称：" prop="ename" class="longLabel">
                                        <sl-input :input-val.sync="partnerInfo.ename" placeholder="请输入合作伙伴名称"></sl-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8" >
                                    <!--<label class="sl-form-label">合作类型：</label>-->
                                    <el-form-item label="合作类型：" >
                                        <el-checkbox v-model="partnerInfo.orgPro" >物业公司</el-checkbox>
                                        <el-checkbox v-model="partnerInfo.orgJoi">加盟商</el-checkbox>
                                    </el-form-item>

                                </el-col>
                            </el-row>

                            <el-row :gutter="20" class="sl-form-row">
                                <el-col :span="8">

                                    <el-form-item label="联系人：" prop="contact">
                                        <sl-input :input-val.sync="partnerInfo.contact" placeholder="请输入联系人"></sl-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8" >

                                    <el-form-item label="手机：" prop="contactMobile">
                                        <sl-input :input-val.sync="partnerInfo.contactMobile" placeholder="请输入手机" :maxlength="11" :onlynum="true"></sl-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8" >

                                    <el-form-item label="邮箱：" prop="email">
                                        <sl-input :input-val.sync="partnerInfo.email" placeholder="请输入邮箱"></sl-input>
                                    </el-form-item>

                                </el-col>

                            </el-row>

                            <el-row :gutter="20" class="sl-form-row">

                                <el-col :span="8" >

                                    <el-form-item label="所在地区：" prop="areaId">
                                        <sl-area-select :areaId="partnerInfo.areaId" @getAreaId="getOrgArea"></sl-area-select>
                                    </el-form-item>

                                </el-col>

                                <el-col :span="16" >

                                    <el-form-item label="地址：" prop="adderss">
                                        <sl-input :input-val.sync="partnerInfo.adderss" placeholder="请输入地址"></sl-input>
                                    </el-form-item>

                                </el-col>



                            </el-row>

                            <el-row class="sl-form-row">
                                <el-col :span="24" >
                                    <el-form-item label="备注：" >
                                        <el-input
                                                class="sl-form-input"
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="请输入备注"
                                                :maxlength="32"
                                                v-model="partnerInfo.notes">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            </span>
                        </div>




                    </el-form>
                </div>

                    <div class="table-container" v-if="opType === 'edit' && false" v-loading="load3">
                        <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                                 @rowSelected="doSelected" >
                            <template slot="operate" scope="prop">
                                <el-button @click.stop="forbidden(prop.scope.row)" type="text" size="small" v-if="myUserModulePower.edit">{{prop.scope.row.status === 1 ? '禁用' : '启用'}}</el-button>
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
    import ViewPage from '@/mixins/viewPage';
    import SlInput from '@/components/sl-input.vue';
    import RouterMixins from '@/mixins/router';
    import {addNewPartner, getPartnerDetail, operatePartner, changePartner} from '@/api/basic/partner';
    import {getUserList, operateUser} from '@/api/basic/user';

    export default {
        components: {
            Levelbar,
            SlGrid,
            SlAreaSelect,
            SlInput
        },
        name: 'partnerEdit',
        mixins: [RouterMixins, ViewPage],
        data () {
            let teleValid = (rule, value, callback) => {
                if (!(/^[0-9]{11}$/).test(value)) {
//                    console.log('12345555555555555==', !(/^[0-9]{11}$/).test(value));
                    callback(new Error('请输入11位有效的手机号码'));
                } else {
                    callback();
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
                load2: false,
                load3: false,
                iconInfo: true,
                pageType: 0, //1--保存后跳转, 2--返回, 3--取消后跳转
                gridCol: [],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true
                },
                mystatus: false,
                selectedGridData: [],
                opType: '',
                coEid: 0,
                userRole: '',
                queryKey: '',
                partnerInfo: {
                    coEid: '',
                    ename: '',
                    areaId: '',
                    orgPro: false,
                    orgJoi: false,
                    contact: '',
                    contactMobile: '',
                    email: '',
                    adderss: '',
                    notes: ''
                },
                areaInfo: {},
                showOrgArea: false,
                rules: {
                    ename: [
                        {required: true, message: '请输入合作伙伴名称', trigger: 'blur'},
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    areaId: [
                        {required: true, message: '请选择所在地区', trigger: 'change', type: 'number'}
                    ],
                    contact: [
                        {required: true, message: '请输入联系人', trigger: 'blur', type: 'string'}
                    ],
                    contactMobile: [
                        { validator: teleValid, trigger: 'blur', required: true }
                    ],
                    adderss: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    email: [
                        { validator: emailValid, trigger: 'blur'}
                    ]
                }
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
                    {field: 'loginname', name: '登录账号', width: '120px'},
                    {field: 'lastlogin', name: '上次登录', width: '200px'},
                    {field: 'createtime', name: '创建时间', minWidth: '150px'},
                    {field: 'status', name: '状态', template: 'status',width: '100px'},
                    {field: 'operate', name: '操作', template: 'operate', isSort: false, fixed: 'right',align:'left',width: '120px'}
                ];

                if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
                    let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
                    console.log('this.catahData==>', this.$route);
                    this.partnerInfo = catahData;
                    this.opType = this.$route.query.opType;

                } else {
                    this.opType = this.$route.query.opType;
//            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                    if(this.opType === 'edit') {
                        this.coEid = this.$route.query.coEid;
                        this.getCoOrgDetail();
                        this.changePageType(2, '合作伙伴编辑');

                    } else if(this.opType === 'add') {
                        this.changePageType(1, '新增合作伙伴');
                        this.$set(this.partnerInfo, 'orgPro', false);
                        this.$set(this.partnerInfo, 'orgJoi', false);

                    }
                }

            })
        },
        beforeRouteLeave(to, from, next) {
            this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify(this.partnerInfo)), name: this.$route.path});
            next();
        },
        activated: function () {
            this.pageType = 0;
        },
        methods: {
            // 获取合作伙伴详情
            getCoOrgDetail() {
                this.load2 = true;
                getPartnerDetail(this.coEid).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.load2 = false;
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
                        this.getUserListInfo();
                        this.$set(this.partnerInfo, 'areaId', res.result.areaId);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 用户列表
            getUserListInfo() {
                let param = {
                    params: {
                        eid: this.coEid,
                        keyValue: '',
                        roleId: -1,
                        type: 'NO'
                    },
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getUserList(param).then((res) => {
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
//                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 新建用户
            doNewUser() {
                this.$router.push({path: '/basic/partnerUserEdit', query: {opType: 'add', coEid: this.coEid, coEName: this.partnerInfo.ename}});
            },
            // 禁用用户
            doForbidUser() {
                if(!this.selectedGridData.length > 0) {
                    this.$message({
                        message: '请选择用户！',
                        duration: 1500
                    });

                } else {
                    this.load2 = true;
                    let selectedUser = '';
                    this.selectedGridData.forEach((item, i) => {
                        if(item.status == 1) {
                            selectedUser = selectedUser === '' ?  item.userid : `${selectedUser},${item.userid}`;
                        }
                    });

                    let opt = {
                        eid: this.partnerInfo.coEid,
                        userIdList: selectedUser,
                        opType: 0
                    };
                    operateUser(opt).then(res => {
                        this.load2 = false;
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            this.getCoOrgDetail();
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load2 = false;
//                        this.$message(res.retMsg);
                    });
                }
            },
            // 禁用合作伙伴
            doForbidCoOrg() {
                this.partnerInfo.status = this.partnerInfo.status == 1 ? 0 : 1;
                /*let opt = {
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
                });*/
            },
            // 保存
            doSave() {
                this.$refs['partnerForm'].validate((valid) => {
                    console.log('this.partnerInfo==', this.partnerInfo);
                    let coType = true;
                    if (valid) {

                        let opt = {
                            eid: this.userInfo.loginEid,
                            eName: this.partnerInfo.ename,
                            coEid: this.partnerInfo.coEid,
                            // helpcode
                            // areaName
                            // parentId
                            areaId: this.partnerInfo.areaId,
                            adderss: this.partnerInfo.adderss,
                            contact: this.partnerInfo.contact,
                            contactMobile: this.partnerInfo.contactMobile.toString(),
                            signTime: this.partnerInfo.signTime || this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                            status: this.partnerInfo.status,
                            userList: [],
                            // contractNum
                            email: this.partnerInfo.email,
                            notes: this.partnerInfo.notes
                        }

                        if(this.partnerInfo.orgPro && this.partnerInfo.orgJoi) {
                            opt.orgType = 2;
                        } else if(this.partnerInfo.orgPro) {
                            opt.orgType = 1;
                        } else if(this.partnerInfo.orgJoi) {
                            opt.orgType = 0;
                        } else {
                            this.$message('请选择合作类型！');
                            coType = false;
                        }

                        if(this.opType === 'add' && coType) {
                            this.load2 = true;
                            addNewPartner(opt).then(res => {
                                this.load2 = false;
                                if(res.retCode === 'SUCCESS') {
                                    this.$message(res.retMsg);
                                    this.pageType = 1;
                                    this.$store.dispatch('delVisitedViews', this.$route.name);
                                    this.$router.push({path: '/basic/partnerDetail', query: {coEid: res.result.coEid}});
                                } else {
                                    this.$message(res.retMsg);
                                }
                            }).catch(err => {
                                this.load2 = false;
//                                this.$message(res.retMsg);
                            });
                        } else if(coType) {
                            this.load2 = true;
                            changePartner(opt).then(res => {
                                this.load2 = false;
                                if(res.retCode === 'SUCCESS') {
                                    this.$message(res.retMsg);
                                    this.pageType = 1;
                                    this.$store.dispatch('delVisitedViews', this.$route.name);
                                    this.$router.push({path: '/basic/partnerDetail', query: {coEid: this.partnerInfo.coEid}});
                                } else {
                                    this.$message(res.retMsg);
                                }
                            }).catch(err => {
                                this.load2 = false;
//                                this.$message(res.retMsg);
                            });
                        }
                    } else {
                        console.log('error submit!!', valid);
                        return false;
                    }
                });

            },
            // 取消
            doCancel() {
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(this.opType === 'edit') {
                        this.coEid = this.$route.query.coEid;
                        this.$refs['partnerForm'].resetFields();
                        this.getCoOrgDetail();

                    } else if(this.opType === 'add') {
                        this.$refs['partnerForm'].resetFields();
                        this.$set(this.partnerInfo, 'orgPro', false);
                        this.$set(this.partnerInfo, 'orgJoi', false);
                        this.partnerInfo.coEid = '';
                        this.partnerInfo.ename = '';
                        this.partnerInfo.areaId = '';
                        this.partnerInfo.contact = '';
                        this.partnerInfo.contactMobile = '';
                        this.partnerInfo.email = '';
                        this.partnerInfo.adderss = '';
                        this.partnerInfo.notes = '';
//                        this.$store.dispatch('delVisitedViews', this.$route.name);
                    }
                }).catch(() => {});
            },
            // 返回
            doBack() {
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                    this.$router.push({path: '/basic/coOrg'});

                }).catch(() => {});
            },
            doSelected (data) {
                console.log('data==', data);
                this.selectedGridData = data;
            },
            /*handleSizeChange (size) {
                console.log('size==', size)
            },
            handleCurrentChange (page) {
                console.log('page==', page)
            },*/
            // 跳转到用户详情
            changeToDetail (obj) {
                console.log(obj)
                this.$router.push({path: '/basic/partnerUserEdit', query: {opType: 'view', coEid: this.coEid, userId: obj.userid, coEName: this.partnerInfo.ename }});
            },
            // 表格中的单个用户禁用
            forbidden (obj) {
                console.log('obj==', obj)
                this.load3 = true;
                let opt = {
                    eid: this.coEid,
                    userIdList: obj.userid,
                    opType: obj.status == 1 ? 0 : 1
                };
                operateUser(opt).then(res => {
                    this.load3 = false;
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
//                    this.$message(res.retMsg);
                    this.load3 = false;
                });
            },
            // 地区选择
            getOrgArea(areaId) {
                console.log('areaId>>>', areaId)
                this.partnerInfo.areaId = parseInt(areaId);
            },
            // 去看看
            toProtocol(num) {
                if(num === 1) {
                    this.$router.push({path: '/business/property', query: {from: 'partner', coEid: this.coEid, coEName: this.partnerInfo.ename}});
                } else if(num === 2) {
                    this.$router.push({path: '/business/joining', query: {from: 'partner', coEid: this.coEid, coEName: this.partnerInfo.ename}});
                }
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
            },
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
.partnerEdit {
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
        margin-bottom: 10px;
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


    /*.longLabel {
        .el-form-item__label {
            width: 120px !important;
        }

        .el-form-item__content {
            margin-left: 120px !important;
        }
    }*/

}
</style>
