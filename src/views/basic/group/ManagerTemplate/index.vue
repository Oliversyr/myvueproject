<template>
    <div class="group-template sl-page-container flex-col pst-rl">
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
        <div class="sl-operator-panel">
            <div class="sl-operator-left" style="left: 250px;">
                <el-button size="small" class="back slic-btn-theme3" @click="goToGroup">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <el-button type="primary" size="small" class="slic-btn-theme3 add-vending-machine" @click="addVEM"
                           v-show="myModulePower.edit" :disabled="loading">
                    新增售卖机
                </el-button>
                <el-button-group class="goods-btns">
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="addGoods"
                               v-show="myModulePower.edit" :disabled="loading">添加商品
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="delGoodsList"
                               v-show="myModulePower.edit" :disabled="loading">移除商品
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" :disabled="loading" v-if="false">导入商品
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <div class="sl-item-panel group-info animated fadeIn mt-xsmall">
            <div class="slic-form-til">店组信息：</div>
            <el-form inline :model="groupInfo" ref="groupInfoForm" class="group-info-form">
                <el-form-item label="店组名称：" class="form-group-name">
                    <label v-text="groupInfo.groupName"></label>
                </el-form-item>
                <el-form-item label="拥有店铺：" class="form-store-num">
                    <label v-text="groupInfo.storeNum >= 0 ? groupInfo.storeNum + '家' : ''"></label>
                </el-form-item>
                <el-form-item :label="'本周(' + bWeekDate + '~' + eWeekDate + ') 销售金额：'" label-width="285px"
                              class="form-sale-money">
                    <label v-text="'￥' + groupInfo.saleMoney" class="tx-overflow"></label>
                </el-form-item>
            </el-form>
        </div>
        <div class="sl-content-panel flex-col">
            <el-tabs v-model="tabActiveComponentName" @tab-click="doSwitch">
                <el-tab-pane label="设备模板" name="DeviceTemplate"></el-tab-pane>
                <el-tab-pane label="经营商品模板" name="GoodsTemplate"></el-tab-pane>
            </el-tabs>
            <keep-alive>
                <component ref="currentView" :is="currentView"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    import RouterMixins from '@/mixins/router';// 路由混合器
    import ViewPage from '@/mixins/viewPage';// 页面公共混合器
    import ViewBtnsPower from '@/mixins/viewBtnsPower';
    import Levelbar from 'views/layout/Levelbar';// 面包屑组件
    import DeviceTemplate from './device-template.vue';// 设备模板
    import GoodsTemplate from './goods-template.vue';// 经营商品模板
    import AisleTemplate from './aisle-template.vue';// 货道设置模板
    import {getGroupDetail} from '@/api/basic/group/group';

    export default {
        name: 'manager-template',
        components: {
            Levelbar,
            DeviceTemplate,
            GoodsTemplate,
            AisleTemplate
        },
        mixins: [RouterMixins, ViewPage, ViewBtnsPower],
        data() {
            return {
                // 自定义面包屑列表
                levelList: ['基础管理', '店组管理', '店组模板'],
                // 当前视图组件
                currentView: 'DeviceTemplate',
                // tab当前激活组件
                tabActiveComponentName: 'DeviceTemplate',
                // 店组信息
                groupInfo: {},
                // 售卖机信息
                posInfo: {},
                // 设备信息
                deviceInfo: {}
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
                        groupId: this.groupInfo.groupId,
                        keyValue: '',
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
                    this.loading = false;
                }).catch((error) => {
                    console.log(error);
                    this.loading = false;
                })
            },
            // 返回店组卡片列表
            goToGroup() {
                this.$router.push({path: '/basic/group'});
            },
            // 切换设备模板和经营商品模板
            doSwitch(tab, event) {
                this.currentView = tab.name || 'DeviceTemplate';
            },
            // 新增售卖机
            addVEM() {
                this.currentView = this.tabActiveComponentName = 'DeviceTemplate';
                setTimeout(() => {
                    this.$refs['currentView'].addVEM();
                }, 1000)
            },
            // 添加商品
            addGoods() {
                this.currentView = this.tabActiveComponentName = 'GoodsTemplate';
                setTimeout(() => {
                    this.$refs['currentView'].addGoods();
                }, 1000)
            },
            // 移除商品
            delGoodsList() {
                this.currentView = this.tabActiveComponentName = 'GoodsTemplate';
                setTimeout(() => {
                    this.$refs['currentView'].delGoodsList();
                }, 1000)
            },
            // 组件初始化
            init() {
                this.groupInfo = JSON.parse(this.$route.query.groupInfo);
                this.groupInfo.saleMoney = 0.00; // 防止出现undefined
                this.getGroupDetail();
                if (this.currentView === 'GoodsTemplate') {
                    this.$refs['currentView'].getTemplateGoodsList();
                } else {
                    this.currentView = 'DeviceTemplate';
                }
            }
        },
        activated() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .group-template {
        .group-info {
            .slic-form-til {
                display: inline-block;
                width: 120px !important;
            }
            .group-info-form {
                display: inline-block;
                .el-form-item {
                    margin-bottom: 0;
                    margin-top: -8px;
                }
                .form-group-name {
                    width: 200px;
                }
                .form-store-num {
                    width: 100px;
                }
                .form-sale-money {
                    label {
                        font-size: 18px;
                        color: #ff0000;
                    }
                }
            }
        }
        .sl-operator-panel {
            .sl-operator-left {
                left: 250px;
            }
            .sl-operator-right {
                .add-vending-machine {
                    margin-right: 10px;
                }
            }
        }
        .sl-content-panel {
            padding-bottom: 0 !important;
        }
    }
</style>