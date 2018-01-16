/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';

export function getPropertyComList(obj) {
    let param = {
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: 0,
        totalPage: 0,
        params: {
            eid: obj.params.eid,
            areaId: obj.params.areaId || -1
        }
    }
    return fetch({
        method: 'POST',
        url: '/business/franchise/company/list',
        data: param
    })
}

export function getPropertyProList(obj) {
    let param = {
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        // totalRecord: 0,
        // totalPage: 0,
        params: {
            eid: obj.params.eid || -1,
            areaId: obj.params.areaId || -1,
            coEName: obj.params.coEName || '',
            eDate: obj.params.eDate,
            status: obj.params.status
        }
    }
    return fetch({
        method: 'POST',
        url: '/business/franchise/agreement/list',
        data: param
    })
}

export function addProperty(obj) {
    let param = {
        eid: obj.eid,
        ename: obj.ename,
        sheetid: obj.sheetid,
        coeid: obj.coeid,
        coename: obj.coename,
        bdate: obj.bdate + ' 00:00:00',
        edate: obj.edate + ' 00:00:00',
        contact: obj.contact,
        contactMobile: obj.contactMobile,
        percent: parseInt(obj.percent),
        editor: obj.editor,
        editordateStr: obj.editordateStr,
        // checker: obj.checker
        // checkerDateStr: obj.
        status: obj.status,
        filename: obj.filename,
        oldFileName: obj.oldFileName

    }
    return fetch({
        method: 'POST',
        url: '/business/franchise/add',
        data: param
    })
}

export function changeProperty(obj) {
    let param = {
        objectid: obj.objectid,
        eid: obj.eid,
        ename: obj.ename,
        sheetid: obj.sheetid,
        coeid: obj.coeid,
        coename: obj.coename,
        bdate: obj.bdate,
        edate: obj.edate,
        contact: obj.contact,
        contactMobile: obj.contactMobile,
        percent: parseInt(obj.percent),
        editor: obj.editor,
        editordateStr: obj.editordateStr,
        checker: obj.checker,
        checkerDateStr: obj.checkerDateStr,
        status: obj.status,
        filename: obj.filename,
        oldFileName: obj.oldFileName

    }
    return fetch({
        method: 'POST',
        url: '/business/franchise/update',
        data: param
    })
}

export function checkProtocol(sheetIds) {
    return fetch({
        method: 'GET',
        url: '/business/franchise/audit?objectids=' + sheetIds + '&status=1'
    })
}

export function deleteProtocol(sheetIds) {
    return fetch({
        method: 'GET',
        url: '/business/franchise/delete?objectids=' + sheetIds
    })
}

export function stopProtocol(sheetIds) {
    return fetch({
        method: 'GET',
        url: '/business/franchise/stop?objectids=' + sheetIds
    })
}

export function getProtocolTip(type) {
    return fetch({
        method: 'GET',
        url: '/business/franchise/tip?type=' + type
    })
}

export function renewProperty(obj) {
    let param = {
        objectid: obj.objectid,
        sheetId: obj.sheetId,
        eDate: obj.eDate,
        contact: obj.contact,
        contactMobile: obj.contactMobile,
        percent: obj.percent
    }
    return fetch({
        method: 'POST',
        url: '/business/franchise/renew',
        data: param
    })
}

