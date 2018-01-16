<template>
    <div class="sl-page-container flex-col orgNew">
        <levelbar>
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【基础管理-组织机构管理】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>1. 管理三只熊的组织机构。</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <div class="slic-content">
            <div class="slic-content-tree">
                <sl-tree-list :treeData="orgList" :treeProps="orgTreeProps" @treeSelected="orgTreeSelected"></sl-tree-list>
            </div>
            <div class="slic-content-info">
                <div class="sl-content-handle" style="text-align: left">
                    <span class="sl-content-handle-left">
                        <el-button type="primary" size="small" @click="forbidOrg()">禁用机构</el-button>
                    </span>

                    <span class="sl-content-handle-right fr">
                      <el-button-group>
                        <el-button type="primary" size="small" @click="doSave()">保存</el-button>
                        <el-button type="primary" size="small" @click="doCancel()">取消</el-button>
                      </el-button-group>
                    </span>

                </div>

                <div class="sl-form">
                    <el-row :gutter="20" class="sl-form-row" style="margin-top: 10px;">
                        <el-col :span="8">
                            <label class="sl-form-label">机构名称：</label>
                            <span class="sl-form-input">
                                <el-input size="small"  v-model="orgInfo.eName"></el-input>
                            </span>
                        </el-col>

                        <el-col :span="8">
                            <label class="sl-form-label">所在层级：</label>
                            <el-input size="small" class="sl-form-input noedit"
                                      v-model="orgInfo.levelName" readonly></el-input>
                        </el-col>

                        <el-col :span="8">
                            <label class="sl-form-label">上级机构：</label>
                            <span class="sl-form-input" style="position: relative">
                              <sl-tree-select :slTreeData="orgTreeData" @selectedNode="selectOrgTree"
                                              :nodeVal="orgInfo.parentName"
                                              :isShowThird="false"
                                              :slTreeProps="orgTreeProps"></sl-tree-select>
                            </span>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" class="sl-form-row">
                        <el-col :span="8">
                            <label class="sl-form-label">所在地区：</label>
                            <span class="sl-form-input">
                                <sl-area-select :areaId="orgInfo.areaId" @getAreaId="getOrgArea"></sl-area-select>
                            </span>
                        </el-col>

                        <el-col :span="8">
                            <label class="sl-form-label">联系人：</label>
                            <span class="sl-form-input">
                                <el-input size="small" v-model="orgInfo.contact"></el-input>
                            </span>

                        </el-col>

                        <el-col :span="8">
                            <label class="sl-form-label">联系电话：</label>
                            <span class="sl-form-input">
                                <el-input size="small" v-model="orgInfo.contactTele"></el-input>
                            </span>

                        </el-col>

                    </el-row>

                    <el-row :gutter="20" class="sl-form-row">
                        <el-col :span="14">
                            <label class="sl-form-label">地址：</label>
                            <span class="sl-form-input">
                                <el-input size="small" v-model="orgInfo.address"></el-input>
                            </span>
                        </el-col>

                        <el-col :span="2">
                            <sl-baidu-map :mapAddress="orgInfo.address" @mapSure="mapSure"></sl-baidu-map>
                        </el-col>

                        <el-col :span="8" style="line-height: 30px;text-align: center;">
                            <el-checkbox v-model="orgInfo.isShop">我是店铺</el-checkbox>
                        </el-col>
                    </el-row>

                    <el-row class="sl-form-row">
                        <el-col :span="24">
                            <label class="sl-form-label" style="vertical-align: top;">备注：</label>
                            <el-input
                                    class="sl-form-input"
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入内容"
                                    maxlength="120"
                                    v-model="orgInfo.orgNote">
                            </el-input>
                        </el-col>


                    </el-row>


                </div>

            </div>
        </div>




    </div>
</template>

