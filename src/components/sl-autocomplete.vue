<template>
    <div class="sl-autocom-container">

        <div class="sl-autocom-input" :class="{'ofocus': inputFocus}">

            <div class="sl-autocom-prepend" v-if="prepend">
                 {{prepend}}
            </div>

            <span class="selected-item" v-for="(item, index) in selectedItem">
                {{item[displayProp]}}
                <i class="el-icon-close" style="cursor: pointer;" @click="clearItem(index)"></i>
            </span>
            <el-input v-model="querykey" :placeholder="selectedItem.length>0 ? '' : placeholder " class="selected-input" :class="{'hasSelectedItem': selectedItem.length > 0, 'noPrepend': !prepend}"
                      @focus="inputFocus = true" @blur="inputFocus = false">
            </el-input>

            <span class="sl-autocom-icon">
                <slot name="icon-more"></slot>
            </span>
        </div>

        <el-collapse-transition>
            <div class="sl-autocom-content" :style="owidth" v-if="showList" @click="listClick($event)" >
                <div class="sl-autocom-list-title">
                    <span v-for="title in paramsList" class="listTitle" :style="title.width">{{title.value}}</span>
                </div>
                <div class="nodata" v-if="nodata">
                    搜索结果为空!
                </div>
                <ul style="height: 280px;overflow-y: auto;" v-loading="load2" v-else>
                    <li v-for="(list, index) in itemList" class="listContent" :class="{'selectedIndex': list.selectedIndex, 'multSelected': list.multSelected}"
                        @click="clickSelected(list)" @mouseover="listHover(list, index)">
                        <span v-for="param in paramsList" :style="param.width" class="itemList-span" :title="list[param.key]">{{list[param.key]}}</span>
                    </li>
                </ul>
                <div class="sl-autocom-list-footer">
                    <!--<span v-if="isMultiple" class="footer-text">
                        <span>支持键盘 <strong> 空格键 </strong> 或 <strong> Ctrl + 鼠标左键 </strong> 选中商品</span>
                        <span>当前已选中数目：{{multSelNum}}条</span>
                    </span>-->
                    <span class="footer-btn">
                        <!--<el-button size="small" @click="doSure()"></el-button>-->
                        <span @click="doSure()" style="margin-right: 20px;" v-if="!load2">确定</span>
                        <span @click="doCancel()">取消</span>
                        <!--<el-button size="small" @click="doCancel()">取消(Esc)</el-button>-->
                    </span>

                </div>
            </div>
        </el-collapse-transition>
    </div>


</template>

