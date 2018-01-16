<template>
    <div class="count-down-wrap">
        <el-button class="count-down-btn" :disabled="start">
            {{time | change}}
        </el-button>
    </div>
</template>

<script>
    let flag = false
    export default {
        props: {
            start: {
                type: Boolean
            }
        },
        data () {
            return {
                time: '获取验证码',
            }
        },
        watch: {
            start (value, oldvalue) {
                if (value == true) {
                    this.countDown()
                }
            }
        },
        methods: {
            countDown () {
                this.time = 60;
                let time = setInterval(() => {
                    this.time--
                    if (this.time == 0) {
                        this.$emit('countDown')
                        this.time = '重新获取'
                        flag = true
                        clearInterval(time)
                    }
                }, 1000)
            }
        },
        filters: {
            change (value) {
                if (!value) return ""
                if (!isNaN(value)) { // 数字进入
                    return `${value}秒后重新获取`
                } else {
                    return value
                }
            }
        }
    }
</script>