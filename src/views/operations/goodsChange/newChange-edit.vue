<template>
    <div class="sl-page-container flex-col newChangeEdit">
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
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSave()" v-if="gcInfo.status !== 1">保存</el-button>
                        <el-button type="primary" size="small" @click="doCancel()" v-if="gcInfo.status !== 1">取消</el-button>
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
                    <div v-show="goodsTab === '商品资料'" style="margin-top: 10px;">
                        <el-form class="sl-form-group" :model="goodsInfo" :rules="rules" ref="newGoodsForm" label-width="100px" style="padding-bottom: 0;">
                            <div class="sl-row-group">
                                <div class="sl-row-group-title">
                                    基本信息
                                    <sl-icon-info :is-information-opened.sync="iconInfo"></sl-icon-info>
                                </div>

                                <span class="animated fadeIn" v-show="iconInfo" >
                                    <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8" >

                                        <el-form-item label="商品内码：" >
                                            <sl-input :input-val.sync="goodsInfo.mygoodsid" :onlynum="true" placeholder="请输入商品内码"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品名称：" prop="goodsname">
                                            <sl-input :input-val.sync="goodsInfo.goodsname" :maxlength="16" placeholder="请输入商品名称"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8">

                                        <el-form-item label="商品条码：" prop="barcode">
                                            <sl-input :input-val.sync="goodsInfo.barcode" :onlynum="true" placeholder="请输入商品条码"></sl-input>
                                        </el-form-item>

                                    </el-col>
                                </el-row>

                                <el-row :gutter="20" class="sl-form-row">
                                    <el-col :span="8" >

                                        <el-form-item label="销售单位：" prop="uname">
                                            <sl-input :input-val.sync="goodsInfo.uname" placeholder="请输入销售单位"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="销售规格一：" prop="spec">
                                            <sl-input :input-val.sync="goodsInfo.spec" placeholder="请输入销售规格"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" >

                                        <el-form-item label="销售规格二：">
                                            <sl-input :input-val.sync="goodsInfo.spec2" placeholder="请输入销售规格"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                </el-row>

                                    <!--<hr />-->

                                <el-row :gutter="20" class="sl-form-row">



                                    <el-col :span="8">

                                        <el-form-item label="商品品牌：" >
                                            <el-select v-model="brandInfo" size="small" filterable style="width: 100%;" placeholder="请选择商品品牌" @change="brandChange" value-key="brandId">
                                                <el-option v-for="brand in brandList" :key="brand.brandId" :label="brand.brandName" :value="brand"></el-option>
                                            </el-select>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="商品分类：">
                                            <sl-tree-select-cat @selectedNode="selectCatTree"
                                                                :slTreeProps="catProps"
                                                                :defaultCheck="{key: goodsInfo.mycatid, catName: goodsInfo.catName}"
                                                                :isShowThird="true"
                                                                :resetCheck="resetCat"
                                                                :onlyleaf="true">
                                            </sl-tree-select-cat>
                                        </el-form-item>
                                    </el-col>

                                </el-row>

                                <el-row :gutter="20" class="sl-form-row">

                                    <el-col :span="8" >

                                        <el-form-item label="默认进价：" prop="cost">
                                            <sl-input :input-val.sync="goodsInfo.cost" placeholder="请输入默认进价" :maxlength="12" :onlyfloat="true"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="建议售价：" prop="bulkprice">
                                            <sl-input :input-val.sync="goodsInfo.bulkprice" placeholder="请输入建议售价" :maxlength="12" :onlyfloat="true"></sl-input>
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

                                <span class="animated fadeIn" v-show="iconInfo1" >
                                    <el-row :gutter="20" class="sl-form-row">

                                    <el-col :span="8">

                                        <el-form-item label="净重：" >
                                            <sl-input :input-val.sync="goodsInfo.weight" placeholder="请输入商品净重" append="g" :onlyfloat="true" :maxlength="12"></sl-input>
                                        </el-form-item>

                                    </el-col>

                                    <el-col :span="8" style="position: relative">

                                        <el-form-item label="长宽高：" >
                                            <sl-input :input-val.sync="goodsInfo.isize" placeholder="请输入商品尺寸" :maxlength="16"></sl-input>
                                        </el-form-item>

                                    </el-col>


                                </el-row>
                                </span>


                            </div>

                        </el-form>
                    </div>

                </transition>

                <transition name="el-fade-in-linear">
                    <div v-show="goodsTab === '商品描述'" class="goodsDes  mb-xsmall">
                        <goods-description @getResult="getGoodsDes" :defaultVal="goodsDescrip"></goods-description>
                    </div>
                </transition>
            </div>
        </div>




    </div>

