<template>
    <div class="sl-page-container flex-col oldChangeDetail">
        <div>
            <span style="width: 280px;display: inline-block;">
                <levelbar>
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【运营应用-商品变更管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 新建商品；</p>
                                <p>2. 修改商品属性；</p>
                                <p>3. 禁用/启用商品。</p>
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
                <el-button type="primary" size="small" @click="toEdit()" v-if="gcInfo.status === 0 && myModulePower.edit">编辑</el-button>
            </div>

        </div>
        <div class="slic-content">

            <div class="slic-content-info" style="background-color: transparent;">
                <div class="slic-content-info-tab">
                    <el-radio-group v-model="goodsTab">
                        <el-radio-button label="商品资料"></el-radio-button>
                        <el-radio-button label="商品描述"></el-radio-button>
                    </el-radio-group>
                </div>

                <transition name="el-fade-in-linear">
                    <div v-if="goodsTab === '商品资料'" class="sl-form-group" style="margin-top: 10px;">
                        <div class="sl-row-group" >
                            <div class="sl-row-group-title">
                                变更前
                                <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                            </div>

                            <span class="animated fadeIn" v-show="iconInfo">
                                <el-form class="sl-form" label-width="100px" style="padding-top: 0;">
                                <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8" >
                                        <el-form-item label="商品内码：" class="el-form-item-detail">
                                            <span>{{goodsInfo.mygoodsid}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">
                                        <el-form-item label="商品名称：" class="el-form-item-detail">
                                            <span>{{goodsInfo.goodsname}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8">
                                        <el-form-item label="商品条码：" class="el-form-item-detail">
                                            <span>{{goodsInfo.barcode}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="20" class="sl-form-row">

                                    <el-col :span="8" >

                                        <el-form-item label="销售单位：" class="el-form-item-detail">
                                            <span>{{goodsInfo.uname}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8" >
                                        <el-form-item label="销售规格一：" class="el-form-item-detail">
                                            <span>{{goodsInfo.spec}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="销售规格二：" class="el-form-item-detail">
                                            <span>{{goodsInfo.spec2}}</span>
                                        </el-form-item>
                                    </el-col>




                                </el-row>

                                    <!--<hr />-->

                                <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8">

                                        <el-form-item label="商品品牌：" class="el-form-item-detail">
                                            <span>{{goodsInfo.brandName || goodsInfo.brandname}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品分类：" class="el-form-item-detail">
                                            <span>{{goodsInfo.catlname || goodsInfo.catLName}}</span>
                                        </el-form-item>
                                    </el-col>



                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="长宽高：" class="el-form-item-detail">
                                            <span>{{goodsInfo.isize}}</span>
                                        </el-form-item>
                                    </el-col>


                                </el-row>

                                <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8">

                                        <el-form-item label="净重：" class="el-form-item-detail">
                                            <span>{{goodsInfo.weight}}g</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" >
                                        <el-form-item label="默认进价：" class="el-form-item-detail">
                                            <span>{{goodsInfo.cost}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="建议售价：" class="el-form-item-detail">
                                            <span>{{goodsInfo.bulkprice}}</span>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                            </el-form>
                            </span>


                        </div>

                        <div class="sl-row-group" style="margin-top: 10px;">
                            <div class="sl-row-group-title">
                                变更后
                                <sl-icon-info :is-information-opened.sync="iconInfo1"></sl-icon-info>
                            </div>

                            <span class="animated fadeIn" v-show="iconInfo1">
                                <el-form class="sl-form" :model="goodsInfo" ref="newGoodsForm" label-width="100px" style="padding-top: 0;">
                                <el-row :gutter="20" >
                                    <el-col :span="8" >

                                        <el-form-item label="商品内码：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newmygoodsid != goodsInfo.mygoodsid)}">{{goodsInfo.newmygoodsid}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品名称：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newgoodsname != goodsInfo.goodsname)}">{{goodsInfo.newgoodsname}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8">

                                        <el-form-item label="商品条码：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newbarcode != goodsInfo.barcode)}">{{goodsInfo.newbarcode}}</span>
                                        </el-form-item>

                                    </el-col>
                                </el-row>

                                <el-row :gutter="20" >
                                    <el-col :span="8" >

                                        <el-form-item label="销售单位：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newuname != goodsInfo.uname)}">{{goodsInfo.newuname}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="销售规格一：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newspec != goodsInfo.spec)}">{{goodsInfo.newspec}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="销售规格二：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newspec2 != goodsInfo.spec2)}">{{goodsInfo.newspec2}}</span>
                                        </el-form-item>

                                    </el-col>




                                </el-row>

                                    <!--<hr />-->

                                <el-row :gutter="20" >

                                    <el-col :span="8">

                                        <el-form-item label="商品品牌：" class="el-form-item-detail">

                                            <span :class="{'isChange': (goodsInfo.newbrandname != goodsInfo.brandname)}">{{goodsInfo.newbrandname}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品分类：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newcatlname != goodsInfo.catlname)}">{{goodsInfo.newcatlname || goodsInfo.newcatLName}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="长宽高：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newisize != goodsInfo.isize)}">{{goodsInfo.newisize}}</span>
                                        </el-form-item>

                                    </el-col>


                                </el-row>

                                <el-row :gutter="20" >
                                    <el-col :span="8">

                                        <el-form-item label="净重：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newweight != goodsInfo.weight)}">{{goodsInfo.newweight}}g</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="默认进价：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newcost != goodsInfo.cost)}">{{goodsInfo.newcost}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="建议售价：" class="el-form-item-detail">
                                            <span :class="{'isChange': (goodsInfo.newbulkprice != goodsInfo.bulkprice)}">{{goodsInfo.newbulkprice}}</span>
                                        </el-form-item>

                                    </el-col>
                                </el-row>

                            </el-form>
                            </span>



                        </div>
                    </div>

                </transition>

                <transition name="el-fade-in-linear">
                    <div v-if="goodsTab === '商品描述'" class="goodsDes">
                        <div class="goodsShowDes">
                            <div class="goodsDes-pic">
                                <div class="goodsDes-pic-title">
                                    商品图片
                                    <sl-icon-info :is-information-opened.sync="iconInfo2"></sl-icon-info>
                                </div>

                                <span class="animated fadeIn" v-show="iconInfo2">
                                    <ul class="goodsDes-pic-content">
                                        <li class="goodsDes-pic-content-list" v-for="(pic, key) in goodsInfo.picList" :key="key">
                                            <img :src="userInfo.fileServerAddr + pic.filename"/>
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
//    import SlTreeSelectCat from '@/components/sl-tree-select-cat.vue'
    import Levelbar from '@/views/layout/Levelbar.vue'
    import GoodsDescription from '../common/goodsDes.vue'
//    import {getBrandList} from '@/api/basic/brand';
    import {getChangeGoodsDetail} from '@/api/operations/goodsChange';
    import {getGoodsDetail} from '@/api/operations/goods';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            Levelbar,
            GoodsDescription,

        },
        name: 'oldchangedetail',
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        data () {
            return {
                goodsInfo: {},
                gcInfo: {},
                opType: '',
                goodsTab: '商品资料',
                brandList: [],
                iconInfo: true,
                iconInfo1: true,
                iconInfo2: true,
                iconInfo3: true
            }
        },
        mounted: function () {
            this.$nextTick(function () {
//                this.getBrand();
                this.gcInfo = this.$parent.gcInfo;

                this.myModulePower = this.$parent.myModulePower;
                console.log('this.$route.opType', this.$route.opType);
                if(this.$route.query.opType === 'add') {
                    console.log(this.$parent.changeGoods);

                    this.goodsInfo = this.$parent.changeGoods;
                } else if(this.$route.query.opType === 'edit') {
                    if(this.$parent.changeGoods.myadd) {
                        this.goodsInfo = this.$parent.changeGoods;
                    } else {
                        this.goodsInfo = this.$parent.changeGoods;
                        this.getChangeGoods();
                    }
                }
                let activeIndex = this.$store.state.tabs.view.activeTab,
                  queryParams = this.$route.query;
                this.$store.state.tabs.view.menus[activeIndex].query = queryParams;

            })
        },
        beforeDestroy: function () {
            console.log('beforeDestroy 销毁前状态===============》');
            console.log('this.myUserInfo==>', this.myUserInfo);
            let dataobj = {
                gcInfo: this.$parent.gcInfo,
                currentView: this.$parent.currentView,
                editDataList: this.$parent.editDataList,
                addNewGoods: this.$parent.addNewGoods,
                changeGoods: this.$parent.changeGoods,
                opType: this.$parent.opType, // 0--新增， 1--修改
                currentGoodsIndex: this.$parent.currentGoodsIndex,
                fromView: this.$parent.fromView,
                /*goodsInfo: this.goodsInfo,
                 brandInfo: this.brandInfo,
                 goodsDescrip: this.goodsDescrip,
                 goodsTab: this.goodsTab*/
            }

            this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify(dataobj)), name: '/operations/goodsChangeEdit'});

        },
        methods: {
            toEdit() {
                this.$parent.opType = 1;
                this.$parent.currentView = 'OldChangeEdit';
            },
            // 获取商品变更详情
            getChangeGoods() {
                getChangeGoodsDetail(this.gcInfo.sheetid, this.goodsInfo.objectid).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.goodsInfo = res.result;

                        for(let opt in this.goodsInfo) {
                            if(opt.indexOf('new') !== -1) {
                                if(this.goodsInfo[opt] === null || (!this.goodsInfo[opt] && this.goodsInfo[opt] !== 0)) {
                                    this.goodsInfo[opt] = JSON.parse(JSON.stringify(this.goodsInfo[opt.split('new')[1]]));
                                }
                            }
                        }

                        this.$set(this.goodsInfo, 'picList', []);


                        if(this.goodsInfo.newfilename) {
                            this.goodsInfo.picList.push({picIndex: 0, filename: this.goodsInfo.newfilename});
                        }
                        if(this.goodsInfo.newfilename2) {
                            this.goodsInfo.picList.push({picIndex: 1, filename: this.goodsInfo.newfilename2});
                        }
                        if(this.goodsInfo.newfilename3) {
                            this.goodsInfo.picList.push({picIndex: 2, filename: this.goodsInfo.newfilename3});
                        }
                        if(this.goodsInfo.newfilename4) {
                            this.goodsInfo.picList.push({picIndex: 3, filename: this.goodsInfo.newfilename4});
                        }
                        console.log('newchangedetail==', this.goodsInfo);

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
//                    this.$message(res.retMsg);
                });
            },
            // 返回
            doBack() {
                this.$parent.currentView = this.$parent.fromView;
            }


        }
    }

</script>

<style rel="stylesheet/scss" lang="scss">
    .oldChangeDetail{
        .sl-content-row-item-textarea{
            width: 80%;
            /*height: 200px;*/
            vertical-align: top;
        }

        .sl-search-showPart{
            text-align: justify;
            padding-top: 15px;
        }

        .sl-search-showPart::after{
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

        .sl-content-row-item-input{
            display: inline-block;
        }

        .sl-dropdown{
            text-align: left;
            position: absolute;
            z-index: 999;
            left: calc(50% - 50px);
            width: 200px;
        }

        .isChange input{
            color: #ff4949;
        }

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

        .info-container {
            background-color: #fff;
            border-radius: 5px;
            margin-top: 10px;
            padding: 10px 0;

            .info-container-title {
                padding-left: 10px;
                margin-left: 10px;
                font-size: 16px;
                font-weight: bold;
                border-left: 3px solid #28e;
            }
        }

        .goodsShowDes {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-top: 10px;

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

        .isChange {
            color: #ff4949;
        }

    }
</style>
