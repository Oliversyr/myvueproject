<template>
    <div class="footer">
        三只熊业务管理 v1.0.0 版 <span class="ml-small company">深圳三只熊信息技术有限公司</span>
        <a v-show="false">检查更新</a>
    </div>
</template>

<script>
    export default {
        name: 'AppFooter'
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-top: 1px solid #cccecf;
        .company {
            margin: 0 25px;
        }
        a {
            color: #288be9;
        }
    }
</style>