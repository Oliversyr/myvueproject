<template>
    <div class="sl-page-container flex-col goodsDetail">
        <div>
            <span style="width: 260px;display: inline-block;">
                <levelbar>
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【运营应用-商品管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 商品信息，包括商品的列表，详情，用于查看商品；</p>
                                <p>2. 以单据的形式提交商品的新建、修改、禁用等维护需求；</p>
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
                    <!--<el-button type="primary" size="small" @click="doCancel()">取消</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doSave()">保存</el-button>-->
                </el-button-group>
            </div>

        </div>
        <div class="slic-content">


            <div class="slic-content-info">
                <div class="slic-content-info-tab">
                    <el-radio-group v-model="goodsTab">
                        <el-radio-button label="商品资料"></el-radio-button>
                        <el-radio-button label="商品描述"></el-radio-button>
                    </el-radio-group>
                </div>

                <transition name="el-fade-in-linear">
                    <div class="info-container detailView" v-if="goodsTab === '商品资料'">
                        <el-form class="sl-form-group" :model="goodsInfo" ref="goodsForm" label-width="95px">
                            <div class="sl-row-group" style="margin-bottom: 10px;">
                                <div class="sl-row-group-title">
                                    基本信息
                                    <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                                </div>

                                <span class="animated fadeIn" v-show="iconInfo">
                                    <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8" >
                                        <el-form-item label="商品内码：" class="el-form-item-detail" :title="goodsInfo.mygoodsid">
                                            <span>{{goodsInfo.mygoodsid}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">
                                        <el-form-item label="商品名称：" class="el-form-item-detail"  :title="goodsInfo.goodsname">
                                            <span>{{goodsInfo.goodsname}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8">
                                        <el-form-item label="商品条码：" class="el-form-item-detail" :title="goodsInfo.barcode">
                                            <span>{{goodsInfo.barcode}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="20" class="sl-form-row ">

                                    <el-col :span="8" >
                                        <el-form-item label="销售单位：" class="el-form-item-detail" :title="goodsInfo.uname">
                                            <span>{{goodsInfo.uname}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" >
                                        <el-form-item label="销售规格一：" class="el-form-item-detail"  :title="goodsInfo.spec">
                                            <span>{{goodsInfo.spec}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">
                                        <el-form-item label="销售规格二：" class="el-form-item-detail" :title="goodsInfo.spec">
                                            <span>{{goodsInfo.spec2}}</span>
                                        </el-form-item>
                                    </el-col>




                                </el-row>

                                <el-row :gutter="20" class="sl-form-row ">

                                    <el-col :span="8">
                                        <el-form-item label="商品品牌：" class="el-form-item-detail" :title="goodsInfo.brandName">
                                            <span>{{goodsInfo.brandName}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">
                                        <el-form-item label="商品分类：" class="el-form-item-detail" :title="goodsInfo.catLName">
                                            <span>{{goodsInfo.catLName}}</span>
                                        </el-form-item>
                                    </el-col>


                                </el-row>

                                <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8" >
                                        <el-form-item label="默认进价：" class="el-form-item-detail" :title="goodsInfo.costPrice">
                                            <span>{{goodsInfo.costPrice}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">
                                        <el-form-item label="建议售价：" class="el-form-item-detail"  :title="goodsInfo.bulkprice ? goodsInfo.bulkprice.toFixed(2) : ''">
                                            <span>{{goodsInfo.bulkprice ? goodsInfo.bulkprice.toFixed(2) : ''}} 元</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                </span>

                            </div>


                            <div class="sl-row-group">
                                <div class="sl-row-group-title">
                                    控制信息
                                    <sl-icon-info :is-information-opened.sync="iconInfo1"></sl-icon-info>
                                </div>
                                <span class="animated fadeIn" v-show="iconInfo1">
                                    <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8" >
                                        <el-form-item label="净重：" class="el-form-item-detail" :title="goodsInfo.weight">
                                            <span>{{goodsInfo.weight}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">
                                        <el-form-item label="长宽高：" class="el-form-item-detail"  :title="goodsInfo.isize">
                                            <span>{{goodsInfo.isize}}</span>
                                        </el-form-item>
                                    </el-col>


                                </el-row>
                                </span>




                            </div>

                        </el-form>


                    </div>
                </transition>

                <transition name="el-fade-in-linear">
                    <div v-if="goodsTab === '商品描述'" class="goodsDes">

                        <!--<goods-description v-if="isAdd"
                                        :getResult="getResult"
                                        @getResultInfo="getResultInfo">

                        </goods-description>-->

                        <div class="goodsShowDes">
                            <div class="goodsDes-pic">
                                <div class="goodsDes-pic-title">
                                    商品图片
                                    <sl-icon-info :is-information-opened.sync="iconInfo2"></sl-icon-info>
                                </div>

                                <span class="animated fadeIn" v-show="iconInfo2">
                                    <ul class="goodsDes-pic-content">
                                    <li class="goodsDes-pic-content-list" v-for="pic in goodsInfo.picList" :key="pic.picIndex">
                                        <img :src="userInfo.fileServerAddr + pic.fileName"/>
                                    </li>

                                </ul>
                                </span>


                            </div>

                            <div class="goodsDes-edit">
                                <div class="goodsDes-edit-title">
                                    商品描述
                                    <sl-icon-info :is-information-opened.sync="iconInfo3"></sl-icon-info>
                                </div>
                                <span class="animated fadeIn" v-show="iconInfo3">
                                    <div class="goodsDes-edit-content">
                                    {{goodsInfo.notes}}
                                </div>
                                </span>



                            </div>
                        </div>


                    </div>
                </transition>
            </div>
        </div>

    </div>

</template>

<script>
    import SlTree from '../../../components/sl-tree-select.vue'
    import Levelbar from '@/views/layout/Levelbar.vue';
    import GoodsDescription from '../common/goodsDes.vue';
    import {getGoodsDetail} from '@/api/operations/goods';
    import {mapGetters} from 'vuex';
    import RouterMixins from '@/mixins/router';

    export default {
        components: {
            Levelbar,
            GoodsDescription,
            SlTree
        },
        name: 'goodsdetailman',
        mixins: [RouterMixins],
        data () {
            return {
                goodsInfo: {},
                goodsTab: '商品资料',
                isAdd: false,
                goodsId: '',
                iconInfo: true,
                iconInfo1: true,
                iconInfo2: true,
                iconInfo3: true
            }
        },

        mounted: function () {
            this.$nextTick(function () {

            })
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        activated: function () {
            this.goodsId = this.$route.query.goodsId;
            this.getGoodsInfo();
        },
        methods: {
            // 获取商品详情
            getGoodsInfo() {
                getGoodsDetail(this.goodsId).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.goodsInfo = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 返回
            doBack() {
               this.$router.go(-1);
                this.$store.dispatch('delVisitedViews', this.$route.name);
            },
            /*// 保存
            doSave: function (event) {
                console.log(this.orgInfo)
                this.doGetResult()
                addGoods().then((res) => {

                }).catch()
            },
            // 取消
            doCancel: function (event) {
                this.$confirm('确定要取消新建商品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doBack();
                }).catch()
            },
            // 获取商品描述信息
            getResultInfo(result) {
                console.log(result);
                this.getResult = false;
            },
            // 触发获取信息函数
            doGetResult() {
                this.getResult = true;
            }*/


        }


    }

</script>

<style rel="stylesheet/scss" lang="scss">
.goodsDetail{

    .slic-content-info {
        display: flex;
        flex-direction: column;
    }

    .slic-content-info-tab{
        border-bottom: 1px solid #28e;

        .el-radio-button.is-active .el-radio-button__inner {
            color: #28e;
            font-weight: bold;
            background-color: #fff;
        }

        .el-radio-button__inner {
            border-bottom: 0;
        }

        .el-radio-button:last-child .el-radio-button__inner{
            border-radius: 0 4px 0 0;
        }

        .el-radio-button:first-child .el-radio-button__inner{
            border-radius: 4px 0 0 0;
        }
    }


    .goodsDes {
        width: 100%;

        border-radius: 5px;
        flex: 1;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .info-container {
        /*margin-top: 10px;*/
        padding: 10px 0px;
    }

    .goodsShowDes {
        flex: 1;
        display: flex;
        flex-direction: column;

        .goodsDes-pic {
            background-color: #fff;
            min-height: 150px;
            margin-bottom: 10px;
            border-radius: 5px;

            .goodsDes-pic-title {
                font-size: 14px;
                font-weight: bold;
                border-left: 3px solid #28e;
                padding-left: 10px;
                margin: 10px;
            }

            .goodsDes-pic-content {
                padding: 10px 10px;
                padding-top: 0;

                .goodsDes-pic-content-list {
                    width: 200px;
                    height: 200px;
                    border: 1px dashed #ccc;
                    display: inline-block;
                    margin-right: 10px;
                    border-radius: 10px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }

        }

        .goodsDes-edit {
            display: flex;
            flex: 1;
            flex-direction: column;
            border-radius: 5px;
            background-color: #fff;
            min-height: 150px;

            .goodsDes-edit-title {
                font-size: 14px;
                font-weight: bold;
                border-left: 3px solid #28e;
                padding-left: 10px;
                margin: 10px;
            }

            .goodsDes-edit-content {
                padding: 10px;
                flex: 1;
                display: flex;
                flex-direction: column;

            }

        }
    }
    
    .detailView {
		       	.el-form-item__content{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
       }

}
</style>
