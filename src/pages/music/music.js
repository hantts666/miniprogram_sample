// music.js
// 获取应用实例
// const app = getApp();
import SineWaveGenerator from './SineWaveGenerator.js'
Page({
    data: {
        word: 'hey',
        MusicList:[],
        currMusic:{},
        waves:[],
        indexInMusicList:0,
        isPlaying:true,
        showMenu:true,
        slider_value:0,
    },
    onReady(){
        this.init();
    },
    onUnload(){
        this.posterRotateFlag = false;
        this.waveFlag = false;
        this.musicContext.destroy();
        clearInterval(this.waveIntval);
        clearInterval(this.rotateInteval);
    },
    init(){
        this.initMusic();
        this.initWave();
        this.initRotate();
    }, 
    getMusicData(callBack){
        this.data.MusicList = _fakeData;
        this.setData({
            MusicList: _fakeData
        });
        callBack();
    },
    initMusic(){
        this.getMusicContext();
        let _index = this.data.indexInMusicList;
        this.getMusicData(this.chooseMusic.bind(this,_index));
        
    },
    musicContext: null,
    musicInteval:null,
    isSliderChanging:false,
    getMusicContext(){
        if(this.musicContext===null){
            this.musicContext = wx.createInnerAudioContext();
            this.musicContext.onWaiting(()=>{
//                 this.setData({
//                     isPlaying: false
//                 })
            });
            this.musicContext.onPlay(()=>{
//                 this.setData({
//                 	isPlaying: true
//                 })
            })
            this.musicInteval = setInterval(()=>{
                let curr = this.musicContext.currentTime;
                let duration = this.musicContext.duration;
                this.data.currMusic.playTotle = this.parseTime(duration);
                if(!this.isSliderChanging){
                    this.data.currMusic.playCurr = this.parseTime(curr);
                    this.setData({
                        slider_value: Math.floor((curr/duration)*100),
                    })
                }
                this.setData({
                	currMusic: this.data.currMusic,
                });
            },200)
            this.musicContext.onEnded(()=>{
                this.onTap_next();
            })
        }
        return this.musicContext;
    },
    parseTime(secd){
        let sec = Math.floor(secd);
        let _min = (Math.floor(sec/60)+'').length===1?'0'+  Math.floor(sec/60): Math.floor(sec/60)
        let _sec = (Math.floor(sec%60)+'').length===1?'0'+  Math.floor(sec%60): Math.floor(sec%60)
        return _min+'\:'+_sec;
    },
    changeMusicHandler(index){
        this.setData({
        	indexInMusicList: index
        })
        this.chooseMusic(index);
    },
    chooseMusic(index){
        this.data.currMusic = this.data.MusicList[index];
        this.data.currMusic.ang = 0;  
        this.musicContext.src = this.data.currMusic.src;
        this.data.currMusic.playCurr = "00:00";
        this.data.currMusic.playTotle = this.parseTime(this.musicContext.duration);
        this.musicContext.play();
        this.setData({
        	isPlaying: true,
            currMusic: this.data.currMusic
        });
    },
    initRotate(){
        this.rotateInteval = setInterval(()=>{
            if(!this.data.isPlaying){
            	return;
            }
            this.data.currMusic.ang += 30;
            this.setData({
            	currMusic: this.data.currMusic 
            });
        },1000);
    },
    initWave(){
        let ctx = this.waveCtx = wx.createCanvasContext("wave", this);
        let _width = 200;
        let _height = 29;
        let wave_len = 50;
        
        ctx.setFillStyle('#b3c4e8');
        this.waveIntval = setInterval(()=>{
            if(!this.data.isPlaying){
                return;
            }
            
            ctx.clearRect(0,0,500,62);
//             for(var i=0;i<wave_len;i++){
//             	//this.data.waves.push(Math.floor(Math.random()*100)+'%');
//                 let left = Math.floor(_width/wave_len)*i;
//                 let padding = Math.floor(Math.random()*_height/2);
//                 let itemWidth = Math.floor(_width/(wave_len*2));
//                 ctx.fillRect(left,padding,itemWidth,_height-2*padding);
//             }
            ctx.draw();
        },300)
    },
    onTap_pause(){
        if(!this.musicContext){
            return;
        }
        this.setData({
            isPlaying: false
        })
        this.musicContext.pause();
        
    },
    onTap_play(){
        if(!this.musicContext){
            return;
        }
        this.setData({
            isPlaying: true
        })
        this.musicContext.play();
    },
    onTap_pre(){ 
        let index = this.data.indexInMusicList;
        let length = this.data.MusicList.length;
        let _index = (index-1)<0?length-1:index-1;
        this.changeMusicHandler(_index);
    },
    onTap_next(){
        let index = parseInt(this.data.indexInMusicList);
        let length = this.data.MusicList.length;
        let _index = (index+1)>length-1?0:index+1;
        this.changeMusicHandler(_index);
    },
    onTap_showMenu(){
        this.setData({
            showMenu: true
        })
    },
    ontap_closeMenu(){
        this.setData({
            showMenu: false
        })
    },
    onTap_chooseList(event){
        let index = event.target.dataset.id
        this.changeMusicHandler(index);
    },
    changingIntval:null,
    cacheChangingEvent:{},
    onSlider_changing(e){
        //异步变同步。。
        this.cacheChangingEvent = e;
        this.isSliderChanging = true;
        this.changingIntval || (this.changingIntval = setInterval(()=>{
            console.log(this.isSliderChanging);
            if(!this.isSliderChanging){
                return;
            }
            let v = this.cacheChangingEvent.detail?this.cacheChangingEvent.detail.value:'0';
            let totle = this.musicContext.duration;
            let _time = this.parseTime(Math.floor(v*totle/100));
            this.data.currMusic.playCurr = _time;
            this.setData({
            	currMusic: this.data.currMusic
            });
        },500))
    },
    onSlider_change(e){
        let v = e.detail.value;
        let totle = this.musicContext.duration;
        let _time = Math.floor(v*totle/100);
        this.musicContext.seek(_time);
        //延时一点改变状态，不会出现回跳的问题
        setTimeout(()=>{
            this.isSliderChanging= false;
        },1300)
        
    },
});

const _fakeData=[
    {
       name: '开始懂了',
       src: 'https://p1.topproio.com/%E5%AD%99%E7%87%95%E5%A7%BF%20-%20%E5%BC%80%E5%A7%8B%E6%87%82%E4%BA%86.mp3',
       poster: 'syz.jpg',
       author: '孙燕姿',
       id: '1'
    }, {
        name: 'Everyday', 
        src: 'https://p1.topproio.com/Pierre%20Van%20Dormael%20-%20Everyday.mp3',
        poster: 'http://p1.music.126.net/CFo7nv9jmAUCd63965oHEA==/2537672837877396.jpg?param=177y177',
        author: 'Buddy Holly',
        id: '2'
    }, {
        name: 'Time In A Bottle',
        src: 'https://p1.topproio.com/Jim%20Croce%20-%20Time%20in%20a%20Bottle.mp3',
        poster: 'http://img11.360buyimg.com/n1/jfs/t3412/241/2207528110/28376/40d9850b/58490e06Nd233d6db.jpg',
        author: 'Jim Croce',
        id: '3'
    }
]

