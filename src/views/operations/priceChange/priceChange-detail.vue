<template>
    <div class="sl-page-container flex-col priceChangeDetail">
        <div class="slic-head-panel">
            <span style="width: 260px;display: inline-block;">
                <levelbar>
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
                    <!--<el-button type="primary" size="small" @click="addNewGoods($event)" v-if="pcInfo.status === 0">添加商品</el-button>-->
                    <!--<el-button type="primary" size="small" @click="removeGoods($event)" v-if="pcInfo.status === 0">移除商品</el-button>-->
                </el-button-group>
                <el-button-group>
                    <el-button type="primary" size="small" @click="doSubmit($event)" v-if="pcInfo.status === 0 && myModulePower.edit" >编辑完成</el-button>
                    <el-button type="primary" size="small" @click="doCheck($event)" v-if="pcInfo.status === 1 && myModulePower.check">审核</el-button>
                    <el-button type="primary" size="small" @click="doDelete($event)" v-if="pcInfo.status === 0 && myModulePower.delete">删除</el-button>
                    <el-button type="primary" size="small" @click="toEdit($event)" v-if="pcInfo.status === 0 && myModulePower.edit">编辑</el-button>
                    <el-button type="primary" size="small" @click="toReEdit($event)" v-if="pcInfo.status === 1 && myModulePower.edit">重新编辑</el-button>
                    <!--<el-button type="primary" size="small" @click="doCancel($event)" v-if="pcInfo.status === 0">取消</el-button>-->
                </el-button-group>
            </div>
            <div class="sl-search-panel">
                <el-row :gutter="20" style="margin-bottom: 10px;line-height: 28px;">
                    <el-col :span="6">
                        <span>调价单号：</span>
                        <span :title="pcInfo.sheetid">{{pcInfo.sheetid}}</span>
                    </el-col>

                    <!--<el-col :span="4">
                        <span>申请人：</span>
                        <span  :title="pcInfo.editor">{{pcInfo.editor}}</span>
                    </el-col>-->

                    <!--<el-col :span="6">
                        <span>申请时间：</span>
                        <span  :title="pcInfo.editdateStr">{{pcInfo.editdateStr}}</span>
                    </el-col>-->

                    <el-col :span="6" style="line-height: 28px;">
                        <span>申请机构：</span>
                        <span :title="pcInfo.fullname || userInfo.fullname">{{pcInfo.fullname || userInfo.fullname}}</span>
                    </el-col>

                    <el-col :span="6">
                        <span>调价类型：</span>
                        <el-radio-group v-model="pcInfo.adjtype" size="small">
                            <el-radio-button label="0" v-if="pcInfo.adjtype===0" disabled>永久</el-radio-button>
                            <el-radio-button label="1" v-if="pcInfo.adjtype===1" disabled>临时</el-radio-button>
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

                <el-row :gutter="20" style="margin-bottom: 10px;">


                    <el-col :span="12" style="line-height: 30px;">
                        <span>调价时段：</span>
                        <span v-if="pcInfo.adjtype === 0" >{{pcInfo.bdateStr||pcInfo.bDateStr}} ~ 永久</span>
                        <span v-else >{{pcInfo.bdateStr||pcInfo.bDateStr}} ~ {{pcInfo.edateStr||pcInfo.eDateStr}}</span>
                    </el-col>

                    <el-col :span="6" style="line-height: 30px;" >
                        <span>调价机构：</span>
                        <!--<span v-if="opType === 0">{{gridOrgVal.rows.length}} 个</span>-->
                        <span :title="pcInfo.groups.length">{{pcInfo.groups.length}} 个</span>
                        <!--<span class="odetail" @click="showOrgDetail()">详情</span>-->
                    </el-col>

                    <el-col :span="6" style="line-height: 30px;">
                        <span style="line-height: 30px;">
                            <el-checkbox v-model="pcInfo.isUpdate" disabled v-show="pcInfo.adjtype === 0">同步调整机构所在店组模板价格</el-checkbox>
                        </span>
                    </el-col>
                </el-row>

                <el-row style="padding-bottom: 10px;">
                    <el-col :span="24">
                        <span style="width: 60px;display: inline-block;text-align: right;">备注：</span>
                        <span :title="pcInfo.notes">{{pcInfo.notes}}</span>
                    </el-col>

                </el-row>

            </div>
        </div>

        <div class="slic-content">
            <div class="sl-content-info">
                <el-tabs type="border-card" style="height: 100%;" v-model="myTabs">
                    <el-tab-pane label="调价商品" name="1" style="height: 100%;">
                        <div style="flex: 1;height: 100%;padding-bottom:10px;">
                            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                                     @rowSelected="doSelected">
                                <template slot="editPrice" scope="prop">
                                    <span class="newPrice">
                                        {{prop.scope.row.newprice}}
                                    </span>

                                </template>

                                <template slot="oldprice" scope="prop">
                                    <span >最低{{prop.scope.row.lowestprice.toFixed(2)}}元, 最高{{prop.scope.row.highestprice.toFixed(2)}}元</span>
                                    <!--<span v-else>{{prop.scope.row.bulkprice}}</span>-->
                                </template>
                            </sl-grid>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="调价机构" name="2" style="height: 100%;">
                        <div style="padding: 10px 0;">
                            <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="treeText">
                            </el-input>
                        </div>

                        <el-tree
                                class="changePrice-tree"
                                :data="treeChangeData"
                                :props="defaultProps"
                                show-checkbox
                                @check-change="selectChangeTree"
                                :filter-node-method="filterNode"
                                highlight-current
                                node-key="eid"
                                :accordion="true"

                                ref="slTree">
                        </el-tree>
                    </el-tab-pane>
                </el-tabs>

            </div>
        </div>

        <div class="sl-search-panel" style="padding: 10px;margin: 0 0 10px 0;">
            <el-row :gutter="20" >
                <el-col :span="4">
                    <span>申请人：</span>
                    <span  :title="pcInfo.editor">{{pcInfo.editor}}</span>
                </el-col>

                <el-col :span="6">
                    <span>申请时间：</span>
                    <span  :title="pcInfo.editdateStr">{{pcInfo.editdateStr}}</span>
                </el-col>

                <el-col :span="6">
                    <span>审核人：</span>
                    <span  :title="pcInfo.editdateStr">{{pcInfo.checker}}</span>
                </el-col>

                <el-col :span="6">
                    <span>审核时间：</span>
                    <span  :title="pcInfo.editdateStr">{{pcInfo.checkdateStr}}</span>
                </el-col>


            </el-row>

        </div>

        <!--审核调价单弹窗-->
        <el-dialog title="审核" :visible.sync="showCheck">
            <p>
                您正在审核售价调整单【{{pcInfo.sheetid}}】，您可以审核也可以否决，审核后商品信息将会变更！
            </p>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="operatePriceChange('approve')" size="small">审核通过</el-button>
                <el-button type="primary" @click="operatePriceChange('veto')" size="small">否决</el-button>
                <el-button @click="showCheck = false" class="dialog-cancel" size="small">取 消</el-button>
            </span>
        </el-dialog>


    </div>


