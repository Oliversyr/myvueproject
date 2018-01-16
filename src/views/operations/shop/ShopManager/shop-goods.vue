<template>
    <div class="shop-goods sl-page-container flex-col pst-rl">
        <!-- 店铺商品管理: 面包屑 -->
        <levelbar :levelList="levelList">
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-店铺管理-店铺商品】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以查看到所有的店铺并对其进行管理。</p>
                        <p>1. 店铺列表，列示店铺信息；</p>
                        <p>2. 店铺资料维护；</p>
                        <p>3. 店铺商品维护，包括经营商品和价格；</p>
                        <p>4. 店铺设备维护；</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <!-- 店铺商品管理: 店铺可折叠信息 -->
        <div class="sl-panel">
            <div class="sl-item-panel">
                <collapsible-info :shopInfo="shopInfo"></collapsible-info>
            </div>
        </div>
        <!-- 店铺商品管理: 页面操作按钮 -->
        <div class="sl-operator-panel">
            <div class="sl-operator-left">
                <el-button size="small" class="back slic-btn-theme3" @click="goToShopItem">
                    <icon-svg icon-class="fanhui"></icon-svg>
                    返回
                </el-button>
            </div>
            <div class="sl-operator-right">
                <el-button-group>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="addGoods" v-if="myModulePower.edit">添加商品</el-button>
                    <el-button type="primary" size="small" class="slic-btn-theme3" @click="updateShopGoodsStatus(0, 1)" v-if="myModulePower.edit">
                        停止销售
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <!-- 店铺商品管理: 商品信息 -->
        <div class="sl-content-panel flex-col overflow-y">
            <div class="sl-search-panel mb-xsmall">
                <el-row :gutter="20">
                    <el-col :span="6" class="first-el-col">
                        <sl-input :prepend="'商品名称'" placeholder="请输入商品名称"
                                  :input-val.sync="searchModel.goodsName"></sl-input>
                    </el-col>

                    <el-col :span="6">
                        <sl-select :prepend="'品牌'" style="width: 100%;">
                            <el-select v-model="searchModel.brandId" placeholder="请选择品牌" size="small" slot="ELSelect"
                                       filterable
                                       style="width: 100%;">
                                <el-option :key="-1" :label="'全部'" :value="-1"></el-option>
                                <el-option v-for="brand in searchModel.brandList" :key="brand.brandId"
                                           :label="brand.brandName"
                                           :value="brand.brandId"></el-option>
                            </el-select>
                        </sl-select>
                    </el-col>

                    <el-col :span="6">
                        <sl-tree-select-cat :showPrepend="true" @selectedNode="selectCatTree"
                                            :slTreeProps="searchModel.catProps" :isShowThird="true"
                                            :resetCheck="searchModel.resetCat">
                            <template slot="prepend">品类</template>
                        </sl-tree-select-cat>
                    </el-col>

                    <el-col :span="6">
                        <el-button-group>
                            <el-button type="primary" size="small" @click="search()">查询</el-button>
                            <el-button type="primary" size="small" @click="reset()">重置</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
            </div>
            <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                     @rowSelected="handleSelectionChange" @pageSizeChange="handleSizeChange"
                     @currentPageChange="handleCurrentChange" @cellMouseEnter="cellMouseEnter"
                     @cellMouseLeave="cellMouseLeave" v-loading="loading">
                <template slot="eid" scope="prop">
                    <el-button @click="goToShopItem(prop.scope.row, 3)" type="text" size="small">{{ prop.scope.row.eid
                        }}
                    </el-button>
                </template>
                <template slot="bulkprice" scope="prop">
                    <div class="label">
                        {{prop.scope.row.bulkprice}}
                        <i class="el-icon-edit" @click.stop="editCell" v-show="myModulePower.edit"></i>
                    </div>
                    <div class="edit">
                        <el-input size="small" placeholder="请输入内容" v-model="prop.scope.row.bulkprice" 
                                  @blur="cellInputBlur();handleCellChangeClick(prop.scope.row, 4)" 
                                  v-input-validate.price="{ model: prop.scope.row, key: 'bulkprice' }" 
                                  @focus="handleFocusCell"
                                  autofocus></el-input>
                    </div>
                </template>
                <template slot="safeqty" scope="prop">
                    <div class="label">
                        {{prop.scope.row.safeqty}}
                        <i class="el-icon-edit" @click.stop="editCell" v-show="myModulePower.edit"></i>
                    </div>
                    <div class="edit">
                        <el-input size="small" placeholder="请输入内容" v-model="prop.scope.row.safeqty" 
                                  @blur="cellInputBlur();handleCellChangeClick(prop.scope.row, 3)" 
                                  v-input-validate.integer="{ model: prop.scope.row, key: 'safeqty' }"  
                                  @focus="handleFocusCell"
                                  autofocus></el-input>
                    </div>
                </template>
                <template slot="status" scope="prop">
                        <span>
                            {{
                            prop.scope.row.status === 0 ? "停止销售" :
                                prop.scope.row.status === 1 ? "正常" : " "
                            }}
                        </span>
                </template>
                <template slot="operate" scope="prop">
                    <el-button type="text" size="small" v-if="prop.scope.row.status === 1"
                               @click="updateShopGoodsStatus(0, 2, prop.scope.row)">停止销售
                    </el-button>
                    <el-button type="text" size="small" v-else @click="updateShopGoodsStatus(1, 2, prop.scope.row)">
                        恢复销售
                    </el-button>
                </template>
            </sl-grid>
        </div>
        <!-- 店铺商品管理: 添加商品弹出框 -->
        <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible" size="small" class="add-goods-dialog"
                   :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <div style="margin-bottom: 10px;">
                <span style="width: 95px;margin-right: 10px;">商品名称: </span>
                <sl-input placeholder="请输入商品名称、内码、助记码" :input-val.sync="addSearchGoods"
                          style="width: 250px;"></sl-input>
                <el-button type="primary" @click="getGoods" size="small">查询</el-button>
            </div>
            <div style="height: calc(100% - 30px);" v-loading="goodsDialogLoading">
                <sl-grid :gridCol="gridColNewGoods" :gridValue="gridValNewGoods" :gridConfig="gridCfgNewGoods"
                         @rowSelected="doSelectedNewGoods" @pageSizeChange="handleSizeChangeNewGoods"
                         @currentPageChange="handleCurrentChangeNewGoods">
                    <template slot="bulkprice" scope="prop">
                        <el-input size="small" placeholder="请输入售价" v-model="prop.scope.row.bulkprice" 
                                  v-input-validate.price="{ model: prop.scope.row, key: 'bulkprice' }"></el-input>
                    </template>
                    <template slot="safeqty" scope="prop">
                        <el-input size="small" placeholder="请输入预警库存数" v-model="prop.scope.row.safeqty" 
                          v-input-validate.integer="{ model: prop.scope.row, key: 'safeqty' }" ></el-input>
                    </template>
                </sl-grid>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small"
                           @click="addGoodsDialogVisible = false;saveGoods(1)">添加</el-button>
                <el-button type="primary" size="small" @click="saveGoods(2)">继续添加</el-button>
                <el-button @click="addGoodsDialogVisible = false" class="dialog-cancel"
                           size="small">取消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
