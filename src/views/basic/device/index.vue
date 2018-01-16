<template>
    <div class="container deviceIndex">

        <div class="slic-head-panel">
            <span style="width: 260px;display: inline-block;">
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
            </span>
            <div style="float: right;">
                <el-button type="primary" size="small" @click="doAddDeviceType()" v-if="myModulePower.add">新增设备类型</el-button>
            </div>
        </div>

        <div class="slic-content">
            <div class="slic-content-info">
                <div class="slic-content-info-up">

                    <div class="sl-search-panel">
                        <div class="slic-input-group sl-search-item mr" style="width: 335px;">
                            <el-input size="small" style="width: 335px;" v-model="queryKey" :icon="queryKey ? 'circle-close' : ''" :on-icon-click="iconClose" placeholder="请输入设备类型名称">
                                <template slot="prepend">设备类型名称</template>
                            </el-input>
                        </div>

                        <div class="slic-input-group sl-search-item mr" style="width: 270px;">
                            <sl-select prepend="设备种类" >
                                <el-select filterable v-model="deviceType" placeholder="请选择设备类型" size="small" slot="ELSelect" style="width:100%;">
                                    <el-option :key="0" :label="'全部'" :value="-1"></el-option>
                                    <el-option :key="2" :label="'主控'" :value="2"></el-option>
                                    <el-option :key="1" :label="'弹簧机'" :value="1"></el-option>
                                    <el-option :key="3" :label="'格子柜'" :value="3"></el-option>
                                </el-select>
                            </sl-select>

                        </div>

                        <div class="slic-btn-group">
                            <el-button-group>
                                <el-button type="primary" size="small" @click="doSearch()">查询</el-button>
                                <el-button type="primary" size="small" @click="doReset()">重置</el-button>
                            </el-button-group>
                        </div>
                    </div>

                </div>

                <div class="slic-content-info-down" v-loading="load2">
                    <div class="el-table__empty-text" v-if="deviceList.mainDevList.length === 0 && deviceList.slaveDevList.length === 0">暂无数据</div>
                    <el-row :gutter="10">


                        <el-col :span="4" v-for="(dev, index) in deviceList.mainDevList" :key="index">
                            <div class="sl-content-card">
                                <div class="sl-content-card-main">
                                    <div class="sl-content-card-title">
                                    <span class="sl-content-card-name">
                                        主控
                                    </span>
                                        <span class="sl-content-card-num" :title="dev.devTypeName">
                                        {{dev.devTypeName}}
                                    </span>
                                    </div>
                                    <ul class="sl-content-card-body">
                                        <li class="sl-content-card-body-list">{{dev.displaySize}}  {{dev.displayRate}}</li>
                                        <li class="sl-content-card-body-list">{{dev.systemVer}}</li>
                                        <li class="sl-content-card-body-list">网络： {{dev.netLinkType | netLinkFilter}}</li>
                                        <li class="sl-content-card-body-list">串口：{{dev.comNum}}</li>
                                        <li class="sl-content-card-body-list">USB：{{dev.usbNum}}</li>
                                    </ul>
                                </div>
                                <div class="sl-content-card-oper">
                                    <span class="sl-content-card-oper-btn" @click.stop="goToDetail(dev)">详情</span>
                                    <span class="sl-content-card-oper-btn" v-if="myModulePower.edit">|</span>
                                    <span class="sl-content-card-oper-btn" @click.stop="operateDev(dev)" v-if="myModulePower.edit">{{dev.status == 1 ? '禁用' : '启用'}}</span>
                                </div>

                                <i class="status-mark-forbid" v-if="dev.status == 0">已禁用</i>
                            </div>
                        </el-col>

                        <el-col :span="4" v-for="(dev, index) in deviceList.slaveDevList" :key="index">
                            <div class="sl-content-card">
                                <div class="sl-content-card-main">
                                    <div class="sl-content-card-title">
                                    <span class="sl-content-card-name">
                                        货柜
                                    </span>
                                        <span class="sl-content-card-num" :title="dev.devTypeName">
                                        {{dev.devTypeName}}
                                    </span>
                                    </div>
                                    <ul class="sl-content-card-body">
                                        <li class="sl-content-card-body-list" v-if="dev.devType == 1">弹簧机</li>
                                        <li class="sl-content-card-body-list" v-if="dev.devType == 2">蛇形机</li>
                                        <li class="sl-content-card-body-list" v-if="dev.devType == 3">格子柜</li>
                                        <li class="sl-content-card-body-list">{{dev.maxRow}}行{{dev.maxCol}}列{{dev.maxRow * dev.maxCol}}货道</li>
                                        <li class="sl-content-card-body-list">货道最大存货： {{dev.chnMaxSize}}</li>
                                        <li class="sl-content-card-body-list">储存：{{dev.saveType}}</li>
                                        <li class="sl-content-card-body-list">&nbsp</li>
                                    </ul>
                                </div>
                                <div class="sl-content-card-oper">
                                    <span class="sl-content-card-oper-btn" @click="goToDetail(dev)">详情</span>
                                    <span class="sl-content-card-oper-btn" v-if="myModulePower.edit">|</span>
                                    <span class="sl-content-card-oper-btn" @click.stop="operateDev(dev)" v-if="myModulePower.edit">{{dev.status == 1 ? '禁用' : '启用'}}</span>
                                </div>

                                <i class="status-mark-forbid" v-if="dev.status == 0">已禁用</i>
                            </div>

                        </el-col>
                    </el-row>

                </div>

            </div>
        </div>

    </div>


