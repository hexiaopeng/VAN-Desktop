// var data = window.top.data;
// var $ = window.top.$;
//
/**
 * [AudioContext description]  Audio兼容
 */
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

var audioE = document.getElementById('audio'),
    musicTop = document.getElementById('music_top'),
    musicSearch = document.getElementById('music_search'),
    musicSearchBtn = document.getElementById('music_search_btn'),
    musicSearchContent = document.getElementById('music_search_content'),
    closeSearch = document.getElementById('close_search'),
    musicSearchList = document.getElementById('music_search_list'),
    musicAlbum = document.getElementById('music_album'),
    musicAlbumImg = document.getElementById('music_album_img'),
    musicDiscImg = document.getElementById('music_disc_img'),
    musicInfoBox = document.getElementById('music_info_box'),
    songName = musicInfoBox.getElementsByTagName('span')[0],
    songerName = musicInfoBox.getElementsByTagName('span')[1],
    albumName = musicInfoBox.getElementsByTagName('span')[2],
    musicLyric = document.getElementById('music_lyric'),
    musicLyricBox = document.getElementById('music_lyric_box'),
    musicLyricLine = document.getElementById('music_lyric_line'),
    musicLyricContent = document.getElementById('music_lyric_content'),
    musicPrev = document.getElementById('music_prev'),
    musicPlay = document.getElementById('music_play'),
    musicNext = document.getElementById('music_next'),
    nowTime = document.getElementById('now_time'),
    playProgressBar = document.getElementById('play_progress_bar'),
    playNowProgress = document.getElementById('play_now_progress'),
    playProgressPoint = document.getElementById('play_progress_point'),
    allTime = document.getElementById('all_time'),
    musicLoop = document.getElementById('music_loop'),
    musicVolumeBtn = document.getElementById('music_volume_btn'),
    musicVolumeBar = document.getElementById('music_volume_bar'),
    volumeNowProgress = document.getElementById('volume_now_progress'),
    volumeProgressPoint = document.getElementById('volume_progress_point'),
    musicListBtn = document.getElementById('music_list_btn'),
    musicListBox = document.getElementById('music_list_box'),
    musicList = document.getElementById('music_list'),
    musicNum = document.getElementsByClassName('music_list_name')[0].getElementsByTagName('em')[0];

/**
 * [Music description]  构造函数Music；
 */
function Music() {
    this.musicId = window.location.search || data.getFileByClass(data.nodes, 'music')[0].id;  //获取传入search的id
    this.data = data.getFileByClass(data.nodes, 'music');//获取到音乐数据
    this.num = data.indexOf(this.data, data.getFile(this.data, this.musicId));//获取当先播放音乐在数组中的下标
    this.musicItems = null;//音乐列表
    this.musicSongnames = [];//音乐列表中的歌名
    this.loopArr = [];//循环数组
    this.timer = null;//定时器
    this.playProgressBarW = playProgressBar.offsetWidth;//进度条长度
    this.musicVolumeBarW = musicVolumeBar.offsetWidth;//音量条长度
    this.lrcArr = null;//解析到的歌词数组li
    this.loopType = 'order';//当前播放模式：默认为循环
    this.oldVolume = null;//存下旧的音量
    this.overLrc = true;//歌词加载状态
    this.drafting = true;//是否拖拽状态
}

