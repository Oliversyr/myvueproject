<template>
    <div class="shop-base-info">
        <el-row class="mb-xsmall" >
            <el-col :span="24">
                <div class="slic-form-til">基本信息   <sl-icon-info :is-information-opened.sync="isShowDetail"></sl-icon-info></div>
                
            </el-col>
        </el-row>
        <el-collapse-transition>
            <el-form inline :model="shopInfoInner" label-width="95px" class="shop-info-form" v-show="isShowDetail">
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="店铺编码：" class="form-eid">
                            <label v-text="shopInfoInner.eid" :title="shopInfoInner.eid"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店铺名称：" class="form-ename">
                            <label v-text="shopInfoInner.ename" :title="shopInfoInner.ename"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上级机构：" class="form-MYFULLNAME">
                            <label v-text="shopInfoInner.MYFULLNAME" :title="shopInfoInner.MYFULLNAME"></label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="联系人：" class="form-contact">
                            <label v-text="shopInfoInner.contact" :title="shopInfoInner.contact"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机：" class="form-contactMobile">
                            <label v-text="shopInfoInner.contactMobile" :title="shopInfoInner.contactMobile"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话：" class="form-contactTele">
                            <label v-text="shopInfoInner.contactTele" :title="shopInfoInner.contactTele"></label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="所在区域：" class="form-areaId">
                            <label v-text="shopInfoInner.areaName" :title="shopInfoInner.areaName"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店铺地址：" class="form-address">
                            <label v-text="shopInfoInner.address" :title="shopInfoInner.address"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="店铺状态：" class="form-address">
                            <label v-text="statusName" :title="statusName"></label>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-collapse-transition>
    </div>
</template>

<script>
    export default {
        name: 'shop-base-info',
        props: {
            // 店铺信息
            shopInfo: {
                type: Object,
                required: true,
                default: {}
            },
            // 店铺状态初始值
            shopStatus: {
                type: Number,
                required: true,
                default: -1
            }
        },
        data(){
            return {
                isShowDetail: true
            }
        },
        computed: {
            shopInfoInner: function () {
                this.shopInfo.MYFULLNAME = !this.shopInfo.fullname ? '' : this.shopInfo.fullname.substring(0, this.shopInfo.fullname.lastIndexOf('-'));
                return this.shopInfo;
            },
            statusName: function () {
                let statusName = this.shopStatus === 0 ? '未开业' : this.shopStatus === 1 ? '营业中'
                    : this.shopStatus === 2 ? '休息中' : this.shopStatus === 3 ? '已停业' : '-';
                return statusName;
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .shop-base-info {
        .slic-form-til {
            cursor: pointer;
        }
        .el-form-item {
            width: 100%;
            margin-bottom: 1px;
            .el-form-item__content {
                width: calc(100% - 100px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

    }
</style>