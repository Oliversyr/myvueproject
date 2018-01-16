<template>
    <div class="group-wrap flex-col pst-rl">
        <levelbar>
            <span slot="tip-content" class="icon-help-wrap pst-rl">
                <icon-svg icon-class="wenhao-fill"></icon-svg>
                <div class="icon-help-alert animated zoomIn">
                    <div class="icon-help-alert-til">
                        <span class="left">【基础管理-店组管理】</span>
                    </div>
                    <div class="icon-help-alert-tcon">
                        <p>您可以查看到所有的店组并对其进行管理。</p>
                        <p>1. 创建和维护店组信息；</p>
                        <p>2. 创建和维护店组模版，设备、店铺商品、货柜商品；</p>
                        <p>3. 查看店组店铺，添加店铺到店组；</p>
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
    import Group from './group.vue';
    import GroupItem from './group-shop-item.vue';
    import ManagerTemplate from './ManagerTemplate/index.vue';

    export default {
        components: {
            Levelbar,
            Group,
            GroupItem,
            ManagerTemplate
        },
        data() {
            return {
                currentView: 'Group',
                groupInfo: {}
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .group-wrap {
        height: 100%;
    }

</style>