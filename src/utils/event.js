// 添加事件函数
function addEvent(oTarget, sEventType, fnhandler, param) {
    var regHandler = fnhandler;
    if (param) {
        regHandler = function (e) {
            fnhandler.call(this, e, param);
        }
    }

    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, regHandler, false);
    }
    else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, regHandler);
    }
    else {
        oTarget["on" + sEventType] = regHandler;
    }
}

//删除事件函数
function delEvent(oTarget, event, func) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(event, func, false);
    }
    else if (oTarget.detachEvent) {
        oTarget.detachEvent('on' + event, func);//IE
    }
    else {
        //DOM 0级事件，兼容老浏览器
        oTarget['on' + event] = null;
    }
}

export default {
    addEvent,
    delEvent
}