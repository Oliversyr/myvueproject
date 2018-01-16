<template>
    <div class="sl-page-container flex-col newChangeDetail">
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
            <!--<div style="float: right;">
                <el-button-group>
                    <el-button type="primary" size="small" @click="saveGoods($event)">保存</el-button>
                    <el-button type="primary" size="small" @click="cancelGoods($event)">取消</el-button>
                </el-button-group>
            </div>-->
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="toEdit()" v-if="gcInfo.status === 0 && myModulePower.edit">编辑</el-button>
                    <!--<el-button-group>-->

                        <!--<el-button type="primary" size="small" @click="doCancel()" v-if="gcInfo.status !== 1">取消</el-button>-->
                    <!--</el-button-group>-->
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
                    <div v-show="goodsTab === '商品资料'" style="margin-top: 10px;">
                        <el-form class="sl-form-group" :model="goodsInfo" ref="newGoodsForm" label-width="100px" >
                            <div class="sl-row-group" style="margin-bottom: 10px;">
                                <div class="sl-row-group-title">
                                    基本信息
                                    <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                                </div>

                                <span class="animated fadeIn" v-show="iconInfo">
                                    <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8" >

                                        <el-form-item label="商品内码：" class="el-form-item-detail">
                                            <span :title="goodsInfo.mygoodsid">{{goodsInfo.mygoodsid}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品名称：" prop="goodsname" class="el-form-item-detail">
                                            <span :title="gcInfo.goodsname">{{goodsInfo.goodsname}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8">

                                        <el-form-item label="商品条码：" prop="barcode" class="el-form-item-detail">
                                            <span :title="goodsInfo.barcode">{{goodsInfo.barcode}}</span>
                                        </el-form-item>

                                    </el-col>
                                </el-row>

                                <el-row :gutter="20" class="sl-form-row">

                                    <el-col :span="8" >

                                        <el-form-item label="销售单位：" prop="uname" class="el-form-item-detail">
                                            <span :title="goodsInfo.uname">{{goodsInfo.uname}}</span>
                                        </el-form-item>

                                    </el-col>
                                    <el-col :span="8" >

                                        <el-form-item label="销售规格一：" prop="spec" class="el-form-item-detail">
                                            <span  :title="goodsInfo.spec">{{goodsInfo.spec}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="销售规格二：" class="el-form-item-detail">
                                            <span  :title="goodsInfo.spec2">{{goodsInfo.spec2}}</span>
                                        </el-form-item>

                                    </el-col>




                                </el-row>

                                    <!--<hr />-->

                                <el-row :gutter="20" class="sl-form-row">

                                    <el-col :span="8">

                                        <el-form-item label="商品品牌：" class="el-form-item-detail">
                                            <!--<el-select v-model="goodsInfo.brandId" placeholder="请选择品牌" size="small" v-show="false">
                                                <el-option v-for="brand in brandList" :key="brand.brandId" :label="brand.brandName" :value="brand.brandId"></el-option>

                                            </el-select>-->
                                            <span :title="goodsInfo.brandname">{{goodsInfo.brandname || goodsInfo.brandName}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品分类：" prop="catId" class="el-form-item-detail">
                                            <!--<sl-tree-select-cat @selectedNode="selectCatTree"
                                                                :slTreeProps="catProps"
                                                                :isShowThird="true"
                                                                v-show="false"
                                                                :onlyleaf="true">
                                            </sl-tree-select-cat>-->
                                            <span  :title="goodsInfo.catName || goodsInfo.catlname">{{goodsInfo.catName || goodsInfo.catlname}}</span>
                                        </el-form-item>
                                    </el-col>





                                </el-row>

                                <el-row :gutter="20" class="sl-form-row">


                                    <el-col :span="8" >

                                        <el-form-item label="默认进价：" prop="cost" class="el-form-item-detail">
                                            <span :title="goodsInfo.cost">{{goodsInfo.cost}}</span>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="建议售价：" prop="bulkprice" class="el-form-item-detail">
                                            <span :title="goodsInfo.bulkprice">{{goodsInfo.bulkprice}}</span>
                                        </el-form-item>

                                    </el-col>
                                </el-row>
                                </span>

                            </div>

                            <div class="sl-row-group" style="margin-bottom: 10px;">
                                <div class="sl-row-group-title">
                                    控制信息
                                    <sl-icon-info :is-information-opened.sync="iconInfo1"></sl-icon-info>
                                </div>



                                <span class="animated fadeIn" v-show="iconInfo1">
                                    <el-row :gutter="20" class="sl-form-row">

                                        <el-col :span="8">

                                            <el-form-item label="净重：" class="el-form-item-detail">
                                                <span :title="goodsInfo.weight">{{goodsInfo.weight}}g</span>
                                            </el-form-item>

                                        </el-col>

                                        <el-col :span="8" style="position: relative">

                                            <el-form-item label="长宽高：" class="el-form-item-detail">
                                                <span :title="goodsInfo.isize">{{goodsInfo.isize}}</span>
                                            </el-form-item>

                                        </el-col>


                                    </el-row>
                                </span>



                            </div>



                        </el-form>
                    </div>

                </transition>

                <transition name="el-fade-in-linear">
                    <div v-show="goodsTab === '商品描述'" class="goodsDes">
                        <div class="goodsShowDes">
                            <div class="goodsDes-pic">
                                <div class="goodsDes-pic-title">
                                    商品图片
                                    <sl-icon-info :is-information-opened.sync="iconInfo2"></sl-icon-info>
                                </div>

                                <span class="animated fadeIn" v-show="iconInfo2">
                                    <ul class="goodsDes-pic-content">
                                        <li class="goodsDes-pic-content-list" v-for="pic in goodsInfo.picList" :key="pic.filename">
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

    import {mapGetters} from 'vuex';
    import Levelbar from '@/views/layout/Levelbar.vue'
    import GoodsDescription from '../common/goodsDes.vue'
    import {getBrandList} from '@/api/basic/brand';
    import {getChangeGoodsDetail} from '@/api/operations/goodsChange';
    import RouterMixins from '@/mixins/router';
    export default {
        components: {
            Levelbar,
            GoodsDescription,

        },
        name: 'newchangedetailman',
        mixins: [RouterMixins],
        data () {
            return {
                iconInfo: true,
                iconInfo1: true,
                iconInfo2: true,
                iconInfo3: true,
                goodsInfo: {brandId: ''},
                goodsTab: '商品资料',
                gcInfo: {},
                brandList: [],
                catProps: {
                    label: 'catName',
                    children: 'lowerCatList',
                    key: 'catId'
                }

            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mounted: function () {
            this.$nextTick(function () {
//                this.getBrand();
                this.gcInfo = this.$parent.gcInfo;
                this.myModulePower = this.$parent.myModulePower;
                if(this.$parent.addNewGoods.myadd) {
                    this.goodsInfo = this.$parent.addNewGoods;
                } else {
                    this.goodsInfo = this.$parent.addNewGoods;
                    this.getChangeGoods();
                }

                console.log('newchangedetail==', this.goodsInfo);

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
            // 品类树选中
            /*selectCatTree(sel) {
                this.goodsInfo.catId = sel.catId;
                this.goodsInfo.catLName = sel.catName;
            },*/
            // 获取品牌列表
            getBrand() {
                const _this = this;
                let opt = {
                    brandName: '',
                    status: -1
                }
                getBrandList(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.brandList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                });
            },
            // 获取商品变更详情
            getChangeGoods() {
                getChangeGoodsDetail(this.gcInfo.sheetid, this.goodsInfo.objectid).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.goodsInfo = res.result;
                        this.$set(this.goodsInfo, 'picList', []);


                        if(this.goodsInfo.filename) {
                            this.goodsInfo.picList.push({filename: this.goodsInfo.filename});
                        }
                        if(this.goodsInfo.filename2) {
                            this.goodsInfo.picList.push({filename: this.goodsInfo.filename2});
                        }
                        if(this.goodsInfo.filename3) {
                            this.goodsInfo.picList.push({filename: this.goodsInfo.filename3});
                        }
                        if(this.goodsInfo.filename4) {
                            this.goodsInfo.picList.push({filename: this.goodsInfo.filename4});
                        }
                        console.log('newchangedetail==', this.goodsInfo);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
//                    this.$message(res.retMsg);
                });
            },
            toEdit() {
                this.$parent.opType = 1;
                this.$parent.currentView = 'NewChangeEdit';
            },
            // 返回
            doBack() {
//                sessionStorage.setItem('fromType', JSON.stringify(9));
//                this.$router.go(-1);
//                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$parent.currentView = this.$parent.fromView;
            },
            // 日期格式化
            dateFormat(mydate, myfmt) {
                Date.prototype.Format = function (fmt) { //author: meizz
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }

                return mydate.Format(myfmt);
            }

        }

    }

</script>

<style rel="stylesheet/scss" lang="scss">
    .newChangeDetail{

        .slic-content-info {
            display: flex;
            flex-direction: column;
            background-color: transparent;
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

        /*.goodsDes {
            !*height: 100%;*!
            width: 100%;
            background-color: #fff;
            border-radius: 5px;
            flex: 1;
            margin-top: 10px;
            display: flex;
            flex-direction: column;
        }*/

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

        .ostatus {
            color: #fb0;
        }
        
        .el-col {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

    }
</style>