</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import GoodsSelect1 from '../common/goodsSelect1.vue';
    import SlTreeSelectOrg from '@/components/sl-tree-select-org.vue';
    import SlAreaSelect from '@/components/sl-areaSelect/sl-areaSelect2.vue';

    import {mapGetters} from 'vuex';
    import {getOrgList, getMyOrg} from '@/api/basic/org';
    import {getGroupList} from '@/api/basic/group/group';
    import {getGoodsTip} from '@/api/operations/goods';
    import {getPriceChangeGoods, getPriceChangeGoodsList, getPriceChangeOrg, changePriceChange, addPriceChange, submitPriceChange, checkPriceChange, deletePriceChange, reEditPriceChange} from '@/api/operations/priceChange';

    export default {
        components: {
            SlTreeSelectOrg,
            SlAreaSelect,
            Levelbar, SlGrid, SlAutocomplete, GoodsSelect1},
        name: 'priceChangeDetailMan',
        data () {
            return {
                gridCol: [],
                gridVal: {rows: []},
                gridCfg: {
                    selectMode: 'NO', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    noPage: true
                },
                selectedGridData: [],
                gridSelCol: [],
                gridSelVal: {rows: []},
                gridSelCfg: {
                    selectMode: 'NO', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    noPage: true
                },
                selectedSelGridData: [],
                opType: '',
                userRole: '',
                queryKey: '',
                searchStatus: '',
                mydata: '',
                showChange: false,
                showCheck: false,
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
                changeOrg: {shopGroup: ''},
                selectChangeOrg: {shopGroup: ''},
                orgTreeData: [],
                orgTreeProps: {
                    label: 'eName',
                    selected: 'orgid'
                },
                pcInfo: {
                    sheetid: '',
                    editor: '',
                    editdateStr: '',
                    eName: '',
                    status: 0,
                    adjtype: 0,
                    bDate: '',
                    eDate: '',
                    groups: [],
                    isUpdate: false,
                    notes: ''
                },
                goodsList: [],
                autoParams: {
                    goodsid: '商品内码',
                    goodsName: '商品名称',
                    barcode: '条码',
                    bulkprice: '售价'
                },
                myTabs: '1',
                pcOrg: [],
                treeChangeData: [],
                treeText: '',
                defaultProps: {
                    children: 'children',
                    label: 'ename',
                    disabled: 'disabled'
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
        mounted: function () {
            this.$nextTick(function () {
                this.gridCol = [
                    {field: 'goodsid', name: '商品内码', width: '100',fixed: true},
                    {field: 'goodsName', name: '商品名称', width: '150'},
                    {field: 'barcode', name: '条码', width: '150px'},
                    {field: 'spec', name: '销售规格', width: '100'},
                    {field: 'uname', name: '包装单位', width: '100'},
                    {field: 'catLName', name: '所属品类', width: '200'},
                    {field: 'brandName', name: '品牌'},
                    {field: 'bulkprice', name: '建议售价', width: '100'},
                    {field: 'oldprice', name: '原售价', width: '140', template: 'oldprice', fixed: 'right'},
                    {field: 'newprice', name: '新售价', width: '100', template: 'editPrice', fixed: 'right'}
                ]

                Object.assign(this.pcInfo, JSON.parse(sessionStorage.getItem('editPriceChange')));
                this.pcInfo.groups = this.pcInfo.groups ? this.pcInfo.groups : [];
                console.log('this.pcInfo==',this.pcInfo);
                this.$set(this.pcInfo, 'isUpdate', this.pcInfo.adjrang === 2 || this.pcInfo.adjrang === 2);
                this.getPriceChangeInfo();
                this.getPriceChangeOrgInfo();
                this.getOrg();
            })
        },
        methods: {
            // 获取调价单商品列表
            getPriceChangeInfo() {
                const _this = this;
                getPriceChangeGoodsList(this.pcInfo.sheetid).then(res => {
                    console.info(res,'========res 889')
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.gridVal.rows.forEach((item, i) => {
                            _this.$set(item, 'isEditPrice', false)
                        })
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 获取可调价商品列表
            getGoodsList() {
                let opt = {
                    eid: this.userInfo.loginEid,
                    goodsId: -1,
                    goodsName: '',
                    priceEids: this.pcOrgStr || 11000001
                }

                getPriceChangeGoods(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.gridData = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 获取调价单机构列表
            getPriceChangeOrgInfo() {
                const _this = this;
                getPriceChangeOrg(this.pcInfo.sheetid).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.pcOrg = res.result;
                        this.pcInfo.groups = res.result;
                        this.$refs.slTree.setCheckedKeys(res.result);
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 调价机构选择
            selectChangeTree (node, sel) {
//                console.log('node==', this.$refs.slTree.getCheckedNodes())

            },
            // 调价机构树过滤
            filterNode (value, data) {
                if (!value) return true
                return data.ename.indexOf(value) !== -1
            },
            // 获取店铺列表
            getOrg() {
                getOrgList().then((res) => {
                    if(res.retCode === 'SUCCESS') {
                        const _this = this;
                        let firstLevel = [];
                        let secondLevel = [];
                        let thirdLevel = [];
                        let myLevel = 0;

                        res.result.forEach((item, i) => {
                        _this.$set(item, 'disabled', true);
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
console.log('firstLevel==', firstLevel)
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
                                if (item2.eid === this.userInfo.loginEid) {
//                                    item1.children = item2;
                                    cachelist.push(item2);
                                }
                            })
                        });
                    }
                    else if (myLevel === 2) {
                        firstLevel.forEach((item1, i) => {
                            secondLevel.forEach((item2, j) => {
                                thirdLevel.forEach((item3, k) => {
                                    if (item3.eid === this.userInfo.loginEid) {
//                                        item2.children = item3;
//                                        item1.children = item2;
                                        cachelist.push(item3);
                                    }
                                })
                            })
                        });
                    }
                    this.treeChangeData = cachelist;
                    console.log('this.treeChangeData==',this.treeChangeData)
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
                    if(res.retCode === 'SUCCESS') {
                        this.shopGroupList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {

                })
            },
            // 添加商品
            addNewGoods() {
                if(this.gridOrgVal.rows.length === 0) {
                    this.$message('请先选择调价机构！');
                } else if(this.gridOrgVal.rows.length > 0) {
                    this.showChange = true;

                    for(let cg in this.changGoods) {
                        this.changGoods[cg] = '';
                    }

                    this.$set(this.changGoods, 'newprice', 0);
                }

                /*this.showChange = true;

                for(let cg in this.changGoods) {
                    this.changGoods[cg] = '';
                }

                this.$set(this.changGoods, 'newprice', 0);*/



            },
            // 自动补全搜索
            autoQuery(key) {
                let opt = {
                    eid: this.userInfo.loginEid,
                    goodsId: -1,
                    goodsName: key,
                    priceEids: '11000001'
                }

                getPriceChangeGoods(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
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
                this.changGoods = sel;
                this.changGoods.newprice = 0;
            },
            // 移除商品
            removeGoods() {
                const _this = this;
                this.$confirm('确认删除该商品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.selectedGridData.forEach((item, i) => {
                        for(let j = 0; j < _this.gridVal.rows.length; j++) {
                            if(_this.gridVal.rows[j].goodsid === item.goodsid) {
                                _this.gridVal.rows.splice(j, 1);
                                break;
                            }
                        }

                    })
                }).catch()

            },
            // 审核
            doCheck() {
                this.showCheck = true;
            },
            // 审核确认
            operatePriceChange(str) {
                let opType = 0;
                if(str === 'approve') {
                    opType = 2;
                } else if(str === 'veto') {
                    opType = 3;
                }

                checkPriceChange(this.pcInfo.sheetid, opType).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        this.showCheck = false;
                        this.pcInfo.status = opType === 2 ? 2 : 3;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 删除
            doDelete() {
                this.$confirm('确认删除该调价单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePriceChange(this.pcInfo.sheetid).then(res => {
                        if(res.retCode === 'SUCCESS') {
                            this.$message('删除成功！');
                            this.$store.dispatch('delVisitedViews', this.$route.name);
                            this.$router.push({path: '/operations/priceChange'});
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        // this.$message(res.retMsg);
                    })
                }).catch()
            },
            // 提交
            doSubmit() {
                submitPriceChange(this.pcInfo.sheetid).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.$message('提交成功！');
                        this.pcInfo.status = 1;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.$message(res.retMsg);
                })
            },
            // 取消
            doCancel() {
                this.$confirm('确认放弃编辑吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doBack();
                }).catch()
            },
            // 调价商品选择
            doSelected (data) {
                console.log('data==', data);
                this.selectedGridData = data;
            },
            // 更多商品弹窗
            moreGoods() {
                this.getGoodsList();
                this.showGoods = true;
                this.showChange = false;
            },
            // 选择调价商品确定
            doGoodsSure() {
//                this.changGoods.goodsName = this.changGoods.goodsname;
                this.$set(this.changGoods, 'isEditPrice', false)
                this.gridVal.rows.push(JSON.parse(JSON.stringify(this.changGoods)));
                this.showChange = false;
            },
            // 商品选择弹窗
            selectedGoodsDialog(obj) {

                const _this = this;

                if(obj) {
                    obj.forEach((item, i) => {
                        item.newprice = 0;
//                    console.log('obj.goodsname', obj.goodsname)
//                    item.goodsName = item.goodsname;
//                    console.log('obj.goodsname', obj.goodsname)
//                    item.isEditPrice = false;
//                    _this.$set(item, 'goodsName', obj.goodsname)
                        _this.$set(item, 'isEditPrice', false)
                        _this.gridVal.rows.push(item);
                    })
                }

            },

            // 调价机构弹窗-上级机构选择
            selectOrgTree(sel) {
                this.changeOrg.parentid = sel.eid;
            },
            // 调价机构弹窗-省市区选择
            getOrgArea(area) {
                console.log(area);
                this.changeOrg.areaId = area;
            },
            // 调价机构详情
            showOrgDetail() {

                this.showChangeOrg = true;

                    this.getPriceChangeOrgInfo();
                    this.load2 = true;
                    let param = {
                        eid: this.userInfo.loginEid,
                        groupId: -1,
                        parentId: -1,
                        ename: '',
                        areaid: -1,
                        eids: this.pcOrg,
                        userId: this.userInfo.userId,
                        notIn: [],
                        orgType: -1
                    }
                    getMyOrg(param).then((res) => {
                        this.load2 = false;
                        if(res.retCode === 'SUCCESS') {
                            this.gridOrgVal.rows = res.list;

                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
                        this.load2 = false;
                    })


                this.getShopGroup();

            },
            // 调价机构弹窗-表格选择
            doOrgSelected(data) {
                console.log('data==', data);
                this.selectedOrgGridData = data;
            },
            // 调价机构弹窗-查询
            doOrgSearch() {
                this.getPriceChangeOrgInfo();
            },
            // 调价机构弹窗-重置
            doOrgReset() {
                this.changeOrg.shopGroup = -1;
                this.changeOrg.areaId = -1;
                this.changeOrg.parentid = -1;
                this.changeOrg.shopName = '';

            },
            // 调价机构弹窗-添加
            doAddOrgSure() {
                this.getOrg();
                this.showSelectChangeOrg = true;

            },
            // 调价机构弹窗-移除
            doRemoveOrgSure() {
                const _this = this;
                this.$confirm('确认删除该机构吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.selectedOrgGridData.forEach((item, i) => {
                        for(let j = 0; j < _this.gridOrgVal.rows.length; j++) {
                            if(_this.gridOrgVal.rows[j].eid === item.eid) {
                                _this.gridOrgVal.rows.splice(j, 1);
                                break;
                            }
                        }
                    })
                }).catch()
            },
            // 调价机构弹窗-保存
            doOrgSave() {
                const _this = this;
                this.$confirm('修改调价机构会清空调价商品列表，请确认是否修改？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.showChangeOrg = false;
                    sessionStorage.setItem('pcOrgTemp', JSON.stringify(this.gridOrgVal.rows));
                    this.gridVal.rows = [];
                    this.pcOrgStr = '';
                    this.gridOrgVal.rows.forEach((item, i) => {
                        _this.pcOrgStr = _this.pcOrgStr === '' ? item.eid : (_this.pcOrgStr + ',' + item.eid);
                    })
                }).catch()
            },
            // 调价机构弹窗-取消
            doOrgCancel() {
                let pcOrgTemp = JSON.parse(sessionStorage.getItem('pcOrgTemp'));
                if(pcOrgTemp) {
                    this.gridOrgVal.rows = pcOrgTemp;
                } else if(this.opType === 1) {
                    this.getPriceChangeOrgInfo();
                } else if(this.opType === 0) {
                    this.gridOrgVal.rows = []
                };

                this.showChangeOrg = false;
            },
            // 选择调价机构弹窗-查询
            doSelSearch() {
                this.selectChangeOrg.resetOrg = false;
                this.getOrg();
            },
            // 选择调价机构弹窗-重置
            doSelReset() {
                this.selectChangeOrg.shopGroup = '';
                this.selectChangeOrg.areaid = '';
                this.selectChangeOrg.parentid = '';
                this.selectChangeOrg.shopName = '';
//                this.selectChangeOrg.resetOrg = Math.random();
                this.$set(this.selectChangeOrg, 'resetOrg', Math.random());
                console.log('this.selectChangeOrg==', this.selectChangeOrg)
                this.getOrg();
            },
            // 选择调价机构弹窗-确定
            doSelSure() {
                const _this = this;
                console.log(this.gridOrgVal.rows);
                if(this.gridOrgVal.rows.length === 0) {
                    this.selectedSelGridData.forEach((item, i) => {
                        _this.gridOrgVal.rows.push(item);
                    })
                } else {
                    this.selectedSelGridData.forEach((item, i) => {
                        let noExist = true;
                        for(let j = 0; j < _this.gridOrgVal.rows.length; j++) {
                            if(_this.gridOrgVal.rows[j].eid === item.eid) {
                                noExist = false;
                                break;
                            }
                        }
                        if(noExist) {
                            _this.gridOrgVal.rows.push(item);
                        }
                    })
                }

                this.showSelectChangeOrg = false;
            },
            // 选择调价机构弹窗-上级机构选择
            selectSelOrgTree(sel) {
                this.selectChangeOrg.parentid = sel.eid;
            },
            // 选择调价机构弹窗-省市区选择
            getSelOrgArea(area) {
                console.log(area);
                this.selectChangeOrg.areaid = area;
            },
            // 选择调价机构
            doSelSelected (data) {
                console.log('data==', data);
                this.selectedSelGridData = data;
            },
            handleSelSizeChange (size) {
                console.log('size==', size);
                this.gridSelVal.footer.pageSize = size;
                this.getOrg();
            },
            handleSelCurrentChange (page) {
                console.log('page==', page);
                this.gridSelVal.footer.pageNum = page;
                this.getOrg();

            },
            // 新价格编辑按钮
            editprice(obj, id) {
                console.log(obj)
                obj.isEditPrice = true;

            },
            // 新价格编辑input的change
            newPriceChange(event, obj) {
                console.log(event.target.value);
                if(event.target.value === '') {
                    console.log(typeof event.target.value);
                    obj.newprice = '0';
                }

            },
            // 跳转到编辑页
            toEdit() {
                sessionStorage.setItem('editPriceChange', JSON.stringify(this.pcInfo));
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/operations/priceChangeEdit', query: {title: '调价单编辑', opType: 'edit', sheetId: this.pcInfo.sheetid}})
            },
            // 再次编辑
            toReEdit() {
                this.load2 = true;
                reEditPriceChange(this.pcInfo.sheetid).then((res) => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message(res.retMsg);
                        this.pcInfo.status = 0;
                        sessionStorage.setItem('editPriceChange', JSON.stringify(this.pcInfo));
                        this.$store.dispatch('delVisitedViews', this.$route.name);
                        this.$router.push({path: '/operations/priceChangeEdit', query: {title: '调价单编辑', opType: 'edit', sheetId: this.pcInfo.sheetid}})

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    this.load2 = false;
                })
            },
            // 返回
            doBack() {
                this.$store.dispatch('delVisitedViews', this.$route.name);
                this.$router.push({path: '/operations/priceChange'});

            }
        },
        watch: {
            treeText (val) {
                this.$refs.slTree.filter(val);
            }
        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus();
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

.priceChangeDetail{

    .sl-content-info{
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
    
    
    .el-col{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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


			
			.el-dialog--large {
			    width: 70%;
			    max-width: 1000px;
			}
			
	.el-tabs__item {
		height: 35px;
		line-height: 35px;
	}		
     
}



</style>


