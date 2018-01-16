<template>
    <div class="sl-page-container flex-col goodsChangeEditIndex">

            <component v-bind:is="currentView"></component>

    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    import GoodsChangeEdit from './goodsChange-edit.vue';
    import GoodsChangeDetail from './goodsChange-detail.vue';
    import NewChangeEdit from './newChange-edit.vue';
    import NewChangeDetail from './newChange-detail.vue';
    import OldChangeEdit from './oldChange-edit.vue';
    import OldChangeDetail from './oldChange-detail.vue';
    import RouterMixins from '@/mixins/router';
    import ViewPage from '@/mixins/viewPage';

    export default {
        components: {GoodsChangeEdit, GoodsChangeDetail, NewChangeEdit, NewChangeDetail, OldChangeEdit, OldChangeDetail},
//        components: {GoodsChangeEdit},
        name: 'goodsChangeEditIndex',
        mixins: [RouterMixins, ViewPage],
        data () {
            return {
                currentView: '',
                gcInfo: {},
                editDataList: [],
                addNewGoods: {},
                changeGoods: {},
                opType: 0, // 0--新增， 1--修改
                currentGoodsIndex: 0,
                fromView: ''
            }
        },
        computed: {
            myModulePower: function () {
                const _this = this;
                let modulePower = {};
                this.user_power.forEach((item, i) => {
                    if(item.moduleid === this.$route.meta.moduleid) {
                        modulePower = item.powerlist;
                    }
                })
                return modulePower;
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                if((!!this.$store.state.pagecatch[this.$route.path]) && (this.$store.state.pagecatch[this.$route.path].noRefresh)) {
                    let catahData = this.$store.state.pagecatch[this.$route.path].catchData;
                    console.log('this.catahData==>', catahData);
                    this.currentView = catahData.currentView;
                    this.gcInfo = catahData.gcInfo;
                    this.editDataList = catahData.editDataList;
                    this.addNewGoods = catahData.addNewGoods;
                    this.changeGoods = catahData.changeGoods;
                    this.opType = catahData.opType; // 0--新增， 1--修改
                    this.currentGoodsIndex = catahData.currentGoodsIndex;
                    this.fromView = catahData.fromView;
                    console.log('this.$route.query === >', this.currentView);
                } else {
                    /*this.currentView = 'GoodsChangeEdit';
                     this.gcInfo = {
                     sheetid: '',
                     editor: '',
                     editdateStr: '',
                     ename: '',
                     status: 0,
                     notes: ''
                     };
                     this.editDataList = [];
                     this.addNewGoods = {};
                     this.changeGoods = {};
                     this.opType = 0; // 0--新增， 1--修改
                     this.currentGoodsIndex = 0;
                     this.fromView = '';*/

                    console.log('this.$route.query === >', this.$route.query);
                    if(this.$route.query.opType === 'add') {
                        if(this.$route.query.from === 'goods') {
                            this.currentView = 'NewChangeEdit';
                        } else {
                            this.currentView = 'GoodsChangeEdit';
                        }
                        this.$route.query.title = '新建商品变更单';

                        this.gcInfo = {
                            sheetid: '',
                            editor: this.userInfo.realName,
                            editdateStr: this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                            ename: this.userInfo.ename,
                            status: 0,
                            notes: ''
                        }
                    } else if(this.$route.query.opType === 'edit') {
                        console.log('this.gcInfo  1111111=== >', this.gcInfo);
                        this.gcInfo = JSON.parse(sessionStorage.getItem('gcInfo'));
                        console.log('this.gcInfo  2222222=== >', this.gcInfo);
                        this.currentView = 'GoodsChangeDetail';
                    }
                }
            })
        },


        methods: {
            // 返回
            doBack() {
                this.$router.go(-1);
                this.$store.dispatch('delVisitedViews', this.$route.name);
            },
            // 日期格式化
            dateFormat(mydate, myfmt) {
                Date.prototype.Format = function (fmt) { //author: meizz
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }

                return mydate.Format(myfmt);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

    .goodsChangeEditIndex{

        .slic-content-info{
            width: calc(100% - 286px);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            /*padding: 0 10px 0 10px !important;*/
            background-color: #fff;
            border-radius: 5px;
        }

        .link {
            color: #28e;
            text-decoration: underline;
            cursor: pointer;
        }


        .myGrid {
            .nopage {
                height: 100%;
            }
        }

        .noedit {
            input {
                border: 0;
                outline: none;
                background-color: #f3f3f3;
            }
        }
    }
</style>


