/**
 * 元素获取焦点激活添加active样式指令
 */
const vueActiveClass = {};
vueActiveClass.install = (Vue, options = {}) => {
    Vue.directive('activeClass', {
        inserted(el, binding) {
            const customOpts = Object.assign(options, binding.value);

            const activeClass = (isFocus) => {
                const elements = customOpts.hostElement === 'parent' ? el.parentNode : el,
                    cName = 'active';
                if (isFocus) {
                    addClass(elements, cName);
                } else {
                    removeClass(elements, cName);
                }
            }

            const hasClass = (elements, cName) => {
                // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
                return !!elements.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
            }

            const addClass = (elements, cName) => {
                if (!hasClass(elements, cName)) {
                    elements.className += ' ' + cName;
                }
            }

            const removeClass = (elements, cName) => {
                if (hasClass(elements, cName)) {
                    elements.className = elements.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' '); // replace方法是替换
                }
            }

            el.addEventListener('focus', e => {
                activeClass(true);
            }, false)

            el.addEventListener('blur', e => {
                activeClass(false);
            }, false)
        }
    })
};

export default vueActiveClass;