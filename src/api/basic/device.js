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

export function getDeviceList(obj) {
    let param = {
        devTypeName: obj.devTypeName || '',
        sType: obj.sType,
        devType: obj.devType,
        status: obj.status
    }

    return fetch({
        method: 'GET',
        url: '/devicem/device/list' + transformParams(param)
    })
}

export function getDeviceDetail(devTypeId) {
    return fetch({
        method: 'GET',
        url: '/devicem/device/detail?devTypeId=' + devTypeId
    })
}

export function operateDevice(devTypeid, opType) {

    return fetch({
        method: 'GET',
        url: '/devicem/device/operate?devtypeid=' + devTypeid + '&opType=' + opType
    })
}

export function addNewDevice(obj) {
    let param;
    if(obj.sType == 0) {
        param = {
            // devId: obj.devId,
            // devTypeId: obj.devTypeId,
            devTypeName: obj.devTypeName,
            sType: 0,
            mainDevInfo: {
                devTypeName: obj.devTypeName,
                notes: obj.notes,
                displaySize: obj.displaySize,
                displayRate: obj.displayRate,
                systemVer: obj.systemVer,
                netLinkType: obj.netLinkType,
                factory: obj.factory,
                port: obj.port
                // status: obj.status
            }

        }
    } else if(obj.sType == 1) {
        param = {
            // devId: obj.devId,
            // devTypeId: obj.devTypeId,
            devTypeName: obj.devTypeName,
            sType: 1,
            slaveDevInfo: {
                devTypeName: obj.devTypeName,
                // status: obj.status,
                devType: obj.devType,
                factory: obj.factory,
                notes: obj.notes,
                spec: obj.spec,
                chnMaxSize: obj.chnMaxSize,
                maxRow: obj.maxRow,
                maxCol: obj.maxCol,
                ifCold: obj.ifCold,
                ifWarm: obj.ifWarm
            }

        }
    }

    return fetch({
        method: 'POST',
        url: '/devicem/device/add',
        data: param
    })
}

export function changeDevice(obj) {
    let param;
    if(obj.sType == 0) {
        param = {
            // devId: obj.devId,
            devTypeid: obj.devTypeId,
            devTypeName: obj.devTypeName,
            sType: 0,
            mainDevInfo: {
                devTypeName: obj.devTypeName,
                notes: obj.notes,
                status: obj.status,
                displaySize: obj.displaySize,
                displayRate: obj.displayRate,
                systemVer: obj.systemVer,
                netLinkType: obj.netLinkType,
                factory: obj.factory,
                port: obj.port
            }

        }
    } else if(obj.sType == 1) {
        param = {
            // devId: obj.devId,
            devTypeid: obj.devTypeId,
            devTypeName: obj.devTypeName,
            sType: 1,
            slaveDevInfo: {
                devTypeName: obj.devTypeName,
                status: obj.status,
                devType: obj.devType,
                factory: obj.factory,
                notes: obj.notes,
                spec: obj.spec,
                chnMaxSize: obj.chnMaxSize,
                maxRow: obj.maxRow,
                maxCol: obj.maxCol,
                ifCold: obj.ifCold,
                ifWarm: obj.ifWarm
            }

        }
    }

    return fetch({
        method: 'POST',
        url: '/devicem/device/update',
        data: param
    })
}
