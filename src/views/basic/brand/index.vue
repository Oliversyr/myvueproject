<template>
    <div class="sl-page-container flex-col brandIndex" v-loading="load1">
        <div class="slic-head-panel">

            <div class="slic-head-panel">
                <levelbar>
                    <span slot="tip-content" class="icon-help-wrap pst-rl">
                        <icon-svg icon-class="wenhao-fill"></icon-svg>
                        <div class="icon-help-alert animated zoomIn">
                            <div class="icon-help-alert-til">
                                <span class="left">【基础管理-品牌管理】</span>
                            </div>
                            <div class="icon-help-alert-tcon">
                                <p>查看、新增、修改品牌信息</p>
                            </div>
                        </div>
                    </span>
                </levelbar>
                <div style="float: right">
                    <el-button type="primary" size="small" @click="addOrEditBrand('new')" v-if="myModulePower.add">新增品牌</el-button>
                </div>
            </div>
        </div>

        <div class="slic-content" style="padding-top: 0px;">
            <div class="slic-content-info">
                    <div class="sl-content-handle sl-search-panel" style="text-align: left">
                        <div class="slic-input-group sl-search-item" style="width: 335px;">
                            <el-input size="small" v-model="queryKey" :icon="queryKey ? 'circle-close' : ''" :on-icon-click="iconClose" placeholder="请输入品牌名称">
                                <template slot="prepend">品牌名称</template>
                            </el-input>
                        </div>

                        <div class="slic-input-group sl-search-item" style="width: 280px;">
                            <sl-select prepend="状态">
                                <el-select filterable v-model="brandStatus" placeholder="请选择需要查询的状态" size="small" slot="ELSelect">
                                    <el-option :key="1" :label="'全部'" :value="-1"></el-option>
                                    <el-option :key="2" :label="'启用'" :value="1"></el-option>
                                    <el-option :key="3" :label="'禁用'" :value="0"></el-option>
                                </el-select>
                            </sl-select>

                        </div>

                        <div class="slic-btn-group">
                            <el-button-group>
                                <el-button type="primary" size="small" @click="doSearch()">查询</el-button>
                                <el-button type="primary" size="small" @click="doReset()">重置</el-button>
                            </el-button-group>
                        </div>

                    </div>


                <div class="slic-content-info-down" v-loading="load2">
                    <div class="el-table__empty-text" v-if="brandList.length === 0">暂无数据</div>
                    <div class="sl-content-card" v-for="(bra, index) in brandList" :key="index">
                        <div class="sl-content-card-main">
                            <div class="sl-content-card-title">
                                <span class="sl-content-card-name">
                                    {{bra.brandName}}
                                </span>
                            </div>
                            <div class="sl-content-card-body">
                                <!--<img :src="bra.picFile">-->
                                <img :src="userInfo.fileServerAddr + bra.picFile" v-if="bra.picFile">
                                <img src="../../../assets/img/img_goods_default.png" v-else>
                            </div>
                        </div>
                        <div class="sl-content-card-oper" v-if="myModulePower.edit">
                            <span class="sl-content-card-oper-btn" @click="addOrEditBrand('edit', bra)">修改</span>
                            <span class="sl-content-card-oper-btn">|</span>
                            <span class="sl-content-card-oper-btn" @click.stop="operateBrand(bra)">{{bra.status == 1 ? '禁用' : '启用'}}</span>
                        </div>

                        <i class="status-mark-forbid" v-if="bra.status == 0">已禁用</i>
                    </div>



                </div>

                <div v-if="showEditBrand">
                    <el-dialog :title="brandTitle" size="tiny" :visible.sync="showEditBrand" :close-on-click-modal="false" >
                        <el-row :gutter="20" class="sl-form" v-loading="load3">
                            <el-col :span="8" style="text-align: center;">
                                <!--<el-upload
                                        :action="userInfo.fileServerAddr + '/hobby_fileserver/upload/uploadFile.html'"
                                        :headers="headers"
                                        :data="param"
                                        list-type="picture-card"
                                        :before-upload = "beforeUpload"
                                        :show-file-list="false"
                                        :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove">
                                    <img width="100%" style="height: 100%;" :src="dialogImageUrl" alt="" v-if="dialogImageUrl">
                                    <i class="el-icon-plus" v-else></i>
                                </el-upload>
                                <el-dialog v-model="dialogVisible" size="tiny">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>-->


                                <el-upload
                                        class="avatar-uploader"
                                        style="width: 150px;"
                                        :action="uploadUrl"
                                        :show-file-list="false"
                                        :headers="headers"
                                        :http-request = "myHttpRequest"
                                        :before-upload="beforeUpload">
                                    <span class="remove-icon" @click.stop="handleRemove($event)" v-if="previewImageUrl">X</span>
                                    <img v-if="previewImageUrl" :src="previewImageUrl" class="avatar">
                                    <!--<img :src="userInfo.fileServerAddr + brandInfo.picFile" v-else-if="brandInfo.picFile">-->
                                    <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                                </el-upload>
                                <!--<div style="text-align: center;">
                                    <el-button type="primary" @click="uploadImg()" size="small">上 传</el-button>
                                    <el-button @click="removeImg()" class="dialog-cancel" size="small">移 除</el-button>
                                </div>-->

                            </el-col>
                            <el-col :span="16">
                                <el-row  class="sl-form-row">
                                    <el-col :span="24">
                                        <label class="sl-form-label">品牌名称：</label>
                                        <span class="sl-form-input">
                                        <el-input size="small" v-model.trim="brandInfo.brandName"></el-input>
                                    </span>

                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 20px;" class="sl-form-row">
                                    <el-col :span="24">
                                        <label class="sl-form-label" style="vertical-align: top;">备注：</label>
                                        <el-input
                                                class="sl-form-input"
                                                type="textarea"
                                                v-model="brandInfo.notes"
                                                :autosize="{ minRows: 4, maxRows: 4}"
                                                placeholder="请输入内容"
                                                :maxlength="32">
                                        </el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                        <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="editSure()" size="small" :disabled="load3">确 定</el-button>
                        <el-button @click="showEditBrand = false" class="dialog-cancel" size="small" :disabled="load3">取 消</el-button>
                    </span>
                    </el-dialog>
                </div>


                <el-pagination
                        class="brand-pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagination.pageNum"
                        :page-sizes="[10, 20, 25, 50, 70]"
                        :page-size="pagination.pageSize"
                        layout="total, prev, pager, next, jumper, sizes"
                        :total="pagination.totalRecord">
                </el-pagination>




            </div>
        </div>




    </div>


