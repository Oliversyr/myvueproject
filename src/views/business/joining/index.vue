<template>
    <div class="sl-page-container flex-col joiningIndex" v-loading="load1">
        <div class="slic-head-panel">
            <div>
                <levelbar >
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【业务应用-加盟协议管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>1. 管理加盟公司及加盟协议；</p>
                                <p>2. 能够查看加盟公司的协议签署情况；</p>
                                <p>3. 查看协议详情；</p>
                                <p>4. 新增、修改、终止协议。</p>
                            </div>
                        </div>
                    </span>
                </levelbar>
                <div style="float: right">
                    <!--<span style="color: #28e;" v-if="propertyTab === '按加盟公司查看'">
                        您还有 <strong style="font-size: 16px;"> {{waitCheck}} </strong> 份加盟协议待审批
                        <el-button type="primary" size="small" @click="toCheck()">去审批</el-button>
                    </span>

                    <span style="color: #ff4949;" v-if="propertyTab === '按加盟协议查看'">
                        有 <strong style="font-size: 16px;"> {{out}} </strong> 份加盟协议即将或已过期
                        <el-button type="primary" size="small" @click="toLook()">去看看</el-button>
                    </span>-->


                    <el-badge :value="waitCheck" :max="99" :title="'您还有' + waitCheck + '份加盟协议待审批'" v-if="propertyTab === '按加盟公司查看'">
                        <el-button type="primary" size="small" @click="toCheck()"
                        >去审批
                        </el-button>
                    </el-badge>

                    <el-badge :value="out" :max="99" :title="'您还有' + out + '份加盟协议即将或已过期'"  v-if="propertyTab === '按加盟协议查看'" >
                        <el-button type="primary" size="small" @click="toLook()"
                        >去看看
                        </el-button>
                    </el-badge>


                    <el-button-group class="ml-small" v-if="propertyTab === '按加盟协议查看'">
                        <el-button type="primary" size="small" @click="doAdd()" v-if="myModulePower.add" :disabled="load2">添加
                        </el-button>
                        <el-button type="primary" size="small" @click="doDelete()" v-if="myModulePower.delete" :disabled="load2">删除
                        </el-button>
                        <el-button type="primary" size="small" @click="doCheck()" v-if="myModulePower.check" :disabled="load2">审核
                        </el-button>
                        <el-button type="primary" size="small" @click="doStop()" v-if="myModulePower.check" :disabled="load2">终止
                        </el-button>
                        <excel-import-export ref="expImp" :fileName="'协议列表'" :header="expHeader" :exportData="expData" @goToExp="doExport" v-if="myModulePower.export"
                                             :isImport="false"></excel-import-export>

                    </el-button-group>
                </div>
            </div>


            <div class="sl-search-panel">
                <div class="slic-input-group sl-search-item mr" style="width: 335px;">

                    <!--<org-select-partner :searchParam="proSelectParam" @doSelectOrg="searchFn"
                                        prepend="物业公司"></org-select-partner>-->

                    <sl-autocomplete :autoParams="autoOrgParams"
                                     :dataList="orgList"
                                     slWidth="750"
                                     colWidths="20,30,20,30"
                                     displayProp="ename"
                                     :defaultVal="defaultVal"
                                     @querykey="autoQuery"
                                     @doAutoSelected="handleAutoSelect"
                                     :clearInput="queryKey.clearInput"
                                     prepend="加盟公司"
                                     placeholder="请输入公司名称"
                                     selectedMode="SINGLE">
                    </sl-autocomplete>

                </div>

                <div class="slic-input-group sl-search-item mr" style="width: 335px;">
                    <!--<sl-area-select :areaId="queryKey.areaId" @getAreaId="getArea" :showPrepend="true"
                                    :showModal="false">
                        <template slot="prepend">
                            省市区
                        </template>
                    </sl-area-select>-->

                    <sl-cascader-area prepend="省市区" size="small" :area-val.sync="queryKey.areaId">
                    </sl-cascader-area>
                </div>


                <div class="slic-input-group sl-search-item mr" style="width: 300px;" v-if="propertyTab === '按加盟协议查看'">
                    <el-input size="small" v-model="queryKey.shopName" placeholder="请输入店铺名称">
                        <template slot="prepend">店铺名称</template>
                    </el-input>
                </div>

                <div class="slic-input-group sl-search-item mr" style="width: 190px;">
                    <sl-select prepend="状态">
                        <el-select v-model="queryKey.status" placeholder="请选择" :default-first-option="true" filterable slot="ELSelect" size="small">
                            <el-option label="全部" :value="-1" :key="-1"></el-option>
                            <el-option label="待审批" :value="0" :key="0"></el-option>
                            <el-option label="已审核" :value="1" :key="1"></el-option>
                            <el-option label="已终止" :value="2" :key="2"></el-option>
                        </el-select>
                    </sl-select>
                </div>

                <div class="slic-input-group sl-search-item ">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="doSearch()" :disabled="load2">查询</el-button>
                        <el-button type="primary" size="small" @click="doReset()" :disabled="load2">重置</el-button>
                    </el-button-group>
                </div>

            </div>
        </div>

        <div class="slic-content-info-tab mt-xsmall" >
            <el-radio-group v-model="propertyTab" @change="changeTab">
                <el-radio-button label="按加盟公司查看"></el-radio-button>
                <el-radio-button label="按加盟协议查看"></el-radio-button>
            </el-radio-group>
        </div>

        <div class="slic-content">
            <div class="sl-content-info">
                <div style="flex: 1;height: 100%;" v-show="propertyTab === '按加盟公司查看' ">

                    <sl-grid :gridCol="cgridCol" :gridValue="cgridVal" :gridConfig="cgridCfg" v-loading="load2"
                             @rowSelected="doCSelected" @pageSizeChange="handleCSizeChange"
                             @currentPageChange="handleCCurrentChange" v-if="propertyTab === '按加盟公司查看'">
                        <template slot="operate" scope="prop">
                            <el-button @click="goToAgreement(prop.scope.row)" type="text" size="small">查看协议</el-button>
                            <!--<el-button type="text" size="small" @click="changeToDetail(prop.scope)">详情</el-button>-->
                        </template>

                        <template slot="eid" scope="prop">
                            <!--<el-button @click="goToAgreement(prop.scope.row)" type="text" size="small">查看协议</el-button>-->
                            <!--<el-button type="text" size="small" @click="changeToDetail(prop.scope)">详情</el-button>-->
                            <span class="link" @click.stop="toPartnerDetail(prop.scope.row)" v-if="myPartnerModulePower.look">{{prop.scope.row.eid}}</span>
                            <span v-else>{{prop.scope.row.eid}}</span>
                        </template>

                        <template slot="shopstatus" scope="prop">
                            <span v-if="prop.scope.row.status === 0">停用</span>
                            <span v-if="prop.scope.row.status === 1">启用</span>
                        </template>
                    </sl-grid>
                </div>

                <div style="flex: 1;height: 100%;" v-show="propertyTab === '按加盟协议查看' ">

                    <sl-grid :gridCol="pgridCol" :gridValue="pgridVal" :gridConfig="pgridCfg" v-loading="load2"
                             @rowSelected="doPSelected" @pageSizeChange="handlePSizeChange"
                             @currentPageChange="handlePCurrentChange" v-if="propertyTab === '按加盟协议查看'">
                        <template slot="operate" scope="prop">
                            <span v-if="prop.scope.row.status === 0">
                                <el-button @click="doSingleCheck(prop.scope.row)" type="text" size="small"
                                           v-if="prop.scope.row.status === 0 && myModulePower.check">审批
                                </el-button>
                                <span class="divider"> </span>
                                <el-button type="text" size="small" @click.stop="attachment(prop.scope.row)">附件</el-button>
                            </span>

                            <span v-else>
                                <el-button type="text" size="small" @click="doSingleStop(prop.scope.row)"
                                           v-if="prop.scope.row.status === 1 && myModulePower.check">终止
                                </el-button>
                                <span class="divider"> </span>
                                <el-button type="text" size="small" @click.stop="renew(prop.scope.row)"
                                           v-if="myModulePower.check">续签
                                </el-button>

                                <span class="divider"> </span>
                                <el-button type="text" size="small" @click.stop="attachment(prop.scope.row)" v-if="!myModulePower.check || prop.scope.row.status !== 1">附件</el-button>

                                <span class="more-operate" v-if="myModulePower.check && prop.scope.row.status !== 2">
                                    <i class="el-icon-more"></i>

                                    <ul class="more-operate-container" style="top: 14px;">
                                        <li class="more-operate-list" @click.stop="attachment(prop.scope.row)">附件</li>
                                    </ul>

                                </span>
                            </span>
                        </template>

                        <template slot="ratio" scope="prop">
                            <!--<span class="newPrice">
                                <span v-if="!prop.scope.row.isEditRatio" class="pricecell">
                                    {{prop.scope.row.status}}
                                    <i class="el-icon-edit"
                                       @click.stop="editprice(prop.scope.row, prop.scope.$index)"></i>
                                </span>

                                <span class="newPriceEdit el-input&#45;&#45;small" v-else>
                                    <input type="number" :id="'editprice' + prop.scope.$index"
                                           class="el-input__inner"
                                           @blur="prop.scope.row.isEditRatio = false"
                                           v-model="prop.scope.row.status"
                                           @change="newPriceChange($event, prop.scope.row)"
                                           @click.stop=""
                                           v-focus/>
                                </span>
                            </span>-->
                            {{prop.scope.row.percent}}
                        </template>

                        <template slot="status" scope="prop">
                            <span v-if="prop.scope.row.status === 0">待审批</span>
                            <span v-if="prop.scope.row.status === 1">已审批</span>
                            <span v-if="prop.scope.row.status === 2">已终止</span>
                        </template>

                        <template slot="effectdate" scope="prop">
                            {{prop.scope.row.bDate}} ~ {{prop.scope.row.eDate}}
                        </template>
                    </sl-grid>
                </div>

            </div>
        </div>

        <el-dialog title="添加加盟协议" :visible.sync="showAddProperty" class="addProperty" :close-on-click-modal="false">
            <span v-loading="load3">
                <el-form :model="addProperty" :rules="rules1" ref="addForm" label-width="95px">
                    <el-row :gutter="15" >
	                <el-col :span="24">
                        <el-form-item label="加盟公司：" prop="eid">
                            <org-select-partner :searchParam="proSelectParam" @doSelectOrg="getProCom" v-if="showAddProperty"
                                                selMode="SINGLE"></org-select-partner>
                        </el-form-item>
	                </el-col>

          	    </el-row>
          	    <el-row :gutter="15" >

	                <el-col :span="12">
                        <el-form-item label="联系人：" >
                            <el-input size="small" v-model="addProperty.procontact" class="noedit" readonly></el-input>
                        </el-form-item>
	                </el-col>

	                <el-col :span="12">
                        <el-form-item label="联系电话：" >
                            <el-input size="small" v-model="addProperty.procontactmobile" class="noedit"
                                      readonly></el-input>
                        </el-form-item>
	                </el-col>
          	    </el-row>

	            <el-row :gutter="15" >
	                <el-col :span="24">
                        <el-form-item label="店铺：" prop="coeid">
                            <org-select :searchParam="shopSelectParam" @doSelectOrg="getShop" selMode="SINGLE" :proType="0" v-if="showAddProperty"></org-select>
                        </el-form-item>
	                </el-col>

	            </el-row>

	            <el-row :gutter="15" >

	                <el-col :span="24">

                        <el-form-item label="地址：" >
                            <el-input size="small" v-model="addProperty.address" class="noedit" readonly></el-input>
                        </el-form-item>
	                </el-col>

	            </el-row>

	            <el-row :gutter="15" >
	                <el-col :span="12">
                        <el-form-item label="协议编号：" prop="sheetid">
                            <sl-input :input-val.sync="addProperty.sheetid" :maxlength="20"></sl-input>
                        </el-form-item>
	                </el-col>

	                <el-col :span="12">
                        <el-form-item label="协议有效期：" prop="mydate">
                            <!--<sl-date-picker :showPerpend="false"
                                            type="daterange"
                                            align="right"
                                            size="small"
                                            :dataType="9"
                                            placeholder="选择日期范围"
                                            :range-value.sync="addProperty.mydate">
	                            </sl-date-picker>-->
                            <el-date-picker type="daterange"
                                            size="small" style="width: 100%;"
                                            placeholder="选择日期范围"
                                            v-model="addProperty.mydate"
                                            format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
	                </el-col>


	            </el-row>

	            <el-row :gutter="15" >

	                <el-col :span="12">
                        <el-form-item label="签约人：" prop="contact">
                            <sl-input :input-val.sync="addProperty.contact"></sl-input>
                        </el-form-item>
	                </el-col>
	                <el-col :span="12">

                        <el-form-item label="签约人手机：" prop="contactMobile">
                            <sl-input :input-val.sync="addProperty.contactMobile" :onlynum="true" :maxlength="11"></sl-input>
                        </el-form-item>
	                </el-col>

	            </el-row>

	            <el-row :gutter="15" >
	                <el-col :span="12">
                        <el-form-item label="分成比例：" prop="percent">
                            <sl-input :input-val.sync="addProperty.percent" :maxlength="12" :onlyfloat="true" append="%" :maxval="100"></sl-input>
                        </el-form-item>
	                </el-col>

	                <el-col :span="12">
                        <el-form-item label="附件：" >
                            <!--<el-input size="small" v-model="myfilename" @focus="uploadAttachment()" ></el-input>-->

                            <div class="attach">{{myfilename}} <i class="el-icon-circle-close" @click="myfilename = ''" v-show="myfilename"></i></div>

                            <el-button size="small" @click="uploadAttachment()">上传</el-button>
	                        <input type="file" name="file" id="uploadfileinput" @change="upload($event, 'new')" v-show="false">
                        </el-form-item>
	                </el-col>
	            </el-row>
                </el-form>


            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doAddSave()" size="small">保存</el-button>
                <el-button type="primary" @click="doSaveCheck()" size="small">保存并审批</el-button>
                <el-button @click="doAddCancel()" class="dialog-cancel" size="small">取消</el-button>
            </span>

        </el-dialog>


        <el-dialog title="续签加盟协议" :visible.sync="showRenew" :close-on-click-modal="false" class="small-property">
            <el-form :model="reProperty" :rules="rules2" ref="renewForm" label-width="95px">
                <el-row :gutter="15">
                    <el-col :span="24">
                        <el-form-item label="加盟公司：" >
                            <el-input size="small" v-model="reProperty.ename" readonly class="noedit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="15">
                    <el-col :span="24">
                        <el-form-item label="店铺：" >
                            <el-input size="small" v-model="reProperty.coELName" readonly class="noedit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15" >
                    <el-col :span="24">
                        <el-form-item label="协议编号：" >
                            <el-input size="small" v-model="reProperty.sheetId" readonly class="noedit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="15" >
                    <el-col :span="24">
                        <el-form-item label="协议有效期：" prop="mydate">
                            <el-date-picker
                                    v-model="reProperty.mydate"
                                    type="date"
                                    size="small"
                                    @change="renewDate"
                                    style="width: 100%;"
                                    :picker-options="pickerOptions"
                                    placeholder="选择结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">

                    <el-col :span="24">
                        <el-form-item label="分成比例：" prop="percent">
                            <sl-input :input-val.sync="reProperty.percent" :maxlength="12" :onlyfloat="true" append="%" :maxval="100"></sl-input>
                        </el-form-item>
                    </el-col>


                </el-row>

                <el-row :gutter="15">

                    <el-col :span="24">
                        <el-form-item label="加盟签约人：" prop="contact">
                            <el-input size="small" v-model="reProperty.contact"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="15">
                    <el-col :span="24">
                        <el-form-item label="签约人手机：" prop="contactMobile">
                            <sl-input :input-val.sync="reProperty.contactMobile" :onlynum="true" :maxlength="11"></sl-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doReSure()" size="small">续签</el-button>
                <el-button @click="showRenew = false" class="dialog-cancel" size="small">取消</el-button>
            </span>
        </el-dialog>


        <!--<el-dialog title="导出" :visible.sync="showExp">
            <div style="text-align: center;">
                <el-button type="primary" @click="doExport('all')" size="small">导出全部</el-button>
                <el-button type="primary" @click="doExport('select')" size="small">导出已选项</el-button>
                <el-button type="primary" @click="doExport('current')" size="small">导出当前页</el-button>
                <el-button @click="showExp = false" class="dialog-cancel" size="small">取 消</el-button>
            </div>
        </el-dialog>-->

        <el-dialog title="附件" :visible.sync="showAttachment" size="tiny">
            <p class="el-dialog-p">
                <span v-if="!currentRenew.filename || currentRenew.filename === 'null'">暂无附件</span>
                <span v-else>{{currentRenew.oldFileName}}</span>
            </p>
            <input type="file" name="file" id="updateuploadfileinput" @change="upload($event, 'refresh')" v-show="false">
            <div style="text-align: center;" class="mt">
                <el-button type="primary" @click="doRefresh()" size="small" v-if="myModulePower.edit">更新</el-button>
                <el-button type="primary" @click="doDownload()" size="small" v-if="currentRenew.filename && currentRenew.filename !== 'null'">下载</el-button>
                <el-button @click="showAttachment = false" class="dialog-cancel" size="small">取 消</el-button>
            </div>
        </el-dialog>



        <!--<el-input type="file" @change="fileChange()"></el-input>-->

        <!--<el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :headers="headers"
                :http-request = "myHttpRequest"
                :before-upload="beforeUpload"
                >
            &lt;!&ndash;<el-button size="small" type="primary">点击上传</el-button>&ndash;&gt;
            <el-input ></el-input>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>-->
        <!--<form action="http://tvpn.myimpos.com:19090/vem/api/business/upload/pic/enclosure" method="post" enctype="multipart/form-data">-->
        <!--选择文件:<input type="file" name="file">-->
        <!--<input type="submit" value="提交">-->
        <!--</form>-->

    </div>


