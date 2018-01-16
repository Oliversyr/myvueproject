<template>
    <div class="shop sl-page-container flex-col">
        <div class="sl-search-panel" style="padding-bottom: 0;">
            <div class="slic-input-group sl-search-item" style="width: 300px;">
                <sl-input :prepend="'店铺名称'" placeholder="请输入店铺名称"
                          :input-val.sync="searchModel.eName"></sl-input>
            </div>
            <sl-select prepend="所属店组" class="sl-search-item" style="width: 270px;">
                <el-select v-model="searchModel.belongGroup.value" placeholder="请输入或选择店组" :default-first-option="true"
                           clearable
                           filterable
                           slot="ELSelect" size="small">
                    <el-option
                            v-for="item in searchModel.belongGroup.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </sl-select>
            <sl-select prepend="状态" class="sl-search-item" style="width: 165px;">
                <el-select v-model="searchModel.shopStatus" placeholder="请选择" :default-first-option="true" filterable
                           slot="ELSelect" size="small" style="width: 180px;">
                    <el-option label="全部" :value="-1"></el-option>
                    <el-option label="未开业" :value="0"></el-option>
                    <el-option label="营业中" :value="1"></el-option>
                    <el-option label="休息中" :value="2"></el-option>
                    <el-option label="已停业" :value="3"></el-option>
                </el-select>
            </sl-select>
            <div class="slic-btn-group sl-search-item" style="vertical-align: baseline;">
                <el-button-group>
                    <el-button size="small" type="primary" class="slic-btn-theme3" @click="search" :disabled="loading">
                        查询
                    </el-button>
                    <el-button size="small" type="primary" class="slic-btn-theme3" @click="reset" :disabled="loading">
                        重置
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <div class="sl-operator-panel ">
            <div class="sl-operator-right">
                <el-button-group>
                    <el-button size="small" type="primary" class="shop-status-open slic-btn-theme3"
                               @click="updateShopStatus(1)" :disabled="loading" v-if="myModulePower.edit">开业
                    </el-button>
                    <el-button size="small" type="primary" class="shop-status-closed slic-btn-theme3"
                               @click="updateShopStatus(3)" :disabled="loading" v-if="myModulePower.edit">停业
                    </el-button>
                    <el-button size="small" type="primary" class="shop-status-opening slic-btn-theme3"
                               @click="updateShopStatus(2)" :disabled="loading" v-if="myModulePower.edit">
                        营业
                    </el-button>
                    <el-button size="small" type="primary" class="shop-status-sleep slic-btn-theme3"
                               @click="updateShopStatus(4)" :disabled="loading" v-if="myModulePower.edit">休息
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <div class="sl-content-panel flex-col overflow-y pt-xsmall pb-lxs" v-loading="loading">
            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                     @rowSelected="handleSelectionChange" @pageSizeChange="handleSizeChange"
                     @currentPageChange="handleCurrentChange">
                <template slot="eid" scope="prop">
                    <el-button @click="goToShopItem(prop.scope.row, 3)" type="text" size="small">{{ prop.scope.row.eid }}
                    </el-button>
                </template>
                <template slot="fullname" scope="prop">
                    <div>{{prop.scope.row.fullname.substring(0, prop.scope.row.fullname.lastIndexOf('-'))}}</div>
                </template>
                <template slot="contact" scope="prop">
                    <div>{{prop.scope.row.contact + ' ' + prop.scope.row.contactMobile}}</div>
                </template>
                <template slot="status" scope="prop">
                    <div>
                        {{prop.scope.row.status === 0 ? "未开业" : prop.scope.row.status === 1 ? "营业中" : prop.scope.row.status === 2 ? "休息中" : "已停业"
                        }}
                    </div>
                </template>
                <template slot="operate" scope="prop">
                    <el-button @click="goToShopItem(prop.scope.row, 2)" type="text" size="small">编辑</el-button>
                </template>
            </sl-grid>
        </div>
        <!-- 开业/停业弹出框 -->
        <el-dialog :visible.sync="shopStatusDialog.visible" size="tiny">
            <span slot="title" class="dialog-header">
                <span class="animated fadeIn">{{ shopStatusDialog.title }}</span>
            </span>
            <div class="slic-row">
                <div class="slic-row-item mt-xsmall">
                    <span class="til animated fadeIn" style="width: 120px;">{{ shopStatusDialog.dateLabelTitle
                        }}：</span>
                    <span class="con" style="width: calc(100% - 120px);">
                        <el-date-picker
                                v-model="shopStatusDialog.dateValue"
                                :default-value="shopStatusDialog.dateValue"
                                :picker-options="shopStatusDialog.datePickerOptions"
                                size="small"
                                align="right"
                                type="date">
                        </el-date-picker>
                    </span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="btn-sure animated fadeIn" size="small" type="primary"
                           @click="shopStatusDialog.visible = false;handleShopStatusDialog()"
                           title="热键(暂无实现)">{{ shopStatusDialog.btnLabelTitle }}
                </el-button>
                <el-button class="btn-cancel" size="small" @click="shopStatusDialog.visible = false"
                           title="热键(ESC)">取 消(ESC)
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getShopList, updateShopStatus} from '@/api/operations/shop/shop';
    import {getGroupList} from '@/api/basic/group/group';
    import {sortBy} from 'utils/index';
    import  myDate from 'utils/date';
    import SlGrid from '@/components/sl-grid';
    import SlInput from '@/components/sl-input.vue';
    import ViewPage from '@/mixins/viewPage';
    import ViewBtnsPower from '@/mixins/viewBtnsPower';

    export default {
        name: 'Shop',
        components: {
            SlGrid,
            SlInput
        },
        mixins: [ViewPage, ViewBtnsPower],
        data() {
            return {
                // 页面加载参数
                loading: false,
                // 查询参数
                searchModel: {
                    eName: '',
                    shopStatus: -1,
                    belongGroup: {
                        value: '',
                        options: [],
                        list: [],
                        loading: false
                    }
                },
                // 店铺状态弹出框
                shopStatusDialog: {
                    visible: false,
                    title: '',
                    dateLabelTitle: '',
                    btnLabelTitle: '',
                    dateValue: new Date(),
                    datePickerOptions: {
                        disabledDate(time) {
                            return time.getTime() <= new Date() - 3600 * 1000 * 24;
                        },
                        shortcuts: [{
                            text: '今天',
                            onClick(picker) {
                                picker.$emit('pick', new Date());
                            }
                        }, {
                            text: '明天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        }, {
                            text: '后天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
                                picker.$emit('pick', date);
                            }
                        }]
                    }
                },
                // 表格相关
                gridCol: [
                    {field: 'eid', name: '店铺编码', width: '100', template: 'eid', fixed: true},
                    {field: 'ename', name: '店铺名称', width: '200', align: 'left'},
                    {field: 'fullname', name: '上级机构', minWidth: '200', template: 'fullname', align: 'left'},
                    {field: 'address', name: '所在地址', minWidth: '200', align: 'left'},
                    {field: 'contact', name: '联系人', width: '200', template: 'contact', align: 'center'},
                    {field: 'openDate', name: '开业日期', width: '200', align: 'center'},
                    {field: 'closeDate', name: '停业日期', width: '200', align: 'center'},
                    {field: 'status', name: '状态', width: '120', template: 'status', align: 'center', fixed: 'right'},
                    {field: 'operate', name: '操作', width: '80', template: 'operate', fixed: 'right', align: 'center', isSort: false}
                ],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true,
                    height: 'customer'
                },
                multipleSelection: [],// 表格数据选择
            }
        },
        computed: {},
        methods: {
            // 跳转到店铺详情页面
            goToShopItem(shopInfo, pageType) {
                this.$router.push({path: 'shopInfo', query: {shopId: shopInfo.eid, pageType: pageType}});
            },
            // 获取店铺列表
            getShopList() {
                this.loading = true;
                let ename = this.searchModel.eName,
                    status = this.searchModel.shopStatus,
                    groupId = !this.searchModel.belongGroup.value ? -1 : this.searchModel.belongGroup.value,
                    page = {
                        pageNum: this.gridVal.footer.pageNum || 1,
                        pageSize: this.gridVal.footer.pageSize || 25,
                        totalRecord: 0,
                        totalPage: 0,
                    };
                return getShopList(page, ename, status, groupId).then((res) => {
                    this.loading = false;
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.gridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                })
            },
            // 根据查询条件过滤符合条件的商品
            search() {
                this.getShopList();
            },
            // 重置查询条件
            reset() {
                this.searchModel.eName = '';
                this.searchModel.shopStatus = -1;
                this.searchModel.belongGroup.value = '';
                this.search();
            },
            // 获取店组列表
            getGroupList() {
                let keyValue = '',
                    status = -1;
                return getGroupList({keyValue, status}).then((res) => {
                    let data = res.result.sort(sortBy('storeNum', false))
                    this.searchModel.belongGroup.options = data.map(item => {
                        return {value: item.groupId, label: item.groupName};
                    });
                    console.log('[店铺管理-列表界面-查询字段]获取获取店组列表: ', this.searchModel.belongGroup.options);
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 开业，停业，营业，休息操作
            _updateShopStatus(eids, status, operateDate) {
                this.loading = true;
                return updateShopStatus(eids, status, operateDate).then((res) => {
                    if (!!res && !!res.retCode && res.retCode === 'SUCCESS') {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.retMsg || '操作失败',
                            type: 'error'
                        });
                    }
                    this.loading = false;
                    this.search();
                }).catch((err) => {
                    console.log(err);
                    this.loading = false;
                })
            },
            updateShopStatus(status) {
                // 店铺列表数据状态 0：未开业 1：正在营业 2：营业结束  3：店铺已关闭
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: `请选择店铺再进行操作`,
                        type: 'error'
                    });
                    return;
                }
                let eids = this.multipleSelection.map((item) => {
                    return item.eid;
                }).join(',');
                switch (status) {
                    case 1:
                        var isReturn = this.multipleSelection.some((item) => {
                            return item.status != 0;
                        })
                        if (isReturn) {
                            this.$message({
                                message: `只对'未开业'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this.shopStatusDialog.visible = true;
                        this.shopStatusDialog.title = "店铺开业";
                        this.shopStatusDialog.dateLabelTitle = "开业日期";
                        this.shopStatusDialog.btnLabelTitle = "开业";
                        break;
                    case 2:
                        isReturn = this.multipleSelection.some((item) => {
                            return item.status != 2;
                        })
                        if (isReturn) {
                            this.$message({
                                message: `只对'休息中'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this._updateShopStatus(eids, 1, myDate.formatDate(new Date()));
                        break;
                    case 3:
                        isReturn = this.multipleSelection.some((item) => {
                            return item.status != 1 && item.status != 2;
                        })
                        if (isReturn) {
                            this.$message({
                                message: `只对'营业中'或者'休息中'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this.$confirm('停业为不可逆状态，是否继续?', '提示', {
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                            this.shopStatusDialog.visible = true;
                            this.shopStatusDialog.title = "店铺停业";
                            this.shopStatusDialog.dateLabelTitle = "停业日期";
                            this.shopStatusDialog.btnLabelTitle = "停业";
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case 4:
                        isReturn = this.multipleSelection.some((item) => {
                            return item.status != 1;
                        })
                        if (isReturn) {
                            this.$message({
                                message: `只对'营业中'状态的店铺有效`,
                                type: 'error'
                            });
                            return;
                        }
                        this._updateShopStatus(eids, status, myDate.formatDate(new Date()));
                        break;
                    default:
                        break;
                }
            },
            // 开业
            handleShopStatusDialog() {
                let status = -1,
                    eids = this.multipleSelection.map((item) => {
                        return item.eid;
                    }).join(',');
                this.shopStatusDialog.btnLabelTitle === "开业" ? status = 1 : status = 3;
                this._updateShopStatus(eids, status, myDate.formatDate(this.shopStatusDialog.dateValue));
            },
            // 处理表格数据选择
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 处理表格数据分页大小
            handleSizeChange(size) {
                this.gridVal.footer.pageSize = size;
                this.search();
            },
            // 处理表格数据当期页
            handleCurrentChange(page) {
                this.gridVal.footer.pageNum = page;
                this.search();
            },
            // 组件初始化
            init(){
                if(!this.myModulePower.edit){
                    this.hideOpCol(3, this.gridCol, this.gridCol.length - 1);
                }
                this.getShopList();
                this.getGroupList();
            }
        },
        activated: function () {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .shop {
		.el-dialog--tiny {
			width: 480px;
		}
    }
</style>