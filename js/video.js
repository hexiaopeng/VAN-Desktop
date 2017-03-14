var videoBox = document.getElementById('video_box'),
    videoE = document.getElementById('video'),
    videoControl = document.getElementById('video_control'),
    progressBar = videoControl.getElementsByClassName('progress_bar')[0],
    progressBarSchedile = videoControl.getElementsByClassName('progress_bar_schedile')[0],
    progressPoint = videoControl.getElementsByClassName('progress_point')[0],
    promptTime = videoControl.getElementsByClassName('prompt_time')[0],
    playTime = videoControl.getElementsByClassName('play_time')[0],
    stop = videoControl.getElementsByClassName('stop')[0],
    prev = videoControl.getElementsByClassName('prev')[0],
    play = videoControl.getElementsByClassName('play')[0],
    next = videoControl.getElementsByClassName('next')[0],
    volumeTrue = videoControl.getElementsByClassName('volume_true')[0],
    volumeBar = videoControl.getElementsByClassName('volume_bar')[0],
    volumeBarSchedile = videoControl.getElementsByClassName('volume_bar_schedile')[0],
    volumePoint = videoControl.getElementsByClassName('volume_point')[0],
    fullScreenE = videoControl.getElementsByClassName('full_screen')[0],
    videoList = document.getElementById('video_list'),
    listBtn = videoList.getElementsByClassName('list_btn')[0],
    localVideo = videoList.getElementsByClassName('local_video')[0],
    playRecord = videoList.getElementsByClassName('play_record')[0],
    listBox = videoList.getElementsByClassName('list_box')[0],
    localList = videoList.getElementsByClassName('local_list')[0],
    recordList = videoList.getElementsByClassName('record_list')[0];

function Video(){
  this.videoId = window.location.search ||  data.getFileByClass(data.nodes, 'video')[0].id;
  this.data = data.getFileByClass(data.nodes, 'video');
  this.num = data.indexOf(this.data, data.getFile(this.data, this.videoId));
  this.progressBarW = progressBar.offsetWidth;
  this.volumeBarW = volumeBar.offsetWidth;
  this.listW = Math.ceil(videoList.offsetWidth);
  this.oldVolume = null;//存下旧的音量;
  this.drafting = true;
  this.palyOnOff = false;
};

