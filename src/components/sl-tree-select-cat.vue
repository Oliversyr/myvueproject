<template>
  <div class="sl-tree-cat" :class="{'activeTree': showSlTree}" @click="$event.stopPropagation()">
    <el-input size="small" class="sl-tree-input" @focus="showSlTree = true" placeholder="请选择品类"
              v-model="treeNodeInfo" readonly :icon="treeNodeInfo ? 'circle-close' : ''" :on-icon-click="iconClose">
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
          :props="slTreeProps"
          show-checkbox
          @check-change="selectTree"
          :filter-node-method="filterNode"
          highlight-current
          :default-expanded-keys="expendNodes"
          :node-key="slTreeProps.key"
          :check-strictly="true"
          ref="slTree">
        </el-tree>
      </div>
  </div>
</template>

<script>
    import {getCategoryList} from '@/api/basic/cat';
  export default {
    name: 'sl-tree-select',
    props: ['slTreeProps', 'showPrepend', 'isShowThird', 'defaultCheck', 'resetCheck', 'onlyleaf', 'dataFromOut', 'fromOutData'],
    data () {
      return {
        slTreeData: [],
        showSlTree: false,
        treeNodeInfo: '',
        treeData: [],
        treeText: '',
          expendNodes: [],
        /*defaultProps: {
          children: 'children',
          label: 'ename'
        }*/
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        const _this = this;
        console.log(333333333333, this.dataFromOut);
          if(!!!this.dataFromOut) {
              this.getCatList();

          }


          if(this.defaultCheck) {
              this.treeNodeInfo = this.defaultCheck.catName;
              console.log('fromOutData',this.treeNodeInfo)
          }

          if(this.fromOutData) {
              this.slTreeData = this.fromOutData;
              let tdata = JSON.parse(JSON.stringify(this.slTreeData))
              this.treeData = this.treeBuild(tdata);

              if(this.defaultCheck) {

                  this.$refs.slTree.setCheckedKeys([this.defaultCheck.key]);

                  setTimeout(() => {
                      let treeName = this.$refs.slTree.getCheckedNodes();
                      console.log('_this.treeName125==', treeName)
                      if(treeName.length > 0) {
                          this.treeNodeInfo = treeName[0][this.slTreeProps.label];
                          this.expendNodes.push(treeName[0][this.slTreeProps.key]);
                      } else {
                          this.treeNodeInfo = '无';
                      }


//                    _this.treeNodeInfo = _this.$refs.slTree.getCheckedKeys()[this.slTreeProps.label];
                      console.log('_this.treeName125==', treeName)
                      console.log('_this.treeNodeInfo125==', _this.treeNodeInfo)

                  },200)


              }

          }

        document.body.addEventListener('click', function () {
          _this.showSlTree = false
        })
      })
    },
    activated: function () {
        if(this.defaultCheck) {

            this.treeNodeInfo = this.defaultCheck.catName;
        }
    },
    methods: {
        // 获取品类列表
        getCatList() {
            const _this = this;
            let mylevelId;
            if(_this.defaultCheck) {
                mylevelId = _this.defaultCheck.levelId - 1;
            }
            getCategoryList({catName: '', levelId: mylevelId}).then(res => {

                if(res.retCode === 'SUCCESS') {
                    this.slTreeData = res.result;
                    let tdata = JSON.parse(JSON.stringify(this.slTreeData))
                    this.treeData = this.treeBuild(tdata);

                    if(this.defaultCheck) {
                        this.$refs.slTree.setCheckedKeys([this.defaultCheck.key]);
                        console.log('_this.treeName125==', this.defaultCheck.key)
                        this.treeNodeInfo = this.defaultCheck.catName;
                        setTimeout(() => {
                            let treeName = this.$refs.slTree.getCheckedNodes();
                            console.log('_this.treeName125==', treeName)
                            if(treeName.length > 0) {
                                this.treeNodeInfo = treeName[0].catName;
                                this.expendNodes.push(treeName[0][this.slTreeProps.key]);
                            }
                        },500)
                    }
                    console.log('this.slTreeData==', this.slTreeData)
                } else {
                    this.$message(res.retMsg);
                }
            }).catch(err => {
                this.$message(err.retMsg);
            });
        },
        treeBuild(dataList) {


            const _this = this;
            if(this.isShowThird && this.onlyleaf) {
                dataList.forEach((item1, i) => {
                    item1.disabled = true;
                    if(item1[_this.slTreeProps.children] && item1[_this.slTreeProps.children].length > 0) {

                        item1[_this.slTreeProps.children].forEach((item2, j) => {
                            item2.disabled = true;
                            /*if(item2[_this.slTreeProps.children] && item2[_this.slTreeProps.children].length > 0) {
                                item2.disabled = true;
                            }*/
                        });

                    }

                });
            } else if(!this.isShowThird) {
                dataList.forEach((item1, i) => {
                    if(item1[_this.slTreeProps.children]) {
                        if(item1[_this.slTreeProps.children].length > 0) {
                            item1[_this.slTreeProps.children].forEach((item2, j) => {
                                if(item2[_this.slTreeProps.children]) {
                                    item2[_this.slTreeProps.children] = null;
                                }
                            });
                        }
                    }
                });
            }
            console.log('dataList===', dataList)

            return dataList;
        },
      selectTree (node, sel) {
            console.log('sel==', node, sel);
        if(sel) {
            this.treeNodeInfo = node[this.slTreeProps.label];
            console.log(node[this.slTreeProps.label])
            this.$refs.slTree.setCheckedKeys([node.catId]);
            this.$emit('selectedNode', node)
            this.showSlTree = false;
        }

      },
      filterNode (value, data) {
        if (!value) return true
        return data[this.slTreeProps.label].indexOf(value) !== -1
      },
        iconClose() {
            this.$refs.slTree.setCheckedKeys([]);
            this.treeNodeInfo = '';
            let selNode = {
                catId: -1
            }
            this.$emit('selectedNode', selNode);
            this.showSlTree = false;
        }

    },
    watch: {
      treeText (val) {
        this.$refs.slTree.filter(val);
      },
      /*defaultCheck (val) {
          const _this = this;
        console.log("kdjsfsv==",val)
          if(val == -1) {
            this.treeNodeInfo = '无';
          } else {
              _this.$refs.slTree.setCheckedKeys([val]);

              _this.treeNodeInfo = _this.$refs.slTree.getCheckedKeys()[this.slTreeProps.label];

              console.log('_this.treeNodeInfo125==', _this.treeNodeInfo)
          }
//        this.treeNodeInfo = this.nodeVal;
      },*/
      slTreeData (val) {
          if(val && val.length > 0) {
              let tdata = JSON.parse(JSON.stringify(this.slTreeData))
//              this.treeData = this.treeBuild(tdata);
              console.log('this.treeData==123', this.treeData)
          }

      },
      resetCheck(val) {
          if(val) {
              this.$refs.slTree.setCheckedKeys([]);
              this.treeNodeInfo = '';
          }
      },
        fromOutData(val) {
            const _this = this;
          console.log('16545', val)
          if(val) {
              this.slTreeData = val;
              let tdata = JSON.parse(JSON.stringify(this.slTreeData))
              this.treeData = this.treeBuild(tdata);

              if(this.defaultCheck) {
//                console.log('_this.this.defaultCheck==', this.defaultCheck)
                  this.$refs.slTree.setCheckedKeys([this.defaultCheck.key]);
                  this.treeNodeInfo = this.defaultCheck.catName;
                  setTimeout(() => {
                      let treeName = this.$refs.slTree.getCheckedNodes();
                      console.log('_this.treeName125==', treeName)
//                    this.treeNodeInfo = treeName[0][this.slTreeProps.label];

//                    _this.treeNodeInfo = _this.$refs.slTree.getCheckedKeys()[this.slTreeProps.label];
                      console.log('_this.treeName125==', treeName)
                      console.log('_this.treeNodeInfo125==', _this.treeNodeInfo)
                      this.expendNodes.push(treeName[0][this.slTreeProps.key]);
                  },1500)


              }

          }
        }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  .sl-tree-cat{
      width: 100%;
      position: relative;
      .el-checkbox {
          .el-checkbox__input {
              &.is-disabled {
                  display: none;
              }
          }
      }
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
