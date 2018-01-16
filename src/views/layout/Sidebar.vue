<template>
    <div>
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <el-menu mode="vertical" :default-active="defaultActive" @open="handleOpen" @close="handleClose" :collapse="!sidebar.opened" ref="elMenu">
            <sidebar-item :routes='permission_routers'></sidebar-item>
        </el-menu>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SidebarItem from './SidebarItem';
    import Hamburger from '@/components/Hamburger';
    export default {
        components: {SidebarItem, Hamburger},
        computed: {
            ...mapGetters([
                'sidebar',
                'permission_routers'
            ]),
            defaultActive(){
                return this.sidebar.opened ? this.$route.path : this.$route.name;
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar');
                let activedIndex = this.$refs.elMenu.activedIndex;
                this.$refs.elMenu.closeMenu(activedIndex);
            },
            // 处理打开一级菜单
            handleOpen(key, keyPath) {

            },
            // 处理关闭一级菜单
            handleClose(key, keyPath) {

            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
