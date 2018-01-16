// 业务应用: views页面【按钮权限】对象公共混合器
import {mapGetters} from 'vuex';

export default {
    computed: {
        // 页面公共用户信息
        ...mapGetters([
            'user_power'
        ]),
        // 模块按钮权限
        myModulePower: function () {
            const _this = this;
            let modulePower = {};
            this.user_power.forEach((item, i) => {
                if(item.moduleid === this.$route.meta.moduleid) {
                    modulePower = item.powerlist;
                }
            })
            return modulePower;
        },
        // 店铺管理模块按钮权限
        shopModulePower: function () {
            const _this = this;
            let modulePower = {};
            this.user_power.forEach((item, i) => {
                if(item.moduleid === 43) {
                    modulePower = item.powerlist;
                }
            })
            return modulePower;
        },
        // 设备类型管理模块按钮权限
        deviceModulePower: function () {
            const _this = this;
            let modulePower = {};
            this.user_power.forEach((item, i) => {
                if(item.moduleid === 16) {
                    modulePower = item.powerlist;
                }
            })
            return modulePower;
        },
    }
}