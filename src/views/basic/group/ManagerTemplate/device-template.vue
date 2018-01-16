<template>
    <div class="device-template sl-page-container flex-col">
        <!-- 设备模板详情卡片展示 -->
        <div v-loading="loading" class="device-card-info">
            <device-card ref="deviceCard" :templateData.sync="VEMDevInfo" @goToAisle="goToAisle"
                         @goToDeviceDetail="goToDeviceDetail" @operateVEM="operateVEM"
                         @operateVEMDevice="operateVEMDevice"></device-card>
        </div>
        <!-- 新增售卖机弹出框 -->
        <el-dialog :visible.sync="addVEMDialogVisible" @close="handleAddVEMDialog" :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <span slot="title" class="dialog-header">
                <span>{{addVEMDialogTitle}}</span>
            </span>
            <el-form :model="newVEM" :rules="rules" ref="newVEM" label-width="85px" style="width: 460px;" class="mt">
                <el-form-item label="售卖机名称：" prop="posName">
                    <el-input size="small" type="text" v-model="newVEM.posName" autofocus auto-complete="on"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="btn-sure" type="primary" @click="saveVEM" title="热键()"
                           :disabled="isSaveBtnDisabled">保存</el-button>
                <el-button size="small" class="btn-cancel" @click="addVEMDialogVisible = false"
                           title="热键(ESC)">取 消(ESC)</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getTemplateVEMDevInfo, addVEM, operateVEM, operateVEMDevice} from '@/api/basic/group/group';
    import DeviceCard from './device-card';
    export default {
        name: 'device-template',
        components: {
            DeviceCard
        },
        data() {
            var validatePosName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('售卖机名字不能为空'));
                } else {
                    let isExists = this.VEMDevInfo.some((item) => {
                        return item.posName === value
                    })
                    if (isExists) {
                        callback(new Error('售卖机名字已经存在'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                loading: false,
                groupInfo: {},
                VEMDevInfo: [],
                // 新增售卖机弹出框
                isSaveBtnDisabled: false,
                addVEMDialogVisible: false,
                addVEMDialogTitle: '新增售卖机',
                opType: -2, // 售卖机操作: 1-复制  2-删除 -2-其它操作(例如:新增)
                newVEM: {
                    posId: this.VEMDevInfo + 1,
                    posName: ''
                },
                rules: {
                    posName: [
                        {required: true, validator: validatePosName, trigger: 'change'},
                        { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            // 跳转货柜设备详情界面
            goToDeviceDetail(posInfo, deviceInfo) {
                this.$router.push({
                    path: '/basic/deviceDetail',
                    query: {opType: 'view', title: '设备类型(详情)', devTypeid: deviceInfo.devTypeid}
                });
            },
            // 跳转店组设备的货道模板界面
            goToAisle(posInfo, deviceInfo) {
                this.$parent.currentView = 'AisleTemplate';
                this.$parent.posInfo = posInfo;
                this.$parent.deviceInfo = deviceInfo;
            },
            // 【店组】获取设备模版列表
            getTemplateVEMDevInfo(){
                let groupId = this.groupInfo.groupId;
                this.loading = true;
                return getTemplateVEMDevInfo(groupId).then((res) => {
                    this.VEMDevInfo = res.result;
                    console.log(this.VEMDevInfo)
                    this.loading = false;
                }).catch(err => {
                    console.log(err);
                    this.VEMDevInfo = [];
                    this.loading = false;
                })
            },
            // 保存售卖机信息(新增，复制，编辑操作)
            saveVEM() {
                this.isSaveBtnDisabled = true;
                this.$refs['newVEM'].validate((valid) => {
                    if (valid) {
                        let groupId = this.groupInfo.groupId,
                            posId = this.newVEM.posId,
                            posName = this.newVEM.posName;
                        if (this.opType === 1) {
                            // 复制 操作
                            operateVEM(groupId, posId, this.opType, posName).then((res) => {
                                this.handleAddVEMDialog();
                                this.getTemplateVEMDevInfo().then(() => {
                                    this.$message({
                                        message: '复制售卖机成功',
                                        type: 'success'
                                    });
                                }).catch((err) => {
                                    console.log(err);
                                });
                                this.isSaveBtnDisabled = false;
                            }).catch((err) => {
                                console.log(err);
                                this.isSaveBtnDisabled = false;
                            });
                        } else {
                            // 新增售卖机 操作
                            addVEM(groupId, posName).then((res) => {
                                this.handleAddVEMDialog();
                                this.getTemplateVEMDevInfo().then(() => {
                                    this.$message({
                                        message: '新增售卖机成功',
                                        type: 'success'
                                    });
                                });
                                this.isSaveBtnDisabled = false;
                            }).catch((err) => {
                                console.log(err);
                                this.isSaveBtnDisabled = false;
                            })
                        }
                    } else {
                        this.isSaveBtnDisabled = false;
                        return this.isSaveBtnDisabled;
                    }
                });
            },
            /* 新增售卖机弹出框功能
             *
             */
            // 关闭新增售卖机弹出框
            handleAddVEMDialog() {
                this.addVEMDialogVisible = false;
                this.opType = -2;
            },
            // 新增售卖机(直接添加一个售卖机卡片)
            addVEM(opType) {
                // 每次打开弹出框都要清空模型数据
                this.newVEM = {
                    posId: this.VEMDevInfo + 1,
                    posName: ''
                }
                this.addVEMDialogVisible = true;
                this.addVEMDialogTitle = '新增售卖机';
                this.opType = opType;
                this.$nextTick(()=>{
                    this.$refs['newVEM'].resetFields();
                })
            },
            // 复制，删除售卖机
            operateVEM(item, opType){
                if (opType === 1) {
                    this.newVEM = {
                        posId: item.posId, // 原来售卖机ID
                        posName: item.posName || ''
                    }
                    this.addVEMDialogVisible = true;
                    this.addVEMDialogTitle = '复制售卖机';
                    this.opType = opType;
                } else if (opType === 2) {
                    let groupId = this.groupInfo.groupId,
                        posId = item.posId,
                        posName = item.posName
                    this.$confirm('是否删除售卖机?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        operateVEM(groupId, posId, opType, posName).then((res) => {
                            this.handleAddVEMDialog();
                            this.getTemplateVEMDevInfo().then(() => {
                                this.$message({
                                    message: '删除售卖机成功',
                                    type: 'success'
                                });
                            });
                        }).catch((err) => {
                            console.log(err);
                        })
                    }).catch(() => {
                        console.log(err);
                    });
                }
            },
            // 移除、新增设备
            operateVEMDevice(posInfo, deviceInfo, type, sType){
                var _this = this,
                    _operateVEMDevice = function () {
                        var groupId = _this.groupInfo.groupId,
                            posId = posInfo.posId,
                            devId = deviceInfo.devId,
                            index = sType === 0 ? 0 : deviceInfo.devindex,
                            devtypeid = deviceInfo.devTypeid;
                        if(!devtypeid) {
                            _this.$message({
                                message: `设备类型不存在，请选择`,
                                type: 'error'
                            });
                            _this.$refs['deviceCard'].addVEMDeviceDialogVisible = true;
                            return;
                        }
                        operateVEMDevice({groupId, posId, devId, index, type, devtypeid}).then((res) => {
                            _this.getTemplateVEMDevInfo().then(() => {
                                _this.$message({
                                    message: type === 1 ? `新增设备成功` : `移除设备成功`,
                                    type: 'success'
                                });
                            })
                        }).catch((err) => {
                            console.log(err);
                        })
                    };
                if (type === 2) {
                    this.$confirm('是否移除设备?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        _operateVEMDevice();
                    }).catch((err) => {
                        console.log(err);
                    });
                } else if (type === 1) {
                    _operateVEMDevice();
                }
            },
            // 组件初始化
            init() {
                // 使用$nextTick 解决子组件初始化先于父组件BUG
                this.$nextTick(() => {
                    this.groupInfo = this.$parent.groupInfo;
                    this.getTemplateVEMDevInfo();
                })
            }
        },
        activated: function () {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .device-template {
        .device-card-info {
            overflow-y: auto;
        }
        .el-dialog__wrapper {
            .el-dialog {
                &.el-dialog--small {
                    width: 540px;
                    .el-dialog__body {
                    }
                }
            }
        }
    }
</style>