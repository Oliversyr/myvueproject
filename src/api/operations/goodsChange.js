/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';

export function getGoodsChangeList(obj) {
    let param = {
        params: {
            creator: obj.params.creator,
            goodsId: obj.params.goodsId,
            bDate: obj.params.bDate,
            eDate: obj.params.eDate,
            status: obj.params.status
        },
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: obj.totalRecord || 0,
        totalPage: 0
    }
    return fetch({
        method: 'POST',
        url: '/goods/change/page',
        data: param
    })
}

export function checkGoodsChange(sheetIds, status) {
    let param = {
        sheetIds: sheetIds,
        status: status
    }

    return fetch({
        method: 'GET',
        url: '/goods/change/audit?sheetIds=' + sheetIds + '&status=' + status
        // data: param
    })
}

export function submitGoodsChange(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/change/editcomplete?sheetId=' + sheetId
    })
}

export function reEditGoodsChange(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/change/editing?sheetId=' + sheetId
    })
}

export function deleteGoodsChange(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/change/delete?sheetId=' + sheetId
    })
}

export function addGoodsChange(obj) {
    let param = {
        editdateStr: obj.editdateStr,
        editor: obj.editor,
        // checkdateStr: '',
        // checker: '',
        status: 0,
        sheetid: obj.sheetid,
        notes: obj.notes,
        eid: obj.eid,
        addnum: obj.addnum,
        updatenum: obj.updatenum,
        modifytype: obj.modifytype,
        // coEid: '',
        eLName: obj.eLName.toString(),
        list: obj.list
    }

    return fetch({
        method: 'POST',
        url: '/goods/change/add',
        data: param
    })
}

export function changeGoodsChange(obj) {
    let param = {
        editdateStr: obj.editdateStr,
        editor: obj.editor,
        // checkdateStr: '',
        // checker: '',
        status: obj.status || 0,
        sheetid: obj.sheetid,
        notes: obj.notes,
        eid: obj.eid,
        addnum: obj.addnum,
        updatenum: obj.updatenum,
        // coEid: '',
        modifytype: obj.modifytype,
        eLName: obj.eLName.toString(),
        list: obj.list
    }

    return fetch({
        method: 'POST',
        url: '/goods/change/update',
        data: param
    })
}

export function getChangeGoodsList(sheetId) {
    return fetch({
        method: 'GET',
        url: '/goods/change/itemlist?sheetId=' + sheetId
    })
}

export function getChangeGoodsDetail(sheetId, objectId) {
    /*let param = {
        sheetId: 11,
        goodsId: goodsId
    }*/
    return fetch({
        method: 'GET',
        url: '/goods/change/detail?sheetId=' + sheetId + '&objectId=' + objectId
        // data: param
    })
}




