import { asyncRouterMap, constantRouterMap } from '@/router/index';
import {getModuleList} from '@/api/common/dashboard';
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  console.log('asyncRouterMap==',asyncRouterMap)
  alert(101)

  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    power: {}
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    SET_USER_POWER: (state, power) => {
      state.power = power;
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters;

          let modulePower = [];
          let plist = [];
        /*if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap

            console.log('asyncRouterMap==12',asyncRouterMap)
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }*/
          getModuleList().then((res) => {
              console.log(asyncRouterMap);
              asyncRouterMap.forEach((item, i) => {
                  if(item.hasOwnProperty('children')) {
                      item.children.forEach((item2, j) => {
                          item2.hidden = true;
                          res.result.forEach((item3, k) => {
                              let lookPower = item3.rightvalue.toString(2).split('').reverse();
                              if(item3.moduleid === item2.moduleid && lookPower[0] == 1) {
                                  item2.hidden = false;
                                  plist.push(item3);
                              }
                          })
                      })
                  }

              })

              plist.forEach((item3, k) => {

                  let val2 = item3.rightvalue.toString(2).split('').reverse();

                  let dpower = {
                      look: false,
                      edit: false,
                      add: false,
                      delete: false,
                      print: false,
                      set: false,
                      export: false,
                      check: false,
                      finCheck: false,
                      import: false
                  };

                  let mydpower = [
                      {value: 1, label: 'look', name: '浏览'},
                      {value: 2, label: 'edit', name: '修改'},
                      {value: 4, label: 'add', name: '新增'},
                      {value: 8, label: 'delete', name: '删除'},
                      {value: 16, label: 'print', name: '打印'},
                      {value: 32, label: 'set', name: '设置'},
                      {value: 64, label: 'export', name: '导出'},
                      {value: 128, label: 'check', name: '审核'},
                      {value: 256, label: 'finCheck', name: '财审'},
                      {value: 512, label: 'import', name: '导入'}
                  ]

                  val2.forEach((val, k) => {
                      if(val == 1) {
                          dpower[mydpower[k].label] = true;
                      }
                  })

                  let obj = {
                      moduleid: item3.moduleid,
                      modulename: item3.modulename,
                      powerlist: dpower
                  }

                  modulePower.push(obj);
              })

              accessedRouters = asyncRouterMap;

              commit('SET_USER_POWER', modulePower);
              commit('SET_ROUTERS', accessedRouters);
              resolve();

          }).then(err => {

          })

      })
    }
  }
};

export default permission;
