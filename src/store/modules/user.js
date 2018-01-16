import {login, logout, getInfo} from '@/api/login';
import Cookies from 'js-cookie';

const user = {
    state: {
        token: Cookies.get('Authorization-Token'),
        name: Cookies.get('name') || '', // 用户名称
        avatar: '',// 用户头像
        roles: [],// 用户角色
        userInfo: Cookies.getJSON('User_Info'),// 用户其它信息
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo;
        }
    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            const eid = userInfo.eid,
                pswd = userInfo.pswd,
                loginName = userInfo.loginName.trim(),
                devType = userInfo.devType;
            return new Promise((resolve, reject) => {
                login(eid, pswd, loginName, devType).then(response => {
                    let data = response.result;
                    data.loginName = loginName;
                    data.pswd = userInfo.pswd;
                    data.eid = userInfo.eid;
                    data.devType = userInfo.devType;
                    data.isAutoLogin = userInfo.isAutoLogin;
                    if(userInfo.isAutoLogin){
                        Cookies.set('User_Info', data, { expires: 7 });
                    }else{
                        Cookies.set('User_Info', data, { expires: 1 });
                    }
                    commit('SET_TOKEN', data.idToken);
                    commit('SET_USER_INFO', data);
                    commit('SET_NAME', loginName);
                    Cookies.set('Authorization-Token', data.idToken, { expires: 1 });
                    if(userInfo.loginType === 'mobile') {
                        Cookies.set('name', '');
                        Cookies.set('tele', userInfo.loginName);
                    }else{
                        Cookies.set('tele', '');
                        Cookies.set('name', userInfo.loginName);
                    }
                    Cookies.set('loginType', userInfo.loginType);
                    Cookies.set('eid', userInfo.eid);
                    resolve();
                }).catch(error => {
                    // reject(error);
                });
            });
        },


        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                // getInfo(state.token).then(response => {
                //     const data = response.data;
                //     commit('SET_ROLES', data.role);
                //     commit('SET_NAME', data.name);
                //     commit('SET_AVATAR', data.avatar);
                //     resolve(response);
                // }).catch(error => {
                //     reject(error);
                // });
                // 暂时解除登录限制
                let response = {
                    "code": 20000,
                    "token": "admin",
                    "data": {
                        "role": "admin",
                        "name": "admin",
                        "avatar": "https://yahoo.github.io/gifshot/images/gifshot-6.gif"
                    }
                }
                const data = response.data;
                commit('SET_ROLES', data.role);
                commit('SET_NAME', data.name);
                commit('SET_AVATAR', data.avatar);
                resolve(response);
            });
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    Cookies.remove('Authorization-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('Authorization-Token');
                commit('SET_USER_INFO', {});
                Cookies.remove('User_Info');
                resolve();
            });
        }
    }
};

export default user;
