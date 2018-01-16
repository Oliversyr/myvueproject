<template>
    <div class="dashboard-container" v-show="false">
        <div class='dashboard-text'>name:{{userInfo.realName}}</div>
        <div class='dashboard-text'>telePhone:{{userInfo.telePhone}}</div>
        <div class='dashboard-text'>email:{{userInfo.email}}</div>
        <div class='dashboard-text'>loginEid:{{userInfo.loginEid}}</div>
        <div class='dashboard-text'>userId:{{userInfo.userId}}</div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getModuleList} from '@/api/common/dashboard';
    export default {
        name: 'dashboard',
        computed: {
            // 使用对象扩展操作符把 getter 混入到 computed 中
            // mapGetters工具函数会将store中的getter映射到局部计算属性中。
            ...mapGetters([
                'name',
                'roles',
                'userInfo'
            ])
        },
        mounted: function () {
            this.$nextTick(function () {

            })
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .dashboard {
        &-container {
            margin: 30px;
        }
        &-text {
            font-size: 30px;
            line-height: 46px;
        }
    }
</style>
