<template>
    <div class="goods-template sl-page-container flex-col">
        <!-- 表格筛选过滤查询条件 -->
        <div class="sl-search-panel mb-xsmall">
            <el-row :gutter="20">
                <el-col :span="6">
                    <sl-input :prepend="'商品名称'" placeholder="请输入商品名称"
                              :input-val.sync="searchModel.goodsName"></sl-input>
                </el-col>

                <el-col :span="6">
                    <sl-select :prepend="'品牌'" style="width: 100%;">
                        <el-select v-model="searchModel.brandId" placeholder="请选择品牌" size="small" slot="ELSelect"
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

                <el-col :span="4">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()" :disabled="loading">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()" :disabled="loading">重置</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </div>
        <!-- 表格列表数据展示 -->
        <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                 @rowSelected="handleSelectionChange" @pageSizeChange="handleSizeChange"
                 @currentPageChange="handleCurrentChange" @cellMouseEnter="cellMouseEnter"
                 @cellMouseLeave="cellMouseLeave" v-loading="loading">
            <template slot="eid" scope="prop">
                <el-button @click="goToShopItem(prop.scope.row, 3)" type="text" size="small">{{ prop.scope.row.eid }}
                </el-button>
            </template>
            <template slot="bulkprice" scope="prop">
                <div class="label">
                    {{prop.scope.row.bulkprice}}
                    <i class="el-icon-edit" @click.stop="editCell" v-show="myModulePower.edit"></i>
                </div>
                <div class="edit">
                    <el-input size="small" placeholder="请输入售价" v-model="prop.scope.row.bulkprice" 
                              @blur="cellInputBlur();handleCellChangeClick(prop.scope.row, 1)" 
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
                    <el-input size="small" placeholder="请输入安全库存" v-model="prop.scope.row.safeqty" 
                              @blur="cellInputBlur();handleCellChangeClick(prop.scope.row, 2)" 
                              v-input-validate.integer="{ model: prop.scope.row, key: 'safeqty' }" 
                              @focus="handleFocusCell"
                              autofocus></el-input>
                </div>
            </template>
            <template slot="operate" scope="prop">
                <el-button @click="delGoods(prop.scope.row)" type="text" size="small" v-show="myModulePower.edit">移除</el-button>
            </template>
        </sl-grid>
        <!-- 添加商品弹出框 -->
        <el-dialog title="添加商品" :visible.sync="addGoodsDialogVisible" size="small" class="add-goods-dialog"
                   :close-on-click-modal="false"
                   v-drag="'el-dialog__header'">
            <div style="margin-bottom: 10px;">
                <span style="width: 95px;margin-right: 10px;">商品名称: </span>
                <sl-input placeholder="请输入商品名称、内码、助记码" :input-val.sync="addSearchGoods"
                          style="width: 250px;"></sl-input>
                <el-button type="primary" @click="getGoods()" size="small">查询</el-button>
            </div>
            <div style="height: calc(100% - 30px);" v-loading="goodsDialogLoading">
                <sl-grid :gridCol="gridColNewGoods" :gridValue="gridValNewGoods" :gridConfig="gridCfgNewGoods"
                         @rowSelected="doSelectedNewGoods" @pageSizeChange="handleSizeChangeNewGoods"
                         @currentPageChange="handleCurrentChangeNewGoods">
                    <template slot="bulkprice" scope="prop">
                        <el-input size="small" placeholder="请输入售价" v-model="prop.scope.row.bulkprice" 
                         v-input-validate.price="{ model:prop.scope.row, key: 'bulkprice' }"></el-input>
                    </template>
                    <template slot="safeqty" scope="prop">
                        <el-input size="small" placeholder="请输入预警库存数" v-model="prop.scope.row.safeqty" 
                          v-input-validate.integer="{ model: prop.scope.row, key: 'safeqty' }"></el-input>
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
import ExcelExpimp from "@/components/excel-import-export.vue";
import SlTreeSelectCat from "@/components/sl-tree-select-cat.vue";
import SlAutocomplete from "@/components/sl-autocomplete.vue";
import SlInput from "@/components/sl-input.vue";
import SlGrid from "@/components/sl-grid.vue";
import {
  getTemplateGoodsList,
  operateTemplateGoods,
  groupTemplateGoodsBatchOperate,
  groupTemplateGoodsUpdatePriceSafeQty
} from "@/api/basic/group/group";
import { getGoodsTip, getGoodsList } from "@/api/operations/goods";
import { getBrandList } from "@/api/basic/brand";
import doc from "utils/doc";
import {
  validateGTFloatingNumber,
  validateSignlessInteger,
  validateNonnegativeIntegers,
  validateInputInt,
  validateInputPrice
} from "utils/validate";
import isFloat from "validator/lib/isFloat";
import ViewPage from "@/mixins/viewPage"; // 页面公共混合器
import ViewBtnsPower from "@/mixins/viewBtnsPower";

