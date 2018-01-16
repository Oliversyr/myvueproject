/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';

export function getOrgList() {
    return fetch({
        method: 'GET',
        url: '/orgm/org/list'
    })
}

export function getOrgDetail(eid) {
    console.log('555555555555555555555555');
    return fetch({
        method: 'GET',
        url: '/orgm/org/detail?eid=' + eid
    })
}

export function addOrg(obj) {
    console.log('999999999999999999999999999',obj);
    let param = {
        eid: -1,
        ename: obj.ename || '',
        helpcode: obj.helpcode || '',
        orgtype: obj.orgtype || '',
        address: obj.address || '',
        areaid: parseInt(obj.areaid),
        baiduaddr: obj.baiduaddr || '',
        longitude: obj.longitude || '',
        latitude: obj.latitude || '',
        manager: obj.manager || '',
        managermobile: obj.managermobile || '',
        profiles: obj.profiles || '',
        status: obj.status || '',
        levelId: obj.levelId || '',
        levelName: obj.levelName || '',
        parentid: obj.parentid || '',
        parentName: obj.parentName || '',
        managertele: obj.managertele,
        label: obj.label
    }
    return fetch({
        method: 'POST',
        url: '/orgm/org/add',
        data: param
    })
}

export function changeOrg(obj) {
    let param = {
            eid: obj.eid,
            ename: obj.ename,
            helpcode: obj.helpcode,
            orgtype: obj.orgtype,
            address: obj.address,
            areaid: parseInt(obj.areaid),
            baiduaddr: obj.baiduaddr,
            longitude: obj.longitude,
            latitude: obj.latitude,
            manager: obj.manager,
            managermobile: obj.managermobile,
            profiles: obj.profiles,
            status: obj.status,
            levelId: obj.levelId,
            levelName: obj.levelName,
            parentid: obj.parentid,
            parentName: obj.parentName,
            managertele: obj.managertele,
            label: obj.label
    }

    return fetch({
        method: 'POST',
        url: '/orgm/org/update',
        data: param
    })
}

export function operateOrg(param) {
    return fetch({
        method: 'GET',
        url: '/orgm/org/operate?eid=' + param.eid + '&opType=' + param.opType,
    })
}

export function getMyOrg(obj) {
    let param = {
        eid: obj.eid,
        groupId: obj.groupId,
        parentId: obj.parentId,
        ename: obj.ename,
        areaid: obj.areaid,
        eids: obj.eids,
        userId: obj.userId,
        notIn: obj.notIn,
        orgType: obj.orgType
    }
    return fetch({
        method: 'POST',
        url: '/orgm/org/juniororg',
        data: param
    })
}

export function getMyShop(obj) {
    let param = {
        /*eid: obj.eid,
        groupId: obj.groupId,
        parentId: obj.parentId,*/
        ename: obj.ename,
        /*areaid: obj.areaid,
        eids: obj.eids,
        userId: obj.userId,
        notIn: obj.notIn,*/
        orgType: obj.orgType,
        agtStatusFilter: obj.agtStatusFilter
    }
    return fetch({
        method: 'POST',
        url: '/orgm/org/shopinfo/list',
        data: param
    })
}

/*
 * 请求说明: 用户可管理的下级机构查询(分页)
 * 请求API: /api/orgm/org/juniororg/page
 * 请求方式: POST
 */
export function getPageOrg(obj) {
    let _params = {
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: 0,
        totalPage: 0,
        params: {
            eid: obj.eid,
            groupId: obj.groupId,
            parentId: obj.parentId,
            ename: obj.ename,
            areaid: obj.areaid,
            eids: obj.eids,
            userid: obj.userId,
            notIn: obj.notIn,
            orgType: obj.orgType,
            notingroupid: obj.notingroupid
        }
    }
    return fetch({
        method: 'POST',
        url: '/orgm/org/juniororg/page',
        data: _params
    })
}




