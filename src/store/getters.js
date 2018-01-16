const getters = {
    sidebar: state => state.app.sidebar,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    userInfo: state => state.user.userInfo,
    roles: state => state.user.roles,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    user_power: state => state.permission.power,
    // 业务state
    isGroupItem: state => state.app.basic.group.isGroupItem
};
export default getters
