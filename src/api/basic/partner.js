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

export function getPartnerList(obj) {
    let param = {
        params: {
            keyValue: obj.keyValue || '',
            orgType: (obj.orgType === 0 || obj.orgType === 1) ? obj.orgType : -1
        },
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: 0,
        totalPage: 0
    }

    return fetch({
        method: 'POST',
        url: '/orgm/coorg/list',
        data: param
    })
}

export function getPartnerDetail(coEid) {
    return fetch({
        method: 'GET',
        url: '/orgm/coorg/detail?coEid=' + coEid,
    })
}

export function addNewPartner(obj) {
    let param = {
        eid: obj.eid,
        ename: obj.eName,
        // helpcode
        orgType: obj.orgType,
        // areaName
        // parentId
        areaId: obj.areaId,
        adderss: obj.adderss,
        contact: obj.contact,
        contactMobile: obj.contactMobile,
        signTime: obj.signTime,
        status: 1,
        userList: [],
        // contractNum
        email: obj.email,
        notes: obj.notes
    }

    return fetch({
        method: 'POST',
        url: '/orgm/coorg/add',
        data: param
    })
}

export function changePartner(obj) {
    let param = {
        eid: obj.eid,
        coEid: obj.coEid,
        ename: obj.eName,
        // helpcode
        orgType: obj.orgType,
        // areaName
        // parentId
        areaId: obj.areaId,
        adderss: obj.adderss,
        contact: obj.contact,
        contactMobile: obj.contactMobile,
        signTime: obj.signTime,
        status: obj.status,
        userList: [],
        // contractNum
        email: obj.email,
        notes: obj.notes
    }

    return fetch({
        method: 'POST',
        url: '/orgm/coorg/update',
        data: param
    })
}

export function operatePartner(obj) {
    let param = {
        opType: obj.opType,
        coOrgList: obj.coOrgList
    }

    return fetch({
        method: 'GET',
        url: '/orgm/coorg/oprate' + transformParams(param)
    })
}

export function forbidUser(param) {
    return fetch({
        method: 'POST',
        url: '',
        headers: {
            "Content-Type": "application/json"
        },
        body: orgId,
        transformRequest:function(data) {
            // return $.param(data);
        }
    })
}

export function getPartnerUserList(obj) {
    let param = {
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: 0,
        totalPage: 0,
        params: {
            eid: parseInt(obj.params.eid),
            keyValue: obj.params.keyValue,
            // roleId: obj.params.roleId || -1,
            // type: obj.params.type || 'YES',
            // notinroleid: obj.params.notinroleid || -1
        }
    }

    return fetch({
        method: 'POST',
        url: '/orgm/user/coorg/list',
        data: param
    })
}

