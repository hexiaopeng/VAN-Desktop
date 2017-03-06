// var data = window.top.data;
// var $ = window.top.$;
console.log(window);

var audioE = document.getElementById('audio');
var musicTop = document.getElementById('music_top');
var musicSearch = document.getElementById('music_search');
var musicSearchBtn = document.getElementById('music_search_btn');
var musicSearchContent = document.getElementById('music_search_content');
var closeSearch = document.getElementById('close_search');
var musicSearchList = document.getElementById('music_search_list');
var musicAlbum = document.getElementById('music_album');
var musicAlbumImg = document.getElementById('music_album_img');
var musicDiscImg = document.getElementById('music_disc_img');
var musicInfoBox = document.getElementById('music_info_box');
var songName = musicInfoBox.getElementsByTagName('span')[0];
var songerName = musicInfoBox.getElementsByTagName('span')[1];
var albumName = musicInfoBox.getElementsByTagName('span')[2];
var musicLyric = document.getElementById('music_lyric');
var musicLyricBox = document.getElementById('music_lyric_box');
var musicLyricLine = document.getElementById('music_lyric_line');
var musicLyricContent = document.getElementById('music_lyric_content');
//var spectrum = document.getElementById('spectrum');
var musicPrev = document.getElementById('music_prev');
var musicPlay = document.getElementById('music_play');
var musicNext = document.getElementById('music_next');
var nowTime = document.getElementById('now_time');
var playProgressBar = document.getElementById('play_progress_bar');
var playNowProgress = document.getElementById('play_now_progress');
var playProgressPoint = document.getElementById('play_progress_point');
var allTime = document.getElementById('all_time');
var musicLoop = document.getElementById('music_loop');
var musicVolumeBtn = document.getElementById('music_volume_btn');
var musicVolumeBar = document.getElementById('music_volume_bar');
var volumeNowProgress = document.getElementById('volume_now_progress');
var volumeProgressPoint = document.getElementById('volume_progress_point');
var musicListBtn = document.getElementById('music_list_btn');
var musicListBox = document.getElementById('music_list_box');
var musicList = document.getElementById('music_list');
var musicNum = document.getElementsByClassName('music_list_name')[0].getElementsByTagName('em')[0];


function Music(){
  this.musicId = window.location.search || data.getFileByClass(data.nodes,'music')[0].id;
  this.data = data.getFileByClass(data.nodes,'music');
  this.num = data.indexOf(this.data,data.getFile(this.data,this.musicId));
  this.musicItems = null;
  this.musicSongnames = [];
  this.loopArr = [];
  this.timer = null;
  this.playProgressBarW = playProgressBar.offsetWidth;
  this.musicVolumeBarW = musicVolumeBar.offsetWidth;
  this.lrcArr = null;
  this.lis = null;
  this.loopType = 'order';
  this.oldVolume = null;
  this.musicKey = null;
  this.overLrc = true;
  this.drafting = true;
}

