const tabs = {
    state: {
        view: {
            menus: [{
                'title': '首页',
                'name': 'home',
                'path': '/' // 路径
            }],
            activeTab: 0 // 当前激活的tab index
        }
    },
    mutations: {
        ADD_VISITED_VIEWS: (state, routerInfo) => {
            let isNew = true;
            state.view.menus.forEach((item, index) => {
                if (item.path === routerInfo.path) {
                    isNew = false;
                    state.view.activeTab = index;
                }
            });
            if(isNew) {
                state.view.menus.push({title: routerInfo.meta.title, name: routerInfo.name, path: routerInfo.path});
                state.view.activeTab = state.view.menus.length - 1;
            }
        },
        DEL_VISITED_VIEWS: (state, tabName) => {
            let menus = state.view.menus;
            let tabActiveIndex = state.view.activeTab;
            if (menus.length === 1) {
                return;
            }
            menus.forEach((item, index) => {
                if (item.name === tabName) {
                    state.view.menus.splice(index, 1);
                    if (tabActiveIndex === index) {
                        tabActiveIndex = index - 1;
                    } else if (tabActiveIndex > index) {
                        tabActiveIndex -= 1;
                    }
                    state.view.activeTab = tabActiveIndex;
                }
            });
        },
        UPDATE_ACTIVE_TAB: (state, tabIndex) => {
            state.view.activeTab = tabIndex;
        },
        UPDATE_MENUS: (state, menus) => {
            state.view.menus = menus;
        }
    },
    actions: {
        addVisitedViews: ({commit}, routerInfo) => {
            commit('ADD_VISITED_VIEWS', routerInfo)
        },
        delVisitedViews: ({commit}, tabName) => {
            commit('DEL_VISITED_VIEWS', tabName)
        },
        updateActiveTab: ({commit}, tabIndex) => {
            commit('UPDATE_ACTIVE_TAB', tabIndex)
        },
        updateMenus: ({commit}, menus) => {
            commit('UPDATE_MENUS', menus)
        }
    }
};

export default tabs;
