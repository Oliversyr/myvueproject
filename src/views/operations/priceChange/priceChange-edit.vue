<template>
    <div class="sl-page-container flex-col priceChangeEdit" v-loading="load1">
        <div class="slic-head-panel">
            <span style="width: 260px;display: inline-block;">
                <levelbar :levelList="['运营应用', this.opType === 'add' ? '新增调价单' : '调价单编辑']">
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【运营应用-售价调整管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>您可以查看到所有的店组并对其进行管理。</p>
                                <p>1. 对商品进行调价，支持一次调整多个店铺的售价；</p>
                                <p>2. 售价支持立即生效或按时生效；</p>
                                <p>3. 支持永久调价和到期恢复的临时（促销）调价；</p>
                                <p>4. 调价单需要审核后生效。</p>
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

                <el-button-group style="margin-right: 10px;">
                    <el-button type="primary" size="small" @click="addNewGoods($event)" v-if="pcInfo.status === 0">添加商品</el-button>
                    <el-button type="primary" size="small" @click="removeGoods($event)" v-if="pcInfo.status === 0">移除商品</el-button>
                </el-button-group>
                <el-button-group>
                    <!--<el-button type="primary" size="small" @click="doSubmit($event)" v-if="pcInfo.status === 0 && opType === 1">编辑完成</el-button>-->
                    <!--<el-button type="primary" size="small" @click="doCheck($event)" v-if="pcInfo.status === 1 && myModulePower.check">审核</el-button>-->
                    <el-button type="primary" size="small" @click="doDelete($event)" v-if="pcInfo.status === 0 && opType === 'edit' && myModulePower.delete">删除</el-button>
                    <el-button type="primary" size="small" @click="doSave($event)" v-if="pcInfo.status === 0">保存</el-button>
                    <el-button type="primary" size="small" @click="doCancel($event)" v-if="pcInfo.status === 0">取消</el-button>
                </el-button-group>
            </div>

            <div class="sl-search-panel">
                <el-row :gutter="20" class="mb-xsmall">
                    <el-col :span="6" style="line-height: 28px;">

                        <span>调价单号：</span>
                        <span :title="pcInfo.sheetid">{{pcInfo.sheetid}}</span>
                    </el-col>
                    <el-col :span="6" style="line-height: 28px;">
                        <span>申请机构：</span>
                        <span :title="pcInfo.fullname">{{pcInfo.fullname}}</span>
                    </el-col>

                    <el-col :span="6">
                        <span>调价类型：</span>
                        <el-radio-group v-model="pcInfo.adjtype" size="small" @change="adjtypeChange">
                            <el-radio-button :label="0">永久</el-radio-button>
                            <el-radio-button :label="1">临时</el-radio-button>
                        </el-radio-group>
                    </el-col>

                    <el-col :span="6" style="line-height: 28px;">
                        <span>状态：</span>
                        <span class="ostatus" v-if="pcInfo.status === 0">编辑中</span>
                        <span class="ostatus" v-if="pcInfo.status === 1">编辑完成</span>
                        <span class="ostatus" v-if="pcInfo.status === 2">已审核</span>
                        <span class="ostatus" v-if="pcInfo.status === 3">已否决</span>
                    </el-col>
                </el-row>

                <el-row :gutter="20" class="mb-xsmall">
                    <el-col :span="12">
                        <span>调价时段：</span>
                        <span v-if="pcInfo.status !== 0">{{pcInfo.bDate}} ~ {{pcInfo.eDate}}</span>
                        <span style="display: inline-block;width: calc(100% - 70px);" v-show="pcInfo.adjtype === 0">
                            <el-date-picker type="datetime" align="right" size="small" style="width: 80%;" placeholder="选择日期" v-model="mydate1" format="yyyy-MM-dd HH:00:00">
                            </el-date-picker>
                        </span>

                        <span style="display: inline-block;width: calc(100% - 70px);" v-show="pcInfo.adjtype === 1">
                            <el-date-picker type="datetimerange" size="small" style="width: 80%;" :picker-options="pickerOptions" placeholder="选择日期范围" v-model="mydate2" format="yyyy-MM-dd HH:00:00">
                            </el-date-picker>
                        </span>
                    </el-col>

                    <el-col :span="6" style="line-height: 30px;">
                        <span>调价机构：</span>
                        <span :title="pcInfo.length">{{myChangeOrg.length}} 个</span>
                    </el-col>

                    <el-col :span="6">
                        <span style="line-height: 30px;">
                            <el-checkbox v-model="isUpdate" v-show="pcInfo.adjtype === 0">同步调整机构所在店组模板价格</el-checkbox>
                        </span>
                    </el-col>
                </el-row>

                <el-row style="padding-bottom: 10px;">

                    <!--<el-row class="pb">-->

                    <el-col :span="2" style="line-height: 30px;width: 60px;">备注：</el-col>
                    <el-col :span="22">
                        <el-input size="small" v-model="pcInfo.notes" :maxlength="32"></el-input>
                    </el-col>

                </el-row>

            </div>
        </div>

        <div class="slic-content">
            <div class="sl-content-info">
                <el-tabs type="border-card" style="height: 100%;" v-model="myTabs">
                    <el-tab-pane label="调价商品" name="1" style="height: 100%;">
                        <div style="flex: 1;height: 100%;padding-bottom:10px;">
                            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg" v-if="myTabs === '1'" @rowSelected="doSelected">
                                <template slot="editPrice" scope="prop">
                                    <span class="newPrice">
                                        <span v-if="!prop.scope.row.isEditPrice" class="pricecell">
                                            {{prop.scope.row.newprice}}
                                            <i class="el-icon-edit" @click.stop="editprice(prop.scope.row, prop.scope.$index)"></i>
                                        </span>
                                        <span class="newPriceEdit el-input--small" v-else>
                                            <input type="number" :id="'editprice' + prop.scope.$index" class="el-input__inner" @blur="prop.scope.row.isEditPrice = false" v-model="prop.scope.row.newprice" @keydown="newPriceChange($event, prop.scope.row)" v-focus />
                                        </span>
                                    </span>
                                </template>

                                <template slot="oldprice" scope="prop">
                                    <span>最低{{prop.scope.row.lowestprice.toFixed(2)}}元, 最高{{prop.scope.row.highestprice.toFixed(2)}}元</span>
                                </template>
                            </sl-grid>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="调价机构" name="2" style="height: 100%;">
                        <div style="padding: 10px 0;">
                            <el-input placeholder="输入关键字进行过滤" v-model="treeText">
                            </el-input>
                        </div>

                        <el-tree class="changePrice-tree" :data="treeChangeData" :props="defaultProps" show-checkbox @check-change="selectChangeTree" :filter-node-method="filterNode" highlight-current node-key="eid" ref="slTree" accordion>
                        </el-tree>
                    </el-tab-pane>
                </el-tabs>

            </div>
        </div>

        <div class="sl-search-panel" style="padding: 10px;margin: 0 0 10px 0;">
            <el-row :gutter="20">
                <el-col :span="4">
                    <span>申请人：</span>
                    <span :title="pcInfo.editor">{{pcInfo.editor}}</span>
                </el-col>

                <el-col :span="6">
                    <span>申请时间：</span>
                    <span :title="pcInfo.editdateStr">{{pcInfo.editdateStr}}</span>
                </el-col>

                <el-col :span="6">
                    <span>审核人：</span>
                    <span :title="pcInfo.editdateStr">{{pcInfo.checker}}</span>
                </el-col>

                <el-col :span="6">
                    <span>审核时间：</span>
                    <span :title="pcInfo.editdateStr">{{pcInfo.checkdateStr}}</span>
                </el-col>

            </el-row>

        </div>

        <!--调价商品弹窗-->
        <el-dialog title="选择调价商品" :visible.sync="showChange" :close-on-click-modal="false" size="tiny">
            <el-row :gutter="15" class="mt">
                <el-col :span="24">
                    <span class="sl-form-label">内码：</span>

                    <sl-autocomplete :autoParams="autoParams" class="autocomplete-input" placeholder="请选择商品" :dataList="goodsList" slWidth="750" colWidths="20,30,20,30" displayProp="goodsName" @querykey="autoQuery" @doAutoSelected="handleAutoSelect" :clearInput="clearInput" selectedMode="SINGLE">
                        <template slot="icon-more">
                            <i class="el-icon-more" @click.stop="moreGoods()"></i>
                        </template>
                    </sl-autocomplete>
                </el-col>
            </el-row>

            <el-row :gutter="15" class="mt">
                <el-col :span="24">
                    <span>
                        <span class="sl-form-label">内码：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.goodsid" readonly class="noedit"></el-input>
                        </span>
                    </span>
                </el-col>

            </el-row>

            <el-row :gutter="15" class="mt">
                <el-col :span="24">
                    <span>
                        <span class="sl-form-label">规格：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.spec" readonly class="noedit"></el-input>
                        </span>
                    </span>
                </el-col>
            </el-row>

            <el-row :gutter="15" class="mt">
                <el-col :span="24">
                    <span>
                        <span class="sl-form-label">包装单位：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.uname" readonly class="noedit"></el-input>
                        </span>
                    </span>
                </el-col>
            </el-row>

            <el-row :gutter="15" class="mt">
                <el-col :span="24">
                    <span>
                        <span class="sl-form-label">建议售价：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.bulkprice" readonly class="noedit">
                                <template slot="prepend">￥</template>
                            </el-input>
                        </span>
                    </span>
                </el-col>
            </el-row>

            <el-row :gutter="15" class="mt mb">
                <el-col :span="24">
                    <span>
                        <span class="sl-form-label">新售价：</span>
                        <span class="sl-form-input">
                            <el-input size="small" v-model="changGoods.newprice" v-input-validate.price="{ model: changGoods, key: 'newprice' }">
                                <template slot="prepend">￥</template>
                            </el-input>
                        </span>
                    </span>
                </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doGoodsSure()" size="small">确定</el-button>
                <el-button @click="showChange = false" class="dialog-cancel" size="small">取消</el-button>
            </span>
        </el-dialog>

        <!--选择商品弹窗-->
        <goods-select1 :show-goods.sync="showGoods" @doSelectGoods="selectedGoodsDialog" selModel="MULT" :gridData="gridData" @searchGoodsList="getGoodsList" v-loading="load2"></goods-select1>

        <!--审核调价单弹窗-->
        <el-dialog title="审核" :visible.sync="showCheck">
            <p>
                <!--您正在审核售价调整单【{{pcInfo.sheetid}}】，您可以审核也可以否决，审核后商品信息将会变更！-->
                您正在审核售价调整单【{{pcInfo.sheetid}}】，审核后商品信息将会变更！
            </p>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="operatePriceChange('approve')" size="small">审核通过</el-button>
                <!--<el-button type="primary" @click="operatePriceChange('veto')" size="small">否决</el-button>-->
                <el-button @click="showCheck = false" class="dialog-cancel" size="small">取 消</el-button>
            </span>
        </el-dialog>

        <!--保存成功后弹窗-->
        <el-dialog title="保存成功提示" :visible.sync="showOperate" size="tiny">
            <p class="mb mt">
                保存单据【{{pcInfo.sheetid}}】成功，您可以继续执行以下操作：
            </p>

            <el-row :gutter="20" v-if="pcInfo.status === 0" class="mb">
                <el-col :span="6" style="">
                    <el-button type="primary" @click="doOprSubmit()" size="small">编辑完成</el-button>
                </el-col>

                <el-col :span="18">
                    "编辑完成" 后，可以进行审核
                </el-col>
            </el-row>

            <el-row :gutter="20" v-if="myModulePower.check" class="mb">
                <el-col :span="6">
                    <el-button type="primary" @click="doOprCheck()" size="small">审核</el-button>
                </el-col>

                <el-col :span="18">
                    "审核" 后，不可以再修改
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
import {validateInputInt,validateInputPrice} from 'utils/validate';
import Levelbar from '@/views/layout/Levelbar.vue';
import SlGrid from '@/components/sl-grid.vue';
import SlAutocomplete from '@/components/sl-autocomplete.vue';
import GoodsSelect1 from '../common/goodsSelect1.vue';
import SlTreeSelectOrg from '@/components/sl-tree-select-org.vue';
import SlAreaSelect from '@/components/sl-areaSelect/sl-areaSelect.vue';
import RouterMixins from '@/mixins/router';
import ViewPage from '@/mixins/viewPage';
import { mapGetters } from 'vuex';
import { getOrgList, getMyOrg } from '@/api/basic/org';
import { getGroupList } from '@/api/basic/group/group';
import { getGoodsTip } from '@/api/operations/goods';
import { getPriceChangeGoods, getPriceChangeGoodsList, getPriceChangeOrg, changePriceChange, addPriceChange, submitPriceChange, checkPriceChange, deletePriceChange } from '@/api/operations/priceChange';