<script>
    import ElOption from '../../../../node_modules/element-ui/packages/select/src/option'
    import ElButton from '../../../../node_modules/element-ui/packages/button/src/button'
    import SlTreeSelect from '../../../components/sl-tree-select.vue'
    import {getOrgList, getOrgDetail} from '@/api/basic/org';
    import SlBaiduMap from '../../../components/sl-baiduMap';
    import SlTreeList from '../../../components/sl-tree-list';
    import SlAreaSelect from '../../../components/sl-areaSelect/sl-areaSelect2.vue';
    import Levelbar from '@/views/layout/Levelbar.vue'

    export default {
        components: {
            SlBaiduMap, Levelbar, SlAreaSelect,
            ElButton, ElOption, SlTreeSelect, SlTreeList},
        name: 'orgNew',
        data () {
            return {
                orgList: [],
                queryKey: '', // 机构搜索输入框关键词
                areaInfo: {province: '', city: '', area: ''},
                showOrgArea: false,
                orgInfo: { levelName: ''},
                orgTreeData:[],
                currentOrg: {},
                orgTreeProps: {
                    children: 'children',
                    label: 'eName',
                    selected: 'orgid'
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                // 获取组织机构列表
                getOrgList().then((response) => {
                    console.log('res==', response);
                    this.orgList = response.result.orgTreeList;
                    this.orgTreeData = response.result.orgTreeList;
                }).catch((err) => {
                    console.log(err)
                });

            })
        },

        methods: {
            // 查询机构
            doSearch () {
                console.log('queryKey==', this.queryKey)
            },
            // 重置搜索框
            doReset () {
                this.queryKey = ''
            },
            // 保存
            doSave: function (event) {
                console.log(this.orgInfo)
                this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success'
                });
            },
            // 取消
            doCancel () {
                console.log(this.orgInfo);
                this.$confirm('是否取消编辑?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
//                    this.getOrgInfo(this.currentOrg.orgid);
                    this.$store.dispatch('delVisitedViews', '新建组织机构');
                    this.$router.go(-1);
                }).catch(() => {

                });
            },
            // 禁用机构
            forbidOrg () {
                console.log('禁用机构')
            },
            // 机构树选中事件
            orgTreeSelected(obj) {
                console.log(obj);
//                this.currentOrg = obj;
//                this.getOrgInfo(obj.orgid);

            },
            // 等级树选中事件
            selectOrgTree (data) {
                console.log('data>>', data);
                this.orgInfo.parentName = data.eName;
                this.orgInfo.levelName = data.leveId === 1 ? '区域中心' : '店铺';
            },
            // 选择地区
            getOrgArea (areaId) {
                console.log(areaId);
                this.orgInfo.areaId = areaId;
            },
            // 地图确定
            mapSure (ads) {
                this.orgInfo.address = ads;
                console.log('ads==', ads);
            }
        },

        watch: {
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .sl-content-row-item-textarea{
        width: 80%;
        /*height: 200px;*/
        vertical-align: top;
    }

    .sl-search-showPart{
        text-align: justify;
        padding-top: 15px;
    }

    .sl-search-showPart::after{
        content: '';
        width: 100%;
        height: 0;
        display: inline-block;
    }

    .sl-search-showPart-item {
        box-sizing: border-box;
        /*width: 20%;*/
        min-height: 28px;
        height: auto;
        padding: 10px;
        background-color: #fff;
        border-radius: 4px;
        display: inline-block;

    }

    .sl-content-row-item-input{
        display: inline-block;
    }

    .tree-container{
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .tree-gradeList{
        /*padding: 10px;*/
    }

    .tree-firstGrade{
        font-weight: bold;
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #e5e5e5;
        font-size: 14px;
        cursor: pointer;
        padding: 0 10px;
    }

    .tree-secondGrade{
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #e5e5e5;
        border-top: 1px solid #e5e5e5;
        background-color: #f9f9f9;
        text-align: center;
        cursor: pointer;
    }

    .tree-threeGrade{
        height: 37px;
        line-height: 37px;
        border-bottom: 1px dotted #e5e5e5;
        text-align: center;
        cursor: pointer;
    }

    .gradeList:hover, .gradeList.active{
        background-color: #dcebfa;
    }
</style>