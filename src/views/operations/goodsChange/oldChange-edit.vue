<template>
    <div class="sl-page-container flex-col oldChangeEdit" v-loading="load1">
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
                <el-button-group>
                    <el-button type="primary" size="small" @click="doSave()" v-if="gcInfo.status == 0">保存</el-button>
                    <el-button type="primary" size="small" @click="doCancel()" v-if="gcInfo.status == 0">取消</el-button>
                </el-button-group>
            </div>

        </div>
        <div class="slic-content">

            <div class="slic-content-info" style="background-color: transparent;">

                <!--<div class="sl-search-panel" style="margin-bottom: 10px;">
                    <el-row :gutter="20" style="margin-bottom: 10px;">
                        <el-col :span="4">
                            <span>变更单号：</span>
                            <span>{{gcInfo.sheetid}}</span>
                            &lt;!&ndash;<span>123456798</span>&ndash;&gt;
                        </el-col>

                        <el-col :span="4">
                            <span>申请人：</span>
                            <span>{{gcInfo.editor}}</span>
                        </el-col>

                        <el-col :span="6">
                            <span>申请时间：</span>
                            <span>{{gcInfo.editdateStr}}</span>
                        </el-col>

                        <el-col :span="6">
                            <span>申请机构：</span>
                            <span>{{gcInfo.ename}}</span>
                        </el-col>

                        <el-col :span="4">
                            <span>状态：</span>
                            <span class="ostatus" v-if="gcInfo.status == 0">编辑中</span>
                            <span class="ostatus" v-if="gcInfo.status == 1">编辑完成</span>
                            <span class="ostatus" v-if="gcInfo.status == 2">已审核</span>
                            <span class="ostatus" v-if="gcInfo.status == 3">已否决</span>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="2" style="line-height: 30px;width: 60px;">备注：</el-col>
                        <el-col :span="22">
                            {{gcInfo.notes}}
                        </el-col>
                    </el-row>

                </div>-->
                <div class="slic-content-info-tab">
                    <el-radio-group v-model="goodsTab">
                        <el-radio-button label="商品资料"></el-radio-button>
                        <el-radio-button label="商品描述"></el-radio-button>
                    </el-radio-group>
                </div>

                <transition name="el-fade-in-linear">
                    <div v-show="goodsTab === '商品资料'" class="sl-form-group" style="margin-top: 10px;">
                        <div class="sl-row-group" >
                            <div class="sl-row-group-title">
                                变更前
                                <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                            </div>

                            <span class="animated fadeIn" v-show="iconInfo" >
                                <el-form class="sl-form" label-width="100px" style="padding: 0;">
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
                                            <span>{{goodsInfo.cost || goodsInfo.costPrice}}</span>
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

                            <span class="animated fadeIn" v-show="iconInfo1" >
                                <el-form class="sl-form" :model="goodsInfo" :rules="rules" ref="newGoodsForm" label-width="100px" >
                                <el-row :gutter="20" >
                                    <el-col :span="8" >
                                        <el-form-item label="商品内码：" >
                                            <sl-input :input-val.sync="goodsInfo.newmygoodsid" placeholder="请输入商品内码" :class="{'isChange': (goodsInfo.newmygoodsid != goodsInfo.mygoodsid)}" :onlynum="true"></sl-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品名称：" prop="newgoodsname">
                                            <sl-input :class="{'isChange': (goodsInfo.newgoodsname != goodsInfo.goodsname)}" :input-val.sync="goodsInfo.newgoodsname" placeholder="请输入商品名称"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8">

                                        <el-form-item label="商品条码：" prop="newbarcode">
                                            <sl-input :input-val.sync="goodsInfo.newbarcode" placeholder="请输入商品条码" :class="{'isChange': (goodsInfo.newbarcode != goodsInfo.barcode)}" :onlynum="true"></sl-input>
                                        </el-form-item>

                                    </el-col>
                                </el-row>

                                <el-row :gutter="20" >

                                    <el-col :span="8" >

                                        <el-form-item label="销售单位：" prop="newuname">
                                            <sl-input :input-val.sync="goodsInfo.newuname" placeholder="请输入销售单位" :class="{'isChange': (goodsInfo.newuname != goodsInfo.uname)}"></sl-input>
                                        </el-form-item>

                                    </el-col>
                                    <el-col :span="8" >

                                        <el-form-item label="销售规格一：" prop="newspec">
                                            <sl-input :input-val.sync="goodsInfo.newspec" placeholder="请输入销售规格" :class="{'isChange': (goodsInfo.newspec != goodsInfo.spec)}"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="销售规格二：">
                                            <sl-input :input-val.sync="goodsInfo.newspec2" placeholder="请输入销售规格" :class="{'isChange': (goodsInfo.newspec2 != goodsInfo.spec2)}"></sl-input>
                                        </el-form-item>

                                    </el-col>




                                </el-row>

                                    <!--<hr />-->

                                <el-row :gutter="20" >

                                    <el-col :span="8">

                                        <el-form-item label="商品品牌：" >
                                            <el-select v-model="newbrandinfo" filterable placeholder="请选择品牌" size="small" style="width: 100%;" value-key="brandId" @change="brandChange" >
                                                <el-option v-for="brand in brandList" :key="brand.brandId" :label="brand.brandName" :value="brand"></el-option>
                                            </el-select>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品分类：" prop="newcatId">
                                            <sl-tree-select-cat @selectedNode="selectCatTree"
                                                                :slTreeProps="catProps"
                                                                :defaultCheck="defaultCat"
                                                                :onlyleaf="true"
                                                                :isShowThird="true">
                                            </sl-tree-select-cat>
                                        </el-form-item>
                                    </el-col>


                                    <el-col :span="8" style="position: relative">
                                        <el-form-item label="长宽高：" >
                                            <sl-input :input-val.sync="goodsInfo.newisize" placeholder="请输入商品长宽高" :class="{'isChange': (goodsInfo.newisize != goodsInfo.isize)}"></sl-input>
                                        </el-form-item>
                                    </el-col>


                                </el-row>

                                <el-row :gutter="20" >
                                    <el-col :span="8">

                                        <el-form-item label="净重：" >
                                            <sl-input :input-val.sync="goodsInfo.newweight" placeholder="请输入商品净重" append="g" :class="{'isChange': (goodsInfo.newweight != goodsInfo.weight)}" :onlyfloat="true" :maxlength="12"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="默认进价：" prop="newcost">
                                            <sl-input :input-val.sync="goodsInfo.newcost" placeholder="请输入默认进价" :class="{'isChange': (goodsInfo.newcost != goodsInfo.cost)}" :maxlength="12" :onlyfloat="true"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="建议售价：" prop="newbulkprice">
                                            <sl-input :input-val.sync="goodsInfo.newbulkprice" placeholder="请输入建议售价" :class="{'isChange': (goodsInfo.newbulkprice != goodsInfo.bulkprice)}" :maxlength="12" :onlyfloat="true"></sl-input>
                                        </el-form-item>

                                    </el-col>
                                </el-row>

                            </el-form>
                            </span>



                        </div>
                    </div>

                </transition>

                <transition name="el-fade-in-linear">
                    <div  class="goodsDes" v-show="goodsTab === '商品描述'">
                        <!--<goods-description
                            :getResult="getResult"
                            @getResultInfo="getResultInfo">

                    </goods-description>-->
                        <goods-description @getResult="getGoodsDes" :defaultVal="goodsDescrip"></goods-description>
                    </div>
                </transition>
            </div>
        </div>




    </div>

