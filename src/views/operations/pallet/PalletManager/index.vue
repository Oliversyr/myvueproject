<template>
    <div class="pallet-manager sl-page-container flex-col pst-rl">
        <!-- 货道详情管理: 面包屑 -->
        <levelbar :levelList="levelList">
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-货道管理-货道详情】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以配置货柜货道，设置货道经营的商品，查看商品的库存信息。</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <!-- 货道详情管理: 店铺信息 -->
        <div class="sl-item-panel mt-xsmall">
            <span class="slic-form-til mr">门店</span>
            <span class="shop-name tx-bold fz-s4">{{palletInfo.ename}}</span>
        </div>
        <!-- 货道详情管理: 查询区域 -->
        <div class="sl-search-panel" v-if="currentView != 'PalletAisle'">
            <sl-select prepend="售卖机" class="sl-search-item" style="width: 200px;">
                <el-select v-model="searchModel.posId" :default-first-option="true" clearable
                           slot="ELSelect" size="small" @change="posIdChange" @visible-change="getShopPosList"
                           popper-class="sl-my-select">
                    <el-option
                            v-for="item in searchModel.posList"
                            :key="item.posid"
                            :label="item.myposid"
                            :value="item.posid">
                        <div class="name">{{ item.myposid }}</div>
                        <span class="description">{{ item.address }}</span>
                    </el-option>
                </el-select>
            </sl-select>
            <sl-select prepend="货柜号" class="sl-search-item" style="width: 200px;">
                <el-select v-model="searchModel.counterid" :default-first-option="true" clearable
                           slot="ELSelect" size="small" @visible-change="getShopSlaveListByPosId"
                           popper-class="sl-my-select counter">
                    <el-option
                            v-for="item in searchModel.counterList"
                            :key="item.counterid"
                            :label="item.counterid"
                            :value="item.counterid">
                        <div class="name">{{ item.counterid }}</div>
                    </el-option>
                </el-select>
            </sl-select>
            <div class="slic-input-group sl-search-item" style="width: 330px;">
                <sl-autocomplete
                        ref="goodsAutoModel"
                        :autoParams="goodsAutoModel.autoParams"
                        :dataList="goodsAutoModel.goodsList"
                        slWidth="590"
                        colWidths="20,30,50"
                        displayProp="goodsname"
                        @querykey="goodsAutoQuery"
                        @doAutoSelected="handleGoodsAutoSelect"
                        prepend="商品名称"
                        placeholder="请输入商品名称"
                        selectedMode="SINGLE">
                </sl-autocomplete>
            </div>
            <div class="slic-btn-group sl-search-item" style="vertical-align: top;">
                <el-button-group>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="search" :disabled="loading">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="reset" :disabled="loading">
                        重置
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3"
                               @click.native.stop="isShowMoreBtn = !isShowMoreBtn" :disabled="loading">
                        <span class="fl">更多</span> <i class="el-icon-arrow-down" v-show="!isShowMoreBtn"></i> <i
                            class="el-icon-arrow-up" v-show="isShowMoreBtn"></i>
                    </el-button>
                </el-button-group>
            </div>
            <el-collapse-transition>
                <div v-show="isShowMoreBtn">
                    <div class="slic-input-group sl-search-item"
                         style="display:inline-block;width: 200px;margin-right: 15px;">
                        <el-input size="small" placeholder="请输入货道号" v-model.number="searchModel.palletId">
                            <template slot="prepend">
                                <div style="width: 68px;text-align: center;">货道号</div>
                            </template>
                        </el-input>
                    </div>
                    <sl-select prepend="状态" class="sl-search-item" style="width: 200px;">
                        <el-select v-model="searchModel.status" placeholder="请选择" :default-first-option="true"
                                   filterable
                                   slot="ELSelect" size="small">
                            <el-option label="全部" :value="-1"></el-option>
                            <el-option label="正常" :value="0"></el-option>
                            <el-option label="故障" :value="1"></el-option>
                            <el-option label="缺货" :value="2"></el-option>
                            <el-option label="暂停销售" :value="3"></el-option>
                        </el-select>
                    </sl-select>
                </div>
            </el-collapse-transition>
        </div>
        <!-- 货道详情管理: 页面操作按钮 -->
        <div class="sl-operator-panel">
            <div class="sl-operator-left">
                <el-button v-if="currentView !== 'PalletAisle'" size="small" class="back slic-btn-theme3"
                           @click="goToPallet" :disabled="loading">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
                <el-button v-if="currentView === 'PalletAisle'" class="back slic-btn-theme3" size="small"
                           @click="goToPalletForm" :disabled="loading">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <el-button-group v-if="false">
                    <el-button type="primary" size="small" class="shop-status-opening slic-btn-theme3"
                               :disabled="loading">
                        通知运营人员排障
                    </el-button>
                    <el-button type="primary" size="small" class="shop-status-closed slic-btn-theme3"
                               :disabled="loading">
                        通知运营人员上货
                    </el-button>
                </el-button-group>
                <el-button v-if="currentView === 'PalletForm' && myModulePower.edit" type="primary" size="small" class="slic-btn-theme3"
                           @click="palletAisle" :disabled="loading">货道设置
                </el-button>
                <el-button v-if="currentView === 'PalletAisle'" type="primary" size="small" class="slic-btn-theme3 fr"
                           @click="addSlaveRow" :disabled="loading">新增一行
                </el-button>
            </div>
        </div>
        <!-- 货道详情管理: 主要内容区域 -->
        <div class="sl-content-panel flex-col overflow-y pst-rl"
             :class="{'pallet-aisle-content': currentView === 'PalletAisle'}">
            <!-- 货道详情管理: 货道List,Form头部内容 -->
            <div class="list-form" v-if="currentView != 'PalletAisle'">
                <span class="fr"><icon-svg :icon-class="patternFormClass"
                                           @click.native="doSwitchPattern('PalletForm')"></icon-svg></span>
                <span class="fr mr-xsmall"><icon-svg :icon-class="patternListClass"
                                                     @click.native="doSwitchPattern('PalletList')"></icon-svg></span>
            </div>
            <!-- 货道详情管理: List,Form, Aisle -->
            <keep-alive>
                <component :is="currentView" :loading.sync="loading" :searchParams="searchModel"
                           ref="palletManager"></component>
            </keep-alive>
        </div>

    </div>
