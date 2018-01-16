<template>
    <div class='tabs-view-container'>
        <el-tabs type="card" v-model="activeTabName" class="tabs-nopadding" @tab-remove="closeViewTabs"
                 @tab-click="goToTab">
            <el-tab-pane v-for="(tab, index) in tabsModel.menus" :label="tab.title" :name="tab.name"
                         :closable="tab.name!='home'" :key="'tabs-'+ index">
            </el-tab-pane>
        </el-tabs>
        <div class="tabs-view-contextmenu">
            <icon-svg iconClass="gengduo" @mouseenter.native.prevent="showMenu"></icon-svg>
            <sl-contextmenu :contextMenuData="contextMenuData"
                            :transferElem="transferElem"
                            @closeCurrentTab="closeCurrentTab()"
                            @closeOtherTabs="closeOtherTabs()"
                            @closeAllTabs="closeAllTabs()"></sl-contextmenu>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                transferElem: null,
                contextMenuData: {
                    menuName: 'tabsContextMenu',
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [
                        {
                            fnHandler: 'closeCurrentTab',
                            btnName: '关闭当前页'
                        },
                        {
                            fnHandler: 'closeOtherTabs',
                            btnName: '关闭其他页'
                        }
                        ,
                        {
                            fnHandler: 'closeAllTabs',
                            btnName: '关闭所有'
                        }
                    ]
                }
            }
        },
        computed: {
            tabsModel() {
                return this.$store.state.tabs.view
            },
            activeTabName() {
                let activeIndex = this.$store.state.tabs.view.activeTab;
                return this.$store.state.tabs.view.menus[activeIndex].name;
            },
            activeTabPath() {
                let activeIndex = this.$store.state.tabs.view.activeTab;
                return this.$store.state.tabs.view.menus[activeIndex].path;
            }
        },
        methods: {
            // 点击 tab 移除按钮后触发
            closeViewTabs(tabName) {
                let _this = this,
                    queryParams = this.$route.query,
                    _closeViewTabs = function () {
                        _this.$store.dispatch('delVisitedViews', tabName);
                        setTimeout(() => {
                            let path = _this.activeTabPath,
                                activeIndex = _this.$store.state.tabs.view.activeTab,
                                queryParams = _this.tabsModel.menus[activeIndex].query || {};
                            _this.$router.push({path: path, query: queryParams})
                        });
                    };
                if (queryParams.hasOwnProperty('pageType') || queryParams.hasOwnProperty('opType')) {
                    if (queryParams['pageType'] === 1
                        || queryParams['pageType'] === 2
                        || queryParams['opType'] === 'add'
                        || queryParams['opType'] === 'edit') {
                        this.$confirm('确定离开该页面?', '提示', {
                            cancelButtonText: '取消',
                            confirmButtonText: '确定',
                            type: 'warning'
                        }).then(() => {
                            _closeViewTabs();
                        }).catch(() => {
                            return;
                        });
                    }else{
                        _closeViewTabs();
                    }
                }else{
                    _closeViewTabs();
                }
            },
            // tab 被选中时触发
            goToTab(tab) {
//                this.$store.dispatch('user', false);

                console.log('queryParams===', this.tabsModel.menus);

                let path = this.tabsModel.menus[tab.index].path,
                    queryParams = this.tabsModel.menus[tab.index].query || {};
                this.$store.dispatch('updateActiveTab', +tab.index);
                this.$router.push({path: path, query: queryParams});

                let tabList = this.$store.state.pagecatch;
                console.log(tabList, this.$route.path, tabList.hasOwnProperty(this.$route.path));

                if(tabList.hasOwnProperty(this.$route.path)) {
                    this.$store.dispatch('updateStateParam', this.$route.path);
                }
            },
            // 生成匹配路由
            generateRoute() {
                if (this.$route.matched[this.$route.matched.length - 1].name) {
                    return this.$route.matched[this.$route.matched.length - 1]
                }
                this.$route.matched[0].path = '/'
                return this.$route.matched[0]
            },
            // 根据路由添加tab
            addViewTabs() {
                this.$store.dispatch('addVisitedViews', this.generateRoute())
            },
            // 以下是右键菜单功能
            showMenu () {
                this.transferElem = event.currentTarget.nextSibling.nextElementSibling;
                var x = event.clientX - 110;
                var y = event.clientY;
                this.contextMenuData.axios = {
                    x, y
                }
            },
            closeCurrentTab() { // 关闭当前页
                this.closeViewTabs(this.activeTabName)
            },
            closeOtherTabs() { // 关闭其他页
                let tabViewMenus = [],
                    activeIndex = this.$store.state.tabs.view.activeTab;
                if (this.$store.state.tabs.view.menus.length <= 1) return;
                tabViewMenus.push(this.$store.state.tabs.view.menus[0]);
                tabViewMenus.push(this.$store.state.tabs.view.menus[activeIndex]);
                this.$store.dispatch('updateMenus', tabViewMenus);
                this.$store.dispatch('updateActiveTab', 1);
            },
            closeAllTabs() {// 关闭所有
                let tabViewMenus = [];
                tabViewMenus.push(this.$store.state.tabs.view.menus[0]);
                this.$store.dispatch('updateMenus', tabViewMenus);
                this.$store.dispatch('updateActiveTab', 0);
                this.$router.push('/');
            }
        },
        watch: {
            $route() {
                if (!!this.$route.query.title) {
                    this.$route.meta.title = this.$route.query.title;
                }
                this.addViewTabs()
            }
        },
        created: function () {
            this.addViewTabs();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    #app {
        .tabs-view-container {
            position: absolute;
            width: 100%;
            height: 42px;
            line-height: 42px;
            z-index: 99;
            background-color: #fff;
            .el-tabs__header {
                border-bottom: none;
                padding: 0;
                position: relative;
                margin: 0;
                .el-tabs__nav-prev, .el-tabs__nav-next {
                    background: #f5f5f5;
                }
                .el-tabs__nav-prev {
                    border-right: 1px solid #ccc;
                }
                .el-tabs__nav-next {
                    border-left: 1px solid #ccc;
                }
                .el-tabs__item {
                    &:hover {
                        background: #f5f5f5;
                        color: #333;
                        font-weight: 700;
                    }
                    border: none;
                    border-right: 1px solid #ccc;
                    &.is-active {
                        background: #f5f5f5;
                        color: #333;
                        font-weight: 700;
                        border: none;
                        border-right: 1px solid #ccc;
                        border-radius: 0px;
                    }
                }
            }
            .el-tabs {
                width: calc(100% - 40px);
            }
            .tabs-view-contextmenu {
                position: absolute;
                top: 0;
                right: 15px;
                .svg-icon {
                    transform: rotate(90deg);
                }
            }
        }
    }
</style>
