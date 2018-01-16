<template>
    <div class="shop-device sl-page-container flex-col pst-rl">
        <!-- 店铺设备管理: 面包屑 -->
        <levelbar :levelList="levelList">
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-店铺管理-店铺设备】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以查看到所有的店铺并对其进行管理。</p>
                        <p>1. 店铺列表，列示店铺信息；</p>
                        <p>2. 店铺资料维护；</p>
                        <p>3. 店铺商品维护，包括经营商品和价格；</p>
                        <p>4. 店铺设备维护；</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <!-- 店铺设备管理: 店铺可折叠信息 -->
        <div class="sl-panel">
            <div class="sl-item-panel">
                <collapsible-info :shopInfo="shopInfo"></collapsible-info>
            </div>
        </div>
        <!-- 店铺设备管理: 页面操作按钮(包含设备和货道两个界面) -->
        <div class="sl-operator-panel" v-if="isShowVEMDev">
            <div class="sl-operator-left">
                <el-button size="small" class="back slic-btn-theme3" @click="goToShopItem">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <el-button type="primary" size="small" class="slic-btn-theme3 fr add-vending-machine"
                           @click.native.stop="addVEM(-2, newVEM, '新增售卖机')" v-if="myModulePower.edit">新增售卖机
                </el-button>
                <el-button type="primary" size="small" class="slic-btn-theme3 fr add-vending-machine-by-template"
                           @click.native.stop="addVEM(-1, newVEM, '按模板新增售卖机')" v-if="myModulePower.edit">按模板新增售卖机
                </el-button>
            </div>
        </div>
        <div class="sl-operator-panel" v-else>
            <div class="sl-operator-left">
                <el-button class="back slic-btn-theme3 fl mr" size="small" @click="goToDevice">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <el-button type="primary" size="small" class="slic-btn-theme3 fr" @click="addSlaveRow" v-if="myModulePower.edit">新增一行</el-button>
            </div>
        </div>
        <!-- 店铺设备管理: 售卖机、主控、货柜卡片列表信息 -->
        <div class="sl-content-panel flex-col overflow-y" v-loading="loading">
            <!-- 售卖机【设备】信息 -->
            <div class="sl-card-panel flex-col overflow-y" v-if="isShowVEMDev">
                <div class="sl-card-item" v-for="(posInfo, index) in VEMDevInfo"
                     :key="'posInfo' + index">
                    <div class="sl-card-item__title mb-xsmall clearfix">
                        <!-- 售卖机基本信息 -->
                        <div class="panel-title fl tx-bold">
                            <span class="mr">售卖机编号: {{posInfo.posId}}</span>
                            <span class="mr">售卖机名称: {{posInfo.posName}}</span>
                            <span class="address tx-overflow" :title="posInfo.address">放置地点: {{posInfo.address}}</span>
                            <span @click="addVEM(-3, posInfo, '编辑售卖机')" title="编辑售卖机" class="edit-vem"><icon-svg
                                    iconClass="brush"></icon-svg></span>
                        </div>
                        <!-- 售卖机操作按钮 -->
                        <el-button-group class="fr">
                            <el-button type="primary" size="small" class="slic-btn-theme3"
                                       @click="operateVEM(posInfo, 1)" v-if="myModulePower.edit">复制
                            </el-button>
                            <el-button type="primary" size="small" class="slic-btn-theme3"
                                       @click="operateVEM(posInfo, 2)" v-if="myModulePower.edit">删除
                            </el-button>
                        </el-button-group>
                        <el-button type="primary" size="small" class="slic-btn-theme3 fr mr-small"
                                   @click="openAddVEMDevice(posInfo)" v-if="myModulePower.edit">新增设备
                        </el-button>
                    </div>
                    <div class="sl-card-item__content overflow-y">
                        <!-- 主控卡片信息 -->
                        <sl-card class="pst-rl flex-col" v-if="posInfo.mainDevTemp">
                            <span slot="header">
                                主控
                            </span>
                            <div slot="body" class="device-info">
                                <span>{{posInfo.mainDevTemp.devTypeName}}</span>
                                <span>{{posInfo.mainDevTemp.displaySize + ' ' + posInfo.mainDevTemp.displayRate}}</span>
                                <span>{{posInfo.mainDevTemp.systemVer}}</span>
                                <span>网络：{{posInfo.mainDevTemp.netLinkType}}</span>
                                <span>{{posInfo.mainDevTemp.port}}</span>
                            </div>
                            <div slot="footer" class="sl-btn-txt">
                                <span v-if="deviceModulePower.look"><a @click="goToDeviceDetail(posInfo, posInfo.mainDevTemp)">详情</a></span>
                            </div>
                        </sl-card>
                        <!-- 货柜卡片信息 -->
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
                                <span v-if="deviceModulePower.look"><a @click="goToDeviceDetail(posInfo, deviceInfo)">详情</a></span>
                                <span v-if="myModulePower.edit"><a @click="operateVEMDevice(posInfo, deviceInfo, 2)">移除</a></span>
                                <span v-if="myModulePower.edit"><a @click="goToAisle(posInfo, deviceInfo)">货道</a></span>
                            </div>
                        </sl-card>
                    </div>
                </div>
            </div>
            <!-- 售卖机【货道】信息 -->
            <shop-device-aisle ref="shopAisle" :shopInfo="shopInfo" :posInfo="posInfo" :deviceInfo="deviceInfo"
                               v-else></shop-device-aisle>
        </div>
        <!-- 新增【售卖机】弹出框 售卖机操作: 1-复制  2-删除 -1 按模板新增 -2 新增 -3 编辑-->
        <el-dialog :visible.sync="addVEMDialogVisible" @close="handleAddVEMDialog" :close-on-click-modal="false"
                   v-drag="'el-dialog__header'" size="tiny">
            <span slot="title" class="dialog-header">
                <span>{{addVEMDialogTitle}}</span>
            </span>
            <el-form :model="newVEM" :rules="rules" ref="newVEM" label-width="120px" style="width: 580px;">
                <el-form-item label="选择模板：" style="width: 580px;" class="mt-xsmall" required
                              v-if="opType === -1">
                    <el-form-item style="display: inline-block;">
                        <el-select size="small" clearable filterable @change="groupValueChange"
                                   v-model="newVEM.groupValue"
                                   placeholder="请选择店组"
                                   style="width: 180px;">
                            <el-option
                                    v-for="item in groupOptions"
                                    :key="item.groupId"
                                    :label="item.groupName"
                                    :value="item.groupId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="groupPosValue" style="display: inline-block;">
                        <el-select size="small" clearable filterable v-model="newVEM.groupPosValue"
                                   placeholder="请选择售卖机模板"
                                   style="width: 240px;">
                            <el-option
                                    v-for="item in groupPosOptions"
                                    :key="item.posId"
                                    :label="item.myPosId + '—' + item.mainCount + '主控+' + item.springCabinetCount + '弹簧柜+' + item.checkerCabinetCount + '格子柜'"
                                    :value="item.posId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="售卖机名称：" prop="posName" class="mt10">
                    <el-input icon="edit" size="small" type="text" v-model="newVEM.posName" :disabled="opType === -3"
                              autofocus auto-complete="on"
                              style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="放置地点：" prop="address" v-if="opType != 1">
                    <el-input icon="edit" size="small" v-model="newVEM.address" style="width: 300px;"></el-input>
                </el-form-item>
                <el-collapse-transition>
                    <div v-if="isShowPass && opType !== 1">
                        <el-form-item label="密码：" prop="pass">
                            <el-input type="password" size="small" v-model="newVEM.pass" auto-complete="off"
                                      style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码：" prop="checkPass">
                            <el-input type="password" size="small" v-model="newVEM.checkPass" auto-complete="off"
                                      style="width: 300px;"></el-input>
                        </el-form-item>
                    </div>
                </el-collapse-transition>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :disabled="addVEMDialogLoading" size="small" class="btn-sure" type="primary" @click="saveVEM"
                           title="热键()" v-if="myModulePower.edit">保存</el-button>
                <el-button size="small" class="btn-cancel" @click="addVEMDialogVisible = false"
                           title="热键(ESC)">取 消(ESC)</el-button>
            </span>
        </el-dialog>
        <!-- 新增【售卖机=》设备】弹出框 -->
        <el-dialog size="tiny" :visible.sync="addVEMDeviceDialogVisible" @open="openAddVEMDeviceDialog"
                   :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
                    <span slot="title" class="dialog-header">
                        <span>新增设备</span>
                    </span>
            <el-form label-width="120px" :inline="false" style="width: 800px;">
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
                            placeholder="请输入设备类型名称"
                            @select="handleSelectDevTypeAutoComplete"
                            icon="caret-bottom"
                            size="small"
                            :on-icon-click="handleIconClickDevTypeAutoComplete"
                            :props="{label: 'value',value: 'devTypeName'}"
                            class="el-form-con-w"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="设备编号：" class="el-form-item-w" v-show="sType === 1">
                    <el-input-number size="small" :min="setDevindexMin" v-model="setDevindex"
                                     style="width: 120px;"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button size="small" class="btn-sure" type="primary"
                                   @click="addVEMDeviceDialogVisible = false;saveAddVEMDevice()"
                                   title="热键(暂无实现)" v-if="myModulePower.edit">保存</el-button>
                        <el-button size="small" class="btn-cancel" @click="addVEMDeviceDialogVisible = false"
                                   title="热键(ESC)">取 消(ESC)</el-button>
                    </span>
        </el-dialog>
    </div>
