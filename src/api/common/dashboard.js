import fetch from '@/utils/fetch';

export function getModuleList() {
    return fetch({
        url: '/orgm/module/list',
        method: 'GET'
        // data: params
    });
}