<template>
    <div class="pallet-wrap flex-col pst-rl">
        <levelbar>
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-货道管理】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以配置货柜货道，设置货道经营的商品，查看商品的库存信息。</p>
                    </div>
                </div>
            </span>
        </levelbar>
        <keep-alive>
            <component v-bind:is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
    import Levelbar from 'views/layout/Levelbar';
    import Pallet from './pallet';
    import PalletManager from './PalletManager/index';

    export default {
        components: {
            Levelbar,
            Pallet,
            PalletManager
        },
        data() {
            return {
                currentView: 'Pallet',
                palletInfo: {} // 店铺货道汇总某条信息记录
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .pallet-wrap {
        height: 100%;
    }
</style>