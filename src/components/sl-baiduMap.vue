<template>
    <span>
        <span class="sl-content-row-item-label">
            <a  @click="showMap = true">地图标注</a>
            <i  class="icon-pin" @click="showMap = true"></i>
        </span>

        <div v-if="showMap">

            <el-dialog title="请标注地址" :visible.sync="showMap" :modal="isShowModal">
                <!--<p style="margin-bottom: 10px;">{{dragResult}}</p>-->
                <el-input v-model="dragResult.address" placeholder="请拖动红色标记，选择所在区域！"></el-input>
                <baidu-map class="map" ak="sSMv0LSaGUuaX7VrwUAitIRwaTpkBgcu" :center="center" @ready="handler"
                           :scroll-wheel-zoom="true" :zoom="15" name="myMap">
                    <bm-marker :position="iconPosition" :dragging="true" @dragend="dragPosition">
                    </bm-marker>
                </baidu-map>

                <span slot="footer">
                    <el-button type="primary" @click="mapSure()" size="small">确定</el-button>
                    <el-button @click="showMap = false" class="dialog-cancel" size="small">取消</el-button>
                </span>
                <!--<div id="baiduMap"></div>-->
            </el-dialog>
        </div>
    </span>
</template>

<script>

    import {BaiduMap, BmMarker, BmLabel} from 'vue-baidu-map';
    import {areaList, getStreetList} from '@/components/sl-areaSelect/areaList';
    import ElInput from '../../node_modules/element-ui/packages/input/src/input'

export default {
    name: 'sl-baidu-map',
    props: ['mapAddress', 'isShowModal'],
    components: {
        ElInput,
        BaiduMap, BmMarker, BmLabel},
    data () {
        return {
            center: {lng: 0, lat: 0},
            dragResult: {address: ''},
            showMap: false,
            iconPosition: {lng: 0, lat: 0},
            myGeo: {}
        }
    },
    methods: {
        handler ({BMap, map}) {
            console.log(BMap, map);
            let _this = this;
            this.myGeo = new BMap.Geocoder();
            this.center = {lng: 116.404, lat: 39.915};
            let myPoint = this.mapAddress || '天安门广场';
            this.dragResult.address = myPoint;
            console.log('this.mapAddress==', this.mapAddress)
            this.myGeo.getPoint(myPoint, function (point) {
                console.log('point==', point);
                if(point === null) {
                    _this.$notify({
                        title: '警告',
                        message: '当前地址有多个结果，请确认已填写城市名',
                        type: 'warning'
                    });
                    _this.showMap = false;
                } else {
                    console.log('point==', point);
                    _this.center.lng = point.lng;
                    _this.center.lat = point.lat;
                    _this.iconPosition.lng = point.lng;
                    _this.iconPosition.lat = point.lat
                }

            })


        },
        dragPosition(type) {
            let _this = this;
            console.log('this.iconPosition==', type);
            this.myGeo.getLocation(type.point, function (ads) {
                console.log('ads==', ads);
                let district = ads.addressComponents.district;
                let allAreaList = areaList().arealist;

                _this.dragResult = {
                    address: ads.address,
                    areaId: ''
                };

                for(let i in allAreaList) {

                    if(allAreaList[i] === district) {
                        _this.dragResult.areaId = i;
                        break;
                    }
                }

            })
        },
        mapSure() {
            this.$emit('mapSure', this.dragResult);
            this.showMap = false;
        }
    }
}

</script>

<style>
    .map{
        width: 100%;
        height: 400px;
    }

    .icon-pin {
        display: inline-block;
        vertical-align: middle;
        width: 28px;
        height: 28px;
        margin-top: 0;
        background: url(../assets/img/pin.png) center no-repeat;
        cursor: pointer;
    }
</style>