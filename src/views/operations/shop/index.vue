<template>
    <div class="shop-wrap flex-col pst-rl">
        <levelbar>
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【运营应用-店铺管理】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以查看到所有的店铺并对其进行管理。</p>
                        <p>1. 店铺列表，列示店铺信息；</p>
                        <p>2. 店铺资料维护；</p>
                        <p>3. 店铺商品维护，包括经营商品和价格；</p>
                        <p>4. 店铺设备维护；</p>
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
    import Shop from './shop.vue';

    export default {
        components: {
            Levelbar,
            Shop
        },
        data() {
            return {
                currentView: 'Shop'
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .shop-wrap {
        height: 100%;
    }
</style>