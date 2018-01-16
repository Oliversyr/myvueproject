// 申明：第三方库
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import 'normalize.css/normalize.css';
import '@/assets/iconfont/iconfont';
import 'kindeditor/kindeditor-all.js';
import 'kindeditor/themes/default/default.css';
// 申明：自定义指令
import sticky from 'directive/sticky';
import waves from 'directive/waves';
import activeClass from 'directive/activeClass';
import hotKey from 'directive/hotKey/index';
import drag from 'directive/drag';
import inputValidate from 'directive/inputValidate';
// 申明：自定义过滤器
import * as filters from './filters';
// 申明：自定义组件
import IconSvg from '@/components/Icon-svg/index.vue';
import SLDatePicker from '@/components/sl-date-picker/index';
import SLSelect from '@/components/sl-select/index';
import SLCard from '@/components/sl-card/index';
import SLTableRow from '@/components/sl-table-row/index';
import SLTableCol from '@/components/sl-table-col/index';
import SLEditor from '@/components/sl-editor/index';
import SLContextmenu from '@/components/sl-contextmenu/index';
import SlIconInfo from '@/components/sl-icon-info';
import SlInput from '@/components/sl-input';
// 导入：路由权限
import './routerPermission';
// 导入：浏览器兼容性函数
import './utils/common';

// 安装：引入第三方库
Vue.use(ElementUI);
// 安装：自定义指令
Vue.use(sticky);
Vue.use(waves);
Vue.use(activeClass);
Vue.use(hotKey);
Vue.use(drag);
Vue.use(inputValidate);
// 安装：自定义过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
// 安装：自定义组件
Vue.use(SLEditor);
Vue.component('icon-svg', IconSvg);
Vue.component('sl-date-picker', SLDatePicker);
Vue.component('sl-select', SLSelect);
Vue.component('sl-card', SLCard);
Vue.component('sl-table-row', SLTableRow);
Vue.component('sl-table-col', SLTableCol);
Vue.component('sl-contextmenu', SLContextmenu);
Vue.component('sl-icon-info', SlIconInfo);
Vue.component('sl-input', SlInput);

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})
