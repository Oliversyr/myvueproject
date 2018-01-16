import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);

/* 布局组件 */
import Layout from '../views/layout/Layout';

/* 登录组件 */
const Login = _import('login/index');

/* 仪表盘组件 */
const dashboard = _import('dashboard/index');

/* 错误页面 */
const Err404 = _import('404');

/* 业务组件 */
const Org = _import('basic/org/index');
const User = _import('basic/user/index');
const Role = _import('basic/role/index');
const CoOrg = _import('basic/coOrg/index');
const Group = _import('basic/group/index');
const GroupShopItem = _import('basic/group/group-shop-item');
const GroupTemplateManager = _import('basic/group/ManagerTemplate/index');
const Device = _import('basic/device/index');
const Category = _import('basic/category/index');
const Brand = _import('basic/brand/index');

const OrgNew = _import('basic/org/org-new');
const UserDetail = _import('basic/user/user-detail');
const UserEdit = _import('basic/user/user-edit');
const PartnerEdit = _import('basic/coOrg/partner-edit');
const PartnerDetail = _import('basic/coOrg/partner-detail');
const PartnerEditUser = _import('basic/coOrg/partner-user-detail');
const DeviceDetail = _import('basic/device/device-detail');
const DeviceEdit = _import('basic/device/device-edit');

const Goods = _import('operations/goods/index');
const GoodsDetail = _import('operations/goods/goods-detail');
const GoodsChange = _import('operations/goodsChange/index');
const GoodsChangeEdit = _import('operations/goodsChange/goodsChange-edit-index');
const PriceChange = _import('operations/priceChange/index');
const PriceChangeDetail = _import('operations/priceChange/priceChange-detail');
const PriceChangeEdit = _import('operations/priceChange/priceChange-edit');
const Report = _import('operations/report/index');
const ReportShopGood = _import('operations/report/template/shop-good-list');
const ReportGoodShop = _import('operations/report/template/good-shop-list');
const ReportSalesummary = _import('operations/report/template/salesummary');
const ReportSaledetail = _import('operations/report/template/saledetail');


const Shop = _import('operations/shop/index');
const ShopInfo = _import('operations/shop/ShopInfo/index');
const ShopDevice = _import('operations/shop/ShopManager/shop-device');
const ShopGoods = _import('operations/shop/ShopManager/shop-goods');
const Bom = _import('operations/bom/index');
const BomDetail = _import('operations/bom/bom-item');
const Pallet = _import('operations/pallet/index');
const PalletDetail = _import('operations/pallet/PalletManager/index');

