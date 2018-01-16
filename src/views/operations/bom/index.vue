<template>
    <div class="bom-wrap flex-col pst-rl">
        <levelbar>
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-组合商品管理】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以维护组合商品，新建、修改、禁用/启用。</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <keep-alive>
            <component :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
    import Levelbar from 'views/layout/Levelbar';
    import Bom from './bom';
    import BomItem from './bom-item';

    export default {
        components: {
            Levelbar,
            Bom,
            BomItem
        },
        data() {
            return {
                currentView: 'Bom',
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .bom-wrap {
        height: 100%;
    }
</style>