</template>

<script>
    import SlTreeSelectCat from '@/components/sl-tree-select-cat.vue'
    import Levelbar from '@/views/layout/Levelbar.vue'
    import SlInput from '@/components/sl-input.vue';
    import GoodsDescription from '../common/goodsDes.vue'
    import {getBrandList} from '@/api/basic/brand';
    import {getChangeGoodsDetail} from '@/api/operations/goodsChange';
    import {getGoodsDetail} from '@/api/operations/goods';


    export default {
        components: {
            Levelbar,
            SlInput,
            GoodsDescription,
            SlTreeSelectCat
        },
        name: 'oldchangeeditman',

        data () {
            let costValid = (rule, value, callback) => {
                if(!value) {
                    callback('请输入默认进价');
                }  else if (value == 0) {
                    callback('默认进价不能为0');
                } else if ((/^(?:[1-9][0-9]*|0)(?:\.[0-9]+)?$/).test(value)) {
                    callback();
                } else {
                    callback('请输入正确的价格');
                }
            };
            let bulkValid = (rule, value, callback) => {
                if(!value) {
                    callback('请输入建议售价');
                }  else if (value == 0) {
                    callback('建议售价不能为0');
                } else if ((/^(?:[1-9][0-9]*|0)(?:\.[0-9]+)?$/).test(value)) {
                    callback();
                } else {
                    callback('请输入正确的价格');
                }
            };
            let newbarcodeValid = (rule, value, callback) => {
                if(!value) {
                    callback('请输入商品条码');
                } else {
                    callback();
                }
            };

            return {
                load1: false,
                iconInfo: true,
                iconInfo1: true,
                goodsInfo: {},
                newbrandinfo: {brandId: 0, brandName: ''},
                goodsDescrip: {},
                gcInfo: {},
                opType: '',
                getResult: false,
                goodsTab: '商品资料',
                brandList: [],
                editorText: '',
                defaultCat: {},
                catProps: {
                    label: 'catName',
                    children: 'lowerCatList',
                    key: 'catId',
                    disabled: 'disabled'
                },
                rules: {
                    newgoodsname: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'}
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    newspec: [
                        {required: true, message: '请输入商品规格', trigger: 'blur'}
                    ],
                    /*catId: [
                     {required: true, message: '请选择品类', trigger: 'change', type: 'number'}
                     ],*/
                    newuname: [
                        {required: true, message: '请输入销售单位', trigger: 'blur'}
                    ],
                    newcost: [
                        { validator: costValid, trigger: 'blur',required: true}
                    ],
                    newbulkprice: [
                        { validator: bulkValid, trigger: 'blur',required: true}
                    ],
                    newbarcode: [
                        { validator: newbarcodeValid, trigger: 'blur',required: true}
                    ]
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.getBrand();
                this.gcInfo = this.$parent.gcInfo;

                this.goodsId = this.$parent.changeGoods.goodsid;
                console.log('7987',this.$parent.changeGoods);

                if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
                    let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
//                    console.log('this.catahData==>', this.$route);
//                    this.myUserInfo = catahData;

                    this.goodsInfo = catahData.goodsInfo;
                    this.newbrandinfo = catahData.newbrandinfo;
                    this.goodsDescrip = catahData.goodsDescrip;
                    this.goodsTab = catahData.goodsTab;
                    this.defaultCat = catahData.defaultCat;
                    this.goodsDescrip = JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes}));

                } else {
                    if(this.$route.query.opType === 'add') {
                        console.log(this.$parent.changeGoods);

                        if(this.$parent.opType === 1) {
                            this.goodsInfo = this.$parent.changeGoods;
//                        this.$set(this.goodsInfo, 'newbrandinfo', {brandId: this.goodsInfo.brandid});
                            this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.brandid);
                            this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.brandname);

                            this.$set(this.defaultCat, 'key', this.goodsInfo.newmycatid);
                            this.$set(this.defaultCat, 'catName', this.goodsInfo.newcatlname);
                        } else {
                            this.getGoodsInfo();
//                        this.$set(this.goodsInfo, 'newbrandinfo', {brandId: ''});
                            this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.newbrandid);
                            this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.newbrandname);
                        }

                    } else if(this.$route.query.opType === 'edit') {
                        if(this.$parent.opType === 1) {
                            if(this.$parent.changeGoods.myadd) {
                                this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.changeGoods));
//                            this.$set(this.goodsInfo, 'newbrandinfo', {brandId: this.goodsInfo.brandid});
                                this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.newbrandid);
                                this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.newbrandname);
                                this.$set(this.defaultCat, 'key', this.goodsInfo.newmycatid);
                                this.$set(this.defaultCat, 'catName', this.goodsInfo.newcatlname);
                            } else {
                                this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.changeGoods));
                                this.getChangeGoods();
                            }
                        } else {
                            this.getGoodsInfo();
                        }
                    }

                    this.goodsDescrip = JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes}));
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
                goodsInfo: this.goodsInfo,
                newbrandinfo: this.newbrandinfo,
                goodsDescrip: this.goodsDescrip,
                goodsTab: this.goodsTab,
                defaultCat: this.defaultCat
            }

            this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify(dataobj)), name: '/operations/goodsChangeEdit'});
        },
        methods: {

            // 品类树选中
            selectCatTree(sel) {
                this.goodsInfo.newmycatid = sel.catId;
                this.goodsInfo.newcatname = sel.catName;
                this.goodsInfo.newcatlname = sel.catName;
            },
            // 品牌选中
            brandChange(sel) {
                console.log('123122222222222222',sel);
                if(sel) {
                    this.$set(this.goodsInfo, 'newbrandid', sel.brandId);
                    this.$set(this.goodsInfo, 'newbrandname', sel.brandName);
                }
            },
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
                        /*setTimeout(()=> {

                            this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.newbrandid);
                            this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.newbrandname);
                            console.log('this.newbrandinfo==', this.newbrandinfo)
                        },200)*/

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(err.retMsg);
                });
            },
            // 获取商品变更详情
            getChangeGoods() {
                this.load1 = true;
                getChangeGoodsDetail(this.gcInfo.sheetid, this.goodsInfo.objectid).then(res => {
                    this.load1 = false;
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

                        this.$set(this.defaultCat, 'key', this.goodsInfo.newmycatid || this.goodsInfo.mycatid);
                        this.$set(this.defaultCat, 'catName', this.goodsInfo.newcatlname);
                        this.$set(this.goodsInfo, 'newbrandinfo', {brandId: this.goodsInfo.newbrandid});
                        this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.newbrandid || this.goodsInfo.brandid);
                        this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.newbrandname || this.goodsInfo.brandname);
                        this.$set(this, 'goodsDescrip', JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes})));

                        this.getBrand();
                        console.log(77777777777777, this.goodsDescrip);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                    this.$message(res.retMsg);
                });
            },
            // 获取商品详情
            getGoodsInfo() {
                this.load1 = true;
                getGoodsDetail(this.goodsId).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.goodsInfo = res.result;
                        console.log('this.goodsInfo1==',this.goodsInfo);
                        this.$set(this.goodsInfo, 'newmygoodsid', JSON.parse(JSON.stringify(this.goodsInfo.mygoodsid)));
                        this.$set(this.goodsInfo, 'newgoodsname', JSON.parse(JSON.stringify(this.goodsInfo.goodsname)));
                        this.$set(this.goodsInfo, 'newbarcode', parseInt(JSON.parse(JSON.stringify(this.goodsInfo.barcode))));
                        this.$set(this.goodsInfo, 'newspec', JSON.parse(JSON.stringify(this.goodsInfo.spec)));
                        this.$set(this.goodsInfo, 'newspec2', JSON.parse(JSON.stringify(this.goodsInfo.spec2)));
                        this.$set(this.goodsInfo, 'newmycatid', JSON.parse(JSON.stringify(this.goodsInfo.mycatid)));
                        /*this.defaultCat = {
                            key: this.goodsInfo.catid,
                            catName: ''
                        }*/
                        console.log('this.goodsInfo4==',this.goodsInfo);
//                        this.$set(this.goodsInfo, 'newbrandinfo', {brandId: JSON.parse(JSON.stringify(this.goodsInfo.brandid))});

                        this.$set(this.defaultCat, 'key', this.goodsInfo.newmycatid || this.goodsInfo.mycatid );
                        this.$set(this.defaultCat, 'catName', this.goodsInfo.catLName);

                        this.$set(this.goodsInfo, 'newuname', JSON.parse(JSON.stringify(this.goodsInfo.uname)));
                        this.$set(this.goodsInfo, 'newisize', JSON.parse(JSON.stringify(this.goodsInfo.isize)));
                        this.$set(this.goodsInfo, 'newweight', JSON.parse(JSON.stringify(this.goodsInfo.weight)));
                        this.$set(this.goodsInfo, 'newbulkprice', JSON.parse(JSON.stringify(this.goodsInfo.bulkprice)));
                        this.$set(this.goodsInfo, 'newcost', JSON.parse(JSON.stringify(this.goodsInfo.cost || this.goodsInfo.costPrice)));

                        this.$set(this, 'goodsDescrip', JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes})));

                        setTimeout(()=> {

                            this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.brandid);
                            this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.brandname || this.goodsInfo.brandName);
                            console.log('this.newbrandinfo==', this.newbrandinfo)
                            this.$set(this.goodsInfo, 'newbrandinfo', this.newbrandinfo);
                            this.brandChange({brandId: this.newbrandinfo.brandId,brandName: this.newbrandinfo.brandName})

                            this.getBrand();
                        },500)
