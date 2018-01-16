<template>
    <div class="shop-item sl-page-container flex-col pst-rl"
         :class="pageType === 1 ? 'add' : pageType === 2 ? 'edit' : 'view'">
        <!-- 店铺详情: 面包屑 -->
        <levelbar :levelList="levelList">
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-店铺管理-店铺详情】</span>
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
        <!-- 店铺详情: 操作按钮 -->
        <div class="sl-operator-panel">
            <div class="sl-operator-left">
                <el-button size="small" class="back slic-btn-theme3" @click="goToShop">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <el-button-group>
                    <el-button type="primary" size="small" class="shop-device slic-btn-theme3" @click="goToShopDevice"
                               :disabled="loading" v-if="myModulePower.edit">设备管理
                    </el-button>
                    <el-button type="primary" size="small" class="shop-goods slic-btn-theme3" @click="goToShopGoods"
                               :disabled="loading" v-if="myModulePower.edit">商品管理
                    </el-button>
                </el-button-group>
                <!-- 页面【浏览】状态按钮 -->
                <el-button v-show="pageType === 3" type="primary" size="small" class="shop-edit slic-btn-theme3"
                           @click="editShopInfo"
                           :disabled="loading" v-if="myModulePower.edit">编辑
                </el-button>
                <!-- 页面【编辑】状态按钮 -->
                <el-button-group v-show="pageType === 2">
                    <el-button type="primary" size="small" class="shop-save slic-btn-theme3"
                               @click="saveShopInfo" :disabled="loading" v-if="myModulePower.edit">
                        保存
                    </el-button>
                    <el-button type="primary" size="small" class="shop-save-cancel slic-btn-theme3" @click="doCancel"
                               :disabled="loading">取消
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <!-- 店铺详情: 基本信息，扩展信息，图片、描述 -->
        <div class="sl-panel flex-col overflow-y" v-loading="loading">
            <div class="sl-item-panel mb-xsmall">
                <shop-base-info ref="shopBaseInfo" :shopInfo="shopInfo" :shopStatus="shopStatus"></shop-base-info>
            </div>
            <div class="sl-item-panel mb-xsmall">
                <shop-expand-info ref="shopInfo" :shopInfo.sync="shopInfo" :pageType="pageType"
                                  :shopStatus="shopStatus"></shop-expand-info>
            </div>
            <div class="sl-item-panel mb-xsmall mt-xs">
                <shop-imgs :shopInfo.sync="shopInfo" :pageType="pageType"></shop-imgs>
            </div>
            <div class="sl-item-panel mb-xsmall mt-xs">
                <shop-remark :shopInfo.sync="shopInfo" :pageType="pageType"></shop-remark>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Levelbar from 'views/layout/Levelbar';
    import  myDate from 'utils/date';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    import ShopImgs from './shop-imgs';
    import ShopRemark from './shop-remark';
    import ShopBaseInfo from './base-info';
    import ShopExpandInfo from './expand-info';
    import {getShopDetail, updateShopStatus, updateShop} from '@/api/operations/shop/shop';


    export default {
        name: 'ShopItem',
        components: {
            Levelbar,
            ShopImgs,
            ShopRemark,
            ShopBaseInfo,
            ShopExpandInfo
        },
        mixins: [RouterMixins, ViewPage, ViewBtnsPower],
        data() {
            return {
                // 自定义面包屑列表
                levelList: ['运营应用', '店铺管理', '店铺详情'],
                // 店铺信息
                shopInfo: {},
                // 店铺状态初始值
                shopStatus: -1
            }
        },
        methods: {
            // 【获取店铺详情信息】API
            getShopDetail() {
                let eid = +this.$route.query.shopId;
                this.loading = true;
                return getShopDetail(eid).then((res) => {
                    let data = res.result;
                    if (data.eid === null) {
                        this.$message.error('店铺不存在，请删除店组里的该店铺或者联系管理员！');
                        this.shopInfo = {};
                        this.loading = false;
                        return;
                    }
                    this.shopInfo = data;
                    this.shopInfo.MYFILELIST = this.generateFileList(data.picList, this.userInfo.fileServerAddr);
                    this.shopStatus = data.status;
                    this.loading = false;
                    console.log("[店组管理-店铺详情]店铺信息", this.shopInfo);
                }).catch((err) => {
                    console.log(err);
                    this.shopInfo = {};
                    this.loading = false;
                })
            },
            // 开业，停业，营业，休息操作
            _updateShopStatus(eids, status, operateDate) {
                return updateShopStatus(eids, status, operateDate).then((res) => {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getShopDetail();
                }).catch((err) => {
                    console.log(err);
                })
            },
            updateShopStatus(status) {
                // 店铺列表数据状态 0：未开业 1：正在营业 2：营业结束  3：店铺已关闭
                let eids = this.shopInfo.eid;
                switch (status) {
                    case 1:
                        var isReturn = this.shopInfo.status != 0;
                        if (isReturn) {
                            this.$message({
                                message: `只对'未开业'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this.shopStatusDialog.visible = true;
                        this.shopStatusDialog.title = "店铺开业";
                        this.shopStatusDialog.dateLabelTitle = "开业日期";
                        this.shopStatusDialog.btnLabelTitle = "开业";
                        break;
                    case 2:
                        isReturn = this.shopInfo.status != 2;
                        if (isReturn) {
                            this.$message({
                                message: `只对'营业结束'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this._updateShopStatus(eids, 1, myDate.formatDate(new Date()));
                        break;
                    case 3:
                        isReturn = this.shopInfo.status != 1 && this.shopInfo.status != 2;
                        if (isReturn) {
                            this.$message({
                                message: `只对'正在营业'或者'营业结束'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this.$confirm('停业为不可逆状态，是否继续?', '提示', {
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                            this.shopStatusDialog.visible = true;
                            this.shopStatusDialog.title = "店铺停业";
                            this.shopStatusDialog.dateLabelTitle = "停业日期";
                            this.shopStatusDialog.btnLabelTitle = "停业";
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case 4:
                        isReturn = this.shopInfo.status != 1;
                        if (isReturn) {
                            this.$message({
                                message: `只对'正在营业'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this._updateShopStatus(eids, status, myDate.formatDate(new Date()));
                        break;
                    default:
                        break;
                }
            },
            // 开业
            handleShopStatusDialog() {
                let status = -1,
                    eids = this.shopInfo.eid;
                this.shopStatusDialog.btnLabelTitle === "开业" ? status = 1 : status = 3;
                this._updateShopStatus(eids, status, myDate.formatDate(this.shopStatusDialog.dateValue));
            },
            // 【返回】按钮
            goToShop(){
                this.delCurView(this.$route.name);
                this.$router.push({path: '/operations/shop'});
            },
            // 【设备管理】按钮
            goToShopDevice() {
                this.$router.push({
                    path: 'shopDevice',
                    query: {shopInfo: JSON.stringify(Object.assign({}, this.shopInfo, {pageType: this.pageType}))}
                });
            },
            // 【商品管理】按钮
            goToShopGoods() {
                this.$router.push({
                    path: 'shopGoods',
                    query: {shopInfo: JSON.stringify(Object.assign({}, this.shopInfo, {pageType: this.pageType}))}
                });
            },
            // 【编辑】按钮
            editShopInfo() {
                this.changePageType(2, '店铺管理(编辑)');
            },
            // 【保存】按钮
            saveShopInfo() {
                let _this = this, shopInfo = this.shopInfo;
                console.log('[店铺管理-店铺详情]店铺更新传给后台信息=>', shopInfo);
                this.loading = true;
                let _updateShop = function () {
                    return updateShop(shopInfo).then((res) => {
                        _this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        _this.changePageType(3, '店铺管理(详情)');
                        _this.getShopDetail();
                        _this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                        _this.loading = false;
                    })
                }
                if (shopInfo.status === 3 && this.shopStatus !== 3) {
                    this.loading = false;
                    this.$confirm('停业为不可逆状态，是否继续?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        shopInfo.closeDate = myDate.formatDate(new Date());
                        _updateShop();
                    }).catch((err) => {
                        console.log(err);
                        return;
                    });
                } else {
                    _updateShop();
                }
            },
            // 【取消】按钮
            doCancel() {
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.changePageType(3, '店铺管理(详情)');
                    this.getShopDetail();
                })
            },
            // 根据店铺图片信息和图片服务器地址生成前台展示的图片文件信息
            generateFileList(picList, fileServerAddr) {
                let _fileList = [];
                picList.length > 0 && picList.forEach((item, index) => {
                    _fileList.push({
                        name: item.picIndex,
                        url: fileServerAddr + item.fileName,
                        status: 'finished'
                    })
                })
                console.log('[店铺管理-店铺详情]前台展示的图片文件信息 fileList =>', _fileList);
                return _fileList;
            },
            // 组件初始化
            init() {
                this.pageType = +this.$route.query.pageType;
                let title = this.pageType === 1 ? '店铺管理(新增)' : this.pageType === 2 ? '店铺管理(编辑)' : '店铺管理(详情)';
                this.changePageType(this.pageType, title);
                this.getShopDetail();
            }
        },
        activated() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .shop-item {
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
        .sl-panel {
            border: none;
        }
    }
</style>