export default {
    components: {
        SlTreeSelectOrg,
        SlAreaSelect,
        Levelbar, SlGrid, SlAutocomplete, GoodsSelect1
    },
    name: 'priceChangeEdit',
    mixins: [RouterMixins, ViewPage],
    data() {
        return {
            load1: false,
            load2: false,
            gridCol: [],
            gridVal: { rows: [] },
            gridCfg: {
                selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                frozen: true,
                noPage: true
            },
            selectedGridData: [],
            opType: '',
            userRole: '',
            queryKey: '',
            clearInput: false,
            searchStatus: '',
            mydata: '',
            showChange: false,
            showCheck: false,
            showOperate: false,
            goodsChangeCode: '123456789',
            onote: '',
            showGoods: false,
            gridData: [],
            pcOrgStr: '',
            pcType: '',
            pcTime: '',
            isUpdate: false,
            changGoods: {},
            showChangeOrg: false,
            showSelectChangeOrg: false,
            shopGroupList: [],
            changeOrg: { shopGroup: '' },
            selectChangeOrg: { shopGroup: '' },
            orgTreeData: [],
            orgTreeProps: {
                label: 'eName',
                selected: 'orgid'
            },
            mydate1: '',
            mydate2: [],
            pcInfo: {
                sheetid: '',
                editor: '',
                editdateStr: '',
                eName: '',
                status: 0,
                adjtype: 0,
                mydate1: '',
                mydate2: [],
                bDate: '',
                eDate: '',
                groups: [],
                isUpdate: false,
                notes: ''
            },
            isUpdate: false,
            goodsList: [],
            autoParams: {
                mygoodsId: '商品内码',
                goodsName: '商品名称',
                barcode: '条码',
                bulkprice: '售价'
            },
            myTabs: '1',
            pcOrg: [],
            treeChangeData: [],
            treeText: '',
            initorg: false,
            defaultProps: {
                children: 'children',
                label: 'ename',
                disabled: 'disabled'
            },
            myChangeOrg: [],
            changeLength: 0,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'user_power'
        ]),
        myModulePower: function() {
            const _this = this;
            let modulePower = {};
            this.user_power.forEach((item, i) => {
                if (item.moduleid === this.$route.meta.moduleid) {
                    modulePower = item.powerlist;
                }
            })
            return modulePower;
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            console.info('================ mounted =================',this.$route.query)
            this.gridCol = [
                { field: 'mygoodsid', name: '商品内码', width: '100', fixed: true },
                { field: 'goodsName', name: '商品名称', width: '200', align: 'left' },
                { field: 'barcode', name: '条码', width: '150px' },
                { field: 'spec', name: '销售规格', width: '100' },
                { field: 'uname', name: '包装单位', width: '100' },
                { field: 'catLName', name: '所属品类', width: '200' },
                { field: 'brandName', name: '品牌', minWidth: '150' },
                { field: 'bulkprice', name: '建议售价', width: '100', align: 'right' },
                { field: 'oldprice', name: '原售价', width: '140', template: 'oldprice', fixed: 'right' },
                { field: 'newprice', name: '新售价', width: '100', template: 'editPrice', fixed: 'right', align: 'right' }
            ]


        })
    },
    activated: function() {
        /*if (typeof  this.posInfo.mydate == 'undefined'){
            this.$set(this.pcInfo, 'mydate', '');
        }*/
        this.opType = this.$route.query.opType;
        //            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));


        if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
            /*let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
             console.log('this.catahData==>', this.$route);
             this.pcInf = catahData.pcInfo;
             this.gridVal.rows = catahData.grid;
             this.myChangeOrg = catahData.myChangeOrg;
             this.changeLength = catahData.changeLength;*/

        } else {





            if (this.$route.query.opType === 'edit') {
                this.changePageType(2, '调价单编辑');
                Object.assign(this.pcInfo, JSON.parse(sessionStorage.getItem('editPriceChange')));
                this.pcInfo.mydate1 = '';
                this.pcInfo.mydate2 = [];
                this.mydate1 = '';
                this.mydate2 = [];
                this.pcInfo.groups = this.pcInfo.groups ? this.pcInfo.groups : [];
                console.log('this.pcInfo==', this.pcInfo);
                if (this.pcInfo.adjtype === 0) {
                    this.pcInfo.mydate1 = (this.pcInfo.bDateStr || this.pcInfo.bdateStr);
                    this.mydate1 = (this.pcInfo.bDateStr || this.pcInfo.bdateStr);
                } else {
                    this.pcInfo.mydate2 = [(this.pcInfo.bDateStr || this.pcInfo.bdateStr), (this.pcInfo.eDateStr || this.pcInfo.edateStr)];
                    this.mydate2 = [(this.pcInfo.bDateStr || this.pcInfo.bdateStr), (this.pcInfo.eDateStr || this.pcInfo.edateStr)];
                }
                //                    this.pcInfo.mydate = ;
                this.$set(this.pcInfo, 'mydate1', this.pcInfo.mydate1);
                this.$set(this.pcInfo, 'mydate2', this.pcInfo.mydate2);
                this.$set(this, 'mydate1', this.pcInfo.mydate1);
                this.$set(this, 'mydate2', this.pcInfo.mydate2);

                this.$set(this.pcInfo, 'isUpdate', this.pcInfo.adjrang === 2);
                this.$set(this, 'isUpdate', this.pcInfo.adjrang === 2);
                console.log('this.pcInfo.mydate==', this.pcInfo.isUpdate)
                this.getPriceChangeInfo();
                this.getPriceChangeOrgInfo();

            } else if (this.$route.query.opType === 'add') {
                this.changePageType(1, '新增调价单');
                this.pcInfo = {};
                this.pcInfo.editor = this.userInfo.realName;
                this.pcInfo.editdateStr = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                this.pcInfo.fullname = this.userInfo.fullname;
                this.pcInfo.sheetid = '';
                this.pcInfo.status = 0;

                this.$set(this.pcInfo, 'adjtype', 0);

                this.$set(this.pcInfo, 'mydate1', '');
                this.$set(this.pcInfo, 'mydate2', []);
                this.$set(this, 'mydate1', this.pcInfo.mydate1);
                this.$set(this, 'mydate2', this.pcInfo.mydate2);

                this.$set(this.pcInfo, 'isUpdate', false);
                this.$set(this, 'isUpdate', false);
                this.pcInfo.notes = '';
                this.myChangeOrg = [];
                //                    this.gridSelVal.rows = [];
                this.gridVal.rows = [];
                this.$refs.slTree.setCheckedKeys([]);
                console.log('this.pcInfo.mydate==', this.pcInfo)
            }

            this.getOrg();
        }
    },
    beforeRouteLeave(to, from, next) {
        /*console.log('this.myUserInfo==>', this.myUserInfo);
        let dataobj = {
            pcInf: this.pcInfo,
            grid: this.gridVal.rows,
            myChangeOrg: this.myChangeOrg,
            changeLength: this.changeLength
        }*/
        this.$store.dispatch('updateStateData', {obj: JSON.parse(JSON.stringify({})), name: this.$route.path});
        next();
    },
    methods: {
        // 获取调价单商品列表
        getPriceChangeInfo() {
            this.load1 = true;
            const _this = this;
            getPriceChangeGoodsList(this.pcInfo.sheetid).then(res => {
                this.load1 = false;
                if (res.retCode === 'SUCCESS') {
                    this.gridVal.rows = res.result;
                    this.gridVal.rows.forEach((item, i) => {
                        _this.$set(item, 'isEditPrice', false)
                    })
                } else {
                    this.load1 = false;
                    //                        this.$message(res.retMsg);
                }
            }).catch(err => {
                this.$message(res.retMsg);
            })
        },
        // 获取可调价商品列表
        getGoodsList(key) {
            this.load2 = true;
            let eids = '';

            this.myChangeOrg.forEach((item, i) => {
                if (eids === '') {
                    eids = item.eid;
                } else {
                    eids = eids + ',' + item.eid
                }
            })

            let opt = {
                eid: this.userInfo.loginEid,
                goodsId: -1,
                goodsName: key,
                priceEids: eids
            }

            getPriceChangeGoods(opt).then(res => {
                this.load2 = false;
                if (res.retCode === 'SUCCESS') {
                    this.gridData = res.result;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                //                    this.$message(res.retMsg);
                this.load2 = false;
            })

        },
        // 获取调价单机构列表
        getPriceChangeOrgInfo() {
            this.load2 = true;
            const _this = this;
            getPriceChangeOrg(this.pcInfo.sheetid).then(res => {
                this.load2 = false;
                if (res.retCode === 'SUCCESS') {
                    //                        this.pcOrg = res.result;
                    //                        this.pcInfo.groups = res.result;

                    this.$refs.slTree.setCheckedKeys(res.result);
                    this.initorg = false;
                    //                        this.notChange = true;
                    setTimeout(() => {
                        this.myChangeOrg = this.$refs.slTree.getCheckedNodes(true);
                        this.changeLength = this.$refs.slTree.getCheckedNodes(true).length;
                        console.log('node11==', this.$refs.slTree.getCheckedNodes(true))
                    }, 300);

                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load2 = false;
                //                    this.$message(res.retMsg);
            })
        },
        // 调价机构选择
        selectChangeTree(node, sel) {
            console.log('nod12345e==', this.myChangeOrg.length, this.$refs.slTree.getCheckedNodes(true))
            const _this = this;
            let getNodes = this.$refs.slTree.getCheckedNodes(true);

            if (this.changeLength !== 0 && this.changeLength !== getNodes.length) {
                console.log('nod12345e2==', this.myChangeOrg.length, this.$refs.slTree.getCheckedNodes(true))
                if (this.gridVal.rows.length !== 0) {
                    console.log('initorginitorginitorg==', this.initorg)
                    if(this.initorg) {
                        this.initorg = false;
                    } else {
                        this.$confirm('修改调价机构会清空调价商品列表，请确认是否修改？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.gridVal.rows = [];
                            this.myChangeOrg = this.$refs.slTree.getCheckedNodes(true);
                        }).catch(() => {
                            console.log('nod123eee==', this.myChangeOrg)

                            let eidStr = [];
                            this.myChangeOrg.forEach((item, i) => {
                                eidStr.push(item.eid);
                            })
                            this.changeLength = this.myChangeOrg.length;
                            this.$refs.slTree.setCheckedKeys(eidStr);
                        })
                    }


                } else {
                    console.log('node==', this.$refs.slTree.getCheckedNodes(true))
                    this.gridVal.rows = [];
                    this.myChangeOrg = JSON.parse(JSON.stringify(this.$refs.slTree.getCheckedNodes(true)));
                }
            } else if (this.myChangeOrg.length === 0) {
                //                    console.log('node==', this.$refs.slTree.getCheckedNodes(true))
                //                    this.gridVal.rows = [];
                this.myChangeOrg = JSON.parse(JSON.stringify(this.$refs.slTree.getCheckedNodes(true)));
            }

            this.changeLength = getNodes.length;


        },
        // 调价机构树过滤
        filterNode(value, data) {
            if (!value) return true
            return data.ename.indexOf(value) !== -1
        },
        // 获取店铺列表
        getOrg() {
            getOrgList().then((res) => {
                if (res.retCode === 'SUCCESS') {
                    const _this = this;
                    let firstLevel = [];
                    let secondLevel = [];
                    let thirdLevel = [];
                    let myLevel = 0;

                    res.result.forEach((item, i) => {
                        _this.$set(item, 'disabled', false);
                        if (item.levelId == 0) {
                            _this.$set(item, 'children', []);
                            firstLevel.push(item);
                        } else if (item.levelId == 1) {
                            _this.$set(item, 'children', []);
                            secondLevel.push(item);
                        } else {
                            thirdLevel.push(item);
                        }
                        if (item.eid === this.userInfo.loginEid) {
                            myLevel = item.levelId;
                        }
                    });

                    firstLevel.forEach((item1, i) => {
                        secondLevel.forEach((item2, j) => {
                            thirdLevel.forEach((item3, k) => {
                                if (item3.parentid === item2.eid) {
                                    item2.children.push(item3);
                                }
                            })
                            if (item2.parentid === item1.eid) {
                                item1.children.push(item2);
                            }
                        })
                    });

                    let cachelist = [];
                    if (myLevel === 0) {
                        firstLevel.forEach((item1, i) => {
                            if (item1.eid === this.userInfo.loginEid) {
                                cachelist.push(item1);
                            }
                        });
                    }
                    else if (myLevel === 1) {
                        firstLevel.forEach((item1, i) => {
                            secondLevel.forEach((item2, j) => {
                                if (item2.eid === this.userInfo.loginEid && item2.parentid === item1.eid) {
                                    // item1.disabled = true;
                                    // item1.children = [item2];
                                    // cachelist.push(item1);
                                    cachelist.push(item2);
                                }
                            })
                        });
                    }
                    else if (myLevel === 2) {
                        firstLevel.forEach((item1, i) => {
                            secondLevel.forEach((item2, j) => {
                                thirdLevel.forEach((item3, k) => {
                                    if (item3.eid === this.userInfo.loginEid && item3.parentid === item2.eid && item2.parentid === item1.eid) {
                                        // item2.children = [item3];
                                        // item1.children = [item2];
                                        // item1.disabled = true;
                                        // item2.disabled = true;
                                        // cachelist.push(item1);
                                        cachelist.push(item3);
                                    }
                                })
                            })
                        });
                    }

//                     if (myLevel === 0) {
//                         firstLevel.forEach((item1, i) => {
//                             item1.disabled = false;
//                             secondLevel.forEach((item2, j) => {
//                                 if (item2.parentid === item1.eid) {
//                                     item2.disabled = false;
//                                     thirdLevel.forEach((item3, k) => {
//                                         if (item3.parentid === item2.eid) {
//                                             item3.disabled = false;
//                                         }
//                                     })
//                                 }
//                             })
//                         });
//                     } else if (myLevel === 1) {
//                         firstLevel.forEach((item1, i) => {
//                             secondLevel.forEach((item2, j) => {
//                                 if (item2.eid === this.userInfo.loginEid) {
//                                     item2.disabled = false;
//                                     thirdLevel.forEach((item3, k) => {
//                                         if (item3.parentid === item2.eid) {
//                                             item3.disabled = false;
//                                         }
//                                     })
//                                 }
//                             })
//                         });
//                     } else if (myLevel === 2) {
//                         firstLevel.forEach((item1, i) => {
//                             secondLevel.forEach((item2, j) => {
//                                 thirdLevel.forEach((item3, k) => {
//                                     if (item3.eid === this.userInfo.loginEid) {
//                                         item3.disabled = false;
//                                     }
//                                 })
//                             })
//                         });
//                     }

                    this.treeChangeData = cachelist;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch((err) => {

            })
        },
        // 获取店组列表
        getShopGroup() {
            let params = {
                keyValue: '',
                status: -1
            }
            getGroupList(params).then((res) => {
                if (res.retCode === 'SUCCESS') {
                    this.shopGroupList = res.result;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch((err) => {

            })
        },
        // 添加商品
        addNewGoods() {
            if (this.myChangeOrg.length === 0) {
                this.$message('请先选择调价机构！');
                this.myTabs = '2';
            } else {
                this.myTabs = '1';
                this.showChange = true;
                for (let cg in this.changGoods) {
                    if(cg === 'newprice') {
                        this.changGoods.newprice = 0;
                    } else {
                        this.changGoods[cg] = '';
                    }
                }

                this.clearInput = true;
            }
        },
        // 自动补全搜索
        autoQuery(key) {
            let eids = '';
            this.clearInput = false;
            this.myChangeOrg.forEach((item, i) => {
                if (eids === '') {
                    eids = item.eid;
                } else {
                    eids = eids + ',' + item.eid
                }
            })

            let opt = {
                eid: this.userInfo.loginEid,
                goodsId: -1,
                goodsName: key,
                priceEids: eids
            }

            getPriceChangeGoods(opt).then(res => {
                if (res.retCode === 'SUCCESS') {
                    this.goodsList = res.result;
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

            this.changGoods = sel ? sel : {};
            this.changGoods.newprice = 0;
        },
        // 移除商品
        removeGoods() {
            const _this = this;
            if (this.selectedGridData.length === 0) {
                this.$message("请选择商品！");
            } else {
                this.$confirm('确认删除该商品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.selectedGridData.forEach((item, i) => {
                        for (let j = 0; j < _this.gridVal.rows.length; j++) {
                            if (_this.gridVal.rows[j].goodsid === item.goodsid) {
                                _this.gridVal.rows.splice(j, 1);
                                break;
                            }
                        }

                    })
                }).catch()
            }
        },
        // 审核
        doCheck() {
            this.showCheck = true;
        },
        // 审核确认
        operatePriceChange(str) {
            this.load1 = true;
            let opType = 0;
            if (str === 'approve') {
                opType = 2;
            } else if (str === 'veto') {
                opType = 3;
            }

            checkPriceChange(this.pcInfo.sheetid, opType).then(res => {
                this.load1 = false;
                if (res.retCode === 'SUCCESS') {
                    this.$message(res.retMsg);
                    this.showCheck = false;
                    this.pcInfo.status = opType === 2 ? 2 : 3;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load1 = false;
                //                    this.$message(res.retMsg);
            })
        },
        // 删除
        doDelete() {
            this.$confirm('确认删除该调价单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.load2 = true;
                deletePriceChange(this.pcInfo.sheetid).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.$message('删除成功！');
                        this.$store.dispatch('delVisitedViews', this.$route.name);
                        this.$router.push({ path: '/operations/priceChange' });
                        // this.doBack();
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
                    //                        this.$message(res.retMsg);
                })
            }).catch()
        },
        // 提交
        doSubmit() {
            this.load2 = true;
            submitPriceChange(this.pcInfo.sheetid).then(res => {
                this.load2 = false;
                if (res.retCode === 'SUCCESS') {
                    this.$message('操作成功！');
                    this.pcInfo.status = 1;
                    this.showOperate = true;
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load2 = false;
                //                    this.$message(res.retMsg);
            })
        },
        // 保存
        doSave() {
            // console.log(typeof this.pcInfo.mydate)
            // console.log(this.pcInfo.mydate.length)
            this.pcInfo.mydate1 = JSON.parse(JSON.stringify(this.mydate1));
            this.pcInfo.mydate2 = JSON.parse(JSON.stringify(this.mydate2));

            if ((this.pcInfo.adjtype === 0 && !this.pcInfo.mydate1) || (this.pcInfo.adjtype === 1 && !this.pcInfo.mydate2[0])) {
                this.$message('请选择调价时间！');

            } else if(this.pcInfo.adjtype === 1 && (this.mydate2[1] < new Date())) {
//                console.log(this.pcInfo.mydate2)
                this.$message('调价结束时间必须大于此刻！');

//                console.log()

            }else if (this.gridVal.rows.length === 0) {
                this.$message('请选择调价商品！');

            } else {

                let param = {
                    eid: this.userInfo.loginEid,
                    sheetid: this.pcInfo.sheetid,
                    title: this.pcInfo.title,
                    adjtype: this.pcInfo.adjtype,
                    adjrang: this.pcInfo.adjtype === 0 ? (this.isUpdate ? 2 : 1) : 1,
                    notes: this.pcInfo.notes,
                    status: this.pcInfo.status,
                    editor: this.pcInfo.editor,
                    editdateStr: this.pcInfo.editdateStr,
                    //                    checker: obj.checker,
                    //                    checkdateStr: obj.checkdateStr,
                    orgnum: this.myChangeOrg.length,
                    goodsnum: this.gridVal.rows.length,
                    groups: this.myChangeOrg,
                    items: this.gridVal.rows
                }
                if (this.pcInfo.adjtype === 1) {
                    param.bdateStr = (typeof this.mydate2[0]) === 'string' ? this.pcInfo.mydate2[0] : this.dateFormat(this.mydate2[0], 'yyyy-MM-dd hh:00:00');
                    param.edateStr = (typeof this.mydate2[1]) === 'string' ? this.pcInfo.mydate2[1] : this.dateFormat(this.mydate2[1], 'yyyy-MM-dd hh:00:00');
                } else if (this.pcInfo.adjtype === 0) {
                    param.bdateStr = (typeof this.mydate1) === 'string' ? this.pcInfo.mydate1 : this.dateFormat(this.mydate1, 'yyyy-MM-dd hh:00:00');
                }

                this.load1 = true;
                console.log('=======param==', param);
                if (this.opType === 'add') {
                    param.sheetid = -1;
                    addPriceChange(param).then(res => {
                        this.load1 = false;
                        if (res.retCode === 'SUCCESS') {
                            //                                this.$message('保存成功！');
                            param.sheetid = res.result;
                            this.pcInfo = param;
                            Object.assign(this.pcInfo, param);
                            this.showOperate = true;
                            /*this.$store.dispatch('delVisitedViews', this.$route.name);
                             this.$router.push({path: '/operations/priceChangeDetail', query: {sheetId: res.result}})*/
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load1 = false;
                        //                        this.$message(res.retMsg);
                    })

                } else {
                    changePriceChange(param).then(res => {
                        this.load1 = false;
                        if (res.retCode === 'SUCCESS') {
                            //                                this.$message('保存成功！');
                            this.showOperate = true;
                            Object.assign(this.pcInfo, param);
                            // this.pcInfo = param;
                            //                            sessionStorage.setItem('editPriceChange', JSON.stringify(param));
                            //                            this.doBack();
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
        // 取消
        doCancel() {
            this.$confirm('确认放弃编辑吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.$route.query.opType === 'edit') {
                    Object.assign(this.pcInfo, JSON.parse(sessionStorage.getItem('editPriceChange')));
                    this.pcInfo.groups = this.pcInfo.groups ? this.pcInfo.groups : [];
                    console.log('this.pcInfo==', this.pcInfo);
                    if (this.pcInfo.adjtype === 0) {
                        this.pcInfo.mydate1 = (this.pcInfo.bDateStr || this.pcInfo.bdateStr);
                        this.mydate1 = (this.pcInfo.bDateStr || this.pcInfo.bdateStr);
                    } else {
                        this.pcInfo.mydate2 = [(this.pcInfo.bDateStr || this.pcInfo.bdateStr), (this.pcInfo.eDateStr || this.pcInfo.edateStr)];
                        this.mydate2 = [(this.pcInfo.bDateStr || this.pcInfo.bdateStr), (this.pcInfo.eDateStr || this.pcInfo.edateStr)];
                    }
                    //                    this.pcInfo.mydate = ;
                    this.$set(this.pcInfo, 'mydate1', this.pcInfo.mydate1);
                    this.$set(this.pcInfo, 'mydate2', this.pcInfo.mydate2);
                    this.$set(this, 'mydate1', this.pcInfo.mydate1);
                    this.$set(this, 'mydate2', this.pcInfo.mydate2);

                    this.$set(this.pcInfo, 'isUpdate', this.pcInfo.adjrang === 2);
                    this.$set(this, 'isUpdate', this.pcInfo.adjrang === 2);
                    console.log('this.pcInfo.mydate==', this.pcInfo.isUpdate)
                    this.getPriceChangeInfo();
                    this.getPriceChangeOrgInfo();

                } else if (this.$route.query.opType === 'add') {
                    console.log('this.pcInfo==', this.userInfo);
                    this.pcInfo.editor = this.userInfo.realName;
                    this.pcInfo.editdateStr = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
                    this.pcInfo.eName = this.userInfo.ename;
                    this.pcInfo.sheetid = '';
                    this.pcInfo.status = 0;
                    //                    this.gridSelVal.rows = [];

                    this.gridVal.rows = [];
                }

            }).catch()
        },
        // 调价商品选择
        doSelected(data) {
            console.log('data==', data);
            this.selectedGridData = data;
        },
        // 更多商品弹窗
        moreGoods() {
            this.getGoodsList('');
            this.showGoods = true;
            this.showChange = false;
        },
        // 选择调价商品确定
        doGoodsSure() {
            if(!this.changGoods.goodsid){
                this.$message.error('请选择调价商品！');
                return;
            }

            if ((/^(?:[1-9][0-9]*|0)(?:\.[0-9]+)?$/).test(this.changGoods.newprice) && this.changGoods.newprice !== 0) {
                this.$set(this.changGoods, 'isEditPrice', false)
                this.gridVal.rows.push(JSON.parse(JSON.stringify(this.changGoods)));
                this.showChange = false;

            } else {
                this.$message.error('新售价不能为空或者为0或者负数');
            }
            //                this.changGoods.goodsName = this.changGoods.goodsname;

        },
        // 商品选择弹窗
        selectedGoodsDialog(obj) {
            this.showGoods = false;
            const _this = this;
            if (obj) {
                obj.forEach((item, i) => {
                    item.newprice = 0;
                    _this.$set(item, 'isEditPrice', false)
                    _this.gridVal.rows.push(item);
                })
            }
        },
        // 新价格编辑按钮
        editprice(obj, id) {
            console.log(obj)
            obj.isEditPrice = true;

        },
        // 新价格编辑input的change
        newPriceChange(event, obj) {
            /*console.log(event.target.value);
            if (event.target.value === '') {
                console.log(typeof event.target.value);
                obj.newprice = '0';
            }*/
            setTimeout(()=> {
                obj.newprice = validateInputPrice(obj.newprice);
            }, 950);
        },
        // 保存后的操作弹窗--确定
        operateDiaSure() {
            this.showOperate = false;
            this.toDetail();
        },
        // 保存后的操作弹窗--编辑完成
        doOprSubmit() {
            this.load2 = true;
            submitPriceChange(this.pcInfo.sheetid).then(res => {
                this.load2 = false;
                if (res.retCode === 'SUCCESS') {
                    this.$message('提交成功！');
                    this.pcInfo.status = 1;
                    this.showOperate = false;
                    this.toDetail();
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load2 = false;
                //                    this.$message(res.retMsg);
            })
        },
        // 保存后的操作弹窗--审核
        doOprCheck() {
            this.load1 = true;
            /*let opType = 0;
            if(str === 'approve') {
                opType = 2;
            } else if(str === 'veto') {
                opType = 3;
            }*/



            let mystatus = this.pcInfo.status;
            if (mystatus === 0) {
                this.pcInfo.status = 2;
                changePriceChange(this.pcInfo).then(res => {
                    this.load1 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.$message('审核成功！');
                        this.showOperate = false;
                        this.pcInfo.status = 2;
                        this.toDetail();
                        //                            sessionStorage.setItem('editPriceChange', JSON.stringify(param));
                        //                            this.doBack();
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
                    //                        this.$message(res.retMsg);
                })
            } else {
                checkPriceChange(this.pcInfo.sheetid, 2).then(res => {
                    this.load1 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.$message('审核成功！');
                        this.showOperate = false;
                        //                        this.showCheck = false;
                        //                        this.pcInfo.status = opType === 2 ? 2 : 3;
                        this.pcInfo.status = 2;
                        this.toDetail();

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load1 = false;
                    //                    this.$message(res.retMsg);
                })
            }
        },
        adjtypeChange(type) {
//            let myDate = JSON.parse(JSON.stringify(this.pcInfo.mydate));
//            this.pcInfo.mydate = '';
            console.log('this.pcInfo.mydate==', this.pcInfo.mydate);
        },
        // 跳转到详情
        toDetail() {
            sessionStorage.setItem('editPriceChange', JSON.stringify(this.pcInfo));
            this.$store.dispatch('delVisitedViews', this.$route.name);
            this.$router.push({ path: '/operations/priceChangeDetail', query: { sheetId: this.pcInfo.sheetid } });
        },
        // 返回
        doBack() {
            this.$confirm('确认放弃编辑吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({path: '/operations/priceChange'});
                this.$store.dispatch('delVisitedViews', this.$route.name);
            }).catch()

        },
        // 日期格式化
        dateFormat(mydate, myfmt) {
            console.info('========== date format');
            Date.prototype.Format = function(fmt) { //author: meizz
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

    },
    watch: {
        treeText(val) {
            this.$refs.slTree.filter(val);
        },
        /*'$route':function(){
            console.info(this.$route,'===========this.$route')
        }*/
    },
    directives: {
        focus: {
            inserted: function(el) {
                el.focus();
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.priceChangeEdit {

    .sl-content-info {
        width: calc(100% - 286px);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 10px 10px 0 10px;
        background-color: #fff;
        border-radius: 5px;
        width: 100%;
    }

    .ostatus {
        /*color: #fb0;*/
        font-weight: bold;
    }

    .el-date-editor--datetimerange.el-input {
        width: 100%;
    }

    .odetail {
        margin-left: 10px;
        color: #28e;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .el-checkbox__label {
        font-size: 12px;
    }

    .newPrice {
        position: relative;
        display: inline-block;
        width: 100%;
        text-align: center;

        i {
            display: none;
            color: #28e;
            cursor: pointer;
        }

        &:hover {
            i {
                display: inline-block;
            }
        }

        .pricecell {
            min-width: 20px;
        }
    }

    .sl-form-label {
        width: 70px;
        display: inline-block;
        text-align: right;
    }

    .sl-form-input {
        width: calc(100% - 80px);
        display: inline-block;
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .myGrid {
        .nopage {
            height: 100%;
        }
    }

    .el-tabs--border-card {
        border: 0;
        box-shadow: none;

        .el-tabs__header {
            border: 1px solid #d1dbe5;
            border-bottom: 0;
            padding-bottom: 0px;
        }

        .el-tabs__content {
            height: calc(100% - 35px);
            padding: 0;
        }
    }

    .changePrice-tree {
        height: calc(100% - 60px);
        overflow-y: auto;
    }

    .autocomplete-input {
        display: inline-block;
        width: calc(100% - 80px);
    }
    /*.el-col.el-col-6 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }*/

    .el-dialog--tiny {
        width: 500px;
    }

    .el-tabs__item {
        height: 35px;
        line-height: 35px;
    }

    .el-time-panel {
        min-width: 150px;
    }
}
</style>


