<template>
    <div class="sl-contextmenu-listWrapper animated fadeIn" :class="'sl-contextmenuName-' + contextMenuData.menuName">
        <li v-for="item in contextMenuData.menulists" class="context-menu-list" @click.stop="fnHandler(item)" :class="{'is-disabled' : item.disabled}">
            <svg class="contextmenu-svg-icon" aria-hidden="true" v-if="item.icoName">
                <use :xlink:href="'#icon-' + item.icoName"></use>
            </svg>
            <span>{{item.btnName}}</span>
        </li>
    </div>
</template>

<script>
    export default {
        name: 'SLContextmenu',
        props: {
            contextMenuData: {
                type: Object,
                required: false,
                default () {
                    return {
                        menuName: null,
                        menuParent: null,
                        axios: {
                            x: null,
                            y: null
                        },
                        menulists: [
                            {
                                fnHandler: 'adddata',
                                icoName: 'category',
                                btnName: 'New'
                            },
                            {
                                fnHandler: 'savedata',
                                icoName: 'category',
                                btnName: 'Save'
                            }
                        ]
                    }
                }
            },
            transferElem: {
                required: true
            }
        },
        watch: {
            'contextMenuData.axios' (val) {
                var x = val.x
                var y = val.y
                var _this = this
                var menuName = 'sl-contextmenuName-' + _this.contextMenuData.menuName
                var menu = _this.transferElem
                menu.style.display = 'block'
                menu.style.left = x + 'px'
                menu.style.top = y + 'px'
                menu.addEventListener('mouseleave', function () {
                    menu.style.display = 'none'
                }, false)
                menu.parentElement.addEventListener('mouseleave', function () {
                    menu.style.display = 'none'
                }, false)
                document.addEventListener('mouseup', function () {
                    menu.style.display = 'none'
                }, false)
            }
        },
        methods: {
            fnHandler (item) {
                this.$emit(item.fnHandler)
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .sl-contextmenu-listWrapper {
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        border-radius: 4px;
        padding: 5px 0;
        display: none;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        .context-menu-list {
            &:hover {
                background: #e7f3fd !important;
                color: #2288ee;
            }
            &.is-disabled {
                color: #bfcbd9;
                cursor: not-allowed;
            }
            width: 110px;
            height: 38px;
            text-decoration: none;
            list-style: none;
            padding: 10px;
            font-size: 14px;
            cursor: pointer;
            text-align: left;
            .contextmenu-svg-icon {
                display: inline-block;
                width: 1em;
                height: 1em;
                vertical-align: -0.15em;
                fill: currentColor;
                overflow: hidden;
                margin-right: 5px;
            }
            span {
                display: block;
                height: 18px;
                line-height: 18px;
            }
        }
    }
</style>
