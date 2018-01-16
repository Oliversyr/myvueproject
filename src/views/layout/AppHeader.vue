<template>
    <div class="header">
        <div class="header-left">
            <img :src="personalConfig.logoUrl" class="logo"/>
            <ul>
                <li>三只熊业务管理</li>
            </ul>
        </div>
        <div class="header-right">
            <!-- 用户 -->
            <template>
                <el-menu class="el-menu__welcomeMessage" mode="horizontal" v-if="!!token">
                    <el-submenu index="user">
                        <template slot="title">
                            <span class="user-name">{{ '您好！'+ userInfo.realName }}</span>
                        </template>
                        <el-menu-item index="changePsd" class="changePsd" v-show="false">修改密码</el-menu-item>
                        <el-menu-item index="tellBind" class="tellBind" v-show="false">绑定手机</el-menu-item>
                        <el-menu-item index="tellUnBind" class="tellBind" v-show="false">解绑手机</el-menu-item>
                        <el-menu-item index="logout" class="logout" @click="logOut">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
                <!-- 消息 -->
                <el-badge :value="12" class="mail-box" v-if="!!token" v-show="false">
                    <img src="../../assets/img/mailbox.png" title="消息"/>
                </el-badge>
                <span v-else class="not-login">您未登录</span>
            </template>
            <!-- 换肤 -->
            <span class="skin" v-show="false"><img src="../../assets/img/skinIcon.png" title="换肤"/></span>
            <!-- 分辨率 -->
            <!--<span class="set"><img src="../../assets/img/setIcon.png" title="分辨率"/></span>-->
            <!-- 帮助 -->
            <span class="help" v-show="false"><img src="../../assets/img/help.png" title="帮助"/></span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import img_logo from '@/assets/img/logo.png';

    export default {
        name: 'AppHeader',
        data() {
            return {
                personalConfig: {
                    logoUrl: img_logo
                }
            }
        },
        computed: {
            ...mapGetters([
                'token',
                'name',
                'avatar',
                'roles',
                'userInfo'
            ])
        },
        methods: {
            logOut() {
                this.$store.dispatch('FedLogOut').then(() => {
                    location.reload();  // 为了重新实例化vue-router对象 避免bug
                });
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .header {
        background: #13222c url(../../assets/img/top_Gradient.png) right no-repeat;
        color: #fff;
        .header-left {
            float: left;
            .logo {
                float: left;
                width: 149px;
                height: 50px;
            }
            ul {
                float: left;
                margin-left: 51px;
                li {
                    &:hover {
                        background-color: #313f51;
                        border-bottom: 3px solid #28e;
                        box-sizing: border-box;
                        font-weight: 700;
                        position: relative;
                    }
                    margin: 0;
                    width: 150px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all .1s;
                }
            }

        }
        .header-right {
            float: right;
            .el-menu__welcomeMessage {
                float: left;
                &.el-menu {
                    background-color: transparent;
                    .el-submenu {
                        &:hover .el-submenu__title,
                        &.is-active .el-submenu__title {
                            border-bottom: none;
                        }
                        .el-submenu__title {
                            &:hover {
                                background-color: transparent;
                            }
                            height: 50px;
                            line-height: 50px;
                            color: #fff;
                            transition: background-color .3s,color .3s;
                            .user-role {
                                padding: 0 5px 0 10px;
                            }
                        }
                        .el-menu {
                            top: 50px;
                            &:before {
                                content: '';
                                position: absolute;
                                width: 0;
                                height: 0;
                                border-left: 10px solid transparent;
                                border-right: 10px solid transparent;
                                border-bottom: 10px solid #fff;
                                top: -10px;
                                left: 24px;
                            }
                            .changePsd:before {
                                content: '';
                                display: inline-block;
                                vertical-align: middle;
                                background: url(../../assets/img/icon.png) 0 -55px no-repeat;
                                width: 12px;
                                height: 12px;
                                margin: 0 10px;
                            }
                            .tellBind:before {
                                content: '';
                                display: inline-block;
                                vertical-align: middle;
                                background: url(../../assets/img/icon.png) -16px -55px no-repeat;
                                width: 8px;
                                height: 12px;
                                margin: 0 10px 0 11px;
                            }
                            .logout:before {
                                content: '';
                                display: inline-block;
                                vertical-align: middle;
                                background: url(../../assets/img/icon.png) -16px -40px no-repeat;
                                width: 11px;
                                height: 10px;
                                margin: 0 10px 0 11px;
                            }
                        }
                    }
                }
            }
            .mail-box {
                float: left;
                width: 20px;
                height: 30px;
                margin: 16px 20px 0px 12px;
                position: relative;
                cursor: pointer;
                transition: all .25s;
            }
            .not-login {
                float: left;
                padding: 0 10px;
                /*border-left: 1px solid #0d48bb;*/
                height: 50px;
                line-height: 50px;
                display: inline-block;
                vertical-align: middle;
            }
            .help, .set, .skin {
                float: left;
                width: 30px;
                height: 50px;
                text-align: center;
                cursor: pointer;
                img {
                    margin-top: 15px;
                }
            }
        }
    }
</style>