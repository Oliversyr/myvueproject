<template>
    <section class="app-main">
        <keep-alive>
            <router-view v-if="!$route.meta.noKeepAlive"></router-view>
        </keep-alive>

        <router-view v-if="$route.meta.noKeepAlive"></router-view>
    </section>
</template>

<script>

    import Levelbar from './Levelbar';
    export default {
        name: 'AppMain',
        components: {
            Levelbar
        }
    }
</script>

<style rel="stylesheet/scss">
    .app-main{
        position: absolute;
        top: 42px;
        bottom: 20px;
        width: 100%;
        padding: 10px 15px 0 15px;
        /*height: calc(100% - 30px);*/
        box-sizing: border-box;
        overflow-y: auto;
    }
</style>

