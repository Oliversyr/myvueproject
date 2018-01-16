import Contextmenu from './src/contextmenu';

Contextmenu.install = function(Vue) {
  Vue.component(Contextmenu.name, Contextmenu);
};

export default Contextmenu;