</template>

<script>
    import Levelbar from '@/views/layout/Levelbar.vue';
    import {mapGetters} from 'vuex';
    import {buildUploadParam, getFileNameSuffix} from 'utils/index';
    import {uploadPic} from '@/api/common/picUpload';
//    import SlUpload from '@/components/sl-upload.vue';

    import {getBrandList, getBrandDetail, addBrand, operateBrand, changeBrand} from '@/api/basic/brand';
    export default {
        components: {
            Levelbar,
//            SlUpload
        },
        name: 'brand',
        data () {
            return {
                load1: false,
                load2: false,
                load3: false,
                pagination: {
                    pageNum: 1,
                    pageSize: 20,
                    totalRecord: 0
                },
                brandStatus: -1,
                queryKey: '',
                brandTitle: '',
                partnerInfo: {areaId:''},
                brandList: [],
                brandInfo: {},
                showEditBrand: false,
                imgUrl: '',
                operate: '',
                uploadUrl: '',
                fileSerUrl: '',
                previewImageUrl: '',
                headers: {
                    'Content-Type': 'text/plain'
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.getBrand();

                console.log(this.userInfo)
//                this.userInfo.fileServerAddr = "http://192.168.20.176:80/hobby_fileserver/upload/uploadFile.html";
//                http://192.168.20.176:80//home/filestorage/publicstorage1/zdb/d20170919/1/f650fec20442968c70539acec19c8bd5.png
            })
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
            }
        },
        methods: {
            // 获取品牌列表
            getBrand() {
                this.load2 = true;
                const _this = this;

                let opt = {
                    brandName: this.queryKey,
                    status: this.brandStatus,
                    pageNum: this.pagination.pageNum || 1,
                    pageSize: this.pagination.pageSize || 25,
                    totalRecord: this.pagination.totalRecord || 0
                }
                getBrandList(opt).then(res => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.brandList = res.result;
                        this.pagination.pageNum = res.pageNum;
                        this.pagination.pageSize = res.pageSize;
                        this.pagination.totalRecord = res.totalRecord;

                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                });

            },
            // 新增或修改品牌
            addOrEditBrand(str, obj) {
                console.log(obj)

//                this.$router.push({path: '/basic/deviceDetail'});
                this.operate = str;
                if(str === 'new') {
                    this.brandTitle = '新增品牌';
                    this.brandInfo = {
                        brandName: '',
                        picFile: '',
                        status: 1,
                        notes: ''
                    };
                    this.previewImageUrl = '';
                    this.imgUrl = '';
                } else if(str === 'edit') {
                    this.brandTitle = '编辑品牌';
                    this.brandInfo = JSON.parse(JSON.stringify(obj));
                    this.imgUrl = obj.picFile;
                    this.previewImageUrl = obj.picFile ? this.userInfo.fileServerAddr + obj.picFile : '';
                }

                this.showEditBrand = true;
            },
            // 弹框确定
            editSure() {
                if(!this.brandInfo.brandName) {
                    this.$message('请输入品牌名称！');
                } else {
                    this.load1 = true;
                    let opt = {
//                    brandId: obj.brandId,
                        picFile: this.imgUrl,
                        brandName: this.brandInfo.brandName,
//                    status: 1,
                        notes: this.brandInfo.notes
                    }
                    if(this.operate === 'new') {
                        addBrand(opt).then(res => {
                            this.load1 = false;
                            if(res.retCode === 'SUCCESS') {
                                this.$message('新增品牌成功!');
                                this.getBrand();
                                this.showEditBrand = false;
                            } else {
                                this.$message(res.retMsg);
                            }
                        }).catch(err => {
                            this.load1 = false;
//                        this.$message(res.retMsg);
                        });
                    } else {
                        opt.brandId = this.brandInfo.brandId;
                        opt.status = this.brandInfo.status;
                        changeBrand(opt).then(res => {
                            this.load1 = false;
                            if(res.retCode === 'SUCCESS') {
                                this.$message('修改成功！');
                                this.getBrand();
                                this.showEditBrand = false;
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
            // 查询
            doSearch() {
                this.pagination.pageNum = 1;
                this.pagination.totalRecord = 0;
                this.getBrand();
            },
            iconClose(str) {
                this.queryKey = '';
            },
            //重置
            doReset () {
                this.pagination.pageNum = 1;
                this.pagination.totalRecord = 0;
                this.brandStatus = -1;
                this.queryKey = '';
                this.getBrand();
            },
            // 禁用/启用
            operateBrand(obj) {
                this.load2 = true;
                console.log('obj==', obj)
                let opt = {
                    brandId: obj.brandId,
                    opType: obj.status == 1 ? 0 : 1
                };
                operateBrand(opt.brandId, opt.opType).then(res => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.$message('操作成功');
                        if(obj.status == 1) {
                            obj.status = 0;
                        } else {
                            obj.status = 1;
                        }
                    } else {
                        this.$message('操作失败');
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                });
            },

            /*// 可选参数, 文件列表移除文件时的钩子
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            // 可选参数, 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },*/
            // 移除图片
            handleRemove(event) {
                event.stopPropagation();
//                this.previewImageUrl = '';
//                this.imgUrl = '';
                this.brandInfo.picFile = '';
                this.$set(this, 'previewImageUrl', '');
                this.$set(this, 'imgUrl', '');
            },

            // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 0.5;
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 500KB!');
                }
                return isLt2M;
            },
            // 自定义上传
            myHttpRequest(fileObj){
                const _this = this;
                this.load3 = true;
                console.log(fileObj)

                var file = fileObj.file;
                // 生成图片名称
                var filename = this.userInfo.loginEid + '_' + this.userInfo.userId + '_' + new Date().getTime() + '.' + getFileNameSuffix(file.name);
//                var filename = fileObj.file.name;
                // 生成base64 data url
                var filedata = '';
                var fr = new FileReader();
                fr.readAsDataURL(fileObj.file);
                fr.onload = function(e) {
                    filedata = e.target.result.replace(/^data\:image\/(\w+);base64,/g, "");

                    // 调用上传图片API
                    return uploadPic({filedata, filename}).then((res) => {
                        _this.load3 = false;
                        console.log(res);
                        _this.$message('上传成功');
                        _this.imgUrl = res.result;
                        _this.previewImageUrl = _this.userInfo.fileServerAddr + res.result;
//                        _this.dialogImageUrl = _this.userInfo.fileServerAddr + res.result;
                    }).catch((err) => {
                        _this.load3 = false;
                        console.log(err);
                    })
                }
            },
            // 每页显示条数
            handleSizeChange (size) {
                this.pagination.pageSize = size;

                this.getBrand();
            },
            // 页码改变
            handleCurrentChange (page) {
                this.pagination.pageNum = page;

                this.getBrand();
            }



        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .brandIndex {
        .slic-content-info{
            width: calc(100% - 286px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding: 0;
            position: relative;

            .brand-pagination {
                position: absolute;
                bottom: 0;
                right: 0px;
            }
        }

        .sl-content-handle{
            background-color: #fff;
            border-radius: 5px 5px 0 0;
        }

        .slic-content-info-down{
            max-height: calc(100% - 120px);
            overflow-x: hidden;
            overflow-y: auto;
        }

        .sl-content-card{
            height: 200px;
            width: 120px;
            margin-bottom: 10px;
            display: inline-block;
            margin-right: 15px;
            cursor: pointer;
            vertical-align: top;
            position: relative;

            .status-mark-forbid {
                position: absolute;
                top: 45px;
                right: 10px;
                font-style: normal;
                padding: 5px;
                border: 2px solid #facbcb;
                color: #facbcb;
                border-radius: 3px;
                transform: rotateZ(30deg);
            }

            .sl-content-card-main{
                height: 170px;
                width: 100%;

                .sl-content-card-title{
                    height: 50px;
                    line-height: 50px;
                    background-color: #eaeaea;
                    border-radius: 5px 5px 0 0;

                    span{
                        display: inline-block;
                    }

                    .sl-content-card-name{
                        font-size: 16px;
                        font-weight: bold;
                        margin-left: 20px;
                    }

                    .sl-content-card-num{
                        float: right;
                        margin-right: 20px;
                    }
                }

                .sl-content-card-body{
                    background-color: #fff;
                    border-radius: 0 0 5px 5px;
                    height: 120px;
                    padding: 15px 15px;

                    .sl-content-card-body-list{
                        margin-bottom: 5px;
                    }

                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            .sl-content-card-oper{
                height: 30px;
                line-height: 30px;


                .sl-content-card-oper-btn{
                    color: #999;
                    margin-right: 10px;
                    display: none;
                }

                .sl-content-card-oper-btn:hover{
                    color: #288be9;
                }
            }
        }

        .sl-content-card:hover{
            .sl-content-card-title{
                background-color: #dcebfa;
                color: #288be9;
            }

            .sl-content-card-oper-btn{
                display: inline-block;
            }


        }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 150px;
            height: 150px;

            .remove-icon {
                width: 14px;
                height: 14px;
                color: #000;
                position: absolute;
                top: 0;
                right: 0;
                z-index: 999;
                display: none;
                cursor: pointer;
            }

            &:hover {
                .remove-icon {
                    display: block;
                }
            }

            img,i {
                width: 100%;
                height: 100%;
                line-height: 150px;
            }
        }
        .avatar-uploader .el-upload:hover {
            border-color: #20a0ff;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

		.el-dialog--tiny {
		    width: 660px;
		}

    }
    
</style>