<script>
    import ElInput from '../../node_modules/element-ui/packages/input/src/input'
    import ElButton from '../../node_modules/element-ui/packages/button/src/button'
    export default {
        components: {
            ElButton,
            ElInput},
        name: 'sl-autocomplete',
        props: ['dataList', 'autoParams', 'slWidth', 'colWidths', 'displayProp', 'selectedMode', 'defaultVal', 'nomore', 'prepend', 'placeholder', 'clearInput'],
        data() {
            return {
                load2: false,
                querykey: '',
                nodata: false,
                selectedItem: [],
                inputFocus: false,
                itemList: [],
                paramsList: [],
                owidth: '',
                showList: false,
                isMultiple: false,
                selectItemIndex: 0,
                multSelNum: 0,
                pressCtrl: false,
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                console.log(this.colWidths)
                const _this = this;
                this.isMultiple = this.selectedMode === 'MULT';
                this.owidth = `width: ${this.slWidth}px;`

                let colWidth = this.colWidths.split(',');

                for(let param in this.autoParams) {
                    let title = {
                        key: param,
                        value: this.autoParams[param]
                    };
                    this.paramsList.push(title);
                }

                this.paramsList.forEach((item, i) => {
                    item.width = `width: ${colWidth[i]}%`;
                })

                document.body.addEventListener('click', function () {
                    this.showList = false;
                })

                /*document.body.addEventListener('keydown', function (event) {
//                    console.log(event);
//                    _this.keySelect(event);
                    if(_this.showList) {
                        _this.inputKeyDown(event);
                    }
                })*/

                /*document.body.addEventListener('keyup', function (event) {
//                    console.log(event);
//                    _this.keySelect(event);
                    if(_this.showList) {
                        _this.inputKeyUp(event);
                    }
                })*/

            })
        },
        methods: {
            // 清除input中的选项
            clearItem(index) {
                this.selectedItem.splice(index, 1);
                this.$emit('doAutoSelected', '');
            },
            // 点击选中选项
            clickSelected(obj) {
                if(this.isMultiple && this.pressCtrl) {
                    obj.multSelected = !obj.multSelected;
                    this.multSelNum = obj.multSelected ? this.multSelNum + 1 : this.multSelNum - 1;
                } else {
                    if(!this.isMultiple) {
                        this.selectedItem = [];
                    }
                    this.selectedItem.push(obj);
                    console.log(this.selectedItem);
                    this.$emit('doAutoSelected', obj);
                    this.querykey = '';
                }
            },
            // 取消
            doCancel() {
                this.querykey = '';
                this.showList = false;
                this.selectedItem = [];
                this.selectItemIndex = 0;
            },
            // 确定
            doSure() {
                if(this.isMultiple) {
                    let multsel = [];
                    this.itemList.forEach((item, i) => {
                        if(item.multSelected) {
                            multsel.push(item);
                        }
                    });
                    this.$emit('doAutoSelected', multsel);
                } else {
                    let obj = this.itemList[this.selectItemIndex];
                    this.selectedItem.push(obj);
                    this.$emit('doAutoSelected', obj);
                }

                this.querykey = '';
                this.showList = false;
            },
            // 列表框的点击事件
            listClick(event) {
                event.stopPropagation();
            },
            // 选中事件
            selectedEvent(obj) {
                for (let i = 0; i < this.itemList.length; i++) {
                    if(this.itemList[i].hasOwnProperty('selectedIndex')) {
                        if(this.itemList[i].selectedIndex) {
                            this.itemList[i].selectedIndex = false;
                            break;
                        }
                    } else {
                        this.itemList[i].selectedIndex = false;
                    }
                }
                obj.selectedIndex = true;
                console.log(obj);
            },
            // 列表hover事件
            listHover(obj, index) {
                this.selectedEvent(obj);
                this.selectItemIndex = index;
            },
            // input焦点时的键盘事件
            inputKeyDown(event) {
                let keycode = event.keyCode;
                switch (keycode) {
                    case 13: // Enter
                        this.enterItem(event);
                        break;
                    case 38: // Up
                        this.preItem(event);
                        break;
                    case 40: // Down
                        this.nextItem(event);
                        break;
                    case 32: // Space
                        if(this.isMultiple) this.spaceItem(event);
                        break;
                    case 27: // Esc
                        this.escItem(event);
                        break;
                    case 17: // Ctrl
                        this.ctrlItem(event);
                        break;
                }
            },
            // 键盘向上箭头
            preItem(event) {
                event.preventDefault();
                this.selectItemIndex = this.selectItemIndex === 0 ? (this.itemList.length - 1) : (this.selectItemIndex - 1);
                this.selectedEvent(this.itemList[this.selectItemIndex]);
            },
            // 键盘向下箭头
            nextItem(event) {
                event.preventDefault();
                this.selectItemIndex = (this.selectItemIndex === this.itemList.length - 1) ? 0 : (this.selectItemIndex + 1);
                this.selectedEvent(this.itemList[this.selectItemIndex]);
            },
            // Enter键
            enterItem(event) {
                this.doSure();
            },
            // space键
            spaceItem(event) {
                event.preventDefault();
                this.itemList[this.selectItemIndex].multSelected = !this.itemList[this.selectItemIndex].multSelected;
                this.multSelNum = this.itemList[this.selectItemIndex].multSelected ? this.multSelNum + 1 : this.multSelNum - 1;
            },
            // Esc键
            escItem(event) {
                this.doCancel();
            },
            // ctrl键
            ctrlItem(event) {
                this.pressCtrl = true;
            },
            // keyUp事件
            inputKeyUp(event) {
                let keycode = event.keyCode;
                if(keycode === 17) {
                    this.pressCtrl = false;
                }
            }

        },
        watch: {
            dataList(val) {
                this.nodata = val.length === 0 || !val;

                this.load2 = false;
                this.itemList = val;
                this.itemList.forEach((item, i) => {
                    if(i === 0){
                        this.$set(item, 'selectedIndex', true);
                    } else {
                        this.$set(item, 'selectedIndex', false);
                    }
                    this.$set(item, 'multSelected', false);
                });

            },
            querykey(str) {
                this.showList = str.length > 0;
                this.$emit('querykey', str);
                this.load2 = true;
            },
            showList(val) {
                console.log(val);
                if(!val) {
//                    this.selectedItem = [];
                    this.selectItemIndex = 0;
                }
            },
            defaultVal(val) {
                if(val) {
                    this.selectedItem = [];
                    this.selectedItem.push(this.defaultVal);
                }
            },
            clearInput(val) {
                if(val) {
                    this.clearItem(0);
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .sl-autocom-container{
        /*width: 100%;*/
        /*display: block;*/
        position: relative;
        font-family: 'SimSun';
    }

    /*.sl-autocom-prepend {
        display: inline-block;
        line-height: 28px;
        height: 100%;
        text-align: center;
        background-color: #f3f3f3;
        min-width: 30px;
        padding: 0 5px;
        color: #555;
        border-right: 1px solid #bfcbd9;
    }*/
   .sl-autocom-prepend {
      	box-sizing: border-box;
        display: inline-block;
        line-height: 26px;
        height: 100%;
        text-align: center;
        background-color: #f3f3f3;
        width: 90px;
        padding: 0 5px;
        color: #555;
        /*border: 1px solid #bfcbd9;*/
        border-right: 1px solid #bfcbd9;
        /*border-right: 0;*/
        border-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        float: left;
    }

    .sl-autocom-input{
        width: 100%;
        display: inline-block;
        background: #fff;
        /*height: 30px;*/
        line-height: inherit;
        line-height: 26px;
        border: 1px solid #bfcbd9;
        border-radius: 3px;
        padding: 0 3px;
        padding-left: 0;
        position: relative;

        .sl-autocom-icon {
            position: absolute;
            right: 10px;
            top:0px;


            i {
                cursor: pointer;
            }
        }
    }

    .sl-autocom-input::after{
        content: '';
        height: 100%;
        width: 0px;
        /*vertical-align: middle;*/
        display: inline-block;
    }

    .sl-autocom-input.ofocus{
        border-color: #1177dd;
    }

    .selected-item{
        vertical-align: middle;
        position: relative;
        top: -1px;
        left: 3px;
        display: inline-block;
        width: 55%;
        height: 22px;
        line-height: 22px;
        padding-left: 10px;
        padding-right: 25px;
        background-color: #1177dd;
        color: #fff;
        border-radius: 5px;
        overflow: hidden;
     	text-overflow: ellipsis;
	    white-space: nowrap;
    }

    /*.selected-input{
        width: 60%;
        display: inline-block;
        vertical-align: middle;
    }*/
	.selected-input{
        width: calc(97% - 90px);
        display: inline-block;
        vertical-align: top;
        /*border: 1px solid #bfcbd9;*/
        /*border-left:none ;*/
        border-radius: 4px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        /*float: right;*/

        &.noPrepend {
            width: 95%;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
    }
    .selected-input>input{
        border: 0;
        outline: none;
        height: 26px;
        float: left;
        appearance: none;
    }

    .el-icon-close{
        position: absolute;
        right: 10px;
        top: 6px;
    }

    .sl-autocom-content{
        width: 500px;
        border: 1px solid #ccc;
        position: absolute;
        top: 32px;
        left: 0px;
        background-color: #fff;
        z-index: 999;
        box-shadow: 0px 5px 15px 1px #ccc;
        
        	.itemList-span {/*add 9-29*/
        		display: inline-block;
        		height: 28px;
        		line-height: 28px;
        		overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
        	}
        .nodata {
            height: 280px;
            padding-left: 10px;
        }
    }
	.sl-autocom-list-title {
		height: 30px;
        background-color: #ececec;
        line-height: 30px;
        padding: 0 10px;
        color: #333;
	}
     .sl-autocom-list-footer{
        height: 30px;
        background-color: #f7f7f7;
        line-height: 30px;
        padding: 0 10px;
    }

    .listTitle, .listContent>span{
        display: inline-block;
    }

    .listContent{
        padding: 0 10px;
        cursor: pointer;
        height: 28px;
        line-height: 28px;
    }

    /*.listContent:hover{
        background-color: #3875d7;
        color: #fff;
    }*/

    .footer-btn{
        height: 100%;
        float: right;
        padding-right: 10px;

        span {
            color: #28e;
            cursor: pointer;
        }
    }

    .footer-btn button{
        height: 26px;
        border-color: #1076dd;
        color: #1076dd;
        padding: 7px 17px;
    }

    .footer-btn button:hover{
        background-color: #d5e9f7;
    }

    .footer-text>span:last-child{
        margin-left: 40px;
        color: #FF6647;
    }

    .footer-text>span>strong{
        font-size: 13px;
    }

    .listHover{
        background-color: #d5e9f7;
    }

    .selectedIndex{
        background-color: #dcebfa;
        color: #1177dd;
    }

    .multSelected{
        background-color: #FDDD97;
    }

    .multSelected.selectedIndex{
        background-color: #dcebfa;
        color: #fff;
    }
    .hasSelectedItem{
        width: 13%;

        &.noPrepend {
            width: 13%;
        }
    }

	.el-input__inner {
		font-size: 12px;
	}
</style>