</template>

<script>
    import SlTreeSelectCat from '../../../components/sl-tree-select-cat.vue'
    import {mapGetters} from 'vuex';
    import RouterMixins from '@/mixins/router';
    import SlInput from '@/components/sl-input.vue';
    import Levelbar from '@/views/layout/Levelbar.vue'
    import GoodsDescription from '../common/goodsDes.vue'
    import {getBrandList} from '@/api/basic/brand';
    import {getChangeGoodsDetail} from '@/api/operations/goodsChange';

    export default {
        components: {
            Levelbar,
            GoodsDescription,
            SlTreeSelectCat,
            SlInput
        },
        name: 'newchangedetailman',
        mixins: [RouterMixins],
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
                goodsInfo: {
                    mygoodsid: '',
                    goodsname: '',
                    barcode: '',
                    uname: '',
                    spec: '',
                    spec2: '',
                    brandinfo: {},
                    mycatid: '',
                    catlname: '',
                    cost: '',
                    bulkprice: '',
                    weight: '',
                    isize: '',
                    picList: [],
                    notes: '',
                    goodsdes: ''
                },
                resetCat: false,
                brandInfo: {brandId: 0, brandName: ''},
                iconInfo: true,
                iconInfo1: true,
                goodsDescrip: {},
                goodsTab: '商品资料',
                gcInfo: {},
                brandList: [],
                catProps: {
                    label: 'catName',
                    children: 'lowerCatList',
                    key: 'catId',
                    disabled: 'disabled'
                },
                rules: {
                    goodsname: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'}
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    spec: [
                        {required: true, message: '请输入商品规格', trigger: 'blur'}
                    ],
                    /*catId: [
                        {required: true, message: '请选择品类', trigger: 'change', type: 'number'}
                    ],*/
                    uname: [
                        {required: true, message: '请输入销售单位', trigger: 'blur'}
                    ],
                    cost: [
                        { validator: costValid, trigger: 'blur',required: true}
                    ],
                    bulkprice: [
                        { validator: bulkValid, trigger: 'blur',required: true}
                    ],
                    barcode: [
                        { validator: newbarcodeValid, trigger: 'blur',required: true}
                    ]
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
                this.getBrand();
                this.gcInfo = this.$parent.gcInfo;

                if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
                    let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
//                    console.log('this.catahData==>', this.$route);
//                    this.myUserInfo = catahData;

                    this.goodsInfo = catahData.goodsInfo;
                    this.brandInfo = catahData.brandInfo;
                    this.goodsDescrip = catahData.goodsDescrip;
                    this.goodsTab = catahData.goodsTab;
                    this.goodsDescrip = JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes}));

                } else {
                    if(this.$parent.opType === 1) {
                        if(this.$parent.addNewGoods.myadd) {
                            this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.addNewGoods));
//                        this.$set(this.goodsInfo, 'brandInfo', {brandId: this.goodsInfo.brandid});
                            this.$set(this.brandInfo, 'brandId', this.goodsInfo.brandid);
                            this.$set(this.brandInfo, 'brandName', this.goodsInfo.brandname);
                            this.$set(this.goodsInfo, 'barcode', parseInt(this.goodsInfo.barcode));
                        } else {
                            this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.addNewGoods));
