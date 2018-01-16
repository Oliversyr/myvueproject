/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';

export function getCategoryList(obj) {
    let param = {
        catName: obj.catName,
        type: 1,
        levelid: obj.levelId || 3
    }
    return fetch({
        method: 'POST',
        url: '/goods/category/list',
        data: param
    })
}

export function addNewCategory(obj) {
    let param = {
        catId: obj.catId,
        catName: obj.catName,
        parentId: obj.parentId,
        levelId: obj.levelId,
        displayOrder: obj.displayOrder,
        notes: obj.notes
    }
    return fetch({
        method: 'POST',
        url: '/goods/category/add',
        data: param
    })
}

export function editCategory(obj) {
    let param = {
        catId: obj.catId,
        catName: obj.catName,
        parentId: obj.parentId,
        levelId: obj.levelId,
        displayOrder: obj.displayOrder,
        notes: obj.notes
    }
    return fetch({
        method: 'POST',
        url: '/goods/category/update',
        data: param
    })
}

export function deleteCategory(catId) {
    return fetch({
        method: 'GET',
        url: '/goods/category/delete?catId=' + catId
    })
}

export function gridData() {
    const searchParams = {
        "shopname": "",
        "shopstatus": -1,
        "groupid": 0,
        "linkstatus": -1,
        "status": -1,
        "version": false
    }
    return fetch({
        method: 'POST',
        url: '/devicem/pos/monitor/list',
        data: searchParams
    })
}