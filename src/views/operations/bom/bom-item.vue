<template>
    <div class="bom-item sl-page-container flex-col pst-rl"
         :class="pageType === 1 ? 'add' : pageType === 2 ? 'edit' : 'view'">
        <!-- 路由面包屑 -->
        <levelbar :levelList="levelList">
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-组合商品管理-组合商品详情】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以维护组合商品，新建、修改、禁用/启用。</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <!-- 页面操作按钮 -->
        <div class="sl-operator-panel">
            <div class="sl-operator-left">
                <el-button size="small" class="back slic-btn-theme3" @click="goToBom">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <!-- 【新增】状态按钮 -->
                <el-button-group v-show="pageType === 1">
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="addGoods"
                               :disabled="loading" v-if="myModulePower.add">添加商品
                    </el-button>
                    <el-button size="small" type="primary" class="slic-btn-theme3"
                               @click="addBom(bomItemForm)" :disabled="loading" v-if="myModulePower.add">
                        保存
                    </el-button>
                </el-button-group>
                <!-- 【编辑】状态按钮 -->
                <el-button-group v-show="pageType === 2">
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="addGoods"
                               :disabled="loading" v-if="myModulePower.edit">添加商品
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3"
                               @click="updateBomStatus($event, bomItemForm, 0)" :disabled="loading" v-if="myModulePower.edit">禁用
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3"
                               @click="updateBomStatus($event, bomItemForm, 1)" :disabled="loading" v-if="myModulePower.edit">启用
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="updateBom(bomItemForm)"
                               :disabled="loading" v-if="myModulePower.edit">保存
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="doCancel"
                               :disabled="loading">取消
                    </el-button>
                </el-button-group>
                <!-- 【浏览】状态按钮 -->
                <el-button-group v-show="pageType === 3">
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="editBom"
                               :disabled="loading" v-if="myModulePower.edit">编辑
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <!-- 组合商品信息 -->
        <div class="sl-panel flex-col overflow-y" v-loading="loading" style="border: none;">
            <!-- 基本信息 -->
            <div class="sl-item-panel detailView overflow-y mb-xsmall">
                <span class="slic-form-til">商品信息 <sl-icon-info
                        :is-information-opened.sync="isInformationOpened"></sl-icon-info></span>
                <el-row class="bom-goods-info mt-xsmall" v-show="isInformationOpened">
                    <el-col :span="16">
                        <el-form inline :model="bomItemForm" ref="bomItemForm" :rules="rules" label-width="95px">
                            <el-form-item label="店铺名称：" class="form-shop-name" prop="ename"
                                          v-show="pageType === 1">
                                <el-autocomplete
                                        ref="shopName"
                                        popper-class="shop-name-autocomplete"
                                        v-model="bomItemForm.ename"
                                        :fetch-suggestions="queryShopAutoComplete"
                                        custom-item="shop-name-item"
                                        placeholder="请输入店铺名称"
                                        @select="handleSelectShopAutoComplete"
                                        icon="caret-bottom"
                                        size="small"
                                        :on-icon-click="handleIconClickShopAutoComplete"
                                        :props="{label: 'ename',value: 'ename'}"
                                        style="width: 100%;"
                                ></el-autocomplete>
                            </el-form-item>
                            <el-form-item label="店铺名称：" class="form-shop-name" v-show="pageType === 2">
                                <el-autocomplete
                                        ref="shopName"
                                        popper-class="shop-name-autocomplete"
                                        v-model="bomItemForm.ename"
                                        :fetch-suggestions="queryShopAutoComplete"
                                        custom-item="shop-name-item"
                                        placeholder="请输入店铺名称"
                                        @select="handleSelectShopAutoComplete"
                                        icon="caret-bottom"
                                        size="small"
                                        :on-icon-click="handleIconClickShopAutoComplete"
                                        :props="{label: 'ename',value: 'ename'}"
                                        style="width: 100%;"
                                        :disabled="true"
                                ></el-autocomplete>
                            </el-form-item>
                            <el-form-item label="店铺名称：" class="form-shop-name" v-show="pageType === 3">
                                <label v-text="bomItemForm.ename" :title="bomItemForm.ename"></label>
                            </el-form-item>
                            <el-form-item label="组合商品名称：" class="form-goods-name" prop="goodsName"
                                          :show-message="pageType !== 3">
                                <el-input v-show="pageType !== 3" size="small" :maxlength="32"
                                          v-model="bomItemForm.goodsName"></el-input>
                                <label v-text="bomItemForm.goodsName" v-show="pageType === 3"
                                       :title="bomItemForm.goodsName"></label>
                            </el-form-item>
                            <el-form-item label="原价：" class="form-old-price" prop="oldPrice"
                                          :show-message="pageType !== 3">
                                <el-input v-show="pageType !== 3" size="small" v-model="bomItemForm.oldPrice"
                                          :disabled="true">
                                    <template slot="prepend">￥</template>
                                </el-input>
                                <label v-text="'￥' + bomItemForm.oldPrice" v-show="pageType === 3"
                                       :title="bomItemForm.oldPrice" class="tx-overflow"></label>
                            </el-form-item>
                            <el-form-item label="组合价：" class="form-last-price"
                                          :show-message="pageType !== 3">
                                <el-input v-show="pageType !== 3" :maxlength="12" size="small"
                                 v-input-validate.price="{ model: bomItemForm, key: 'price' }"
                                 v-model="bomItemForm.price">
                                    <template slot="prepend">￥</template>
                                </el-input>
                                <label v-text="'￥' + bomItemForm.price" v-show="pageType === 3"
                                       :title="bomItemForm.price" class="tx-overflow"></label>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="8">
                        <el-col :span="8">
                            <div class="mb">商品图片：</div>
                            <p class="mb-xsmall">尺寸：240*240像素</p>
                            <p class="mb-xsmall">大小：500KB以内</p>
                            <p class="mb-xsmall">格式：JPG、PNG</p>
                        </el-col>
                        <el-col :span="16" style="margin-top: -15px;">
                            <el-upload
                                    class="img-uploader mb-xsmall"
                                    :show-file-list="false"
                                    :action="uploadUrl"
                                    :headers="headers"
                                    :before-upload="beforeUpload"
                                    :disabled="pageType === 3"
                                    :http-request="myHttpRequest">
                                <img v-if="imageUrl" :src="imageUrl" class="img">
                                <i v-else class="el-icon-plus img-uploader-icon"></i>
                            </el-upload>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <!-- 包含的商品表格列表信息 -->
            <div class="sl-content-panel flex-col overflow-y" style="margin-top: 5px;">
                <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg" @cellMouseEnter="cellMouseEnter"
                         @cellMouseLeave="cellMouseLeave">
                    <template slot="goodsid" scope="prop">
                        <el-button type="text" size="small">{{prop.scope.row.goodsid}}</el-button>
                    </template>
                    <template slot="price" scope="prop">
                        <div class="label" :class="{ 'view': pageType === 3 }">
                            {{prop.scope.row.price}}
                            <i class="el-icon-edit" @click.stop="editCell" v-show="myModulePower.add || myModulePower.edit"></i>
                        </div>
                        <div class="edit" :class="{ 'view': pageType === 3 }">
                            <el-input size="small" placeholder="请输入售价" v-model="prop.scope.row.price"
                                      v-input-validate.price="{ model: prop.scope.row, key: 'price' }"
                                      @blur="handleCellChangeClick"
                                      @focus="handleFocusCell()"
                                      autofocus></el-input>
                        </div>
                    </template>
                    <template slot="qty" scope="prop">
                        <div class="label" :class="{ 'view': pageType === 3 }">
                            {{prop.scope.row.qty}}
                            <i class="el-icon-edit" @click.stop="editCell" v-show="myModulePower.add || myModulePower.edit"></i>
                        </div>
                        <div class="edit" :class="{ 'view': pageType === 3 }">
                            <el-input size="small" placeholder="请输入组合数量" v-model="prop.scope.row.qty" 
                                      v-input-validate.integer="{ model: prop.scope.row, key: 'qty', min:1 }"
                                      @blur="handleCellChangeClick"
                                      @focus="handleFocusCell()"
                                      autofocus></el-input>
                        </div>
                    </template>
                    <template slot="totalPrice" scope="prop">
                        {{isNaN(prop.scope.row.qty * prop.scope.row.price) ? '' : (prop.scope.row.qty * prop.scope.row.price).toFixed(2)}}
                    </template>
                    <template slot="operate" scope="prop">
                        <el-button type="text" size="small" @click="removeBomGoodsItem(prop.scope.row)">移除</el-button>
                    </template>
                </sl-grid>
            </div>
        </div>
        <!-- 添加商品弹出框 -->
        <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible" custom-class="add-goods-dialog"
                   :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <div style="margin-bottom: 10px;">
                <span style="width: 95px;margin-right: 10px;">商品名称: </span>
                <sl-input placeholder="请输入商品名称" :input-val.sync="addSearchGoods"
                          style="width: 250px;"></sl-input>
                <el-button type="primary" @click="getShopGoodsList" size="small">查询</el-button>
            </div>
            <div style="height: calc(100% - 30px);" v-loading="goodsDialogLoading">
                <sl-grid :gridCol="gridColNewGoods" :gridValue="gridValNewGoods" :gridConfig="gridCfgNewGoods"
                         @rowSelected="doSelectedNewGoods" @pageSizeChange="handleSizeChangeNewGoods"
                         @currentPageChange="handleCurrentChangeNewGoods">
                    <template slot="qty" scope="prop">
                        <el-input size="small" placeholder="请输入组合数量" 
                        v-input-validate.integer="{ model: prop.scope.row, key: 'qty', min: 1 }" 
                        v-model="prop.scope.row.qty"></el-input>
                    </template>
                </sl-grid>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small"
                           @click="addGoodsDialogVisible = false;saveGoods()">添加</el-button>
                <el-button type="primary" size="small" @click="saveGoods()">继续添加</el-button>
                <el-button @click="addGoodsDialogVisible = false" class="dialog-cancel"
                           size="small">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import doc from 'utils/doc';
    import {getFileNameSuffix} from 'utils/index';
    import {validateInputPrice,validateInputInt,validateMoney, validateSignlessInteger} from 'utils/validate';
    import isFloat from 'validator/lib/isFloat';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';
    import {getBomDetail, updateBomStatus, addBom, updateBom} from '@/api/operations/bom/bom';
    import {getORG} from '@/api/basic/group/group';
    import {getShopGoodsList} from '@/api/operations/shop/shop';
    import {getGoodsTip} from '@/api/operations/goods';
    import {uploadPic} from '@/api/common/picUpload';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import Levelbar from 'views/layout/Levelbar';
    import SlGrid from '@/components/sl-grid';
    import SlInput from '@/components/sl-input.vue';
    import ElRow from "element-ui/packages/row/src/row";
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    // 自定义"店铺名称"自动完成函数式组件
    Vue.component('shop-name-item', {
        functional: true,
        render: function (h, ctx) {
            var item = ctx.props.item;
            return h('li', ctx.data, [
                h('div', {attrs: {class: 'name'}}, [item.ename]),
                h('span', {attrs: {class: 'addr'}}, [item.address])
            ]);
        },
        props: {
            item: {type: Object, required: true}
        }
    });

    export default {
        name: 'bom-item',
        components: {
            ElRow,
            Levelbar,
            SlAutocomplete,
            SlGrid,
            SlInput
        },
        mixins: [RouterMixins, ViewPage, ViewBtnsPower],
        data() {
            var validateEName = (rule, value, callback) => {
                if (!value || this.shopAutoModel.shopList.filter((restaurant) => {
                        return restaurant.ename === value;
                    }).length <= 0) {
                    callback(new Error('请选择存在的店铺'));
                } else {
                    callback();
                }
            };
            var validatePrice = (rule, value, callback) => {
                const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入合法的组合价'));
                } else if(value > 1000000000000) {
                    callback(new Error('组合价不能超出 1,000,000,000,000'));
                }else {
                    callback();
                }
            };
            return {
                // 自定义面包屑列表
                levelList: ['运营应用', '组合商品管理', '组合商品详情'],
                // 上传图片功能
                uploadUrl: '',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                // 店铺名称自动完成
                shopAutoModel: {
                    shopList: [],
                    ename: '',
                },
                isInformationOpened: true,
                // 添加商品弹出框是否显示
                addGoodsDialogVisible: false,
                // 组合商品包含的商品表格配置信息
                gridCol: [
                    {field: 'goodsid', name: '商品编码', width: '100', align: 'center', fixed: true, template: 'goodsid'},
                    {field: 'goodsname', name: '商品名称', width: '200', align: 'left'},
                    {field: 'barcode', name: '条码', width: '150', align: 'center'},
                    {field: 'spec', name: '规格', width: '100', align: 'center'},
                    {field: 'uname', name: '销售单位', width: '120', align: 'center'},
                    {field: 'brandName', name: '品牌', width: '200', align: 'center'},
                    {field: 'catLName', name: '品类', minWidth: '200', align: 'center'},
                    {field: 'oldPrice', name: '原价', width: '100px', fixed: 'right'},
                    {field: 'price', name: '售价', width: '100px', fixed: 'right', template: 'price'},
                    {field: 'qty', name: '组合数量', width: '120px', fixed: 'right', template: 'qty'},
                    {
                        field: 'totalPrice',
                        name: '金额',
                        width: '120',
                        fixed: 'right',
                        template: 'totalPrice',
                        align: 'center'
                    },
                    {field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right', isSort: false}
                ],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: '', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer',
                    noPage: true
                },
                // 【添加商品】弹出框配置信息
                addGoodsDialogVisible: false,
                goodsDialogLoading: false,
                addSearchGoods: '',
                gridColNewGoods: [
                    {field: 'goodsid', name: '商品编码', width: '100px'},
                    {field: 'goodsname', name: '商品名称', width: '150px', align: 'left'},
                    {field: 'brandName', name: '品牌', width: '120px'},
                    {field: 'catLName', name: '所属品类', width: '200px'},
                    {field: 'qty', name: '组合数量', width: '150px', fixed: 'right', template: 'qty'}
                ],
                gridValNewGoods: {rows: [], footer: {}},
                gridCfgNewGoods: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: '232'
                },
                selectedGridDataNewGoods: [],
                // 页面表单模型
                bomItemForm: {
                    eid: -1,
                    ename: '',
                    goodsName: '',
                    oldPrice: 0,
                    price: 0
                },
                // 页面表单校验规则
                rules: {
                    ename: [
                        {required: true, message: '请输入店铺名称', trigger: 'change'},
                        {validator: validateEName, trigger: 'blur'}
                    ],
                    goodsName: [
                        {required: true, message: '请输入组合商品名称', trigger: 'change'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'change'}
                    ],
                    oldPrice: [],
                    price: [
                        {type: 'number', required: true, message: '组合价必须为有效数字值', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'}
                    ]
                },
            }
        },
        computed: {
            imageUrl() {// 组合商品图片地址
                return !this.bomItemForm.fileName ? '' : this.userInfo.fileServerAddr + this.bomItemForm.fileName;
            }
        },
        methods: {
            // 返回组合商品列表界面
            goToBom() {
                var that = this,
                    _goToBom = function () {
                        that.delCurView(that.$route.name);
                        that.$router.push({path: '/operations/bom'});
                    };
                if (this.pageType === 2 || this.pageType === 1) {
                    this.$confirm('确定放弃编辑,返回组合商品列表？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _goToBom();
                    }).catch(() => {

                    });
                } else {
                    _goToBom();
                }
            },
            // 获取组合商品详情
            getBomDetail(bomId) {
                this.loading = true;
                return getBomDetail(bomId).then((res) => {
                    console.log('[组合商品管理-详情界面]获取组合商品详情API: ', res);
                    this.loading = false;
                    let data = res.result;
                    if (res.retCode === 'SUCCESS') {
                        this.gridVal.rows = !data.goodsList ? [] : data.goodsList;
                        this.gridVal.rows.map((item) => {
                            item.MYOLDPRICE = item.price || 0;
                            item.MYOLDQTY = item.qty || 0;
                            return true;
                        });
                    } else {
                        this.$message(res.retMsg);
                    }
                    this.bomItemForm = Object.assign({}, this.bomItemForm, data);
                    // 初始化清除错误提示
                    this.$refs['bomItemForm'].resetFields();
                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                })
            },
            // 获取店铺列表
            getShopList() {
                let params = {
                    eid: this.userInfo.loginEid,
                    groupId: -1,
                    parentId: -1,
                    ename: '',
                    areaid: -1,
                    eids: [],
                    userId: this.userInfo.userId,
                    notIn: [],// 排除的机构
                    orgType: 1
                }
                return getORG(params).then((res) => {
                    console.log('[组合商品管理-详情界面]获取店铺信息: ', res);
                    this.shopAutoModel.shopList = res.list;
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 获取店铺商品数据
            getShopGoodsList() {
                var gridValRowsIds = [];
                this.gridVal.rows.forEach(function (item) {
                    gridValRowsIds.push(item.goodsid)
                });
                let params = {
                        shopEid: this.bomItemForm.eid,
                        goodsName: this.addSearchGoods,
                        brandId: -1,
                        catId: -1,
                        status: 1,
                        goodsId: -1,
                        notingoodsid: gridValRowsIds.join()
                    },
                    page = {
                        pageNum: this.gridValNewGoods.footer.pageNum || 1,
                        pageSize: this.gridValNewGoods.footer.pageSize || 25,
                        totalRecord: 0,
                        totalPage: 0,
                    };
                this.goodsDialogLoading = true;
                return getShopGoodsList(page, params).then((res) => {
                    console.log('[组合商品管理-详情界面]选择商品信息: ', res);
                    this.goodsDialogLoading = false;
                    if (res.retCode === 'SUCCESS') {
                        this.gridValNewGoods.rows = res.result;
                        this.gridValNewGoods.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.goodsDialogLoading = false;
                })
            },
            // 【店铺名称自动完成】功能
            queryShopAutoComplete(queryString, cb) {
                var restaurants = this.shopAutoModel.shopList;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.ename.indexOf(queryString.toLowerCase()) > -1 );
                };
            },
            handleSelectShopAutoComplete(item) {
                console.log('[组合商品管理-详情界面]选择店铺信息: ', item);
                let STATUS = item.shopStatus === 0 ? "未开业" : item.shopStatus === 1 ? "营业中" : item.shopStatus === 2 ? "休息中" : "已停业";
                // 清空原店铺商品数据
                this.gridVal.rows = [];
                // 更新模型商品数据
                this.bomItemForm = Object.assign({}, this.bomItemForm, {
                    eid: item.eid,
                    ename: item.ename,
                    goodsList: []
                });
            },
            handleIconClickShopAutoComplete() {
                this.$refs.shopName.handleFocus();
            },
            // 【添加商品】弹出选择框
            addGoods(){
                this.$refs['bomItemForm'].validateField('ename', (errorMessage) => {
                    if (!!errorMessage || !this.bomItemForm.ename) {
                        this.$message({
                            message: `请选择存在的店铺`,
                            type: 'error'
                        });
                        return;
                    } else {
                        this.addGoodsDialogVisible = true;
                        this.addSearchGoods = '';
                        this.getShopGoodsList();
                    }
                })
            },
            // 【添加商品】表格选中
            doSelectedNewGoods (data) {
                this.selectedGridDataNewGoods = data;
            },
            // 【添加商品】表格pageSize改变
            handleSizeChangeNewGoods (size) {
                this.gridValNewGoods.footer.pageSize = size;
                this.getShopGoodsList();
            },
            // 【添加商品】页码改变
            handleCurrentChangeNewGoods (page) {
                this.gridValNewGoods.footer.pageNum = page;
                this.getShopGoodsList();
            },
            priceInputChange(row){
                setTimeout(()=> {
                    this.bomItemForm.price = validateInputPrice(this.bomItemForm.price);
                }, 950);
            },     
            // 【添加商品】前台保存
            saveGoods() {
                // 1. 校验数据
                if (!this.selectedGridDataNewGoods.length) {
                    this.$message({
                        message: `请选择商品`,
                        type: 'error'
                    });
                    this.addGoodsDialogVisible = true;
                    return;
                };
                var flag = true;
                for(let i=0,len=this.selectedGridDataNewGoods.length; i < len; i++){
                    if(!validateSignlessInteger(this.selectedGridDataNewGoods[i].qty + '')){
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    this.$message.error('请输入合法的组合数量！');
                    this.addGoodsDialogVisible = true;
                    return false;
                };
                // 2. 前台保存
                this.gridVal.rows = this.gridVal.rows.concat(this.selectedGridDataNewGoods);
                this.gridVal.rows.map((item) => {
                    item.MYOLDPRICE = item.price || 0;
                    item.MYOLDQTY = item.qty || 0;
                    return true;
                });
                this.bomItemForm.goodsList = [];
                this.bomItemForm.goodsList = this.gridVal.rows;
                this.getShopGoodsList();
            },
            // 【禁用、启用】按钮
            updateBomStatus(event, bomInfo, type) {
                let _this = this,
                    _updateBomStatus = function (bomId, status) {
                        _this.loading = true;
                        return updateBomStatus(bomId + '', status).then((res) => {
                            console.log('[组合商品管理-详情界面]启用禁用操作: ', res);
                            _this.$message({
                                message: type === 0 ? `禁用成功` : `启用成功`,
                                type: 'success'
                            });
                            _this.loading = false;
                        }).catch((err) => {
                            console.log(err);
                            _this.loading = false;
                        })
                    }
                if (type === 0) {
                    this.$confirm('是否禁用组合商品?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        _updateBomStatus(bomInfo.bomId, type)
                    }).catch((err) => {
                        console.log(err);
                    });
                } else if (type === 1) {
                    this.$confirm('是否启用组合商品?', '提示', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(() => {
                        _updateBomStatus(bomInfo.bomId, type)
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            // 【编辑】按钮
            editBom() {
                this.changePageType(2, '组合商品管理(编辑)');
            },
            // 新增【保存】按钮
            addBom() {
                let bomInfo = Object.assign({}, this.bomItemForm);
                console.log('[组合商品管理-详情界面]新增保存组合商品信息: ', bomInfo);
                // 1. 校验数据
                if(!Array.isArray(bomInfo.goodsList) || bomInfo.goodsList.length <= 0){
                    this.$message.error('商品不能为空！');
                    return;
                }
                var flag = true;
                for(let i=0,len=bomInfo.goodsList.length; i < len; i++){
                    if(!validateMoney(bomInfo.goodsList[i].price + '')){
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    this.$message.error('请输入合法的售价！');
                    return false;
                };
                for(let i=0,len=bomInfo.goodsList.length; i < len; i++){
                    if(!validateSignlessInteger(bomInfo.goodsList[i].qty + '')){
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    this.$message.error('请输入合法的组合数量！');
                    return false;
                };
                let sumPrice = 0;
                Array.isArray(bomInfo.goodsList) && bomInfo.goodsList.forEach((item, index) => {
                    let currPrice = item.qty * item.price,
                        currValue = Number(currPrice);
                    if (!isNaN(currValue)) {
                        return sumPrice += currValue;
                    } else {
                        return sumPrice;
                    }
                });
                if(sumPrice.toFixed(2) !== Number(bomInfo.price).toFixed(2)){
                    this.$message({
                        message: `组合价不等于售价*组合数量之和！`,
                        type: 'error'
                    });
                    return;
                };
                // 2. 执行保存
                this.loading = true;
                this.$refs['bomItemForm'].validate((valid) => {
                    if (valid) {
                        return addBom(bomInfo).then((res) => {
                            this.$message({
                                message: `新增保存成功`,
                                type: 'success'
                            });
                            if (!res.result) {
                                this.$message({
                                    message: `数据错误，请联系管理员`,
                                    type: 'error'
                                });
                                this.loading = false;
                                return;
                            }
                            this.loading = false;
                            this.bomItemForm.bomId = res.result;
                            this.changePageType(3, '组合商品管理(详情)');
                        }).catch((err) => {
                            console.log(err);
                            this.loading = false;
                        })
                    } else {
                        this.$message({
                            message: `组合商品录入的信息不完整，请检查必填项`,
                            type: 'error'
                        });
                        this.loading = false;
                        return false;
                    }
                });
            },
            // 编辑【保存】按钮
            updateBom() {
                let bomInfo = Object.assign({}, this.bomItemForm);
                console.log('[组合商品管理-详情界面]编辑保存组合商品信息: ', this.bomItemForm);
                // 1. 校验数据
                if(!Array.isArray(bomInfo.goodsList) || bomInfo.goodsList.length <= 0){
                    this.$message.error('商品不能为空！');
                    return;
                }
                var flag = true;
                for(let i=0,len=bomInfo.goodsList.length; i < len; i++){
                    if(!validateMoney(bomInfo.goodsList[i].price + '')){
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    this.$message.error('请输入合法的售价！');
                    return false;
                };
                for(let i=0,len=bomInfo.goodsList.length; i < len; i++){
                    if(!validateSignlessInteger(bomInfo.goodsList[i].qty + '')){
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    this.$message.error('请输入合法的组合数量！');
                    return false;
                };
                let sumPrice = 0;
                Array.isArray(bomInfo.goodsList) && bomInfo.goodsList.forEach((item, index) => {
                    let currPrice = item.qty * item.price,
                        currValue = Number(currPrice);
                    if (!isNaN(currValue)) {
                        return sumPrice += currValue;
                    } else {
                        return sumPrice;
                    }
                });
                if(sumPrice.toFixed(2) !== Number(bomInfo.price).toFixed(2)){
                    this.$message({
                        message: `组合价不等于售价*组合数量之和！`,
                        type: 'error'
                    });
                    return;
                };
                // 2. 执行保存
                this.loading = true;
                this.$refs['bomItemForm'].validate((valid) => {
                    if (valid) {
                        return updateBom(bomInfo).then((res) => {
                            this.$message({
                                message: `编辑保存成功`,
                                type: 'success'
                            });
                            this.changePageType(3, '组合商品管理(详情)');
                            this.loading = false;
                        }).catch((err) => {
                            console.log(err);
                            this.loading = false;
                        })
                    } else {
                        this.$message({
                            message: `组合商品录入的信息不完整，请检查必填项`,
                            type: 'error'
                        });
                        this.loading = false;
                        return false;
                    }
                });
            },
            // 【取消】按钮
            doCancel() {
                this.$confirm('确定放弃编辑？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.changePageType(3, '组合商品管理(详情)');
                    this.init();
                })
            },
            // 组合商品包含商品表格【移除】按钮
            removeBomGoodsItem(goodsInfo) {
                this.gridVal.rows = this.gridVal.rows.filter((item) => {
                    return item.goodsid != goodsInfo.goodsid;
                })
                this.bomItemForm.goodsList = this.gridVal.rows;
            },
            // 上传图片文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
            beforeUpload(file) {
                const isLt500K = file.size / 1024 <= 500;
                if (!isLt500K) {
                    this.$message.error('上传图片大小不能超过 500KB!');
                }
                return isLt500K;
            },
            // 自定义图片上传
            myHttpRequest(fileObj){
                console.log('[组合商品管理-组合商品详情]图片文件信息=>', fileObj);
                let _this = this;
                var file = fileObj.file;
                // 生成图片名称
                var filename = this.userInfo.loginEid + '_' + this.userInfo.userId + '_' + new Date().getTime() + '.' + getFileNameSuffix(file.name);
                // 生成base64 data url
                var filedata = '',
                    fr = new FileReader();
                fr.readAsDataURL(file);
                this.loading = true;
                fr.onload = function (e) {
                    filedata = e.target.result.replace(/^data\:image\/(\w+);base64,/g, "");
                    // 调用上传图片API
                    return uploadPic({filedata, filename}).then((res) => {
                        console.log('[组合商品管理-组合商品详情]上传成功返回信息=>', res);
                        _this.bomItemForm.fileName = res.result;
                        _this.loading = false;
                    }).catch((err) => {
                        console.log(err);
                        _this.loading = false;
                    })
                }
            },
            // 单元格编辑信息
            handleCellChangeClick(){
                let el = event.target.parentNode.parentNode.parentNode.parentNode;
                doc.removeClass(el, 'cell-edit')
            },
            // 当单元格 hover 进入时会触发该事件
            cellMouseEnter(row, column, cell, event) {
                doc.addClass(cell, 'cell-mouse-enter')
            },
            // 当单元格 hover 退出时会触发该事件
            cellMouseLeave(row, column, cell, event) {
                doc.removeClass(cell, 'cell-mouse-enter');
            },
            // 点击单元格编辑图标
            editCell(){
                let tdCellEl = event.target.parentNode.parentNode,
                    tdEl = tdCellEl.parentNode,
                    inputEl = tdCellEl.getElementsByTagName("input")[0];
                doc.addClass(tdEl, 'cell-edit');
                inputEl.focus();
            },
            // 单元格输入框被选中
            handleFocusCell() {
                event.currentTarget.select();
            },
            // 组件初始化
            init() {
                this.pageType = +this.$route.query.pageType;
                let title = this.pageType === 1 ? '组合商品管理(新增)' : this.pageType === 2 ? '组合商品管理(编辑)' : '组合商品管理(详情)';
                this.changePageType(this.pageType, title);
                let lastIndex = this.gridCol.length - 1;
                this.hideOpCol(this.pageType, this.gridCol, lastIndex);
                // 新增、编辑、浏览三种页面初始化
                let bomId = +this.$route.query.bomId;
                this.getBomDetail(bomId);
            }
        },
        activated: function () {
            this.init();
            this.getShopList();
        },
        watch: {
            // 用途：汇总原价
            'gridVal.rows': {
                handler: function (val, oldVal) {
                    console.log('[组合商品管理-详情界面]监测组合数量的变化的商品列表: ', val);
                    let sumOldPrice = 0;
                    val.forEach((item, index) => {
                        let currPrice = item.qty * item.oldPrice,
                            currValue = Number(currPrice);
                        if (!isNaN(currValue)) {
                            return sumOldPrice += currValue;
                        } else {
                            return sumOldPrice;
                        }
                    });
                    !isNaN(sumOldPrice) ? this.bomItemForm.oldPrice = sumOldPrice.toFixed(2) : this.bomItemForm.oldPrice = 0;
                },
                deep: true
            },
            // 用途：是否隐藏操作列
            'pageType': function (val, oldVal) {
                let lastIndex = this.gridCol.length - 1;
                if(!this.myModulePower.edit){
                    this.hideOpCol(3, this.gridCol, lastIndex);
                }else{
                    this.hideOpCol(val, this.gridCol, lastIndex);
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .bom-item {

        // 不同视图状态下的样式
        &.view {
            .el-form-item {
                margin-bottom: 5px;
                .el-form-item__content {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        // 页面操作按钮区域
        .sl-operator-panel {
            .sl-operator-left {
                left: 305px !important;
            }
            .sl-operator-right {

            }
        }
        // 组合商品基本信息的布局样式
        .bom-goods-info {
            .el-form {
                .el-form-item__label,
                .el-form-item__content {
                    font-size: 12px;
                    padding-right: 0px;
                }
                .form-shop-name,
                .form-goods-name,
                .form-old-price {
                    .el-form-item__content {
                        width: calc(100% - 95px);
                    }
                }
                .form-shop-name {
                    display: block;
                    width: 90%;
                }
                .form-goods-name {
                    width: 90%;
                    margin-right: 0px;
                }
                .form-old-price {
                    width: 45%;
                    margin-left: -4px;
                    margin-bottom: 12px;
                    .el-form-item__content {
                        padding-left: 5px;
                    }
                }
                .form-last-price {
                    width: 45%;
                    margin-left: -4px;
                    margin-bottom: 12px;
                    .el-form-item__content {
                        width: calc(100% - 100px);
                    }
                }
                .form-price {
                    .el-form-item__label {
                        width: 60px !important;
                    }
                    .el-input__inner {
                        width: 130px;
                    }
                }
            }
            .img-uploader {
                float: left;
                margin-right: 20px;
                .el-upload {
                    &:hover {
                        border-color: #20a0ff;
                    }
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    .img {
                        width: 130px;
                        height: 130px;
                        display: block;
                    }
                    .img-uploader-icon {
                        font-size: 28px;
                        color: #8c939d;
                        width: 130px;
                        height: 130px;
                        line-height: 130px;
                        text-align: center;
                    }
                }
            }
        }
        // 【添加商品】弹出框
        .add-goods-dialog {
            width: 850px;
        }
        // 单元格编辑功能样式
        .edit {
            display: none;
        }
        .view {
            &.label .el-icon-edit, &.edit {
                display: none !important;
            }
            &.label {
                display: inline-block !important;
            }
        }
        .cell-mouse-enter {
            .label .el-icon-edit {
                display: inline-block;
                color: #28e;
                cursor: pointer;
            }
        }
        .cell-edit {
            .label {
                display: none;
            }
            .edit {
                display: inline-block;
            }
            .el-icon-check:hover {
                color: #28e;
                cursor: pointer;
            }
        }
    }

    .shop-name-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>