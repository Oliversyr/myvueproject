<template>
    <div class="sl-card-panel flex-col overflow-y">
        <div class="sl-card-item" v-for="(posInfo, index) in templateData" :key="'posInfo' + index">
            <div class="sl-card-item__title mb-xsmall clearfix">
                <span class="panel-title fl fz-s5 tx-bold">{{posInfo.posName}}</span>
                <el-button-group class="fr">
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="operateVEM(posInfo, 1)"
                               v-show="myModulePower.edit">复制
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="operateVEM(posInfo, 2)"
                               v-show="myModulePower.edit">删除
                    </el-button>
                </el-button-group>
                <el-button type="primary" size="small" class="slic-btn-theme3 fr mr-small"
                           @click="operateVEMDevice(posInfo, newDeviceInfo, 1)" v-show="myModulePower.edit">新增设备
                </el-button>
            </div>
            <div class="sl-card-item__content overflow-y">
                <sl-card class="pst-rl flex-col" v-if="posInfo.mainDevTemp">
                        <span slot="header" class="tx-bold">
                            主控
                        </span>
                    <div slot="body" class="device-info">
                        <span>{{posInfo.mainDevTemp.devTypeName}}</span>
                        <span>
                            {{posInfo.mainDevTemp.displaySize + ' ' + posInfo.mainDevTemp.displayRate}}
                        </span>
                        <span>{{posInfo.mainDevTemp.systemVer}}</span>
                        <span>网络：{{posInfo.mainDevTemp.netLinkType}}</span>
                        <span>{{posInfo.mainDevTemp.port}}</span>
                    </div>
                    <div slot="footer" class="sl-btn-txt">
                        <span v-show="deviceModulePower.look"><a
                                @click="goToDeviceDetail(posInfo, posInfo.mainDevTemp)">详情</a></span>
                        <span v-show="myModulePower.edit" :class="{ 'border-none': !deviceModulePower.look}"><a
                                @click="operateVEMDevice(posInfo, posInfo.mainDevTemp, 2, 0)">移除</a></span>
                    </div>
                </sl-card>
                <sl-card v-for="(deviceInfo, index) in posInfo.slaveDevTempList" :key="deviceInfo"
                         class="pst-rl flex-col">
                        <span slot="header">
                            货柜
                            <span class="no fr">编号：{{ deviceInfo.devindex }}</span>
                        </span>
                    <div slot="body" class="device-info">
                        <span>{{deviceInfo.devTypeName}}</span>
                        <span>{{deviceInfo.devType === 1 ? '弹簧机' : deviceInfo.devType === 2 ? '蛇形机' : '格子柜'}}</span>
                        <span>{{deviceInfo.maxRow}}行{{deviceInfo.maxCol}}列{{deviceInfo.maxRow * deviceInfo.maxCol}}货道</span>
                        <span>货道最大存货：{{deviceInfo.chnMaxSize}}</span>
                        <span>储存：{{deviceInfo.ifWarm === 1 ? '加热' : '常温'}}{{deviceInfo.ifCold === 1 ? '、冷藏' : ''}}</span>
                    </div>
                    <div slot="footer" class="sl-btn-txt">
                        <span v-show="deviceModulePower.look"><a
                                @click="goToDeviceDetail(posInfo, deviceInfo)">详情</a></span>
                        <span v-show="myModulePower.edit" :class="{ 'border-none': !deviceModulePower.look}"><a
                                @click="operateVEMDevice(posInfo, deviceInfo, 2, 1)">移除</a></span>
                        <span v-show="myModulePower.edit"><a @click="goToAisle(posInfo, deviceInfo)">货道</a></span>
                    </div>
                </sl-card>
            </div>
        </div>
        <!-- 新增售卖机设备弹出框 -->
        <el-dialog :visible.sync="addVEMDeviceDialogVisible" @open="openAddVEMDeviceDialog"
                   :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
                    <span slot="title" class="dialog-header">
                        <span>新增设备</span>
                    </span>
            <el-form label-width="120px" :inline="false">
                <el-form-item label="设备种类：" class="mt-xsmall el-form-item-w">
                    <el-select v-model="sType" @change="handleSTypeChange" placeholder="请选择设备类型"
                               size="small" class="el-form-con-w">
                        <el-option :key="0" :label="'主控'" :value="0"></el-option>
                        <el-option :key="1" :label="'货柜'" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备类型名称：" class="el-form-item-w">
                    <el-autocomplete
                            ref="devTypeName"
                            popper-class="dev-type-name-autocomplete"
                            v-model="devTypeAutoCompleteName"
                            :fetch-suggestions="queryDevTypeAutoComplete"
                            custom-item="dev-type-name-item"
                            placeholder="请选择设备类型名称"
                            @select="handleSelectDevTypeAutoComplete"
                            icon="caret-bottom"
                            size="small"
                            :on-icon-click="handleIconClickDevTypeAutoComplete"
                            :props="{label: 'value',value: 'devTypeName'}"
                            class="el-form-con-w "
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="设备编号：" v-show="sType === 1" class="el-form-item-w">
                    <el-input-number size="small" :min="setDevindexMin" v-model="setDevindex"
                                     style="width: 120px;"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button v-show="myModulePower.edit" size="small" class="btn-sure" type="primary"
                                   @click="addVEMDeviceDialogVisible = false;saveAddVEMDevice()"
                                   title="热键(暂无实现)">保存</el-button>
                        <el-button size="small" class="btn-cancel" @click="addVEMDeviceDialogVisible = false"
                                   title="热键(ESC)">取 消(ESC)</el-button>
                    </span>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {getDeviceList} from '@/api/basic/group/group';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    // 自定义"设备类型名称"自动完成函数式组件
    Vue.component('dev-type-name-item', {
        functional: true,
        render: function (h, ctx) {
            var item = ctx.props.item;
            return h('li', ctx.data, [
                h('div', {attrs: {class: 'name'}}, [item.devTypeName]),
                h('span', {attrs: {class: 'dev-type-id'}}, [item.devTypeid])
            ]);
        },
        props: {
            item: {type: Object, required: true}
        }
    });

    export default {
        name: 'device-card',
        props: {
            templateData: {
                type: Array,
                required: true,
                default: function () {
                    return [];
                }
            }
        },
        mixins: [ViewBtnsPower],
        data() {
            return {
                addVEMDeviceDialogVisible: false,
                devTypeAutoCompleteName: '',
                devList: [],
                // 设备种类 -1全部  0：主控   1：货柜
                sType: 0,
                // 设备编号
                setDevindex: 0,
                // 设备编号起始值
                setDevindexMin: 1,
                newPosInfo: {},
                newDeviceInfo: {}
            }
        },
        methods: {
            // 跳转货道界面
            goToAisle(posInfo, deviceInfo) {
                this.$emit('goToAisle', posInfo, deviceInfo)
            },
            // 跳转设备详情界面
            goToDeviceDetail(posInfo, deviceInfo) {
                this.$emit('goToDeviceDetail', posInfo, deviceInfo)
            },
            // 售卖机操作：1-复制，2-删除
            operateVEM(posInfo, opType) {
                this.$emit('operateVEM', posInfo, opType)
            },
            // 新增和移除设备: 1-新增，2-删除
            operateVEMDevice(posInfo, deviceInfo, type, sType) {
                if (type === 1) {
                    console.log('DEBUG', posInfo, deviceInfo, type)
                    this.devTypeAutoCompleteName = '';
                    this.newDeviceInfo = {};
                    this.addVEMDeviceDialogVisible = true;
                    this.setDevindexMin = !!posInfo.slaveDevTempList && posInfo.slaveDevTempList.length > 0 ? posInfo.slaveDevTempList[posInfo.slaveDevTempList.length - 1].devindex + 1 : 1;
                    this.setDevindex = this.setDevindexMin;
                    this.newPosInfo = posInfo;
                } else if (type === 2) {
                    this.$emit('operateVEMDevice', posInfo, deviceInfo, type, sType)
                }
            },
            // 保存"新增设备"信息
            saveAddVEMDevice() {
                let posInfo = this.newPosInfo,
                    deviceInfo = this.newDeviceInfo,
                    sType = this.sType;
                this.newDeviceInfo.devindex = this.setDevindex;
                if (sType === 0 && !!posInfo.mainDevTemp) {
                    this.$message({
                        message: `售卖机只能有一个主机`,
                        type: 'error'
                    });
                    return;
                }
                this.$emit('operateVEMDevice', posInfo, deviceInfo, 1, sType)
            },
            /* 以下是"新增设备"弹出框中的设备类型名称自动完成功能
             *
             */
            // 获取设备列表信息
            getDeviceList(sType) {
                let params = {
                    devTypeName: '',
                    devType: -1,
                    sType: sType,
                    status: 1
                }
                getDeviceList(params).then((res) => {
                    this.devList = sType === 0 ? res.result.mainDevList : res.result.slaveDevList;
                }).catch(err => {
                    console.log(err);
                })
            },
            // 打开新增设备弹出框
            openAddVEMDeviceDialog() {
                this.getDeviceList(this.sType);
            },
            // 根据输入查询参数进行数据过滤
            queryDevTypeAutoComplete(queryString, cb) {
                var restaurants = this.devList;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            // 过滤函数
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.devTypeName.indexOf(queryString) > -1 );
                };
            },
            // 设备种类切换
            handleSTypeChange(sType) {
                this.sType = sType;
                this.devTypeAutoCompleteName = '';
                this.newDeviceInfo = {};
                this.getDeviceList(sType)
            },
            // 处理选择项事件
            handleSelectDevTypeAutoComplete(item) {
                this.newDeviceInfo = item;
            },
            // 处理点击自动完成后缀图标事件
            handleIconClickDevTypeAutoComplete() {
                this.$refs['devTypeName'].handleFocus();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .sl-card-panel {
        .sl-card-item {
            &:hover {
                background-color: #e7f3fd !important
            }
            &:not(:first-child) {
                border-top: none !important;
            }
            border: 1px solid #ccc;
            min-height: 282px;
            padding: 10px;
            .sl-card-item__content {
                height: 224px;
                // sl-card 组件样式覆盖
                .sl-card {
                    width: 145px;
                    height: 224px;
                    margin-bottom: 0;
                    &.active .sl-card__top {
                        border: 1px solid #28e;
                        border-radius: 4px;
                    }
                    .sl-card__top {
                        height: 190px;
                        .sl-card__body {
                            height: 143px;
                            flex: 1;
                        }
                    }
                }
                // 业务数据展示样式
                .no {
                    font-size: 12px;
                    color: #555;
                }
                .device-info {
                    span {
                        margin-top: 10px;
                        display: block;
                    }
                }
                .sl-btn-txt {
                    .border-none {
                        border: none !important;
                    }
                }
            }
        }
    }

    .dev-type-name-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .dev-type-id {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .dev-type-id {
                color: #ddd;
            }
        }
    }

    .el-form-item-w {
        width: 400px;
    }

    .el-form-con-w {
        width: 300px;
    }
</style>