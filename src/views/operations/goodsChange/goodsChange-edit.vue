<template>
    <div class="sl-page-container flex-col goodsChangeEdit" v-loading="load1">
        <div class="slic-head-panel">
            <span style="width: 280px;display: inline-block;">
                <levelbar :levelList="['运营应用', this.$route.query.opType === 'add' ? '新增变更单' : '变更单编辑']">
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
                <el-button-group style="margin-right: 15px;">
                    <el-button type="primary" size="small" @click="addGoods($event)" v-if="gcInfo.status == 0">新建商品</el-button>
                    <el-button type="primary" size="small" @click="changeGoods($event)" v-if="gcInfo.status == 0">商品变更</el-button>
                    <el-button type="primary" size="small" @click="forbidGoods($event)" v-if="gcInfo.status == 0">禁用商品</el-button>
                    <el-button type="primary" size="small" @click="enableGoods($event)" v-if="gcInfo.status == 0">启用商品</el-button>
                </el-button-group><el-button-group>
                    <!--<el-button type="primary" size="small" @click="doSubmit($event)" v-if="gcInfo.status == 0 && opType !== 'add'">编辑完成</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doCheck($event)" v-if="gcInfo.status == 1">审核</el-button>-->
                    <el-button type="primary" size="small" @click="doDelete($event)" v-if="gcInfo.status == 0 && myModulePower.delete && opType !== 'add'">删除</el-button>
                    <el-button type="primary" size="small" @click="doSave(false)" v-if="gcInfo.status == 0">保存</el-button>
                    <el-button type="primary" size="small" @click="doCancel($event)" v-if="gcInfo.status == 0">取消</el-button>
                </el-button-group>
            </div>
            <div class="sl-search-panel" style="padding-bottom: 10px;">
                <el-row :gutter="20" style="margin-bottom: 10px;">
                    <el-col :span="8">
                        <span>变更单号：</span>
                        <span  :title="gcInfo.sheetid">{{gcInfo.sheetid}}</span>
                        <!--<span>123456798</span>-->
                    </el-col>

                    <!--<el-col :span="4">
                        <span>申请人：</span>
                        <span :title="gcInfo.editor">{{gcInfo.editor}}</span>
                    </el-col>

                    <el-col :span="6">
                        <span>申请时间：</span>
                        <span :title="gcInfo.editdateStr">{{gcInfo.editdateStr}}</span>
                    </el-col>-->

                    <el-col :span="8">
                        <span>申请机构：</span>
                        <span :title="gcInfo.ename">{{gcInfo.ename}}</span>
                    </el-col>

                    <el-col :span="8">
                        <span>状态：</span>
                        <span class="ostatus" v-if="gcInfo.status == 0">编辑中</span>
                        <span class="ostatus" v-if="gcInfo.status == 1">编辑完成</span>
                        <span class="ostatus" v-if="gcInfo.status == 2">已审核</span>
                        <span class="ostatus" v-if="gcInfo.status == 3">已否决</span>
                    </el-col>
                </el-row>

                <el-row >
                    <el-col :span="2" style="line-height: 30px;width: 60px;">备注：</el-col>
                    <el-col :span="22">
                        <el-input size="small" v-model="gcInfo.notes" :maxlength="32"></el-input>
                    </el-col>
                </el-row>

            </div>
        </div>

        <div class="slic-content">
            <div class="slic-content-info">
                <!--<div style="text-align: right;margin: 10px 0;">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="addGoods($event)" v-if="gcInfo.status == 0">新建商品</el-button>
                        <el-button type="primary" size="small" @click="changeGoods($event)" v-if="gcInfo.status == 0">商品变更</el-button>
                        <el-button type="primary" size="small" @click="forbidGoods($event)" v-if="gcInfo.status == 0">禁用商品</el-button>
                        <el-button type="primary" size="small" @click="enableGoods($event)" v-if="gcInfo.status == 0">启用商品</el-button>
                    </el-button-group>
                </div>-->
                <div style="flex: 1;height: 100%;">

                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg">
                        <template slot="operate" scope="prop">
                            <el-button @click="toGoodsDetail(prop.scope)" type="text" size="small" v-if="prop.scope.row.modifytype === 1 || prop.scope.row.modifytype === 2">详情</el-button>
                            <el-button type="text" size="small" @click="deleteGoods(prop.scope)">删除</el-button>
                        </template>

                        <template slot="cat" scope="prop">
                            {{prop.scope.row.catlname || prop.scope.row.catName}}
                        </template>

                        <template slot="brandname" scope="prop">
                            {{prop.scope.row.brandname || prop.scope.row.brandName}}
                        </template>

                        <template slot="spec" scope="prop">
                            {{prop.scope.row.spec ? (prop.scope.row.spec2 ? (prop.scope.row.spec + ', ' + prop.scope.row.spec2) : prop.scope.row.spec) : '' }}
                        </template>

                        <template slot="status" scope="prop">
                            <span v-if="prop.scope.row.modifytype === 1">新增</span>
                            <span v-if="prop.scope.row.modifytype === 2">修改</span>
                            <span v-if="prop.scope.row.modifytype === 3">禁用</span>
                            <span v-if="prop.scope.row.modifytype === 4">启用</span>
                        </template>
                    </sl-grid>
                </div>
            </div>
        </div>

        <div class="sl-search-panel" style="padding: 10px;margin: 0 0 10px 0;">
            <el-row :gutter="20" >
                <el-col :span="4">
                    <span>申请人：</span>
                    <span  :title="gcInfo.editor">{{gcInfo.editor}}</span>
                </el-col>

                <el-col :span="6">
                    <span>申请时间：</span>
                    <span  :title="gcInfo.editdateStr">{{gcInfo.editdateStr}}</span>
                </el-col>

                <el-col :span="6">
                    <span>审核人：</span>
                    <span  :title="gcInfo.editdateStr">{{gcInfo.checker}}</span>
                </el-col>

                <el-col :span="6">
                    <span>审核时间：</span>
                    <span  :title="gcInfo.editdateStr">{{gcInfo.checkdateStr}}</span>
                </el-col>


            </el-row>

        </div>

        <el-dialog title="商品选择" :visible.sync="showChange" :close-on-click-modal="false" size="tiny" class="el-dialog-goods">
            	<el-row :gutter="15"  class="sl-form-row mt">
                    <el-col :span="24">
                    	<span class="autoParams-label " style="width: 70px;">商品：</span>
			            <sl-autocomplete :autoParams="autoParams" class="autoParams-input"
			            				 placeholder="请输入商品"
			                             :dataList="goodsList"
			                             slWidth="750"
			                             colWidths="20,30,20,30"
			                             displayProp="goodsname"
                                         :clearInput="clearInput"
			                             @querykey="autoQuery"
			                             @doAutoSelected="handleAutoSelect"
			                             selectedMode="SINGLE">
			                <template slot="icon-more">
			                    <i class="el-icon-more" @click.stop="moreGoods()"></i>
			                </template>
			            </sl-autocomplete>
					</el-col>
                </el-row>

            <div class="sl-form">
                <el-row :gutter="15"  class="sl-form-row mt-xsmall">
                    <el-col :span="24">
                    <span>
                        <span class="sl-form-label">条码：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.barcode" readonly class="noedit" ></el-input>
                        </span>

                    </span>
                    </el-col>
                </el-row>
                
                <el-row :gutter="15"  class="sl-form-row mt">
                    <el-col :span="24">
                    <span>
                        <span class="sl-form-label">内码：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.mygoodsid" readonly class="noedit" ></el-input>
                        </span>
                    </span>
                    </el-col>
                </el-row>

                <el-row :gutter="15" class="sl-form-row mt">
                    <el-col :span="24">
                    <span>
                        <span class="sl-form-label">规格：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.spec" readonly class="noedit" ></el-input>
                        </span>
                    </span>
                    </el-col>
                </el-row>
                
                <el-row :gutter="15" class="sl-form-row mt">
                    <el-col :span="24">
                    <span>
                        <span class="sl-form-label">包装单位：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.uname" readonly class="noedit" ></el-input>
                        </span>
                    </span>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSure()" size="small">确定</el-button>
                <el-button @click="showChange = false" class="dialog-cancel" size="small">取消</el-button>
            </span>
        </el-dialog>

        <goods-select @doSelectGoods="selectedGoodsDialog" :show-goods.sync="showGoods" selModel="MULT" :goods-status="selOpType =='reUse'?0:1"></goods-select>

        <!--<goods-select @doSelectGoods="selectedGoodsDialog" :showGoods="showGoods" selModel="MULT"></goods-select>-->



        <el-dialog title="审核" :visible.sync="showCheck">
            <p>
                您正在审核商品变更单【{{gcInfo.sheetid}}】，您可以审核也可以否决，审核后商品信息将会变更！
            </p>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="operateGoodsChange('approve')" size="small">审核通过</el-button>
                <el-button type="primary" @click="operateGoodsChange('veto')" size="small">否决</el-button>
                <el-button @click="showCheck = false" class="dialog-cancel" size="small">取 消</el-button>
            </span>
        </el-dialog>

        <!--<el-dialog title="提交" :visible.sync="showSubmit">
            <p>
                您正在提交商品变更单【{{gcInfo.sheetid}}】，如果有修改，请先保存，提交之后不能再修改！
            </p>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitGoodsChange('nosave')" size="small">直接提交</el-button>
                <el-button type="primary" @click="submitGoodsChange('save')" size="small">保存并提交</el-button>
                <el-button @click="showSubmit = false" class="dialog-cancel" size="small">取 消</el-button>
            </span>
        </el-dialog>-->

        <!--保存成功后弹窗-->
        <el-dialog title="保存成功提示" :visible.sync="showOperate" size="tiny">
            <p class="mb mt">
                保存单据【{{gcInfo.sheetid}}】成功，您可以继续执行以下操作：
            </p>

            <el-row :gutter="20" v-if="gcInfo.status === 0" class="mb">
                <el-col :span="6" >
                    <el-button type="primary" @click="doOprSubmit()" size="small">编辑完成</el-button>
                </el-col>

                <el-col :span="18">
                    "编辑完成"  后，可以进行审核
                </el-col>
            </el-row>

            <el-row :gutter="20" v-if="myModulePower.check" class="mb">
                <el-col :span="6">
                    <el-button type="primary" @click="doOprCheck()" size="small">审核</el-button>
                </el-col>

                <el-col :span="18">
                    "审核"  后，不可以再修改
                </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <!--<el-button type="primary" @click="operatePriceChange('approve')" size="small">审核通过</el-button>-->
                <!--<el-button type="primary" @click="operatePriceChange('veto')" size="small">否决</el-button>-->
                <!--<el-button @click="operateDiaSure()" class="dialog-cancel" size="small">确定</el-button>-->
                <el-button type="primary" @click="operateDiaSure()" size="small">确定</el-button>
            </span>
        </el-dialog>






    </div>