Video.prototype = {
    constructor:Video,
    init:function(){
        // console.log(this.data,this.num);
        var _this = this;
        this.addList();
        this.loadVideo(this.num);
        prev.onclick = function() {//初始化上一曲
            _this.prev();
        };
        play.onclick = function() {//初始化播放暂停
            _this.playBtn();
        };
        next.onclick = function() {//初始化下一曲
            _this.next();
        };
        videoE.onloadedmetadata = function() {//初始化歌曲加载完毕
            _this.loadEnd();
        };
        videoE.onended = function() {//初始化歌曲播放完毕
            _this.playEnd();
        };
        volumeTrue.onclick = function() {//初始化点击静音
            _this.isMute(this);
        };
        listBtn.onclick = function() {//初始化点击静音
            _this.openList();
        };
        localVideo.onclick = function(){
            _this.tabList(true);
        };
        playRecord.onclick = function(){
            _this.tabList(false);
        };
        $.drag(progressPoint,function(ev,This) {//初始化进度拖拽
              This.drafting = false;
          },function(ev,This){
              var ev = ev || event;
          		var W = ev.clientX - $.getOffsetToBody(progressBar, 'offsetLeft');
          		if(W > This.progressBarW) {
          			W = This.progressBarW;
          		}
          		if(W < 0) {
          			W = 0;
          		}
          		progressPoint.style.left = W * (This.progressBarW - progressPoint.offsetWidth) / This.progressBarW + 'px';
          		progressBarSchedile.style.width = W + 'px';
          },function(ev,This){
            This.toProgress(ev);
            document.onmousemove = document.onmouseup = null;
        },this);
        progressBar.onclick = function(ev) {//初始化进度点击
          _this.toProgress(ev);
        };
        $.drag(volumePoint,function(ev,This){//初始化音量拖拽
          This.oldVolume = videoE.volume;
        },function(ev,This){
          _this.toVolume(ev);
        },function(ev,This){
          if(videoE.volume != 0) {
      			This.oldVolume = null;
      		}
      		document.onmousemove = document.onmouseup = null;
        },this);
        volumeBar.onclick = function(ev) {//初始化音量点击
        	_this.toVolume(ev);
        };
    },
    addList:function(){
        var _this = this;
        this.videoItems = [];
        for (var i = 0; i < this.data.length; i++) {
            var videoItem = document.createElement('li');
            var obj = this.data[i];
            videoItem.innerHTML = obj.title;
            localList.appendChild(videoItem);
            this.videoItems.push(videoItem);
            videoItem.index = i;
            videoItem.onclick = function () {
                _this.num = this.index;
                _this.loadVideo(this.index);
            };
        }
    },
    loadVideo:function(num){
        var obj = this.data[num];
        for(var i=0; i< this.videoItems.length; i++){
            $.removeClass(this.videoItems[i], 'video_active');
        }
        $.addClass(this.videoItems[num], 'video_active');
        videoE.src = 'video/' + obj.title + '.' + obj.type;
        videoE.load();
        $.removeClass(play, 'pause');
        $.addClass(play, 'play');
        videoE.pause();
        clearInterval(this.timer);
        play.onOff = false;
        this.palyOnOff = false;
        progressPoint.style.left =  0 + 'px';
        progressBarSchedile.style.width = 0 +'px';
        progressBar.style.visibility = 'hidden';
        playTime.style.visibility = 'hidden';
        fullScreenE.style.visibility = 'hidden';
    },
    playVideo:function(){
        var _this = this;
        progressBar.style.visibility = 'visible';
        playTime.style.visibility = 'visible';
        fullScreenE.style.visibility = 'visible';
        this.timer = setInterval(function() {
            if(_this.drafting){
                progressPoint.style.left = videoE.currentTime / videoE.duration * (_this.progressBarW - progressPoint.offsetWidth) + 'px';
                progressBarSchedile.style.width = videoE.currentTime / videoE.duration * _this.progressBarW + 'px';
                playTime.innerHTML = $.getTime(videoE.currentTime) + '/' + $.getTime(videoE.duration);
            }
        }, 100);
    },
    prev: function() {
        this.num--;
        if (this.num < 0) {
            this.num = this.data.length - 1;
        }
        this.loadVideo(this.num);
    },
    playBtn: function() {
        if (play.onOff) {
            $.removeClass(play, 'pause');
            $.addClass(play, 'play');
            videoE.pause();
            clearInterval(this.timer);
        } else {
            $.removeClass(play, 'play');
            $.addClass(play, 'pause');
            videoE.play();
            // videoE.playbackRate  = 2.0
            this.playVideo();
        }
        play.onOff = !play.onOff;
        this.palyOnOff = !this.palyOnOff;
    },
    next: function() {
        this.num++;
        if (this.num > this.data.length - 1) {
            this.num = 0;
        }
        this.loadVideo(this.num);
    },
    loadEnd: function() {
        playTime.innerHTML = '00:00/'+$.getTime(videoE.duration);
        volumePoint.style.left = (this.volumeBarW - volumePoint.offsetWidth) * videoE.volume + 'px';
        volumeBarSchedile.style.width = this.volumeBarW * videoE.volume + 'px';
        this.judgeVolume();
    },
    playEnd: function() {
        $.removeClass(play, 'pause');
        $.addClass(play, 'play');
        clearInterval(this.timer);
    },
    isMute:function(This){
      if(this.oldVolume) {
        videoE.volume = this.oldVolume;
        this.oldVolume = null;
      } else {
        this.oldVolume = videoE.volume;
        videoE.volume = 0;
      };
      this.judgeVolume();
      volumePoint.style.left = videoE.volume * this.volumeBarW * (this.volumeBarW - volumePoint.offsetWidth) / this.volumeBarW + 'px';
      volumeBarSchedile.style.width = videoE.volume * this.volumeBarW + 'px';
    },
    judgeVolume:function(){
        if (videoE.volume > 0.5) {
            $.removeClass(volumeTrue, 'volume_mute');
            $.removeClass(volumeTrue, 'volume_small');
            $.addClass(volumeTrue, 'volume_big');
        } else if(videoE.volume == 0){
            $.removeClass(volumeTrue, 'volume_big');
            $.removeClass(volumeTrue, 'volume_small');
            $.addClass(volumeTrue, 'volume_mute');
        }else{
            $.removeClass(volumeTrue, 'volume_mute');
            $.removeClass(volumeTrue, 'volume_big');
            $.addClass(volumeTrue, 'volume_small');
        }
    },
    openList:function(){
        listBtn.H = listBtn.H ? 0 : -videoList.offsetWidth;
    	$.move(videoList, {
    		right: listBtn.H
    	}, 500, 'easeIn');
        if (listBtn.H) {
            videoBox.style.width='100%';
            $.removeClass(listBtn, 'open');
            $.addClass(listBtn, 'close');
        } else {
            videoBox.style.width='84%';
            $.removeClass(listBtn, 'close');
            $.addClass(listBtn, 'open');
        }
        this.progressBarW = progressBar.offsetWidth;
        progressPoint.style.left = videoE.currentTime / videoE.duration * (this.progressBarW - progressPoint.offsetWidth) + 'px';
        progressBarSchedile.style.width = videoE.currentTime / videoE.duration * this.progressBarW + 'px';
    },
    tabList:function(bl){
        console.log(this.listW);
        $.move(localList, {
    		left: bl?0:-this.listW
    	}, 500, 'easeOut');
        $.move(recordList, {
    		left: bl?this.listW:0
    	}, 500, 'easeOut');
    },
    toProgress:function(ev){
        var ev = ev || event;
        var W = ev.clientX - $.getOffsetToBody(progressBar, 'offsetLeft');
        if(W > this.progressBarW) {
          W = this.progressBarW;
        }
        if(W < 0) {
          W = 0;
        }
        progressPoint.style.left = W * (this.progressBarW - progressPoint.offsetWidth) / this.progressBarW + 'px';
        progressBarSchedile.style.width = W + 'px';
        videoE.currentTime = W / this.progressBarW * videoE.duration;
        playTime.innerHTML = $.getTime(videoE.currentTime) + '/' + $.getTime(videoE.duration);
        this.drafting = true;
    },
    toVolume:function(ev){
      var ev = ev || event;
      var W = ev.clientX - $.getOffsetToBody(volumeBar, 'offsetLeft');
      if(W > this.volumeBarW) {
        W = this.volumeBarW;
      };
      if(W < 0){
        W = 0;
      };
      volumePoint.style.left = W * (this.volumeBarW - volumePoint.offsetWidth) / this.volumeBarW + 'px';
      volumeBarSchedile.style.width = W + 'px';
      videoE.volume = W / this.volumeBarW;
      this.judgeVolume();
    }
};

var video = new Video();
video.init();
