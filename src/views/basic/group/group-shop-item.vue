<template>
    <div class="group-shop-item sl-page-container flex-col pst-rl"
         :class="pageType === 1 ? 'add' : pageType === 2 ? 'edit' : 'view'">
        <!-- 路由面包屑 -->
        <levelbar :levelList="levelList">
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【基础管理-店组管理-店铺列表】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以查看到所有的店组并对其进行管理。</p>
                        <p>1. 创建和维护店组信息；</p>
                        <p>2. 创建和维护店组模版，设备、店铺商品、货柜商品；</p>
                        <p>3. 查看店组店铺，添加店铺到店组；</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <!-- 店组信息 -->
        <div class="sl-item-panel group-info animated fadeIn mt-xsmall detailView">
            <!-- 编辑，新增 -->
            <el-form inline :model="groupInfo" ref="groupInfoForm" :rules="rules" class="page-add-edit"
                     v-show="pageType !== 3">
                <el-form-item label="店组名称：" class="form-group-name" :title="groupInfo.groupName" prop="groupName">
                    <el-input size="small" v-model="groupInfo.groupName" style="width: 260px;"></el-input>
                </el-form-item>
                <el-form-item label="拥有店铺：" style="margin: 0 80px;">
                    <label v-text="groupInfo.storeNum >= 0 ? groupInfo.storeNum + '家' : ''"></label>
                </el-form-item>
                <el-form-item :label="'本周(' + bWeekDate + '~' + eWeekDate + ') 销售金额：'" label-width="285px">
                    <label v-text="'￥' + groupInfo.saleMoney" class="balance-bg-red tx-overflow"
                           style="font-size: 18px;"></label>
                </el-form-item>
                <el-form-item label="店组说明：" class="form-notes">
                    <div class="textarea-wrap">
                        <el-input size="small" :rows="3" :resize="'none'" :maxlength="200" type="textarea"
                                  v-model="groupInfo.notes"></el-input>
                        <div class="textarea-tip" style="display: inline-block; bottom: -5px;">
                            <label class="c-28e" v-text="groupInfo.notes.length"></label>/200
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <!-- 浏览 -->
            <el-form inline :model="groupInfo" ref="groupInfoForm" :rules="rules" class="page-view"
                     v-show="pageType === 3">
                <el-form-item label="店组名称：" class="form-group-name" :title="groupInfo.groupName">
                    <label v-text="groupInfo.groupName" class="tx-overflow form-group-name-label"></label>
                </el-form-item>
                <el-form-item label="拥有店铺：" style="margin: 0 80px;">
                    <label  class="tx-overflow" v-text="groupInfo.storeNum >= 0 ? groupInfo.storeNum + '家' : ''"></label>
                </el-form-item>
                <el-form-item :label="'本周(' + bWeekDate + '~' + eWeekDate + ') 销售金额：'" label-width="285px">
                    <label v-text="'￥' + groupInfo.saleMoney" class="balance-bg-red tx-overflow"
                           style="font-size: 18px;"></label>
                </el-form-item>
                <el-form-item label="店组说明：" class="form-notes">
                    <label v-text="groupInfo.notes" :title="groupInfo.notes"></label>
                </el-form-item>
            </el-form>
        </div>
        <!-- 页面操作按钮 -->
        <div class="sl-operator-panel">
            <div class="sl-operator-left" style="left: 250px;">
                <el-button size="small" class="back slic-btn-theme3" @click="goToGroup">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <el-button-group v-show="pageType === 2" style="margin-right: 20px;">
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="addShop"
                               v-show="myModulePower.edit" :disabled="loading">添加
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="delShopList"
                               v-show="myModulePower.edit" :disabled="loading">删除
                    </el-button>
                </el-button-group>
                <el-button-group v-show="pageType === 2">
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="saveGroupInfo"
                               v-show="myModulePower.edit" :disabled="loading">保存
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="doCancel"
                               :disabled="loading">取消
                    </el-button>
                </el-button-group>
                <el-button type="primary" size="small" class="slic-btn-theme3" @click="editGroupInfo"
                           v-show="myModulePower.edit && pageType === 3" :disabled="loading">编辑
                </el-button>
            </div>
        </div>
        <!-- 店组店铺列表表格信息 -->
        <div class="sl-content-panel flex-col overflow-y">
            <div class="sl-grid-edit-header">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input class="search-shop-name" :class="{'clear' : !!searchModel.shopName}"
                                  :icon="'circle-close'"
                                  size="small" placeholder="请输入店铺名称" v-model="searchModel.shopName"
                                  :on-icon-click="reset">
                            <template slot="prepend">店铺名称</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-button type="primary" size="small" class="slic-btn-theme3" @click="search"
                                       :disabled="loading">
                                查询
                            </el-button>
                            <el-button type="primary" size="small" class="slic-btn-theme3" @click="reset"
                                       :disabled="loading">
                                重置
                            </el-button>
                        </el-button-group>
                    </el-form-item>
                </el-form>
            </div>
            <sl-grid :gridCol="shopGridCol" :gridValue="shopGridVal" :gridConfig="shopGridCfg"
                     @rowSelected="handleShopGridSelectionChange" @pageSizeChange="handleShopGridSizeChange"
                     @currentPageChange="handleShopGridCurrentChange">
                <template slot="fullName" scope="prop">
                    <div>{{prop.scope.row.fullName.substring(0, prop.scope.row.fullName.lastIndexOf('-'))}}</div>
                </template>
                <template slot="status" scope="prop">
                    <div>
                        {{prop.scope.row.status === 0 ? "未开业" : prop.scope.row.status === 1 ? "营业中" : prop.scope.row.status === 2 ? "休息中" : "已停业"
                        }}
                    </div>
                </template>
                <template slot="operate" scope="prop">
                    <el-button type="text" size="small" @click="goToShopDetail(prop.scope.row)" v-show="shopModulePower.look">详情</el-button>
                    <el-button type="text" size="small" @click="delShopFromGroup(prop.scope.row)" v-show="myModulePower.edit">移除</el-button>
                </template>
            </sl-grid>
        </div>
        <!-- 添加店组店铺弹出框 -->
        <el-dialog class="add-shop-dialog"
                   :visible.sync="addShopDialogVisible"
                   :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <span slot="title" class="dialog-header">
                <span>添加店铺到店组中【{{groupInfo.groupName}}】</span>
            </span>
            <div style="margin-bottom: 10px;">
                <span style="width: 95px;margin-right: 10px;">店铺名称: </span>
                <sl-input placeholder="请输入店铺名称" :input-val.sync="addShopDialogSearch"
                          style="width: 250px;"></sl-input>
                <el-button type="primary" @click="getShopList" size="small">查询</el-button>
            </div>
            <div style="height: calc(100% - 30px);" v-loading="shopDialogLoading">
                <sl-grid :gridCol="shopDialogGridCol" :gridValue="shopDialogGridVal" :gridConfig="shopDialogGridCfg"
                         @rowSelected="handleShopDialogGridSelectionChange"
                         @pageSizeChange="handleShopDialogGridSizeChange"
                         @currentPageChange="handleShopDialogGridCurrentChange">
                    <template slot="fullname" scope="prop">
                        <div>{{prop.scope.row.fullname.substring(0, prop.scope.row.fullname.lastIndexOf('-'))}}</div>
                    </template>
                    <template slot="contact" scope="prop">
                        <div>{{prop.scope.row.contact + ' ' + prop.scope.row.contactmobile}}</div>
                    </template>
                    <template slot="status" scope="prop">
                        <div>
                            {{prop.scope.row.status === 0 ? "未开业" : prop.scope.row.status === 1 ? "正在营业" : prop.scope.row.status === 2 ? "营业结束" : "店铺已关闭"
                            }}
                        </div>
                    </template>
                </sl-grid>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="btn-sure" type="primary"
                           @click="addShopDialogVisible = false; addShopToGroup()"
                           title="热键(暂无实现)">添加</el-button>
                <el-button size="small" class="btn-sure" type="primary"
                           @click="addShopToGroup()"
                           title="热键(暂无实现)">继续添加</el-button>
                <el-button size="small" class="btn-cancel" @click="addShopDialogVisible = false" title="热键(ESC)">取 消(ESC)</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {
        getORG,
        updateGroupInfo,
        getGroupDetail
    } from '@/api/basic/group/group';
    import {
        getPageOrg
    } from '@/api/basic/org';
    import Levelbar from 'views/layout/Levelbar';
    import SlAutocomplete from '@/components/sl-autocomplete';
    import SlGrid from '@/components/sl-grid';
    import SlInput from '@/components/sl-input';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'group-item',
        components: {
            Levelbar,
            SlAutocomplete,
            SlGrid,
            SlInput
        },
        mixins: [RouterMixins, ViewPage, ViewBtnsPower],
        data() {
            return {
                // 自定义面包屑列表
                levelList: ['基础管理', '店组管理', '店组详情'],
                // 查询模型属性
                searchModel: {
                    shopName: '', // 店铺查询名称
                },
                // 店组信息
                groupInfo: {
                    groupName: '',
                    storeNum: 0,
                    notes: '',
                    saleMoney: ''
                },
                // 店组店铺列表表格配置信息
                tableAllData: [], // 后台返回的所有数据
                shopGridCol: [
                    {field: 'eid', name: '店铺编码', width: '100', fixed: true},
                    {field: 'eName', name: '店铺名称', width: '200', align: 'left'},
                    {field: 'fullName', name: '上级机构', minWidth: '200', template: 'fullName', align: 'left'},
                    {field: 'address', name: '所在地址', minWidth: '200', align: 'left'},
                    {field: 'saleSum', name: '本周销售', width: '250'},
                    {field: 'status', name: '状态', width: '120', template: 'status', align: 'center', fixed: 'right'},
                    {field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right', isSort: false}
                ],
                shopGridVal: {
                    rows: [], footer: {
                        pageNum: 1,
                        pageSize: 25,
                        totalRecord: 0
                    }
                },
                shopGridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer'
                },
                shopMultipleSelection: [],
                // 弹出框: 添加店铺_店铺表格配置信息
                addShopDialogVisible: false,
                shopDialogLoading: false,
                addShopDialogSearch: '',
                shopDialogGridCol: [
                    {field: 'eid', name: '店铺编码', width: '100', fixed: true},
                    {field: 'ename', name: '店铺名称', width: '200', align: 'left'},
                    {field: 'fullname', name: '上级机构', minWidth: '200', template: 'fullname', align: 'left'},
                    {field: 'address', name: '所在地址', minWidth: '200', align: 'left'},
                    {field: 'contact', name: '联系人', width: '200', template: 'contact', align: 'center'},
                    {field: 'status', name: '状态', width: '120', template: 'status', align: 'center', fixed: 'right'}
                ],
                shopDialogGridVal: {rows: [], footer: {}},
                shopDialogGridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer'
                },
                shopDialogMultipleSelection: [],
                // 页面表单校验规则
                rules: {
                    groupName: [
                        {required: true, message: '请输入店组名称', trigger: 'change'},
                        {min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'change'}
                    ]
                },
            }
        },
        computed: {
            ...mapGetters([
                'isGroupItem'
            ])
        },
        watch: {
            /* 前台分页功能
             * 组件必要属性: tableAllData: 从后台一次获取所有的数据; tableData: 表格数据; page: { pageSize: 25, pageNum: 1, totalRecord: 0 }
             */
            tableAllData: {
                handler: function (val, oldVal) {
                    let pageNum = this.shopGridVal.footer.pageNum,
                        pageSize = this.shopGridVal.footer.pageSize,
                        startIndex = (pageNum - 1) * pageSize,
                        endIndex = pageNum * pageSize;
                    console.log('DEBUG', startIndex, endIndex);
                    this.shopGridVal.rows = val.slice(startIndex, endIndex);
                    this.shopGridVal.footer.totalRecord = val.length || 0;
                },
                deep: true,
                immediate: true
            },
            // 用途：是否隐藏操作列
            'pageType': function (val, oldVal) {
                let lastIndex = this.shopGridCol.length - 1;
                this.hideOpCol(val, this.shopGridCol, lastIndex);
            }
        },
        methods: {
            // 查看店组详情
            getGroupDetail() {
                let params = {
                    pageNum: 1,
                    pageSize: 10000,
                    totalRecord: 0,
                    totalPage: 0,
                    params: {
                        groupId: +this.$route.query.groupId,
                        keyValue: this.searchModel.shopName,
                        bDate: this.bWeekDate,
                        eDate: this.eWeekDate
                    }
                }
                this.loading = true;
                return getGroupDetail(params).then((res) => {
                    let data = res.result;
                    this.groupInfo = Object.assign({}, this.groupInfo, {
                        groupName: res.groupName || '',
                        storeNum: res.storeNum || 0,
                        notes: res.notes || '',
                        saleMoney: res.saleMoney || ''
                    })
                    this.tableAllData = data;
                    this.loading = false;
                }).catch((error) => {
                    console.log(error);
                    this.tableAllData = [];
                    this.loading = false;
                })
            },
            // 店组名称备注店铺更新
            updateGroupInfo(storeEids) {
                // 1. 校验保存的数据
                this.$refs['groupInfoForm'].validate((valid) => {
                    if (valid) {
                        // 2. 执行保存
                        let params = {
                            groupId: +this.$route.query.groupId,
                            groupName: this.groupInfo.groupName,
                            notes: this.groupInfo.notes,
                            storeEids: storeEids,
                        }
                        this.loading = true;
                        return updateGroupInfo(params).then((res) => {
                            console.log(res);
                            this.$message({
                                message: `保存店组信息成功`,
                                type: 'success'
                            });
                            this.changePageType(3, '店组管理(详情)');
                            this.getGroupDetail();
                        }).catch((err) => {
                            console.log(err);
                            this.$message({
                                message: `保存店组信息失败`,
                                type: 'error'
                            });
                            this.loading = false;
                        })
                    } else {
                        this.$message({
                            message: `录入的店组信息有误！`,
                            type: 'error'
                        });
                        return;
                    }
                })
            },
            // 获取店铺列表
            getShopList() {
                let gridValRowsIds = [];
                this.tableAllData.forEach(function (item) {
                    gridValRowsIds.push(item.eid)
                })
                let params = {
                    pageNum: this.shopDialogGridVal.footer.pageNum || 1,
                    pageSize: this.shopDialogGridVal.footer.pageSize || 25,
                    eid: -1,
                    groupId: -1,
                    parentId: -1,
                    ename: this.addShopDialogSearch,
                    areaid: -1,
                    eids: [],
                    userId: this.userInfo.userId,
                    notIn: gridValRowsIds,// 排除的机构
                    orgType: 1,
                    notingroupid: +this.$route.query.groupId
                }
                this.shopDialogLoading = true;
                return getPageOrg(params).then((res) => {
                    this.shopDialogLoading = false;
                    if (res.retCode === 'SUCCESS') {
                        this.shopDialogGridVal.rows = res.result;
                        this.shopDialogGridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.shopDialogLoading = false;
                })
            },
            // 根据查询条件查询店组店铺
            search() {
                this.getGroupDetail();
            },
            // 重置查询条件
            reset() {
                this.searchModel.shopName = ''; // 店铺查询名称
                this.search();
            },
            // 返回按钮
            goToGroup() {
                if (this.pageType === 2) {
                    this.$confirm('确定放弃编辑,返回店组列表？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.delCurView(this.$route.name);
                        this.$router.push({path: '/basic/group'});
                    }).catch(() => {

                    });
                } else {
                    this.$router.push({path: '/basic/group'});
                }
            },
            // 编辑按钮
            editGroupInfo() {
                this.changePageType(2, '店组管理(编辑)');
            },
            // 添加按钮
            addShop(){
                this.addShopDialogSearch = '';
                this.addShopDialogVisible = true;
                this.getShopList();
            },
            // 批量删除
            delShopList(){
                if (!this.shopMultipleSelection.length) {
                    this.$message({
                        message: `请选择多个店铺`,
                        type: 'error'
                    });
                    return;
                }
                let storeEids = this.shopMultipleSelection.map((item) => {
                    return item.eid;
                }).join(',')
                this.tableAllData = this.tableAllData.filter((item, index, arr) => {
                    return !~storeEids.indexOf(item.eid)
                })
            },
            // 保存按钮
            saveGroupInfo() {
                let storeEids = this.tableAllData.map((item) => {
                    return item.eid;
                });
                this.updateGroupInfo(storeEids);
            },
            // 取消按钮
            doCancel() {
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.changePageType(3, '店组管理(详情)');
                    this.getGroupDetail();
                })
            },
            // 店组店铺表格: 数据选择
            handleShopGridSelectionChange(val) {
                this.shopMultipleSelection = val;
            },
            // 店组店铺表格: 数据分页大小
            handleShopGridSizeChange(val) {
                this.shopGridVal.footer.pageSize = val;
                this.search();
            },
            // 店组店铺表格: 数据当期页
            handleShopGridCurrentChange(val) {
                this.shopGridVal.footer.pageNum = val;
                this.search();
            },
            // 详情按钮
            goToShopDetail(shopInfo) {
                this.$router.push({path: '/operations/shopInfo', query: {shopId: shopInfo.eid, pageType: 3}});
            },
            // 移除按钮
            delShopFromGroup(shopInfo) {
                let storeId = shopInfo.eid.toString().split();
                this.$confirm('是否移除店铺?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    this.tableAllData = this.tableAllData.filter((item, index, arr) => {
                        return !~storeId.indexOf(item.eid.toString())
                    })
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 弹出框: 保存
            addShopToGroup() {
                if (!this.shopDialogMultipleSelection.length) {
                    this.$message({
                        message: `请选择店铺`,
                        type: 'error'
                    });
                    this.addShopDialogVisible = true;
                    return;
                }
                this.shopDialogMultipleSelection.forEach((shopInfo, index) => {
                    this.tableAllData.unshift(Object.assign({}, {
                        eName: shopInfo.ename,
                        fullName: shopInfo.fullname.substring(0, shopInfo.fullname.lastIndexOf('-'))
                    }, shopInfo));
                })
                this.getShopList();
            },
            // 弹出框: 店组店铺表格_数据选择
            handleShopDialogGridSelectionChange(val) {
                this.shopDialogMultipleSelection = val;
            },
            // 弹出框: 店组店铺表格_数据分页大小
            handleShopDialogGridSizeChange(val) {
                this.shopDialogGridVal.footer.pageSize = val;
                this.getShopList();
            },
            // 弹出框: 店组店铺表格_数据当期页
            handleShopDialogGridCurrentChange(val) {
                this.shopDialogGridVal.footer.pageNum = val;
                this.getShopList();
            },
            // 组件: 初始化
            init(){
                // 切换页面标识
                this.pageType = +this.$route.query.pageType;
                let title = this.pageType === 1 ? '店组管理(新增)' : this.pageType === 2 ? '店组管理(编辑)' : '店组管理(详情)';
                this.changePageType(this.pageType, title);
                // 操作列配置
                this.$set(this.shopGridCol, 4, Object.assign({}, this.shopGridCol[4], {
                    name: '本周销售' + this.bWeekDate + '~' + this.eWeekDate
                }))
                let lastIndex = this.shopGridCol.length - 1;
                this.hideOpCol(this.pageType, this.shopGridCol, lastIndex);
                // 获取数据
                if (this.$route.query.hasOwnProperty('doType') && this.isGroupItem) {
                    this.getGroupDetail().then(() => {
                        this.$store.dispatch('ToggleGroupItem', false);
                        this.addShop();
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    this.getGroupDetail();
                }
            }
        },
        activated() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .group-shop-item {
        &.view {
            .el-form {
                .el-form-item {
                    margin-bottom: 0 !important;
                }
            }
            .detailView .page-view {
                .form-group-name .form-group-name-label {
                    display: inline-block;
                    width: 150px;
                }
            }
        }
        &.edit {
            .form-notes {
                .el-form-item__label {
                    margin-left: 10px;
                }
            }
        }
        .sl-item-panel {
            &.group-info {
                font-size: 14px;
                .balance-bg-red {
                    color: #ff0000;
                }
                .el-form {
                    .el-form-item {
                        margin-bottom: 22px;
                    }
                    .form-notes {
                        /*width: 985px;*/
                        width: 100%;
                        margin-bottom: 0;
                        .el-form-item__content {
                            width: calc(100% - 95px);
                        }
                    }
                }
            }
        }
        .sl-content-panel {
            padding-bottom: 0 !important;
            .sl-table-header {
                margin-bottom: 0;
                text-align: center;
                font-size: 14px;
                .balance-bg-red {
                    color: #ff0000;
                }
            }
            .sl-grid-edit-header {
                /*flex: 1;*/
                padding-bottom: 10px;
                background: #fff;
                .search-shop-name {
                    &.clear {
                        .el-icon-circle-close {
                            display: inline-block;
                        }
                    }
                    .el-icon-circle-close {
                        display: none;
                    }
                }
                .el-form-item__label {
                    padding: 8px 0px 0px 10px;
                }
                .el-form-item {
                    margin-bottom: 0;
                    .el-form-item__content {
                        line-height: 28px;
                        .el-input.is-disabled .el-input__inner {
                            background-color: rgb(235, 235, 228);
                            border-color: #ccc;
                            color: rgb(84, 84, 84);;
                            cursor: not-allowed;
                        }
                    }
                }
            }
            .el-table {
                border-top: 1px solid #d4d4d4;
            }
            .el-pagination {
                /*padding-bottom: 0px !important;*/
                /*padding-right: 0px !important;*/
            }
        }
        .add-shop-dialog {
            &.el-dialog__wrapper {
                .el-dialog {
                    &.el-dialog--small {
                        width: 800px;
                        height: 480px;
                        .el-dialog__body {
                            height: 400px;
                        }
                    }
                }
            }
        }
        .el-autocomplete {
            width: 100%;
        }
        .el-dialog__wrapper {
            .el-dialog {
                &.el-dialog--small {
                    width: 680px;
                }
                .shop-status .el-form-item__label {
                    width: 60px;
                }

                .tx-input {
                    width: 405px;
                    .el-input__inner {
                        border: none;
                        background: #fff;
                    }
                }
            }
        }
    }

    .shop-name-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>