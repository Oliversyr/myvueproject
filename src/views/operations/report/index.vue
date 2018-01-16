<template>
    <div class="report-wrap flex-col pst-rl">
        <keep-alive>
            <component :is="currentView" @switchTag="switchView"></component>
        </keep-alive>
    </div>
</template>

<script>
import Levelbar from 'views/layout/Levelbar';
import shopList from './template/shop-list';
import goodList from './template/good-list';

export default {
    components: {
        Levelbar,shopList, goodList,
    },
    data() {
        return {
            currentView: 'shopList',
        }
    },
    methods: {
        switchView(type){
            this.currentView = type;
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.report-wrap {
    height: 100%;
}


</style>