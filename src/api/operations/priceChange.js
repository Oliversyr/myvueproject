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

export function getPriceChangeList(obj) {
    let param = {
        params: {
            eName: obj.params.eName,
            goodsId: obj.params.goodsId,
            bDate: obj.params.bDate,
            eDate: obj.params.eDate,
            status: obj.params.status
        },
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: 0,
        totalPage: 0
    }

    return fetch({
        method: 'POST',
        url: '/goods/priceadj/list',
        data: param
    })
}

export function getPriceChangeGoods(obj) {
    let param = {
        eid: obj.eid,
        goodsId: obj.goodsId,
        goodsName: obj.goodsName,
        priceEids: obj.priceEids
    }

    return fetch({
        method: 'GET',
        url: '/goods/priceadj/goodsquery' + transformParams(param)
    })
}

export function getPriceChangeGoodsList(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/priceadj/detail?sheetId=' + sheetId
    })
}

export function getPriceChangeOrg(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/priceadj/orgquery?sheetId=' + sheetId
    })
}

export function checkPriceChange(sheetId, status) {
    return fetch({
        method: 'GET',
        url: '/goods/priceadj/operate?sheetId=' + sheetId + '&status=' + status
    })
}

export function checkBatchFun(sheetIds, status) {
    return fetch({
        method: 'GET',
        url: '/goods/priceadj/operate/batch?sheetIds=' + sheetIds + '&status=' + status
    })
}

export function deletePriceChange(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/priceadj/delete?sheetId=' + sheetId
    })
}

export function addPriceChange(obj) {
    let param = {
        eid: obj.eid,
        sheetid: obj.sheetid,
        title: obj.title,
        adjtype: obj.adjtype,
        adjrang: obj.adjrang,
        bDateStr: obj.bdateStr,
        eDateStr: obj.edateStr,
        notes: obj.notes,
        status: obj.status,
        editor: obj.editor,
        editdateStr: obj.editdateStr,
        checker: obj.checker,
        checkdateStr: obj.checkdateStr,
        orgnum: obj.orgnum,
        goodsnum: obj.goodsnum,
        groups: obj.groups,
        items: obj.items
    }

    return fetch({
        method: 'POST',
        url: '/goods/priceadj/add',
        data: param
    })
}

export function changePriceChange(obj) {
    let param = {
        eid: obj.eid,
        sheetid: obj.sheetid,
        title: obj.title,
        adjtype: obj.adjtype,
        adjrang: obj.adjrang,
        bDateStr: obj.bdateStr,
        eDateStr: obj.edateStr,
        notes: obj.notes,
        status: obj.status,
        editor: obj.editor,
        editdateStr: obj.editdateStr,
        checker: obj.checker,
        checkdateStr: obj.checkdateStr,
        orgnum: obj.orgnum,
        goodsnum: obj.goodsnum,
        groups: obj.groups,
        items: obj.items
    }

    return fetch({
        method: 'POST',
        url: '/goods/priceadj/update',
        data: param
    })
}

export function submitPriceChange(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/priceadj/editcomplete?sheetId=' + sheetId
    })
}

export function reEditPriceChange(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/priceadj/editing?sheetId=' + sheetId
    })
}

export function getShopList(obj) {
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
