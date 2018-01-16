<template>
    <div class="shop-collapsible-info">
        <el-row :gutter="20">
            <el-col :span="2" class="pst-rl" style="min-width: 110px;">
                <span class="slic-form-til">店铺信息  <!--<sl-icon-info :is-information-opened.sync="isInformationOpened"></sl-icon-info>--></span>
                <span class="slic-form-icon"><icon-svg :icon-class="informationIconClass"
                          @click.native="toggleInformationIconClass"></icon-svg></span>
            </el-col>
            <el-col :span="21">
                <el-row :gutter="20">
                    <el-col :span="6" class="tx-overflow mb-xsmall">
                        <span class="e-id" :title="shopInfoInner.eid">店铺编码：{{shopInfoInner.eid}}</span>
                    </el-col>
                    <el-col :span="6" :pull="1" class="tx-overflow mb-xsmall">
                        <span class="e-name" :title="shopInfoInner.ename">店铺名称：{{shopInfoInner.ename}}</span>
                    </el-col>
                    <el-col :span="7" :push="1" class="tx-overflow mb-xsmall">
                        <span class="parent-body"
                              :title="shopInfoInner.MYFULLNAME">上级机构：{{shopInfoInner.MYFULLNAME}}</span>
                    </el-col>
                    <el-col :span="5" class="tx-overflow ta-r">
                            <span class="status"
                                  :title="shopInfoInner.statusName">状态：{{shopInfoInner.statusName}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show="isInformationOpened" class="animated fadeIn">
                    <el-col :span="6" class="tx-overflow ">
                        <span class="e-id" :title="shopInfoInner.groupName">店组：{{shopInfoInner.groupName}}</span>
                    </el-col>
                    <el-col :span="6" :pull="1" class="tx-overflow">
                        <span class="e-name" :title="shopInfoInner.contact">联系人：{{shopInfoInner.contact}}</span>
                    </el-col>
                    <el-col :span="12" :push="1" class="tx-overflow">
                            <span class="parent-body"
                                  :title="shopInfoInner.address">店铺地址：{{shopInfoInner.address}}</span>
                    </el-col>
                </el-row>
            </el-col>
            <!--<el-col :span="1" class="information-icon ta-r">
                <icon-svg :icon-class="informationIconClass"
                          @click.native="toggleInformationIconClass"></icon-svg>
            </el-col>-->
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'shop-collapsible-info',
        props: {
            shopInfo: {// 店铺信息
                type: Object,
                required: true,
                default: {}
            }
        },
        data() {
            return {
                isInformationOpened: false,
            }
        },
        computed: {
            shopInfoInner: function () {
                let statusName = this.shopInfo.status === 0 ? '未开业' : this.shopInfo.status === 1 ? '营业中'
                    : this.shopInfo.status === 2 ? '休息中' : this.shopInfo.status === 3 ? '已停业' : '-';
                this.shopInfo.statusName = statusName;
                this.shopInfo.MYFULLNAME = !this.shopInfo.fullname ? '' : this.shopInfo.fullname.substring(0, this.shopInfo.fullname.lastIndexOf('-'));
                return this.shopInfo
            },
            informationIconClass: function () {
                return this.isInformationOpened ? 'information_up' : 'information_down';
            }
        },
        methods: {
            // 切换店铺更多信息显示
            toggleInformationIconClass() {
                this.isInformationOpened = !this.isInformationOpened;
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .shop-collapsible-info {
		.slic-form-icon {
			/*position: absolute;
			top:0;
			right:0;*/
			cursor: pointer;
		}
		.svg-icon {
			font-size: 14px;
			margin-right: 1px;
		}
    }
</style>