// 公共库，组件
import SlAutocomplete from "@/components/sl-autocomplete.vue";
import SlTreeSelectCat from "@/components/sl-tree-select-cat.vue";
import RouterMixins from "@/mixins/router";
import ViewPage from "@/mixins/viewPage";
import ViewBtnsPower from "@/mixins/viewBtnsPower";
import Levelbar from "views/layout/Levelbar";
import SlGrid from "@/components/sl-grid";
import SlInput from "@/components/sl-input.vue";
// 工具库
import doc from "utils/doc";
import {
  validateGTFloatingNumber,
  validateSignlessInteger,
  validateNonnegativeIntegers,
  validateInputInt,
  validateInputPrice
} from "utils/validate";
import isFloat from "validator/lib/isFloat";
// API库
import {
  getShopGoodsList,
  operateShopGoods,
  shopGoodsBatchOperate,
  updateShopGoodsStatus
} from "@/api/operations/shop/shop";
import { getGoodsTip, getGoodsList } from "@/api/operations/goods";
import { getBrandList } from "@/api/basic/brand";
// 业务组件
import CollapsibleInfo from "../ShopInfo/collapsible-info";

export default {
  name: "shop-goods",
  components: {
    Levelbar,
    SlGrid,
    SlInput,
    CollapsibleInfo,
    SlAutocomplete,
    SlTreeSelectCat
  },
  mixins: [RouterMixins, ViewPage, ViewBtnsPower],
  data() {
    return {
      loading: false,
      // 自定义面包屑列表
      levelList: ["运营应用", "店铺管理", "店铺商品"],
      // 查询参数模型数据
      searchModel: {
        goodsName: "",
        catId: -1,
        resetCat: false,
        catProps: {
          label: "catName",
          children: "lowerCatList",
          key: "catId"
        },
        brandId: -1,
        brandList: [],
        status: -1
      },
      // 店铺信息
      shopInfo: {},
      // 【添加商品】弹出框配置信息
      addGoodsDialogVisible: false,
      goodsDialogLoading: false,
      addSearchGoods: "",
      gridColNewGoods: [
        { field: "mygoodsid", name: "商品内码", width: "100px" },
        { field: "goodsname", name: "商品名称", width: "150px", align: "left" },
        { field: "brandName", name: "品牌", width: "120px" },
        { field: "catLName", name: "所属品类", width: "200px" },
        {
          field: "bulkprice",
          name: "售价",
          width: "100px",
          fixed: "right",
          template: "bulkprice"
        },
        {
          field: "safeqty",
          name: "预警库存数",
          width: "150px",
          fixed: "right",
          template: "safeqty"
        }
      ],
      gridValNewGoods: { rows: [], footer: {} },
      gridCfgNewGoods: {
        selectMode: "MULT", // 'MULT'--多选，'SINGLE'--单选
        frozen: true,
        height: "232"
      },
      selectedGridDataNewGoods: [],
      // 【店铺商品】表格配置信息
      gridCol: [
        {
          field: "goodsid",
          name: "商品编码",
          width: "100",
          align: "center",
          fixed: true
        },
        { field: "goodsname", name: "商品名称", width: "200", align: "left" },
        { field: "brandName", name: "品牌", width: "200", align: "center" },
        { field: "catLName", name: "分类", width: "200", align: "center" },
        { field: "specOne", name: "规格1", width: "120", align: "center" },
        { field: "specTwo", name: "规格2", width: "120", align: "center" },
        { field: "uname", name: "销售单位", width: "120", align: "center" },
        {
          field: "bulkprice",
          name: "售价",
          width: "100px",
          fixed: "right",
          template: "bulkprice"
        },
        {
          field: "safeqty",
          name: "预警库存数",
          width: "150px",
          fixed: "right",
          template: "safeqty"
        },
        {
          field: "status",
          name: "状态",
          width: "120",
          template: "status",
          align: "center",
          fixed: "right"
        },
        {
          field: "operate",
          name: "操作",
          width: "100",
          template: "operate",
          fixed: "right",
          isSort: false
        }
      ],
      gridVal: { rows: [], footer: {} },
      gridCfg: {
        selectMode: "MULT", // 'MULT'--多选，'SINGLE'--单选
        frozen: true,
        height: "customer"
      },
      multipleSelection: [] // 表格数据选择
    };
  },
  methods: {
    // 跳转到店铺详情界面
    goToShopItem() {
      this.$router.push({
        path: "shopInfo",
        query: {
          shopId: this.shopInfo.eid,
          pageType: this.shopInfo.pageType || 3
        }
      });
    },
    // 获取【店铺】经营商品列表
    getShopGoodsList() {
      this.loading = true;
      let params = {
          shopEid: this.shopInfo.eid,
          goodsName: this.searchModel.goodsName,
          brandId: this.searchModel.brandId,
          catId: this.searchModel.catId,
          status: this.searchModel.status,
          goodsId: -1
        },
        page = {
          pageNum: this.gridVal.footer.pageNum || 1,
          pageSize: this.gridVal.footer.pageSize || 25,
          totalRecord: 0,
          totalPage: 0
        };
      return getShopGoodsList(page, params)
        .then(res => {
          console.log("[店铺管理-店铺详情-商品管理]后台返回的店铺商品信息: ", res);
          this.loading = false;
          if (res.retCode === "SUCCESS") {
            this.gridVal.rows = res.result;
            this.gridVal.footer = {
              pageNum: res.pageNum,
              pageSize: res.pageSize,
              totalRecord: res.totalRecord
            };
          } else {
            this.$message(res.retMsg);
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 获取商品列表
    getGoods() {
      this.goodsDialogLoading = true;
      let opt = {
        params: {
          goodsName: this.addSearchGoods,
          notInShop: this.shopInfo.eid
        },
        pageNum: this.gridValNewGoods.footer.pageNum || 1,
        pageSize: this.gridValNewGoods.footer.pageSize || 25,
        totalRecord: 0,
        totalPage: 0
      };
      getGoodsList(opt)
        .then(res => {
          this.goodsDialogLoading = false;
          if (res.retCode === "SUCCESS") {
            this.gridValNewGoods.rows = res.result;
            console.log("DEBUG", res.result);
            this.gridValNewGoods.footer = {
              pageNum: res.pageNum,
              pageSize: res.pageSize,
              totalRecord: res.totalRecord
            };
            this.gridValNewGoods.rows.forEach((item, i) => {
              this.$set(item, "MYSTATUS", item.status === 1 ? "正常" : "禁用");
            });
          } else {
            this.$message(res.retMsg);
          }
        })
        .catch(err => {
          this.goodsDialogLoading = false;
        });
    },
    // 获取品牌列表
    getBrand() {
      let opt = {
        brandName: "",
        status: -1
      };
      getBrandList(opt)
        .then(res => {
          this.searchModel.brandList = res.result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 品类树选中
    selectCatTree(val) {
      this.searchModel.catId = val.catId;
      this.searchModel.resetCat = false;
    },
    // 根据查询参数进行查询刷新
    search() {
      return this.getShopGoodsList();
    },
    // 重置查询条件
    reset() {
      this.searchModel = Object.assign({}, this.searchModel, {
        goodsName: "",
        brandId: "",
        catId: "",
        resetCat: true
      });
      this.search();
    },
    // 停止、恢复销售 status 状态， type 1->批量；2->单个
    updateShopGoodsStatus(status, type, data) {
      if (!this.multipleSelection.length && type === 1) {
        this.$message({
          message: `请选择多个商品`,
          type: "error"
        });
        return;
      }
      var goodsIds = "";
      let shopEid = this.shopInfo.eid;
      if (type === 1) {
        goodsIds = this.multipleSelection
          .map(item => {
            return item.goodsid;
          })
          .join(",");
      } else {
        goodsIds = data.goodsid + "";
      }
      return updateShopGoodsStatus(shopEid, goodsIds, status)
        .then(res => {
          console.log("[店铺管理-店铺详情-商品管理]停止/恢复销售操作: ", res);
          this.$message({
            message: `操作成功`,
            type: "success"
          });
          this.search();
        })
        .catch(err => {
          console.log(err);
        });
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
    // 弹出"添加商品"选择框
    addGoods() {
      this.addGoodsDialogVisible = true;
      this.getGoods();
    },
    // 添加商品表格选中
    doSelectedNewGoods(data) {
      this.selectedGridDataNewGoods = data;
    },
    // 添加商品表格pageSize改变
    handleSizeChangeNewGoods(size) {
      this.gridValNewGoods.footer.pageSize = size;
      this.getGoods();
    },
    // 添加商品页码改变
    handleCurrentChangeNewGoods(page) {
      this.gridValNewGoods.footer.pageNum = page;
      this.getGoods();
    },
    // 校验表格售价的修改
    handleGridBulkPriceChange(row) {
      if (!validateGTFloatingNumber(row.bulkprice + "")) {
        this.$message({
          message: `请输入合法售价`,
          type: "error"
        });
        return false;
      }
      return true;
    },
    // 校验表格安全库存的修改
    handleGridSafeQtyChange(row) {
      if (row.safeqty === null) return true;
      if (!validateNonnegativeIntegers(row.safeqty + "")) {
        this.$message({
          message: `请输入合法安全库存`,
          type: "error"
        });
        return false;
      }
      return true;
    },
    // 保存添加的商品 opType 1=> 添加 2=> 继续添加
    saveGoods(opType) {
      // 是否选择商品数据
      if (!this.selectedGridDataNewGoods.length) {
        this.$message({
          message: `请选择商品`,
          type: "error"
        });
        this.addGoodsDialogVisible = true;
        return;
      }
      // 校验售价和安全库存
      var flag = false;
      for (let i = 0; i < this.selectedGridDataNewGoods.length; i++) {
        let row = this.selectedGridDataNewGoods[i];
        flag =
          !this.handleGridBulkPriceChange(row) ||
          !this.handleGridSafeQtyChange(row);
        if (flag) break;
      }
      if (flag) {
        this.addGoodsDialogVisible = true;
        return;
      }
      // 执行保存
      let request = {
        list: this.selectedGridDataNewGoods.map((item, index) => {
          return {
            shopEid: this.shopInfo.eid,
            goodsId: item.goodsid,
            bulkPrice: item.bulkprice || 0,
            safeQty: item.safeqty || 0
          };
        })
      };
      return shopGoodsBatchOperate(request)
        .then(res => {
          console.log("[店铺管理-店铺详情-商品管理]添加商品API返回结果", res);
          this.$message({
            message: `添加商品成功`,
            type: "success"
          });
          this.search();
          this.getGoods();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 单元格编辑信息: editType 4-售价修改 3-安全库存修改
    handleCellChangeClick(row, editType) {
      setTimeout(() => {
        // 1. 校验是否可以继续操作
        if (row.status === 0) {
          this.$message({
            message: `"停止销售"状态下，不可操作！`,
            type: "error"
          });
          return;
        }
        // 2. 校验是否可以继续操作
        // if (editType === 4) {
        //     if(!this.handleGridBulkPriceChange(row)) return;
        // } else {
        //     if(!this.handleGridSafeQtyChange(row)) return;
        // }
        // 3. 保存售价修改信息
        console.log("DEBUG", row);
        let shopEid = this.shopInfo.eid,
          goodsId = row.goodsid,
          bulkPrice =
            editType === 4 ? parseFloat(row.bulkprice).toFixed(2) || 0 : 0,
          safeQty = editType === 3 ? row.safeqty || 0 : 0,
          type = editType; // 1-新增，2-删除，3-修改
        this.loading = true;
        return operateShopGoods(shopEid, goodsId, bulkPrice, safeQty, type)
          .then(res => {
            console.log("[店铺管理-店铺详情-商品管理]售价、安全库存修改API结果", res);
            this.$message({
              message: `保存成功`,
              type: "success"
            });
            this.search();
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      }, 10);
    },
    // 当单元格 hover 进入时会触发该事件
    cellMouseEnter(row, column, cell, event) {
      doc.addClass(cell, "cell-mouse-enter");
    },
    // 当单元格 hover 退出时会触发该事件
    cellMouseLeave(row, column, cell, event) {
      doc.removeClass(cell, "cell-mouse-enter");
    },
    // 点击单元格编辑图标
    editCell() {
      let tdCellEl = event.target.parentNode.parentNode,
        tdEl = tdCellEl.parentNode,
        inputEl = tdCellEl.getElementsByTagName("input")[0];
      doc.addClass(tdEl, "cell-edit");
      inputEl.focus();
    },
    // 单元格在 Input 失去焦点时触发
    cellInputBlur() {
      let el = event.target.parentNode.parentNode.parentNode.parentNode;
      doc.removeClass(el, "cell-edit");
    },
    // 单元格输入框被选中
    handleFocusCell() {
      event.currentTarget.select();
    },
    // 组件初始化
    shopGoodsInit() {
      this.shopInfo = JSON.parse(this.$route.query.shopInfo);
      console.log("[店铺管理-店铺详情-商品管理]店铺详情信息: ", this.shopInfo);
      this.getBrand();
      this.getShopGoodsList();
    }
  },
  activated() {
    if (!this.myModulePower.edit) {
      this.hideOpCol(3, this.gridCol, this.gridCol.length - 1);
    }
    this.shopGoodsInit();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.shop-goods {
  .sl-search-panel {
  }
  .sl-operator-panel {
    .sl-operator-left {
      left: 250px !important;
    }
    .sl-operator-right {
    }
  }
  .sl-content-panel {
    margin-top: 0 !important;
    padding: 0 10px !important;
    .first-el-col {
      padding-left: 0 !important;
    }
  }
  // 单元格编辑功能样式
  .edit {
    display: none;
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
</style>