<template>
    <div class="shop-expand-info" :class="pageType === 1 ? 'add' : pageType === 2 ? 'edit' : 'view'">
        <el-row class="mb-xsmall">
            <el-col :span="24" class="pst-rl">
                <div class="slic-form-til">扩展信息 <sl-icon-info :is-information-opened.sync="isShowDetail"></sl-icon-info></div>
            </el-col>
        </el-row>
        <div v-show="isShowDetail">
            <!-- 【编辑新增】状态-->
            <el-form inline :model="shopInfoInner" label-width="95px" class="shop-info-form" v-if="pageType !== 3">
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="所属店组：" class="form-groupId">
                            <el-select v-model="shopInfoInner.groupId" :title="shopInfoInner.groupName" size="small"
                                       filterable placeholder="请选择">
                                <el-option
                                        v-for="item in groupOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="开业状态：" class="form-status">
                            <el-radio-group size="small" v-model="shopInfoInner.status" @change="shopStatusChange">
                                <el-radio-button :label="0" :disabled="shopStatus !== 0">未开业</el-radio-button>
                                <el-radio-button :label="1"
                                                 :disabled="shopStatus === 0 || shopStatus === 3">营业中
                                </el-radio-button>
                                <el-radio-button :label="2"
                                                 :disabled="shopStatus === 0 || shopStatus === 3">休息中
                                </el-radio-button>
                                <el-radio-button :label="3"
                                                 :disabled="shopStatus === 0">已停业
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="开业日期：" class="form-openDate" :title="shopInfoInner.openDate">
                            <el-date-picker
                                    v-model="shopInfoInner.openDate"
                                    :format="'yyyy-MM-dd'"
                                    :picker-options="datePickerOptions"
                                    :disabled="shopInfoInner.status !== 0"
                                    @change="openDateChange"
                                    size="small"
                                    align="right"
                                    type="date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="停业日期：" class="form-closeDate" :title="shopInfoInner.closeDate">
                            <el-date-picker
                                    v-model="shopInfoInner.closeDate"
                                    :format="'yyyy-MM-dd'"
                                    :picker-options="datePickerOptions"
                                    :disabled="true"
                                    size="small"
                                    align="right"
                                    type="date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 【浏览】状态-->
            <el-form inline :model="shopInfoInner" label-width="95px" class="shop-info-form" v-else>
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="所属店组：" class="form-groupId">
                            <label v-text="shopInfoInner.groupName"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="开业状态：" class="form-status">
                            <el-radio-group size="small" v-model="shopInfoInner.status">
                                <el-radio-button :label="0" :disabled="shopInfoInner.status !== 0">未开业</el-radio-button>
                                <el-radio-button :label="1"
                                                 :disabled="shopInfoInner.status !== 1">营业中
                                </el-radio-button>
                                <el-radio-button :label="2"
                                                 :disabled="shopInfoInner.status !== 2">休息中
                                </el-radio-button>
                                <el-radio-button :label="3"
                                                 :disabled="shopInfoInner.status !== 3">已停业
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="8">
                        <el-form-item label="开业日期：" class="form-openDate">
                            <label v-text="shopInfoInner.openDate"></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="停业日期：" class="form-closeDate">
                            <label v-text="shopInfoInner.closeDate"></label>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {sortBy} from 'utils/index';
    import {getGroupList} from '@/api/basic/group/group';

    export default {
        name: 'shop-base-info',
        props: {
            // 页面标识
            pageType: {// 1 新增; 2 编辑; 3 查看
                type: Number,
                default: 3
            },
            // 店铺信息
            shopInfo: {
                type: Object,
                required: true,
                default: {}
            },
            // 店铺状态初始值
            shopStatus: {
                type: Number,
                required: true,
                default: -1
            }
        },
        data() {
            return {
                isShowDetail: true,
                groupOptions: [],
                datePickerOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date() - 3600 * 1000 * 24;
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '明天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '后天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
                            picker.$emit('pick', date);
                        }
                    }]
                }
            }
        },
        computed: {
            shopInfoInner: function () {
                let statusName = this.shopInfo.status === 0 ? '未开业' : this.shopInfo.status === 1 ? '正在营业'
                    : this.shopInfo.status === 2 ? '营业结束' : this.shopInfo.status === 3 ? '店铺已关闭' : '-';
                this.shopInfo.statusName = statusName;
                return this.shopInfo
            },
            informationIconClass: function () {
                return this.isInformationOpened ? 'information_up' : 'information_down';
            }
        },
        methods: {
            // 获取店组列表
            getGroupList() {
                let keyValue = '',
                    status = -1;
                return getGroupList({keyValue, status}).then((res) => {
                    if (res.retCode === 'SUCCESS') {
                        let data = res.result.sort(sortBy('storeNum', false))
                        this.groupOptions = data.map(item => {
                            return {value: item.groupId, label: item.groupName};
                        });
                        this.groupOptions.unshift({value: -1, label: '请选择'});
                    } else {
                        this.$message(res.retMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            // 开业日期变化
            openDateChange(val){
                this.shopInfoInner.openDate = val;
            },
            // 开业状态变化
            shopStatusChange(val) {
                console.log('shopStatus init', this.shopStatus);
                console.log('shopStatus', this.shopInfoInner.status);
            }
        },
        activated() {
            this.getGroupList();
        },
        watch: {
            'shopInfoInner': {
                handler: function (val, oldVal) {
                    this.$emit('update:shopInfo', val);
                },
                deep: true
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .shop-expand-info {
        .slic-form-til {
            cursor: pointer;
        }
        .form-groupId {
            .el-form-item__content {
                // TODO 宽度写死，未知原因
                .el-select {
                    width: 193px;
                }
            }
        }
        .el-form-item {
            width: 100%;
            margin-bottom: 10px;
            .el-form-item__content {
                width: calc(100% - 100px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

    }
</style>