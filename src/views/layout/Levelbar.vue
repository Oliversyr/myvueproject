<template>
    <el-breadcrumb class="levelbar " separator=">">
        <el-breadcrumb-item v-for="(item,index)  in MyLevelList" :key="item"
                            :class="{active: index === MyLevelList.length-1}">
            <span>{{item.name}}</span>
        </el-breadcrumb-item>
        <slot name="tip-content"></slot>
    </el-breadcrumb>
</template>

<script>
    export default {
        created() {
            this.getBreadcrumb()
        },
        props: {
            levelList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                MyLevelList: []
            }
        },
        methods: {
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => item.name);
                this.MyLevelList = this.levelList.length > 0 ? this.levelList.map((item) => {
                    return {name: item}
                }) : matched;
            }
        },
        watch: {
            $route() {
                this.getBreadcrumb();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .levelbar.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 28px;
        cursor: text;
        .el-breadcrumb__item {
            .el-breadcrumb__item__inner span {
                color: #999 !important;
            }
            &.active {
                margin-right: 5px;
                .el-breadcrumb__item__inner span {
                    color: #555 !important;
                    font-weight: 700 !important;
                }
                .el-breadcrumb__separator {
                    display: none;
                }
            }
        }
    }
</style>
