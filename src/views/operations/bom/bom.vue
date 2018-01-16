<template>
    <div class="bom sl-page-container flex-col">
        <!-- 组合商品管理: 查询区域 -->
        <div class="sl-search-panel" style="padding-bottom: 0;">
            <div class="slic-input-group sl-search-item" style="width: 330px;">
                <sl-autocomplete
                        ref="goodsAutoModel"
                        :autoParams="goodsAutoModel.autoParams"
                        :dataList="goodsAutoModel.goodsList"
                        slWidth="590"
                        colWidths="20,30,50"
                        displayProp="goodsname"
                        defaultVal="searchModel.goodsname"
                        @querykey="goodsAutoQuery"
                        @doAutoSelected="handleGoodsAutoSelect"
                        prepend="商品"
                        placeholder="请输入商品信息"
                        selectedMode="SINGLE">
                </sl-autocomplete>
            </div>
            <div class="slic-input-group sl-search-item" style="width: 260px;">
                <sl-input :prepend="'组合商品'" placeholder="请输入组合商品名称"
                          :input-val.sync="searchModel.bomGoodsName"></sl-input>
            </div>
            <div class="slic-input-group sl-search-item" style="width: 330px;">
                <sl-autocomplete
                        ref="shopAutoModel"
                        :autoParams="shopAutoModel.autoParams"
                        :dataList="shopAutoModel.shopList"
                        slWidth="400"
                        colWidths="20,30,50"
                        displayProp="ename"
                        defaultVal="searchModel.ename"
                        @querykey="shopAutoQuery"
                        prepend="店铺名称"
                        placeholder="请输入店铺名称"
                        @doAutoSelected="handleShopAutoSelect"
                        selectedMode="SINGLE">
                </sl-autocomplete>
            </div>
            <div class="slic-btn-group sl-search-item">
                <el-button-group>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="search" :disabled="loading">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="reset" :disabled="loading">
                        重置
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <!-- 组合商品管理: 页面操作按钮 -->
        <div class="sl-operator-panel">
            <div class="sl-operator-right">
                <el-button-group>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="addBom" :disabled="loading"
                               v-if="myModulePower.add">
                        新增
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="updateBomListStatus(1)"
                               :disabled="loading" v-if="myModulePower.edit">启用
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="updateBomListStatus(0)"
                               :disabled="loading" v-if="myModulePower.edit">禁用
                    </el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="openSelectShopDialog"
                               :disabled="loading" v-if="myModulePower.edit">复制
                    </el-button>
                    <excel-expimp ref="expImp" :fileName="'组合商品信息'" :header="gridCol" @getResultArr="importData"
                                  @goToExp="doExport" :exportData="expData" :isImport="false" v-if="myModulePower.export"></excel-expimp>
                </el-button-group>
            </div>
        </div>
        <!-- 组合商品管理: 表格列表信息 -->
        <div class="sl-content-panel flex-col overflow-y" v-loading="loading">
            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                     @rowSelected="handleSelectionChange" @pageSizeChange="handleSizeChange"
                     @currentPageChange="handleCurrentChange">
                <template slot="operate" scope="prop">
                    <el-button type="text" size="small" @click="goToBomItem(prop.scope.row, 3)">详情</el-button>
                    <el-button type="text" size="small" @click="updateBomStatus($event, prop.scope.row)" v-if="myModulePower.edit">
                        {{prop.scope.row.status === 0 ? "启用" : "禁用"}}
                    </el-button>
                </template>
            </sl-grid>
        </div>
        <!-- 组合商品管理: 复制选择店铺弹出框 -->
        <el-dialog custom-class="select-shop-dialog" :visible.sync="selectShopDialogVisible"
                   @close="closeSelectShopDialog" :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <span slot="title" class="dialog-header">
                <span>选择店铺</span>
            </span>
            <div style="margin-bottom: 10px;">
                <span style="width: 95px;margin-right: 10px;">店铺名称: </span>
                <sl-input placeholder="请输入店铺名称" :input-val.sync="addSearchShop"
                          style="width: 250px;"></sl-input>
                <el-button type="primary" @click="getShopPageList" size="small">查询</el-button>
            </div>
            <div style="height: calc(100% - 30px);" v-loading="shopDialogLoading">
                <sl-grid :gridCol="shopGridCol" :gridValue="shopGridVal" :gridConfig="shopGridCfg"
                         @rowSelected="handleShopGridSelectionChange" @pageSizeChange="handleShopGridSizeChange"
                         @currentPageChange="handleShopGridCurrentChange">
                    <template slot="fullname" scope="prop">
                        <div>{{prop.scope.row.fullname.substring(0, prop.scope.row.fullname.lastIndexOf('-'))}}</div>
                    </template>
                    <template slot="contact" scope="prop">
                        <div>{{prop.scope.row.contact + ' ' + prop.scope.row.contactMobile}}</div>
                    </template>
                    <template slot="status" scope="prop">
                        <div>
                            {{prop.scope.row.shopStatus === 0 ? "未开业" : prop.scope.row.shopStatus === 1 ? "营业中" : prop.scope.row.shopStatus === 2 ? "休息中" : "已停业"
                            }}
                        </div>
                    </template>
                </sl-grid>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="btn-sure" type="primary"
                           @click="selectShopDialogVisible = false; copyBomList()" :disabled="loading" v-if="myModulePower.edit"
                           title="热键(暂无实现)">保存</el-button>
                <el-button size="small" class="btn-cancel" @click="selectShopDialogVisible = false" :disabled="loading"
                           title="热键(ESC)">取 消(ESC)</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getBomList, updateBomStatus, copyBom} from '@/api/operations/bom/bom';
    import {getGoodsTip} from '@/api/operations/goods';
    import {getORG} from '@/api/basic/group/group';
    import {getPageOrg} from '@/api/basic/org';
    import ExcelExpimp from '@/components/excel-import-export.vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import SlGrid from '@/components/sl-grid';
    import SlInput from '@/components/sl-input.vue';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'bom',
        components: {
            ExcelExpimp,
            SlAutocomplete,
            SlGrid,
            SlInput
        },
        mixins: [ViewBtnsPower],
        data() {
            return {
                // 页面加载进度
                loading: false,
                // 查询参数
                searchModel: {
                    goodsId: -1,
                    bomGoodsName: '',
                    ename: '',
                    shopEid: -1,
                    goodsname: ''
                },
                // 查询参数 => 商品名称自动完成
                goodsAutoModel: {
                    goodsList: [],
                    autoParams: {
                        mygoodsid: '商品内码',
                        goodsname: '商品名称',
                        catLName: '所属品类'
                    }
                },
                // 查询参数 => 店铺名称自动完成
                shopAutoModel: {
                    shopList: [],
                    autoParams: {
                        eid: '店铺编码',
                        ename: '店铺名称',
                        address: '所在地址'
                    }
                },
                // 复制弹出框: 店铺表格配置信息
                shopGridCol: [
                    {field: 'eid', name: '店铺编码', width: '100', fixed: true},
                    {field: 'ename', name: '店铺名称', width: '200', align: 'left'},
                    {field: 'fullname', name: '上级机构', minWidth: '200', template: 'fullname', align: 'left'},
                    {field: 'address', name: '所在地址', minWidth: '200', align: 'left'},
                    {field: 'contact', name: '联系人', width: '200', template: 'contact', align: 'center', isShow: false},
                    {field: 'openDate', name: '开业日期', width: '200', align: 'center', isShow: false},
                    {field: 'closeDate', name: '停业日期', width: '200', align: 'center', isShow: false},
                    {field: 'status', name: '状态', width: '120', template: 'status', align: 'center', fixed: 'right'}
                ],
                shopGridVal: {rows: [], footer: {}},
                shopGridCfg: {
                    selectMode: 'SINGLE', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer'
                },
                shopMultipleSelection: [],
                selectShopDialogVisible: false,
                shopDialogLoading: false,
                addSearchShop: '',
                // 组合商品表格配置信息
                gridCol: [
                    {field: 'ename', name: '店铺名称', width: '200', align: 'center'},
                    {field: 'bomName', name: '组合商品名称', width: '130', align: 'left'},
                    {field: 'bomGoodsName', name: '包含商品', minWidth: '150', align: 'left'},
                    {field: 'oldPrice', name: '原价', width: '100', align: 'right'},
                    {field: 'price', name: '组合价', width: '100', align: 'right'},
                    {field: 'statusStr', name: '状态', width: '120', align: 'center', fixed: 'right'},
                    {field: 'operate', name: '操作', width: '100', template: 'operate', fixed: 'right', isSort: false}
                ],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer'
                },
                multipleSelection: [],// 表格数据选择
                // 组合商品导出功能
                showExp: false,
                expData: [],
            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        methods: {
            // 跳转到组合商品详情页面
            goToBomItem(bomItem, pageType) {
                this.$router.push({path: 'bomDetail', query: {bomId: bomItem.bomId, pageType: pageType}});
            },
            // 获取组合商品列表
            getBomList(isLoading) {
                this.loading = isLoading;
                let goodsId = this.searchModel.goodsId,
                    bomGoodsName = this.searchModel.bomGoodsName,
                    ename = this.searchModel.ename,
                    shopEid = this.searchModel.shopEid,
                    page = {
                        pageNum: this.gridVal.footer.pageNum || 1,
                        pageSize: this.gridVal.footer.pageSize || 25,
                        totalRecord: 0,
                        totalPage: 0,
                    };
                return getBomList(page, goodsId, bomGoodsName, ename, shopEid).then((res) => {
                    console.log('[组合商品管理-列表界面]获取组合商品信息: ', res);
                    this.loading = false;
                    if (res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.gridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                        this.gridVal.rows.map((row) => {
                            row.statusStr = row.status === 0 ? "禁用" : "正常";
                        });
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                })
            },
            // 获取店铺列表
            getShopList(key) {
                let params = {
                    eid: this.userInfo.loginEid,
                    groupId: -1,
                    parentId: -1,
                    ename: key || '',
                    areaid: -1,
                    eids: [],
                    userId: this.userInfo.userId,
                    notIn: [],// 排除的机构
                    orgType: 1
                }
                return getORG(params).then((res) => {
                    if (res.retCode === 'SUCCESS') {
                        this.shopAutoModel.shopList = res.list;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 获取店铺【分页】列表
            getShopPageList() {
                let gridValRowsIds = [];
                this.multipleSelection.forEach(function (item) {
                    gridValRowsIds.push(item.eid)
                })
                let params = {
                    pageNum: this.shopGridVal.footer.pageNum || 1,
                    pageSize: this.shopGridVal.footer.pageSize || 25,
                    eid: -1,
                    groupId: -1,
                    parentId: -1,
                    ename: this.addSearchShop,
                    areaid: -1,
                    eids: [],
                    userId: this.userInfo.userId,
                    notIn: [],// 排除的机构
                    orgType: 1,
                    notingroupid: -1
                }
                return getPageOrg(params).then((res) => {
                    if (res.retCode === 'SUCCESS') {
                        this.shopGridVal.rows = res.result;
                        this.shopGridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 根据查询条件过滤符合条件的商品
            search() {
                this.getBomList(true);
            },
            // 重置查询条件
            reset() {
                this.searchModel = Object.assign({}, this.searchModel, {
                    goodsId: -1,
                    bomGoodsName: '',
                    ename: '',
                    goodsname: ''
                });
                this.$refs['goodsAutoModel'].clearItem(0);
                this.$refs['shopAutoModel'].clearItem(0);
                this.search();
            },
            // 商品名称自动补全搜索
            goodsAutoQuery(key) {
                getGoodsTip(key).then(res => {
                    if (res.retCode === 'SUCCESS') {
                        this.goodsAutoModel.goodsList = res.result;
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 商品名称自动补全选中
            handleGoodsAutoSelect(sel) {
                this.searchModel.goodsId = sel.goodsid;
            },
            // 店铺名称自动补全搜索
            shopAutoQuery(key) {
                this.getShopList(key);
            },
            // 店铺名称自动补全选中
            handleShopAutoSelect(sel) {
                this.searchModel.ename = sel.ename;
                this.searchModel.shopEid = sel.eid;
            },
            // 新增组合商品
            addBom() {
                this.goToBomItem({bomId: -1}, 1);
            },
            // 批量组合商品禁用  0-禁用  1-启用
            updateBomListStatus(type) {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: `请选择商品`,
                        type: 'error'
                    });
                    return;
                }
                this.loading = true;
                let bomIds = this.multipleSelection.map((item) => {
                    return item.bomId;
                }).join(',');
                return updateBomStatus(bomIds, type).then((res) => {
                    console.log('[组合商品管理-列表界面]批量启用、禁用操作: ', res);
                    this.loading = false;
                    this.$message({
                        message: `操作成功`,
                        type: 'success'
                    });
                    this.getBomList(false);
                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                })
            },
            // 单个组合商品启用、禁用
            updateBomStatus(event, bomInfo) {
                let _this = this,
                    type = bomInfo.status === 0 ? 1 : 0,
                    _updateBomStatus = function (bomId, status) {
                        return updateBomStatus(bomId + '', status).then((res) => {
                            console.log('[组合商品管理-列表界面]启用禁用操作: ', res);
                            _this.$message({
                                message: type === 0 ? `禁用成功` : `启用成功`,
                                type: 'success'
                            });
                            _this.search();
                        }).catch((err) => {
                            console.log(err);
                        })
                    };
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
            // 【复制弹出框】打开选择店铺弹出框
            openSelectShopDialog() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: `请选择商品`,
                        type: 'error'
                    });
                    return;
                }
                ;
                this.addSearchShop = '';
                this.selectShopDialogVisible = true;
                this.getShopPageList();
            },
            // 【复制弹出框】关闭选择店铺弹出框
            closeSelectShopDialog() {

            },
            // 【复制弹出框】批量组合商品复制
            copyBomList() {
                let bomIds = this.multipleSelection.map((item) => {
                    return item.bomId;
                }).join(',');
                return copyBom(bomIds, this.shopMultipleSelection.eid).then((res) => {
                    console.log('[组合商品管理-列表界面]批量复制操作: ', res);
                    this.$message({
                        message: `复制成功`,
                        type: 'success'
                    });
                    this.getBomList();
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 【复制弹出框】处理表格数据选择
            handleShopGridSelectionChange(val) {
                this.shopMultipleSelection = val;
            },
            // 【复制弹出框】处理表格数据分页大小
            handleShopGridSizeChange(val) {
                this.shopGridVal.footer.pageSize = val;
                this.getShopPageList();
            },
            // 【复制弹出框】处理表格数据当期页
            handleShopGridCurrentChange(val) {
                this.shopGridVal.footer.pageNum = val;
                this.getShopPageList();
            },
            // 【组合商品管理列表】处理表格数据选择
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 【组合商品管理列表】处理表格数据分页大小
            handleSizeChange(val) {
                this.gridVal.footer.pageSize = val;
                this.search();
            },
            // 【组合商品管理列表】处理表格数据当期页
            handleCurrentChange(val) {
                this.gridVal.footer.pageNum = val;
                this.search();
            },
            // 导入
            importData(data) {
                console.log('importData==', data);
                this.gridVal.rows = this.gridVal.rows.concat(data);
            },
            // 导出
            doExport(str) {
                let _this = this,
                    _doExport = function (expData) {
                        console.log("组合商品数据导出:", expData);
                        _this.$refs['expImp'].doExport();
                        _this.showExp = false;
                    }
                this.expData = [];
                if (str === 'current') {
                    this.expData = this.gridVal.rows;
                    _doExport(this.expData);
                } else if (str === 'select') {
                    this.expData = this.multipleSelection;
                    _doExport(this.expData);
                } else if (str === 'all') {
                    let goodsId = this.searchModel.goodsId,
                        bomGoodsName = this.searchModel.bomGoodsName,
                        ename = this.searchModel.ename,
                        page = {
                            pageNum: 1,
                            pageSize: this.gridVal.footer.totalRecord,
                            totalRecord: 0,
                            totalPage: 0,
                        };
                    getBomList(page, goodsId, bomGoodsName, ename).then((res) => {
                        if (res.retCode === 'SUCCESS') {
                            this.expData = res.result;
                            this.expData.map((row) => {
                                row.statusStr = row.status === 0 ? "禁用" : "正常";
                            });
                            _doExport(this.expData);
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch((err) => {
                        console.log(err);
                        this.loading = false;
                    });
                }
            },
            // 组件初始化
            init(){
                this.search();
            }
        },
        activated: function () {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .bom {
        .sl-search-panel {

        }

        .select-shop-dialog {
            width: 760px;
        }

        .el-dialog--tiny {
            width: 30%;
            max-width: 480px;
            min-width: 450px;
        }
    }
</style>