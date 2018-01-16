<template>
    <div class="orgIndex sl-page-container flex-col" v-loading.body="load1">
        <div class="slic-head-panel">
            <levelbar>
                <span slot="tip-content" class="icon-help-wrap pst-rl">
                    <icon-svg icon-class="wenhao-fill"></icon-svg>
                    <div class="icon-help-alert animated zoomIn">
                        <div class="icon-help-alert-til">
                            <span class="left">【基础管理-组织机构管理】</span>
                        </div>
                        <div class="icon-help-alert-tcon">
                            <p>1. 管理企业的组织机构。</p>
                        </div>
                    </div>
                </span>
            </levelbar>

            <div style="float: right;">
                <span class="sl-content-handle-left">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="addOrg()" :disabled="load2" v-if="myModulePower.add  && opType === 'view'">新增机构</el-button>
                        <el-button type="primary" size="small" @click="forbidOrg()" :disabled="load2" v-if="myModulePower.edit  && opType !== 'add'">{{currentOrg.status == 1 ? '禁用' : '启用'}}机构</el-button>
                        <el-button type="primary" size="small" @click="doEdit()" :disabled="load2" v-if="myModulePower.edit && opType === 'view'">编辑</el-button>
                        <el-button type="primary" size="small" @click="doSave()" :disabled="load2" v-if="myModulePower.edit  && opType !== 'view'">保存</el-button>
                        <el-button type="primary" size="small" @click="doCancel()" :disabled="load2" v-if="myModulePower.edit  && opType !== 'view'">取消</el-button>

                    </el-button-group>
                </span>

                <span class="sl-content-handle-right fr" style="margin-left: 15px;">
                    <el-button type="primary" size="small" @click="manageUser()" :disabled="load2" v-if="opType === 'view'">管理用户</el-button>
                </span>
            </div>

            <div class="sl-search-panel">
                <div class="slic-input-group  sl-search-item" style="width: 335px;">
                    <el-input size="small" v-model="queryKey" placeholder="请输入机构名称" :icon="queryKey ? 'circle-close' : ''" :on-icon-click="iconClose">
                        <template slot="prepend">机构名称</template>
                    </el-input>
                </div>
                <div class="slic-btn-group">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()">重置</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>

        <div class="slic-content">
            <div class="slic-content-tree">
                <sl-tree-list :treeData="orgList" :treeProps="orgTreeProps" :searchKey="treeSearchKey" :treeId="treeId"
                              @treeSelected="orgTreeSelected" :isShowThird="true"></sl-tree-list>
            </div>
            <div class="slic-content-info pl-xsmall" v-show="opType === 'edit'" v-loading="load2">
                <el-form :model="orgInfo" :rules="rules" ref="ruleForm" label-width="95px" class="sl-form-group" >
                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            机构信息
                            <sl-icon-info :is-information-opened.sync="orgEditIconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="orgEditIconInfo" >
                            <el-row :gutter="20" class="sl-form-row" >
                            <el-col :span="10">
                                <!--<label class="sl-form-label">机构类型：</label>-->
                                <el-form-item label="机构类型："  >
                                    <el-checkbox v-model="orgInfo.isShop" disabled>我是店铺</el-checkbox>
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="10">
                                <el-form-item label="机构名称：" prop="ename"  >
                                    <sl-input :input-val.sync="orgInfo.ename" :maxlength="16"></sl-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="10">
                                <el-form-item label="机构编码：">
                                    <el-input size="small"  v-model="orgInfo.eid" readonly class="noedit" ></el-input>
                                </el-form-item>
                            </el-col>


                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">


                            <el-col :span="10">

                                <el-form-item label="上级机构：" prop="parentid" v-show="!isTop">
                                    <sl-tree-select :slTreeData="orgTreeData" @selectedNode="selectOrgTree"
                                                    :isShowThird="false"
                                                    :isMult="false"
                                                    :defaultCheck="orgInfo.parentid + '/' + orgInfo.levelId"
                                                    :slTreeProps="orgTreeProps">
                                    </sl-tree-select>


                                </el-form-item>


                            </el-col>

                            <el-col :span="10">
                                <el-form-item label="所在层级：" >
                                    <el-input size="small"  v-model="orgInfo.levelName" readonly class="noedit" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        </span>


                    </div>




                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            联系信息
                            <sl-icon-info :is-information-opened.sync="orgEditIconInfo1"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="orgEditIconInfo1" >
                            <el-row :gutter="20" class="sl-form-row">

                            <el-col :span="10">

                                <el-form-item label="联系人：" prop="manager"  >
                                    <sl-input :input-val.sync="orgInfo.manager" :maxlength="12"></sl-input>
                                    <!--<el-input size="small" v-model="orgInfo.manager" :maxlength="24"></el-input>-->
                                </el-form-item>

                            </el-col>



                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="10">

                                <el-form-item label="手机：" prop="managermobile"  >
                                    <sl-input :input-val.sync="orgInfo.managermobile" :maxlength="11" :onlynum="true"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="10">
                                <el-form-item label="联系电话：" >
                                    <sl-input :input-val.sync="orgInfo.managertele" :maxlength="16" placeholder="请输入联系电话"></sl-input>
                                </el-form-item>

                            </el-col>
                        </el-row>


                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="10">
                                <el-form-item label="所在地区：" prop="areaid" >
                                    <sl-area-select :areaId="orgInfo.areaid" @getAreaId="getOrgArea"  ></sl-area-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="10">

                                <el-form-item label="地址：" prop="address" >
                                    <sl-input :input-val.sync="orgInfo.address" placeholder="无需输入地区信息" :maxlength="32"></sl-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4" style="line-height: 28px;" >
                                <sl-baidu-map :mapAddress="orgInfo.areaname + orgInfo.address" @mapSure="mapSure" v-if="opType === 'edit'"></sl-baidu-map>
                            </el-col>

                        </el-row>

                        <el-row class="sl-form-row">
                            <el-col :span="20">
                                <el-form-item label="备注：" >
                                    <el-input
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            placeholder="请输入备注"
                                            :maxlength="120"
                                            v-model="orgInfo.label">
                                    </el-input>
                                </el-form-item>
                            </el-col>


                        </el-row>
                        </span>


                    </div>





                </el-form>

            </div>


            <div class="slic-content-info pl-xsmall detailView" v-if="opType === 'view'" v-loading="load2">
                <el-form :model="orgInfo" ref="viewForm" label-width="95px" class="sl-form-group" >

                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            机构信息
                            <sl-icon-info :is-information-opened.sync="orgIconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="orgIconInfo" >
                            <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="10">
                                <!--<label class="sl-form-label">机构类型：</label>-->
                                <el-form-item label="机构类型："  class="el-form-item-detail">
                                    <el-checkbox v-model="orgInfo.isShop" disabled>我是店铺</el-checkbox>
                                </el-form-item>

                            </el-col>


                            </el-row>

                            <el-row :gutter="20" class="sl-form-row">
                                <el-col :span="10">
                                    <el-form-item label="机构名称：" prop="ename"  class="el-form-item-detail" :title=orgInfo.ename>
                                        <span >{{orgInfo.ename}}</span>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="10">
                                    <el-form-item label="机构编码："  class="el-form-item-detail" :title=orgInfo.eid>
                                        <span >{{orgInfo.eid}}</span>
                                    </el-form-item>
                                </el-col>


                            </el-row>

                            <el-row :gutter="20" class="sl-form-row">

                                <el-col :span="10">

                                    <el-form-item label="上级机构：" prop="parentid"  class="el-form-item-detail" v-show="!isTop"  :title=orgInfo.parentName>

                                        <span >{{orgInfo.parentName}}</span>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="10">
                                    <el-form-item label="所在层级："  class="el-form-item-detail"  :title=orgInfo.levelName>
                                        <span >{{orgInfo.levelName}}</span>
                                    </el-form-item>
                                </el-col>


                            </el-row>
                        </span>


                    </div>



                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            联系信息
                            <sl-icon-info :is-information-opened.sync="orgIconInfo1"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="orgIconInfo1">
                            <el-row :gutter="20" class="sl-form-row" >
                            <!--<el-col :span="8">
                                <el-form-item label="所在地区：" prop="areaid">
                                    <sl-area-select :areaId="orgInfo.areaid" @getAreaId="getOrgArea"></sl-area-select>
                                </el-form-item>
                            </el-col>-->

                            <el-col :span="10">

                                <el-form-item label="联系人：" prop="manager"  class="el-form-item-detail" :title=orgInfo.manager>
                                    <span >{{orgInfo.manager}}</span>
                                </el-form-item>

                            </el-col>



                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="10">

                                <el-form-item label="手机：" prop="managermobile"  class="el-form-item-detail" :title=orgInfo.managermobile>
                                    <span >{{orgInfo.managermobile}}</span>
                                </el-form-item>

                            </el-col>

                            <el-col :span="10">
                                <el-form-item label="联系电话："  class="el-form-item-detail" :title=orgInfo.managertele>
                                    <span>{{orgInfo.managertele}}</span>
                                </el-form-item>

                            </el-col>
                        </el-row>


                        <el-row :gutter="20" class="sl-form-row">
                            <el-col :span="10">
                                <el-form-item label="所在地区：" prop="areaid"  class="el-form-item-detail" :title=orgInfo.areaname>
                                    <span >{{orgInfo.areaname}}</span>
                                </el-form-item>
                            </el-col>

                            <el-col :span="10">

                                <el-form-item label="地址：" prop="address"  class="el-form-item-detail" :title=orgInfo.address>
                                    <span >{{orgInfo.address}}</span>
                                </el-form-item>
                            </el-col>

                            <!--<el-col :span="4" style="line-height: 36px;"  class="el-form-item-detail">
                                <sl-baidu-map :mapAddress="orgInfo.areaname + orgInfo.address" @mapSure="mapSure" v-if="opType === 'edit'"></sl-baidu-map>
                            </el-col>-->

                        </el-row>

                        <el-row class="sl-form-row">
                            <el-col :span="20">
                                <el-form-item label="备注："  class="el-form-item-detail" :title=orgInfo.label>
                                    <span >{{orgInfo.label}}</span>
                                </el-form-item>
                            </el-col>


                        </el-row>
                        </span>

                    </div>

                </el-form>

            </div>


            <div class="slic-content-info pl-xsmall" v-show="opType === 'add'">

                <el-form :model="newOrgInfo" :rules="rules" ref="newForm" label-width="95px" class="sl-form-group" >
                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            机构信息
                            <sl-icon-info :is-information-opened.sync="orgNewIconInfo"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="orgNewIconInfo">
                            <el-row :gutter="20" class="sl-form-row" >
                            <el-col :span="10">
                                <!--<label class="sl-form-label">机构类型：</label>-->
                                <el-form-item label="机构类型：">
                                    <el-checkbox v-model="newOrgInfo.isShop" >我是店铺</el-checkbox>
                                </el-form-item>

                            </el-col>

                            <el-col :span="14">
                                <el-form-item  class="nolabel">
                                    提示：不可修改，一旦设置为店铺，则不能修改为非店铺
                                </el-form-item>

                            </el-col>
                        </el-row>


                        <el-row :gutter="20" class="sl-form-row" >
                            <el-col :span="10">

                                <el-form-item label="机构名称：" prop="ename">
                                    <sl-input :input-val.sync="newOrgInfo.ename" :maxlength="24" placeholder="请输入机构名称"></sl-input>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row" >

                            <el-col :span="10">
                                <el-form-item label="上级机构：" prop="parentid">
                                    <sl-tree-select :slTreeData="orgTreeData" @selectedNode="selectOrgTreeNew"
                                                    :isShowThird="false"
                                                    v-if="opType === 'add'"
                                                    :defaultCheck="newOrgInfo.parentid"
                                                    :slTreeProps="orgTreeProps"></sl-tree-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="10">

                                <el-form-item label="所在层级：" >
                                    <el-input size="small" class="noedit"
                                              v-model="newOrgInfo.levelName" readonly></el-input>
                                </el-form-item>
                            </el-col>


                        </el-row>
                        </span>


                    </div>

                    <div class="sl-row-group">
                        <div class="sl-row-group-title">
                            联系信息
                            <sl-icon-info :is-information-opened.sync="orgNewIconInfo1"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="orgNewIconInfo1">
                            <el-row :gutter="20" class="sl-form-row">


                            <el-col :span="10">

                                <el-form-item label="联系人：" prop="manager">
                                    <sl-input :input-val.sync="newOrgInfo.manager" :maxlength="12" placeholder="请输入联系人名称"></sl-input>
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">

                            <el-col :span="10">

                                <el-form-item label="手机：" prop="managermobile">
                                    <sl-input :input-val.sync="newOrgInfo.managermobile" :maxlength="11" placeholder="请输入手机" :onlynum="true"></sl-input>
                                </el-form-item>

                            </el-col>

                            <el-col :span="10">

                                <el-form-item label="联系电话：" >
                                    <sl-input :input-val.sync="newOrgInfo.managertele" :maxlength="16" placeholder="请输入联系电话"></sl-input>
                                </el-form-item>

                            </el-col>

                        </el-row>

                        <el-row :gutter="20" class="sl-form-row">

                            <el-col :span="10">

                                <el-form-item label="所在地区：" prop="areaid">
                                    <sl-area-select :areaId="newOrgInfo.areaid" @getAreaId="getOrgAreaNew" :showModal="false" v-if="opType === 'add'"></sl-area-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="10">

                                <el-form-item label="地址：" prop="address">
                                    <sl-input :input-val.sync="newOrgInfo.address" placeholder="无需输入地区信息" :maxlength="32"></sl-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="4" style="line-height: 28px;">
                                <sl-baidu-map :mapAddress="newOrgInfo.areaname + newOrgInfo.address" @mapSure="mapSureNew" :isShowModal="false"></sl-baidu-map>
                            </el-col>

                        </el-row>

                        <el-row class="sl-form-row">
                            <el-col :span="20">
                                <el-form-item label="备注：">
                                    <el-input
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            placeholder="请输入内容"
                                            :maxlength="32"
                                            v-model="newOrgInfo.label">
                                    </el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        </span>


                    </div>

                </el-form>

                <!--<span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addNewOrg()" size="small">确定</el-button>
                    <el-button @click="showAddOrg = false" class="dialog-cancel" size="small">取消</el-button>
                </span>-->
            </div>


        </div>




    </div>
