// map.js
// 获取应用实例
// const app = getApp();

Page({
    data: {
        markers: [{
            iconPath: '/resources/others.png',
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50
        }],
        polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color:'#FF0000DD',
            width: 2,
            dottedLine: true
        }],
        polygons:[{
            'points':[
                {
                    'longitude':116.40728589274076,
                    'latitude':39.9551223218052
                },
                {
                    'longitude':116.4516491246582,
                    'latitude':39.95582547664669
                },
                {
                    'longitude':116.41420970813203,
                    'latitude':39.96042917343807
                }
            ]
        }],
        map1_scale: 14,
    },
    mapContext1: null,
    mapContext2: null,
    mapContext3: null,
    locationRes: null,
    init(){
        let _this = this;
        this.mapContext1 = wx.createMapContext('map', this);
        this.mapContext2 = wx.createMapContext('map2', this);
        this.mapContext3 = wx.createMapContext('map3', this);
        wx.getLocation({
            type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
            success(res){ 
                _this.locationRes = res;
                _this.mapContext1.moveToLocation();
                _this.mapContext2.moveToLocation();
                _this.mapContext3.moveToLocation();
            }
        });
    },
    onReady(){
        this.init();
    },
    getSomeRandomMarkers(){
        let _id = Math.floor(Math.random()*10000000);
        let _label = {
            content: '我是随机地点',
            color: '#323232',
            borderRadius: '20'
        };
        let _callout = {
            content:'导航到此处',
            color: '#323232',
            fontSize: 12,
            borderRadius: 10,
            borderColor: '#323232',
            padding: 10,
        };
        this.data.markers.push({
            id: JSON.stringify(_id),
            latitude: this.locationRes.latitude + ((Math.random()*10)-5)/100,
            longitude: this.locationRes.longitude + ((Math.random()*10)-5)/100,
            title: 'random-' + _id,
            iconPath: './Bad-Pig.png',
            width: 30,
            height: 30,
            callout: _callout,
            label: _label,
        });
        this.setData({
            markers : this.data.markers,
        });
    },
    onTap_Map1_toLocation(){
        this.mapContext1.moveToLocation();
    },
    onTap_Map1_scaleUp(){
        this.setData({
            map1_scale: this.data.map1_scale+=1
        });
    },
    onTap_Map1_scaleDw(){
        this.setData({
            map1_scale: this.data.map1_scale-=1
        });
    },
    onTap_Map2_getRandomMark(){
        this.getSomeRandomMarkers();
    },
    onTap_Map2_calloutTap(e){
        let _poi = null;
        this.data.markers.forEach(i=>{
            if(i.id === e.markerId){
                _poi = i;
            }
        });
        wx.openLocation({
            latitude: _poi.latitude,
            longitude: _poi.longitude,
            address: '随机地点：' + _poi.title
        });
    },
    onTap_Map3_getRandomPolyline(){
        this.data.polyline[0].points.push({
            longitude: this.locationRes.longitude + ((Math.random()*10)-5)/100,
            latitude: this.locationRes.latitude + ((Math.random()*10)-5)/100,
        });
        this.setData({
            polyline: this.data.polyline
        });
        console.log(this.data.polyline);
    },
    onTap_Map3_getRandomPolygons(){
        let _p = [];
        for(let i=0;i<4;i++){
            _p.push({
                longitude: this.locationRes.longitude + ((Math.random()*10)-5)/100,
                latitude: this.locationRes.latitude + ((Math.random()*10)-5)/100,
            });
        }
        this.data.polygons.push({
            points: _p,
        });
        this.setData({
            polygons: this.data.polygons
        });
        console.log(this.data.polygons);
    },
});