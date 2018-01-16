<template>
    <div class="login-container">
        <app-header></app-header>
        <div class="login-body">
            <div class="login-banner">
                <img :src="personalConfig.loginBanner"/>
            </div>
            <div class="login-mode">
                <login-mode></login-mode>
            </div>
        </div>
    </div>
</template>

<script>
    import img_login_banner from '@/assets/img/login_banner.png';
    import {isWscnEmail} from '@/utils/validate';
    import AppHeader  from '@/views/layout/AppHeader';
    import LoginMode  from './LoginMode';

    export default {
        name: 'login',
        components: {
            AppHeader,
            LoginMode
        },
        data() {
            return {
                personalConfig: {
                    loginBanner: img_login_banner
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .login-container {
        display: flex;
        height: 100vh;
        min-height: 100vh;
        flex-direction: column;
        .login-header {
            flex: 0 1 auto;
        }
        .login-body {
            display: flex;
            flex: 1;
            min-height: 768px;
            background: url(../../assets/img/login_bg.png);
            background-size: cover;
            .login-banner img {
                width: 551px;
                height: 404px;
                position: absolute;
                top: 50%;
                left: 9.02%;
                margin-top: -202px;
                background-size: cover;
                @media screen and (min-width: 1440px) {
                    left: 13%;
                }
                @media screen and (min-width: 1600px) {
                    left: 17%;
                }
                @media screen and (min-width: 19200px) {
                    left: 22%;
                }
            }
            .login-mode {
                width: 360px;
                height: 432px;
                position: absolute;
                right: 7.29%;
                top: 50%;
                margin-top: -178px;
                background-color: #fff;
                box-sizing: border-box;
            }
        }
    }
</style>
