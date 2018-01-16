<template>
    <div class="shop-remark">
        <el-row class="mb-xsmall">
            <el-col :span="24">
                <div class="slic-form-til">店铺描述
                    <sl-icon-info :is-information-opened.sync="isShowDetail"></sl-icon-info>
                </div>
            </el-col>
        </el-row>
        <div v-show="isShowDetail">
            <editor ref="shopInfoRemark" :id="'editor_id'" height="250px" width="100%" :content="editorText"
                    pluginsPath="/static/kindeditor/plugins/"
                    :loadStyleMode="false"
                    :items="editorItems"
                    @on-content-change="onContentChange"
                    v-show="pageType !== 3"></editor>
            <div id="editor_label_id" v-html="editorText" v-show="pageType === 3"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'shop-remark',
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
        data () {
            return {
                isShowDetail: true,
                editorItems: [
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                    'insertunorderedlist', '|', 'emoticons', 'image', 'link', '|', 'undo', 'redo',
                    'fullscreen', 'source', 'about'
                ]
            }
        },
        computed: {
            editorText: function () {
                return this.shopInfo.profiles || '';
            }
        },
        methods: {
            onContentChange (val) {
                this.editorText = val;
                this.shopInfo.profiles = val;
                this.$emit('update:shopInfo', this.shopInfo);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .shop-remark {
        .slic-form-til {
            cursor: pointer;
        }
    }
</style>