//                        this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.brandid);
//                        this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.brandname);




                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 返回
            doBack() {
                this.$confirm('确认放弃编辑吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$parent.currentView = this.$parent.fromView;
                }).catch();

            },
            // 保存
            doSave(event) {
                this.$refs['newGoodsForm'].validate((valid) => {
                    if (valid) {
                        console.log('8888888888888888888888888',this.goodsInfo);

                        this.goodsInfo.newbrandname = this.goodsInfo.newbrandname ? this.goodsInfo.newbrandname : this.goodsInfo.brandName;
                        this.goodsInfo.newcatlname = this.goodsInfo.newcatlname ? this.goodsInfo.newcatlname : this.goodsInfo.catLName;
                        this.goodsInfo.newmycatid = this.goodsInfo.newmycatid ? this.goodsInfo.newmycatid : this.goodsInfo.mycatid;
                        this.goodsInfo.newbrandid = this.goodsInfo.newbrandid ? this.goodsInfo.newbrandid : this.goodsInfo.brandid;

                        this.goodsInfo.brandname = this.goodsInfo.brandname ? this.goodsInfo.brandname : this.goodsInfo.brandName;
                        this.goodsInfo.cost = this.goodsInfo.cost ? this.goodsInfo.cost : (this.goodsInfo.costPrice ? this.goodsInfo.costPrice : '');

                        this.goodsInfo.newnotes = this.goodsInfo.notes;

                        this.goodsInfo.picList.forEach((item, i) => {
                            item.filename = item.filename ? item.filename : (item.fileName ? item.fileName : '');

                            this.goodsInfo[i === 0 ? 'newfilename' : ('newfilename' + (i + 1))] = item.filename;
                        })

                        this.goodsInfo.modifytype = 2;

                        this.goodsInfo.myadd = true;

                        if(this.$parent.opType === 1) {
                            this.$parent.editDataList.splice(this.$parent.currentGoodsIndex, 1, this.goodsInfo);
                        } else {
                            this.$parent.editDataList.push(this.goodsInfo);
                        }

                        this.$parent.currentView = 'GoodsChangeEdit';

                        console.log('8888888888888888888888888',this.goodsInfo);



                    } else {
                        this.goodsTab = '商品资料';
                        console.log('error submit!!', valid);
                        return false;
                    }
                });

            },
            // 取消
            doCancel() {
                console.log(this.content);
                this.$confirm('确认放弃编辑吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(this.$route.query.opType === 'add') {
                        console.log(this.$parent.changeGoods);

                        if(this.$parent.opType === 1) {
                            this.goodsInfo = this.$parent.changeGoods;
//                        this.$set(this.goodsInfo, 'newbrandinfo', {brandId: this.goodsInfo.brandid});
                            this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.brandid);
                            this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.brandname);

                            this.$set(this.defaultCat, 'key', this.goodsInfo.newmycatid);
                            this.$set(this.defaultCat, 'catName', this.goodsInfo.newcatlname);
                        } else {
                            this.getGoodsInfo();
//                        this.$set(this.goodsInfo, 'newbrandinfo', {brandId: ''});
                            this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.newbrandid);
                            this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.newbrandname);
                        }

                    } else if(this.$route.query.opType === 'edit') {
                        if(this.$parent.opType === 1) {
                            if(this.$parent.changeGoods.myadd) {
                                this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.changeGoods));
//                            this.$set(this.goodsInfo, 'newbrandinfo', {brandId: this.goodsInfo.brandid});
                                this.$set(this.newbrandinfo, 'brandId', this.goodsInfo.newbrandid);
                                this.$set(this.newbrandinfo, 'brandName', this.goodsInfo.newbrandname);
                                this.$set(this.defaultCat, 'key', this.goodsInfo.newmycatid);
                                this.$set(this.defaultCat, 'catName', this.goodsInfo.newcatlname);
                            } else {
                                this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.changeGoods));
                                this.getChangeGoods();
                            }
                        } else {
                            this.getGoodsInfo();
                        }
                    }
                }).catch()
            },
            // 获取图片路径和富文本编辑结果
            getGoodsDes(val) {
                this.goodsInfo.newfilename = '';
                this.goodsInfo.newfilename2 = '';
                this.goodsInfo.newfilename3 = '';
                this.goodsInfo.newfilename4 = '';

                console.log('999999999888888888888888888',val);
                this.goodsInfo.notes = val.text;
                this.goodsInfo.picList = val.pic;
                this.goodsInfo.picList.forEach((item, i) => {
                    this.goodsInfo[i === 0 ? 'newfilename' : ('newfilename' + (i + 1))] = item.filename;
                })
            },

        }
    }

</script>

<style rel="stylesheet/scss" lang="scss">
    .oldChangeEdit {
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

        .goodsDes {
            /*height: 100%;*/
            width: 100%;
            background-color: #fff;
            border-radius: 5px;
            flex: 1;
            margin-top: 10px;
            display: flex;
            flex-direction: column;
        }

    }
</style>
