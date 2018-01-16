import axios from 'axios';
import {Message,MessageBox} from 'element-ui';
import store from '../store';


// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 10000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers['Authorization'] = store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
}, error => {
    Message({
        message: '客户端请求错误: ' + error.message,
        type: 'error',
        duration: 3 * 1000
    });
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.retCode && res.retCode !== 'SUCCESS') {
            Message({
                message: res.retMsg,
                type: 'error',
                duration: 3 * 1000
            });
            // USER_NOT_LOGIN:Token 过期了;
            if (res.retCode === 'USER_NOT_LOGIN') {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload();// 为了重新实例化vue-router对象 避免bug
                    });
                })
            }
            return Promise.reject(res);
        } else {
            return response.data;
        }
    },
    error => {
       const errMessage = error.code === 'ECONNABORTED' ? '网络请求超时' : error.response.data.retMsg;
        Message({
            message: errMessage,
            type: 'error',
            duration: 3 * 1000
        });
        return Promise.reject(error);
    }
)

export default service;