Music.prototype = {
    constructor: Music,
    /**
     * [init description]  定义的初始化方法
     */
    init: function() {
        var _this = this;
        this.loadMusicList(); //初始化加载歌曲列表
        this.loadMusic(this.num); //初始化加载歌曲
        musicPrev.onclick = function() {//初始化上一曲
            _this.prev();
        };
        musicPlay.onclick = function() {//初始化播放暂停
            _this.playBtn();
        };
        musicNext.onclick = function() {//初始化下一曲
            _this.next();
        };
        musicLoop.onclick = function() {//初始化循环模式切换
            _this.loopTab();
        };
        audioE.onloadedmetadata = function() {//初始化歌曲加载完毕
            _this.loadEnd();
        };
        audioE.onended = function() {//初始化歌曲播放完毕
            _this.playEnd();
        };
        $.drag(playProgressPoint,function(ev,This) {//初始化进度拖拽
              This.drafting = false;
          },function(ev,This){
              var ev = ev || event;
          		var W = ev.clientX - $.getOffsetToBody(playProgressBar, 'offsetLeft');
          		if(W > This.playProgressBarW) {
          			W = This.playProgressBarW;
          		}
          		if(W < 0) {
          			W = 0;
          		}
          		playProgressPoint.style.left = W * (This.playProgressBarW - playProgressPoint.offsetWidth) / This.playProgressBarW + 'px';
          		playNowProgress.style.width = W + 'px';
          		nowTime.innerHTML = $.getTime(W / This.playProgressBarW * audioE.duration);
          },function(ev,This){
            This.toProgress(ev);
            document.onmousemove = document.onmouseup = null;
        },this);
        playProgressBar.onclick = function(ev) {//初始化进度点击
          _this.toProgress(ev);
        };
        musicVolumeBtn.onclick = function() {//初始化点击静音
            _this.isMute(this);
        };
        $.drag(volumeProgressPoint,function(ev,This){//初始化音量拖拽
          This.oldVolume = audioE.volume;
        },function(ev,This){
          _this.toVolume(ev);
        },function(ev,This){
          if(audioE.volume != 0) {
      			This.oldVolume = null;
      		}
      		document.onmousemove = document.onmouseup = null;
        },this);
        musicVolumeBar.onclick = function(ev) {//初始化音量点击
        	_this.toVolume(ev);
        };
        musicListBtn.onclick = function() {//初始化点击展开列表
          _this.openList();
        };
        musicTop.onclick = musicAlbum.onclick = musicLyric.onclick = function() {//初始化收取列表
            _this.closeList();
        };
        $.drag(musicLyricBox,function(ev,This){//初始化歌词拖拽进度
          var ev = ev || event;
        	musicLyricBox.oldY = ev.clientY;
        	musicLyricBox.n = null;
        	musicLyricBox.T = musicLyricContent.offsetTop;
        	This.drafting = false;
        },function(ev,This){
          var ev = ev || event;
      		if(Math.abs(ev.clientY - musicLyricBox.oldY) > 10) {
      			musicLyricBox.style.cursor = 'pointer';
      			musicLyricLine.style.display = 'block';
      			musicLyricContent.style.top = (musicLyricBox.T + (ev.clientY - musicLyricBox.oldY)) + 'px';
      			for(var i = 0; i < This.lis.length; i++) {
      				if((This.lis[i].offsetTop + musicLyricContent.offsetTop) <= 200) {
      					for(var j = 0; j < This.lis.length; j++) {
      						if($.inspectClass(This.lis[j], 'active')) {
      							$.removeClass(This.lis[j], 'active');
      						}
      					}
      					musicLyricBox.n = i;
      					$.addClass(This.lis[i], 'active');
      				}
      			}
      		}
        },function(ev,This){
          This.drafting = true;
      		musicLyricBox.style.cursor = 'auto';
      		musicLyricLine.style.display = 'none';
      		if(musicLyricBox.n) {
      			audioE.currentTime = This.lrcArr[musicLyricBox.n].time;
      			$.move(musicLyricContent, {
      				top: -This.lis[musicLyricBox.n].offsetTop + 200
      			}, 200, 'easeOut');
      		}
      		nowTime.innerHTML = $.getTime(audioE.currentTime);
      		playProgressPoint.style.left = audioE.currentTime / audioE.duration * (This.playProgressBarW - playProgressPoint.offsetWidth) + 'px';
      		playNowProgress.style.width = audioE.currentTime / audioE.duration * This.playProgressBarW + 'px';
      		document.onmousemove = document.onmouseup = null;
        },this);
        this.drawSpectrum();//初始化渲染频谱
    },
    /**
     * [loadMusicList description]  定义的加载音乐列表的方法
     */
    loadMusicList: function() {
        var _this = this;
        for (var i = 0; i < this.data.length; i++) {
            var musicItem = document.createElement('li');
            var obj = this.data[i];
            // musicItem.dataset.musicId = obj.id;
            $.addClass(musicItem, 'music_item');
            obj.title.replace(/^([^_]+)_([^_]+)_([^_]+)?$/,function (all, song, name) {
                musicItem.innerHTML = '<span class="music_songname">' + song + '</span>-' + '<span class="music_songer">' + name + '</span></li>';
            });
            musicList.appendChild(musicItem);
            this.loopArr.push(i);
        }
        this.musicItems = musicList.getElementsByTagName('li');
        for (var j = 0; j < this.musicItems.length; j++) {
            var musicSongname = this.musicItems[j].getElementsByClassName('music_songname')[0];
            this.musicSongnames.push(musicSongname);
            this.musicItems[j].index = j;
            this.musicItems[j].onclick = function () {
                _this.loadMusic(this.index);
                _this.num = this.index;
            };
        }
        musicNum.innerHTML = '(' + this.data.length + ')';
    },
    /**
     * [loadMusic description]  定义的加载歌曲的方法
     * @param  {[type]} num [description]  传入要播放歌曲的下标
     */
    loadMusic: function(num) {
        var obj = this.data[num];
        for (var i = 0; i < this.data.length; i++) {
            $.removeClass(this.musicSongnames[i], 'music_active');
        }
        $.addClass(this.musicSongnames[num], 'music_active');
        audioE.src = 'music/' + obj.title + '.' + obj.type;
        audioE.load();
        musicAlbumImg.src = 'music/' + obj.title + '.jpg';
        obj.title.replace(/^([^_]+)_([^_]+)_([^_]+)?$/, function(all, song, name, album) {
            songName.innerHTML = song;
            songerName.innerHTML = name ? name : song;
            albumName.innerHTML = album ? album : song;
        });
        musicLyricContent.style.top = '200px';
        this.loadLrc(obj);
    },
    /**
     * [loadLrc description]  定义的请求歌词并渲染的方法
     * @param  {[type]} obj [description]  传入要加载的歌曲对象
     */
    loadLrc: function(obj) {
        var _this = this;
        $.ajax({
            url: 'music/' + obj.title + '.lrc',
            success: function(data) {
                _this.lrcArr = $.parseLyric(data);
                var str = '';
                for (var i = 0; i < _this.lrcArr.length; i++) {
                    str += '<li class="lyric">' + _this.lrcArr[i].clause + '</li>';
                }
                musicLyricContent.innerHTML = str;
                _this.lis = musicLyricContent.getElementsByTagName('li');
                if (musicPlay.onOff) {
                    audioE.play();
                    _this.playMusic();
                } else {
                    audioE.pause();
                    clearInterval(_this.timer);
                }
            },
            fail: function() {
                musicLyricContent.innerHTML = '未能找到' + obj.title + '相匹配的歌词！';
                if (musicPlay.onOff) {
                    audioE.play();
                    _this.playMusic();
                } else {
                    audioE.pause();
                    clearInterval(_this.timer);
                }
            }
        });
    },
    /**
     * [playMusic description]  定义的播放歌曲的方法
     */
    playMusic: function() {
        var _this = this;
        this.timer = setInterval(function() {
            if (_this.drafting) {
                _this.lrcProgress();
            }
            if (_this.drafting) {
                playProgressPoint.style.left = audioE.currentTime / audioE.duration * (_this.playProgressBarW - playProgressPoint.offsetWidth) + 'px';
                playNowProgress.style.width = audioE.currentTime / audioE.duration * _this.playProgressBarW + 'px';
                nowTime.innerHTML = $.getTime(audioE.currentTime);
            }
        }, 100);
    },
    /**
     * [prev description]  定义的上一曲的方法
     */
    prev: function() {
        this.num--;
        if (this.num < 0) {
            this.num = this.data.length - 1;
        }
        this.loadMusic(this.loopArr[this.num]);
        this.num = this.loopArr[this.num];
    },
    /**
     * [playBtn description]  定义的播放暂停的方法
     */
    playBtn: function() {
        if (musicPlay.onOff) {
            $.removeClass(musicPlay, 'play');
            $.removeClass(musicAlbumImg, 'play');
            audioE.pause();
            clearInterval(this.timer);
        } else {
            $.addClass(musicPlay, 'play');
            $.addClass(musicAlbumImg, 'play');
            audioE.play();
            this.playMusic();
        }
        musicPlay.onOff = !musicPlay.onOff;
    },
    /**
     * [next description]  定义的下一曲的方法
     */
    next: function() {
        this.num++;
        if (this.num > this.data.length - 1) {
            this.num = 0;
        }
        this.loadMusic(this.loopArr[this.num]);
    },
    /**
     * [loopTab description]  定义的循环模式切换的方法
     */
    loopTab: function() {
        if (this.loopType == 'order') {
            musicLoop.className = this.loopType = 'single';
            this.loopArr.sort(function(a, b) {
                return a - b;
            });
        } else if (this.loopType == 'single') {
            musicLoop.className = this.loopType = 'random';
            this.loopArr.sort(function(a, b) {
                return Math.random() - 0.5;
            });
        } else if (this.loopType == 'random') {
            musicLoop.className = this.loopType = 'order';
            this.num = this.loopArr[this.num];
            this.loopArr.sort(function(a, b) {
                return a - b;
            });
        }
    },
    /**
     * [loadEnd description]  定义的歌曲加载完毕的方法
     */
    loadEnd: function() {
        allTime.innerHTML = $.getTime(audioE.duration);
        volumeProgressPoint.style.left = (this.musicVolumeBarW - volumeProgressPoint.offsetWidth) * audioE.volume + 'px';
        volumeNowProgress.style.width = this.musicVolumeBarW * audioE.volume + 'px';
    },
    /**
     * [playEnd description]  定义的歌曲播放完毕的方法
     */
    playEnd: function() {
        if (this.loopType != 'single') {
            this.num++;
            if (this.num > this.data.length - 1) {
                this.num = 0;
            }
        }
        this.loadMusic(this.loopArr[this.num]);
    },
    /**
     * [lrcProgress description]  定义的更新歌词进度的方法
     */
    lrcProgress:function(){
      if (this.loadLrc) {
  			for(var i = 0; i < this.lrcArr.length; i++) {
  				if(this.lrcArr[i].time >= Math.floor(audioE.currentTime)) {
  					$.move(musicLyricContent, {
  						top: -this.lis[i].offsetTop + 200
  					}, 200, 'easeOut');
  					for(var j = 0; j < this.lis.length; j++) {
  						$.removeClass(this.lis[j], 'active');
  					}
  					$.addClass(this.lis[i], 'active');
  					break;
  				} else {
  						$.move(musicLyricContent, {
  							top: -this.lis[this.lis.length - 1].offsetTop + 200
  						}, 200, 'easeOut');
  				}
  			}
  		}
    },
    /**
     * [toProgress description]  定义的跳至指定进度的方法
     * @param  {[type]} ev [description]  传入ev对象
     */
    toProgress:function(ev){
      var ev = ev || event;
      var W = ev.clientX - $.getOffsetToBody(playProgressBar, 'offsetLeft');
      if(W > this.playProgressBarW) {
        W = this.playProgressBarW;
      }
      if(W < 0) {
        W = 0;
      }
      audioE.currentTime = W / this.playProgressBarW * audioE.duration;
      nowTime.innerHTML = $.getTime(audioE.currentTime);
      this.lrcProgress();
      this.drafting = true;
    },
    /**
     * [isMute description]  定义的是否静音的方法
     * @param  {[type]}  This [description]  传入触发的按钮对象
     */
    isMute:function(This){
      if(this.oldVolume) {
        audioE.volume = this.oldVolume;
        this.oldVolume = null;
        $.removeClass(This, 'mute');
      } else {
        this.oldVolume = audioE.volume;
        audioE.volume = 0;
        $.addClass(This, 'mute');
      };
      volumeProgressPoint.style.left = audioE.volume * this.musicVolumeBarW * (this.musicVolumeBarW - volumeProgressPoint.offsetWidth) / this.musicVolumeBarW + 'px';
      volumeNowProgress.style.width = audioE.volume * this.musicVolumeBarW + 'px';
    },
    /**
     * [toVolume description]  跳转至指定音量的方法
     * @param  {[type]} ev [description]  传入ev对象
     */
    toVolume:function(ev){
      var ev = ev || event;
      var W = ev.clientX - $.getOffsetToBody(musicVolumeBar, 'offsetLeft');
      if(W > this.musicVolumeBarW) {
        W = this.musicVolumeBarW;
      };
      if(W < 0){
        W = 0;
      };
      volumeProgressPoint.style.left = W * (this.musicVolumeBarW - volumeProgressPoint.offsetWidth) / this.musicVolumeBarW + 'px';
      volumeNowProgress.style.width = W + 'px';
      audioE.volume = W / this.musicVolumeBarW;
      if(audioE.volume == 0) {
        $.addClass(musicVolumeBtn, 'mute');
      } else {
        $.removeClass(musicVolumeBtn, 'mute');
      }
    },
    /**
     * [openList description]  定义的展开列表的方法
     */
    openList:function(){
      musicListBtn.H = musicListBtn.H ? 0 : musicList.offsetHeight + 30;
    	$.move(musicListBox, {
    		height: musicListBtn.H
    	}, 500, 'easeIn');
    },
    /**
     * [closeList description]  定义的收起列表的方法
     */
    closeList:function(){
      if(musicListBtn.H) {
    		musicListBtn.H = 0;
    		$.move(musicListBox, {
    			height: 0
    		}, 500, 'easeIn');
    	}
    },
    /**
     * [drawSpectrum description]  定义的绘制频谱的方法
     */
    drawSpectrum:function(){
      var canvas = document.getElementById('spectrum'),
          cwidth = canvas.width,
          cheight = canvas.height - 2,
          meterWidth = 4, //频谱条宽度
          gap = 1, //频谱条间距
          capHeight = 2,
          capStyle = '#fff',
          meterNum = 800 / (4 + 1), //频谱条数量
          capYPositionArray = []; //将上一画面各帽头的位置保存到这个数组
      ctx = canvas.getContext('2d'),
      gradient = ctx.createLinearGradient(0, 0, 0, 800);
      gradient.addColorStop(0, 'rgb(249,5,246)');
      gradient.addColorStop(1, 'rgb(7,223,245)');
      var audioContext=new window.AudioContext();
      var analyser = audioContext.createAnalyser();
      var audioBufferSouceNode = audioContext.createMediaElementSource(audioE);
      //	audioBufferSouceNode.buffer = buffer;
      audioBufferSouceNode.connect(analyser);
      analyser.connect(audioContext.destination);
      var drawMeter = function() {
     	 	var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var step = Math.round(array.length / meterNum); //计算采样步长
          ctx.clearRect(0, 0, cwidth, cheight);
          for (var i = 0; i < meterNum; i++) {
              var value = array[i * step]; //获取当前能量值
              if (capYPositionArray.length < Math.round(meterNum)) {
                  capYPositionArray.push(value); //初始化保存帽头位置的数组，将第一个画面的数据压入其中
              };
              ctx.fillStyle = capStyle;
              //开始绘制帽头
              if (value < capYPositionArray[i]) { //如果当前值小于之前值
                  ctx.fillRect(i * 5, cheight - (--capYPositionArray[i]), meterWidth, capHeight); //则使用前一次保存的值来绘制帽头
              } else {
                  ctx.fillRect(i * 5, cheight - value*1.5, meterWidth, capHeight); //否则使用当前值直接绘制
                  capYPositionArray[i] = value;
              };
              //开始绘制频谱条
              ctx.fillStyle = gradient;
              ctx.fillRect(i * 5, cheight - value*1.5 + capHeight, meterWidth, cheight);
          }
          requestAnimationFrame(drawMeter);
      }
      requestAnimationFrame(drawMeter);
    },
};
var music = new Music();
music.init();
