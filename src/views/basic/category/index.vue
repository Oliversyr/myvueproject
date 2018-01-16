<template>
    <div class="sl-page-container flex-col categoryIndex" v-loading="load1">

        <div class="slic-head-panel">
            <levelbar>
                <span slot="tip-content" class="icon-help-wrap pst-rl">
                    <icon-svg icon-class="wenhao-fill"></icon-svg>
                    <div class="icon-help-alert animated zoomIn">
                        <div class="icon-help-alert-til">
                            <span class="left">【基础管理-品类管理】</span>
                        </div>
                        <div class="icon-help-alert-tcon">
                            <p>查看企业的品类树，新增、编辑品类。</p>
                        </div>
                    </div>
                </span>
            </levelbar>

            <div style="float: right;">
                <div class="slic-input-group" style="margin-right: 30px;">
                    共有 一级分类
                    <span class="c-num"> {{firstLevelNum}} </span> 个
                </div>

                <div class="slic-input-group" style="margin-right: 30px;">
                    二级分类
                    <span class="c-num"> {{secondLevelNum}} </span> 个
                </div>

                <div class="slic-input-group">
                    三级分类
                    <span class="c-num"> {{thirdLevelNum}} </span> 个
                </div>
            </div>

        </div>

        <div class="slic-content">
            <div class="slic-content-info">

                <div class="sl-content-handle sl-search-panel" style="text-align: left">
                    <div class="slic-input-group sl-search-item" style="width: 335px;">
                        <el-input size="small" v-model="queryKey" :icon="queryKey ? 'circle-close' : ''" :on-icon-click="iconClose" placeholder="请输入类别名称">
                            <template slot="prepend">类别名称</template>
                        </el-input>
                    </div>

                    <div class="slic-btn-group">
                        <el-button-group>
                            <el-button type="primary" size="small" @click="editOrNewCat('new')" :disabled="load2" v-if="myModulePower.add">新增第一级类别</el-button>
                            <el-button type="primary" size="small" @click="doSearch()" :disabled="load2">查询</el-button>
                            <el-button type="primary" size="small" @click="doReset()" :disabled="load2">重置</el-button>
                        </el-button-group>
                    </div>
                </div>

                <div class="sl-content-info-down" v-loading="load2">
                    <div class="cat-tree-container">
                        <ul class="tree-list-header clearfix">
                            <li class="tree-list-item" style="width: 20%;">分类名称</li>
                            <li class="tree-list-item" style="width: 15%;">商品类别</li>
                            <li class="tree-list-item" style="width: 10%;">类别内码</li>
                            <li class="tree-list-item" style="width: 10%;">商品数量</li>
                            <li class="tree-list-item" style="width: 20%;">备注</li>
                            <li class="tree-list-item" style="width: 22%;border-right: 0;">操作</li>
                        </ul>
                        <div class="el-table__empty-text" v-if="catList.length === 0">暂无数据</div>
                        <div class="tree-list-body-container">
                            <div class="tree-list-body" v-for="cat in catList" :key="cat.catId">
                                <ul class="tree-firstGrade" @click.stop="cat.showChildren = !cat.showChildren">
                                    <li class="tree-list-item" style="width: 20%;position: relative;">
                                        <i class="tree-open-close" :class="{'isExpand': cat.showChildren}"></i>
                                        {{cat.catName}}&nbsp;
                                    </li>
                                    <li class="tree-list-item" style="width: 15%;">{{cat.levelId}}&nbsp;</li>
                                    <li class="tree-list-item" style="width: 10%;">{{cat.displayOrder}}&nbsp;</li>
                                    <li class="tree-list-item" style="width: 10%;">{{cat.goodsNum}}&nbsp;</li>
                                    <li class="tree-list-item tx-overflow" style="width: 20%;vertical-align: bottom;" :title="cat.notes">{{cat.notes}}&nbsp;</li>
                                    <li class="tree-list-item" style="width: 22%;border-right: 0;">
                                        <span class="tree-list-item-btn" @click.stop="editOrNewCat(cat, 'new')" v-if="myModulePower.add">添加子类别</span>
                                        <!--<span class="tree-list-item-btn">|</span>-->
                                        <span class="tree-list-item-btn" @click.stop="editOrNewCat(cat, 'edit')" v-if="myModulePower.edit">修改</span>

                                        <span class="tree-list-item-btn" @click.stop="deleteCat(cat)" v-if="myModulePower.delete">删除</span>
                                        <span class="tree-list-item-btn"> </span>
                                    </li>
                                </ul>

                                <el-collapse-transition>
                                    <div v-if="cat.showChildren">
                                        <div v-for="secondCat in cat.lowerCatList" :key="secondCat.catId">
                                            <ul class="tree-secondGrade" @click.stop="secondCat.showChildren = !secondCat.showChildren">
                                                <li class="tree-list-item " style="width: 20%;">
                                                    <i class="tree-open-close" :class="{'isExpand': secondCat.showChildren}"></i>
                                                    {{secondCat.catName}}&nbsp;
                                                </li>
                                                <li class="tree-list-item " style="width: 15%;">{{secondCat.levelId}}&nbsp;</li>
                                                <li class="tree-list-item" style="width: 10%;">{{secondCat.displayOrder}}&nbsp;</li>
                                                <li class="tree-list-item" style="width: 10%;">{{secondCat.goodsNum}}&nbsp;</li>
                                                <li class="tree-list-item tx-overflow" style="width: 20%;vertical-align: bottom;" :title="secondCat.notes">{{secondCat.notes}}&nbsp;</li>
                                                <li class="tree-list-item" style="width: 23%;border-right: 0;">
                                                    <span class="tree-list-item-btn" @click.stop="editOrNewCat(secondCat, 'new')" v-if="myModulePower.add">添加子类别</span>
                                                    <!--<span class="tree-list-item-btn">|</span>-->
                                                    <span class="tree-list-item-btn" @click.stop="editOrNewCat(secondCat, 'edit')" v-if="myModulePower.edit">修改</span>

                                                    <span class="tree-list-item-btn" @click.stop="deleteCat(secondCat)" v-if="myModulePower.delete">删除</span>
                                                    <span class="tree-list-item-btn"> </span>
                                                </li>
                                            </ul>

                                            <el-collapse-transition>
                                                <div v-if="secondCat.showChildren">
                                                    <ul class="tree-threeGrade" v-for="thirdCat in secondCat.lowerCatList" :key="thirdCat.catId">
                                                        <li class="tree-list-item " style="width: 20%;">{{thirdCat.catName}}&nbsp;</li>
                                                        <li class="tree-list-item" style="width: 15%;">{{thirdCat.levelId}}&nbsp;</li>
                                                        <li class="tree-list-item" style="width: 10%;">{{thirdCat.displayOrder}}&nbsp;</li>
                                                        <li class="tree-list-item" style="width: 10%;">{{thirdCat.goodsNum}}&nbsp;</li>
                                                        <li class="tree-list-item tx-overflow" style="width: 20%;vertical-align: bottom;" :title="thirdCat.notes">{{thirdCat.notes}}&nbsp;</li>
                                                        <li class="tree-list-item" style="width: 23%;border-right: 0;">
                                                            <span class="tree-list-item-btn" @click.stop="editOrNewCat(thirdCat, 'edit')" v-if="myModulePower.edit">修改</span>

                                                            <span class="tree-list-item-btn" @click.stop="deleteCat(thirdCat)" v-if="myModulePower.delete">删除</span>
                                                            <span class="tree-list-item-btn"> </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </el-collapse-transition>
                                        </div>

                                    </div>

                                </el-collapse-transition>

                            </div>
                        </div>
                    </div>
                    <el-dialog :title="catTitle" size="tiny" :visible.sync="newCat" :close-on-click-modal="false">
                        <div class="sl-form">
                            <el-row :gutter="20" class="sl-form-row">
                                <el-col :span="24">
                                    <el-row class="sl-form-row">
                                        <label class="sl-form-label">上级类别：</label>
                                        <span class="sl-form-input" style="position: relative;" v-if="newCatLevel === 1">
                                            <el-input class="noedit" readonly v-model="wu"></el-input>
                                        </span>
                                        <span class="sl-form-input" style="position: relative;" v-else>
                                            <span style="position: relative;" v-if="newCat">
                                                <sl-tree-select-cat @selectedNode="selectCatTree" :defaultCheck="newCatInfo.defaultCheck" :dataFromOut="true" :fromOutData="selectCatData"
                                                                    :slTreeProps="catProps" :isShowThird="false" v-if="opType === 'add'">
                                                </sl-tree-select-cat>

                                                <sl-tree-select-cat @selectedNode="selectCatTree" :defaultCheck="newCatInfo.defaultCheck" :slTreeProps="catProps"
                                                                    :isShowThird="false" v-if="opType === 'edit'">
                                                </sl-tree-select-cat>


                                            </span>

                                        </span>

                                    </el-row>
                                    <el-row class="sl-form-row">
                                        <label class="sl-form-label">
                                            <i style="color: red;">*</i>类别名称：</label>
                                        <span class="sl-form-input">

                                            <sl-input :input-val.sync="newCatInfo.catName" placeholder="请输入类别名称" :maxlength="16"></sl-input>
                                        </span>

                                    </el-row>
                                    <el-row class="sl-form-row" style="position: relative;">
                                        <el-col :span="23">
                                            <label class="sl-form-label">
                                                <i style="color: red;">*</i>类别内码：</label>
                                            <span class="sl-form-input">

                                                <sl-input :input-val.sync="newCatInfo.displayOrder" placeholder="请输入类别内码" :onlynum="true" :maxlength="8" ></sl-input>
                                            </span>

                                        </el-col>

                                        <el-col :span="1">
                                            <i class="icon-help">
                                                <span class="icon-tip">在展示类别时，会按照类别内码从小到大排序</span>
                                            </i>
                                        </el-col>

                                    </el-row>

                                    <el-row class="sl-form-row" style="position: relative;">
                                        <label class="sl-form-label" style="vertical-align: top;">备注：</label>
                                        <el-input class="sl-form-input" type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请输入内容" :maxlength="32" v-model="newCatInfo.notes">
                                        </el-input>

                                    </el-row>

                                </el-col>

                                <!--<el-col :span="12">
                                        <label class="sl-form-label" style="vertical-align: top;">备注：</label>
                                        <el-input
                                                class="sl-form-input"
                                                type="textarea"
                                                :autosize="{ minRows: 6, maxRows: 6}"
                                                placeholder="请输入内容"
                                                :maxlength="120"
                                                v-model="newCatInfo.notes">
                                        </el-input>
                                    </el-col>-->
                            </el-row>
                        </div>

                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="editCatSure()" size="small">确 定</el-button>
                            <el-button @click="newCat = false" class="dialog-cancel" size="small">取 消</el-button>
                        </span>
                    </el-dialog>

                </div>

            </div>
        </div>

    </div>
