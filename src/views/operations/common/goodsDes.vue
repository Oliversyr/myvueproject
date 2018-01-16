<template>
    <div class="goodsDescription">
        <div class="goodsDes-pic">
            <div class="goodsDes-pic-title">
                商品图片：（建议上传尺寸240x240像素，大小500kb以内的jpg、png图片，最多4张）
            </div>
            <div class="goodsDes-pic-content">
                <el-upload
                        :action="uploadUrl"
                        :headers="headers"
                        list-type="picture-card"
                        :before-upload = "beforeUpload"
                        :http-request = "myHttpRequest"
                        :on-preview="handlePictureCardPreview"
                        :show-file-list="true"
                        :file-list="fileList"
                        :on-change="fileChange"
                        :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>

        </div>

        <div class="goodsDes-edit">
            <div class="goodsDes-edit-title">
                商品描述：
            </div>
            <div class="goodsDes-edit-content">
                <!--<editor :id="'editor_id'" height="250px" width="100%" :content="editorText"
                        pluginsPath="/static/kindeditor/plugins/"
                        :loadStyleMode="false"
                        @on-content-change="onContentChange"></editor>-->
                <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入商品描述"
                        :maxlength="120"
                        @change="onContentChange"
                        v-model="editorText">
                </el-input>
            </div>


        </div>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex';
    import {uploadPic} from '@/api/common/picUpload';
    import {getFileNameSuffix} from 'utils/index';
    export default {
        name: 'goodsDescript',
        props: ['getResult', 'defaultVal'],
        data() {
            return {
                fileList: [],
                picList: [],
                uploadUrl: '',
                uploadFileName: '',
                param: {},
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                dialogVisible: false,
                dialogImageUrl: '',

                editorText: '',

            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        activated: function () {

        },
        methods: {
            // 富文本编辑器输入
            onContentChange(val) {
//                this.editorText = val;
                this.setResult();
            },
            // 文件改变时钩子
            fileChange(file, filelist) {
                console.log('sd',file, filelist);
                this.fileList = filelist;

            },
            // 可选参数, 文件列表移除文件时的钩子
            handleRemove(file, fileList) {
                console.log(file, fileList);

//                this.picList = fileList;
                let removeNameList = file.url.split('/');
                let removeName = removeNameList[removeNameList.length - 1];

                this.picList.forEach((item, i) => {
                    if(item.filename.indexOf(removeName) !== -1) {
                        this.picList.splice(i, 1);
                    }
                })
                console.log('this.picList==', this.picList);

                this.setResult();
            },
            // 可选参数, 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
            beforeUpload(file) {
                console.log('fileList==', this.fileList);
                if(this.fileList.length > 4) {
                    this.$message('最多只能上传四张图片！');
                    return false;
                }

                const isLt2M = file.size / 1024 < 500;
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 500kb!');
                }

                return isLt2M;
            },
            // 根据店铺图片信息和图片服务器地址生成前台展示的图片文件信息
            generateFileList(picList, fileServerAddr) {
                console.log('2222222222222222222222picList==', picList);
                let _fileList = [];
                picList.length > 0 && picList.forEach((item, index) => {
                    _fileList.push({
                        name: index,
                        url: fileServerAddr + (item.filename || item.name || item),
                        status: 'finished'
                    })
                })
                console.log('[店铺管理-店铺详情]前台展示的图片文件信息 fileList =>', _fileList);
                return _fileList;
            },
            // 自定义上传
            myHttpRequest(fileObj){
                const _this = this;
//                console.log('[店铺管理-店铺详情-店铺图片]图片文件信息=>', fileObj);
                var file = fileObj.file;
                // 生成图片名称
                var filename = this.userInfo.loginEid + '_' + this.userInfo.userId + '_' + new Date().getTime() + '.' + getFileNameSuffix(file.name);
                // 生成base64 data url
                var filedata = '';

                var fr = new FileReader();
                fr.readAsDataURL(fileObj.file);
                fr.onload = function(e) {
//                    filedata = e.target.result;
                    filedata = e.target.result.replace(/^data\:image\/(\w+);base64,/g, "");
                    // 调用上传图片API
                    return uploadPic({filedata, filename}).then((res) => {
                        console.log('res=====================',res, file, _this.picList);
                        let picObj = {
                            /*goodsId: '',
                            picIndex: '',*/
                            filename: res.result,
                            /*picFormat: '',
                            picAttr: '',
                            picWidth: '',
                            picHeight: '',
                            dataVersion: '',*/
                            uid: file.uid
                        }

                        _this.picList.push(picObj);
                        _this.setResult();

                    }).catch((err) => {
                        console.log(err);
                    })
                }
            },
            setResult() {


                let goodsDes = {
                    pic: this.picList,
                    text: this.editorText
                }
                this.$emit('getResult', goodsDes);
            },
        },
        watch: {
            defaultVal: {
                handler: function (obj) {
                    if(obj.pic) {
                        console.log('this.picList===', obj.pic)
                        /*obj.pic.forEach((item, i) => {
                            this.picList.push(JSON.parse(JSON.stringify({filename: item})));
                        })*/


                        this.picList = (JSON.parse(JSON.stringify(obj.pic)));

                        this.picList.forEach((item, i) => {
                            if(typeof item === 'string') {
                                item = {filename: item};
                            } else if(!item.filename && item.fileName) {
                                item.filename = item.fileName;
                            }
                        })

                        this.fileList = this.generateFileList(this.picList, this.userInfo.fileServerAddr);


                        console.log('this.picList===', this.picList)

                    }
                    if(obj.context) {
                        this.editorText = obj.context;
                    }
                },
                deep: true
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
.goodsDescription {
    flex: 1;
    display: flex;
    flex-direction: column;

    .goodsDes-pic {
        .goodsDes-pic-title {
            font-size: 14px;
            font-weight: bold;
            border-left: 3px solid #28e;
            padding-left: 10px;
            margin: 10px;
        }

        .goodsDes-pic-content {
            padding: 10px 10px;
            padding-top: 0;

            .goodsDes-pic-content-list {
                width: 240px;
                height: 240px;
                /*border: 1px solid #99a1a7;*/
                display: inline-block;
                margin-right: 10px;

                .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .avatar-uploader .el-upload:hover {
                    border-color: #20a0ff;
                }

                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 240px;
                    height: 100%;
                    line-height: 240px;
                    text-align: center;
                }

                .avatar {
                    width: 240px;
                    height: 240px;
                    display: block;
                }

                .el-progress-circle {
                    width: 240px !important;
                    height: 240px !important;
                }
            }
        }

    }

    .goodsDes-edit {
        display: flex;
        flex: 1;
        flex-direction: column;

        .goodsDes-edit-title {
            font-size: 14px;
            font-weight: bold;
            border-left: 3px solid #28e;
            padding-left: 10px;
            margin: 10px;
        }

        .goodsDes-edit-content {
            padding: 10px;
            flex: 1;
            display: flex;
            flex-direction: column;

            .richEditor{
                flex: 1;

                .ql-container {
                    height: calc(100% - 42px);
                }
            }

        }

    }
}
</style>