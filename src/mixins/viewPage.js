import {mapGetters} from 'vuex';
import dateUtil from '@/utils/date';

// 业务应用: views页面公共混合器
export default {
    data() {
        return {
            // 页面加载按钮
            loading: false,
            // 页面三种标识 => 1 add;2 edit;3 view;
            pageType: 3,
        }
    },
    computed: {
        // 页面公共用户信息
        ...mapGetters([
            'userInfo',
            'user_power'
        ]),
        // 模块按钮权限
        myModulePower: function () {
            const _this = this;
            let modulePower = {};
            this.user_power.forEach((item, i) => {
                if(item.moduleid === this.$route.meta.moduleid) {
                    modulePower = item.powerlist;
                }
            })
            return modulePower;
        },
        // 页面热键功能
        keymap () {
            return {
                'ctrl+a': function () {
                    console.log('ctrl+esc')
                },
                'enter': {
                    keydown: function () {

                    },
                    keyup: function () {
                        console.log('enter keyup')
                    }
                }
            }
        },
        // 本周第一天
        bWeekDate() {
            let weekDate = dateUtil.getWeekDate();
            return dateUtil.formatDate(weekDate.start);
        },
        // 本周最后一天
        eWeekDate() {
            let weekDate = dateUtil.getWeekDate();
            return dateUtil.formatDate(weekDate.end);
        }
    },
    methods: {
        /* 切换页面标识(1=>新增，2=>编辑，3=>浏览)
         * 更换路由参数的页面标识
         * 更换tab页签title
         */
        changePageType(pageType, title) {
            this.pageType = pageType;
            this.$route.query.pageType = pageType;
            this.$store.state.tabs.view.menus[this.$store.state.tabs.view.activeTab].title = title;
        },
        /* 根据页面类型隐藏表格指定操作列
         *
         */
        hideOpCol(pageType, gridCol, colIndex) {
            if (pageType === 3) {
                this.$set(gridCol, colIndex, Object.assign({}, gridCol[colIndex], {
                    isShow: false
                }));
            } else {
                this.$set(gridCol, colIndex, Object.assign({}, gridCol[colIndex], {
                    isShow: true
                }));
            }
        },
        /* 根据路由配置的name属性删除某页
         *
         */
        delCurView(routeName){
            this.$store.dispatch('delVisitedViews', routeName);
        },
        /* 
         * 返回上级页面
         */
        goToBack(routeName){
            this.$router.go(-1);
            this.$store.dispatch('delVisitedViews', routeName);
        }
    }
}