</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import GoodsSelect from '../common/goodsSelect.vue';
    import {mapGetters} from 'vuex';
    import ViewPage from '@/mixins/viewPage';
    import {operateGoods, getGoodsTip} from '@/api/operations/goods';
    import {getChangeGoodsList, changeGoodsChange, deleteGoodsChange, checkGoodsChange, submitGoodsChange, addGoodsChange} from '@/api/operations/goodsChange';

    export default {
        components: {Levelbar, SlGrid, SlAutocomplete, GoodsSelect},
        name: 'goodsChangeEdit',
        mixins: [ViewPage],
        data () {
            return {
                load1: false,
                load2: false,
//                myModulePower: {},
                clearInput: false,
                gridCol: [],
                gridVal: {rows: []},
                gridCfg: {
                    selectMode: 'none', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    noPage: true
                },
                opType: '',
                userRole: '',
                queryKey: '',
                searchStatus: '',
                mydata: '',
                showChange: false,
                goodsChangeCode: '123456789',
                selOpType: '',
                showGoods: false,
                showCheck: false,
                showSubmit: false,
                changGoods: {},
                gcInfo: {status: 0},
                selectedGridData: [],
                goodsList: [],
                autoParams: {
                    mygoodsid: '商品内码',
                    goodsname: '商品名称',
                    barcode: '条码',
                    ostatus: '状态'
                },
                showOperate: false,

            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mounted: function () {
             console.log('this.$route.query 222222222 === >', this.$route.query);
            this.$nextTick(function () {
                this.gridCol = [
                    {field: 'mygoodsid', name: '商品内码', width: '100', fixed: true},
                    {field: 'goodsname', name: '商品名称', width: '150'},
                    {field: 'barcode', name: '条码', width: '150px'},
                    {field: 'spec', name: '销售规格', width: '100', template: 'spec'},
                    {field: 'uname', name: '包装单位', width: '100'},
                    {field: 'catlname', name: '所属品类', width: '200', template: 'cat'},
                    {field: 'brandname', name: '品牌', minWidth:'200', template: 'brandname'},
                    {field: 'cost', name: '默认进价', width: '100'},
                    {field: 'bulkprice', name: '建议售价', width: '100',align:"right"},
                    {field: 'modifytype', name: '变更状态', width: '100', template: 'status'},
                    {field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right',align:"left"}
                ]

                this.myModulePower = this.$parent.myModulePower;

                console.log('this.myModulePower==', this.myModulePower);

                this.gcInfo = this.$parent.gcInfo;

                this.opType = this.$route.query.opType;

                if(this.opType === 'add') {
                    this.changePageType(1, '新增变更单');
                } else if(this.opType === 'edit') {
                    this.changePageType(2, '变更单编辑');
                }


                this.gridVal.rows = this.$parent.editDataList;
                console.log('this.gridVal.rows==', this.gridVal.rows, this.opType);

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
            // 获取变更单商品列表
            getGoodsChange() {
                console.log(this.gcInfo);
                getChangeGoodsList(this.$route.query.sheetId).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.$parent.editDataList = res.result;
                    } else {
                        this.$message.error(res.retMsg);
                    }
                }).catch(err => {
//                    this.$message(res.retMsg);
                })
            },
            // 提交
            doSubmit() {
//                this.showSubmit = true;
                submitGoodsChange(this.gcInfo.sheetid).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message.success(res.retMsg);
                        this.gcInfo.status = 1;
                    } else {
                        this.$message.error(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                        this.$message(res.retMsg);
                })
            },
            // 审核
            doCheck() {
                this.showCheck = true;

            },
            // 审核弹窗选择
            operateGoodsChange(str) {
                this.load1 = true;
                let opType = 0;
                if(str === 'approve') {
                    opType = 2;
                } else if(str === 'veto') {
                    opType = 3;
                }

                checkGoodsChange(this.gcInfo.sheetid, opType).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        this.getGoodsChange();
                        this.gcInfo.status = opType;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                    this.$message(res.retMsg);
                })

                this.showCheck = false;
            },
            // 删除
            doDelete() {

                this.$confirm('确认删除该变更单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.load1 = true;
                    deleteGoodsChange(this.gcInfo.sheetid).then(res => {
                        this.load1 = false;
                        if(res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            this.$router.push({path: '/operations/goodsChange'});
                            this.$store.dispatch('delVisitedViews', this.$route.name);
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load1 = false;
//                        this.$message(res.retMsg);
                    })
                }).catch()

            },
            // 保存
            doSave(isSubmit) {

                let param = {
                    editdateStr: this.gcInfo.editdateStr,
                    editor: this.gcInfo.editor,
                    checkdateStr: '',
                    checker: '',
                    status: 0,
                    sheetid: this.gcInfo.sheetid || -1,
                    notes: this.gcInfo.notes,
                    eid: this.userInfo.loginEid,
                    addnum: 0,
                    updatenum: 0,
                    coEid: '',
                    eLName: this.gcInfo.ename,
                    ename: this.gcInfo.ename
                }

                if(this.gridVal.rows.length === 0) {
                    this.$message('请对商品进行操作！');
                } else {
                    this.gridVal.rows.forEach((item, i) => {
                        if(item.modifytype === 1) {
                            param.addnum++;
                        } else {
                            param.updatenum++;
                        }
                    })

                    let gridList = JSON.parse(JSON.stringify(this.gridVal.rows));

                    gridList.forEach((item, i) => {
                        if(item.modifytype === 2) {
                            for(let opt in item) {
                                if(opt.indexOf('new') !== -1) {
                                    if(item[opt] === item[opt.split('new')[1]]) {
                                        item[opt] = null;
                                    }
                                }
                            }

                            item.newnotes = item.notes;
                        }
                    })



                    param.list = gridList;
                    console.log(param);
                    this.load1 = true;
                    if(this.$route.query.opType === 'add') {
                        addGoodsChange(param).then(res => {
                            console.info(res,'============== add res')
                            this.load1 = false;
                            if(res.retCode === 'SUCCESS') {
//                            this.$message('保存成功！');
                                this.gcInfo = param;
                                this.gcInfo.sheetid = res.result;
                                this.showOperate = true;

                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.load1 = false;
//                        this.$message(res.retMsg);
                        })
                    } else if(this.$route.query.opType === 'edit') {
                        changeGoodsChange(param).then(res => {
                            if(res.retCode === 'SUCCESS') {
                                this.load1 = false;
//                            this.$message('保存成功！');
                                this.gcInfo = param;
                                this.showOperate = true;
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.load1 = false;
//                        this.$message(res.retMsg);
                        })
                    }
                }




            },

            // 新建商品
            addGoods() {
                this.$parent.opType = 0;
                this.$parent.currentView = 'NewChangeEdit';
                this.$parent.fromView = 'GoodsChangeEdit';
            },
            // 变更商品
            changeGoods() {
                this.changGoods = {};
                this.showChange = true;
                this.selOpType = 'change';
                this.$parent.fromView = 'GoodsChangeEdit';
                setTimeout(() => {
                    this.clearInput = true;
                },50)
            },
            // 禁用商品
            forbidGoods() {
                console.log(this.selectedGridData);
                this.changGoods = {};
                this.showChange = true;
                this.selOpType = 'forbid';
                setTimeout(() => {
                    this.clearInput = true;
                },50)
            },
            // 启用商品
            enableGoods() {
                console.log(this.selectedGridData);
                this.changGoods = {};
                this.showChange = true;
                this.selOpType = 'reUse';
                setTimeout(() => {
                    this.clearInput = true;
                },50)
            },
            // 跳转到商品详情
            toGoodsDetail(obj) {

                if(obj.row.modifytype === 1) {
                    this.$parent.addNewGoods = obj.row;
                    this.$parent.fromView = 'GoodsChangeEdit';
                    this.$parent.currentGoodsIndex = obj.$index;
                    this.$parent.currentView = 'NewChangeDetail';

                } else if(obj.row.modifytype === 2) {
                    this.$parent.changeGoods = obj.row;
                    this.$parent.fromView = 'GoodsChangeEdit';
                    this.$parent.currentGoodsIndex = obj.$index;
                    this.$parent.currentView = 'OldChangeDetail';
                }

            },
            // 删除商品
            deleteGoods(obj) {
                this.$confirm('确认删除该商品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.gridVal.rows.splice(obj.$index, 1);
                }).catch()
            },
            // 自动补全搜索
            autoQuery(key) {
                console.log(key, this.autoParams)
                getGoodsTip(key).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        let goodsList = res.result;
                        let showlist = [];
                        if(this.selOpType === 'change') {
                            goodsList.forEach((item, i) => {
                                item.ostatus = item.status == 1 ? '启用' : '禁用';
                                showlist.push(item);
                            })
                        } else if(this.selOpType === 'forbid') {
                            goodsList.forEach((item, i) => {
                                if(item.status == 1) {
                                    this.$set(item,'ostatus','启用');
                                    showlist.push(item);
                                }
                            })
                        } else if(this.selOpType === 'reUse') {
                            goodsList.forEach((item, i) => {
                                if(item.status == 0) {
                                    this.$set(item,'ostatus','禁用');
                                    showlist.push(item);
                                }
                            })
                        }
                        this.goodsList = showlist;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 自动补全选中
            handleAutoSelect(sel) {
                console.log(sel);
                if(sel) {
                    this.changGoods = sel;
                    this.clearInput = false;
                    this.changGoods.spec = this.changGoods.spec2 ? JSON.parse(JSON.stringify(this.changGoods.spec + ', ' + this.changGoods.spec2)) : this.changGoods.spec;
                }

            },
            // 更多商品弹窗
            moreGoods() {
                this.showGoods = true;
                this.showChange = false;
            },
            // 商品表格选择弹窗确认
            selectedGoodsDialog(obj) {
                const _this = this;

                if(!obj) {
                    this.showChange = false;
                    this.showGoods = false;
                } else if(obj.length > 0) {
                    if(this.selOpType === 'change') {
                        obj[0].modifytype = 2;

                        this.$parent.opType = 0;
                        this.$parent.changeGoods = obj[0];
                        this.$parent.currentView = 'OldChangeEdit';

                    } else if(this.selOpType === 'forbid') {
                        obj.forEach((item, i) => {
                            item.modifytype = 3;

                            this.$parent.editDataList.push(item);
                        })

                    } else if(this.selOpType === 'reUse') {
                        obj.forEach((item, i) => {
                            item.modifytype = 4;
                            this.$parent.editDataList.push(item);
                        })
                    }

                    this.showChange = false;
                    this.showGoods = false;
                } else {
                    this.showChange = false;
                    this.showGoods = false;
                }

            },
            // 变更商品弹窗确认按钮
            doSure() {

                let obj = this.changGoods;

                if(!obj.goodsid) {this.$message('请选择商品！');}
                else {
                    if(this.selOpType === 'change') {
                        obj.modifytype = 2;
                        this.$parent.opType = 0;
                        this.$parent.changeGoods = obj;
                        this.$parent.currentView = 'OldChangeEdit';

                    } else if(this.selOpType === 'forbid') {
                        obj.modifytype = 3;
                        obj.cost = obj.costPrice;
                        this.$parent.editDataList.push(obj);
                    } else if(this.selOpType === 'reUse') {
                        obj.modifytype = 4;
                        obj.cost = obj.costPrice;
                        this.$parent.editDataList.push(obj);
                    }

                    this.showChange = false;
                    this.showGoods = false;
                }
            },
            // 保存成功后弹窗--编辑完成
            doOprSubmit() {
                this.load1 = true;
                submitGoodsChange(this.gcInfo.sheetid).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message('提交成功！');
                        this.gcInfo.status = 1;
                        this.toDetail();
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                        this.$message(res.retMsg);
                })
            },

            // 保存成功后弹窗--审核
            doOprCheck() {
                /*this.load1 = true;
                checkGoodsChange(this.gcInfo.sheetid, 2).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);

                        this.gcInfo.status = 2;
                        this.toDetail();
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                    this.$message(res.retMsg);
                })*/
                this.load1 = true;
                this.gcInfo.status = 2;
                changeGoodsChange(this.gcInfo).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.load1 = false;
                        this.gcInfo.status = 2;
                        this.$message('审核成功！');
                        this.toDetail();

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                        this.$message(res.retMsg);
                })
            },
            // 保存成功后弹窗--确定
            operateDiaSure() {
                this.toDetail();
            },
            // 取消
            doCancel() {
                this.$confirm('确认放弃编辑吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    if (this.opType === 'add') {
                        this.gridVal.rows = [];

                        this.$parent.editDataList = [];
                        this.$parent.addNewGoods = {};
                        this.$parent.changeGoods = {};
                        this.$parent.currentGoodsIndex = 0;

                        this.gcInfo = JSON.parse(JSON.stringify(this.$parent.gcInfo));

                    }else{
                        this.$parent.editDataList = [];
                        this.$parent.addNewGoods = {};
                        this.$parent.changeGoods = {};
                        this.$parent.currentGoodsIndex = 0;
                        this.getGoodsChange();
                        this.gcInfo = JSON.parse(JSON.stringify(this.$parent.gcInfo));
                    }



                }).catch()
            },
            // 跳转到详情
            toDetail() {
                this.showOperate = false;
                sessionStorage.setItem('gcInfo', JSON.stringify(this.gcInfo));
                console.info(this.gcInfo,'==============this.gcInfo 保存调整详情');
                this.$parent.gcInfo = JSON.parse(JSON.stringify(this.gcInfo));

                this.$router.push({path: '/operations/goodsChangeEdit',  query: {title: '商品变更单详情', opType: 'edit', sheetId: this.gcInfo.sheetid}});
                this.$parent.currentView = 'GoodsChangeDetail';
            },
            // 返回
            doBack() {
                this.$confirm('确认放弃编辑吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('delVisitedViews', this.$route.name);
                    this.$router.push({path: '/operations/goodsChange'});


                    /*if (this.opType === 'add') {
                        this.$router.push({path: '/operations/goodsChange'});
                        this.$store.dispatch('delVisitedViews', this.$route.name);
                    }else{
                        this.$router.push({path: '/operations/goodsChangeEdit',  query: {title: '商品变更单详情', opType: 'edit', sheetId: this.gcInfo.sheetid}});
                        this.$parent.currentView = 'GoodsChangeDetail';
                    }*/
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

    .goodsChangeEdit{

        .slic-content-info{
            width: calc(100% - 286px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 10px;
            background-color: #fff;
            border-radius: 5px;
        }

        .link {
            color: #28e;
            text-decoration: underline;
            cursor: pointer;
        }

        .ostatus {
            /*color: #fb0;*/
            font-weight: bold;
        }

        /*.sl-form-label {
            width: 60px;
            display: inline-block;
        }

        .sl-form-input {
            width: calc(100% - 70px);
            display: inline-block;
        }*/

        .myGrid {
            .nopage {
                height: 100%;
            }
        }

        .noedit {
            input {
                border: 0;
                outline: none;
                background-color: #f3f3f3;
            }
        }

        .noeditspan {
            height: 28px;
            width: 100%;
            background-color: #f3f3f3;
            border-radius: 5px;
        }
        
        /*.el-col {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}*/
		
		.el-dialog-goods {
			.el-dialog--tiny {width: 500px;}
			
			.autoParams-label {
			    width: 45px;
			    display: inline-block;
			    margin-left: 10px;
			}
			.autoParams-input {
				display: inline-block;
				width: calc(100% - 120px);
			}
			.sl-form .sl-form-row .sl-form-label {
				width: 70px !important;
			}
		}
	  
    }
</style>


