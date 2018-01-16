<template>
    <div class="shop-imgs">
        <el-row class="mb-xsmall" >
            <el-col :span="24">
                <div class="slic-form-til">店铺图片 <sl-icon-info :is-information-opened.sync="isShowDetail"></sl-icon-info></div>
                <div class="slic-form-tip">建议图片上传500KB以内</div>
            </el-col>
        </el-row>
        <div v-show="isShowDetail">
            <el-upload
                    :action="uploadUrl"
                    :headers="headers"
                    list-type="picture-card"
                    :before-upload="beforeUpload"
                    :http-request="myHttpRequest"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :file-list="shopInfo.MYFILELIST"
                    :disabled="isDisabledUpload"
                    :class="{'is-hidden-upload' : isHiddenUpload}">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog v-model="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {uploadPic} from '@/api/common/picUpload';
    import {buildUploadParam, getFileNameSuffix} from 'utils/index';

    export default {
        name: 'shop-imgs',
        props: {
            pageType: {// 1 新增; 2 编辑; 3 查看
                type: Number,
                default: 3
            },
            shopInfo: {
                type: Object,
                required: true,
                default: {}
            }
        },
        data() {
            return {
                isShowDetail: true,
                uploadUrl: '',
                uploadFileName: '',
                param: {},
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                isDisabledUpload: false,
                dialogVisible: false,
                dialogImageUrl: ''
            };
        },
        computed: {
            isHiddenUpload: function () {
                return this.pageType === 3 || (this.shopInfo.picList && this.shopInfo.picList.length >= 4);
            }
        },
        methods: {
            // 可选参数, 文件列表移除文件时的钩子
            handleRemove(file, fileList) {
                if(!file) return;
                let fileName = file.url.split('/')[file.url.split('/').length - 1];
                this.shopInfo.picList.forEach((item, index) => {
                    let _fileName = item.fileName.split('/')[item.fileName.split('/').length - 1];
                    if (_fileName === fileName) {
                        this.shopInfo.picList.splice(index, 1);
                    }
                });
            },
            // 可选参数, 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
            beforeUpload(file) {
                const isLt500K = file.size / 1024 <= 500;
                if (!isLt500K) {
                    this.$message.error('上传图片大小不能超过 500KB!');
                }
                return isLt500K;
            },
            // 自定义上传
            myHttpRequest(fileObj){
                let _this = this;
                _this.isDisabledUpload = true;
                var file = fileObj.file;
                // 生成图片名称
                var filename = this.$parent.userInfo.loginEid + '_' + this.$parent.userInfo.userId + '_' + new Date().getTime() + '.' + getFileNameSuffix(file.name);
                // 生成base64 data url
                var filedata = '',
                    fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = function (e) {
                    filedata = e.target.result.replace(/^data\:image\/(\w+);base64,/g, "");
                    // 调用上传图片API
                    return uploadPic({filedata, filename}).then((res) => {
                        console.log('[店铺管理-店铺详情-店铺图片]上传成功返回信息=>', res);
                        let picInfo = {
                            eid: _this.shopInfo.eid,
                            picIndex: _this.shopInfo.picList.length + 2,
                            fileName: res.result,
                            picFormat: 1,
                            picAttr: 1,
                            picWidth: 1,
                            picHeight: 1,
                            dataVersion: 1
                        }
                        _this.shopInfo.picList.push(picInfo);
                        _this.isDisabledUpload = false;
                        _this.$emit('update:shopInfo', _this.shopInfo);
                    }).catch((err) => {
                        console.log(err);
                        _this.isDisabledUpload = false;
                    })
                }
            }
        },
        activated() {
            this.isHiddenUpload = this.shopInfo.picList && this.shopInfo.picList.length >= 4;
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .shop-imgs {
        .slic-form-til {
            cursor: pointer;
        }
        .slic-form-tip {
            position: absolute;
            top: 0;
            left: 100px;
        }
        .is-hidden-upload {
            .el-upload, .el-upload-list__item-actions {
                display: none;
            }
        }
    }
</style>