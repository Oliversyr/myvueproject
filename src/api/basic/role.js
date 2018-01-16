/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';

function transformParams (param) {
    let str = '';
    for(let par in param) {
        if(str === '') {
            str = `?${par}=${param[par]}`;
        } else {
            str = `${str}&${par}=${param[par]}`;
        }
    }
    return str;
}

export function getRoleList() {
    return fetch({
        method: 'GET',
        url: '/orgm/myrole/list'
    })
}

export function addNewRole(obj) {
    let param = {
        type: obj.type,
        eid: obj.eid,
        roleName: obj.roleName,
        notes: obj.notes || ''
    }

    return fetch({
        method: 'GET',
        url: '/orgm/myrole/add' + transformParams(param)
    })
}

/*export function getRoleUserList(obj) {
    let param = {
        params: {
            eid: obj.eid,
            keyValue: obj.keyValue,
            roleId: obj.roleId
        },
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: 0,
        totalPage: 0
    }

    return fetch({
        method: 'POST',
        url: '/orgm/myrole/userlist',
        data: param,
    })
}*/

export function deleteRole(obj) {

    return fetch({
        method: 'GET',
        url: 'orgm/myrole/delete?eid=' + obj.eid + '&roleId=' + obj.roleId
    })
}

export function copyRole(obj) {
    return fetch({
        method: 'GET',
        url: '/orgm/myrole/copy?roleId=' + obj.roleId + '&roleName=' + obj.roleName + '&notes=' + obj.notes
    })
}

export function changeRole(obj) {
    /*let param = {
        roleId: obj.roleId,
        roleName: obj.roleName,
        notes: obj.notes
    }*/

    return fetch({
        method: 'GET',
        url: '/orgm/myrole/update?roleId=' + obj.roleId + '&roleName=' + obj.roleName + '&notes=' + obj.notes
    })
}

export function operateRoleUser(obj) {
    let param = {
        roleId: obj.roleId,
        eid: obj.eid,
        userIdList: obj.userIdList,
        opType: obj.opType
    }

    return fetch({
        method: 'GET',
        url: '/orgm/myrole/operateuser' + transformParams(param)
        // data: param,
    })
}

export function getPowerModule(roleId, modelName) {
    return fetch({
        method: 'GET',
        url: '/orgm/myrole/modulelist?roleId=' + roleId + '&modelName=' + modelName
    })
}

export function savePowerModule(obj) {
    let param = {
        roleId: obj.roleId,
        list: obj.list,
        flag: obj.flag
    }

    return fetch({
        method: 'POST',
        url: '/orgm/myrole/modulelist/operate',
        data: param
    })
}

export function getPowerModuleList(moduleId, modelName) {
    return fetch({
        method: 'GET',
        url: '/orgm/module/sys/list?moduleId=' + moduleId + '&modelName=' + modelName
    })
}