export default {
  name: "goods-template",
  mixins: [ViewPage, ViewBtnsPower],
  components: {
    ExcelExpimp,
    SlTreeSelectCat,
    SlAutocomplete,
    SlInput,
    SlGrid
  },
  data() {
    return {
      loading: false,
      searchModel: {
        goodsName: "",
        brandId: "",
        brandList: [],
        catId: "",
        resetCat: false,
        catProps: {
          label: "catName",
          children: "lowerCatList",
          key: "catId"
        }
      },
      goodsAutoModel: {
        goodsList: [],
        autoParams: {
          goodsid: "商品内码",
          goodsname: "商品名称",
          catLName: "所属品类"
        }
      },
      goodsTemplateInfo: {
        // 商品模板信息
        bulkprice: null,
        safeqty: null
      },
      // 商品弹出框相关
      addGoodsDialogVisible: false, // 添加商品弹出框是否显示
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
        frozen: true
      },
      selectedGridDataNewGoods: [],
      // 表格相关
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
        { field: "catLName", name: "分类", minWidth: "200", align: "center" },
        { field: "specOne", name: "规格1", width: "120", align: "center" },
        { field: "specTwo", name: "规格2", width: "120", align: "center" },
        { field: "packunit", name: "销售单位", width: "120", align: "center" },
        {
          field: "bulkprice",
          name: "售价",
          width: "130px",
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
        frozen: true
      },
      multipleSelection: [], // 表格选择数据
      tableData: [], // 表格数据
      page: {
        // 表格分页配置
        pageSize: 25,
        pageNum: 1,
        totalRecord: 0
      }
    };
  },
  methods: {
    // 获取经营商品模版列表
    getTemplateGoodsList() {
      let groupId = this.$parent.groupInfo.groupId,
        goodsName = this.searchModel.goodsName,
        catId = this.searchModel.catId || -1,
        brandId = this.searchModel.brandId || -1,
        page = {
          pageNum: this.gridVal.footer.pageNum || 1,
          pageSize: this.gridVal.footer.pageSize || 25,
          totalRecord: 0,
          totalPage: 0
        };
      this.loading = !this.addGoodsDialogVisible && true;
      return getTemplateGoodsList(page, groupId, goodsName, brandId, catId)
        .then(res => {
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
          this.tableData = [];
          this.loading = false;
        });
    },
    // 获取商品列表
    getGoods() {
      this.goodsDialogLoading = true;
      let opt = {
        params: {
          goodsName: this.addSearchGoods,
          notInGroup: this.$parent.groupInfo.groupId
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
    // 经营商品操作: 1-新增，2-删除
    operateTemplateGoods(goodsId, bulkPrice, safeQty, type) {
      let groupId = this.$parent.groupInfo.groupId;
      return operateTemplateGoods(groupId, goodsId, bulkPrice, safeQty, type)
        .then(res => {
          console.log(res);
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
    // 根据查询条件过滤符合条件的商品
    doSearch() {
      this.getTemplateGoodsList();
    },
    // 重置查询条件
    doReset() {
      this.searchModel = Object.assign({}, this.searchModel, {
        goodsName: "",
        brandId: "",
        catId: "",
        resetCat: true
      });
      this.doSearch();
    },
    // 删除多个选择商品
    delGoodsList() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: `请选择商品`,
          type: "error"
        });
        return;
      }
      this.loading = true;
      this.multipleSelection.forEach(goodsInfo => {
        let goodsId = goodsInfo.goodsid,
          bulkPrice = goodsInfo.bulkprice,
          safeQty = goodsInfo.safeqty,
          type = 2; // 1-新增，2-删除;
        this.operateTemplateGoods(goodsId, bulkPrice, safeQty, type)
          .then(() => {
            this.$message({
              message: `批量移除商品成功`,
              type: "success"
            });
            this.doSearch();
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      });
    },
    // 删除单个商品
    delGoods(goodsInfo) {
      let goodsId = goodsInfo.goodsid,
        bulkPrice = goodsInfo.bulkprice,
        safeQty = goodsInfo.safeqty,
        type = 2; // 1-新增，2-删除;
      this.$confirm("是否移除商品?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      })
        .then(() => {
          this.operateTemplateGoods(
            goodsId,
            bulkPrice,
            safeQty,
            type
          ).then(() => {
            this.$message({
              message: `移除商品成功`,
              type: "success"
            });
            this.doSearch();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 处理勾选商品列表数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 处理分页对象的分页大小
    handleSizeChange(size) {
      this.gridVal.footer.pageSize = size;
      this.doSearch();
    },
    // 处理分页对象的当前页
    handleCurrentChange(page) {
      this.gridVal.footer.pageNum = page;
      this.doSearch();
    },
    // 弹出"添加商品"选择框
    addGoods() {
      this.addSearchGoods = "";
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
    // 保存添加的商品 type 1=> 添加 2=> 继续添加
    saveGoods(type) {
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
        type: 1,
        groupId: this.$parent.groupInfo.groupId,
        list: this.selectedGridDataNewGoods.map((item, index) => {
          return {
            goodsId: item.goodsid,
            bulkPrice:
              item.bulkprice === "" ? 0 : parseFloat(item.bulkprice).toFixed(2),
            safeQty: item.safeqty === "" ? 0 : item.safeqty
          };
        })
      };
      return groupTemplateGoodsBatchOperate(request).then(() => {
        this.$message({
          message: `添加商品成功`,
          type: "success"
        });
        this.doSearch();
        this.getGoods();
      });
    },
    // 单元格编辑信息 editType 1-售价修改 2-安全库存修改
    handleCellChangeClick(row, editType) {
      setTimeout(() => {
        // 1. 校验是否可以继续操作isFloat
        // if (editType === 1) {
        //     if(!this.handleGridBulkPriceChange(row)) return;
        // } else {
        //     if(!this.handleGridSafeQtyChange(row)) return;
        // }
        // 2. 保存售价修改信息
        let params = {
          groupId: this.$parent.groupInfo.groupId,
          goodsId: row.goodsid,
          bulkPrice:
            editType === 1 ? parseFloat(row.bulkprice).toFixed(2) || 0 : 0,
          safeQty: editType === 2 ? row.safeqty || 0 : 0,
          type: editType
        };
        this.loading = true;
        return groupTemplateGoodsUpdatePriceSafeQty(params)
          .then(res => {
            console.log("[店组管理-店组模板-经营商品模板]售价、安全库存修改API结果", res);
            this.$message({
              message: `操作成功`,
              type: "success"
            });
            this.doSearch();
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      }, 10);
    },
    //el 点击去图标
    handleIconClick(ev) {
      let el = ev.target.parentNode.parentNode.parentNode.parentNode;
      doc.removeClass(el, "cell-edit");
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
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getTemplateGoodsList();
    });
  },
  activated() {
    if (!this.myModulePower.edit) {
      this.hideOpCol(3, this.gridCol, this.gridCol.length - 1);
    }
    this.getBrand();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.goods-template {
  .sl-search-panel {
    padding-top: 0 !important;
    margin: 0 -10px 10px -10px !important;
  }
  .add-goods-dialog {
    &.el-dialog__wrapper {
      .el-dialog {
        &.el-dialog--small {
          width: 800px;
          height: 480px;
          .el-dialog__body {
            height: 400px;
          }
        }
      }
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