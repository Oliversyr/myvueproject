<template>
    <div class="group sl-page-container flex-col">
        <div class="sl-search-panel" style="padding-bottom: 0;">
            <div class="slic-input-group sl-search-item">
                <el-input class="search-shop-name" :class="{'clear' : !!searchModel.groupName}" :icon="'circle-close'"
                          size="small" placeholder="请输入店组名称" v-model="searchModel.groupName"
                          :on-icon-click="onSearchGroupNameIconClick">
                    <template slot="prepend">店组名称</template>
                </el-input>
            </div>
            <div class="slic-input-group sl-search-item">
                <el-input class="search-shop-name" :class="{'clear' : !!searchModel.shopName}" :icon="'circle-close'"
                          size="small" placeholder="请输入店铺名称" v-model="searchModel.shopName"
                          :on-icon-click="onSearchShopNameIconClick">
                    <template slot="prepend">店铺名称</template>
                </el-input>
            </div>
            <sl-select prepend="状态" class="sl-search-item">
                <el-select v-model="searchModel.status" placeholder="请选择" :default-first-option="true" filterable
                           slot="ELSelect" size="small" style="width: 130px;">
                    <el-option label="全部" value="-1"></el-option>
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                </el-select>
            </sl-select>
            <div class="slic-btn-group sl-search-item" style="vertical-align: baseline;">
                <el-button-group>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="search" :disabled="loading">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="reset" :disabled="loading">
                        重置
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <div class="sl-operator-panel">
            <div class="sl-operator-right">
                <el-button type="primary" size="small" class="add-group slic-btn-theme3" @click="addGroup"
                           :disabled="loading" v-if="myModulePower.add">新增店组
                </el-button>
            </div>
        </div>
        <div class="sl-content-panel overflow-y" v-loading="loading">
            <sl-card v-for="(item, index) in storeGroupList" :key="'group' + index" class="group-card">
                <div slot="header" class="group-card-header">
                    <span>{{item.groupName}}</span>
                    <div v-show="item.status === 0" class="fr">
                        <span class="group-status">已禁用</span>
                    </div>
                </div>
                <div slot="body" class="group-card-body">
                    <div class="group-info" :title="item.notes">
                        {{item.notes}}
                    </div>
                    <div class="shop-info">
                        <span>店铺</span>
                        <span style="margin: 0 5px;">{{item.storeNum}}</span>
                        <span>家</span>
                        <el-button @click="goToItem(item)" class="view-shop" type="text" size="small" v-waves>查看
                        </el-button>
                    </div>
                </div>
                <div slot="footer" class="group-card-footer sl-btn-txt">
                    <span v-if="item.status === 0 && myModulePower.edit"><a @click="oprateGroup(item, 1)">启用</a></span>
                    <span v-if="item.status === 1 && myModulePower.edit"><a @click="oprateGroup(item, 0)">禁用</a></span>
                    <span v-if="myModulePower.edit"><a @click="copyGroup(item)">复制</a></span>
                    <span v-if="myModulePower.edit"><a @click="addGroupItem(item)">添加店铺</a></span>
                    <span v-if="myModulePower.edit"><a @click="goToTemplate(item)">管理模板</a></span>
                </div>
            </sl-card>
        </div>
        <el-dialog :visible.sync="addGroupDialogVisible" @close="handleAddGroupDialog" :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <span slot="title" class="dialog-header">
                <span>新增店组</span>
            </span>
            <el-form ref="newGroupForm" :model="newGroup" :rules="rules" label-width="70px" class="mt">
                <el-form-item label="店组名称：" prop="groupName">
                    <el-input size="small" v-model="newGroup.groupName" style="width: 100%;"></el-input>
                </el-form-item>
                <el-form-item label="店组说明：">
                    <el-input size="small" :rows="3" :resize="'none'" :maxlength="200" type="textarea"
                              v-model="newGroup.notes"></el-input>
                    <span class="textarea-tip" style="bottom: -5px;"><label class="c-28e"
                                                                            v-text="newGroup.notes.length"></label>/200</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="btn-sure" type="primary" @click="saveGroup"
                           title="">保存</el-button>
                <el-button size="small" class="btn-cancel" @click="addGroupDialogVisible = false"
                           title="热键(ESC)">取 消(ESC)</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getGroupList, oprateGroup, createGroup} from '@/api/basic/group/group';
    import {sortBy} from 'utils/index';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'group',
        mixins: [ViewBtnsPower],
        data() {
            return {
                loading: false,
                // 查询模型
                searchModel: {
                    status: "-1", // 店组查询状态
                    shopName: '', // 店铺查询名称
                    groupName: '' // 店组查询名称
                },
                // 店组列表数据
                storeGroupList: [],
                // 店组操作: 1-启用 0-禁用 2-复制 -2-其它操作
                opType: -2,
                // 新增店组对话框是否打开
                addGroupDialogVisible: false,
                // 新增店组模型
                newGroup: {
                    groupId: this.storeGroupListLength + 1,
                    groupName: '',
                    notes: '',
                    status: 1,
                    storeNum: 0
                },
                // 页面表单校验规则
                rules: {
                    groupName: [
                        {required: true, message: '请输入店组名称', trigger: 'change'},
                        {min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'change'}
                    ]
                }
            }
        },
        computed: {
            storeGroupListLength: function () {
                return this.storeGroupList.length
            }
        },
        methods: {
            // 跳转到店组店铺页面
            goToItem(item) {
                this.$parent.groupInfo = item;
                this.$router.push({path: 'groupShopItem', query: {groupId: item.groupId, pageType: 3}});
            },
            // 跳转到店组模板配置页面
            goToTemplate(item) {
                this.$parent.groupInfo = item;
                this.$router.push({path: 'groupTemplateManager', query: {groupInfo: JSON.stringify(item)}});
            },
            // 获取店组列表
            getGroupList() {
                let keyValue = this.searchModel.shopName,
                    groupName = this.searchModel.groupName,
                    status = this.searchModel.status;
                this.storeGroupList = [];
                this.loading = true;
                return getGroupList({keyValue, groupName, status}).then((res) => {
                    let data = res.result.sort(sortBy('storeNum', false))
                    this.storeGroupList = data;
                    this.loading = false;
                }).catch((err) => {
                    console.log(err);
                    this.storeGroupList = [];
                    this.loading = false;
                })
            },
            // 根据查询条件查询店组
            search() {
                this.getGroupList();
            },
            // 重置查询条件
            reset() {
                this.searchModel = {
                    status: "-1", // 店组查询状态
                    shopName: '', // 店铺查询名称
                    groupName: '' // 店组查询名称
                }
                this.getGroupList();
            },
            // 重置店组查询名称
            onSearchGroupNameIconClick(){
                this.searchModel.groupName = '';
            },
            // 重置店铺查询名称
            onSearchShopNameIconClick() {
                this.searchModel.shopName = '';
            },
            // 店组操作: 1-启用 0-禁用 2-复制
            oprateGroup(group, opType) {
                if (opType === 0 && group.storeNum > 0) {
                    this.$message({
                        message: `禁用失败，本店组内还有 ${group.storeNum} 家店铺`,
                        type: 'error'
                    });
                } else if (opType === 0 && group.status === 0) {
                    this.$message({
                        message: `本店组已经是禁用状态`,
                        type: 'error'
                    });
                } else if (opType === 1 && group.status === 1) {
                    this.$message({
                        message: `本店组已经是启用状态`,
                        type: 'error'
                    });
                } else {
                    let groupId = group.groupId,
                        groupName = group.groupName,
                        notes = group.notes;
                    return oprateGroup(opType, groupId, groupName, notes).then((res) => {
                        this.addGroupDialogVisible = false;
                        this.$message({
                            message: res.retMsg || '操作成功',
                            type: 'success'
                        });
                        this.getGroupList();
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            },
            // 添加店铺
            addGroupItem(item) {
                if (item.status === 0) {
                    this.$message({
                        message: `不可操作，本店组是禁用状态`,
                        type: 'error'
                    });
                    return;
                }
                this.$router.push({path: 'groupShopItem', query: {groupId: item.groupId, pageType: 2, doType: 'add'}});
                this.$store.dispatch('ToggleGroupItem', true);
            },
            // 复制店组
            copyGroup(group) {
                this.newGroup = {
                    groupId: group.groupId, // 原来店组ID
                    groupName: group.groupName || '',
                    notes: group.notes || '',
                    status: group.status || 1,
                    storeNum: 0
                }
                this.addGroupDialogVisible = true;
                this.opType = 2;
            },
            // 新增店组
            addGroup() {
                // 每次打开弹出框都要清空模型数据
                this.newGroup = {
                    groupId: this.storeGroupListLength + 1,
                    groupName: '',
                    notes: '',
                    status: 1,
                    storeNum: 0
                }
                this.addGroupDialogVisible = true;
                this.opType = -2;
            },
            // 新增店组的Dialog关闭的回调
            handleAddGroupDialog() {
                this.opType = -2;
                // 对'newGroupForm'表单进行重置，将所有字段值重置为初始值并移除校验结果
                this.$refs['newGroupForm'].resetFields();
            },
            // 保存店组
            saveGroup() {
                this.$refs['newGroupForm'].validate((valid) => {
                    if (valid) {
                        let groupName = this.newGroup.groupName,
                            status = this.newGroup.status,
                            notes = this.newGroup.notes,
                            group = this.newGroup;
                        if (this.opType === 2) {
                            // 复制 操作
                            this.oprateGroup(group, 2);
                        } else {
                            // 新增店组 操作
                            createGroup(groupName, status, notes).then((res) => {
                                this.addGroupDialogVisible = false;
                                this.$message({
                                    message: res.retMsg || '保存成功',
                                    type: 'success'
                                });
                                this.getGroupList();
                            }).catch((err) => {
                                console.log(err);
                            })
                        }
                    }
                })
            },
            // 组件初始化
            init(){
                this.getGroupList();
            }
        },
        activated() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .group {
        .sl-search-panel {
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
            .el-input.el-input--small {
                .el-input-group__prepend {
                    width: 80px;
                }
            }
            .sl-select__wrapper {
                .sl-select__prepend {
                    width: 80px;
                }
            }
        }
        .sl-content-panel {
            flex: 1;
            padding: 10px 0 !important;
            background-color: #f5f5f5 !important;;
        }
        .sl-operator-panel {

        }
        .group-card {
            height: 198px !important;
            .sl-card__top {
                height: 168px !important;
                .sl-card__body {
                    height: 123px !important;
                    background: #fff;
                }
            }
            .group-card-header {
                &:hover {
                    color: #2288ee;
                }
                display: inline-block;
                width: 100%;
                height: 45px;
                font-size: 12px;
                font-family: '微软雅黑';
                line-height: 46px;
                .group-status {
                    padding: 2px 6px;
                    color: #fff;
                    border-radius: 4px;
                    background-color: #aeaeae;
                }
            }
            .group-card-body {
                .group-info {
                    margin-top: 10px;
                    word-break: break-all;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .shop-info {
                    margin-top: 20px;
                    line-height: 18px;
                    .view-shop {
                        color: #2288ee;
                        margin-left: 15px;
                    }
                }
            }
        }
        .el-dialog__wrapper {
            .el-dialog {
                &.el-dialog--small {
                    width: 600px;
                }
            }
        }
    }

</style>