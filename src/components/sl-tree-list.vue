<template>
    <div class="tree-container">
        <div class="tree-gradeList" v-for="ofirst in treeList" :key="ofirst[label]" v-if="ofirst.isShow">
            <div class="tree-firstGrade gradeList active" style="position: relative;" :class="{'forbidOpr': ofirst.noPower}" @click.stop="getThisNode(ofirst, $event)">
                <i class="tree-open-close fGrade" :class="{'isExpand': ofirst.showChildren }" @click.stop="isShowChildren(ofirst)"></i>
                <el-radio class="radio" v-model="selectedNode" :label="ofirst[selected]" :disabled="ofirst.noPower">{{(ofirst.status == 0) ? '(已禁用)' : ''}} {{ofirst[label]}}</el-radio>
            </div>
            <!--<el-collapse-transition>-->
            <div v-show="ofirst.showChildren">
                <div v-for="osecond in ofirst.children" :key="osecond[label]" v-if="osecond.isShow">
                    <div class="tree-secondGrade gradeList" style="position: relative;" @click.stop="getThisNode(osecond, $event)" :class="{'forbidOpr': osecond.noPower}">
                        <i class="tree-open-close sGrade" :class="{'isExpand': osecond.showChildren }" @click.stop="isShowChildren(osecond)"></i>
                        <el-radio class="radio" v-model="selectedNode" :label="osecond[selected]" :disabled="osecond.noPower">
                            {{(osecond.status == 0) ? '(已禁用)' : ''}} {{osecond[label]}}</el-radio>
                    </div>

                    <el-collapse-transition>
                        <ul v-show="osecond.showChildren">
                            <li class="tree-threeGrade gradeList" v-for="othird in osecond.children" :key="othird[label]" v-if="othird.isShow" :class="{'forbidOpr': othird.noPower}" @click="getThisNode(othird, $event)">
                                <el-radio class="radio tGrade" v-model="selectedNode" :label="othird[selected]" :disabled="othird.noPower">{{(othird.status == 0) ? '(已禁用)' : ''}} {{othird[label]}}</el-radio>
                            </li>
                        </ul>
                    </el-collapse-transition>
                </div>
            </div>
            <!--</el-collapse-transition>-->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'sl-tree-list',
    props: ['treeData', 'treeProps', 'isShowThird', 'searchKey','treeId'],
    data() {
        return {
            label: '',
            children: '',
            selected: '',
            treeList: [],
            selectedNode: {},
            myOrder: 0
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            const _this = this;
            this.label = this.treeProps.label;
            this.selected = this.treeProps.selected;
            this.selectedNode = this.userInfo.loginEid;
            setTimeout(() => {
                //                    document.getElementsByClassName('gradeList')[_this.myOrder].click();
                this.$emit('treeSelected', _this.myOrder)
            }, 1000)
        })
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    /*computed: {
        treeList: function () {
            let data = this.treeBuild(this.treeData);
            return data;
        }
    },*/
    methods: {
        treeBuild(dataList,treeid) {
            const _this = this;
            let firstLevel = [];
            let secondLevel = [];
            let thirdLevel = [];
            let isShowThird = this.isShowThird == undefined ? true : this.isShowThird;

            let myLevel = 0;

            dataList.forEach((item, i) => {
                if (item.levelId == 0) {
                    _this.$set(item, 'children', []);
                    _this.$set(item, 'showChildren', true);
                    _this.$set(item, 'isShow', true);
                    _this.$set(item, 'noPower', true);
                    firstLevel.push(item);
                } else if (item.levelId == 1) {
                    _this.$set(item, 'children', []);
                    _this.$set(item, 'showChildren', true);
                    _this.$set(item, 'isShow', true);
                    _this.$set(item, 'noPower', true);
                    secondLevel.push(item);
                } else {
                    _this.$set(item, 'isShow', isShowThird);
                    _this.$set(item, 'noPower', true);
                    thirdLevel.push(item);
                }

                if (item.eid === this.userInfo.loginEid) {
                    myLevel = item.levelId;
                    this.myOrder = item;
                }
            });

            firstLevel.forEach((item1, i) => {
                if (item1.eid == treeid) {
                    // this.doSelectTree(item1.ename);
                    this.$emit('treeSelected', item1);
                    this.selectedNode = treeid;
                }
                secondLevel.forEach((item2, j) => {
                    if (item2.eid == treeid) {
                        // this.doSelectTree(item2.ename);
                        this.$emit('treeSelected', item2);
                        this.selectedNode = treeid;
                    }
                    thirdLevel.forEach((item3, k) => {
                        if (item3.eid == treeid) {
                            // this.doSelectTree(item3.ename);
                            this.$emit('treeSelected', item3);
                            this.selectedNode = treeid;
                            treeid = false;
                        }
                        if (item3.parentid === item2.eid) {
                            item2.children.push(item3);
                        }
                    })
                    if (item2.parentid === item1.eid) {
                        item1.children.push(item2);
                    }
                })
            });

            if (myLevel === 0) {
                firstLevel.forEach((item1, i) => {
                    item1.noPower = false;
                    secondLevel.forEach((item2, j) => {
                        if (item2.parentid === item1.eid) {
                            item2.noPower = false;

                            thirdLevel.forEach((item3, k) => {
                                if (item3.parentid === item2.eid) {
                                    item3.noPower = false;
                                }
                            })
                        }
                    })
                });
            } else if (myLevel === 1) {
                firstLevel.forEach((item1, i) => {
                    secondLevel.forEach((item2, j) => {
                        if (item2.eid === this.userInfo.loginEid) {
                            item2.noPower = false;
                            thirdLevel.forEach((item3, k) => {
                                if (item3.parentid === item2.eid) {
                                    item3.noPower = false;
                                }
                            })
                        }
                    })
                });
            } else if (myLevel === 2) {
                firstLevel.forEach((item1, i) => {
                    secondLevel.forEach((item2, j) => {
                        thirdLevel.forEach((item3, k) => {
                            if (item3.eid === this.userInfo.loginEid) {
                                item3.noPower = false;
                            }
                        })
                    })
                });
            }

            console.log('firstLevel==', firstLevel)
            return firstLevel;
        },
        getThisNode(obj, event) {

            //                event.preventDefault();
            event.stopPropagation();
            //                console.log(obj, this.selectedNode);

            if (obj.eid === this.selectedNode) {
                if (!obj.noPower) {
                    let gradeList = document.getElementsByClassName('gradeList');
                    for (let i = 0; i < gradeList.length; i++) {
                        gradeList[i].classList.remove('active');
                    }
                    event.target.classList.add('active');
                    this.$emit('treeSelected', obj)
                }
            }
        },
        isShowChildren(event) {
            event.showChildren = !event.showChildren;
        },
        //通过名称选择tree
        doSelectTree(val) {
            this.treeList.forEach((item1, i) => {
                item1.isShow = false;
                let ischild1 = false;
                item1.children.forEach((item2, j) => {
                    item2.isShow = false;
                    let ischild2 = false;
                    item2.children.forEach((item3, k) => {
                        item3.isShow = false;
                        if (item3[this.label].indexOf(val) != -1 && this.isShowThird) {
                            item3.isShow = true;
                            item2.isShow = true;
                            item1.isShow = true;
                            ischild2 = true;
                            ischild1 = true;
                        }
                    });

                    if (!ischild2 && item2[this.label].indexOf(val) != -1) {
                        item2.isShow = true;
                        item1.isShow = true;
                        ischild1 = true;
                    }
                    item2.showChildren = ischild2;
                });

                if (!ischild1 && item1[this.label].indexOf(val) != -1) {
                    item1.isShow = true;
                }
                item1.showChildren = ischild1;
            })
        }
    },
    watch: {
        searchKey(val) {
            this.doSelectTree(val);
        },
        treeData(val) {
            this.treeList = this.treeBuild(this.treeData);
        },
        treeId(val) {
            setTimeout(()=> {
                this.treeList = this.treeBuild(this.treeData,this.treeId);
            }, 250);
        }

    }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.tree-container {
    border: 1px solid #e5e5e5;
    height: 100%;
    overflow-y: auto;

    .radio {
        width: 100%;
    }

    .tree-container {
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .tree-gradeList {
        /*padding: 10px;*/
    }

    .tree-firstGrade {
        font-weight: bold;
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #e5e5e5;
        font-size: 14px;
        cursor: pointer;
        padding: 0 10px;
        padding-left: 30px;
    }

    .tree-secondGrade {
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #e5e5e5;
        border-top: 1px solid #e5e5e5;
        background-color: #f9f9f9;
        text-align: left;
        cursor: pointer;
        padding-left: 50px;
    }

    .tree-threeGrade {
        height: 37px;
        line-height: 37px;
        border-bottom: 1px dashed #e5e5e5;
        text-align: left;
        cursor: pointer;
    }

    .gradeList:hover,
    .gradeList.active {
        background-color: #dcebfa;
    }

    .gradeList {

        .tree-modal {
            height: 100%;
        }
    }

    .forbidOpr {
        /*cursor: not-allowed ;*/
    }


    .tree-open-close {
        position: absolute;
        z-index: 9;
        top: 12px;
        left: 60px;
        width: 13px;
        height: 13px;
        background: url(../assets/img/icon-classify.png) center no-repeat;
        background-position: 0 -30px;
        /*background-size: 100%;*/
    }

    .isExpand {
        background-position: 0 -15px;
    }

    .fGrade {
        left: 10px;
    }

    .sGrade {
        left: 30px;
    }

    .tGrade {
        padding-left: 70px;
    }
}
</style>