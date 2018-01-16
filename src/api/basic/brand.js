/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';

export function getBrandList(obj) {
    let param = {
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 9999,
        totalRecord: obj.totalRecord || 0,
        totalPage: 0,
        params: {
            brandName: obj.brandName,
            status: obj.status
        }
    }

    return fetch({
        method: 'POST',
        url: '/goods/brand/list',
        data: param
    })
}

export function getBrandDetail() {
    return fetch({
        method: 'GET',
        url: '/brand/list'
    })
}

export function addBrand(obj) {
    let param = {
        // brandId: obj.brandId,
        picFile: obj.picFile,
        brandName: obj.brandName,
        status: 1,
        notes: obj.notes
    }

    return fetch({
        method: 'POST',
        url: '/goods/brand/add',
        data: param
    })
}

export function operateBrand(brandId, opType) {
    let param = {
        brandId: brandId,
        status: opType
    };
    return fetch({
        method: 'POST',
        url: '/goods/brand/updateStatus',
        data: param
    })
}

export function changeBrand(obj) {
    let param = {
        brandId: obj.brandId,
        picFile: obj.picFile,
        brandName: obj.brandName,
        status: obj.status,
        notes: obj.notes
    }

    return fetch({
        method: 'POST',
        url: '/goods/brand/update',
        data: param
    })
}