</template>

<script>
    import SlTreeSelect from '@/components/sl-tree-select.vue'
    import SlBaiduMap from '@/components/sl-baiduMap';
    import SlTreeList from '@/components/sl-tree-list'
    import SlAreaSelect from '@/components/sl-areaSelect/sl-areaSelect.vue';
    import SlInput from '@/components/sl-input.vue';
//    import SlIconInfo from '@/components/sl-icon-info.vue';
    import Levelbar from '@/views/layout/Levelbar.vue';
    import {mapGetters} from 'vuex';

    import {getOrgList, getOrgDetail, changeOrg, operateOrg, addOrg} from '@/api/basic/org';
    export default {
        components: {
            SlTreeList, SlInput,
            SlTreeSelect, SlAreaSelect,
            SlBaiduMap, Levelbar,
        },
        name: 'orgMan',
        data () {
            let teleValid = (rule, value, callback) => {
                if (!value) {
                    callback();
                } else if (!(/^[0-9]{11}$/).test(value)) {
                    callback(new Error('请输入11位有效的手机号码'));
                } else {
                    callback();
                }
                /*setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value.toString().length >= 12 ) {
                            callback(new Error('请输入11位有效的数字值'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);*/
            };
            return {
                load1: false,
                load2: false,
                orgIconInfo: true,
                orgIconInfo1: true,
                orgNewIconInfo: true,
                orgNewIconInfo1: true,
                orgEditIconInfo: true,
                orgEditIconInfo1: true,
                isChange: false,
                opType: 'view',
                dosave: false,
                orgList: [],
                treeSearchKey: '',
                queryKey: '', // 机构搜索输入框关键词
                treeId:'',//treeId
                showOrgArea: false,
                showAddOrg: false,
                orgInfo: {},
                isTop: false,
                newOrgInfo: {
                    address: '',
                    areaname: '',
                    ename: '',
                    levelName: '',
                    areaid: '',
                    parentid: '',
                    manager: '',
                    managermobile: '',
                    managertele: '',
                    label: '',
                    isShop: false,
                    profiles: ''
                },
                currentOrg: {},
                orgTreeData: [],
                orgTreeProps: {
                    label: 'ename',
                    selected: 'eid'
                },
                rules: {
                    ename: [
                        {required: true, message: '请输入机构名称', trigger: 'blur'},
                        { max: 24, message: '名称最大长度为 24 个字符', trigger: 'blur'}
                    ],
                    parentid: [
                        {required: true, message: '请选择上级机构', type: 'number'}
                    ],
                    areaid: [
                        {required: true, message: '请选择所在地区', trigger: 'change'}
                    ],
                    manager: [
                        {required: true, message: '请输入联系人', trigger: 'blur', type: 'string'},
                        { max: 12, message: '名称最大长度为 12 个字符', trigger: 'blur'}
                    ],
                    managermobile: [
                        { validator: teleValid, trigger: 'blur' }
                    ],
                    address: [
                        {required: true, message: '请输入地址', trigger: 'change'},
                        { max: 32, message: '名称最大长度为 32 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                // 获取组织机构列表
                this.getOrg();
                console.log(this.user_power);
                console.log(this.$route, this.$router, this.$store.state.tabs);
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
                return modulePower;
            },
            informationIconClass: function () {
                return this.isInformationOpened ? 'information_up' : 'information_down';
            }
        },
        activated: function () {
            const _this = this;

            console.log('1324567987',_this.myModulePower);
        },

        methods: {
            // 获取组织机构列表
            getOrg() {
                getOrgList().then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        this.orgList = JSON.parse(JSON.stringify(res.result));
                        this.orgTreeData = JSON.parse(JSON.stringify(res.result));
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {

                })
            },
            // 获取组织机构详情信息
            getOrgInfo(orgid) {
                this.load2 = true;
                getOrgDetail(orgid).then(res => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.orgInfo = JSON.parse(JSON.stringify(res.result));
//                        this.orgInfo.managermobile = this.orgInfo.managermobile;
                        this.orgInfo.isShop = this.orgInfo.orgtype === 1;
                        this.orgInfo.areaid = this.orgInfo.areaid.toString();
                        this.currentOrg = JSON.parse(JSON.stringify(res.result));
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
                    console.log(err);
                });
            },
            // 查询机构
            doSearch () {
                console.log('queryKey==', this.queryKey)
                this.treeSearchKey = this.queryKey;
            },
            // 重置搜索框
            doReset () {
                this.queryKey = '';
                this.treeSearchKey = '';
            },
            // 保存
            doSave() {
                if(this.opType === 'add') {
                    this.addNewOrg();
                } else if(this.opType === 'edit') {

                    this.$refs['ruleForm'].validate((valid) => {
                        console.log(valid)
                        if (valid) {
                            console.log('valid==', valid)
//                        this.isChange = false;
                            this.load1 = true;
                            console.log(this.orgInfo)
                            changeOrg(this.orgInfo).then((res) => {
                                this.load1 = false;
                                if(res.retCode === 'SUCCESS') {
                                    this.$message(res.retMsg);
                                    this.opType = 'view';
                                    this.getOrgInfo(this.orgInfo.eid)
                                    this.getOrg();
                                    this.isChange = false;
                                    this.treeId = res.result;
                                    console.log('this.newOrgInfo==', this.newOrgInfo);
                                } else {
                                    this.$message(res.retMsg);
                                }
                            }).catch((err) => {
                                this.load1 = false;
//                            this.$message(res.retMsg);
                            })
                        } else {

                            console.log('error submit!!', valid);
                            return false;
                        }
                    });
                }
            },
            // 取消
            doCancel () {
                console.log(this.orgInfo);
                this.$confirm('是否取消编辑?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    console.log(this.opType, this.isChange)
                    if(this.opType === 'add') {

                        this.$refs['newForm'].resetFields();
                        this.newOrgInfo.levelName = '';

                        this.newOrgInfo.eid = this.currentOrg.eid;
                        this.opType = 'view';
                        this.isChange = false;

                    } else if(this.opType === 'edit') {
                        console.log(this.currentOrg.eid)
                        this.$refs['ruleForm'].resetFields();
                        this.getOrgInfo(this.currentOrg.eid);
                        this.opType = 'view';
                        this.isChange = false;

                        console.log(this.opType, this.isChange)
                    }


                }).catch(() => {
                });
            },
            // 编辑
            doEdit() {
                this.opType = 'edit';
                this.isChange = true;
                this.getOrgInfo(this.currentOrg.eid);
            },
            // 新增机构
            addOrg () {

                this.showAddOrg = true;
                this.opType = 'add';
                this.isChange = true;


                setTimeout(() => {
                    this.$refs['newForm'].resetFields();
                    this.newOrgInfo.address = '';
                    this.newOrgInfo.areaname = '';
                    this.newOrgInfo.ename = '';
                    this.newOrgInfo.levelName = '';
                    this.newOrgInfo.areaid = '';
                    this.newOrgInfo.label = '';
                    this.$set(this.newOrgInfo, 'label', '');
//                    console.log('132154684654564555', this.currentOrg);

                    this.newOrgInfo.parentid = 0;
                    setTimeout(() => {
                        this.newOrgInfo.parentid = this.currentOrg.levelId === 2 ? this.currentOrg.parentid : this.currentOrg.eid;
                    }, 200)

                    this.newOrgInfo.manager = '';
                    this.newOrgInfo.managermobile = '';
                    this.newOrgInfo.managertele = '';
                    this.newOrgInfo.label = '';
                    this.newOrgInfo.isShop = false;


                    this.newOrgInfo.eid = this.currentOrg.eid;
                    console.log('this.newOrgInfo==', this.newOrgInfo)
                }, 50)

//                this.newOrgInfo.areaid

            },
            // 禁用机构
            forbidOrg () {
                if(this.currentOrg.status == 1) {
                    this.$confirm('是否禁用该机构?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        let opt = {
                            eid: this.currentOrg.eid,
                            opType: this.currentOrg.status == 1 ? 0 : 1
                        }
                        operateOrg(opt).then((res) => {
                            if(res.retCode === 'SUCCESS') {
                                this.$message(res.retMsg);
                                this.getOrgInfo(this.currentOrg.eid);
                                this.getOrg();
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch((err) => {
//                    this.$message(res.retMsg, 2000);
                        })
                    })
                } else {
                    let opt = {
                        eid: this.currentOrg.eid,
                        opType: this.currentOrg.status == 1 ? 0 : 1
                    }
                    operateOrg(opt).then((res) => {
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            this.getOrgInfo(this.currentOrg.eid);
                            this.getOrg();
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
//                    this.$message(res.retMsg, 2000);
                    })
                }


            },
            // 管理用户
            manageUser () {
                let nopower = true;
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === 12) {
                        this.$router.push({path: '/basic/user'});
                        nopower = false;
                    }
                });
                if(nopower) {
                    this.$message('您没有用户管理浏览权限！');
                }
            },
            // 机构树选中事件
            orgTreeSelected(obj) {
                if(this.isChange) {
                    this.$confirm('是否取消编辑?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        this.isTop = obj.eid === 10000000;
                        if(this.opType === 'add') {
                            this.$refs['newForm'].resetFields();
                        } else if(this.opType === 'edit') {
                            this.$refs['ruleForm'].resetFields();
                        }

                        this.opType = 'view';
                        this.getOrgInfo(obj.eid);
                        this.isChange = false;

                        console.log(this.opType, this.isChange)
                    }).catch(() => {});
                } else {
                    this.isTop = obj.eid === 10000000;
                    this.opType = 'view';
                    this.getOrgInfo(obj.eid);

                }


            },
            // 等级树选中事件
            selectOrgTree (data) {
                /*if(this.orgInfo.parentid !== data.eid){
                    this.isChange = true;
                }*/
                console.log('data>>', data);
                this.$set(this.orgInfo, 'parentid', data.eid);
//                this.orgInfo.parentid = data.eid;
                this.orgInfo.parentName = data.ename;
                this.orgInfo.levelId = data.levelId + 1;
                this.orgInfo.levelName = this.orgInfo.levelId === 0 ? '总部' : (this.orgInfo.levelId === 1 ? '区域中心' : '店铺');
//                this.isChange = true;
            },
            selectOrgTreeNew (data) {
                console.log('data>>', data);
                this.newOrgInfo.parentName = data.ename;
                this.newOrgInfo.parentid = data.eid;
                this.newOrgInfo.levelId = data.levelId + 1;
                let newLevelName = (data.levelId + 1) === 0 ? '总部' : ((data.levelId + 1) === 1 ? '区域中心' : '店铺');
                this.$set(this.newOrgInfo, 'levelName', newLevelName);
            },
            // 选择地区
            getOrgArea (areaId, areaName) {
                console.log(areaId, areaName);
                /*if(this.orgInfo.areaid !== areaId){
                    this.isChange = true;
                }*/
                this.orgInfo.areaid = areaId;
                this.orgInfo.areaname = areaName;
//                this.isChange = true;
                this.$refs['ruleForm'].validate();
//                this.$refs.
            },
            getOrgAreaNew (areaId, areaName) {

                this.newOrgInfo.areaid = areaId;
                this.newOrgInfo.areaname = areaName;
                console.log(areaId, areaName);
                this.$refs['newForm'].validate();
            },
            // 地图确定
            mapSure (ads) {
                this.orgInfo.address = ads.address;
//                this.orgInfo.areaid = ads.areaId;
                console.log('ads==', ads);
//                this.isChange = true;
                this.$refs['ruleForm'].validate();
            },
            mapSureNew (ads) {
                this.newOrgInfo.address = ads.address;
//                this.newOrgInfo.areaid = ads.areaId;
                console.log('ads==', ads);
                this.$refs['newForm'].validate();
            },
            // 确认添加新机构
            addNewOrg() {
                this.$refs['newForm'].validate((valid) => {

                    if (valid) {
                        this.load1 = true;
                        this.newOrgInfo.orgtype = this.newOrgInfo.isShop ? 1 : 0;
                        console.log(this.newOrgInfo)
                        addOrg(this.newOrgInfo).then((res) => {
                            this.load1 = false;
                            if(res.retCode === 'SUCCESS') {
                                this.$message(res.retMsg);
                                this.getOrg();
//                                this.showAddOrg = false;
                                this.opType = 'view';
                                this.isChange = false;
                                this.treeId = res.result;
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch((err) => {
                            this.load1 = false;
//                            this.$message(res.retMsg);
                        })
                    } else {
                        console.log('error submit!!', valid);
                        return false;
                    }
                });
            },
            iconClose(event) {
                console.log(event)

                this.queryKey = '';
            }
        },
        watch: {
            opType(val) {
                if(val === 'add') {
                    this.$router.push({path: '/basic/org', query: {opType: 'add'}});
                } else if(val === 'edit') {
                    this.$router.push({path: '/basic/org', query: {opType: 'edit'}});
                } else {
                    this.$router.push({path: '/basic/org'});
                }
            }

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .orgIndex {
        .nolabel {
            .el-form-item__content {
                margin-left: 20px !important;
            }
        }

        /*.sl-row-group {
            padding-bottom: 0 !important;
        }*/
       
       .detailView {
		       	.el-form-item__content{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
       }
       
       .el-checkbox__label {
	    font-size: 12px;
		}
		.el-button, .el-textarea__inner {
		    font-size: 12px;
		}
	

    }
    
    .wenhao-fill {
    	&:hover {
    		color: #28e;
    	}
    }
	
</style>