</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import SlGrid from '@/components/sl-grid.vue'
    import ExcelImportExport from '@/components/excel-import-export.vue';
    import SlTreeSelect from '@/components/sl-tree-select.vue';
    import SlAreaSelect from '../../../components/sl-areaSelect/sl-areaSelect.vue';
    import SlAutocomplete from '@/components/sl-autocomplete.vue';
    import {mapGetters} from 'vuex';
    import SlInput from '@/components/sl-input.vue';
    import axios from 'axios';
    import OrgSelect from '../../operations/common/orgSelect';
    import OrgSelectPartner from '../../operations/common/orgSelectPartner';
    import {getMyOrg} from '@/api/basic/org';
    import {uploadFile} from '@/api/common/picUpload';
    import {getGoodsTip} from '@/api/operations/goods';
    import {getPartnerList} from '@/api/basic/partner';
    import slCascaderArea from '@/components/sl-cascader-area/sl-cascader-area.vue';
    import {
        getPropertyComList,
        getPropertyProList,
        addProperty,
        checkProtocol,
        deleteProtocol,
        stopProtocol,
        renewProperty,
        getProtocolTip,
        changeProperty
    } from '@/api/business/joining';
    import ElForm from '../../../../node_modules/element-ui/packages/form/src/form'
    export default {
        components: {
            ElForm,
            Levelbar,
            SlGrid,
            SlInput,
            ExcelImportExport,
            SlTreeSelect,
            SlAreaSelect,
            SlAutocomplete,
            OrgSelect,
            OrgSelectPartner,
            slCascaderArea
        },
        name: 'joining',
        data () {
            let teleValid = (rule, value, callback) => {
                if (!(/^[0-9]{11}$/).test(value)) {
//                    console.log('12345555555555555==', !(/^[0-9]{11}$/).test(value));
                    callback(new Error('请输入11位有效的手机号码'));
                } else {
                    callback();
                }
            };

            let mydateValid = (rule, value, callback) => {
                if(!value) {
                    callback(new Error('请选择生效日期'));
                } else if(!value[0]) {
                    callback(new Error('请选择生效日期'));
                } else {
                    callback();
                }
            };
            return {
                load1: false,
                load2: false,
                load3: false,
                headers: {
                    'Content-Type': 'text/plain'
                },
                myfilename: '',
                cgridCol: [],// 按物业公司查看
                cgridVal: {
                    rows: [], footer: {
                        pageNum: 1,
                        pageSize: 25,
                        totalRecord: 0
                    }
                },
                cgridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true
                },
                selectedCGridData: [],
                pgridCol: [],// 按物业协议查看
                pgridVal: {
                    rows: [], footer: {
                        pageNum: 1,
                        pageSize: 25,
                        totalRecord: 0
                    }
                },
                pgridCfg: {
                    selectMode: 'MULT', // 'MULT'--多选，'SINGLE'--单选
                    frozen: true
                },
                selectedPGridData: [],
                queryKey: {areaId: '', eDate: '', status: -1},
                propertyTab: '按加盟公司查看',
                changeOrg: {areaId: ''},
                showAddProperty: false,
                showRenew: false,
                addProperty: {
                    procontact: '',
                    procontactmobile: '',
                    address: '',
                    sheetid: '',
                    contact: '',
                    contactMobile: '',
                    percent: '',
                    mydate: []
                },
                reProperty: {mydate: ''},
                goodsList: [],
                proSelectParam: {},
                shopSelectParam: {},
                currentRenew: {},
                waitCheck: 0,
                out: 0,
                showExp: false,
                expData: [],
                defaultVal: {},
                orgList: [],
                autoOrgParams: {
                    eid: '企业编码',
                    ename: '企业名称',
                    contact: '联系人',
                    ostatus: '状态'
                },
                showAttachment: false,

                rules1: {
                    eid: [
                        {required: true, message: '请选择加盟商', trigger: 'change', type: 'number'},
//                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    coeid: [
                        {required: true, message: '请选择店铺', trigger: 'change', type: 'number'}
                    ],
                    sheetid: [
                        {required: true, message: '请输入协议编号', trigger: 'blur'}
                    ],
                    mydate: [
                        { validator: mydateValid, trigger: 'blur', required: true }
                    ],
                    contact: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    contactMobile: [
                        { validator: teleValid, trigger: 'blur', required: true }
                    ],
                    percent: [
                        {required: true, message: '请输入分成比例', trigger: 'blur', type: 'number'}
                    ]


                },
                rules2: {
                    mydate: [
                        {required: true, message: '请选择生效日期', trigger: 'change'}
                    ],
                    contact: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    contactMobile: [
                        { validator: teleValid, trigger: 'blur', required: true }
                    ],
                    percent: [
                        {required: true, message: '请输入分成比例', trigger: 'blur', type: 'number'}
                    ]
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                }
            }
        },
        activated: function () {
            if (this.$route.query) {
                if (this.$route.query.from === 'partner') {
                    this.queryKey.eid = this.$route.query.coEid;
                    this.defaultVal = {eid: this.$route.query.coEid, ename: this.$route.query.coEName};
                    this.propertyTab = '按加盟协议查看';
                    this.getPropertyProtocol();
                }
            }
        },
        computed: {
            ...mapGetters([
                'userInfo',
                'user_power'
            ]),
            myModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === this.$route.meta.moduleid) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            },
            myPartnerModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === 14) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.proSelectParam = {
                    notIn: [],
                    orgType: 0
                }

                this.shopSelectParam = {
                    notIn: [],
                    orgType: 1
                }

