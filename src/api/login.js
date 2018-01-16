import fetch from '@/utils/fetch';

export function login(eid, pswd, loginName, devType) {
    return fetch({
        url: '/authenticate/login',
        method: 'post',
        data: {
            eid,
            pswd,
            loginName,
            devType
        }
    });
}

export function getInfo(token) {
    return fetch({
        url: '/user/info',
        method: 'get',
        params: {token}
    });
}

export function logout() {
    return fetch({
        url: '/user/logout',
        method: 'post'
    });
}

// 获取验证码
export function getVCode(mobilePhone) {
    return fetch({
        url: '/authenticate/vcode',
        method: 'get',
        params: {mobilePhone}
    });
}

// 发送验证码
export function sendVCode(mobile) {
    return fetch({
        url: '/business/sms/sendcode',
        method: 'get',
        params: {mobile}
    });
}

// 校验验证码
export function checkVCode(mobile, checkCode) {
    return fetch({
        url: '/business/sms/checkcode',
        method: 'get',
        params: {mobile, checkCode}
    });
}

// 忘记密码
export function resetPwsd(params) {
    return fetch({
        url: '/orgm/user/pwsd/reset',
        method: 'get',
        params: params
    });
}