//                        this.$set(this.goodsInfo, 'brandInfo', {brandId: this.goodsInfo.brandid});
                            this.$set(this.brandInfo, 'brandId', this.goodsInfo.brandid);
                            this.$set(this.brandInfo, 'brandName', this.goodsInfo.brandname);
                            this.$set(this.goodsInfo, 'barcode', parseInt(this.goodsInfo.barcode));
                            this.getChangeGoods();
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
                brandInfo: this.brandInfo,
                goodsDescrip: this.goodsDescrip,
                goodsTab: this.goodsTab
            }

            this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify(dataobj)), name: '/operations/goodsChangeEdit'});
        },
        methods: {
            // 品类树选中
            selectCatTree(sel) {
                this.goodsInfo.mycatid = sel.catId;
                this.goodsInfo.catName = sel.catName;
                this.resetCat = false;
            },
            brandChange(sel) {
                console.log('123122222222222222',sel);
                if(sel) {
                    this.$set(this.goodsInfo, 'brandid', sel.brandId);
                    this.$set(this.goodsInfo, 'brandName', sel.brandName);
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

                        this.$set(this.brandInfo, 'brandId', this.goodsInfo.brandid);
                        this.$set(this.brandInfo, 'brandName', this.goodsInfo.brandname);
                        console.log('newchangedetail==', this.goodsInfo);

                        this.goodsDescrip = JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes}));
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
//                    this.$message(res.retMsg);
                });
            },
            // 保存
            doSave(event) {
                this.$refs['newGoodsForm'].validate((valid) => {

                    if (valid) {
                        console.log(this.goodsInfo);
                        this.goodsInfo.brandid = this.goodsInfo.brandid ? this.goodsInfo.brandid : -1;
                        this.goodsInfo.brandName = this.goodsInfo.brandName ? this.goodsInfo.brandName : '';

                        this.goodsInfo.cost = parseFloat(this.goodsInfo.cost);

                        this.goodsInfo.modifytype = 1;

                        this.goodsInfo.myadd = true;

                        /*if(!this.goodsInfo.mygoodsid) {
                            this.goodsInfo.mygoodsid = 0;
                        }*/

                        if(this.$parent.opType === 1) {
                            this.$parent.editDataList.splice(this.$parent.currentGoodsIndex, 1, this.goodsInfo);
                        } else {
                            this.$parent.editDataList.push(this.goodsInfo);
                        }

                        console.log(this.goodsInfo);
                        this.$parent.currentView = 'GoodsChangeEdit';


                    } else {
                        this.goodsTab = '商品资料';
                        console.log('error submit!!', valid);
                        return false;
                    }
                });

            },
            // 取消
            doCancel(event) {
                console.log(this.content);
                this.$confirm('确认取消编辑吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('this.$parent.opType==', this.$parent.opType)
                    if(this.$parent.opType === 0) {
                        this.$refs.newGoodsForm.resetFields();
                        this.goodsInfo.mygoodsid = '';
                        this.goodsInfo.goodsname = '';
                        this.goodsInfo.barcode = '';
                        this.goodsInfo.uname = '';
                        this.goodsInfo.spec = '';
                        this.goodsInfo.spec2 = '';
                        this.goodsInfo.brandinfo = {};
                        this.goodsInfo.mycatid = '';
                        this.goodsInfo.catlname = '';
                        this.goodsInfo.cost = '';
                        this.goodsInfo.bulkprice = '';
                        this.goodsInfo.weight = '';
                        this.goodsInfo.isize = '';
                        this.goodsInfo.picList = [];
                        this.goodsInfo.notes = '';
                        this.resetCat = true;
                        this.brandInfo.brandId = 0;
                        this.brandInfo.brandName = '';
                        this.goodsDescrip = JSON.parse(JSON.stringify({pic: [], context: ''}));
                    } else {
                        if(this.$parent.addNewGoods.myadd) {
                            this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.addNewGoods));
                            this.$set(this.goodsInfo, 'brandInfo', {brandid: this.goodsInfo.brandid});
                            this.goodsDescrip = JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes}));
                        } else {
                            this.goodsInfo = JSON.parse(JSON.stringify(this.$parent.addNewGoods));
                            this.$set(this.goodsInfo, 'brandInfo', {brandid: this.goodsInfo.brandid});
                            this.getChangeGoods();
                            this.goodsDescrip = JSON.parse(JSON.stringify({pic: this.goodsInfo.picList, context: this.goodsInfo.notes}));
                        }

                    }
                }).catch()
            },
            // 获取图片路径和富文本编辑结果
            getGoodsDes(val) {
                this.goodsInfo.filename = '';
                this.goodsInfo.filename2 = '';
                this.goodsInfo.filename3 = '';
                this.goodsInfo.filename4 = '';

                this.goodsInfo.notes = val.text;
                this.goodsInfo.picList = val.pic;
                this.goodsInfo.picList.forEach((item, i) => {
                    this.goodsInfo[i === 0 ? 'filename' : ('filename' + (i + 1))] = item.filename;
                })
            },
            // 返回
            doBack() {
                this.$confirm('确认放弃编辑吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(this.$route.query.from === 'goods') {
                        this.$router.go(-1);
                        this.$store.dispatch('delVisitedViews', this.$route.name);
                    } else {
                        this.$parent.currentView = 'GoodsChangeEdit';
                    }
                }).catch()

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
    .newChangeEdit{


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

        .ostatus {
            color: #fb0;
        }
        
        

    }
</style>