</template>

<script>
    import {getShopGoodsList, getShopPosList, getShopSlaveList} from '@/api/operations/shop/shop';
    import PalletList from './pallet-list';
    import PalletForm from './pallet-form';
    import PalletAisle from './pallet-aisle';
    import Levelbar from 'views/layout/Levelbar';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';
    import SlAutocomplete from '@/components/sl-autocomplete';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'pallet-manager',
        components: {
            Levelbar,
            PalletList,
            PalletForm,
            PalletAisle,
            SlAutocomplete
        },
        mixins: [RouterMixins, ViewPage, ViewBtnsPower],
        data() {
            return {
                // 数据加载进度
                loading: false,
                // 自定义面包屑列表
                levelList: ['运营应用', '货道管理', '货道详情'],
                // 店铺货道汇总某条信息记录
                palletInfo: {},
                // 默认跳转List详情界面
                currentView: 'PalletList',
                // 是否显示更多按钮
                isShowMoreBtn: false,
                // 查询参数
                searchModel: {
                    posList: [], // 店铺售卖机列表
                    posId: null, // 售卖机编码
                    palletId: null,// 货道号
                    goodsId: -1, // 商品编码
                    counterList: [], // 店铺货柜号列表
                    counterid: null,// 货柜号编码
                    status: -1 // 状态	-1全部、0正常、1故障、2缺货、3暂停销售
                },
                // 查询参数 => 商品名称自动完成
                goodsAutoModel: {
                    goodsList: [],
                    autoParams: {
                        goodsid: '商品内码',
                        goodsname: '商品名称',
                        catLName: '所属品类'
                    }
                },
                // List/Form class
                pattern: 'PalletList',
                patternFormClass: 'pattern_form',
                patternListClass: 'pattern_list_highlig',
                // 用于： 在【Form】跳转到【货道设置】时候，需要当前激活的货柜信息
                posCounterInfo: {}
            }
        },
        computed: {},
        methods: {
            // 返回店铺货道汇总列表界面
            goToPallet() {
                this.delCurView(this.$route.name);
                this.$router.push({path: '/operations/pallet'});
            },
            // 返回到该货柜的Form界面
            goToPalletForm() {
                this.doSwitchPattern('PalletForm');
            },
            // 查询店铺的所有POS
            getShopPosList(){
                let shopEid = this.palletInfo.eid;
                return getShopPosList(shopEid).then((res) => {
                    let data = res.result;
                    this.searchModel.posList = data;
                    console.log('[PalletManager][货道管理-店铺货道详情]获取店铺的所有POS信息：', res);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 查询店铺的所有货柜
            getShopSlaveList() {
                let shopEid = this.palletInfo.eid,
                    posId = this.searchModel.posId || -1,
                    goodsId = this.searchModel.goodsId || -1,
                    palletid = this.searchModel.palletId || -1,
                    counterid = this.searchModel.counterid || -1,
                    status = this.searchModel.status || -1;
                return getShopSlaveList(shopEid, posId, goodsId, palletid, counterid, status).then((res) => {
                    let data = res.result;
                    this.searchModel.counterList = data;
                    console.log('[PalletManager][货道管理-店铺货道详情]获取店铺的所有货柜信息：', res);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 查询条件售卖机更改
            posIdChange() {
                this.searchModel.counterid = null;
            },
            // 根据选择的售卖机获取该售卖机的货柜号信息
            getShopSlaveListByPosId(visible) {
                if (visible && (this.searchModel.posId === -1 || !this.searchModel.posId)) {
                    this.$message({
                        message: `请先选择售卖机`,
                        type: 'error'
                    });
                    this.searchModel.counterList = [];
                    return;
                }
                this.getShopSlaveList();
            },
            // 根据【查询条件以及当前组件】查询过滤
            search() {
                let pattern = this.pattern;
                this.doSwitchPattern(pattern);
            },
            // 重置查询条件
            reset() {
                this.searchModel = Object.assign({}, this.searchModel, {
                    posId: null, // 售卖机编码
                    palletId: null,// 货道号
                    goodsId: -1, // 商品编码
                    counterid: null,// 货柜号编码
                    status: -1 // 状态	-1全部、正常、故障、缺货、暂停销售
                })
                this.$refs['goodsAutoModel'] && this.$refs['goodsAutoModel'].clearItem(0);
                this.$nextTick(() => {
                    this.search();
                })
            },
            // 商品名称自动补全搜索
            goodsAutoQuery(key) {
                let params = {
                        shopEid: this.palletInfo.eid,
                        goodsName: key,
                        brandId: -1,
                        catId: -1,
                        status: -1,
                        goodsId: -1
                    },
                    page = {
                        pageNum: 1,
                        pageSize: 10000,
                        totalRecord: 0,
                        totalPage: 0,
                    };
                return getShopGoodsList(page, params).then((res) => {
                    if (res.retCode === 'SUCCESS') {
                        this.goodsAutoModel.goodsList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 商品名称自动补全选中
            handleGoodsAutoSelect(sel) {
                this.searchModel.goodsId = sel.goodsid;
            },
            // 切换店铺货道详情展示方式(列表，表格)
            doSwitchPattern(pattern) {
                if (pattern === 'PalletList') {
                    this.currentView = "PalletList";
                    this.pattern = "PalletList";
                    this.patternListClass = "pattern_list_highlig";
                    this.patternFormClass = "pattern_form";
                } else {
                    this.pattern = "PalletForm";
                    this.currentView = "PalletForm";
                    this.patternListClass = "pattern_list";
                    this.patternFormClass = "pattern_form_highlig";
                }
                this.$nextTick(() => {
                    if (this.currentView === "PalletList") {
                        this.$refs['palletManager'].getShopPalletInfo();
                    } else {
                        this.$refs['palletManager'].getShopSlaveList();
                    }
                })
            },
            // pallet-form界面【货道设置】按钮
            palletAisle() {
                this.$refs['palletManager'].palletAisle();
            },
            // pallet-aisle界面新增一行
            addSlaveRow() {
                this.$refs['palletManager'].addSlaveRow();
            },
            // 组件初始化
            init() {
                this.palletInfo = JSON.parse(this.$route.query.palletInfo);
                console.log('[PalletManager][货道管理-店铺货道详情-index]店铺货道汇总某条信息记录：', this.palletInfo);
                // 重置查询条件
                this.reset();
                // 开始查询
                this.search();
            }
        },
        activated() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .pallet-manager {
        .sl-operator-panel {
            .sl-operator-left {
                left: 250px !important;
            }
            .sl-operator-right {
                .shop-goods {
                    margin-right: 1em;
                }
            }
        }
        .sl-content-panel {
            padding: 0 10px !important;
            &.pallet-aisle-content {
                margin-top: 10px !important;
                padding-bottom: 10px !important;
            }
            .pallet-aisle-header {
                padding: 10px 0 !important;
            }
            .list-form {
                position: absolute;
                right: 10px;
                top: 10px;
                padding-bottom: 8px;
                padding-left: 10px;
                border-bottom: 1px solid #d1dbe5;
                font-size: 20px;
                cursor: pointer;
                z-index: 1;
            }
        }

        .el-icon-arrow-down, .el-icon-arrow-up {
            margin-left: 2px;
            margin-top: 10px;
        }
    }

    .sl-my-select {
        &.counter li {
            height: 36px;
        }
        li {
            line-height: normal;
            padding: 7px;
            height: 45px;
            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .description {
                font-size: 12px;
                color: #b4b4b4;
            }
            .highlighted .description {
                color: #ddd;
            }
        }

    }
</style>