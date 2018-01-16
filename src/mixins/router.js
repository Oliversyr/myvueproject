// 组件内路由钩子函数混合器
export default {
    beforeRouteEnter (to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当钩子执行前，组件实例还没被创建
        next(vm => {
            let activeIndex = vm.$store.state.tabs.view.activeTab,
                queryParams = vm.$route.query;
            vm.$store.state.tabs.view.menus[activeIndex].query = queryParams;
        })
    }
};