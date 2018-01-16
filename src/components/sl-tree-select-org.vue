<template>
  <div class="sl-tree" :class="{'activeTree': showSlTree}" @click="$event.stopPropagation()">
    <el-input size="small" class="sl-tree-input" @focus="showSlTree = true" :placeholder="placeholder" v-model="treeNodeInfo"
               readonly>
      <template slot="prepend" v-if="prepend">
        {{prepend}}
      </template>
    </el-input>

      <div style="text-align: left" v-show="showSlTree" class="sl-tree-content">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="treeText" class="sl-tree-content-input">
        </el-input>

        <el-tree
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          @check-change="selectTree"
          :filter-node-method="filterNode"
          highlight-current
          node-key="eid"
          :check-strictly="true"
          ref="slTree">
        </el-tree>
      </div>
  </div>
</template>

<script>
    import {getOrgList} from '@/api/basic/org';
  export default {
    name: 'sl-tree-select-org',
    props: ['slTreeProps', 'prepend', 'isShowThird', 'defaultCheck', 'resetCheck', 'placeholder'],
    data () {
      return {
        showSlTree: false,
        treeNodeInfo: '',
        treeData: [],
        treeText: '',
        defaultProps: {
          children: 'children',
          label: 'ename'
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        const _this = this;
//        this.treeNodeInfo = this.nodeVal;
          this.getOrg();
//        this.treeData = this.treeBuild(this.slTreeData);
//        console.log(this.defaultProps);
        document.body.addEventListener('click', function () {
          _this.showSlTree = false
        })
      })
    },
    methods: {
        // 获取组织机构列表
        getOrg() {
            getOrgList().then((res) => {
                if(res.retCode === 'SUCCESS') {
                    this.slTreeData = JSON.parse(JSON.stringify(res.result));
                    this.treeData = this.treeBuild(this.slTreeData);
                } else {
                    this.$message(res.retMsg);
                }
            }).catch((err) => {

            })
        },
        treeBuild(dataList) {
            const _this = this;
            let firstLevel = [];
            let secondLevel = [];
            let thirdLevel = [];

            let oneLevel;

//            console.log('6546565',dataList);

            dataList.forEach((item, i) => {
                if(item.levelId == 0) {
                    _this.$set(item, 'children', []);
                    firstLevel.push(item);
                } else if(item.levelId == 1) {
                    _this.$set(item, 'children', []);
                    secondLevel.push(item);
                } else {
                    thirdLevel.push(item);
                }
            });

            oneLevel = firstLevel.slice();


            firstLevel.forEach((item1, i) => {
                secondLevel.forEach((item2, j) => {

                    if(_this.isShowThird) {
                        thirdLevel.forEach((item3, k) => {
                            if(item3.parentid === item2.eid) {
                                item2.children.push(item3);
                            }
                        })
                        if(item2.parentid === item1.eid) {
                            item1.children.push(item2);
                        }
                    } else {
                        if(item2.parentid === item1.eid) {
                            item1.children.push(item2);
                        }
                    }
                })
            });

            return firstLevel;
        },
      selectTree (node, sel) {
            console.log('node==', node, sel)
          if(sel) {
              this.treeNodeInfo = node.ename;
              console.log('node==', this.treeNodeInfo)
              this.$emit('selectedNode', node)
              this.showSlTree = false;
          }

      },
      filterNode (value, data) {
        if (!value) return true
        return data.ename.indexOf(value) !== -1
      }

    },
    watch: {
      treeText (val) {
        this.$refs.slTree.filter(val);
      },
      defaultCheck (val) {
          const _this = this;
        console.log(val)
          if(val == -1) {
            this.treeNodeInfo = '无';
          } else {
              _this.$refs.slTree.setCheckedKeys([val]);
              _this.treeNodeInfo = _this.$refs.slTree.getCheckedKeys().ename;
          }
//        this.treeNodeInfo = this.nodeVal;
      },
      slTreeData (val) {
//          this.treeData = this.treeBuild(this.slTreeData);
      },
        resetCheck(val) {
          console.log(val)
            if(val) {
              console.log('valvalvalval==', val)
//                this.treeNodeInfo = '';
              this.$set(this, 'treeNodeInfo', '');
                this.$refs.slTree.setCheckedKeys([]);
                console.log('valvalvalval==', this.treeNodeInfo)

            }
        }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  .sl-tree{
    width: 100%;
    position: relative;
  }

  .sl-tree-input{
    width: 100%;
  }

  .sl-tree-content{
      width: 100%;
      padding-bottom: 20px;
  }

  .activeTree {
      background-color: #fff;

      .sl-tree-input{
          width: 100%;
          border: 1px solid #28e;
          border-bottom: 0;
          margin-top: -1px;
          border-radius: 6px 6px 0px 0px;

          input {
            border: 0;
            outline: none;
          }

          .el-input-group__prepend {
            border: 0;
            outline: none;
            background-color: #fff;
            color: #fff;
          }
      }

      .sl-tree-content{
          width: 100%;
          border: 1px solid #28e;
          border-top: 0;
          position: absolute;
          top: 28px;
          left: 0;
          z-index: 999;
          background-color: #fff;
          border-radius: 0 0 6px 6px;
          overflow: hidden;
      }

      .el-tree {
          border: 0;
          outline: none;
      }

  }

  .sl-tree-content-input i {
    right: 10px;
  }


  .sl-tree-content-input{
    padding: 10px;
  }

  .filter-tree {
    max-height: 165px;
    overflow-y: auto;
  }

</style>
