<template>
    <div class="login-box">
        <!--Begin 登录方式切换 -->
        <div class="login-box-head mt20 clearfix">
            <span class="login-box-head-person fl" id="login-person" :class="{ active: userInfo.loginType==='mobile' }"
                  @click="userInfo.loginType='mobile';switchLoginType(userInfo.loginType)">个人手机登陆</span>
            <span class="login-box-head-company fr" id="login-company" :class="{ active: userInfo.loginType==='acct' }"
                  @click="userInfo.loginType='acct';switchLoginType(userInfo.loginType)">企业账号登陆</span>
            <span class="login-box-head-cas fl" v-if="false">用户登录</span>
        </div>
        <!--End 登录方式切换 -->

        <!--Begin 公司登录 -->
        <template v-if="userInfo.loginType === 'acct'">
            <div class="login-box-con" id="login-company-con">
                <div class="login-box-tip  pst-rl">
                    使用帐号密码登录时，需要输入企业编号。
                    <i class="icon-question fr" @mouseenter="showHelpQuestion=true"
                       @mouseleave="showHelpQuestion=false"></i>
                    <div class="sl-alert-checkout-question" v-show="showHelpQuestion">
                        <span>如果不了解您的帐号密码，请与我司智店宝系统管理员联系，或直接拨打0755-29494993咨询智店宝客服。</span>
                    </div>
                    <!--问题提示-->
                </div>
                <div class="form-group form-login mt15">
                    <label class="label-login"><i class="sl-icon icon-enterpriseNum"></i></label>
                    <input type="text" id="userEidAccount" placeholder="请输入企业编号" class="input input-login fz14 "
                           v-model="userInfo.eid"
                           autofocus v-active-class="{hostElement:'parent'}"/>
                </div>
                <!--在form-group加active类为选中状态-->
                <div class="form-group form-login mt20">
                    <label class="label-login"><i class="sl-icon icon-username"></i></label>
                    <input id="userAccount" class="input input-login fz14" type="text" placeholder="请输入帐号"
                           v-model="userInfo.loginName"
                           v-active-class="{hostElement:'parent'}"/>
                </div>
                <!--在form-group加active类为选中状态-->
                <div class="form-group form-login mt20 prt-rl">
                    <label class="label-login"><i class="sl-icon icon-password"></i></label>
                    <input class="input input-login fz14" type="password" @keyup.enter="doLogin"
                           v-model="userInfo.pswd"
                           placeholder="请输入密码" v-active-class="{hostElement:'parent'}"/>
                    <!--登录的错误提示-->
                    <div class="login-error2" v-show="false ">
                        错误，错误
                    </div>
                </div>
                <!--开发模式显示机构类型-->
                <div v-if="personalConfig.isDev" class="form-group form-login mt20 ">
                    <label class="label-type fl">类型:</label>
                    <select class="fl select-login">
                        <option value="20">批发商</option>
                        <option value="31">门店</option>
                    </select>
                </div>
                <div class="form-forget mt20 clearfix fz16 tx-666">
                    <el-tooltip effect="light" content="勾选后7天内自动登录" placement="left">
                        <el-checkbox v-model="userInfo.isAutoLogin" style="font-size: 14px;">自动登录</el-checkbox>
                    </el-tooltip>
                    <a class="forget-password tx-666 fr" v-if="false">忘记企业编码？</a>
                </div>
                <button type="button" class="btn sl-btn-login mt20 " @click="doLogin">登录</button>
                <div class="clearfix mt10" v-if="false">
                    <a class="fz16 c-0088fe fl">【免注册体验】</a>
                    <a class="fz16 c-0088fe fr">立即注册&gt;</a>
                </div>
            </div>
        </template>
        <!--End 公司登录 -->

        <!--Begin 个人登录 -->
        <template v-else>
            <div class="login-box-con" id="login-person-con">
                <div class="login-box-tip  pst-rl" v-if="false">
                    使用手机登录前，请确定帐号已经绑定手机号码。
                    <i class="icon-question fr" @mouseenter="showHelpQuestion=true"
                       @mouseleave="showHelpQuestion=false"></i>
                    <div class="sl-alert-checkout-question " v-show="showHelpQuestion">
                        <span>如果不了解如何绑定手机，请与我司智店宝系统管理员联系，或直接拨打0755-29494993咨询智店宝客服。</span>
                    </div>
                    <!--问题提示-->
                </div>
                <!--在form-group加active类为选中状态-->
                <div class="form-group form-login">
                    <label class="label-login"><i class="sl-icon icon-username"></i></label>
                    <input class="input input-login fz14" id="userMobile" type="text" placeholder="请输入手机号、账号" autofocus
                           v-model="userInfo.loginName"
                           v-active-class="{hostElement:'parent'}"
                           autocomplete/>
                </div>
                <!--在form-group加active类为选中状态-->
                <div class="form-group form-login mt20 prt-rl">
                    <label class="label-login"><i class="sl-icon icon-password"></i></label>
                    <input class="input input-login fz14" type="password" @keyup.enter="doLogin"
                           v-model="userInfo.pswd"
                           placeholder="请输入密码" v-active-class="{hostElement:'parent'}"/>
                    <!--登录的错误提示-->
                    <div class="login-error2" v-show="false ">
                        错误，错误
                    </div>
                </div>
                <div class="form-forget mt20 clearfix fz16 tx-666">
                    <el-tooltip effect="light" content="勾选后7天内自动登录" placement="left">
                        <el-checkbox v-model="userInfo.isAutoLogin" style="font-size: 14px;">自动登录</el-checkbox>
                    </el-tooltip>
                    <a class="forget-password tx-666 fr" @click.prevent="doForgetPsd" style="font-size: 14px;">忘记密码？</a>
                </div>
                <button type="button" class="btn sl-btn-login mt20 " @click="doLogin">登录</button>
                <div class="clearfix mt60" v-if="false">
                    <a class="fz16 c-0088fe fl">【免注册体验】</a>
                    <a class="fz16 c-0088fe fr">立即注册&gt;</a>
                </div>
            </div>
        </template>
        <!--End 个人登录 -->

        <!--Begin 忘记密码-->
        <el-dialog :visible.sync="forgetPsdDialog.visible" custom-class="forget-psd-dialog">
            <span slot="title" class="dialog-header">
                <span class="animated fadeIn">找回密码</span>
            </span>
            <el-form :model="forgetPsdDialog.form" :rules="forgetPsdDialog.rules" ref="forgetPsdDialogForm"
                     label-width="90px" class="dialog-form">
                <el-form-item label="手机号码：" prop="telePhone" class="mt">
                    <el-input v-model.number="forgetPsdDialog.form.telePhone"></el-input>
                </el-form-item>
                <el-form-item label="验证码：" prop="verifyCode">
                    <el-input v-model.number="forgetPsdDialog.form.verifyCode"
                              style="width: 320px;margin-right: 20px;"></el-input>
                    <count-down :start='forgetPsdDialog.start' @countDown='forgetPsdDialog.start=false'
                                @click.native='sendVCode'></count-down>
                </el-form-item>
                <el-form-item label="密码：" prop="newPwd">
                    <el-input type="password" v-model="forgetPsdDialog.form.newPwd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="estPsw">
                    <el-input type="password" v-model="forgetPsdDialog.form.estPsw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForgetForm" class="submitForgetBtn">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--End 忘记密码-->
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import CountDown from '@/components/sl-countDown/countDown';
    import md5  from 'js-md5';
    import {getVCode, sendVCode, checkVCode, resetPwsd} from '@/api/login';
    import Schema from 'async-validator';

    export default {
        name: 'LoginMode',
        components: {
            CountDown
        },
        data() {
            var validateTeleNum = (rule, value, callback) => {
                if (!(/^[0-9]{11}$/).test(value)) {
                    return callback(new Error('请输入有效的手机号码'));
                }
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value.toString().length >= 12) {
                            callback(new Error('请输入11位有效的数字值'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            };
            var validateVerifyCodeNum = (rule, value, callback) => {
                if (!(/^[0-9]{6}$/).test(value)) {
                    return callback(new Error('请输入正确的验证码'));
                }
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value.toString().length >= 7) {
                            callback(new Error('请输入4位有效的数字值'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (!(/^(\w){6,20}$/).test(value)) {
                    return callback(new Error('请输入6-20个字母、数字、下划线'));
                } else {
                    if (this.forgetPsdDialog.form.estPsw !== '') {
                        this.$refs.forgetPsdDialogForm.validateField('estPsw');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (!(/^(\w){6,20}$/).test(value)) {
                    return callback(new Error('请输入6-20个字母、数字、下划线'));
                } else if (value !== this.forgetPsdDialog.form.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                showHelpQuestion: false,
                personalConfig: {
                    isDev: false
                },
                userInfo: {
                    eid: '',
                    loginName: '',
                    pswd: '',
                    devType: 'PC',
                    isAutoLogin: false,
                    loginType: 'mobile'
                },
                forgetPsdDialog: {
                    visible: false,
                    sendCodeMsg: '获取验证码',
                    start: false,
                    form: {
                        telePhone: '',
                        verifyCode: '',
                        newPwd: '',
                        estPsw: ''
                    },
                    rules: {
                        telePhone: [
                            {required: true, validator: validateTeleNum, trigger: 'blur'}
                        ],
                        verifyCode: [
                            {required: true, validator: validateVerifyCodeNum, trigger: 'blur'}
                        ],
                        newPwd: [
                            {required: true, validator: validatePass, trigger: 'blur'}
                        ],
                        estPsw: [
                            {required: true, validator: validatePass2, trigger: 'blur'}
                        ]
                    }
                }
            };
        },
        methods: {
            // 切换登录方式
            switchLoginType(loginType) {
                this.userInfo = {
                    eid: loginType === 'mobile' ? '' : (Cookies.get('eid') || ''),
                    loginName: loginType === 'mobile' ? (Cookies.get('tele') || '') : (Cookies.get('name') || ''),
                    pswd: '',
                    devType: 'PC',
                    loginType: loginType
                }
            },
            // 登录
            doLogin() {
                let that = this,
                    userInfo = Object.assign({}, this.userInfo, {
                        pswd: '0x' + md5(this.userInfo.pswd)
                    }),
                    descriptor = {
                        eid: {type: "string", required: true, max: 8, pattern: /^[0-9]*$/i, message: "请输入正确的企业编号！"}
                    },
                    validator = new Schema(descriptor),
                    _doLogin = function () {
                        that.$store.dispatch('Login', userInfo).then(() => {
                            that.$router.push({path: '/'});
                        }).catch(err => {
                            that.userInfo.pswd = '';
                            that.$message.error(err);
                        });
                    };
                if (userInfo.loginType === 'mobile') {
                    _doLogin()
                } else {
                    validator.validate({eid: userInfo.eid}, (errors, res) => {
                        if (errors) {
                            console.log(errors, res);
                            this.$message.error(errors[0].message);
                        } else {
                            _doLogin()
                        }
                    });
                }
            },
            // 忘记密码
            doForgetPsd() {
                this.forgetPsdDialog.visible = true;
                this.$nextTick(()=>{
                    this.$refs['forgetPsdDialogForm'].resetFields();
                    let _tele = !this.userInfo.loginName ? '' : parseFloat(this.userInfo.loginName);
                    this.forgetPsdDialog.form.telePhone = this.userInfo.loginType === 'mobile' ? _tele : '';
                });
            },
            // 提交忘记密码表单
            submitForgetForm() {
                // 1. 校验表单
                this.$refs['forgetPsdDialogForm'].validate((valid) => {
                    if (valid) {
                        // 2. 校验验证码

                        // 3. 设置新密码
                        let mobile = this.forgetPsdDialog.form.telePhone,
                            vcode = this.forgetPsdDialog.form.verifyCode,
                            newPwsd = '0x' + md5(this.forgetPsdDialog.form.newPwd);
                        resetPwsd({mobile, vcode, newPwsd}).then((res) => {
                            if (res.retCode === 'SUCCESS') {
                                this.$message.success(res.retMsg);
                                this.forgetPsdDialog.visible = false;
                            } else {
                                this.$message.error(res.retMsg);
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        this.$message.error("请检查表单输入错误的提示");
                        return false;
                    }
                });
            },
            // 发送验证码
            sendVCode() {
                let mobilePhone = this.forgetPsdDialog.form.telePhone;
                this.$refs['forgetPsdDialogForm'].validateField('telePhone', (errorMessage) => {
                    if (!errorMessage) {
                        return sendVCode(mobilePhone).then((res) => {
                            this.forgetPsdDialog.start = true;
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        this.$message.error(errorMessage);
                    }
                });
            },
            // 初始化
            init() {
                // 默认手机登录模式
                this.switchLoginType(Cookies.get('loginType') || 'mobile');
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .login-box-head {
        height: 25px;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
        box-sizing: content-box;
        .login-box-head-company {
            width: 50%;
            text-align: center;
            corlor: #333;
            font-size: 18px;
            font-weight: bold;
            font-family: '微软雅黑';
            cursor: pointer;
            border-right: 1px solid #eee;
        }
        .login-box-head-person {
            margin-left: -1px;
            width: 50%;
            text-align: center;
            corlor: #333;
            font-size: 18px;
            font-weight: bold;
            font-family: '微软雅黑';
            cursor: pointer;
        }
        .login-box-head-cas {
            padding-left: 30px;
            corlor: #333;
            font-size: 18px;
            font-weight: bold;
            font-family: '微软雅黑';
            cursor: pointer;
        }
        .login-box-head-company.active,
        .login-box-head-person.active,
        .login-box-head-company:hover,
        .login-box-head-person:hover {
            color: #0088fe;
            font-weight: bold;
        }
    }

    .login-box-con {
        padding: 15px 30px;
        .icon-question {
            display: inline-block;
            vertical-align: middle;
            background: url(../../assets/img/icon-question.png) no-repeat;
            width: 14px;
            height: 14px;
            margin-right: 5px;
            margin-top: 5px;
            cursor: pointer;
        }

        .sl-alert-checkout-question {
            min-width: 250px;
            min-height: 26px;
            line-height: 26px;
            padding: 0 10px;
            background-color: #fff7e6;
            box-shadow: 0 0 1px #d8d8d8;
            position: absolute;
            left: 0px;
            top: 34px;
            z-index: 99;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            font-size: 12px;
        }
        .sl-alert-checkout-question:before {
            content: '';
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #fff7e6;
            position: absolute;
            right: 10px;
            top: -8px;
            z-index: 99;
        }
        .sl-alert-checkout-question:after {
            content: '';
            width: 0;
            height: 0;
            border-left: 9px solid transparent;
            border-right: 9px solid transparent;
            border-bottom: 9px solid #d8d8d8;
            position: absolute;
            right: 9px;
            top: -9px;
            z-index: 98;
        }
        .login-box-tip {
            box-sizing: border-box;
            height: 25px;
            padding-left: 8px;
            line-height: 25px;
            border: 1px solid #ffbb00;
            background: #fff8e5;
        }
    }

    .form-group {
        display: inline-block;
        position: relative;
        margin-bottom: 0px;
        .sl-icon {
            background-image: url(../../assets/img/icon-login.png);
            background-repeat: no-repeat;
            vertical-align: middle;
            display: inline-block;
        }
    }

    .form-login {
        &.active {
            border: 1px solid #0088fe;
            .label-login {
                background-color: #cce7ff;
            }
            .icon-enterpriseNum {
                background-position: -35px 0;
            }
            .icon-username {
                background-position: -167px 0;
            }
            .icon-password {
                background-position: -103px 0;
            }
        }
        position: relative;
        width: 300px;
        height: 52px;
        border: 1px solid #d5d5d5;
        box-sizing: border-box;
        .label-login {
            width: 50px;
            height: 50px;
            background-color: #d0d0d0;
            position: absolute;
            left: 0;
            top: 0;
        }
        .input-login {
            &:focus {
                outline: none;
            }
            width: 298px;
            height: 50px;
            box-sizing: border-box;
            border: none;
            padding-left: 70px;
            font-size: 18px;
        }
        .label-type {
            width: 50px;
            height: 50px;
            background-color: #d0d0d0;
            text-align: center;
            line-height: 50px;
        }
        .select-login {
            &:focus {
                outline: none;
            }
            width: 244px;
            height: 50px;
            box-sizing: border-box;
            border: 0;
        }
        .icon-enterpriseNum {
            width: 28px;
            height: 25px;
            background-position: 0 0;
            margin: 14px 0 0 12px;
        }
        .icon-username {
            width: 26px;
            height: 32px;
            background-position: -133px 0;
            margin: 11px 0 0 12px;
        }
        .icon-password {
            width: 26px;
            height: 30px;
            background-position: -69px 0px;
            margin: 11px 0 0 12px;
        }
        .login-error2 {
            position: absolute;
            top: 55px;
            width: 340px;
            height: 13px;
            padding: 0;
            color: red;
        }
    }

    .btn {
        display: inline-block;
        -webkit-user-select: none;
        cursor: pointer;
    }

    .sl-btn-login {
        width: 300px;
        height: 48px;
        background-color: #0088fe;
        color: #fff;
        font-size: 20px;
        letter-spacing: 10px;
        border: none;
    }

    .forget-psd-dialog {
        width: 600px !important;
        height: 380px;
        .el-dialog__body {
            padding: 70px 190px;
        }
        .el-form-item {
            margin-bottom: 24px;
        }
        .count-down-wrap {
            float: right;
            .count-down-btn {
                width: 130px;
                height: 36px;
                padding: 7px 10px;
                font-size: 12px;
            }
        }

        .submitForgetBtn {
            width: 320px;
            padding: 10px 15px;
            margin-top: 20px;
        }

    }
</style>