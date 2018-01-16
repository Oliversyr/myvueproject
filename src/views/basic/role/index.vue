<template>
    <div class="sl-page-container flex-col roleIndex" v-loading="load1">
        <levelbar>
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【基础管理-角色及权限管理】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>1. 管理本机构内的角色；</p>
                        <p>2. 新建、编辑角色；</p>
                        <p>3. 为角色分配权限；</p>
                        <p>3. 将用户加入到角色。</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <div class="slic-content">
            <div class="slic-content-left">
                <el-row class="slic-content-left-search">
                    <el-col :span="16" >
                        <el-input size="small" v-model="queryrole" placeholder="请输入角色名称">
                            <template slot="prepend">角色</template>
                        </el-input>
                    </el-col>
                    <el-col :span="8" style="text-align: right;">
                        <el-button type="primary" size="small" @click="searchRole()" >查询</el-button>
                    </el-col>
                </el-row>

                <div class="slic-content-tree" style="overflow: hidden;">
                    <div class="slic-content-tree-title">
                        <span class="tx-overflow" style="width: 140px; vertical-align: middle;" :title="userInfo.ename">{{userInfo.ename}}</span>
                        <el-button type="primary" size="small" @click="doAddNewRole()" v-if="myModulePower.add">新建角色</el-button>
                    </div>

                    <el-dialog title="新建角色" size="tiny" :visible.sync="showNewRole" :close-on-click-modal="false" >
                        <div class="sl-form">
                            <el-row :gutter="20" class="sl-form-row mb-xsmall">
                                <el-col :span="24" >
                                    <label class="sl-form-label"><i style="color: red;">*</i>角色名称：</label>
                                    <span class="sl-form-input">
                                        <sl-input :input-val.sync="newUser.roleName" :maxlength="16" :nocharacter="true"></sl-input>
                                    </span>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" class="sl-form-row mb-xsmall">
                                <el-col :span="24" >
                                    <label class="sl-form-label" style="vertical-align: top;">备注：</label>

                                    <el-input class="sl-form-input" :maxlength="32"
                                              type="textarea" v-model="newUser.notes"></el-input>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" class="sl-form-row">
                                <el-col :span="24" style="padding-left: 105px;">
                                    <el-checkbox v-model="newUser.updateLow">同步到所有下级机构</el-checkbox>
                                </el-col>
                            </el-row>
                        </div>


                        <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addNewRole()" size="small">确 定</el-button>
                        <el-button @click="showNewRole = false" class="dialog-cancel" size="small">取 消</el-button>
                    </span>

                    </el-dialog>

                    <ul class="slic-list-ul" >
                        <li class="slic-list-title">
                            <span class="slic-list-label-title">角色</span>
                            <span class="slic-list-btn-title">操作</span>
                        </li>
                    </ul>    
                    <ul class="slic-list-ul2 overflow-y" >    
                        <li v-for="(item, i) in rolelist" :key="item.roleId" v-init-click="i" class="slic-list" :class="{'active': item.active}" @click="roleSelect(item)" v-if="item.isShow">
                            <span v-if="item.isEdit" class="slic-list-label">
                                <input class="el-input__inner" v-model="item.roleName" @blur="doChangeRole(item)"  v-focus maxlength="16" @keydown="roleChange($event, item)"/>
                            </span>
                            <span class="slic-list-label tx-overflow" :title="item.roleName" v-else>{{item.roleName}}</span>
                            <span class="slic-list-right" v-if="myModulePower.delete">
                                <span class="slic-list-btn" @click.stop="doDeleteRole(item)" v-if="myModulePower.delete">删除</span>
                                <span class="slic-list-btn" style="cursor: default;" v-if="myModulePower.edit">|</span>
                                <span class="slic-list-btn" @click.stop="item.isEdit = true" v-if="myModulePower.edit">修改</span>
                                <span class="slic-list-btn more-operate" style="color: #999;" v-if="myModulePower.edit">
                                    <i class="el-icon-more"></i>
                                    <ul class="more-operate-container">
                                        <li class="more-operate-list" @click.stop="doCopyRole(item)" >复制</li>
                                    </ul>
                                </span>
                            </span>
                            <span class="slic-list-right" v-else>
                                <span class="slic-list-btn" @click.stop="item.isEdit = true" v-if="myModulePower.edit">修改</span>
                                <span class="slic-list-btn" style="cursor: default;" v-if="myModulePower.edit">|</span>
                                <span class="slic-list-btn" @click.stop="doCopyRole(item)" v-if="myModulePower.edit">复制</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="slic-content-info">
                <div style="margin-bottom: 10px;">
                    <div class="slic-content-info-tab">
                        <el-radio-group v-model="powerOrUser" @change="powerOrUserTab">
                            <el-radio-button label="角色用户" name="0"></el-radio-button>
                            <el-radio-button label="角色权限" name="1"></el-radio-button>
                        </el-radio-group>
                    </div>
                </div>

                <transition name="el-fade-in-linear">
                    <div v-if="powerOrUser == '角色用户'" class="slic-content-info-container" >

                        <div class="sl-content-handle" style="text-align: left">
                            <span class="sl-content-handle-left">
                                <sl-input placeholder="请输入用户姓名或手机" :input-val.sync="searchUser" style="width: 300px;" prepend="用户名称" :maxlength="12"></sl-input>
                                <el-button-group style="margin-left: 10px; margin-top: -1px;">
                                    <el-button type="primary" size="small" @click="doUserSearch()">查询</el-button>
                                    <el-button type="primary" size="small" @click="doUserReset()">重置</el-button>
                                </el-button-group>
                            </span>

                            <span class="sl-content-handle-right fr">
                                <el-button-group>
                                    <el-button type="primary" size="small" @click="addUser()" v-if="myModulePower.edit">添加用户</el-button>
                                    <el-button type="primary" size="small" @click="removeUser()" v-if="myModulePower.edit">移除用户</el-button>
                                </el-button-group>
                            </span>

                            <el-dialog title="添加用户"  :visible.sync="showAddUser" size="small" class="dialog-grid">
                                <div style="margin-bottom: 10px;">
                                    <span style="width: 95px;margin-right: 10px;">用户名称: </span>
                                    <sl-input placeholder="请输入用户名称" :input-val.sync="addSearchUser" style="width: 250px;"></sl-input>

                                    <el-button type="primary" @click="getUserListInfo()" size="small">查询</el-button>
                                </div>

                                <div style="height: calc(100% - 30px);">
                                    <sl-grid :gridCol="gridColNewUser" :gridValue="gridValNewUser" :gridConfig="gridCfgNewUser"
                                             @rowSelected="doSelectedNewUser" @pageSizeChange="handleSizeChangeNewUser" @currentPageChange="handleCurrentChangeNewUser">
                                    </sl-grid>
                                </div>

                                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="addNewUser()" size="small">确定</el-button>
                                    <el-button @click="showAddUser = false" class="dialog-cancel" size="small">取消</el-button>
                                </span>
                            </el-dialog>


                        </div>

                        <div style="flex: 1;height: calc(100% - 50px);" class="slic-content-info-grid-container">

                            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg" v-loading="load2"
                                     @rowSelected="doSelected" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
                                <template slot="operate" scope="prop">
                                    <el-button @click="removeSingleUser(prop.scope)" type="text" size="small" v-if="myModulePower.edit">移除</el-button>
                                    <el-button type="text" size="small" @click="changeToDetail(prop.scope.row)" v-if="myUserModulePower.look">详情</el-button>
                                </template>

                                <template slot="status" scope="prop">
                                    <span>{{prop.scope.row.status === 1 ? '启用' : '禁用'}}</span>
                                </template>
                            </sl-grid>
                        </div>

                    </div>
                </transition>

                <transition name="el-fade-in-linear" v-loading="load3">
                    <div v-if="powerOrUser == '角色权限'" style="height: calc(100% - 36px);">
                        <div class="sl-content-handle" style="text-align: left">
                            <span class="sl-content-handle-left">
                                <!--<el-input placeholder="请输入功能模块名称" icon="search" v-model="searchModel" size="small" style="width: 300px;" :icon="searchModel ? 'circle-close' : ''" :on-icon-click="iconCloseModel">
                                    <template slot="prepend">功能模块</template>
                                </el-input>-->

                                <!--<el-autocomplete
                                        :props="{label: 'modulename', value: 'modulename'}"
                                        v-model="searchModel"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入功能模块名称"
                                        @select="handleSelect"
                                        size="small"
                                        style="width:220px"
                                >
                                    <template slot="prepend">
                                        功能模块
                                    </template>
                                </el-autocomplete>-->

                                <sl-input :input-val.sync="searchModel" placeholder="请输入功能模块名称" :nocharacter="true" prepend="功能模块" style="width:220px"></sl-input>

                                <el-button-group style="margin-left: 10px; margin-top: -1px;">
                                    <el-button type="primary" size="small" @click="doModuleSearch()">查询</el-button>
                                    <el-button type="primary" size="small" @click="doModuleReset()">重置</el-button>
                                </el-button-group>
                            </span>

                            <span class="sl-content-handle-right fr">
                                <el-checkbox v-model="updateLow" style="margin-right: 10px;">同步本次修改到所有下级机构</el-checkbox>
                                <el-button-group>
                                    <el-button type="primary" size="small" @click="doSavePower()" v-if="myModulePower.edit">保存</el-button>
                                    <el-button type="primary" size="small" @click="doCancelPower()" v-if="myModulePower.edit">取消</el-button>
                                </el-button-group>
                            </span>
                        </div>

                        <div class="sl-content-cards" v-loading="load2">
                            <el-row style="padding: 0 10px;">
                                <el-col :span="20">
                                    <el-tabs v-model="activeModel" @tab-click="handlePowerTab(activeModel)">
                                        <!--<el-tab-pane label="全部" name="all"></el-tab-pane>-->

                                        <el-tab-pane v-for="(model, key) in fatherModules" :key="key" :label="model.modulename" :name="'$' + key"></el-tab-pane>

                                    </el-tabs>
                                </el-col>
                                <el-col :span="4" style="height: 56px;line-height: 56px;text-align: center;">
                                    <el-checkbox :indeterminate="isIndeterminateAll" v-model="selectAll" @change="selectAllPower()" class="all-check-label">全选</el-checkbox>
                                </el-col>
                            </el-row>

                            <div style="height: calc(100% - 56px); overflow-x: hidden; overflow-y: auto;">
                                <el-row :gutter="20" style="padding: 0 10px;">
                                    <el-col :span="6" v-for="(power, key) in powerList" style="margin-bottom: 20px;"  :key="key">
                                        <div class="slic-panel">
                                            <div class="panel-header">
                                                <el-checkbox @change="selectThisAll(power)" v-model="power.allVal" :indeterminate="power.isIndeterminate">{{power.modulename}}</el-checkbox>
                                            </div>
                                            <div class="panel-body">
                                                <el-row>
                                                    <el-checkbox-group v-model="power.selPower" @change="powerSelected(power)">
                                                        <el-col :span="8" v-for="(pl, key) in power.dpower" :key="key">
                                                            <el-checkbox :label="pl.value" >{{pl.name}}</el-checkbox>
                                                        </el-col>
                                                    </el-checkbox-group>

                                                </el-row>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>


                    </div>
                </transition>

            </div>
        </div>




    </div>