const Property = _import('business/property/index');
const Joining = _import('business/joining/index');


Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [{
    path: '/login',
    component: Login,
    hidden: true
}, {
    path: '/404',
    component: Err404,
    hidden: true
}, {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    hidden: true,
    children: [{path: 'dashboard', component: dashboard}]
}]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [
    {
        path: '/basic',
        component: Layout,
        redirect: 'noredirect',
        name: '基础管理',
        icon: 'all',
        children: [{
            path: 'org',
            component: Org,
            name: '组织机构管理',
            icon: 'category',
            moduleid: 11,
            meta: {title: '组织机构管理', role: ['admin'], moduleid: 11},

        }, {
            path: 'orgNew',
            component: OrgNew,
            name: '新建组织机构',
            icon: 'category',
            hidden: true,
            meta: {title: '新建组织机构', role: ['admin']},

        }, {
            path: 'user',
            component: User,
            name: '用户管理',
            icon: 'category',
            moduleid: 12,
            // noShowChildren: true,
            meta: {title: '用户管理', role: ['admin'], moduleid: 12},

        }, {
            path: 'userDetail',
            component: UserDetail,
            name: '用户详情',
            icon: 'userDetail',
            // hidden: true,
            meta: {title: '用户详情', role: ['admin'], noKeepAlive: true, moduleid: 12}
        }, {
            path: 'userEdit',
            component: UserEdit,
            name: '用户编辑',
            icon: 'category',
            // hidden: true,
            meta: {title: '用户编辑', role: ['admin'], noKeepAlive: true, moduleid: 12}
        }, {
            path: 'role',
            component: Role,
            name: '角色及权限管理',
            icon: 'category',
            moduleid: 13,
            meta: {title: '角色及权限管理', role: ['admin'], moduleid: 13}
        }, {
            path: 'coOrg',
            component: CoOrg,
            name: '合作伙伴管理',
            icon: 'category',
            moduleid: 14,
            meta: {title: '合作伙伴管理', role: ['admin'], moduleid: 14},

        }, {
            path: 'partnerDetail',
            component: PartnerDetail,
            name: '合作伙伴详情',
            hidden: true,
            icon: 'category',
            meta: {title: '合作伙伴详情', role: ['admin'], moduleid: 14, noKeepAlive: true}
        }, {
            path: 'partnerEdit',
            component: PartnerEdit,
            name: '合作伙伴编辑',
            hidden: true,
            icon: 'category',
            meta: {title: '合作伙伴编辑', role: ['admin'], moduleid: 14, noKeepAlive: true}
        }, {
            path: 'partnerUserEdit',
            component: PartnerEditUser,
            name: '合作伙伴用户编辑',
            hidden: true,
            icon: 'category',
            meta: {title: '合作伙伴用户编辑', role: ['admin'], moduleid: 14, noKeepAlive: true}
        },{
            path: 'group',
            component: Group,
            name: '店组管理',
            icon: 'category',
            moduleid: 15,
            meta: {title: '店组管理', role: ['admin'], moduleid: 15},
        }, {
            path: 'groupShopItem',
            component: GroupShopItem,
            name: 'groupShopItem',
            hidden: true,
            icon: 'category',
            meta: {title: '店组店铺详情', role: ['admin'], moduleid: 15}
        },{
            path: 'groupTemplateManager',
            component: GroupTemplateManager,
            name: 'groupTemplateManager',
            hidden: true,
            icon: 'category',
            meta: {title: '店组模板管理', role: ['admin'], moduleid: 15}
        },{
            path: 'device',
            component: Device,
            name: '设备类型管理',
            icon: 'category',
            moduleid: 16,
            meta: {title: '设备类型管理', role: ['admin'], moduleid: 16}
        }, {
            path: 'deviceDetail',
            component: DeviceDetail,
            name: '设备类型详情',
            hidden: true,
            icon: 'category',
            meta: {title: '设备类型详情', role: ['admin'], moduleid: 16}
        }, {
            path: 'deviceEdit',
            component: DeviceEdit,
            name: '设备类型编辑',
            hidden: true,
            icon: 'category',
            meta: {title: '设备类型编辑', role: ['admin'], moduleid: 16}
        }, {
            path: 'category',
            component: Category,
            name: '品类管理',
            icon: 'category',
            moduleid: 17,
            meta: {title: '品类管理', role: ['admin'], moduleid: 17}
        }, {
            path: 'brand',
            component: Brand,
            name: '品牌管理',
            icon: 'category',
            moduleid: 18,
            meta: {title: '品牌管理', role: ['admin'], moduleid: 18}
        }]
    },
    {
        path: '/operations',
        component: Layout,
        redirect: 'noredirect',
        name: '运营应用',
        icon: 'all',
        children: [{
            path: 'goods',
            component: Goods,
            name: '商品管理',
            icon: 'category',
            moduleid: 41,
            meta: {title: '商品管理', role: ['admin'], moduleid: 41}
        }, {
            path: 'goodsDetail',
            component: GoodsDetail,
            name: '商品查询',
            hidden: true,
            icon: 'category',
            meta: {title: '商品查询', role: ['admin'], moduleid: 41}
        }, {
            path: 'goodsChange',
            component: GoodsChange,
            name: '商品变更',
            icon: 'category',
            moduleid: 42,
            meta: {title: '商品变更', role: ['admin'], moduleid: 42}
        }, {
            path: 'goodsChangeEdit',
            component: GoodsChangeEdit,
            name: '商品变更单',
            hidden: true,
            icon: 'category',
            meta: {title: '商品变更单', role: ['admin'], moduleid: 42, noKeepAlive: true}
        }, {
            path: 'shop',
            component: Shop,
            name: '店铺管理',
            icon: 'category',
            moduleid: 43,
            meta: {title: '店铺管理', role: ['admin'], moduleid: 43}
        }, {
            path: 'shopInfo',
            component: ShopInfo,
            name: 'shopInfo',
            hidden: true,
            icon: 'category',
            meta: {title: '店铺详情', role: ['admin'], moduleid: 43}
        }, {
            path: 'shopDevice',
            component: ShopDevice,
            name: 'shopDevice',
            hidden: true,
            icon: 'category',
            meta: {title: '店铺设备管理', role: ['admin'], moduleid: 43}
        }, {
            path: 'shopGoods',
            component: ShopGoods,
            name: 'shopGoods',
            hidden: true,
            icon: 'category',
            meta: {title: '店铺商品管理', role: ['admin'], moduleid: 43}
        },{
            path: 'bom',
            component: Bom,
            name: '组合商品管理',
            icon: 'category',
            moduleid: 44,
            meta: {title: '组合商品管理', role: ['admin'], moduleid: 44}
        }, {
            path: 'bomDetail',
            component: BomDetail,
            name: 'bomDetail',
            hidden: true,
            icon: 'category',
            meta: {title: '组合商品管理详情', role: ['admin'], moduleid: 44}
        }, {
            path: 'pallet',
            component: Pallet,
            name: '货道管理',
            icon: 'category',
            moduleid: 45,
            meta: {title: '货道管理', role: ['admin'], moduleid: 45}
        }, {
            path: 'palletDetail',
            component: PalletDetail,
            name: 'palletDetail',
            hidden: true,
            icon: 'category',
            meta: {title: '货道管理详情', role: ['admin'], moduleid: 45}
        }, {
            path: 'priceChange',
            component: PriceChange,
            name: '售价调整',
            icon: 'category',
            moduleid: 46,
            meta: {title: '售价调整', role: ['admin'], moduleid: 46}
        }, {
            path: 'priceChangeDetail',
            component: PriceChangeDetail,
            name: '调价单详情',
            hidden: true,
            icon: 'category',
            meta: {title: '调价单详情', role: ['admin'], moduleid: 46, noKeepAlive: true}
        }, {
            path: 'priceChangeEdit',
            component: PriceChangeEdit,
            name: '调价单编辑',
            hidden: true,
            icon: 'category',
            meta: {title: '调价单编辑', role: ['admin'], moduleid: 46, noKeepAlive: false}
        }
        , {
            path: 'report',
            component: Report,
            name: '运营报表',
            icon: 'category',
            moduleid: 49,
            meta: {title: '运营报表', role: ['admin'],  moduleid: 49}
        }
        , {
            path: 'reportShopGood',
            component: ReportShopGood,
            name: '店铺商品销售',
            icon: 'category',
            meta: {title: '店铺商品销售', role: ['admin'], noKeepAlive: true}
        }
        , {
            path: 'reportGoodShop',
            component: ReportGoodShop,
            name: '商品店铺销售',
            icon: 'category',
            meta: {title: '商品店铺销售', role: ['admin'], noKeepAlive: true}
        }, {
            path: 'reportSalesummary',
            component: ReportSalesummary,
            name: '店铺销售流水',
            icon: 'category',
            meta: {title: '店铺销售流水', role: ['admin'], noKeepAlive: true}
        }, {
            path: 'reportSaledetail',
            component: ReportSaledetail,
            name: '店铺商品流水',
            icon: 'category',
            meta: {title: '店铺商品流水', role: ['admin'], noKeepAlive: true}
        }]
    },{
        path: '/business',
        component: Layout,
        redirect: 'noredirect',
        name: '业务应用',
        icon: 'all',
        children: [{
            path: 'property',
            component: Property,
            name: '物业协议管理',
            icon: 'category',
            moduleid: 71,
            meta: {title: '物业协议管理', role: ['admin'], moduleid: 71}
        }, {
            path: 'joining',
            component: Joining,
            name: '加盟协议管理',
            icon: 'category',
            moduleid: 72,
            meta: {title: '加盟协议管理', role: ['admin'], moduleid: 72}
        }]
    },
    {path: '*', redirect: '/404', hidden: true}
];
