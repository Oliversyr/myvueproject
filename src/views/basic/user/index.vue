<template>
    <div class="sl-page-container flex-col userIndex" v-loading.body="load1">
        <div class="slic-head-panel">
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

            <div style="float: right;">
                <span class="sl-content-handle-left">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="addNewUser()" v-if="myModulePower.add">新增用户</el-button>
                        <el-button type="primary" size="small" @click="forbidUsers()" v-if="myModulePower.edit">禁用用户</el-button>
                        <excel-import-export ref="expImp" fileName="用户列表" :header="gridCol" @getResultArr="importData" v-if="myModulePower.export"
                                             :exportData="expData" @goToExp="doExport" :isImport="false" ></excel-import-export>
                    </el-button-group>
                </span>

            </div>
            <div class="sl-search-panel">
                <div class="slic-input-group sl-search-item mr" style="width: 335px;">
                    <!--<el-input icon="search" placeholder="请输入用户名称"  size="small" v-model="queryKey" :icon="queryKey ? 'circle-close' : ''" :on-icon-click="iconClose" :maxlength="12">
                        <template slot="prepend">用户查询</template>
                    </el-input>-->
                    <sl-input prepend="用户查询" placeholder="请输入用户名称" :input-val.sync="queryKey" ></sl-input>

                </div>

                <!--<div class="slic-input-group" style="width: 335px;">
                    <sl-autocomplete
                            :autoParams="autoParams"
                            :dataList="gridVal.rows"
                            slWidth="750"
                            colWidths="20,30,50"
                            displayProp="loginName"
                            @querykey="autoQuery"
                            @doAutoSelected="handleAutoSelect"
                            selectedMode="MULT">
                    </sl-autocomplete>
                </div>-->


                <!--<div class="slic-input-group  sl-search-item" style="width: 280px;">-->
                    <sl-select prepend="用户角色" style="width: 280px;">
                        <el-select filterable v-model="userRole" placeholder="请选择需要查询的角色" size="small" slot="ELSelect">
                            <el-option :key="18" :label="'全部'" :value="-1"></el-option>
                            <el-option v-for="(role, key) in roleList" :key="key" :label="role.roleName" :value="role.roleId"></el-option>
                        </el-select>
                    </sl-select>

                <!--</div>-->

                <div class="slic-btn-group">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()" :disabled="load2">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()" :disabled="load2">重置</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>

        <div class="slic-content">
            <div class="slic-content-tree">
                <sl-tree-list :treeData="orgList" :treeProps="orgTreeProps"
                              @treeSelected="orgTreeSelected"></sl-tree-list>
            </div>
            <div class="slic-content-info">

                <div class="sl-grid-container mt10" v-loading="load2">
                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                            @rowSelected="doSelected" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
                        <template slot="operate" scope="prop">
                            <el-button @click="operUser(prop.scope.row)" type="text" size="small" v-if="myModulePower.edit">{{prop.scope.row.status == 1 ? '禁用' : '启用'}}</el-button>
                            <span style="margin: 0 5px;"> </span>
                            <el-button type="text" size="small" @click="changeToDetail(prop.scope.row)">详情</el-button>
                            <span class="slic-list-btn more-operate" style="color: #999;" v-if="myModulePower.edit">
                                <i class="el-icon-more"></i>
                                <ul class="more-operate-container">
                                    <li class="more-operate-list" @click.stop="changePwd(prop.scope.row)" >重置密码</li>
                                </ul>
                            </span>
                        </template>

                    </sl-grid>
                </div>

            </div>
        </div>

        <el-dialog title="导出" :visible.sync="showExp">
            <div style="text-align: center;">
                <el-button type="primary" @click="doExport('all')" size="small">导出全部</el-button>
                <el-button type="primary" @click="doExport('select')" size="small">导出已选项</el-button>
                <el-button type="primary" @click="doExport('current')" size="small">导出当前页</el-button>
                <el-button @click="showExp = false" class="dialog-cancel" size="small">取 消</el-button>
            </div>
        </el-dialog>

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

</template>

