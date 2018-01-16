import Cookies from 'js-cookie';

const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus')
        },
        theme: 'default',
        basic: { // app下基础管理的业务state管理
            group: {
                isGroupItem: false
            }
        }
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1);
            } else {
                Cookies.set('sidebarStatus', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
        },
        TOGGLE_GROUP_ITEM: (state, stateVal) => {
            state.basic.group.isGroupItem = stateVal;
        }
    },
    actions: {
        ToggleSideBar: ({commit}) => {
            commit('TOGGLE_SIDEBAR')
        },
        ToggleGroupItem: ({commit}, stateVal) => {
            commit('TOGGLE_GROUP_ITEM', stateVal)
        }
    }
};

export default app;
