<template>
    <div class="container deviceDetail">
        <div class="slic-head-panel">
            <span style="width: 280px;display: inline-block;">
                <levelbar>
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【基础管理-设备类型管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 管理三只熊采购的设备型号；</p>
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
                <el-button type="primary" size="small" @click="doEdit($event)" v-show="myModulePower.edit">编辑</el-button>
                <!--<el-button-group>-->
                    <!--<el-button type="primary" size="small" @click="operateDev($event)" v-if="opType !== 'add' && myModulePower.edit">
                        {{deviceInfo.status == 1 ? '禁用' : '启用'}}
                    </el-button>-->
                    <!--<el-button type="primary" size="small" @click="doEdit($event)" v-show="opType === 'view' && myModulePower.edit">编辑</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doSave($event)" v-show="opType !== 'view'">保存</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doCancel($event)">取消</el-button>-->
                <!--</el-button-group>-->
            </div>
        </div>
        <div class="slic-content" v-loading="load2">
            <div class="slic-content-info" :class="opType">
                <el-form class="sl-form-group" :inline="true" :model="deviceInfo" ref="devForm"
                         label-width="130px">
                    <div class="sl-row-group">

                        <el-row>
                            <el-col :span="8" >
                                <div class="sl-row-group-title">
                                    基本信息
                                    <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                                </div>
                            </el-col>



                            <el-col :span="8" >
                                <el-form-item label="状态：" class="el-form-item-detail" >
                                    <!--{{myUserInfo.status === 0 ? '禁用' : '启用'}}-->
                                    <el-switch
                                            :width="60"
                                            v-model="mystatus"
                                            on-text="启用"
                                            @change="operateDev"
                                            :disabled="true"
                                            off-text="禁用">
                                    </el-switch>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <span class="animated fadeIn" v-show="iconInfo">
                            <el-form-item label="设备类型名称：" prop="devTypeName" style="width: 320px;" :title="deviceInfo.devTypeName" class="el-form-item-detail">
                            <label v-text="deviceInfo.devTypeName"></label>
                        </el-form-item>

                        <el-form-item label="生产厂家：" prop="factory" style="width: 320px;" :title="deviceInfo.factory" class="el-form-item-detail">

                            <label v-text="deviceInfo.factory"></label>
                        </el-form-item>

                        <el-form-item label="设备种类：" prop="sType" style="width: 320px;" class="el-form-item-detail">

                            <label v-text="deviceInfo.sType === 0 ? '主控' : '货柜'" ></label>
                        </el-form-item>

                        <el-form-item label="货柜类型：" prop="devType" v-show="deviceInfo.sType == 1" style="width: 320px;" class="el-form-item-detail">

                            <label v-text="deviceInfo.devType === 1 ? '弹簧机' : '格子柜'" ></label>
                        </el-form-item>
                        </span>


                    </div>
                    <div class="sl-row-group" v-show="deviceInfo.sType == 0">
                        <div class="sl-row-group-title">
                            设备信息
                            <sl-icon-info :is-information-opened.sync="iconInfo1"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo1">
                            <el-form-item label="屏幕尺寸：" prop="displaySize" style="width: 320px;" :title="deviceInfo.displaySize" class="el-form-item-detail">
                            {{deviceInfo.displaySize}}寸
                        </el-form-item>

                        <el-form-item label="屏幕分辨率：" prop="displayRate" style="width: 320px;"  :title="deviceInfo.displayRate" class="el-form-item-detail">

                            <label v-text="deviceInfo.displayRate" ></label>
                        </el-form-item>

                        <el-form-item label="操作系统：" prop="systemVer" style="width: 320px;"  :title="deviceInfo.systemVer" class="el-form-item-detail">

                            <label v-text="deviceInfo.systemVer" ></label>
                        </el-form-item>

                        <el-form-item label="支持网络：" prop="netLinkType" style="width: 320px;"  :title="deviceInfo.netLinkTypeStr" class="el-form-item-detail">

                            <label v-text="deviceInfo.netLinkTypeStr"></label>
                        </el-form-item>
                        <el-form-item label="串口数：" prop="comNum" style="width: 320px;"  :title="deviceInfo.comNum" class="el-form-item-detail">

                            <label v-text="deviceInfo.comNum" ></label>
                        </el-form-item>
                        <el-form-item label="USB数：" prop="usbNum" style="width: 320px;"  :title="deviceInfo.usbNum" class="el-form-item-detail">

                            <label v-text="deviceInfo.usbNum" ></label>
                        </el-form-item>
                        <el-form-item label="备注：" class="notes el-form-item-detail" :title="deviceInfo.notes" >

                            <label v-text="deviceInfo.notes" ></label>
                        </el-form-item>
                        </span>


                    </div>
                    <div class="sl-row-group" v-show="deviceInfo.sType == 1">
                        <div class="sl-row-group-title">
                            设备信息
                            <sl-icon-info :is-information-opened.sync="iconInfo2"></sl-icon-info>
                        </div>

                        <span class="animated fadeIn" v-show="iconInfo2">
                            <el-form-item label="最大支持行数：" prop="maxRow" style="width: 320px;" class="el-form-item-detail">

                            <label v-text="deviceInfo.maxRow"></label>
                        </el-form-item>
                        <el-form-item label="最大支持列数：" prop="maxCol" style="width: 320px;" class="el-form-item-detail">

                            <label v-text="deviceInfo.maxCol" ></label>
                        </el-form-item>
                        <el-form-item label="每货道满存储数：" prop="chnMaxSize" class="longLabel el-form-item-detail" style="width: 320px;" >

                            <label v-text="deviceInfo.chnMaxSize" ></label>
                        </el-form-item>
                        <el-form-item label="货柜最大存货数：" style="width: 320px;" class="el-form-item-detail">
                            <span>{{deviceInfo.maxRow * deviceInfo.maxCol * deviceInfo.chnMaxSize}}</span>

                        </el-form-item>
                        <el-form-item label="设备尺寸：" prop="spec" style="width: 320px;" class="el-form-item-detail">

                            <label v-text="deviceInfo.spec" ></label>
                        </el-form-item>
                        <el-form-item label="储存方式：" style="width: 320px;" class="el-form-item-detail">
                            <el-checkbox v-model="deviceInfo.isCold" disabled>冷藏</el-checkbox>
                            <el-checkbox v-model="deviceInfo.isWarm" disabled>加热</el-checkbox>
                        </el-form-item>
                        <el-form-item label="备注：" class="notes" :title="deviceInfo.notes">

                            <label v-text="deviceInfo.notes" ></label>
                        </el-form-item>
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
        name: 'deviceDetail',
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
                iconInfo: true,
                iconInfo1: true,
                iconInfo2: true,
                opType: '',
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

            this.getDeviceInfo(this.$route.query.devTypeid);

        },

        methods: {
            // 获取设备详情
            getDeviceInfo(devTypeId) {
                this.load2 = true;
                getDeviceDetail(devTypeId).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        console.log(res);
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
                                    this.deviceInfo.netLinkTypeStr = 'Wifi';
                                    break;
                                case 2:
                                    this.deviceInfo.netLinkType = [2];
                                    this.deviceInfo.netLinkTypeStr = '4G';
                                    break;
                                case 3:
                                    this.deviceInfo.netLinkType = [1, 2];
                                    this.deviceInfo.netLinkTypeStr = 'Wifi、4G';
                                    break;
                                case 4:
                                    this.deviceInfo.netLinkType = [4];
                                    this.deviceInfo.netLinkTypeStr = 'Lan';
                                    break;
                                case 5:
                                    this.deviceInfo.netLinkType = [1, 4];
                                    this.deviceInfo.netLinkTypeStr = 'Wifi、Lan';
                                    break;
                                case 6:
                                    this.deviceInfo.netLinkType = [2, 4];
                                    this.deviceInfo.netLinkTypeStr = '4G、Lan';
                                    break;
                                case 7:
                                    this.deviceInfo.netLinkType = [1, 2, 4];
                                    this.deviceInfo.netLinkTypeStr = 'Wifi、4G、Lan';
                                    break;
                                default:
                                    this.deviceInfo.netLinkType = [];
                                    this.deviceInfo.netLinkTypeStr = '';
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
//                            this.deviceInfo.isWarm = this.deviceInfo.ifWarm == 1;
                            this.deviceInfo.netLinkType = [];
                            this.deviceInfo.systemVer = '';
                        }
                        this.$set(this.deviceInfo, 'sType', res.result.sType);
//                        this.$set(this.deviceInfo, 'devType', res.result.slaveDevInfo );

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 编辑
            doEdit() {
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/basic/deviceEdit', query: {title: '设备类型编辑', opType: 'edit',devTypeid: this.$route.query.devTypeid}});

            },
            // 禁用
            operateDev() {
                this.load2 = true;
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
                });
            },
            // 返回
            doBack () {
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/basic/device'});
            },
            // 主设备类型选择
            sTypeChange(val) {
//                console.log(val);
//                this.$set(this.deviceInfo, 'dev', res.result.sType);
//                this.rules = val === 0 ? this.rules1 : this.rules2;
            }
        }

    }

</script>

<style rel="stylesheet/scss" lang="scss">
    .deviceDetail {
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

        .notes {
            .el-form-item__content {
                width: 520px;
            }
        }

        .textLong {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 190px;
            display: inline-block;
        }

        .el-form-item__content{/*字段超出隐藏*/
            width: 190px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

    }
    

</style>
