<template>
    <div class="sl-page-container flex-col goodsChangeDetail" v-loading="load1">
        <div class="slic-head-panel">
            <span style="width: 280px;display: inline-block;">
                <levelbar :levelList="['运营应用', '变更单详情']">
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
                    <el-button type="primary" size="small" @click="doSubmit($event)" v-if="gcInfo.status == 0 && myModulePower.edit">编辑完成</el-button>
                    <el-button type="primary" size="small" @click="doDelete($event)" v-if="gcInfo.status == 0 && myModulePower.delete">删除</el-button>
                    <el-button type="primary" size="small" @click="toEdit()" v-if="gcInfo.status == 0 && myModulePower.edit">编辑</el-button>
                    <el-button type="primary" size="small" @click="doCheck($event)" v-if="gcInfo.status == 1 && myModulePower.check">审核</el-button>
                    <el-button type="primary" size="small" @click="toReEdit()" v-if="gcInfo.status == 1 && myModulePower.edit">重新编辑</el-button>
                    <!--<el-button type="primary" size="small" @click="doCancel($event)" v-if="gcInfo.status == 0">取消</el-button>-->
                </el-button-group>
            </div>
            <div class="sl-search-panel">
                <el-row :gutter="20" style="margin-bottom: 10px;">
                    <el-col :span="8">
                        <span>变更单号：</span>
                        <span :title="gcInfo.sheetid">{{gcInfo.sheetid}}</span>
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
                        <span  :title="gcInfo.ename">{{gcInfo.ename}}</span>
                    </el-col>

                    <el-col :span="8">
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
                        <span style="line-height: 30px;"  :title="gcInfo.notes">{{gcInfo.notes}}</span>
                    </el-col>
                </el-row>

            </div>
        </div>

        <div class="slic-content">
            <div class="slic-content-info">
                <div style="text-align: right;margin-bottom: 10px;">
                    <!--<el-button-group>
                        <el-button type="primary" size="small" @click="addGoods($event)" v-if="gcInfo.status == 0">新建商品</el-button>
                        <el-button type="primary" size="small" @click="changeGoods($event)" v-if="gcInfo.status == 0">商品变更</el-button>
                        <el-button type="primary" size="small" @click="forbidGoods($event)" v-if="gcInfo.status == 0">禁用商品</el-button>
                        <el-button type="primary" size="small" @click="enableGoods($event)" v-if="gcInfo.status == 0">启用商品</el-button>
                    </el-button-group>-->
                </div>
                <div style="flex: 1;height: calc(100% - 20px);" v-loading="load2">

                    <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg">
                        <template slot="operate" scope="prop">
                            <el-button @click="toGoodsDetail(prop.scope)" type="text" size="small" v-if="prop.scope.row.modifytype === 1 || prop.scope.row.modifytype === 2">详情</el-button>
                            <!--<el-button type="text" size="small" @click="deleteGoods(prop.scope.row)">删除</el-button>-->
                        </template>

                        <template slot="cat" scope="prop">
                           {{prop.scope.row.catlname || prop.scope.row.catName}}
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

    </div>


</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import GoodsSelect from '../common/goodsSelect.vue';
    import {mapGetters} from 'vuex';
    import {operateGoods, getGoodsTip} from '@/api/operations/goods';
    import {getChangeGoodsList, changeGoodsChange, deleteGoodsChange, checkGoodsChange, submitGoodsChange, addGoodsChange, reEditGoodsChange} from '@/api/operations/goodsChange';

    export default {
        components: {Levelbar, SlGrid, SlAutocomplete, GoodsSelect},
        name: 'goodsChangeEdit',
        data () {
            return {
                load1: false,
                load2: false,
                myModulePower: {},
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
                    goodsid: '商品内码',
                    goodsname: '商品名称',
                    barcode: '条码',
                    ostatus: '状态'
                }

            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
            ])
        },
        mounted: function () {
            this.$nextTick(function () {
                this.gridCol = [
                    {field: 'mygoodsid', name: '商品内码', width: '100', fixed: true},
                    {field: 'goodsname', name: '商品名称', width: '150'},
                    {field: 'barcode', name: '条码', width: '150px'},
                    {field: 'spec', name: '销售规格', width: '90'},
                    {field: 'uname', name: '包装单位', width: '90'},
                    {field: 'catlname', name: '所属品类', width: '200', template: 'cat'},
                    {field: 'brandname', name: '品牌'},
                    {field: 'cost', name: '默认进价', width: '100'},
                    {field: 'bulkprice', name: '建议售价', width: '100',align:'right'},
                    {field: 'modifytype', name: '变更状态', width: '90', template: 'status', fixed: 'right'},
                    {field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right' ,align:'left'}
                ]

                this.gcInfo = this.$parent.gcInfo;
                this.myModulePower = this.$parent.myModulePower;

                this.getGoodsChange();
//                this.gridVal.rows = this.$parent.editDataList;
                console.log('this.gridVal.rows==', this.gcInfo);

                console.log('this.$parent.currentView==', this.$parent.currentView)

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
                this.load2 = true;
                console.log(this.gcInfo);
                getChangeGoodsList(this.$route.query.sheetId).then(res => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.$parent.editDataList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 提交
            doSubmit() {
                submitGoodsChange(this.gcInfo.sheetid).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message('操作成功！');
                        this.gcInfo.status = 1;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                            this.$message(res.retMsg);
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
                            this.$message('删除成功！');
                            this.doBack();
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load1 = false;
//                        this.$message(res.retMsg);
                    })
                }).catch()

            },
            // 跳转到商品详情
            toGoodsDetail(obj) {

                if(obj.row.modifytype === 1) {
                    this.$parent.addNewGoods = obj.row;
                    this.$parent.fromView = 'GoodsChangeDetail';
                    this.$parent.currentGoodsIndex = obj.$index;
                    this.$parent.currentView = 'NewChangeDetail';

                } else if(obj.row.modifytype === 2) {
                    this.$parent.changeGoods = obj.row;
                    this.$parent.fromView = 'GoodsChangeDetail';
                    this.$parent.currentGoodsIndex = obj.$index;
                    this.$parent.currentView = 'OldChangeDetail';
                }

            },
            // 编辑
            toEdit() {
                this.$parent.currentView = 'GoodsChangeEdit';
            },
            // 重新编辑
            toReEdit() {
                reEditGoodsChange(this.gcInfo.sheetid).then(res => {
                    this.load1 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message('操作成功！');
                        this.$parent.currentView = 'GoodsChangeEdit';
                        this.gcInfo.status = 0;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
//                        this.$message(res.retMsg);
                })

            },
            // 返回
            doBack() {
                this.$store.dispatch('delVisitedViews', this.$route.name);
                console.log('11111111111111111111111111',this.$route.name);
                this.$router.push({path: '/operations/goodsChange'});
//                console.log('11111111111111111111111111',this.$route.name);

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

    .goodsChangeDetail{

        .slic-content-info{
            width: calc(100% - 286px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 0 10px 0 10px !important;
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
        
    	.el-col {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
    }
</style>


