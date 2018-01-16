<template>
    <div class="sl-card" :class="{ active: isActive }" @mouseover="isActive = true;" @mouseleave="isActive = false;">
        <div class="sl-card__top">
            <div class="sl-card__header" v-if="$slots.header || header" :style="headerStyle">
                <slot name="header">{{ header }}</slot>
            </div>
            <div class="sl-card__body" v-if="$slots.body" :style="bodyStyle">
                <slot name="body"></slot>
            </div>
        </div>
        <div class="sl-card__footer" v-if="$slots.footer" :style="footerStyle">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SLCard',
        props: ['header', 'headerStyle', 'bodyStyle', 'footerStyle'],
        data() {
            return {
                isActive: false
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .sl-card {
        @media only screen and (max-width:1280px ) {
            & {
                margin-right: 14px;
            }
        }
        &:hover {
            .sl-card__header {
                background: #e7f3fd !important;
            }
            .sl-card__footer {
                display: block;
            }
        }
        &.active {
            .sl-card__top .sl-card__header {
                color: #2288ee !important;
            }
        }
        box-sizing: border-box;
        width: 310px;
        height: 250px;
        float: left;
        margin-right: 20px;
        /*margin-bottom: 15px;*/
        margin-bottom: 10px;
        .sl-card__top {
            box-sizing: border-box;
            width: 100%;
            height: 220px;
            cursor: pointer;
            .sl-card__header {
                /*width: 100%;*/
                height: 45px;
                line-height: 35px;
                padding: 0 10px;
                background: #eaeaea;
                cursor: pointer;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                font-size: 16px;
                font-family: '微软雅黑';
                color: #333;
            }
            .sl-card__body {
                position: relative;
                box-sizing: border-box;
                width: 100%;
                height: 175px;
                padding: 5px 10px;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                background: #fafafa;
                overflow: hidden;
            }
        }
        .sl-card__footer {
            display: none;
            margin: 10px 0;
            .sl-btn-txt {
                span {
                    display: inline-block;
                    margin: 0;
                    padding: 0 8px;
                    width: auto;
                    height: 12px;
                    line-height: 12px;
                    border-left: 1px solid #999;
                    &:first-child {
                        padding-left: 0;
                        border-left: none;
                    }
                    a {
                        color: #999;
                        &:hover,
                        &.active {
                            color: #288be9;
                        }
                    }
                }
            }
        }
    }
</style>
