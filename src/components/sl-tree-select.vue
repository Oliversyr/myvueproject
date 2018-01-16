<template>
  <div class="sl-tree" :class="{'activeTree': showSlTree}" @click="$event.stopPropagation()">
    <el-input size="small" class="sl-tree-input" @focus="showSlTree = true" placeholder="请选择机构"
              v-model="treeNodeInfo" readonly>
      <template slot="prepend" v-if="showPrepend">
        <slot name="prepend"></slot>
      </template>
    </el-input>

      <div style="text-align: left" v-show="showSlTree" class="sl-tree-content">
        <el-input
          icon="search"
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
          :default-expanded-keys="expendNodes"
          node-key="eid"
          :check-strictly="true"
          ref="slTree">
        </el-tree>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'sl-tree-select',
    props: ['slTreeData', 'slTreeProps', 'showPrepend', 'isShowThird', 'defaultCheck', 'isMult'],
    data () {
      return {
        showSlTree: false,
        treeNodeInfo: '',
          selectTimeOut: true,
        treeData: [],
          expendNodes: [],
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
        this.treeData = this.treeBuild(this.slTreeData);
        console.log(this.defaultCheck);
        document.body.addEventListener('click', function () {
          _this.showSlTree = false
        })
      })
    },
    methods: {
        treeBuild(dataList, levelId) {
            const _this = this;
            console.log(123333333333333333333333333333)
            let firstLevel = [];
            let secondLevel = [];
            let thirdLevel = [];

            dataList.forEach((item, i) => {
                if(!_this.isShowThird) {
                    if(item.orgtype === 0) {
                        if(item.levelId == 0) {
                            _this.$set(item, 'children', []);
                            firstLevel.push(item);
                        } else if(item.levelId == 1) {
                            _this.$set(item, 'children', []);
                            secondLevel.push(item);
                        } /*else {
                            thirdLevel.push(item);
                        }*/
                    }
                } else {
                    if(item.levelId == 0) {
                        _this.$set(item, 'children', []);
                        firstLevel.push(item);
                    } else if(item.levelId == 1) {
                        _this.$set(item, 'children', []);
                        secondLevel.push(item);
                    } else {
                        thirdLevel.push(item);
                    }
                }

            });

            if(levelId == 1){
                console.log('1111111111111111111111',firstLevel)
                return firstLevel;
            } else {
                firstLevel.forEach((item1, i) => {
                    secondLevel.forEach((item2, j) => {
                        thirdLevel.forEach((item3, k) => {
                            if(item3.parentid === item2.eid) {
                                item2.children.push(item3);
                            }
                        })
                        if(item2.parentid === item1.eid) {
                            item1.children.push(item2);
                        }
                    })
                });

                return firstLevel;
            }

        },
      selectTree (node, isSel, node2) {
            const _this = this;
          console.log('node>>>', node, isSel, node2)
          if(isSel) {

              _this.treeNodeInfo = node.ename;

              if(this.isMult) {
                  let treeName = this.$refs.slTree.getCheckedNodes();
                  console.log('treeName==', treeName)
                  treeName.forEach((item, i) => {
                      _this.treeNodeInfo = _this.treeNodeInfo === '' ? item.ename :  _this.treeNodeInfo + '、' + item.ename;
                  })
                  this.$emit('selectedNode', treeName);
              } else {
                  _this.treeNodeInfo = node.ename;
                  console.log('node==', _this.treeNodeInfo)
                  this.$emit('selectedNode', node);
                  this.showSlTree = false;
              }
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
      defaultCheck (value) {
          const _this = this;
          console.log('value==', value)
          let val;
          value = value ? value.toString() : value;


          if(value && value.indexOf('/') !== -1){
              val = value.split('/')[0];
              let levelId = value.split('/')[1];
              this.treeData = this.treeBuild(this.slTreeData, levelId);
          } else {
              val = value;
          }

        console.log('123456=========>==',val)

          if(!val || val === '') {
              this.treeNodeInfo = '';
          } else if(val == -1) {
            this.treeNodeInfo = '无';
          } else if(val) {
//              val = parseInt(val);
              _this.$refs.slTree.setCheckedKeys([val]);
              setTimeout(() => {
                  let treeName = _this.$refs.slTree.getCheckedNodes();


                  console.log('_this.treeName125==', treeName);
                  _this.treeNodeInfo = treeName[0].ename;
                  console.log('_this.treeNodeInfo125==', treeName)
                  _this.expendNodes.push(treeName[0][_this.slTreeProps.key]);
              },500)

//              this.expendNodes.push(val);
          } else {
              console.log('123456=>>',val)
              this.treeNodeInfo = '';
          }
      },
      slTreeData (val) {
          this.treeData = this.treeBuild(this.slTreeData);
      },
        treeNodeInfo(val) {
            console.log('treeNodeInfo==',val)
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
