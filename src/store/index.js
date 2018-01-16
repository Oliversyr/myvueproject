import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import tabs from './modules/tabs';
import pagecatch from './modules/pagecatch';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        user,
        permission,
        tabs,
        pagecatch
    },
    getters
});

export default store
