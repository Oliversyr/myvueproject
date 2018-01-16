<template>
    <div class="selectArea">
        <el-input size="small" v-model="theArea" name="areasel" placeholder="请选择区域"
                  @focus.stop="showArea = true" readonly>
            <template slot="prepend" v-if="showPrepend">
                <slot name="prepend"></slot>
            </template>
        </el-input>

        <!--<el-dialog title="请选择地区" :visible.sync="showArea" :modal="showModal">-->
            <!--<el-select v-model="province" filterable placeholder="请选择省" class="areaSel">
                <el-option
                        v-for="item in provinceList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                </el-option>
            </el-select>

            <el-select v-model="city" filterable placeholder="请选择市">
                <el-option
                        v-for="item in cityList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                </el-option>
            </el-select>

            <el-select v-model="district" filterable placeholder="请选择区" v-if="district">
                <el-option
                        v-for="item in districtList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                </el-option>
            </el-select>

            <el-select v-model="street" filterable placeholder="请选择街道" v-if="street" @change="getArea">
                <el-option
                        v-for="item in streetList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                </el-option>
            </el-select>-->
        <div class="areaContainer" v-if="showArea" @click.stop="stop($event)" v-loading="load2">
            <el-tabs v-model="areaTab" type="card" @tab-click="handleClick" v-if="showArea">
                <el-tab-pane :label="provinceLabel" name="province">
                    <el-row :gutter="20" class="areaRow">
                        <el-col :span="6" v-for="item in provinceList" :key="item.code" :class="{'active': item.active}">
                            <span class="singleArea" @click.stop="selectThisArea('province', item, $event)">{{item.name}}</span>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane :label="cityLabel" name="city">
                    <el-row :gutter="20" class="areaRow">
                        <el-col :span="6" v-for="item in cityList" :key="item.code" :class="{'active': item.active}">
                            <span class="singleArea" @click.stop="selectThisArea('city', item, $event)">{{item.name}}</span>
                        </el-col>


                    </el-row>


                </el-tab-pane>

                <el-tab-pane :label="districtLabel" name="district" v-if="district">
                    <el-row :gutter="20" class="areaRow">
                        <el-col :span="6" v-for="item in districtList" :key="item.code" :class="{'active': item.active}">
                            <span class="singleArea" @click.stop="selectThisArea('district', item, $event)">{{item.name}}</span>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane :label="streetLabel" name="street" v-if="street">
                    <el-row :gutter="20" class="areaRow">
                        <el-col :span="6" v-for="item in streetList" :key="item.code" :class="{'active': item.active}">
                            <span class="singleArea" @click.stop="selectThisArea('street', item, $event)">{{item.name}}</span>
                        </el-col>

                        <!--<el-col :span="6" >
                            <span class="singleArea" @click.stop="selectThisArea('wait', '', $event)">稍后再说</span>
                        </el-col>-->
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>


            <!--<span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getArea()" size="small">确 定</el-button>
                <el-button @click="doCancel()" class="dialog-cancel" size="small">取 消</el-button>
            </span>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>

    import fetch from '@/utils/fetch';
    import ElInput from '../../../node_modules/element-ui/packages/input/src/input';
    import {areaList, getStreetList} from './areaList';

    export default {
        name: 'sl-areaSelect',
        components: {ElInput},
        props: ['areaId', 'showPrepend', 'showModal'],
        data() {
            return {
                load2: false,
                areaTab: 'province',
                areaList: {},
                provinceList: [],
                cityList: [],
                districtList: [],
                streetList: [],
                areaStreetList: [],
                province: '',
                city: '',
                district: '',
                street: '',
                provinceLabel: '省',
                cityLabel: '市',
                districtLabel: '区',
                streetLabel: '街道',
                theArea: '',
                showArea: false,
                areaResult: '',
                myAreaId: ''
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                const _this = this;
                const res = areaList();
                console.log('getAreaList==', res);

                this.areaList = res.arealist;
//                this.myAreaId = this.areaId ? JSON.parse(JSON.stringify(this.areaId)).toString() : '';
                for(let prov in this.areaList) {
                    if(prov.indexOf('0000') !== -1) {
                        let obj = {code: prov, name: this.areaList[prov], active: false};
                        _this.provinceList.push(obj);
                    }
                }

                document.body.addEventListener('click', function (event) {
//                    console.log(event.target.name)
//                    event.target.
                    if(event.target.name !== 'areasel') {
                        _this.showArea = false;
                    }
                })
            })
        },
        activated: function() {
//            this.$nextTick(function() {
                /*const _this = this;
                const res = areaList();
                console.log('getAreaList==', res);

                this.areaList = res.arealist;
//                this.myAreaId = this.areaId ? JSON.parse(JSON.stringify(this.areaId)).toString() : '';
                for(let prov in this.areaList) {
                    if(prov.indexOf('0000') !== -1) {
                        let obj = {code: prov, name: this.areaList[prov], active: false};
                        _this.provinceList.push(obj);
                    }
                }

                document.body.addEventListener('click', function (event) {
//                    console.log(event.target.name)
//                    event.target.
                    if(event.target.name !== 'areasel') {
                        _this.showArea = false;
                    }
                })*/

//            })
        },
        methods: {
            // 选择省后，更新市列表
            updateCity: function (provId) {
                const _this = this;
                this.cityList = [];

                if(provId === '11' || provId === '12' || provId === '31' || provId === '50') {
                    console.log('provId==', provId)
                    for (let c in this.areaList) {
                        if (c.indexOf(provId) === 0 && c.indexOf('0000') === -1 ) {
                            let ocity = {code: c, name: this.areaList[c], active: false };
                            _this.cityList.push(ocity);
                        }
                    }
                    this.district = '';

//                    this.city = this.myAreaId ? this.myAreaId : this.cityList[0].code;
//                    this.myAreaId = '';
                    if(!this.myAreaId) {
                        this.city = this.cityList[0].code;
                        this.cityLabel = this.cityList[0].name;
                        this.areaResult = this.city;
                        this.selectActive(this.city, 2);
                    }

                } else {
                    for (let c in this.areaList) {
                        if (c.indexOf(provId) === 0 && c%100 === 0 && c%10000 !== 0  ) {
                            let ocity = {code: c, name: this.areaList[c], active: false };
                            _this.cityList.push(ocity);
                        }
                    }
//                  this.city = this.myAreaId ? (parseInt(this.myAreaId / 100) * 100).toString() : this.cityList[0].code;
                    if(!this.myAreaId) {
                        this.city = this.cityList[0].code;
                        this.cityLabel = this.cityList[0].name;
                        this.selectActive(this.city, 2);
                    }

//                    this.city = this.cityList[0].code;
                }

            },
            updateDistrict: function (cityId) {
                const _this = this;
                this.districtList = [];

                if(cityId === '4419' || cityId === '4420') {
                    this.updateStreet(cityId + '00');
                    this.district = '';
                    this.areaTab = 'street';

                } else {
                    for (let d in this.areaList) {
                        if (d.indexOf(cityId) === 0 && d%100 !== 0 ) {
                            let odistrict = {code: d, name: this.areaList[d] };
                            _this.districtList.push(odistrict);
                        }
                    }

                    if(!this.myAreaId) {
                        this.district = this.districtList[0].code;
                        this.districtLabel = this.districtList[0].name;
                        this.selectActive(this.district, 3);
                    }
                }


//                this.district = this.districtList[0].code;
//                this.district = this.myAreaId ? this.myAreaId : this.districtList[0].code;
//                this.myAreaId = '';

            },
            updateStreet: function (districtId) {
//                this.load2 = true;
                const _this = this;
                this.streetList = [];
                console.log('districtId>>>>', districtId)
                getStreetList(districtId).then((res) => {
                    this.load2 = false;
                    console.log(res)
                    this.areaStreetList = res.data;
                    for (let s in res.data) {
                        let ostreet = {code: s, name: res.data[s] };
                        _this.streetList.push(ostreet);
                    }

                    if(!this.myAreaId) {
                        this.street = this.streetList[0].code;
                        this.streetLabel = this.streetList[0].name;
                        this.selectActive(this.street, 4);

                    } else if(this.myAreaId.length === 6) {
                        this.street = -1;
                        this.streetLabel = '稍后再说';

                    }  else if(this.myAreaId.length === 9) {
                        this.street = this.myAreaId;
                        this.streetLabel = res.data[this.myAreaId];
                        this.selectActive(this.street, 4);

                        this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}-${this.areaStreetList[this.street]}` : `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaStreetList[this.street]}`;
                    }
                    this.load2 = false;
                }).catch(err => {
                    this.load2 = false;
                    console.error('暂无该区街道数据！');
                    this.street = '';
                    this.selectThisArea('wait');

                })


//                this.district = this.districtList[0].code;
//                this.district = this.myAreaId ? this.myAreaId : this.districtList[0].code;
//                this.myAreaId = '';

            },
            /*getArea() {
//                this.areaResult = this.district ? this.district : this.city;
                this.areaResult = this.street;

//                this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}` : `${this.areaList[this.province]}-${this.areaList[this.city]}`;
                this.$emit('getAreaId', this.areaResult);
//                this.showArea = false;
                this.myAreaId = '';
//                this.province = '';
//                this.city = '';
            },*/
            /*doCancel() {
                this.showArea = false;
                this.myAreaId = '';
//                this.province = '';
//                this.city = '';
            }*/
            handleClick(tab) {
                console.log(tab)
            },
            selectThisArea(str, obj, event) {
                if(event) {
                    event.stopPropagation();
                }

                this.myAreaId = '';


                if(str === 'province') {
                    let code = (obj.code / 10000).toString();

                    this.provinceLabel = obj.name;
                    this.province = obj.code;
                    this.areaTab = 'city';

                    this.selectActive(obj.code, 1);

                } else if(str === 'city') {
                    console.log(obj)

                    this.cityLabel = obj.name;



                    let code = Math.floor(obj.code / 10000).toString();
                    console.log(code)
                    if(code === '11' || code === '12' || code === '31' || code === '50') {
                        this.street = obj.code;
                        this.city = obj.code;
                        this.areaTab = 'street';
                    } else {
                        this.city = obj.code;
                        this.areaTab = 'district';
                    }

                    this.selectActive(obj.code, 2);

                } else if(str === 'district') {
                    this.districtLabel = obj.name;
                    this.district = obj.code;
                    this.areaTab = 'street';

                    this.selectActive(obj.code, 3);

                } else if(str === 'street') {
                    this.streetLabel = obj.name;
                    this.street = obj.code;
//                    this.areaTab = 'city';
                    this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}-${obj.name}` : `${this.areaList[this.province]}-${this.areaList[this.city]}-${obj.name}`;

                    this.$emit('getAreaId', obj.code, this.theArea);
                    this.showArea = false;
                    this.myAreaId = '';

                } else if(str === 'wait') {
                    this.showArea = false;
                    this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}` : `${this.areaList[this.province]}-${this.areaList[this.city]}`;
                    this.$emit('getAreaId', this.district ? this.district : this.city, this.theArea);
                }
            },
            selectActive(areaId, str) {

                setTimeout(() => {
                    let areaList = [];
                    switch(str) {
                        case 1: areaList = this.provinceList;break;
                        case 2: areaList = this.cityList;break;
                        case 3: areaList = this.districtList;break;
                        case 4: areaList = this.streetList;break;
                    }
                    areaList.forEach((item, i) => {
                        if(item.code === areaId) {
                            item.active = true;
                        } else {
                            item.active = false;
                        }
                    })
                }, 500)

            },
            stop(event) {
                event.stopPropagation();
            }
        },
        watch: {
            province: function (val) {

//                let provId = val.split('').slice(0,2).join('');
                if(val) {
                    console.log('myAreaId===', val)
                    let provId = JSON.stringify(Math.floor(val / 10000));
                    this.updateCity(provId);
                }


            },
            city: function (val) {
                console.log('city===', val)
                if(val && val%100 === 0) {
//                    let cityId = val.split('').slice(0,4).join('');
                    let cityId = JSON.stringify(Math.floor(val / 100));
                    this.updateDistrict(cityId);
                } else if(val) {
                    this.updateStreet(val);
                }
            },
            district: function (val) {
                console.log('district==', val);
                if(val) {
                    this.updateStreet(val);
                }

            },
            areaId: function(val) {
                console.log('areaId==', val)
                const _this = this;
                this.showArea = false;
                if(!val) {
                    this.theArea = '';
                    this.myAreaId = '';
                    this.province = '';
                    this.city = '';
                    this.district = '';
                    this.street = '';
                    this.provinceLabel = '省';
                    this.cityLabel = '市';
                    this.districtLabel = '区';
                    this.streetLabel = '街道';

//                    this.provinceList = [];
                    this.cityList = [];
                    this.districtList = [];
                    this.streetList = [];

                    for(let prov in this.areaList) {
                        if(prov.indexOf('0000') !== -1) {
                            let obj = {code: prov, name: this.areaList[prov], active: false};
                            _this.provinceList.push(obj);
                        }
                    }

                    this.areaTab = 'province';

                } else if(val) {

                    if(typeof this.areaId === "number") {
                        this.myAreaId = JSON.parse(JSON.stringify(this.areaId)).toString();
                    } else {
                        this.myAreaId = JSON.parse(JSON.stringify(this.areaId));
                    }

                    if(this.myAreaId.length === 6) {
                        let provId = Math.floor(this.myAreaId / 10000);
                        this.province = (provId * 10000).toString();

                        this.selectActive(this.province, 1);

                        this.provinceLabel = this.areaList[this.province];

                        if(provId === 11 || provId === 12 || provId === 31 || provId === 50) {
                            this.city = this.myAreaId.toString();
                            this.cityLabel = this.areaList[this.city];
                            this.selectActive(this.city, 2);

                            this.district = '';

                        } else {
                            this.city = (Math.floor(this.myAreaId / 100) * 100).toString();
                            this.cityLabel = this.areaList[this.city];
                            this.selectActive(this.city, 2);

                            this.district = this.myAreaId.toString();
                            this.districtLabel = this.areaList[this.district];
                            this.selectActive(this.district, 3);
                        }

                        this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}` : `${this.areaList[this.province]}-${this.areaList[this.city]}`;
                    } else if(this.myAreaId.length === 9) {
                        let provId = Math.floor(this.myAreaId / 10000000);
                        this.province = (provId * 10000).toString();
                        this.selectActive(this.province, 1);
                        this.provinceLabel = this.areaList[this.province];

                        console.log(provId, this.province, this.areaList[this.province]);
                        if(provId === 11 || provId === 12 || provId === 31 || provId === 50) {
                            this.city = Math.floor(this.myAreaId / 1000).toString();
                            this.cityLabel = this.areaList[this.city];
                            this.selectActive(this.city, 2);

                            this.district = '';

                        } else {
                            this.city = (Math.floor(this.myAreaId / 100000) * 100).toString();
                            this.cityLabel = this.areaList[this.city];
                            this.selectActive(this.city, 2);

                            this.district = Math.floor(this.myAreaId / 1000).toString();
                            this.districtLabel = this.areaList[this.district];
                            this.selectActive(this.district, 3);
                        }


                    }


//                    this.province = (parseInt(this.myAreaId / 10000) * 10000).toString();
//                    setTimeout(()=>{


//                        this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}` : `${this.areaList[this.province]}-${this.areaList[this.city]}`;

//                        this.getArea();

//                    }, 500);
                }
            },
            showArea: function(val) {
                if(val) {
                    if(this.areaId) {
                        console.log('d',this.myAreaId, 's',this.areaId);
                        this.myAreaId = '';
                        this.areaTab = 'province';
                        /*this.myAreaId = JSON.parse(JSON.stringify(this.areaId)).toString();
                        this.province = (parseInt(this.myAreaId / 10000) * 10000).toString();*/
                    }
                } else {
                    this.myAreaId = '';
                }
            }

        }

    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .selectArea {
        position: relative;
        .areaSel {

        }
        .areaContainer {
            height: 300px;
            width: 585px;
            background-color: #fff;
            border: 1px solid #bfcbd9;
            padding: 10px;
            position: absolute;
            z-index: 999;
            top: 40px;
            left: 0;
            /*overflow-y: hidden;*/

            .el-tabs__item {
                min-width: 85px;
                text-align: center;
            }

            .areaRow {
                width: 100%;
                height: 220px;
                overflow-y: auto;

                .singleArea {
                    cursor: pointer;
                    line-height: 36px;
                    font-size: 14px;
                }

                .active {
                    color: red;
                }

            }
        }
    }
</style>