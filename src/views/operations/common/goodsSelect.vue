<template>
    <div class="goodsSelectCom" v-if="showGoods">
        <el-dialog title="商品选择" :visible.sync="showMyGoods" :close-on-click-modal="false" size="small">
            <div style="margin-bottom: 10px;">
                <span style="width: 95px;margin-right: 10px;">商品名称: </span>
                <sl-input placeholder="请输入商品名称、内码或条码" :input-val.sync="addSearchGoods" style="width: 250px;"></sl-input>

                <el-button type="primary" @click="getGoodsListInfo()" size="small">查询</el-button>
            </div>

            <div style="height: calc(100% - 30px);" v-loading="load2">
                <sl-grid :gridCol="gridCol" :gridValue="gridVal" :gridConfig="gridCfg"
                         @rowSelected="doSelected" @pageSizeChange="handleSizeChange" @currentPageChange="handleCurrentChange">
                    <template slot="status" scope="prop">
                        <span>{{prop.scope.row.status == 1 ? '正常' : '禁用'}}</span>
                    </template>
                </sl-grid>
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doSure()" size="small">确定</el-button>
                <el-button @click="doCancel()" class="dialog-cancel" size="small">取消</el-button>
            </span>

        </el-dialog>
    </div>


</template>

<script>

    import SlGrid from '@/components/sl-grid.vue';
    import {getGoodsList} from '@/api/operations/goods';
    export default {
        name: 'goodsSelect',
        props: ['showGoods', 'selModel','goodsStatus'],
        components: {SlGrid},
        data() {
            return {
                load2: false,
                gridCol: [],
                gridVal: {rows: [], footer: {}},
                gridCfg: {
                    selectMode: this.selModel || 'SINGLE', // 'MULT'--多选，'SINGLE'--单选
                    frozen: undefined
                },
                selectObj: {},
                showMyGoods: false,
                addSearchGoods: ''
            }
        },
        mounted: function() {
            this.$nextTick(function() {
                this.gridCol = [
                    {field: 'mygoodsid', name: '商品内码', width: '100'},
                    {field: 'goodsname', name: '商品名称', width: '150'},
                    {field: 'barcode', name: '条码', width: '150px'},
                    {field: 'spec', name: '销售规格', width: '100'},
                    {field: 'uame', name: '包装单位', width: '100'},
                    {field: 'catLName', name: '所属品类', width: '200'},
                    {field: 'brandName', name: '品牌', width: '150'},
                    {field: 'costPrice', name: '默认进价', width: '100'},
                    {field: 'bulkprice', name: '建议售价', width: '100'},
                    {field: 'status', name: '状态', width: '100', template: 'status'}
//                    {field: 'operate', name: '状态', width: '100'},
                ]

                this.getGoods();

            })
        },
        methods: {
            // 获取商品列表
            getGoods() {
                let opt = {
                    params: {
                        goodsName: this.addSearchGoods,
                        status: this.goodsStatus
                    },
                    pageNum: this.gridVal.footer.pageNum || 1,
                    pageSize: this.gridVal.footer.pageSize || 25,
                    totalRecord: 0,
                    totalPage: 0
                }
                this.load2 = true;
                getGoodsList(opt).then(res => {
                    this.load2 = false;
                    if(res.retCode === 'SUCCESS') {
                        this.gridVal.rows = res.result;
                        this.gridVal.footer = {
                            pageNum: res.pageNum,
                            pageSize: res.pageSize,
                            totalRecord: res.totalRecord
                        }
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch(err => {
                    this.load2 = false;
//                    this.$message(res.retMsg);
                })
            },
            // 商品查询
            getGoodsListInfo() {
                this.getGoods();
            },
            // 选中
            doSelected (data) {
                console.log('data==', data);
                this.selectObj = data;
            },
            // pagesize改变
            handleSizeChange (size) {
                console.log('size==', size);
                this.gridVal.footer.pageSize = size;
                this.getGoods();
            },
            // pagenum改变
            handleCurrentChange (page) {
                console.log('page==', page);
                this.gridVal.footer.pageNum = page;
                this.getGoods();
            },
            // 确定选中
            doSure() {
                this.showMyGoods = false;
                this.$emit('doSelectGoods', this.selectObj);
                this.selectObj = '';
            },
            doCancel() {
                this.showMyGoods = false;
                this.$emit('doSelectGoods', false);
                this.selectObj = '';
            }

        },
        watch: {
            showGoods(val) {
                console.log('val====>>>>', val)
                if(val) this.showMyGoods = true;

            },
            showMyGoods(val) {
                if(!val) {
                    this.$emit('update:showGoods', false);
                }
            },
            goodsStatus(val) {
                console.info(val,'==========stauts')
                this.goodsStatus = val;
                this.getGoods();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .goodsSelectCom {
        .el-table {
            height: 415px;
        }

        .el-dialog__body {
            height: 550px;
        }
        .el-dialog--small {
		    width: 900px;
		}
    }
</style>