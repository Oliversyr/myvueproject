/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';
import md5  from 'js-md5';

export function getUserList(obj) {
    let param = {
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: 0,
        totalPage: 0,
        params: {
            eid: parseInt(obj.params.eid),
            keyValue: obj.params.keyValue,
            roleId: obj.params.roleId || -1,
            type: obj.params.type || 'YES',
            notinroleid: obj.params.notinroleid || -1
        }
    }

    return fetch({
        method: 'POST',
        url: '/orgm/user/list',
        data: param
    })
}

export function getUserDetail(obj) {
    return fetch({
        method: 'GET',
        url: '/orgm/user/detail?eid=' + obj.eid + '&userId=' + obj.userId
    })
}

export function changeUser(obj) {
    let param = {
        eid: obj.eid,
        userId: obj.userid,
        userInfo: {
            eid: obj.eid,
            userid: obj.userid,
            ename: obj.ename,
            eLName: obj.eLName,
            loginname: obj.loginname,
            userType: obj.userType,
            telephone: obj.telephone,
            mobilephone: obj.mobilephone.toString(),
            realname: obj.realname,
            email: obj.email,
            sex: obj.sex,
            faxNo: obj.faxNo,
            idcard: obj.idcard,
            dataRight: obj.dataRight,
            qq: obj.qq,
            lastLogin: obj.lastLogin,
            createTime: obj.createTime,
            creator: obj.creator,
            status: obj.status,
            pswd: obj.pswd ? '0x' + md5(obj.pswd) : ''
        },
        type: obj.type,
        roleIdList: obj.roleIdList,
        eidList: obj.eidList
    }

    return fetch({
        method: 'POST',
        url: '/orgm/user/update',
        data: param
    })
}

export function operateUser(obj) {
    return fetch({
        method: 'GET',
        url: '/orgm/user/operate?eid=' + obj.eid + '&userIdList=' + obj.userIdList + '&opType=' + obj.opType
    })
}

export function addUser(obj) {
    let param = {
        eid: obj.eid,
        userId: -1,
        userInfo: {
            eid: obj.eid,
            ename: obj.ename,
            eLName: obj.eLName,
            loginname: obj.loginname,
            userType: obj.userType,
            telephone: obj.telephone,
            mobilephone: obj.mobilephone.toString(),
            realname: obj.realname,
            email: obj.email,
            sex: obj.sex,
            faxNo: obj.faxNo,
            idcard: obj.idcard,
            dataRight: obj.dataRight,
            qq: obj.qq,
            lastLogin: obj.lastLogin,
            createTime: obj.createTime,
            creator: obj.creator,
            status: obj.status,
            pswd: '0x' + md5(obj.pswd)
        },
        type: obj.type,
        roleIdList: obj.roleIdList,
        eidList: obj.eidList
    }
    return fetch({
        method: 'POST',
        url: '/orgm/user/add',
        data: param
    })
}

export function myRoleList(eid) {
    return fetch({
        method: 'GET',
        url: '/orgm/myrole/eid/list?eid=' + eid
    })
}

export function changePswd(userId, newPswd) {
    return fetch({
        method: 'GET',
        url: '/orgm/user/update/userpwd?userId=' + userId + '&newPwsd=' + '0x' + md5(newPswd)
    })
}