//                this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                console.log(this.userInfo);

                this.cgridCol = [
                    {field: 'eid', name: '合作伙伴编码', width: '110', template: 'eid', fixed: true},
                    {field: 'ename', name: '加盟公司名称', width: '150',align:'left'},
                    {field: 'areaName', name: '所在区域', width: '200px',align:'left'},
                    {field: 'address', name: '地址',align:'left', minWidth: '200'},
                    {field: 'contact', name: '联系人', width: '80'},
                    {field: 'bDate', name: '合作开始日期', width: '130'},
                    {field: 'status', name: '状态', width: '60', template: 'shopstatus'},
                    {field: 'signedNum', name: '已签署协议', width: '100'},
                    {field: 'effectNum', name: '生效中协议', width: '100'},
                    {field: 'approvalpNum', name: '待审批协议', width: '100'},
                    {field: 'operate', name: '操作', width: '70', template: 'operate', fixed: 'right',align:'left'}

                ]


                this.pgridCol = [
                    {field: 'sheetId', name: '协议编号', width: '90'},
                    {field: 'ename', name: '加盟公司名称', width: '150',align:'left'},
                    {field: 'contact', name: '联系人', width: '80px'},
                    {field: 'coELName', name: '店铺', width: '150',align:'left'},
                    {field: 'address', name: '地址',align:'left', minWidth: '200'},
                    {field: 'editor', name: '加盟签约人', width: '100'},
                    {field: 'effectdate', name: '协议有效期', width: '260', template: 'effectdate'},
                    {field: 'percent', name: '销售分成比例', width: '115', template: 'ratio',align:'right'},
                    {field: 'status', name: '状态', width: '75', template: 'status'},
                    {field: 'operate', name: '操作', width: '130', template: 'operate', fixed: 'right' ,align:'left',isSort: false, class: 'operate'}
                ]

                this.expHeader = [
                    {field: 'sheetId', name: '协议编号', width: '90'},
                    {field: 'ename', name: '物业公司名称', width: '150',align:'left'},
                    {field: 'contact', name: '联系人', width: '80px'},
                    {field: 'coELName', name: '店铺', width: '150',align:'left'},
                    {field: 'address', name: '地址',align:'left', minWidth: '200'},
                    {field: 'editor', name: '物业签约人', width: '100'},
                    {field: 'effectdate', name: '协议有效期', width: '260'},
                    {field: 'percent', name: '销售分成比例', width: '115'},
                    {field: 'ostatus', name: '状态', width: '75'},
                ]

                this.getPropertyCompany();
                this.getProTip(1);

            })
        },
        methods: {
            // 获取协议提示
            getProTip(type) {
                getProtocolTip(type).then(res => {
                    if (res.retCode === 'SUCCESS') {
                        if (type === 1) {
                            this.waitCheck = res.result;
                        } else {
                            this.out = res.result;
                        }
                    } else {
                        this.$message.error(res.retMsg);
                    }
                }).catch(err => {
//                    this.$message(err);
                })
            },
            // 公司选择自动补全搜索
            autoQuery(key) {
                let opt = {
                    keyValue: key,
                    orgType: 0,
                    pageNum: 1,
                    pageSize: 10,
                    totalRecord: 0,
                    totalPage: 0
                }
                getPartnerList(opt).then(res => {
                    if(res.retCode === 'SUCCESS') {
                        this.orgList = res.result;
                        this.orgList.forEach((item, i) => {
                            this.$set(item, 'ostatus', item.status === 0 ? '禁用' : '启用');
                        })
                    } else {
                        this.$message.error(res.retMsg);
                    }
                }).catch(err => {
                    this.orgList = [];
//                    this.$message(res.retMsg);
                });
            },
            // 自动补全选中
            handleAutoSelect(sel) {
                console.log(sel);
                this.queryKey.eid = sel.eid;
                this.queryKey.clearInput = false;
            },
            // 获取按公司查看列表
            getPropertyCompany() {
                this.load2 = true;
                let opt = {
                    params: {
                        eid: this.queryKey.eid || -1,
                        areaId: parseInt(this.queryKey.areaId) || -1
                    },
                    pageNum: this.cgridVal.footer.pageNum || 1,
                    pageSize: this.cgridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getPropertyComList(opt).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.cgridVal.rows = res.result.result;
                        this.cgridVal.footer = {
                            pageNum: res.result.pageNum,
                            pageSize: res.result.pageSize,
                            totalRecord: res.result.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 查看物业公司详情
            toPartnerDetail(obj) {
                this.$router.push({path: '/basic/partnerDetail', query: {coEid: obj.eid, from: 'joining'}});
            },
            // 获取按协议查看列表
            getPropertyProtocol() {
                console.log('this.queryKey==', this.queryKey)
                this.load2 = true;
                let opt = {
                    params: {
                        eid: this.queryKey.eid,
                        areaId: parseInt(this.queryKey.areaId),
                        coEName: this.queryKey.shopName,
                        eDate: this.queryKey.eDate,
                        status: this.queryKey.status
                    },
                    pageNum: this.pgridVal.footer.pageNum || 1,
                    pageSize: this.pgridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                getPropertyProList(opt).then(res => {
                    this.load2 = false;
                    if (res.retCode === 'SUCCESS') {
                        this.pgridVal.rows = res.result.result;
                        this.pgridVal.rows.forEach((item, i) => {
                            this.$set(item, 'contactMobile', item.contactMobile);
                            this.$set(item, 'sheetId', item.sheetId.toString());
                        })

                        this.pgridVal.footer = {
                            pageNum: res.result.pageNum,
                            pageSize: res.result.pageSize,
                            totalRecord: res.result.totalRecord
                        }
                    } else {
                        this.$message.error(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 获取物业公司选择结果
            searchFn(val) {
                this.queryKey.eid = val.eid;
            },
            // 查询栏-地区选择
            getArea(area) {
                console.log(area);
                this.queryKey.areaId = area;
            },
            // 查询
            doSearch() {
                if (this.propertyTab === '按加盟公司查看') {
                    this.cgridVal.footer.pageNum = 1;
                    this.getPropertyCompany();
                } else {
                    console.log('2134654==', this.queryKey)
                    this.pgridVal.footer.pageNum = 1;
                    this.getPropertyProtocol();
                }
            },
            // 重置
            doReset() {
                this.cgridVal.footer.pageNum = 1;
                this.pgridVal.footer.pageNum = 1;
                this.queryKey.areaId = '';
                this.queryKey.comName = '';
                this.queryKey.eDate = '';
                this.queryKey.eid = -1;
                this.queryKey.status = -1;
//                this.queryKey.shopName = '';
                this.$set(this.queryKey, 'shopName', '');
                this.queryKey.clearInput = true;
                this.doSearch();
                console.log(this.cgridVal);
            },
            // 标签切换
            changeTab(tab) {
                console.log(tab);
                this.doSearch();
                if (tab === '按加盟公司查看') {
                    this.getProTip(1);
                } else {

                    this.getProTip(2);
                }

            },
            // 去审批
            toCheck() {
                this.pgridVal.footer.pageNum = 1;
                this.queryKey.areaId = '';
                this.queryKey.comName = '';
//                this.queryKey.shopName = '';
                this.queryKey.eid = -1;
                this.queryKey.eDate = '';
                this.$set(this.queryKey, 'shopName', '');
                this.queryKey.clearInput = true;

                this.propertyTab = '按加盟协议查看';
                this.queryKey.status = 0;
                this.getPropertyProtocol();
//                this.getPropertyProtocol();
            },
            // 去看看
            toLook() {
                this.pgridVal.footer.pageNum = 1;
                this.queryKey.areaId = '';
                this.queryKey.comName = '';
                this.queryKey.eid = -1;
//                this.queryKey.shopName = '';
                this.queryKey.status = 1;
                this.$set(this.queryKey, 'shopName', '');
                this.queryKey.clearInput = true;

                let getToday = new Date();

                getToday.setTime(getToday.getTime() + 3600 * 1000 * 24 * 7);

                this.queryKey.eDate = this.dateFormat(getToday, 'yyyy-MM-dd');

                this.getPropertyProtocol();
            },
            // 按物业协议查看-添加协议
            doAdd() {
                this.showAddProperty = true;
                console.log(this.$refs['addForm'])
//                this.$refs['newForm'].resetFields();
                /*setTimeout(() => {
                 console.log(this.$refs['addForm']);
                 this.$refs['addForm'].resetFields();
                 }, 50)*/

                this.addProperty.procontact = '';
                this.addProperty.procontactmobile = '';
                this.addProperty.address = '';
                this.addProperty.sheetid = '';
                this.addProperty.contact = '';
                this.addProperty.contactMobile = '';
                this.addProperty.percent = '';
                this.addProperty.mydate = this.getForOneYear();
                this.addProperty.filename = '';
                this.addProperty.myfilename = '';
                this.myfilename = '';

                setTimeout(() => {
                    document.getElementById('uploadfileinput').value = '';
                    console.log(document.getElementById('uploadfileinput').value);
                }, 200)
            },
            // 未来一年str
            getForOneYear() {
                const oneYearStart = new Date();
                let thisYear = oneYearStart.getFullYear();
                let oneYearLater = new Date();
                oneYearLater.setFullYear(thisYear + 1);
                let year1 = {
                    start: new Date(),
                    end: oneYearLater,
                };

                return [this.dateFormat(year1.start, 'yyyy-MM-dd') , this.dateFormat(year1.end, 'yyyy-MM-dd')];

            },
            // 按物业协议查看-批量删除协议
            doDelete() {
                let selected = '';
                if (!(this.selectedPGridData && this.selectedPGridData.length > 0)) {
                    this.$message('请选择协议！');
                } else {

                    this.selectedPGridData.forEach((item, i) => {
                        if (item.status === 0) {
                            if (selected === '') {
                                selected = item.objectid;
                            } else {
                                selected = selected + ',' + item.objectid;
                            }
                        }
                    });

                    if(!selected) {
                        this.$message('请选择状态为【待审批】的协议！');
                    } else {
                        this.$confirm('确认终止该协议吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {

                            deleteProtocol(selected).then(res => {
                                this.load2 = false;
                                if (res.retCode === 'SUCCESS') {
                                    this.$message.success(res.retMsg);
                                    this.getPropertyProtocol();
                                } else {
                                    this.$message.error(res.retMsg);
                                }
                            }).catch(err => {
                                this.load2 = false;
//                            this.$message(res.retMsg);
                            })
                        }).catch()
                    }


                }
            },
            // 按物业协议查看-批量审核协议
            doCheck() {
                let selected = '';
                if (!(this.selectedPGridData && this.selectedPGridData.length > 0)) {
                    this.$message('请选择协议！');
                } else {


                    this.selectedPGridData.forEach((item, i) => {
                        if (item.status === 0) {
                            if (selected === '') {
                                selected = item.objectid;
                            } else {
                                selected = selected + ',' + item.objectid;
                            }
                        }
                    })

                    if(!selected) {
                        this.$message('请选择状态为【待审批】的协议！');
                    } else {
                        this.$confirm('确认审核该协议吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {

                            this.load2 = true;
                            checkProtocol(selected).then(res => {
                                this.load2 = false;
                                if (res.retCode === 'SUCCESS') {
                                    this.$message.success(res.retMsg);
                                    this.getPropertyProtocol();
                                } else {
                                    this.$message.error(res.retMsg);
                                }
                            }).catch(err => {
                                this.load2 = false;
//                            this.$message(res.retMsg);
                            })
                        }).catch()
                    }


                }
            },
            // 按物业协议查看-批量终止协议
            doStop() {
                let selected = '';
                if (!(this.selectedPGridData && this.selectedPGridData.length > 0)) {
                    this.$message('请选择协议！');
                } else {
                    this.selectedPGridData.forEach((item, i) => {
                        if (item.status === 1) {
                            if (selected === '') {
                                selected = item.objectid;
                            } else {
                                selected = selected + ',' + item.objectid;
                            }
                        }
                    })
                    if(!selected) {
                        this.$message('请选择状态为【已审核】的协议！');
                    } else {
                        this.$confirm('确认终止该协议吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            stopProtocol(selected).then(res => {
                                this.load2 = false;
                                if (res.retCode === 'SUCCESS') {
                                    this.$message.success(res.retMsg);
                                    this.getPropertyProtocol();
                                } else {
                                    this.$message.error(res.retMsg);
                                }
                            }).catch(err => {
                                this.load2 = false;
//                            this.$message(res.retMsg);
                            })
                        }).catch()
                    }


                }
            },

            // 按物业公司查看
            doCSelected (data) {
                console.log('data==', data);
                this.selectedCGridData = data;
            },
            handleCSizeChange (size) {
                console.log('size==', size)
                this.cgridVal.footer.pageSize = size;
                this.getPropertyCompany();
            },
            handleCCurrentChange (page) {
                console.log('page==', page);
                this.cgridVal.footer.pageNum = page;
                this.getPropertyCompany();
            },
            // 按物业协议查看
            doPSelected (data) {
                console.log('data==', data);
                this.selectedPGridData = data;
            },
            handlePSizeChange (size) {
                console.log('size==', size);
                this.pgridVal.footer.pageSize = size;
                this.getPropertyProtocol();
            },
            handlePCurrentChange (page) {
                console.log('page==', page);
                this.pgridVal.footer.pageNum = page;
                this.getPropertyProtocol();
            },
            // 按物业公司查看--查看协议
            goToAgreement(obj) {
                console.log('789546==', obj)
                this.propertyTab = '按加盟协议查看';
                this.queryKey.eid = obj.eid;
                this.defaultVal = obj;
//                this.getPropertyProtocol();
            },
            // 按物业协议查看--表格中的单个审批
            doSingleCheck(obj) {

                this.$confirm('确认审核该协议吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.load2 = true;
                    checkProtocol(obj.objectid).then(res => {
                        this.load2 = false;
                        if (res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            obj.status = 1;
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load2 = false;
//                        this.$message(res.retMsg);
                    })
                }).catch()

            },
            // 按物业协议查看--表格中的单个终止
            doSingleStop(obj) {
                this.$confirm('确认终止该协议吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.load2 = true;
                    stopProtocol(obj.objectid).then(res => {
                        this.load2 = false;
                        if (res.retCode === 'SUCCESS') {
                            this.$message(res.retMsg);
                            obj.status = 2;
                        } else {
                            this.$message(res.retMsg);
                        }
                    }).catch(err => {
                        this.load2 = false;
//                        this.$message(res.retMsg);
                    })
                }).catch()


            },
            // 按物业协议查看--表格中的单个续签
            renew(obj) {
                console.log(obj);
                this.showRenew = true;
//                this.currentRenew = obj;
                this.reProperty = obj;

                this.$set(this.reProperty, 'mydate', obj.eDate)
//                this.reProperty.mydate = '';
            },
            // 按物业协议查看--表格中的单个附件
            attachment(obj) {
                this.showAttachment = true;
                this.currentRenew = obj;

                setTimeout(() => {
                    document.getElementById('updateuploadfileinput').value = '';
                    console.log(document.getElementById('updateuploadfileinput').value);
                }, 200)

            },
            // 新价格编辑按钮
            editprice(obj, id) {
                obj.isEditRatio = true;

            },
            // 新价格编辑input的change
            newPriceChange(event, obj) {
                console.log(event.target.value);
                if (event.target.value === '') {
                    console.log(typeof event.target.value);
                    obj.status = '0';
                }

            },
            // 添加物业协议-选择物业公司
            getProCom(val) {
                console.log(val);

                this.$set(this.addProperty, 'eid', val.eid);
                this.$set(this.addProperty, 'ename', val.ename);
                this.$set(this.addProperty, 'procontact', val.contact);
                this.$set(this.addProperty, 'procontactmobile', val.contactMobile);
            },
            // 添加物业协议-选择店铺
            getShop(val) {
                this.$set(this.addProperty, 'coeid', val.eid);
                this.$set(this.addProperty, 'coename', val.ename);
                this.$set(this.addProperty, 'address', val.address);
            },
            // 添加物业协议弹窗--保存
            doAddSave() {
                this.$refs['addForm'].validate((valid) => {

                    if(valid) {
                        console.log(this.addProperty);
                        this.addProperty.myfilename = this.myfilename;
                        let opt = {
                            eid: this.addProperty.eid,
                            ename: this.addProperty.ename,
                            sheetid: this.addProperty.sheetid,
                            coeid: this.addProperty.coeid,
                            coename: this.addProperty.coename,
                            bdate: typeof this.addProperty.mydate[0] === 'string' ? this.addProperty.mydate[0] : this.dateFormat(this.addProperty.mydate[0], 'yyyy-MM-dd'),
                            edate: typeof this.addProperty.mydate[1] === 'string' ? this.addProperty.mydate[1] : this.dateFormat(this.addProperty.mydate[1], 'yyyy-MM-dd'),
                            contact: this.addProperty.contact,
                            contactMobile: this.addProperty.contactMobile,
                            percent: this.addProperty.percent,
                            editor: this.userInfo.realName,
                            editordateStr: this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                            // checker: obj.checker
                            // checkerDateStr: obj.
                            status: 0,
                            filename: this.addProperty.myfilename ? this.addProperty.filename : '',
                            oldFileName: this.addProperty.myfilename ? this.addProperty.myfilename : ''
                        }
                        this.load1 = true;
                        addProperty(opt).then(res => {
                            this.load1 = false;
                            if (res.retCode === 'SUCCESS') {

                                this.$message('保存成功！');

                                this.showAddProperty = false;

                                this.doReset();

                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
//                    this.$message(res.retMsg);
                            this.load1 = false;
                        })
                    }

                })


            },
            // 添加物业协议弹窗--保存并审核
            doSaveCheck() {
                this.$refs['addForm'].validate((valid) => {

                    if (valid) {
                        this.addProperty.myfilename = this.myfilename;
                        let opt = {
                            eid: this.addProperty.eid,
                            ename: this.addProperty.ename,
                            sheetid: this.addProperty.sheetid,
                            coeid: this.addProperty.coeid,
                            coename: this.addProperty.coename,
                            bdate: typeof this.addProperty.mydate[0] === 'string' ? this.addProperty.mydate[0] : this.dateFormat(this.addProperty.mydate[0], 'yyyy-MM-dd'),
                            edate: typeof this.addProperty.mydate[1] === 'string' ? this.addProperty.mydate[1] : this.dateFormat(this.addProperty.mydate[1], 'yyyy-MM-dd'),
                            contact: this.addProperty.contact,
                            contactMobile: this.addProperty.contactMobile,
                            percent: this.addProperty.percent,
                            editor: this.userInfo.realName,
                            editordateStr: this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                            // checker: obj.checker
                            // checkerDateStr: obj.
//                    status: obj.status,
                            status: 1,
                            filename: this.addProperty.myfilename ? this.addProperty.filename : '',
                            oldFileName: this.addProperty.myfilename ? this.addProperty.myfilename : ''
                        }
                        this.load1 = true;
                        addProperty(opt).then(res => {
                            this.load1 = false;
                            if (res.retCode === 'SUCCESS') {
                                this.$message(res.retMsg);
                                this.showAddProperty = false;
                                this.doReset();
                                /*checkProtocol(res.result).then(res => {
                                    this.load1 = false;
                                    if (res.retCode === 'SUCCESS') {
                                        this.$message(res.retMsg);
                                        this.showAddProperty = false;
                                        this.doReset();
//                                obj.status = 1;
                                    } else {
                                        this.$message(res.retMsg);
                                    }
                                }).catch(err => {
                                    this.load1 = false;
//                            this.$message(res.retMsg);
                                })*/

                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.load1 = false;
//                    this.$message(res.retMsg);
                        })
                    }
                })



            },
            // 添加物业协议弹窗--取消
            doAddCancel() {
//                this.addProperty = {};
                this.showAddProperty = false;
            },
            renewDate(date) {
                this.reProperty.mydate = typeof this.reProperty.mydate === 'string' ? this.reProperty.mydate : this.dateFormat(this.reProperty.mydate, 'yyyy-MM-dd');
            },
            // 续签协议弹窗--确认续签
            doReSure() {
//                this.reProperty.mydate = typeof this.reProperty.mydate === 'string' ? this.reProperty.mydate : this.dateFormat(this.reProperty.mydate, 'yyyy-MM-dd')
                this.$refs['renewForm'].validate((valid) => {
                    if (valid) {
                        let opt = {
                            objectid: this.reProperty.objectid,
                            sheetId: this.reProperty.sheetId,
                            eDate: this.reProperty.mydate,
                            contact: this.reProperty.contact,
                            contactMobile: this.reProperty.contactMobile,
                            percent: this.reProperty.percent
                        }
                        this.load1 = true;
                        renewProperty(opt).then(res => {
                            this.load1 = false;
                            if (res.retCode === 'SUCCESS') {
                                this.$message('续签成功！');
                                this.doReset();
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.load1 = false;
//                    this.$message(res.retMsg);
                        })

                        this.showRenew = false;
                    }
                })
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
            },
            // 导出
            doExport(str) {
                if (str === 'current') {
                    this.expData = this.pgridVal.rows;
                    console.log(this.expData);
                    this.expData.forEach((item, i) => {
                        item.ostatus = item.status == 0 ? '待审批' : (item.status == 1 ? '已审批' : '已终止');
                        item.effectdate = item.bDate + '~' + item.eDate;
                    });
                    this.$refs.expImp.doExport();
                    this.showExp = false;
                } else if (str === 'select') {
                    console.log(this.selectedPGridData)
                    if(!(this.selectedPGridData && this.selectedPGridData.length > 0)) {
                        this.$message.error('请选择协议');
                    } else {
                        this.expData = JSON.parse(JSON.stringify(this.selectedPGridData));
                        this.expData.forEach((item, i) => {
                            item.ostatus = item.status == 0 ? '待审批' : (item.status == 1 ? '已审批' : '已终止');
                            item.effectdate = item.bDate + '~' + item.eDate;
                        });
                        this.$refs.expImp.doExport();
                        this.showExp = false;
                    }
                } else if (str === 'all') {
                    let opt = {
                        params: {
                            eid: -1,
                            areaId: -1,
                            coEName: ''
                        },
                        pageNum: 1,
                        pageSize: this.pgridVal.footer.totalRecord,
                        totalRecord: 0,
                        totalPage: 0
                    }
                    getPropertyProList(opt).then(res => {
                        if (res.retCode === 'SUCCESS') {
                            this.expData = res.result.result;
                            this.expData.forEach((item, i) => {
                                item.ostatus = item.status == 0 ? '待审批' : (item.status == 1 ? '已审批' : '已终止');
                                item.effectdate = item.bDate + '~' + item.eDate;
                            });
                            this.$refs.expImp.doExport();
                            this.showExp = false;
                        } else {
                            this.$message.error(res.retMsg);
                        }
                    }).catch(err => {
//                        this.$message(res.retMsg);
                    })
                }
            },
            // 附件输入框聚焦事件
            uploadAttachment() {
                document.getElementById('uploadfileinput').value = '';

                document.getElementById('uploadfileinput').click();
            },
            // 附件弹窗更新按钮点击事件
            doRefresh() {
                console.log(document.getElementById('updateuploadfileinput'));
                document.getElementById('updateuploadfileinput').click();
            },
            // 附件下载
            doDownload() {
                let a = document.createElement('a');
                a.href = this.userInfo.fileServerAddr + this.currentRenew.filename;
                a.download = this.currentRenew.oldFileName;
                a.click();
                this.showAttachment = false;
            },
            // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
            beforeUpload(file) {
                console.log('slie', file)

                const isLt2M = file.size / 1024 / 1024 < 1;
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 1MB!');
                }
                return isLt2M;
            },
            // 自定义上传
            /*myHttpRequest(fileObj){
             const _this = this;
             //                console.log('[店铺管理-店铺详情-店铺图片]图片文件信息=>', fileObj);
             // 生成图片名称
             var filename = this.userInfo.loginEid + '_' + this.userInfo.userId + '_' + new Date().getTime() + '.jpg';
             // 生成base64 data url
             var filedata = '';
             var fr = new FileReader();
             fr.readAsDataURL(fileObj.file);
             fr.onload = function (e) {
             filedata = e.target.result;
             _this.previewImageUrl = filedata;
             // 调用上传图片API
             return uploadFile({filedata, filename}).then((res) => {
             console.log(res);
             _this.$message('上传成功');
             //                        _this.imgUrl = res.result;
             //                        _this.dialogImageUrl = _this.userInfo.fileServerAddr + res.result;
             }).catch((err) => {
             console.log(err);
             })
             }
             },*/
            upload(event, str) {
                console.log('event, str==', event, str)
                let _this = this;
                let file = event.target.files[0];
                let isUpload = this.beforeUpload(file);

                if(isUpload) {
                    // 生成图片名称
                    var uploadFileName = file.name;
                    // 图片上传服务器url
                    var upLoadUrl = _this.userInfo.fileServerAddr + '/hobby_fileserver/upload/uploadFile.html';
                    // 读取文件
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        var arrayBufferFileData = reader.result;
                        var bufferFileData = _this.arrayBufferToBuffer(arrayBufferFileData);
                        var _param = {
                            fileName:  uploadFileName,
                            fileData:  bufferFileData
                        }
                        var param = _this.buildUploadParam(_param);
                        var paramStr = JSON.stringify(param);
                        axios.post(upLoadUrl, paramStr, {
                            responseType: 'text',
                            headers: {'Content-Type': 'text/plain'}
                        }).then(function (response) {

                            if(str === 'new') {
                                _this.$set(_this.addProperty, 'myfilename', file.name);
                                _this.$set(_this, 'myfilename', file.name);
                                _this.$set(_this.addProperty, 'filename', response.data.obj.storageName);

                                _this.$message('上传成功');
                            } else if(str === 'refresh') {


                                console.log('this.currentRenew==', _this.currentRenew)
                                _this.currentRenew.oldFileName = file.name;
                                _this.currentRenew.filename = response.data.obj.storageName;
                                let opt = {
                                    objectid: _this.currentRenew.objectid,
                                    eid: _this.currentRenew.eid,
                                    ename: _this.currentRenew.ename,
                                    sheetid: _this.currentRenew.sheetId,
                                    coeid: _this.currentRenew.coeid,
                                    coename: _this.currentRenew.coELName,
                                    bdate: _this.currentRenew.bDate,
                                    edate: _this.currentRenew.eDate,
                                    contact: _this.currentRenew.contact,
                                    contactMobile: _this.currentRenew.contactMobile,
                                    percent: _this.currentRenew.percent,
                                    editor: _this.currentRenew.editor,
                                    editordateStr: _this.currentRenew.editordateStr,
//                                editorMobile: _this.currentRenew.editorMobile,
                                    checker: _this.currentRenew.checker,
                                    checkerDateStr: _this.currentRenew.checkerDateStr,
                                    status: _this.currentRenew.status,
                                    filename: response.data.obj.storageName,
                                    oldFileName: file.name
                                }
                                _this.load1 = true;
                                changeProperty(opt).then(res => {
                                    _this.load1 = false;
                                    if (res.retCode === 'SUCCESS') {

                                        _this.$message('保存成功！');

                                        _this.showAttachment = false;

                                        _this.doReset();

                                    } else {
                                        _this.$message(res.retMsg);
                                    }
                                }).catch(err => {
//                    this.$message(res.retMsg);
                                    _this.load1 = false;
                                })
                            }

                            console.log(response);
                        }).catch(function (error) {
                            console.log(error);

                        });
                    }
                }

            },
            buildUploadParam: function (_param) {
                _param.thumbnails = _param.thumbnails || "";
                _param.encoding = _param.encoding || "hex";
                if (typeof _param.fileData === "string") {
                    _param.fileData = new Buffer(_param.fileData, _param.fileDataEncode);
                }
                var param = {
                    "storage": {
                        "owner": 'zdb@skylink',
                        "sign": '123456',
                        "ssoToken": ''
                    },
                    "file": {
                        "name": _param.fileName,
                        "format": _param.encoding,
                        "data": _param.fileData.toString(_param.encoding),
                        "thumbnails": _param.thumbnails
                    }
                };
                return param;
            },
            arrayBufferToBuffer: function (ab) {
                var isArrayBufferSupported = (new Buffer(new Uint8Array([1]).buffer)[0] === 1);
                if (isArrayBufferSupported) {
                    return new Buffer(ab);
                } else {
                    var buffer = new Buffer(ab.byteLength);
                    var view = new Uint8Array(ab);
                    for (var i = 0; i < buffer.length; ++i) {
                        buffer[i] = view[i];
                    }
                    return buffer;
                }
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

    .joiningIndex {

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

        .slic-content-info-tab {
            border-bottom: 1px solid #28e;

            .el-radio-button.is-active {

                .el-radio-button__inner {
                    color: #28e;
                    font-weight: bold;
                    background-color: #fff;
                }
            }

            .el-radio-button__inner {
                border-bottom: 0;
            }

            .el-radio-button:last-child .el-radio-button__inner {
                border-radius: 0 4px 0 0;
            }

            .el-radio-button:first-child .el-radio-button__inner {
                border-radius: 4px 0 0 0;
            }
        }


        .more-operate {
            color: #999;
            margin-left: 10px;
            cursor: pointer;
            position: relative;
            &:hover {
                .more-operate-container {
                    display: block;
                }
            }

            .more-operate-container {
                position: absolute;
                top: 10px;
                right: -20px;
                border: 1px solid #e1e1e1;
                border-radius: 5px;
                box-shadow: 0 0 10px 0 #e1e1e1;
                overflow: hidden;
                display: none;
                background-color: #fff;
                z-index: 999;
                /*position: relative;*/

                .more-operate-list {
                    width: 100px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    background-color: #fff;
                    color: #555;

                    &:hover {
                        background-color: #d5e9f7;
                        color: #28e;
                    }
                }

            }
        }

        .divider {
            margin: 0 5px;
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
            width: 90px;
            display: inline-block;
        }

        .sl-form-input {
            width: calc(100% - 100px);
            display: inline-block;
        }

        .addProperty {
            .el-dialog.el-dialog--small {
                width: 840px;
            }
        }

        /*@media screen and (max-width: 1600px) {
            .addProperty {
                .el-dialog.el-dialog--small {
                    width: 80%;
                }
            }
        }*/
        .el-dialog {
        	/*top: 40% !important;
        	transform: translateY(-50%) !important;*/
            .sl-date-picker__wrapper {
                .sl-date-picker__input {
                    width: 100%;
                }
                .el-input__inner {
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                }
            }
        }

        .small-property .el-dialog--small {
            width: 30%;
            min-width: 500px;
        }


        
        .el-dialog-p {
        	padding: 20px;
        	line-height: 22px;
        }

        .el-table {
            .el-table__row {
                &.hover-row {
                    .operate {
                        .cell {
                            overflow: visible;
                        }
                    }
                }
            }

            /*.el-table__fixed-body-wrapper {
                overflow: visible;
            }*/
        }

        .link {
            color: #28e;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
                color: #0152a3;
            }
        }


        .attach {
            width: 245px;
            border: 1px solid #bfcbd9;
            border-radius: 4px;
            height: 28px;
            padding: 0 10px;
            line-height: 28px;
            /*padding: 3px 10px;*/
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            margin-right: 5px;
            float: left;
            position: relative;

            i {
                cursor: pointer;
                color: #bfcbd9;
                position: absolute;
                top: 8px;
                right: 5px;
            }
        }

    }



</style>



