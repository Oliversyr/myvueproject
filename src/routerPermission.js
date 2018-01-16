import router from './router';
import store from './store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const whiteList = ['/login'];
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (store.getters.token) {
        if (to.path === '/login') {
            next({path: '/'});
        } else {
            if (store.getters.roles.length === 0) {
                store.dispatch('GetInfo').then(res => {
                    const roles = res.data.role;
                    store.dispatch('GenerateRoutes', {roles}).then(() => {
                        router.addRoutes(store.getters.addRouters);
                        next({...to});
                    })
                })
            } else {
                next();
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {// 白名单的路由直接next
            next()
        } else {// 黑名单则需要校验是否用户选择自动登录
            let userInfo = store.getters.userInfo;
            if(!!userInfo && !!userInfo.isAutoLogin){
                store.dispatch('Login', userInfo).then(() => {
                    next(to.path);
                }).catch(err => {
                    console.log(err);
                });
            }else{
                next('/login');
            }
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
