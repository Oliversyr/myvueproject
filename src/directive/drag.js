const vueDrag = {};
vueDrag.install = Vue => {
    Vue.directive('drag', {
        update: function (el, binding) {
            let oDiv = el;// 指令绑定元素,即需要定位位置的元素
            let dragDiv = !binding.value ? el : el.getElementsByClassName(binding.value)[0];// 实际拖动元素
            let bDrag = false;// 记录拖动开始结束标志
            dragDiv.onmousedown = function (ev) {
                // 鼠标按下，计算当前元素距离可视区的距离
                let oEvent = ev || event, x = 0, y = 0;
                bDrag = true;
                x = oEvent.clientX - oDiv.offsetLeft;
                y = oEvent.clientY - oDiv.offsetTop;
                // 鼠标移动
                document.onmousemove = function (ev) {
                    if (!bDrag) return;
                    var oEvent = ev || event;
                    var out1 = oEvent.clientX - x;
                    var out2 = oEvent.clientY - y;

                    oDiv.style.left = out1 + 'px';
                    oDiv.style.top = out2 + 'px';
                    dragDiv.style.cursor = 'move';
                }
                // 鼠标起来
                document.onmouseup = function () {
                    bDrag = false;
                    dragDiv.style.cursor = 'auto';
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
                return false;//解决firefox低版本的bug问题
            };
        }
    });
};

export default vueDrag
