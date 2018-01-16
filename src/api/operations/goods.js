/**
 * Created by Administrator on 2017-07-25.
 */

import fetch from '@/utils/fetch';

export function getGoodsTip(keyValue) {
    return fetch({
        method: 'GET',
        url: '/goods/goods/tip?keyValue=' + keyValue
    })
}

export function getGoodsList(obj) {
    let param = {
        params: {
            goodsId: obj.params.goodsId || -1,
            brandId: obj.params.brandId || -1,
            catId: obj.params.catId || -1,
            goodsName: obj.params.goodsName || '',
            notInGroup: obj.params.notInGroup || -1,
            notInShop: obj.params.notInShop || -1,
            status: obj.params.status == 'undefined' ? -1 : obj.params.status
        },
        pageNum: obj.pageNum || 1,
        pageSize: obj.pageSize || 25,
        totalRecord: obj.totalRecord || 0,
        totalPage: 0

    }
    return fetch({
        method: 'POST',
        url: '/goods/goods/page',
        data: param
    })
}

export function goodsImport() {
    return fetch({
        method: 'GET',
        url: '/brand/list'
    })
}

export function operateGoods(goodsId, status) {

    return fetch({
        method: 'GET',
        url: '/goods/goods/updateStatus?goodsId=' + goodsId + '&status=' + status
    })
}

export function getGoodsDetail(goodsId) {
    return fetch({
        method: 'GET',
        url: '/goods/goods/detail?goodsId=' + goodsId
    })
}

export function queryNeedCheckGoodsChange() {
    return fetch({
        method: 'GET',
        url: '/goods/change/toauditcount'
    })
}