<template>
    <div class="container deviceEdit">
        <div class="slic-head-panel">
            <span style="width: 280px;display: inline-block;">
                <levelbar :levelList="['基础管理', this.opType === 'add' ? '新增设备类型' : '设备类型编辑']">
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【基础管理-设备类型管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 管理企业采购的设备型号；</p>
                                <p>2. 对设备信息进行查看、新建、修改、删除；</p>
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
                <el-button-group>
                    <!--<el-button type="primary" size="small" @click="operateDev($event)" v-if="opType !== 'add' && myModulePower.edit">
                        {{deviceInfo.status == 1 ? '禁用' : '启用'}}
                    </el-button>-->
                    <!--<el-button type="primary" size="small" @click="doEdit($event)" v-show="opType === 'view' && myModulePower.edit">编辑</el-button>-->
                    <el-button type="primary" size="small" @click="doSave($event)" >保存</el-button>
                    <el-button type="primary" size="small" @click="doCancel($event)">取消</el-button>
                </el-button-group>
            </div>
        </div>
        <div class="slic-content" v-loading="load2">
            <div class="slic-content-info" :class="opType">
                <el-form class="sl-form-group" :model="deviceInfo" :rules="rules1" ref="devForm"
                         label-width="130px">
                    <div class="sl-row-group">

                        <el-row >
                            <el-col :span="8" >
                                <div class="sl-row-group-title">
                                    基本信息
                                    <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                                </div>
                            </el-col>

                            <el-col :span="8" v-if="opType === 'edit'">
                                <el-form-item label="状态：" class="el-form-item-detail" >
                                    <!--{{myUserInfo.status === 0 ? '禁用' : '启用'}}-->
                                    <el-switch
                                            :width="60"
                                            v-model="mystatus"
                                            on-text="启用"
                                            @change="operateDev"
                                            off-text="禁用">
                                    </el-switch>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <span class="animated fadeIn" v-show="iconInfo" >
                            <el-row class="sl-form-row"  :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="设备类型名称：" prop="devTypeName" >
                                    <sl-input size="small" :input-val.sync="deviceInfo.devTypeName" placeholder="请输入设备类型名称"></sl-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="生产厂家：" prop="factory" >
                                    <sl-input size="small" :input-val.sync="deviceInfo.factory" placeholder="请输入生产厂家"></sl-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="设备种类：" prop="sType" >
                                    <el-select v-model="deviceInfo.sType" placeholder="请选择设备类型" size="small"
                                               @change="sTypeChange" style="width: 100%;">
                                        <el-option :key="0" :label="'主控'" :value="0"></el-option>
                                        <el-option :key="1" :label="'货柜'" :value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>



                        <el-row class="sl-form-row" :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="货柜类型：" prop="devType" v-show="deviceInfo.sType == 1">
                                    <el-select filterable v-model="deviceInfo.devType" placeholder="请选择设备类型"
                                               size="small"  style="width: 100%;" @change="devtypeChange">
                                        <el-option :key="1" :label="'弹簧机'" :value="1"></el-option>
                                        <!--<el-option :key="2" :label="'蛇形机'" :value="2"></el-option>-->
                                        <el-option :key="3" :label="'格子柜'" :value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        </span>



                    </div>

                </el-form>

                <el-form class="sl-form-group" :model="deviceInfo" :rules="rules2" ref="mainForm"
                         label-width="130px">
                    <div class="sl-row-group" v-show="deviceInfo.sType == 0">
                        <div class="sl-row-group-title">
                            设备信息
                            <sl-icon-info :is-information-opened.sync="iconInfo1"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo1" >
                            <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="屏幕尺寸：" prop="displaySize" >
                                    <el-input size="small" v-model="deviceInfo.displaySize"  placeholder="请输入屏幕尺寸" :maxlength="16">
                                        <template slot="append">寸</template>
                                    </el-input>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="屏幕分辨率：" prop="displayRate" >
                                    <el-input size="small" v-model="deviceInfo.displayRate" placeholder="请输入屏幕分辨率" :maxlength="16"></el-input>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="操作系统：" prop="systemVer" >
                                    <el-select filterable v-model="deviceInfo.systemVer" placeholder="请选择操作系统"
                                               size="small"  style="width: 100%;">
                                        <el-option :key="1" :label="'Android'" :value="'Android'"></el-option>
                                        <el-option :key="2" :label="'windows'" :value="'windows'"></el-option>
                                        <el-option :key="3" :label="'linux'" :value="'linux'"></el-option>
                                        <el-option :key="4" :label="'其他'" :value="'其他'"></el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>
                        </el-row>


                        <el-row  :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="支持网络：" prop="netLinkType" >
                                    <el-select filterable v-model="deviceInfo.netLinkType" placeholder="请选择支持网络" style="width: 100%;"
                                               size="small" multiple  >
                                        <el-option :key="3" :label="'Wifi'" :value="1"></el-option>
                                        <el-option :key="1" :label="'4G'" :value="2"></el-option>
                                        <el-option :key="2" :label="'Lan'" :value="4"></el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="串口数：" prop="comNum" >
                                    <el-input-number v-model="deviceInfo.comNum" :min="1" size="small" :max="99"
                                                     style="width: 100%;"></el-input-number>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="USB数：" prop="usbNum">
                                    <el-input-number v-model="deviceInfo.usbNum" :min="1" size="small" :max="99"
                                                     style="width: 100%;"></el-input-number>

                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row  :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注：" >
                                    <el-input
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            placeholder="请输入内容"
                                            :maxlength="32"
                                            v-model="deviceInfo.notes">
                                    </el-input>

                                </el-form-item>
                            </el-col>


                        </el-row>
                        </span>

                    </div>

                </el-form>
                <el-form class="sl-form-group" :model="deviceInfo" :rules="rules3" ref="slaveForm"
                         label-width="130px">
                    <div class="sl-row-group" v-show="deviceInfo.sType == 1">
                        <div class="sl-row-group-title">
                            设备信息
                            <sl-icon-info :is-information-opened.sync="iconInfo2"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo2" >
                            <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="最大支持行数：" prop="maxRow" >
                                    <el-input-number v-model="deviceInfo.maxRow" :min="1" :max="deviceInfo.devType === 1 ? 9 : 100" size="small"
                                                     style="width: 100%;"></el-input-number>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="最大支持列数：" prop="maxCol" >
                                    <el-input-number v-model="deviceInfo.maxCol" :min="1" :max="deviceInfo.devType === 1 ? 9 : 100" size="small"
                                                     style="width: 100%;"></el-input-number>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="每货道满存储数：" prop="chnMaxSize" class="longLabel" >
                                    <el-input-number v-model="deviceInfo.chnMaxSize" :min="1" :max="deviceInfo.devType === 3 ? 1 : 100" size="small"
                                                     style="width: 100%;"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="货柜最大存货数：" >
                                    <span class="noEditText" style="width: 100%;">{{deviceInfo.maxRow * deviceInfo.maxCol * deviceInfo.chnMaxSize}}</span>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="设备尺寸：" prop="spec" >
                                    <el-input v-model="deviceInfo.spec" size="small" :maxlength="32"
                                              style="width: 100%;"></el-input>

                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="储存方式：" >
                                    <el-checkbox v-model="deviceInfo.isCold" >冷藏</el-checkbox>
                                    <el-checkbox v-model="deviceInfo.isWarm" >加热</el-checkbox>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="16">
                                <el-form-item label="备注：">
                                    <el-input
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            placeholder="请输入内容"
                                            :maxlength="32"
                                            v-model="deviceInfo.notes">
                                    </el-input>

                                </el-form-item>
                            </el-col>

                        </el-row>

                        </span>


                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import SlTree from '@/components/sl-tree-select.vue'
    import Levelbar from '@/views/layout/Levelbar.vue'
    import SlInput from '@/components/sl-input.vue';
    import {mapGetters} from 'vuex';
    import RouterMixins from '@/mixins/router';
    import {addNewDevice, operateDevice, getDeviceDetail, changeDevice} from '@/api/basic/device';
    export default {
        components: {
            Levelbar,
            SlTree,
            SlInput
        },
        name: 'deviceEdit',
        mixins: [RouterMixins],
        data () {
            let myRule_require = (rule, value, callback) => {
                console.log(value);
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return {
                load2: false,
                opType: '',
                iconInfo: true,
                iconInfo1: true,
                iconInfo2: true,
                mystatus: false,
                deviceInfo: {
                    devTypeName: '',
                    factory: '',
                    sType: 0,
                    maxRow: 1,
                    maxCol: 1,
                    chnMaxSize: 1,
                    comNum: 1,
                    usbNum: 1,
                    devType: '',
                    systemVer: '',
                    netLinkType: [],
                    isCold: false,
                    isWarm: false,
                    spec: ''

                },
                rules1: {
                    devTypeName: [
                        {required: true, message: '请输入设备名称', trigger: 'blur'}
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    factory: [
                        {required: true, message: '请输入生产厂家', trigger: 'blur'}
                    ],
                    sType: [
                        {required: true, message: '请选择设备种类', trigger: 'change', type: 'number'}
                    ],
                    devType: [
                        {required: true, message: '请选择设备类型', trigger: 'change', type: 'number'}
                    ]
                },
                rules2: {
                    displaySize: [
                        {required: true, message: '请输入屏幕尺寸', trigger: 'blur'}
                    ],
                    displayRate: [
                        {required: true, message: '请输入屏幕分辨率', trigger: 'blur'}
                    ],
                    systemVer: [
                        {required: true, message: '请选择操作系统', trigger: 'change'}
                    ],
                    netLinkType: [
                        {required: true, message: '请选择支持网络', trigger: 'change', type: 'array'}
                    ],
                    comNum: [
                        {required: true, message: '请输入串口数', trigger: 'blur', type: 'number'}
                    ],
                    usbNum: [
                        {required: true, message: '请输入USB数', trigger: 'blur', type: 'number'}
                    ],
                },
                rules3: {
                    spec: [
                        {required: true, message: '请输入设备尺寸', trigger: 'blur'}
                    ],
                    maxRow: [
                        {required: true, message: '请输入最大行数', trigger: 'blur', type: 'number'}
                    ],
                    maxCol: [
                        {required: true, message: '请输入最大列数', trigger: 'blur', type: 'number'},
                    ],
                    chnMaxSize: [
                        {required: true, message: '请输入每货道满存储数', trigger: 'blur', type: 'number'}
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
            }
        },
        mounted: function () {
            this.$nextTick(function () {
//                console.log(this.$router.params)
                this.deviceInfo.maxNum = this.deviceInfo.maxRow * this.deviceInfo.maxCol * this.deviceInfo.chnMaxSize;
            })
        },
        activated: function () {
            this.opType = this.$route.query.opType;

            this.deviceInfo = {
                devTypeName: '',
                factory: '',
                sType: 0,
                maxRow: 1,
                maxCol: 1,
                chnMaxSize: 1,
                comNum: 1,
                usbNum: 1,
                devType: '',
                systemVer: '',
                netLinkType: [],
                isCold: false,
                isWarm: false,
                spec: ''
            };


            if (this.opType === 'edit') {
                this.getDeviceInfo(this.$route.query.devTypeid);
            } else {
                /*setTimeout(() => {
                    this.$refs['devForm'].resetFields();
                }, 200);*/

            }
        },

        methods: {
            // 获取设备详情
            getDeviceInfo(devTypeId) {
                this.load2 = true;
                getDeviceDetail(devTypeId).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        console.log(res);
//                        this.rules = res.result.sType === 0 ? this.rules1 : this.rules2;
//                        this.$message(res.retMsg);
                        if (res.result.sType == 0) {
                            for (let dev in res.result.mainDevInfo) {
                                this.deviceInfo[dev] = res.result.mainDevInfo[dev];
                            }
                            this.mystatus = this.deviceInfo.status === 1;
//                            this.deviceInfo = JSON.parse(JSON.stringify(res.result.mainDevInfo));
                            this.deviceInfo.usbNum = parseInt(this.deviceInfo.port.split('，')[0].split('个')[0]);
                            this.deviceInfo.comNum = parseInt(this.deviceInfo.port.split('，')[1].split('个')[0]);
//                            this.deviceInfo.netLinkType = [res.result.mainDevInfo.netLinkType];
                            switch (res.result.mainDevInfo.netLinkType) {
                                case 1:
                                    this.deviceInfo.netLinkType = [1];
                                    break;
                                case 2:
                                    this.deviceInfo.netLinkType = [2];
                                    break;
                                case 3:
                                    this.deviceInfo.netLinkType = [1, 2];
                                    break;
                                case 4:
                                    this.deviceInfo.netLinkType = [4];
                                    break;
                                case 5:
                                    this.deviceInfo.netLinkType = [1, 4];
                                    break;
                                case 6:
                                    this.deviceInfo.netLinkType = [2, 4];
                                    break;
                                case 7:
                                    this.deviceInfo.netLinkType = [1, 2, 4];
                                    break;
                                default:
                                    this.deviceInfo.netLinkType = [];
                                    break;
                            }


                        } else if (res.result.sType == 1) {
                            for (let dev in res.result.slaveDevInfo) {
                                this.deviceInfo[dev] = res.result.slaveDevInfo[dev];
                            }
                            this.mystatus = this.deviceInfo.status === 1;
//                            this.deviceInfo = JSON.parse(JSON.stringify(res.result.slaveDevInfo));
                            this.$set(this.deviceInfo, 'isCold', (this.deviceInfo.ifCold == 1));
                            this.$set(this.deviceInfo, 'isWarm', (this.deviceInfo.ifWarm == 1));

                            this.$set(this.deviceInfo, 'devType', res.result.slaveDevInfo.devType);
//                            this.deviceInfo.isWarm = this.deviceInfo.ifWarm == 1;
                            this.deviceInfo.netLinkType = [];
                            this.deviceInfo.systemVer = '';
                        }
                        this.$set(this.deviceInfo, 'sType', res.result.sType);
//                        this.$set(this.deviceInfo, 'devType', res.result.slaveDevInfo );
//                        this.rules = res.result.sType === 0 ? this.rules1 : this.rules2;
                        console.log('this.deviceInfo==', res.result)
                        console.log('this.deviceInfo==', this.deviceInfo)
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 保存
            doSave: function () {
//                this.rules = this.deviceInfo.sType === 0 ? this.rules1 : this.rules2;
                if(this.deviceInfo.sType == 0) {
                    this.deviceInfo.devType = 0;
                }

                this.$refs['devForm'].validate((valid) => {
                    if (valid) {


                        let odeviceInfo;

                        if (this.deviceInfo.sType == 0) {
                            this.$refs['mainForm'].validate((valid) => {
                                if(valid) {
                                    this.load2 = true;
                                    odeviceInfo = {
                                        devTypeId: this.deviceInfo.devTypeid,
                                        devTypeName: this.deviceInfo.devTypeName,
                                        status: this.deviceInfo.status,
                                        displaySize: this.deviceInfo.displaySize,
                                        displayRate: this.deviceInfo.displayRate,
                                        systemVer: this.deviceInfo.systemVer,
                                        factory: this.deviceInfo.factory,
                                        sType: 0,
                                        port: `${this.deviceInfo.usbNum}个端口，${this.deviceInfo.comNum}个串口`,
                                        notes: this.deviceInfo.notes
                                    }
                                    let netlink = 0;
                                    this.deviceInfo.netLinkType.forEach((item, i) => {
                                        netlink = netlink + item;
                                    })
                                    odeviceInfo.netLinkType = netlink;

                                    if (this.opType === 'add') {
                                        addNewDevice(odeviceInfo).then(res => {
                                            this.load2 = false;
                                            if (res.retCode === 'SUCCESS') {
                                                console.log(res);
                                                this.$message('新增设备类型成功！');
                                                this.$store.dispatch('delVisitedViews', this.$route.name);
                                                this.$router.push({path: '/basic/deviceDetail', query: {title: '设备类型详情', devTypeid: res.result}});
                                            } else {
                                                this.$message(res.retMsg);
                                            }
                                        }).catch(err => {
                                            this.load2 = false;
                                        })
                                    } else if (this.opType === 'edit') {
                                        odeviceInfo.devTypeId = this.$route.query.devTypeid;
                                        changeDevice(odeviceInfo).then(res => {
                                            this.load2 = false;
                                            if (res.retCode === 'SUCCESS') {
                                                console.log(res);
                                                this.$message('保存成功！');
                                                this.$store.dispatch('delVisitedViews', this.$route.name);
                                                this.$router.push({path: '/basic/deviceDetail', query: {title: '设备类型详情', devTypeid: this.deviceInfo.devTypeid}});
                                            } else {
                                                this.$message(res.retMsg);
                                            }
                                        }).catch(err => {
                                            this.load2 = false;
                                        })
                                    }
                                }
                            })

                        } else if (this.deviceInfo.sType == 1) {

                            this.$refs['slaveForm'].validate((valid) => {
                                if(valid) {
                                    this.load2 = true;
                                    odeviceInfo = {
                                        devType: this.deviceInfo.devType,
                                        devTypeId: this.deviceInfo.devTypeid,
                                        devTypeName: this.deviceInfo.devTypeName,
                                        status: this.deviceInfo.status,
                                        devType: this.deviceInfo.devType,
                                        sType: 1,
                                        factory: this.deviceInfo.factory,
                                        chnMaxSize: this.deviceInfo.chnMaxSize,
                                        maxRow: this.deviceInfo.maxRow,
                                        maxCol: this.deviceInfo.maxCol,
                                        chnMaxSize: this.deviceInfo.chnMaxSize,
                                        ifCold: this.deviceInfo.isCold ? 1 : 0,
                                        ifWarm: this.deviceInfo.isWarm ? 1 : 0,
                                        spec: this.deviceInfo.spec,
                                        notes: this.deviceInfo.notes

                                    }

                                    if (this.opType === 'add') {
                                        addNewDevice(odeviceInfo).then(res => {
                                            this.load2 = false;
                                            if (res.retCode === 'SUCCESS') {
                                                console.log(res);
                                                this.$message('新增设备类型成功！');
                                                this.$store.dispatch('delVisitedViews', this.$route.name);
                                                this.$router.push({path: '/basic/deviceDetail', query: {title: '设备类型详情', devTypeid: res.result}});
                                            } else {
                                                this.$message(res.retMsg);
                                            }
                                        }).catch(err => {
                                            this.load2 = false;
                                        })
                                    } else if (this.opType === 'edit') {
                                        odeviceInfo.devTypeId = this.$route.query.devTypeid;
                                        changeDevice(odeviceInfo).then(res => {
                                            this.load2 = false;
                                            if (res.retCode === 'SUCCESS') {
                                                console.log(res);
                                                this.$message('保存成功！');
                                                this.$store.dispatch('delVisitedViews', this.$route.name);
                                                this.$router.push({path: '/basic/deviceDetail', query: {title: '设备类型详情', devTypeid: this.deviceInfo.devTypeid}});
                                            } else {
                                                this.$message(res.retMsg);
                                            }
                                        }).catch(err => {
                                            this.load2 = false;
                                        })
                                    }
                                }
                            })
                        }
                        console.log(odeviceInfo, 'valid===', valid);
                    } else {
                        console.log('error submit!!', valid);
                        return false;
                    }
                });


            },
            // 取消
            doCancel() {
                this.$confirm('是否取消编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.opType === 'add') {
                        this.$refs['devForm'].resetFields();
                    } else if (this.opType === 'edit') {
                        this.getDeviceInfo(this.$route.query.devTypeid);
                    }
                }).catch()

            },

            // 禁用
            operateDev() {
                this.deviceInfo.status = this.deviceInfo.status == 1 ? 0 : 1;
                /*this.load2 = true;
                let opt = {
                    devTypeid: this.deviceInfo.devTypeid,
                    opType: this.deviceInfo.status == 1 ? 0 : 1
                };
                operateDevice(opt.devTypeid, opt.opType).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
//                        this.getUserListInfo();
                        if (this.deviceInfo.status == 1) {
                            this.deviceInfo.status = 0;
                        } else {
                            this.deviceInfo.status = 1;
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                });*/
            },
            // 返回
            doBack () {
                this.$confirm('是否取消编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                    this.$router.push({path: '/basic/device'});
                }).catch()
            },
            // 主设备类型选择
            sTypeChange(val) {
//                console.log(val);
//                this.$set(this.deviceInfo, 'dev', res.result.sType);
//                this.rules = val === 0 ? this.rules1 : this.rules2;
            },
            // 货柜设备类型选择
            devtypeChange(type) {
                console.log(type);
                if(type === 3) {
                    this.deviceInfo.chnMaxSize = 1;
                } else if(type === 1) {
                    this.deviceInfo.maxRow = this.deviceInfo.maxRow >= 9 ? 9 : this.deviceInfo.maxRow;
                    this.deviceInfo.maxCol = this.deviceInfo.maxCol >= 9 ? 9 : this.deviceInfo.maxCol;
                }
            },
            // 删除当前页
            /*delCurView(){
                this.$store.dispatch('delVisitedViews', this.$route.name);
            }*/
        },
        /*beforeRouteLeave (to, from, next) {
            if(this.pageType ===  ) {
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
        },*/
        watch: {
            'deviceInfo.sType': {
                handler: function(val) {
//                    this.rules = val === 0 ? this.rules1 : this.rules2;
                    if(val === 1 && !this.deviceInfo.devType) {
                        this.deviceInfo.devType = 1;
                    }
                },
                deep: true,

            }
        }
    }

</script>

<style rel="stylesheet/scss" lang="scss">
    .deviceEdit {
        .sl-content-row-item-textarea {
            width: 80%;
            /*height: 200px;*/
            vertical-align: top;
        }

        .sl-search-showPart {
            text-align: justify;
            padding-top: 15px;
        }

        .sl-search-showPart::after {
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

        .slic-content-info {
            &.view {
                .el-form-item {
                    margin-bottom: 5px;
                }
            }
        }

        .sl-content-row-item-input {
            /*text-align: left;*/
            display: inline-block;
        }

        .sl-dropdown {
            text-align: left;
            position: absolute;
            z-index: 999;
            left: calc(50% - 50px);
            width: 200px;
        }

        .noEditText {
            height: 30px;
            line-height: 30px;
            background-color: #f3f3f3;
            border-radius: 5px;
            width: 190px;
            display: inline-block;
            padding-left: 10px;
        }

        .sl-content-handle {
            background-color: #fff;
            border-radius: 5px;
        }

        .el-input-number__decrease, .el-input-number__increase {
            /*top: 3px;*/
        }

        .longLabel {
            .el-form-item__label {
                /*width: 140px !important;*/
            }

            .el-form-item__content {
                /*margin-left: 140px !important;*/
            }
        }


		.el-select__tags {
			max-width: 100% !important;
		}

    }

</style>
