<template>
    <div class="selectArea">
        <!--<el-input size="small" v-model="theArea"
                  @focus="showArea = true" readonly>
            <template slot="prepend" v-if="showPrepend">
                <slot name="prepend"></slot>
            </template>
        </el-input>-->

        <!--<el-dialog title="请选择地区" :visible.sync="showArea" :modal="showModal">-->
            <el-select v-model="province" filterable placeholder="请选择省" class="areaSel">
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
            </el-select>

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
                areaList: {},
                provinceList: [],
                cityList: [],
                districtList: [],
                street: '',
                streetList: [],
                province: '',
                city: '',
                district: '',
                theArea: '',
                showArea: false,
                areaResult: '',
                myAreaId: ''
            }
        },
        mounted: function() {
            this.$nextTick(function() {
                const _this = this;
                const res = areaList();
                console.log('getAreaList==', res);



                this.areaList = res.arealist;
//                this.myAreaId = this.areaId ? JSON.parse(JSON.stringify(this.areaId)).toString() : '';
                for(let prov in this.areaList) {
                    if(prov.indexOf('0000') !== -1) {
                        let obj = {code: prov, name: this.areaList[prov]};
                        _this.provinceList.push(obj);
                    }
                }

            })
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
                            let ocity = {code: c, name: this.areaList[c] };
                            _this.cityList.push(ocity);
                        }
                    }
                    this.district = '';

//                    this.city = this.myAreaId ? this.myAreaId : this.cityList[0].code;
//                    this.myAreaId = '';
                    /*if(!this.myAreaId) {
                        this.city = this.cityList[0].code;
                        this.areaResult = this.city;
                    }*/

                    this.city = this.cityList[0].code;
                    this.areaResult = this.city;


                } else {
                    for (let c in this.areaList) {
                        if (c.indexOf(provId) === 0 && c.indexOf('00') === 4 ) {
                            let ocity = {code: c, name: this.areaList[c] };
                            _this.cityList.push(ocity);
                        }
                    }
//                  this.city = this.myAreaId ? (parseInt(this.myAreaId / 100) * 100).toString() : this.cityList[0].code;
                    if(!this.myAreaId) {
                        this.city = this.cityList[0].code;
                    }

//                    this.city = this.cityList[0].code;
                }

            },
            updateDistrict: function (cityId) {
                const _this = this;
                this.districtList = [];
                for (let d in this.areaList) {
                    if (d.indexOf(cityId) === 0 && d.indexOf('00') === -1 ) {
                        let odistrict = {code: d, name: this.areaList[d] };
                        _this.districtList.push(odistrict);
                    }
                }

                if(!this.myAreaId) {
                    this.district = this.districtList[0].code;
                }
//                this.district = this.districtList[0].code;
//                this.district = this.myAreaId ? this.myAreaId : this.districtList[0].code;
//                this.myAreaId = '';

            },
            updateStreet: function (districtId) {
                const _this = this;
                this.streetList = [];
                getStreetList(districtId).then((res) => {
                    console.log(res)
                    for (let s in res.data) {
                        let ostreet = {code: s, name: res.data[s] };
                        _this.streetList.push(ostreet);
                    }

                    if(!this.myAreaId) {
                        this.street = this.streetList[0].code;
                    }
                })


//                this.district = this.districtList[0].code;
//                this.district = this.myAreaId ? this.myAreaId : this.districtList[0].code;
//                this.myAreaId = '';

            },
            getArea() {
//                this.areaResult = this.district ? this.district : this.city;
                this.areaResult = this.street;

//                this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}` : `${this.areaList[this.province]}-${this.areaList[this.city]}`;
                this.$emit('getAreaId', this.areaResult);
//                this.showArea = false;
                this.myAreaId = '';
//                this.province = '';
//                this.city = '';
            },
            /*doCancel() {
                this.showArea = false;
                this.myAreaId = '';
//                this.province = '';
//                this.city = '';
            }*/
        },
        watch: {
            province: function (val) {
                console.log('province===', val)
//                let provId = val.split('').slice(0,2).join('');
                let provId = JSON.stringify(Math.floor(val / 10000));
                this.updateCity(provId);

            },
            city: function (val) {
//                console.log('city===', val)
                if(val%100 === 0) {
//                    let cityId = val.split('').slice(0,4).join('');
                    let cityId = JSON.stringify(Math.floor(val / 100));
                    this.updateDistrict(cityId);
                } else {
                    this.updateStreet(val);
                }
            },
            district: function (val) {
                console.log('district==', val);
                this.updateStreet(val);
            },
            areaId: function(val) {
                console.log('areaId==', val)

                if(val === '') {
//                    this.theArea = '';
                } else if(val) {

                    this.myAreaId = JSON.parse(JSON.stringify(this.areaId));
//                    this.province = (parseInt(this.myAreaId / 10000) * 10000).toString();
//                    setTimeout(()=>{
                        let provId = Math.floor(this.myAreaId / 10000);
                        this.province = (provId * 10000).toString();

                        if(provId === 11 || provId === 12 || provId === 31 || provId === 50) {
                            this.city = this.myAreaId.toString();

                            this.district = '';

                        } else {
                            this.city = (Math.floor(this.myAreaId / 100) * 100).toString();

                            this.district = this.myAreaId.toString();
                        }

//                        this.theArea = this.district ? `${this.areaList[this.province]}-${this.areaList[this.city]}-${this.areaList[this.district]}` : `${this.areaList[this.province]}-${this.areaList[this.city]}`;

//                        this.getArea();

//                    }, 500);
                }
            },
            showArea: function(val) {
                if(val) {
                    if(this.areaId) {
                        this.myAreaId = '';
                        /*this.myAreaId = JSON.parse(JSON.stringify(this.areaId)).toString();
                        this.province = (parseInt(this.myAreaId / 10000) * 10000).toString();*/
                    }
                }
            }

        }

    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .selectArea {
        .areaSel {

        }
    }
</style>