Music.prototype = {
  constructor:Music,
  init:function(){
    var _this = this
    this.loadMusicList()
    this.loadMusic(this.num);
    musicPrev.onclick = function(){
      _this.prev();
    };
    musicPlay.onclick = function() {
      _this.playBtn();
    };
    musicNext.onclick = function(){
      _this.next();
    };
    musicLoop.onclick = function(){
      _this.loopTab();
    };
    audioE.onloadedmetadata = function() {
      _this.loadEnd();
    };
    audioE.onended = function() {
      _this.playEnd();
    };
  },
  loadMusicList:function () {
    var _this = this;
    for(var i = 0; i < this.data.length; i++) {
      var musicItem = document.createElement('li');
      var obj = this.data[i];
      // musicItem.dataset.musicId = obj.id;
      $.addClass(musicItem, 'music_item');
      obj.title.replace(/^([^_]+)_([^_]+)_([^_]+)?$/,function(all,song,name,album){
        musicItem.innerHTML = '<span class="music_songname">' + song + '</span>-' +'<span class="music_songer">' + name + '</span></li>';
      });
      musicList.appendChild(musicItem);
      this.loopArr.push(i);
    };
    this.musicItems = musicList.getElementsByTagName('li');
    for(var i = 0; i < this.musicItems.length; i++) {
      var musicSongname = this.musicItems[i].getElementsByClassName('music_songname')[0];
      this.musicSongnames.push(musicSongname);
      this.musicItems[i].index = i;
      this.musicItems[i].onclick = function() {
        _this.loadMusic(this.index);
        _this.num = this.index;
      };
    };
    musicNum.innerHTML = '(' + this.data.length + ')';
  },
  loadMusic:function(num){
    var obj = this.data[num];
    // console.log(num);
    for(var i = 0; i < this.data.length; i++) {
      $.removeClass(this.musicSongnames[i], 'music_active');
    };
    $.addClass(this.musicSongnames[num], 'music_active');
  	audioE.src = 'music/'+obj.title+'.' + obj.type;
  	audioE.load();
  	musicAlbumImg.src = 'music/'+obj.title + '.jpg';
  	obj.title.replace(/^([^_]+)_([^_]+)_([^_]+)?$/,function(all,song,name,album){
      songName.innerHTML = song;
      songerName.innerHTML = name?name:song;
      albumName.innerHTML = album?album:song;
    });
    musicLyricContent.style.top = '200px';
    this.loadLrc(obj)
  },
  loadLrc:function(obj){
    var _this = this;
    $.ajax({
  		url: 'music/'+obj.title+'.lrc',
  		success: function(data) {
  			_this.lrcArr = $.parseLyric(data);
  			var str = '';
  			for(var i = 0; i < _this.lrcArr.length; i++) {
  				str += '<li class="lyric">' + _this.lrcArr[i].clause + '</li>';
  			};
  			musicLyricContent.innerHTML = str;
  			_this.lis = musicLyricContent.getElementsByTagName('li');
  			if(musicPlay.onOff) {
  				audioE.play();
          _this.playMusic();
  			} else {
  				audioE.pause();
          clearInterval(_this.timer);
  			};
  		},
  		fail: function() {
  			musicLyricContent.innerHTML = '未能找到'+obj.title+'相匹配的歌词！';
  			if(musicPlay.onOff) {
          audioE.play();
          _this.playMusic();
  			} else {
  				audioE.pause();
          clearInterval(_this.timer);
  			};
  		}
  	});
  },
  getMusicSongnameById:function(num){
    for (var i = 0; i < this.musicItems.length; i++) {
      if (this.musicItems[i].dataset.musicId == num) {
        return this.musicItems[i].getElementsByClassName('music_songname')[0];
      };
    };
  },
  playMusic:function () {
    var _this = this;
  	this.timer = setInterval(function() {
  		if (_this.overLrc && _this.drafting) {
  			for(var i = 0; i < _this.lrcArr.length; i++) {
  				if(_this.lrcArr[i].time == Math.floor(audioE.currentTime)) {
  					$.move(musicLyricContent, {
  						top: -_this.lis[i].offsetTop + 200
  					}, 200, 'easeOut');
  					for(var j = 0; j < _this.lis.length; j++) {
  						$.removeClass(_this.lis[j], 'active');
  					};
  					$.addClass(_this.lis[i], 'active');
  					break;
  				};
  			};
  		};
  		if (_this.drafting) {
  			playProgressPoint.style.left = audioE.currentTime / audioE.duration * (_this.playProgressBarW - playProgressPoint.offsetWidth) + 'px';
  			playNowProgress.style.width = audioE.currentTime / audioE.duration * _this.playProgressBarW + 'px';
  			nowTime.innerHTML = $.getTime(audioE.currentTime);
  		};
  	}, 100);
  },
  prev:function(){
    this.num--;
    if (this.num < 0) {
      this.num = this.data.length - 1;
    };
    this.loadMusic(this.loopArr[this.num]);
    this.num = this.loopArr[this.num];
  },
  playBtn:function(){
    if(musicPlay.onOff) {
  		$.removeClass(musicPlay, 'play');
  		$.removeClass(musicAlbumImg, 'play');
  		audioE.pause();
  		clearInterval(this.timer);
  	} else {
  		$.addClass(musicPlay, 'play');
  		$.addClass(musicAlbumImg, 'play');
  		audioE.play();
  		this.playMusic();
  	};
  	musicPlay.onOff = !musicPlay.onOff;
  },
  next:function(){
    this.num++;
    if (this.num > this.data.length - 1) {
      this.num = 0;
    };
    this.loadMusic(this.loopArr[this.num]);
  },
  loopTab:function(){
    if(this.loopType == 'order') {
  		musicLoop.className = this.loopType = 'single';
  		this.loopArr.sort(function(a, b) {
  			return a - b;
  		});
  	} else if(this.loopType == 'single') {
  		musicLoop.className = this.loopType = 'random';
  		this.loopArr.sort(function(a, b) {
  			return Math.random() - 0.5;
  		});
  	} else if(this.loopType == 'random') {
  		musicLoop.className = this.loopType = 'order';
      this.num = this.loopArr[this.num];
  		this.loopArr.sort(function(a, b) {
  			return a - b;
  		});
  	};
  },
  loadEnd:function(){
    allTime.innerHTML = $.getTime(audioE.duration);
  	volumeProgressPoint.style.left = (this.musicVolumeBarW - volumeProgressPoint.offsetWidth) * audioE.volume + 'px';
  	volumeNowProgress.style.width = this.musicVolumeBarW * audioE.volume + 'px';
  },
  playEnd:function(){
    if(this.loopType != 'single') {
  		this.num++;
  		if(this.num > this.data.length - 1) {
  			this.num = 0;
  		};
  	};
  	this.loadMusic(this.loopArr[this.num]);
  }
};
var music = new Music();
music.init();