</template>

<script>
    import ElCheckbox from 'element-ui/packages/checkbox/src/checkbox'
    import ElButtonGroup from '../../../../node_modules/element-ui/packages/button/src/button-group';
    import Levelbar from '@/views/layout/Levelbar.vue'
    import {mapGetters} from 'vuex';
    import {getDeviceList, operateDevice} from '@/api/basic/device';
    export default {
        components: {
            ElButtonGroup,
            Levelbar,
            ElCheckbox
        },
        name: 'deviceman',
        data () {
            return {
                load2: false,
                deviceType: '',
                queryKey: '',
                partnerInfo: {},
                deviceList: []
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


                this.getDevice();
            })
        },
        activated: function () {
            this.getDevice();
        },
        methods: {
            // 获取设备列表
            getDevice() {
                this.load2 = true;
                const _this = this;
                let opt = {
                    devTypeName: this.queryKey,
                    sType: -1,
                    devType: -1,
                    status: -1
                }
                console.log(this.deviceType)

                if(this.deviceType === -1) {
                    opt.sType = -1;
                    opt.devType = -1;

                } else if(this.deviceType === 1 || this.deviceType === 3) {
                    opt.sType = 1;
                    opt.devType = this.deviceType;
                } else if(this.deviceType === 2) {
                    console.log(123456)
                    opt.sType = 0;
                    opt.devType = -1;
                }

                getDeviceList(opt).then(res => {
                    this.load2 = false;
                      if(res.retCode === 'SUCCESS') {
                          console.log(res);
                          this.deviceList = res.result;

                          this.deviceList.mainDevList.forEach((item1, i) => {
                              item1.comNum = item1.port.split('，')[1];
                              item1.usbNum = item1.port.split('，')[0];
                          })
                          this.deviceList.slaveDevList.forEach((item2, j) => {
                              let str = '常温';
                              if (item2.ifCold) str = `${str}、冷藏`;
                              if (item2.ifWarm) str = `${str}、加热`;
//                              _this.$set(item2, 'saveType', str);
                              item2.saveType = str;
                          })

                      } else {
                          this.$message(res.retMsg);
                      }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 查询
            doSearch (data) {
                console.log('data==', data);
                this.getDevice();
            },
            // 重置
            doReset () {
                this.queryKey = '';
                this.userRole = '';
                this.deviceType = -1;
                this.getDevice();
            },
            // 跳转到详情
            goToDetail(obj) {
                this.$router.push({path: '/basic/deviceDetail', query: {opType: 'view', title: '设备类型详情', devTypeid: obj.devTypeid}});
            },
            // 新建设备类型
            doAddDeviceType() {
                this.$router.push({path: '/basic/deviceEdit', query: {opType: 'add', title: '新增设备类型'}});
//                this.$router.push({path: '/basic/deviceDetail', query: {opType: 'edit', devTypeid: 4}});
            },
            // 禁用/启用设备
            operateDev(obj) {
                this.load2 = true;
                let opt = {
                    devTypeid: obj.devTypeid,
                    opType: obj.status == 1 ? 0 : 1
                };
                operateDevice(opt.devTypeid, opt.opType).then(res => {
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
            },
            iconClose(str) {
                this.queryKey = '';
            }
        },
        filters: {
            netLinkFilter: function(val) {
                console.log('filter==', val);
                switch (val) {
                    case 1:
                        return 'Wifi';break;
                    case 2:
                        return '4G';break;
                    case 3:
                        return 'Wifi、4G';break;
                    case 4:
                        return 'Lan';break;
                    case 5:
                        return 'Wifi、4G';break;
                    case 6:
                        return '4G、Lan';break;
                    case 7:
                        return 'Wifi、4G、Lan';break;
                    default:
                        return '';break;
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .deviceIndex {

        .slic-content-info{
            width: calc(100% - 286px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 0;
        }


        .slic-content-info-up{
            background-color: #fff;
            border-radius: 5px;
            /*padding: 10px;*/
            margin-bottom: 20px;
        }

        .sl-content-handle{
            background-color: #fff;
            border-radius: 5px 5px 0 0;
        }

        .sl-content-handle-left{
            padding-left: 10px;
            border-left: 3px solid #28e;
            font-size: 14px;
            font-weight: bold;
        }

        .pagination-style{
            position: absolute;
            bottom: 10px;
            right: 10px;
        }

        .el-table__empty-text::before{
            content: '1';
            width: 10px;
            height: 10px;
            /*background: url(../../../assets/img/tip-error.png) center no-repeat;*/
        }

        .table-container{
            flex: 1;
            position: relative;
            padding: 10px;
            background-color: #fff;
            border-radius: 5px;
        }

        .sl-content-row-item-link{
            margin-left: 20px;
            color: #28e;

        }

        .sl-content-row-item-link:hover{
            text-decoration: underline;
        }

        .slic-content-info-down{
            max-height: 655px;
            overflow-x: hidden;
            overflow-y: auto;
        }

        .sl-content-card{
            height: 200px;
            /*margin-bottom: 15px;*/
            /*width: ;*/
            margin-bottom: 10px;
            cursor: pointer;
            position: relative;

            .status-mark-forbid {
                position: absolute;
                top: 45px;
                right: 10px;
                font-style: normal;
                padding: 5px;
                border: 2px solid #facbcb;
                color: #facbcb;
                border-radius: 3px;
                transform: rotateZ(30deg);
            }

            .sl-content-card-main{
                height: 170px;
                width: 100%;

                .sl-content-card-title{
                    height: 50px;
                    line-height: 50px;
                    background-color: #eaeaea;
                    border-radius: 5px 5px 0 0;
                    min-width: 160px;

                    span{
                        display: inline-block;
                    }

                    .sl-content-card-name{
                        font-size: 16px;
                        font-weight: bold;
                        margin-left: 20px;
                    }

                    .sl-content-card-num{
                        float: right;
                        margin-right: 20px;
                        max-width: 50px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }

                .sl-content-card-body{
                    background-color: #fff;
                    border-radius: 0 0 5px 5px;
                    height: 120px;
                    padding: 15px 20px;
                    min-width: 160px;
                    /*min-height: 160px;*/
                    overflow: hidden;

                    .sl-content-card-body-list{
                        margin-bottom: 5px;
                    }
                }
            }

            .sl-content-card-oper{
                height: 30px;
                line-height: 30px;


                .sl-content-card-oper-btn{
                    color: #999;
                    margin-right: 10px;
                    display: none;
                }

                .sl-content-card-oper-btn:hover{
                    color: #288be9;
                }
            }
        }

        .sl-content-card:hover{
            .sl-content-card-title{
                background-color: #dcebfa;
                color: #288be9;
            }

            .sl-content-card-oper-btn{
                display: inline-block;
            }


        }




    }
</style>

