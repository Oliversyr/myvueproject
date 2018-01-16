var doc = document, creat = 'createElement', byid = 'getElementById', tags = 'getElementsByTagName';

function _trim(str) {
    str = str || '';
    return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
}

function hasClass(elem, cls) {
    elem = elem || {};
    return new RegExp('\\b' + cls + '\\b').test(elem.className);
};

function addClass(elem, cls) {
    elem = elem || {};
    hasClass(elem, cls) || (elem.className += ' ' + cls);
    elem.className = _trim(elem.className);
    return this;
};

function removeClass(elem, cls) {
    elem = elem || {};
    if (hasClass(elem, cls)) {
        var reg = new RegExp('\\b' + cls + '\\b');
        elem.className = elem.className.replace(reg, '');
    }
    return this;
};

function controlsSiblingElemDisabledClass(elem) {
    let _elem = elem;
    removeClass(elem, 'disabled');
    while (_elem.nextSibling) {
        addClass(_elem.nextSibling, 'disabled');
        _elem = _elem.nextSibling
    }
    _elem = elem;
    while (_elem.previousSibling) {
        removeClass(_elem.previousSibling, 'disabled');
        _elem = _elem.previousSibling
    }
}

/* 导出工具函数方法
 *
 */
export default {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    controlsSiblingElemDisabledClass: controlsSiblingElemDisabledClass
}