</template>

<script>
    // 公共库，组件
    import Vue from 'vue';
    import md5  from 'js-md5';
    import SlBaiduMap from '@/components/sl-baiduMap';
    import Levelbar from 'views/layout/Levelbar';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';
    import {validatePassWD} from '@/utils/validate';
    // API库
    import {
        getShopVEMDevInfo,
        addShopVEM,
        addPosByGroup,
        updateShopPosInfo,
        operateShopVEM,
        operateShopPosDevice
    } from '@/api/operations/shop/shop';
    import {getDeviceList, getGroupPopupList, getGroupPosPopupList} from '@/api/basic/group/group';
    // 业务组件
    import CollapsibleInfo from '../ShopInfo/collapsible-info';
    import ShopDeviceAisle from './shop-device-aisle';


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
        name: 'shop-device',
        components: {
            Levelbar,
            CollapsibleInfo,
            SlBaiduMap,
            ShopDeviceAisle
        },
        mixins: [RouterMixins, ViewPage, ViewBtnsPower],
        watch: {
            VEMDevInfo: function (val, oldVal) {
                console.log('new: , old: ', val, oldVal)
            }
        },
        data() {
            // 校验售卖机名称
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
            // 校验放置地点
            var validateAddress = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('放置地点不能为空'));
                } else {
                    callback();
                }
            };
            // 校验密码
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (!(/^(\w){6,20}$/).test(value)) {
                    return callback(new Error('请输入6-20个字母、数字、下划线'));
                } else {
                    if (this.newVEM.checkPass !== '') {
                        this.$refs.newVEM.validateField('checkPass');
                    }
                    callback();
                }
            };
            // 校验第二次输入的密码
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (!(/^(\w){6,20}$/).test(value)) {
                    return callback(new Error('请输入6-20个字母、数字、下划线'));
                } else if (value !== this.newVEM.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                // 店铺售卖机信息 => 加载进度条
                loading: false,
                // 自定义面包屑列表
                levelList: ['运营应用', '店铺管理', '店铺设备'],
                // 店铺列表某条记录信息
                shopInfo: {},
                // 店铺售卖机信息
                posInfo: {},
                // 店铺设备货柜信息
                deviceInfo: {},
                // 店铺售卖机信息(包括主控，货柜)
                VEMDevInfo: [],
                // 展示售卖机【设备】信息还是展示售卖机【货道】信息
                isShowVEMDev: true,
                // 【新增售卖机】弹出框
                addVEMDialogVisible: false,
                addVEMDialogTitle: '新增售卖机',
                addVEMDialogLoading: false,
                opType: 0,// 售卖机操作: 1-复制  2-删除 -2-其它操作(例如:-2 新增 -3 编辑)
                isShowPass: true,// 是否显示密码
                newVEM: {// 新增售卖机信息
                    groupValue: '',
                    groupPosValue: '',
                    posId: -1,
                    posName: '',
                    address: '',
                    pass: '',
                    checkPass: ''
                },
                groupOptions: [],// 按照模板新增的店组信息
                groupPosOptions: [],// 按照模板新增的店组售卖机摘要信息
                // 【新增设备】弹出框
                addVEMDeviceDialogVisible: false,
                devTypeAutoCompleteName: '',
                devList: [],
                sType: 0,// 设备种类 -1全部  0：主控   1：货柜
                setDevindex: 0, // 设备编号
                setDevindexMin: 1, // 设备编号起始值
                newPosInfo: {},
                newDeviceInfo: {},
                // 页面表单元素校验规则
                rules: {
                    posName: [
                        {required: true, validator: validatePosName, trigger: 'blur'}
                    ],
                    address: [
                        {required: true, validator: validateAddress, trigger: 'change'}
                    ],
                    pass: [
                        {required: true, validator: validatePass, trigger: 'change'},
                    ],
                    checkPass: [
                        {required: true, validator: validatePass2, trigger: 'change'},
                    ],
                    groupPosValue: [
                        {type: "number", required: true, message: '选择模板不能为空', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            // 跳转到店铺详情
            goToShopItem() {
                this.$router.push({
                    path: 'shopInfo',
                    query: {shopId: this.shopInfo.eid, pageType: this.shopInfo.pageType || 3}
                });
            },
            // 切换到【货道】界面
            goToAisle(posInfo, deviceInfo) {
                this.posInfo = posInfo;
                this.deviceInfo = deviceInfo;
                this.isShowVEMDev = false;
            },
            // 切换到【设备】界面
            goToDevice() {
                this.posInfo = {};
                this.deviceInfo = {};
                this.isShowVEMDev = true;
            },
            // 跳转货柜设备详情界面(与其他模块 => "设备类型管理" 界面对接)
            goToDeviceDetail(posInfo, deviceInfo) {
                this.$router.push({
                    path: '/basic/deviceDetail',
                    query: {opType: 'view', title: '设备类型(详情)', devTypeid: deviceInfo.devTypeid}
                });
            },
            // 【API】店组弹出框列表
            getGroupPopupList(){
                let shopEid = this.shopInfo.eid;
                return getGroupPopupList(shopEid).then((res) => {
                    console.log('[店铺管理-店铺详情-设备管理]店组弹出框列表 =>: ', res)
                    this.groupOptions = res.result;
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 【API】店组售卖机弹出框列表
            getGroupPosPopupList(groupValue){
                let groupId = groupValue;
                return getGroupPosPopupList(groupId).then((res) => {
                    console.log('[店铺管理-店铺详情-设备管理]店组售卖机弹出框列表 =>: ', res)
                    this.groupPosOptions = res.result;
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 【API】获取设备模版列表
            getShopVEMDevInfo(){
                this.loading = true;
                let shopEid = this.shopInfo.eid;
                return getShopVEMDevInfo(shopEid).then((res) => {
                    this.VEMDevInfo = res.result;
                    this.loading = false;
                }).catch((err) => {
                    console.log(err);
                    this.VEMDevInfo = [];
                    this.loading = false;
                })
            },
            // 【店组弹出框列表改变时候】获取店组售卖机弹出框列表
            groupValueChange(groupValue) {
                this.newVEM.groupPosValue = '';
                this.groupPosOptions = [];
                if (!!groupValue) this.getGroupPosPopupList(groupValue);
            },
            // 货道新增一行
            addSlaveRow() {
                this.$refs['shopAisle'].addSlaveRow();
            },
            // 保存售卖机信息(按模板新增，新增，复制，编辑操作)
            saveVEM() {
                this.addVEMDialogLoading = true;
                // 按模板新增售卖机 操作
                if (this.opType === -1) {
                    this.$refs['newVEM'].validate((valid) => {
                        if (valid) {
                            let request = {
                                shopEid: this.shopInfo.eid,
                                posId: this.newVEM.groupPosValue,
                                groupId: this.newVEM.groupValue,
                                posName: this.newVEM.posName,
                                pwd: '0x' + md5(this.newVEM.pass),
                                address: this.newVEM.address
                            };
                            addPosByGroup(request).then((res) => {
                                this.handleAddVEMDialog();
                                this.$message({
                                    message: '按模板新增售卖机成功',
                                    type: 'success'
                                });
                                this.getShopVEMDevInfo();
                                this.addVEMDialogLoading = false;
                            }).catch((err) => {
                                console.log(err);
                                this.addVEMDialogLoading = false;
                            })
                        } else {
                            this.addVEMDialogLoading = false;
                        }
                    })
                }
                // 新增售卖机 操作
                if (this.opType === -2) {
                    this.$refs['newVEM'].validate((valid) => {
                        if (valid) {
                            let shopEid = this.shopInfo.eid,
                                pwd = '0x' + md5(this.newVEM.pass),
                                address = this.newVEM.address,
                                posName = this.newVEM.posName;
                            addShopVEM(shopEid, posName, pwd, address).then((res) => {
                                this.handleAddVEMDialog();
                                this.$message({
                                    message: '新增售卖机成功',
                                    type: 'success'
                                });
                                this.getShopVEMDevInfo();
                                this.addVEMDialogLoading = false;
                            }).catch((err) => {
                                console.log(err);
                                this.addVEMDialogLoading = false;
                            })
                        } else {
                            this.addVEMDialogLoading = false;
                        }
                    })
                }
                // 复制售卖机 操作
                if (this.opType === 1) {
                    this.$refs['newVEM'].validateField('posName', (errorMessage) => {
                        if (!errorMessage) {
                            let shopEid = this.shopInfo.eid,
                                posId = this.newVEM.posId,
                                posName = this.newVEM.posName;
                            operateShopVEM(shopEid, posId, this.opType, posName).then((res) => {
                                this.handleAddVEMDialog();
                                this.$message({
                                    message: '复制售卖机成功',
                                    type: 'success'
                                });
                                this.getShopVEMDevInfo();
                                this.addVEMDialogLoading = false;
                            }).catch((err) => {
                                console.log(err);
                                this.addVEMDialogLoading = false;
                            })
                        } else {
                            this.addVEMDialogLoading = false;
                            this.$message.error(errorMessage);
                        }
                    });
                }
                // 编辑售卖机 操作
                if (this.opType === -3) {
                    this.$refs['newVEM'].validateField('address', (errorMessage) => {
                        if (!errorMessage) {
                            this.$refs['newVEM'].validateField('pass', (errorMessage) => {
                                if (!errorMessage) {
                                    this.$refs['newVEM'].validateField('checkPass', (errorMessage) => {
                                        if (!errorMessage) {
                                            let posId = this.newVEM.posId,
                                                pwd = '0x' + md5(this.newVEM.pass),
                                                address = this.newVEM.address,
                                                myposId = '';
                                            updateShopPosInfo(posId, pwd, address, myposId).then((res) => {
                                                this.handleAddVEMDialog();
                                                this.$message({
                                                    message: '更新售卖机信息成功',
                                                    type: 'success'
                                                });
                                                this.getShopVEMDevInfo();
                                                this.addVEMDialogLoading = false;
                                            }).catch((err) => {
                                                console.log(err);
                                                this.addVEMDialogLoading = false;
                                            })
                                        } else {
                                            this.addVEMDialogLoading = false;
                                            this.$message.error(errorMessage);
                                        }
                                    });
                                } else {
                                    this.addVEMDialogLoading = false;
                                    this.$message.error(errorMessage);
                                }
                            });
                        } else {
                            this.addVEMDialogLoading = false;
                            this.$message.error(errorMessage);
                        }
                    })
                }
            },
            // 【关闭弹出框】新增售卖机
            handleAddVEMDialog() {
                // 关闭弹出框
                this.addVEMDialogVisible = false;
                // 清空模型数据
                this.newVEM = {
                    groupValue: '',
                    groupPosValue: '',
                    posId: -1,
                    posName: '',
                    address: '',
                    pass: '',
                    checkPass: ''
                };
                // 0不属于任何操作
                this.opType = 0;
                // 清除重置错误提示消息
                this.$refs['newVEM'].resetFields();
            },
            // 【打开弹出框】新增售卖机
            addVEM(opType, posInfo, dialogtitle) {
                // 显示弹出框
                this.addVEMDialogVisible = true;
                // 更改操作标识
                this.opType = opType;
                // 显示"设置密码"
                this.isShowPass = true;
                // 带过来的售卖机信息
                this.newVEM = Object.assign({}, this.newVEM, posInfo);
                // 更改弹出框标题
                this.addVEMDialogTitle = dialogtitle;
                // 如果是按模板新增则需要获取模板列表信息
                if (opType === -1) {
                    this.getGroupPopupList();
                }
            },
            // 复制，删除售卖机
            operateVEM(item, opType){
                if (opType === 1) {
                    this.newVEM = {
                        posId: item.posId, // 原来售卖机ID
                        posName: item.posName || '',
                        address: '',
                        pass: '',
                        checkPass: ''
                    }
                    this.addVEMDialogVisible = true;
                    this.addVEMDialogTitle = '复制售卖机';
                    this.opType = opType;
                } else if (opType === 2) {
                    let shopEid = this.shopInfo.eid,
                        posId = item.posId,
                        posName = item.posName;
                    this.$confirm('是否删除售卖机?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        operateShopVEM(shopEid, posId, opType, posName).then((res) => {
                            this.handleAddVEMDialog();
                            this.$message({
                                message: '删除售卖机成功',
                                type: 'success'
                            });
                            this.getShopVEMDevInfo();
                        }).catch((err) => {
                            console.log(err);
                        })
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            // 【打开弹出框】新增设备
            openAddVEMDevice(posInfo) {
                console.log('[店铺管理-店铺详情-设备管理]售卖机信息: ', posInfo);
                this.devTypeAutoCompleteName = '';
                this.addVEMDeviceDialogVisible = true;
                this.setDevindexMin = !!posInfo.slaveDevTempList && posInfo.slaveDevTempList.length > 0 ? posInfo.slaveDevTempList[posInfo.slaveDevTempList.length - 1].devindex + 1 : 1;
                this.setDevindex = this.setDevindexMin;
                this.newPosInfo = posInfo;
            },
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
                    this.$message({
                        message: `获取设备信息失败`,
                        type: 'error'
                    });
                })
            },
            // 通过“组件事件”【打开弹出框】新增设备
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
                this.getDeviceList(sType)
            },
            // 处理选择项事件
            handleSelectDevTypeAutoComplete(item) {
                this.newDeviceInfo = item;
            },
            // 处理点击自动完成后缀图标事件
            handleIconClickDevTypeAutoComplete() {
                this.$refs.devTypeName.handleFocus();
            },
            // 移除、新增设备
            operateVEMDevice(posInfo, deviceInfo, type, sType){
                var _this = this,
                    _operateVEMDevice = function () {
                        var shopEid = _this.shopInfo.eid,
                            posId = posInfo.posId,
                            devId = deviceInfo.devId,
                            devtypeid = deviceInfo.devTypeid,
                            index = sType === 0 ? 0 : deviceInfo.devindex;
                        if(!devtypeid) {
                            _this.$message({
                                message: `设备类型不存在，请选择`,
                                type: 'error'
                            });
                            _this.addVEMDeviceDialogVisible = true;
                            return;
                        }
                        operateShopPosDevice({shopEid, posId, devId, index, type, devtypeid}).then((res) => {
                            if (!!res && !!res.retCode && res.retCode === 'SUCCESS') {
                                _this.$message({
                                    message: type === 1 ? `新增设备成功` : `移除设备成功`,
                                    type: 'success'
                                });
                            } else {
                                _this.$message({
                                    message: res.retMsg || '操作失败',
                                    type: 'error'
                                });
                            }
                            _this.getShopVEMDevInfo();
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
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
                this.operateVEMDevice(posInfo, deviceInfo, 1, sType);
            },
            // 组件初始化
            init() {
                this.goToDevice();
                this.shopInfo = JSON.parse(this.$route.query.shopInfo);
                this.getShopVEMDevInfo();
            }
        },
        activated() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .shop-device {
        .sl-operator-panel {
            .sl-operator-left {
                left: 250px !important;
            }
            .sl-operator-right {
                .add-vending-machine-by-template {
                    margin-right: 15px;
                }
            }
        }
        .sl-content-panel {
            margin-top: 0 !important;
        }
        .sl-card-panel {
            border: 1px solid #ccc;
            .sl-card-item {
                &:hover {
                    background-color: #e7f3fd !important
                }
                min-height: 282px;
                padding: 10px;
                .panel-title {
                    /*width: 400px;*/
                    font-size: 14px;

                    &:hover .edit-vem {
                        display: inline;
                    }
                    .address {
                        display: inline-block;
                        width: 150px;
                        vertical-align: bottom;
                    }
                    .edit-vem {
                        display: none;
                        margin-left: 5px;
                        color: #28e;
                    }
                }
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
                }
            }
        }

        .el-dialog--tiny {
            width: 580px;
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