</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue';
    import SlInput from '@/components/sl-input.vue';
    import {mapGetters} from 'vuex';
    import {getUserList} from '@/api/basic/user';
    import {getRoleList, addNewRole, deleteRole, changeRole, copyRole, operateRoleUser, getPowerModule, savePowerModule, getPowerModuleList} from '@/api/basic/role';
    import ElInput from '../../../../node_modules/element-ui/packages/input/src/input'
    import ElButton from '../../../../node_modules/element-ui/packages/button/src/button';

    export default {
        components: {
            ElButton,
            ElInput,
            Levelbar,
            SlGrid,
            SlInput
        },
        name: 'powerman',
        data () {
            return {
                load1: false,
                load2: false,
                load3: false,
                queryrole: '',
                userRole: '',
                rolelist: [],
                currentRole: {},
                powerOrUser: '角色用户',
                searchUser: '',
                addSearchUser: '',
                searchModel: '',
                updateLow: false,
                activeModel: '',
                selectAll: false,
                isIndeterminateAll:true,
                powerList: [],
                allPowerList: [],
                fatherModules: [],
                showNewRole: false,
                showAddUser: false,
                newUser: {roleName: '', notes: '', updateLow: false},
                gridCol: [],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true
                },
                selectedGridData: [],
                gridColNewUser: [],
                gridValNewUser: {rows: [], footer: {}},
                gridCfgNewUser: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: undefined
                },
                selectedGridDataNewUser: []

            }
        },
        mounted: function () {
            this.$nextTick(function () {
//                sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));
                const _this = this;
                this.gridCol = [
                    {field: 'realname', name: '用户姓名', width: '120px', fixed: true},
                    {field: 'mobilephone', name: '用户手机', width: '150px',  },
                    {field: 'loginname', name: '登录账号', width: '150px'},
                    {field: 'lastloginStr', name: '上次登录', width: '200px'},
                    {field: 'createtimeStr', name: '创建时间',minWidth: '200px'},
                    {field: 'status', name: '状态',  template: 'status', width: '100px'},
                    {field: 'operate', name: '操作', width: '100px', fixed: 'right', template: 'operate'},
                    // {field: 'operate', header: '操作', isf: 'false'},
                ];

                this.gridColNewUser = [
                    {field: 'realname', name: '用户姓名', width: '100px'},
                    {field: 'mobilephone', name: '用户手机', width: '150px'  },
                    {field: 'loginname', name: '登录账号', width: '100px'},
                    {field: 'lastloginStr', name: '上次登录', width: '200px'},
                    {field: 'createtimeStr', name: '创建时间', minWidth: '200px'},
                    {field: 'ostatus', name: '状态', width: '100px'}
                ];

                this.activeModel = '$0';
                console.log(0, this.userInfo)

                // 获取角色列表
                this.getMyRole();

            })
        },
        activated: function() {
            // 获取角色列表
//            this.getMyRole();
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
            // 获取角色列表
            getMyRole(roleId) {
                const _this = this;
                getRoleList().then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.rolelist = res.result;
                        this.rolelist.forEach((item, i) => {

                            if((!roleId || roleId === 'first') && i === 0 ) {
                                _this.$set(item, 'active', true);
                                _this.roleSelect(item);
                            } else if(roleId === 'last' && (i === this.rolelist.length - 1)) {
                                _this.$set(item, 'active', true);
                                _this.roleSelect(item);
                            } else if(roleId === item.roleId) {
                                _this.$set(item, 'active', true);
                                _this.roleSelect(item);
                            } else {
                                _this.$set(item, 'active', false);
                            }

                            _this.$set(item, 'isShow', true);
                            _this.$set(item, 'isEdit', false);
                            _this.$set(item, 'myrolename', JSON.parse(JSON.stringify(item.roleName)));
                        })
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });
            },
            // 角色用户列表
            getRoleUser(role) {
                console.info(role,'===========get')
                this.load2 = true;
                let param = {
                    params: {
                        eid: this.userInfo.loginEid,
                        keyValue: this.searchUser,
                        roleId: role.roleId
                    },
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getUserList(param).then((res) => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        console.log(res);
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
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })

            },
            // 模块搜索框
            querySearch(queryString, cb) {
                console.log(this.allPowerList);
                let powerList = this.allPowerList;

                let results = queryString ? powerList.filter(this.createFilter(queryString)) : powerList;
                console.log('results==', results)


//                let results = [{value: 11},{value: 12},{value: 13}]
                cb(results);
            },
            handleSelect() {

            },
            createFilter(queryString) {
                return (power) => {
                    return (power.modulename.indexOf(queryString) !== -1);
                };
            },
            // 模块权限选中
            powerSelected(power) {

                let checkedCount = power.selPower.length;
                power.isIndeterminate = checkedCount > 0 && checkedCount < power.dpower.length;
                power.allVal = checkedCount >= power.dpower.length;

                console.log(power)
                this.changeIsIndeterminateAll();
            },
            changeIsIndeterminateAll(){
                // this.load1 = true;
                setTimeout(() => {
                    this.selectAll = true;
                    this.isIndeterminateAll = false;
                    let allSel = true;
                    let allNoSel = true;
                    for(let i = 0; i < this.powerList.length; i++) {
                        let item = this.powerList[i];
                        if (item.isIndeterminate) {
                            this.isIndeterminateAll = true;
                            this.selectAll = false;
                            allNoSel = false;
                            allSel = false;
                            break;
                        } else if(!item.isIndeterminate && item.allVal) {

                            allNoSel = false;
                        } else if(!item.isIndeterminate && !item.allVal) {
                            allSel = false;
                        }
                    }

                    //全部没选也 不是确定状态
                    if (allNoSel) {
                        this.isIndeterminateAll = false;
                        this.selectAll = false;
                    } else if(allSel) {
                        this.isIndeterminateAll = false;
                        this.selectAll = true;
                    } else {
                        this.isIndeterminateAll = true;
                        this.selectAll = false;
                    }
                    // this.load1 = false;

                }, 20);
                
            },
            // 卡片中的全选
            selectThisAll (power) {
                let allArr = [];
                power.dpower.forEach((item, i) => {
                    allArr.push(item.value);
                })
                power.selPower = power.allVal ? allArr : [];
                power.isIndeterminate = false;
                this.changeIsIndeterminateAll();
            },
            // 全选所有权限
            selectAllPower() {
                const _this = this;
                this.powerList.forEach((power, i) => {
                    if(this.selectAll) {
                        power.allVal = true;
                        _this.selectThisAll(power);
                    } else {
                        power.allVal = false;
                        _this.selectThisAll(power);
                    }
                })
                this.isIndeterminateAll = false;        
            },
            // 获取权限模块列表
            getPowerModules() {
                this.load2 = true;
                const _this = this;
                let param = this.searchModel || '';
                getPowerModuleList(-1, param).then((res) => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {

                        console.log('powerList1===', this.powerList)
                        this.fatherModules = [];

//                        this.$message(res.retMsg);
                        this.allPowerList = res.result;
                        console.log('powerList2===', this.allPowerList)
                        let all = {
                            moduleid: -1,
                            modulename: '全部',
                            children: this.allPowerList
                        }

                        this.fatherModules.push(all);
                        console.log('powerList3===', this.allPowerList)
                        this.allPowerList.forEach((item, i) => {

                            let val2 = item.rightvalue.toString(2).split('').reverse();
                            let dpower = [];
                            let mydpower = [
                                {value: 1, sel: false, name: '浏览'},
                                {value: 2, sel: false, name: '修改'},
                                {value: 4, sel: false, name: '新增'},
                                {value: 8, sel: false, name: '删除'},
                                {value: 16, sel: false, name: '打印'},
                                {value: 32, sel: false, name: '设置'},
                                {value: 64, sel: false, name: '导出'},
                                {value: 128, sel: false, name: '审核'},
                                {value: 256, sel: false, name: '财审'},
                                {value: 512, sel: false, name: '导入'}
                            ]
                            console.log(val2);
                            val2.forEach((val, k) => {
                                if(val === '1') {
                                    dpower.push(mydpower[k]);
                                }
                            })

                            _this.$set(item, 'dpower', dpower);
                            _this.$set(item, 'selPower', []);
                            _this.$set(item, 'allVal', false);
                            _this.$set(item, 'isIndeterminate', false);

                            let isNew = true;
                            _this.fatherModules.forEach((list, j) => {
                                if(item.parentmoduleid === list.moduleid) {
                                    list.children.push(item);
                                    isNew = false;
                                }
                            })
                            if(isNew) {
                                let module = {
                                    moduleid: item.parentmoduleid,
                                    modulename: item.parentModuleName,
                                    children: []
                                }
                                module.children.push(item);
                                _this.fatherModules.push(module);
                            }

                        })
                        console.log('powerList5===', this.powerList)
                        this.powerList = this.fatherModules[0].children;
                        console.log('powerList4===', this.powerList)
                        this.getPower();
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 角色筛选
            searchRole() {
                console.log(this.rolelist)
                const _this = this;
                this.rolelist.forEach((item, i) => {
                    item.isShow = true;
                    if(item.roleName.indexOf(_this.queryrole) === -1) {
                        item.isShow = false;
                    }
                });

                setTimeout(() => {
                    document.getElementsByClassName('slic-list')[0].click();
                },50)

            },
            // 新建角色按钮
            doAddNewRole() {
                this.newUser.updateLow = false;
                this.newUser.roleName = '';
                this.newUser.notes = '';
                this.showNewRole = true;
            },
            // 新建角色确定
            addNewRole() {

                if(!this.newUser.roleName) {
                    this.$message('请输入角色名称！');
                } else {
                    let newuser = {
                        type: this.newUser.updateLow ? 1 : 0,
                        eid: this.userInfo.loginEid,
                        roleName: this.newUser.roleName,
                        notes: this.newUser.notes
                    };
                    console.log(this.newUser.roleName);
                    console.log(newuser);
                    addNewRole(newuser).then(res => {
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            this.getMyRole('last');
                            this.showNewRole = false;
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.$message(res.retMsg);
                    });
                }

            },
            //
            roleChange(event, role) {

                setTimeout(() => {
                    console.log('role==', event, role);
                    if(role.roleName === '') {

                    } else if((/[^a-zA-Z0-9\_\-\u4e00-\u9fa5]/g).test(role.roleName)) {
                        role.roleName = JSON.parse(JSON.stringify(role.myrolename));
                    } else {
                        role.myrolename = JSON.parse(JSON.stringify(role.roleName));
                    }
                },50)


            },
            // 删除角色
            doDeleteRole(role) {

                this.$confirm('确定删除该角色？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    let opt = {
                        eid: this.userInfo.loginEid,
                        roleId: role.roleId
                    }
                    deleteRole(opt).then((res) => {
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);

                            if(role.active) {
                                this.getMyRole('first');
                            } else {
                                this.getMyRole(this.currentRole.roleId);
                            }
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
//                        this.$message(res.retMsg);
                    })
                }).catch()

            },
            // 修改角色
            doChangeRole(role) {
                if(!role.roleName) {
                    role.isEdit = false;
                    this.$message('角色名称不能为空！');
                    role.roleName = JSON.parse(JSON.stringify(role.myrolename));
                } else {
                    role.isEdit = false;

                    let opt = {
                        roleId: role.roleId,
                        roleName: role.roleName,
                        notes: role.notes || ''
                    }

                    changeRole(opt).then((res) => {
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
//                        this.getMyRole();
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
//                        this.$message(res.retMsg);
                    })
                }

            },
            // 复制角色
            doCopyRole(role) {
                let opt = {
                    roleId: role.roleId,
                    roleName: role.roleName + '-副本',
                    notes: role.notes || ''
                }

                if(opt.roleName.length > 15) {
                    this.$message.error('角色名称【' + opt.roleName + '】过长，无法完成复制！');
                } else {
                    copyRole(opt).then((res) => {
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            this.getMyRole('last');
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
//                    this.$message(res.retMsg);
                    })
                }

            },
            // 角色选择事件
            roleSelect(obj) {
                for(let i = 0; i < this.rolelist.length; i++) {
                    if(this.rolelist[i].active) {
                        this.rolelist[i].active = false;
                        break;
                    }
                }
                obj.active = true;

                this.updateLow = false;
//
                this.currentRole = obj;
                console.log(obj)

                if(this.powerOrUser === '角色用户') {
                    this.getRoleUser(obj);
                } else if(this.powerOrUser === '角色权限') {
                    this.getPowerModules();
                    this.activeModel = '$0';
//                    this.changeIsIndeterminateAll();
                    this.selectAll = false;
                }
            },
            // 角色用户查询
            doUserSearch() {
                this.gridVal.footer.pageNum = 1;
                this.getRoleUser(this.currentRole);
            },
            // 角色用户重置
            doUserReset() {
                this.gridVal.footer.pageNum = 1;
                this.searchUser = '';
                this.getRoleUser(this.currentRole);
                console.log('gridVal.row', this.gridVal.row)
            },
            // 表格选中
            doSelected (data) {
                console.log('data==', data)
                this.selectedGridData = data;
            },
            // 表格pageSize改变
            handleSizeChange (size) {
                console.log('size==', size);
                this.gridVal.footer.pageSize = size;
                this.getRoleUser(this.currentRole);
            },
            // 页码改变
            handleCurrentChange (page) {
                console.log('page==', page)
                this.gridVal.footer.pageNum = page;
                this.getRoleUser(this.currentRole);
            },
            // 添加用户表格选中
            doSelectedNewUser (data) {
                console.log('data==', data)
                this.selectedGridDataNewUser = data;
            },
            // 添加用户表格pageSize改变
            handleSizeChangeNewUser (size) {
                console.log('size==', size)
                this.gridValNewUser.footer.pageSize = size;
                this.getUserListInfo();
            },
            // 添加用户页码改变
            handleCurrentChangeNewUser (page) {
                console.log('page==', page);
                this.gridValNewUser.footer.pageNum = page;
                this.getUserListInfo();
            },
            // 获取所有用户列表
            getUserListInfo() {
                let param = {
                    params: {
                        eid: this.userInfo.loginEid,
                        keyValue: this.addSearchUser,
                        roleId: -1,
                        notinroleid: this.currentRole.roleId
                    },
                    pageNum: this.gridValNewUser.footer.pageNum || 1,
                    pageSize: this.gridValNewUser.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getUserList(param).then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        this.gridValNewUser.rows = res.result;
                        this.gridValNewUser.rows.forEach((item, i) => {
                            item.ostatus = item.status == 1 ? '启用' : '禁用';
                        });
                        this.gridValNewUser.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.$message(res.retMsg);
                })
            },
            // 添加用户
            addUser() {
                this.showAddUser = true;
                this.getUserListInfo();
            },
            // 添加用户确定
            addNewUser() {
                let checkArr = [];
                this.selectedGridDataNewUser.forEach((item, i) => {
                    checkArr.push(item.userid);
                });
                if (checkArr.length === 0) {
                    this.$message({
                        message: '未选择用户，不能添加！',
                        duration: 1000
                    });
                    return;
                }

                let opt = {
                    roleId: this.currentRole.roleId,
                    eid: this.userInfo.loginEid,
                    userIdList: checkArr.join(),
                    opType: 1
                }

                operateRoleUser(opt).then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        this.getRoleUser(this.currentRole);
                        this.showAddUser = false;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.$message(res.retMsg);
                })

            },
            // 移除用户
            removeUser() {
                if(!(this.selectedGridData && this.selectedGridData.length > 0)) {
                    this.$message('请选择用户！');
                } else {
                    this.$confirm('确定移除该用户？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let str = '';
                        this.selectedGridData.forEach((item, i) => {
                            if(str === '') {
                                str = item.userid;
                            } else {
                                str = str + ',' + item.userid;
                            }
                        })
                        let opt = {
                            roleId: this.currentRole.roleId,
                            eid: this.userInfo.loginEid,
                            userIdList: str,
                            opType: 2
                        }

                        operateRoleUser(opt).then((res) => {
                            if(res.retCode === 'SUCCESS') {
                                this.$message(res.retMsg);
                                this.getRoleUser(this.currentRole);
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch((err) => {
                            this.$message(res.retMsg);
                        })
                    }).catch()
                }


            },
            // 表格中的单独移除用户
            removeSingleUser(user) {
                this.$confirm('确定移除该用户？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let opt = {
                        roleId: this.currentRole.roleId,
                        eid: this.userInfo.loginEid,
                        userIdList: user.row.userid,
                        opType: 2
                    }

                    operateRoleUser(opt).then((res) => {
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            this.getRoleUser(this.currentRole);
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
//                        this.$message(res.retMsg);

                    })
                }).catch()
            },
            // 用户或权限切换
            powerOrUserTab(val) {
                console.log(val);
                if(val === '角色权限') {
                    this.getPowerModules();
//                    this.getPower();
                } else {
                    this.getRoleUser(this.currentRole);
                }
            },
            // 获取权限模块
            getPower() {
                console.log('this.currentRole==', this.currentRole)
                const _this = this;
                getPowerModule(this.currentRole.roleId, '').then((res) => {
                    console.log('5599999999999999999999999999', res)
                    if(res.retCode === 'SUCCESS') {

                        let powerVal = res.result;

                        if(powerVal.length === 0) {
                            this.selectAll = false;
                            this.isIndeterminateAll = false;
                        }

                        let mydpower = [
                            {value: 1, sel: false, name: '浏览'},
                            {value: 2, sel: false, name: '修改'},
                            {value: 4, sel: false, name: '新增'},
                            {value: 8, sel: false, name: '删除'},
                            {value: 16, sel: false, name: '打印'},
                            {value: 32, sel: false, name: '设置'},
                            {value: 64, sel: false, name: '导出'},
                            {value: 128, sel: false, name: '审核'},
                            {value: 256, sel: false, name: '财审'},
                            {value: 512, sel: false, name: '导入'}
                        ]

                        powerVal.forEach((item, i) => {
                            _this.allPowerList.forEach((val, j) => {
                                if(val.moduleid === item.moduleid) {
                                    let val2 = item.rightvalue.toString(2).split('').reverse();
                                    let mypower = [];
                                    val2.forEach((right, k) => {
                                        if(right === '1') {
                                            mypower.push(mydpower[k].value);
                                            /*val.dpower.forEach((dp, n) => {
                                                if(mydpower[k].value === dp.value) {
                                                    dp.sel = true;
                                                }
                                            })*/
                                        }
                                    });
                                    val.selPower = mypower;

                                    _this.powerSelected(val);

                                }
                            })

                        })

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
//                    this.$message(res.retMsg);
                })
            },
            // 权限模块查询
            doModuleSearch() {
                this.getPowerModules();
                this.activeModel = '$0';
            },
            // 权限模块重置
            doModuleReset() {
                this.searchModel = '';
                this.getPowerModules();
                this.activeModel = '$0';
            },
            // 权限保存
            doSavePower() {
//                this.$message('功能暂不可用！');
                /*savePowerModule().then((res) => {

                }).catch()*/

                console.log(this.allPowerList);
                this.allPowerList.forEach((item, i) => {
                    item.rightvalue = 0;
                    /*item.dpower.forEach((val, j) => {
                        if(val.sel) {
                            item.rightvalue = item.rightvalue + parseInt(val.value);
                        }
                    })*/
                    item.selPower.forEach((val, j) => {
                        item.rightvalue = item.rightvalue + parseInt(val);
                    })
                })

                let opt = {
                    roleId: this.currentRole.roleId,
                    list: this.allPowerList,
                    flag: this.updateLow ? 1 : 0
                }

                savePowerModule(opt).then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
//                        this.getRoleUser(this.currentRole);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.$message(res.retMsg);
                })

            },
            // 权限取消
            doCancelPower() {
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.activeModel = 'all';
                    this.getPowerModules();
                }).catch()
            },
            // 权限类别tab点击
            handlePowerTab(val) {
                console.log(val)
                let index = parseInt(val.split('$')[1]);
                this.powerList = this.fatherModules[index].children;
                this.changeIsIndeterminateAll();
                console.log(this.powerList);

            },


            // 用户详情
            changeToDetail(user) {
                this.$router.push({path: '/basic/userDetail', query: {opType: 'change', eid: this.userInfo.loginEid, userId: user.userid, ename: this.userInfo.ename}});
            },
            iconCloseUser(str) {
                this.searchUser = '';
            },
            iconCloseModel(str) {
                this.searchModel = '';
            },
            iconCloseRole(str) {
                this.newUser.roleName = '';
            }

        },
        directives: {
            focus: {
                inserted: function(el) {
                    el.focus();
                }
            },
            initClick: {
                inserted: function(el, value) {
                    if(value.value === 0) {
                        el.click();
                    }
                }
            }
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .roleIndex{
        .slic-panel{
            /*height: 200px;*/
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
        }

        .panel-header{
            height: 40px;
            /*background-color: #e5e5e5;*/
            border-bottom: 1px solid #ccc;
            color: #28e;
            font-size: 16px;
            line-height: 40px;
            margin: 0 10px;
        }

        .panel-header::after{
            width: 100%;
            height: 0;
            content: '';
            display: inline-block;
        }

        .panel-header>span{
            display: inline-block;
        }

        .panel-body{
            /*background-color: #fafafa;*/
            font-size: 14px;
            font-weight: normal;
            padding: 10px;
            margin-top: 20px;
            height: 140px;
        }

        .panel-body .el-col-8{
            margin-bottom: 20px;
        }

        .slic-content-left{
            display: inline-block;
        }

        .slic-content-left-search{
            height: 50px;
            background-color: #fff;
            line-height: 50px;
            width: 265px;
            padding: 0 10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }

        .slic-content-tree {
            height: calc(100% - 60px);
            box-sizing: border-box;
        }

        .slic-content-info{
            display: flex;
            flex-direction: column;
            align-items: stretch;
            width: calc(100% - 275px);
			padding: 0 0 0 10px; /*add*/
            .slic-content-info-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: calc(100% - 45px);


                .slic-content-info-grid-container {
                    padding: 10px 10px 0 10px;
                    background-color: #fff;
                    border-radius: 5px;
                }
            }
        }

        .sl-content-handle{
            margin-bottom: 10px;
            background-color: #fff;
            border-radius: 5px;
            height: 50px;
        }

        .sl-content-handle-left{
            margin-left: 10px;
            /*height: 50px;*/
            /*line-height: 50px;*/
        }

        .sl-content-handle-right{
            margin-right: 10px;
            /*height: 50px;*/
            /*line-height: 50px;*/
        }

        .sl-content-cards{
            background-color: #fff;
            border-radius: 5px;
            height: calc(100% - 80px);
        }

        .sl-content-cards .el-tabs__header{
            border-bottom: 0;
        }

        .slic-content-info-tab{
            border-bottom: 1px solid #28e;

            .el-radio-button.is-active {

                .el-radio-button__inner {
                    color: #28e;
                    font-weight: bold;
                    background-color: #fff;
                }
            }

            .el-radio-button__inner {
                border-bottom: 0;
            }

            .el-radio-button:last-child .el-radio-button__inner{
                border-radius: 0 4px 0 0;
            }

            .el-radio-button:first-child .el-radio-button__inner{
                border-radius: 4px 0 0 0;
            }
        }

        .more-operate {
            color: #999;
            margin-left: 10px;
            cursor: pointer;
            position: relative;
            &:hover {
                .more-operate-container {
                    display: block;
                }
            }

            .more-operate-container {
                position: absolute;
                top: 27px;
                right: 0;
                border: 1px solid #e1e1e1;
                border-radius: 5px;
                box-shadow: 0 0 10px 0 #e1e1e1;
                overflow: hidden;
                display: none;

                .more-operate-list {
                    width: 100px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    background-color: #fff;
                    color: #555;

                    &:hover {
                        background-color: #d5e9f7;
                        color: #28e;
                    }
                }

            }
        }

        .dialog-grid {
            .el-dialog__body {
                height: 500px;
            }
        }
	
		.el-button--primary {
			font-weight: normal;
		}
		
		.slic-list-label {
			vertical-align: bottom;
		}
		
		.slic-list-ul {
			border-bottom: 1px solid #dfe6ec;
			/*height: calc(100% - 60px);*/
		}
		.slic-list-ul2 {
			border-left: 1px solid #dfe6ec;
  		    border-right: 1px solid #dfe6ec;
			border-bottom: 1px solid #dfe6ec;
			height: calc(100% - 90px);
		}		
			
    }
    
.all-check-label {
	float: right;
    padding-right: 10px;
}
</style>


