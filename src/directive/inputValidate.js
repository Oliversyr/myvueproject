/**
 * el-input 输入校验指令
 * 交互内容：
 * 金额
     输入前显示“0.00”
     移入后如果是“0.00”则清空内容
     移入后如果是“*.00”则去除后面的“.00”以方便填写
     移入后如果是“*.*0”则优化成“*.*”，即去掉最后面的“0”以方便填写
     什么都没写移出后又再次填充“0.00”
     只能输入数字和小数点
     仅能输入一个小数点
     仅保留后面两个小数点
 * 数量
 */
import {getValidateFormat,basicValidate,integerValidate} from './validate/basic';
const inputValidate = {};
inputValidate.install = (Vue, options = {}) => {
    Vue.directive('inputValidate', {
        bind(el, binding, vnode, oldVnode) {
            const _el = el.getElementsByTagName('input')[0];
            const _opts = Object.assign(options, binding);
            let _context = vnode.context;
            let Type = _opts.modifiers;
            let Base = {
                model: _opts.value.model || {},  
                key: _opts.value.key || '',    
            };
            let validateFormat = getValidateFormat(_opts.value);
            _el.value = basicValidate(_el.value, validateFormat);
            _context.$set(Base.model, Base.key, _el.value);
        },
        update(el, binding, vnode, oldVnode) {
            const _el = el.getElementsByTagName('input')[0];
            const _opts = Object.assign(options, binding);
            let _context = vnode.context;
            let Type = _opts.modifiers;
            let Base = {
                model: _opts.value.model || {},   //对象
                key: _opts.value.key || '',       //键值
            };
            let validateFormat = getValidateFormat(_opts.value);        
            var precapital;
            _el.addEventListener('focus', function() {
                let val = _el.value;
                //价格类型
                if (Type.price) {
                    if (val == '0.00') {
                        _el.value = '';
                    } else {
                        _el.value = val.replace(/\.00/, '').replace(/(\.\d)0/,'$1');
                    }
                }
                //整形类型
                else if (Type.integer) {    
                    _el.value = integerValidate(_el.value);     
                }
                precapital = _el.value;
            });
            _el.addEventListener('keyup', function() {
                //价格类型
                if (Type.price) {
                    _el.value = _el.value.replace(/^[\.]/, '').replace(/[^\d.]/g, '');
                    if (_el.value.split(".").length - 1 > 1 || /^\d+\.\d{3,}?$/.test(_el.value)) {
                        _el.value = precapital;
                    }
                }
                //整形类型
                else if (Type.integer) {
                    if (_el.value == '-') {
                        _el.value = '-';
                    }
                    else {
                        _el.value = integerValidate(_el.value);
                    }
                }

                _el.value = basicValidate(_el.value, validateFormat);
                _context.$set(Base.model, Base.key, _el.value);
                precapital = _el.value;
            });
            _el.addEventListener('blur', function() {
                //价格类型
                if (Type.price) {
                    _el.value = _el.value.replace(/[\.]$/, '');
                    _el.value = Number(_el.value).toFixed(2);
                }
                //整形类型
                else if (Type.integer) {
                    if (_el.value == '-') {
                        _el.value = '';
                    }
                    else {
                        _el.value = integerValidate(_el.value);
                    }
                }
                _context.$set(Base.model, Base.key, _el.value);
            });
        },
        unbind(el) {
            const _el = el.getElementsByTagName('input')[0];
            _el.removeEventListener('focus','');
            _el.removeEventListener('keyup','');
            _el.removeEventListener('keydown','');
            _el.removeEventListener('blur','');
        }
    })
};

export default inputValidate;