<script>
    import ExcelImportExport from '@/components/excel-import-export.vue';
    import SlTreeList from '@/components/sl-tree-list.vue';
    import SlInput from '@/components/sl-input.vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import ElInput from '../../../../node_modules/element-ui/packages/input/src/input';
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue'
    import {mapGetters} from 'vuex';
    import {validatePassWD} from '@/utils/validate';
    import {getOrgList} from '@/api/basic/org';
    import {getRoleList} from '@/api/basic/role';
    import {getUserList, operateUser, changeUser, changePswd} from '@/api/basic/user';

    export default {
        name: 'userman',
        components: {
            ElInput, Levelbar, SlGrid,SlInput,
            ExcelImportExport, SlTreeList, SlAutocomplete
        },
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
                } else if (value !== this.changepwd.newpwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                load1: false,
                load2: false,
                orgList: [],
                orgTreeProps: {
                    label: 'ename',
                    selected: 'eid'
                },
                currentOrg: {},
                roleList: [],
                autocom: '',
                userRole: '',
                queryKey: '',
                selectedGridData: [],
                autoParams: {
                    loginName: '姓名',
                    mobilePhone: '手机',
                    createTime: '创建时间'
                },
                showExp: false,
                showChangePwd: false,
                changepwd: {
                    newpwd: '',
                    newpwd2: '',
                },
                currentChangePwd: {},
                expData: [],
                gridVal: {rows: [], footer: {}},
                gridCol: [],
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true
                },
                rules2: {
                    newpwd: [
                        { validator: validatePass, trigger: 'blur', required: true }
                    ],
                      newpwd2: [
                        { validator: validatePass2, trigger: 'blur', required: true }
                    ]
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {

                console.log('store===', this.$store.state);

                // 获取组织机构列表
                this.getOrg();
                this.getMyRole();
                console.log('uI',this.$store)
                this.gridCol = [
                    {field: 'realname', name: '用户姓名', width: '110px', fixed: true },
                    {field: 'mobilephone', name: '用户手机', width: '100px' },
                    {field: 'loginname', name: '登录账号', width: '100px'},
                    {field: 'lastloginStr', name: '上次登录', width: '150px'},
                    {field: 'createtimeStr', name: '创建时间', minWidth: '150px'},
                    {field: 'creator', name: '创建人', minWidth: '80px'},
                    {field: 'ostatus', name: '状态', width: '100px'},
                    {field: 'operate', name: '操作', width: '120px', fixed: 'right', template: 'operate', isSort: false,align: 'left', class: 'operate'},
                ];
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
            }
        },
        activated: function () {
            console.log('store===', this.$store.state);
            const _this = this;
            this.getOrg();
            if(this.currentOrg.eid) {
                this.doReset();
            }
        },
        methods: {
            // 获取组织机构列表
            getOrg() {
                getOrgList().then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        this.orgList = JSON.parse(JSON.stringify(res.result));
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.$message(res.retMsg);
                })
            },
            // 用户列表
            getUserListInfo() {
                this.load2 = true;
                let param = {
                    params: {
                        eid: this.currentOrg.eid,
                        keyValue: this.queryKey,
                        roleId: this.userRole
                    },
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getUserList(param).then((res) => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.gridVal.rows.forEach((item, i) => {
                            item.ostatus = item.status == 1 ? '启用' : '禁用';
                        });
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
            // 获取我的角色列表
            getMyRole() {
                getRoleList().then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.roleList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });
            },
            // 查询
            doSearch() {
//                console.log(this.queryKey, this.queryyy)
                this.gridVal.footer.pageNum = 1;
                this.getUserListInfo();
            },
            // 重置
            doReset () {
                this.gridVal.footer.pageNum = 1;
                this.userRole = -1;
                this.queryKey = '';
                this.getUserListInfo();
            },
            // 机构树的选中事件
            orgTreeSelected(obj) {
                this.currentOrg = obj;
                this.getUserListInfo(obj);
            },
            // 新增用户
            addNewUser() {
                this.$router.push({path: '/basic/userEdit', query: {title: '新增用户', opType: 'add', eid: this.currentOrg.eid, ename: this.currentOrg.ename}});
            },
            // 禁用用户
            forbidUsers() {
                if(!this.selectedGridData.length > 0) {
                    this.$message({
                        message: '请选择用户！',
                        duration: 1500
                    });
                    return;
                } else {

                    let selectedUser = '';
                    this.selectedGridData.forEach((item, i) => {
                        if(item.status == 1) {
                            selectedUser = selectedUser === '' ?  item.userid : `${selectedUser},${item.userid}`;
                        }
                    });

                    if(!selectedUser) {
                        this.$message('请选择启用状态的用户！')
                    } else {

                        this.$confirm('确定禁用用户？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let opt = {
                                eid: this.currentOrg.eid,
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
                        }).catch()

                    }
                }

            },
            // 列表中的单个禁用
            operUser (obj) {
                if(obj.status === 1) {
                    this.$confirm('确定禁用用户【' + obj.realname + '】？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let opt = {
                            eid: this.currentOrg.eid,
                            userIdList: obj.userid,
                            opType: obj.status == 1 ? 0 : 1
                        };
                        this.load2 = true;
                        operateUser(opt).then(res => {
                            this.load2 = false;
                            if(res.retCode === 'SUCCESS') {
                                this.$message(res.retMsg);
//                        this.getUserListInfo();
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
                            this.load2 = false;
//                    this.$message(res.retMsg);
                        });
                    }).catch()
                } else {
                    let opt = {
                        eid: this.currentOrg.eid,
                        userIdList: obj.userid,
                        opType: obj.status == 1 ? 0 : 1
                    };
                    this.load2 = true;
                    operateUser(opt).then(res => {
                        this.load2 = false;
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
//                        this.getUserListInfo();
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
                        this.load2 = false;
//                    this.$message(res.retMsg);
                    });
                }




            },
            // 表格选中
            doSelected (data) {
                console.log('data==', data)
                this.selectedGridData = data;
            },
            // 每页显示条数
            handleSizeChange (size) {
                this.gridVal.footer.pageSize = size;
                this.getUserListInfo();
            },
            // 页码改变
            handleCurrentChange (page) {
                this.gridVal.footer.pageNum = page;
                this.getUserListInfo();
            },
            // 跳转到详情
            changeToDetail (obj) {
                console.log(obj)
                this.$router.push({path: '/basic/userDetail', query: {title: '用户详情', eid: this.currentOrg.eid, userId: obj.userid, ename: this.currentOrg.ename}});
                console.log(this.currentOrg.eid, obj.userid)
//                this.$router.push({path: '/basic/userDetail', query: {opType: 'change', userInfo: obj}});
            },

            // 导入
            importData (data) {
                console.log('data==', data);
                this.gridVal.rows = this.gridVal.rows.concat(data)
            },
            /*// 自动补全选中
            handleAutoSelect(obj) {
                console.log('自动补全选中：', obj)
            },
            // 自动补全查询
            autoQuery(str) {
                console.log('自动补全查询参数：', str);
            }*/
            // 导出
            doExport(str) {
                if(str === 'current') {
                    this.expData = this.gridVal.rows;
                    console.log(this.expData);
                    this.$refs.expImp.doExport();
                    this.showExp = false;
                } else if(str === 'select') {
                    this.expData = this.selectedGridData;
                    this.$refs.expImp.doExport();
                    this.showExp = false;
                } else if(str === 'all') {
                    let param = {
                        params: {
                            eid: this.currentOrg.eid,
                            keyValue: '',
                            roleId: this.userRole
                        },
                        pageNum: 1,
                        pageSize: this.gridVal.footer.totalRecord,
                        totalRecord: 0,
                        totalPage: 0
                    }
                    getUserList(param).then((res) => {
                        if(res.retCode === 'SUCCESS') {
                            this.expData = res.result;
                            this.expData.forEach((item, i) => {
                                item.ostatus = item.status == 1 ? '启用' : '禁用';
                            });
                            this.$refs.expImp.doExport();
                            this.showExp = false;
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
//                        this.$message(res.retMsg);
                    })
                }
            },
            // 修改密码
            changePwd(obj) {
                this.showChangePwd = true;
                this.currentChangePwd = obj;
                this.changepwd.newpwd = '';
                this.changepwd.newpwd2 = '';
            },
            // 修改密码确认
            doChangePwd() {
                this.$refs['changepwdForm'].validate((valid) => {
                    if (valid) {
                        this.load1 = true;
//                        this.currentChangePwd.pswd = this.changepwd.newpwd;

                        changePswd(this.currentChangePwd.userid, this.changepwd.newpwd).then(res => {
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
            iconClose(str) {
                this.queryKey = '';
            }
        }
    }
</script>

<style rel="stylesheet/css" lang="scss">
    .userIndex {

        .sl-grid-container {
            flex: 1;
            /*padding: 10px;
            background-color: #fff;
            border-radius: 5px;*/
            height: calc(100% - 10px);
        }

        .slic-content-info {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 0 10px !important;

            background-color: #fff;
            box-sizing: border-box;
            border-radius: 5px;
            margin-left: 10px;

            .sl-content-handle {
                margin-bottom: 0;
            }
        }

        .el-table {
            .el-table__row {
                &.hover-row {
                    .operate {
                        .cell {
                            overflow: visible;
                        }
                    }
                }
            }

            /*.el-table__fixed-body-wrapper {
                overflow: visible;
            }*/
        }




    }
</style>
