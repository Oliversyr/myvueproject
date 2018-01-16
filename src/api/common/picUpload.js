import fetch from '@/utils/fetch';

export function uploadPic(params) {
    return fetch({
        url: '/business/upload/pic',
        method: 'POST',
        data: params
    });
}