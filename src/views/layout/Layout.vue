<template>
    <div class="app-wrapper" :class="{collapse: !sidebar.opened}">
        <div class="header-wrapper">
            <app-header></app-header>
        </div>
        <div class="main-wrapper">
            <div class="sidebar-wrapper">
                <sidebar class="sidebar-container"></sidebar>
            </div>
            <div class="main-container">
                <tabs-view></tabs-view>
                <app-main></app-main>
                <app-footer></app-footer>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {Sidebar, AppMain, AppHeader, AppFooter} from '@/views/layout';
    import TabsView from './TabsView';

    export default {
        name: 'layout',
        components: {
            Sidebar,
            TabsView,
            AppMain,
            AppHeader,
            AppFooter
        },
        computed: {
            ...mapGetters([
                'sidebar'
            ])
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .app-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        &.collapse {
            .sidebar-container {
                width: 64px!important;
                overflow: inherit!important;
                .el-submenu  .el-submenu__title {
                    text-align: center;
                    .svg-icon {
                        margin: 0;
                        vertical-align: middle;
                    }
                    .el-submenu__icon-arrow {
                        display: none;
                    }
                    span {
                        height: 0;
                        width: 0;
                        overflow: hidden;
                        visibility: hidden;
                        display: inline-block;
                    }
                }
            }
            .main-container {
                margin-left: 64px!important;
            }
        }
        .header-wrapper {
            flex: 0 1 auto;
            background: #13222c url(../../assets/img/top_Gradient.png) right no-repeat;
            color: #fff;
        }
        .main-wrapper {
            display: flex;
            flex-direction: row;
            flex: 1;
            background-color: #f5f5f5;
            .sidebar-wrapper {
                flex: 0 1 auto;
                display: flex;
                flex-direction: column;
                .sidebar-container {
                    position: absolute;
                    top: 50px;
                    bottom: 0;
                    width: 200px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    /*border-right: 1px solid #000;*/
                    background: #333f51;
                    .hamburger-container {
                        padding: 8px 0;
                        text-align: center;
                        background-color: #333f51;
                        color: white;
                    }
                    .el-menu {
                        background-color: #283343;
                        .el-menu-item, .el-submenu__title {
                            color: #fff;
                        }
                        .el-submenu .el-menu-item.is-active, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
                            background-color: #2288ee;
                            font-weight: bold;
                        }
                    }
                }
            }
            .main-container {
                display: flex;
                flex-direction: column;
                flex: 1;
                position: relative;
                margin-left: 200px;
            }
        }
    }
</style>