</template>

<script>

import { getCategoryList, addNewCategory, editCategory, deleteCategory, gridData } from '@/api/basic/cat';
import SlTreeSelectCat from '@/components/sl-tree-select-cat.vue';
import Levelbar from '@/views/layout/Levelbar.vue';
import { mapGetters } from 'vuex';
import SlInput from '@/components/sl-input.vue';
export default {
    components: {
        SlTreeSelectCat, Levelbar,
        SlInput
    },
    name: 'category',
    data() {
        return {
            load1: false,
            load2: false,
            opType: '',
            catList: [],
            selectCatData: [],
            queryKey: '',
            newCat: false,
            newCatInfo: {},
            addCat: '',
            wu: '无',
            catTitle: '',
            newCatLevel: 0,
            firstLevelNum: 0,
            secondLevelNum: 0,
            thirdLevelNum: 0,
            catProps: {
                label: 'catName',
                children: 'lowerCatList',
                key: 'catId'
            },
            cacheList: []
        }
    },
    mounted: function() {
        this.$nextTick(function() {

            this.getCatList();

        })
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
    methods: {
        // 获取品类列表
        getCatList() {
            const _this = this;
            this.load2 = true;
            if (this.catList.length !== 0) {
                // this.cacheList = JSON.parse(JSON.stringify(this.catList))
               this.cacheList = Object.assign([],JSON.parse(JSON.stringify(this.catList)),this.cacheList,);
            }

            getCategoryList({ catName: this.queryKey }).then(res => {
                this.load2 = false;
                if (res.retCode === 'SUCCESS') {
                    console.log(res);
                    this.catList = res.result;
                    this.selectCatData = JSON.parse(JSON.stringify(res.result));
                    this.firstLevelNum = this.catList.length;
                    this.secondLevelNum = 0;
                    this.thirdLevelNum = 0;
                    this.catList.forEach((item1, i) => {
                        _this.$set(item1, 'showChildren', true);
                        if (this.cacheList.length !== 0 && this.cacheList[i] && item1.catId === this.cacheList[i].catId && !this.cacheList[i].showChildren) {
                            _this.$set(item1, 'showChildren', false);
                        }
                        //                            _this.$set(item1, 'isShow', true);
                        if (item1.lowerCatList && item1.lowerCatList.length > 0) {
                            this.secondLevelNum = this.secondLevelNum + item1.lowerCatList.length;
                            item1.lowerCatList.forEach((item2, j) => {
                                _this.$set(item2, 'showChildren', true);
                                if (this.cacheList.length !== 0 && this.cacheList[i].lowerCatList[j] && item2.catId === this.cacheList[i].lowerCatList[j].catId && !this.cacheList[i].lowerCatList[j].showChildren) {
                                    _this.$set(item2, 'showChildren', false);
                                }
                                //                             _this.$set(item2, 'isShow', true);
                                if (item2.lowerCatList && item2.lowerCatList.length > 0) {
                                    this.thirdLevelNum = this.thirdLevelNum + item2.lowerCatList.length;
                                }

                            })
                        }

                    });


                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.load2 = false;
                //                    this.$message(res.retMsg);
            });


        },
        // 类别查询
        doSearch() {
            this.getCatList();
        },
        // 重置
        doReset() {
            this.queryKey = '';
            this.catList = [];
            this.doSearch();
            gridData();

        },
        // 品类编辑弹窗，上级品类选择事件
        selectCatTree(data) {
            console.log('data==', data);
            this.newCatInfo.parentId = data.catId;
            this.newCatInfo.levelId = data.levelId + 1;
        },
        // 品类编辑弹窗确定
        editCatSure() {
            if (!this.newCatInfo.catName) {
                this.$message('请输入类别名称！');
            } else if (!this.newCatInfo.displayOrder) {
                this.$message('请输入类别内码！');
            } else {

                this.load1 = true;
                let opt = {
                    catId: (this.newCatLevel === 1 || this.newCatLevel === 2) ? -1 : this.newCatInfo.catId,
                    catName: this.newCatInfo.catName,
                    parentId: this.newCatInfo.parentId || -1,
                    levelId: this.newCatInfo.levelId || 1,
                    displayOrder: this.newCatInfo.displayOrder,
                    catId: this.newCatInfo.catId,
                    notes: this.newCatInfo.notes || ''
                    //                    goodsNum:
                }

                if (this.opType === 'add') {
                    addNewCategory(opt).then(res => {
                        this.load1 = false;
                        if (res.retCode === 'SUCCESS') {
                            this.$message('新增成功！');
                            this.getCatList();
                            this.newCat = false;
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load1 = false;
                        //                        this.$message(res.retMsg);
                    });
                } else {
                    editCategory(opt).then(res => {
                        this.load1 = false;
                        if (res.retCode === 'SUCCESS') {
                            this.$message('修改成功！');
                            this.getCatList();
                            this.newCat = false;
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load1 = false;
                        //                        this.$message(res.retMsg);
                    });
                }
            }
        },
        // 新增或编辑类别
        editOrNewCat(obj, type) {
            console.log(obj, type);

            this.newCatInfo.parentId = '';
            this.newCatInfo.catName = '';
            this.newCatInfo.displayOrder = '';
            this.newCatInfo.notes = '';

            if (obj === 'new') {
                this.catTitle = '新增类别';
                this.opType = 'add';
                this.newCatLevel = 1;
                this.newCatInfo.levelId = 1;
                this.newCatInfo.defaultCheck = {
                    key: '',
                    catName: '无'
                }
                this.newCat = true;
            } else if (type === 'new') {
                this.catTitle = '新增类别';
                this.opType = 'add';
                this.newCatLevel = 2;
                this.newCatInfo.parentId = JSON.parse(JSON.stringify(obj.catId));
                this.newCatInfo.defaultCheck = {
                    key: this.newCatInfo.parentId,
                    catName: obj.catName
                }
                this.newCatInfo.levelId = obj.levelId + 1;
                this.newCat = true;
            } else if (type === 'edit') {
                this.catTitle = '类别编辑';


                this.opType = 'edit';

                this.newCatLevel = obj.levelId === 1 ? 1 : 0;
                this.newCat = true;
                console.log(obj);

                let newCatInfo = JSON.parse(JSON.stringify(obj));
                this.newCatInfo.displayOrder = newCatInfo.displayOrder;
                console.log('this.newCatInfo==', this.newCatInfo);
                this.$set(this.newCatInfo, 'parentId', newCatInfo.parentId);
                this.$set(this.newCatInfo, 'displayOrder', parseInt(newCatInfo.displayOrder));
                this.$set(this.newCatInfo, 'catName', newCatInfo.catName);
                this.$set(this.newCatInfo, 'catId', newCatInfo.catId);
                this.$set(this.newCatInfo, 'notes', newCatInfo.notes);

                this.newCatInfo.defaultCheck = {
                    key: this.newCatInfo.parentId,
                    catName: '',
                    levelId: obj.levelId
                }
                this.newCatInfo.levelId = obj.levelId;
            }

        },
        // 删除类别
        deleteCat(cat) {
            console.log(cat)
            if (cat.goodsNum > 0 || (cat.lowerCatList !== null && cat.lowerCatList.length > 0)) {
                this.$alert('存在下级品类或有相关商品，不允许删除！', '提示', {
                    confirmButtonText: '确定',
                });
            } else {
                this.$confirm('是否删除该品类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCategory(cat.catId).then(res => {
                        if (res.retCode === 'SUCCESS') {
                            this.$message('删除成功')
                            this.getCatList();
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.$message(res.retMsg);
                    });

                }).catch(() => {
                    this.$message(res.retMsg);
                })
            }

        },
        iconClose(event) {
            console.log(event)

            this.queryKey = '';
        }

    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.categoryIndex {

    .slic-content-info {
        width: calc(100% - 286px);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 0;
    }

    .slic-content-info-up {
        background-color: #fff;
        border-radius: 5px;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }

    .sl-content-handle {
        background-color: #fff;
        border-radius: 5px 5px 0 0;
    }

    .sl-content-handle-left {
        padding-left: 10px;
        border-left: 3px solid #28e;
        font-size: 14px;
        font-weight: bold;
    }


    .sl-content-row-item-link:hover {
        text-decoration: underline;
    }

    .sl-content-info-down {
        /*max-height: 670px;*/
        overflow: hidden;
        height: calc(100% - 75px);
        /*overflow-y: auto;*/
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;
        /*overflow-y: auto;*/
    }

    .radio {
        width: 100%;
    }

    .c-num {
        font-size: 16px;
        font-weight: bold;
        color: #ff4949;
    }

    .icon-help {
        /*position: absolute;
        top: 5px;
        right: -15px;*/
        margin-top: 5px;
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url(../../../assets/img/icon-help.png) center no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        transition: all .3s;
    }

    .icon-help:hover {
        background: url(../../../assets/img/icon-help-active.png) center no-repeat;
        background-size: 100% 100%;

        .icon-tip {
            opacity: 1;
            visibility: visible;
        }
    }

    .icon-tip {
        position: absolute;
        width: 190px;
        padding: 10px;
        top: 0px;
        right: -180px;
        border: 1px solid #ccc;
        background-color: #fff;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 0 10px 0px #ccc;
        opacity: 0;
        visibility: hidden;
        /*opacity: 1;
        visibility: visible;*/
        transition: all 0.3s linear;
    }

    .cat-tree-container {
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 3px;

        .tree-list-header {
            background-color: #e5e5e5;

            .tree-list-item {
                font-size: 12px;
                font-weight: bold;
            }
        }

        .tree-list-body-container {
            height: calc(100% - 35px);
            overflow-y: auto;
        }

        .tree-list-item {
            position: relative;
            display: inline-block;
            list-style: none;
            height: 35px;
            line-height: 35px;
            text-align: center;
            /*border-right: 1px solid #ccc;*/
            border-bottom: 1px dashed #e5e5e5;
            box-sizing: border-box;

            .tree-open-close {
                vertical-align: middle;
                display: inline-block;
                width: 14px;
                height: 14px;
                background: url(../../../assets/img/icon-classify.png) center no-repeat;
                background-position: 0 -30px;
                /*background-size: 95%;*/
            }
            .isExpand {
                /*add 9-28*/
                background-position: 0 -15px;
            }

            .tree-list-item-btn {
                color: #999;
                margin-right: 10px;
            }

            .tree-list-item-btn:hover {
                color: #288be9;
            }
        }

        .tree-list-body {
            cursor: pointer;
        }



        .tree-firstGrade {
            background-color: #f9f9f9;

            .tree-list-item:first-child {
                text-align: left;
                padding-left: 30px;
                font-size: 14px;
                font-weight: bold;
            }
        }

        .tree-secondGrade {
            background-color: #fff;

            .tree-list-item:first-child {
                text-align: left;
                padding-left: 65px;
            }
        }

        .tree-threeGrade {
            background-color: #fff;

            .tree-list-item:first-child {
                text-align: left;
                padding-left: 85px;
            }
        }

        .tree-firstGrade:hover,
        .tree-secondGrade:hover,
        .tree-threeGrade:hover {
            background-color: #dcebfa;
        }
    }

    .tree-gradeList {
        /*padding: 10px;*/
    }



    .isExpand {
        background-position: 0 -15px;
    }

    .sl-form-row.el-row {
        margin-bottom: 10px;
    }
    .el-dialog--tiny {
        width: 30%;
        min-width: 460px;
    }
}

#app .sl-search-panel {
    margin-top: 0;
}
</style>