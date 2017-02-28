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
var musicItems = null;
var musicSongnames = [];
var loopArr = [];
var num = 0;
var timer = null;
var playProgressBarW = playProgressBar.offsetWidth;
var musicVolumeBarW = musicVolumeBar.offsetWidth;
var lrcArr = null;
var lis = null;
var loopType = 'order';
var oldVolume = null;
var musicKey = null;
var loadLrc = true;
var drafting = true;

function loadMusicList() {
	for(var i = 0; i < Data.length; i++) {
		var musicItem = document.createElement('li');
		addClass(musicItem, 'music_item');
		musicItem.innerHTML = '<span class="music_songname">' + Data[i].info.songname + '</span>-' +
			'<span class="music_songer">' + Data[i].info.songer + '</span></li>';
		musicList.appendChild(musicItem);
		loopArr.push(i);
	};
	musicItems = musicList.getElementsByTagName('li');
	for(var i = 0; i < musicItems.length; i++) {
		musicItems[i].index = i;
		var musicSongname = musicItems[i].getElementsByClassName('music_songname')[0];
		musicSongnames.push(musicSongname);
		musicItems[i].onclick = function() {
			num = this.index;
			loadMusic(num);
		};
	};
	musicNum.innerHTML = '(' + Data.length + ')';
};
loadMusicList();

function loadMusic(num) {
	for(var i = 0; i < Data.length; i++) {
		removeClass(musicSongnames[i], 'music_active');
	};
	addClass(musicSongnames[num], 'music_active');
	audioE.src = Data[num].url;
	audioE.load();
	musicAlbumImg.src = Data[num].img;
	songName.innerHTML = Data[num].info.songname;
	songerName.innerHTML = Data[num].info.songer;
	albumName.innerHTML = Data[num].info.album;
	musicLyricContent.style.top = '200px';
	ajax({
		url: Data[num].lrc,
		success: function(data) {
			loadLrc = true;;
			lrcArr = parseLyric(data);
			var str = '';
			for(var i = 0; i < lrcArr.length; i++) {
				str += '<li class="lyric">' + lrcArr[i].clause + '</li>';
			};
			musicLyricContent.innerHTML = str;
			lis = musicLyricContent.getElementsByTagName('li');
			if(musicPlay.onOff) {
				audioE.play();
				playMusic();
			} else {
				audioE.pause();
				clearInterval(timer);
			};
		},
		fail: function() {
			musicLyricContent.innerHTML = '接口限制，部分歌词不能加载，请谅解！';
			loadLrc = false;
			if(musicPlay.onOff) {
				audioE.play();
				playMusic();
			} else {
				audioE.pause();
				clearInterval(timer);
			};
		}
	});
};
loadMusic(loopArr[num]);

musicPrev.onclick = function() {
	num--;
	if(num < 0) {
		num = Data.length - 1;
	};
	loadMusic(loopArr[num]);

};

musicPlay.onclick = function() {
	if(this.onOff) {
		removeClass(this, 'play');
		removeClass(musicAlbumImg, 'play');
		audioE.pause();
		clearInterval(timer);
	} else {
		addClass(this, 'play');
		addClass(musicAlbumImg, 'play');
		audioE.play();
		playMusic();
	};
	this.onOff = !this.onOff;
};

musicNext.onclick = function() {
	num++;
	if(num >= Data.length) {
		num = 0;
	};
	loadMusic(loopArr[num]);
};

musicLoop.onclick = function() {
	if(loopType == 'order') {
		this.className = loopType = 'single';
		loopArr.sort(function(a, b) {
			return a - b;
		});
	} else if(loopType == 'single') {
		this.className = loopType = 'random';
		loopArr.sort(function(a, b) {
			return Math.random() - 0.5;
		});
	} else if(loopType == 'random') {
		this.className = loopType = 'order';
		loopArr.sort(function(a, b) {
			return a - b;
		});
	};
};

audioE.onloadedmetadata = function() {
	allTime.innerHTML = getTime(audioE.duration);
	volumeProgressPoint.style.left = (musicVolumeBarW - volumeProgressPoint.offsetWidth) * audioE.volume + 'px';
	volumeNowProgress.style.width = musicVolumeBarW * audioE.volume + 'px';

};

function playMusic() {

	timer = setInterval(function() {
		if (loadLrc && drafting) {
			for(var i = 0; i < lrcArr.length; i++) {
				if(lrcArr[i].time == Math.floor(audioE.currentTime)) {
					move(musicLyricContent, {
						top: -lis[i].offsetTop + 200
					}, 200, 'easeOut');
					for(var j = 0; j < lis.length; j++) {
						removeClass(lis[j], 'active');
					};
					addClass(lis[i], 'active');
					break;
				};
			};
		};
		if (drafting) {
			playProgressPoint.style.left = audioE.currentTime / audioE.duration * (playProgressBarW - playProgressPoint.offsetWidth) + 'px';
			playNowProgress.style.width = audioE.currentTime / audioE.duration * playProgressBarW + 'px';
			nowTime.innerHTML = getTime(audioE.currentTime);
		};
	}, 100);
};

audioE.onended = function() {
	if(loopType != 'single') {
		num++;
		if(num >= Data.length) {
			num = 0;
		};
	};
	loadMusic(loopArr[num]);
};

playProgressBar.onmousedown = function() {
	drafting = false;
	document.onmousemove = function(ev) {
		var ev = ev || event;
		var W = ev.clientX - getOffsetToBody(playProgressBar, 'offsetLeft');
		if(W > playProgressBarW) {
			W = playProgressBarW;
		};
		if(W < 0) {
			W = 0;
		};
		playProgressPoint.style.left = W * (playProgressBarW - playProgressPoint.offsetWidth) / playProgressBarW + 'px';
		playNowProgress.style.width = W + 'px';
		nowTime.innerHTML = getTime(W / playProgressBarW * audioE.duration);
	};
	document.onmouseup = function(ev) {
		var ev = ev || event;
		var W = ev.clientX - getOffsetToBody(playProgressBar, 'offsetLeft');
		if(W > playProgressBarW) {
			W = playProgressBarW;
		};
		if(W < 0) {
			W = 0;
		};
		audioE.currentTime = W / playProgressBarW * audioE.duration;
		nowTime.innerHTML = getTime(audioE.currentTime);
		if (loadLrc) {
			for(var i = 0; i < lrcArr.length; i++) {
				if(lrcArr[i].time >= Math.floor(audioE.currentTime)) {
					move(musicLyricContent, {
						top: -lis[i].offsetTop + 200
					}, 200, 'easeOut');
					for(var j = 0; j < lis.length; j++) {
						removeClass(lis[j], 'active');
					};
					addClass(lis[i], 'active');
					break;
				} else {
						move(musicLyricContent, {
							top: -lis[lis.length - 1].offsetTop + 200
						}, 200, 'easeOut');
				};
			};
		};
		drafting = true;
		document.onmousemove = document.onmouseup = null;
	};
	return false;
};

playProgressBar.onclick = function(ev) {
	var ev = ev || event;
	var W = ev.clientX - getOffsetToBody(playProgressBar, 'offsetLeft');
	playProgressPoint.style.left = W * (playProgressBarW - playProgressPoint.offsetWidth) / playProgressBarW + 'px';
	playNowProgress.style.width = W + 'px';
	audioE.currentTime = W / playProgressBarW * audioE.duration;
	nowTime.innerHTML = getTime(audioE.currentTime);
	if (loadLrc) {
		for(var i = 0; i < lrcArr.length; i++) {
			if(lrcArr[i].time >= Math.floor(audioE.currentTime)) {
				move(musicLyricContent, {
					top: -lis[i].offsetTop + 200
				}, 200, 'easeOut');
				for(var j = 0; j < lis.length; j++) {
					removeClass(lis[j], 'active');
				};
				addClass(lis[i], 'active');
				break;
			} else {
				move(musicLyricContent, {
					top: -lis[lis.length - 1].offsetTop + 200
				}, 300, 'easeOut');
			}
		};
	};
};

musicVolumeBtn.onclick = function() {
	if(oldVolume) {
		audioE.volume = oldVolume;
		oldVolume = null;
		removeClass(this, 'mute');
	} else {
		oldVolume = audioE.volume;
		audioE.volume = 0;
		addClass(this, 'mute');
	};
	volumeProgressPoint.style.left = audioE.volume * musicVolumeBarW * (musicVolumeBarW - volumeProgressPoint.offsetWidth) / musicVolumeBarW + 'px';
	volumeNowProgress.style.width = audioE.volume * musicVolumeBarW + 'px';
};

musicVolumeBar.onmousedown = function() {
	oldVolume = audioE.volume;
	document.onmousemove = function(ev) {
		var ev = ev || event;
		var W = ev.clientX - getOffsetToBody(musicVolumeBar, 'offsetLeft');
		if(W > musicVolumeBarW) {
			W = musicVolumeBarW;
		};
		if(W < 0){
			W = 0;
		};
		volumeProgressPoint.style.left = W * (musicVolumeBarW - volumeProgressPoint.offsetWidth) / musicVolumeBarW + 'px';
		volumeNowProgress.style.width = W + 'px';
		audioE.volume = W / musicVolumeBarW;
		if(audioE.volume == 0) {
			addClass(musicVolumeBtn, 'mute');
		} else {
			removeClass(musicVolumeBtn, 'mute');
		}
	};
	document.onmouseup = function(ev) {
		if(audioE.volume != 0) {
			oldVolume = null;
		};
		document.onmousemove = document.onmouseup = null;
	};
	return false;
};

musicVolumeBar.onclick = function(ev) {
	var ev = ev || event;
	var W = ev.clientX - getOffsetToBody(musicVolumeBar, 'offsetLeft');
	volumeProgressPoint.style.left = W * (musicVolumeBarW - volumeProgressPoint.offsetWidth) / musicVolumeBarW + 'px';
	volumeNowProgress.style.width = W + 'px';
	audioE.volume = W / musicVolumeBarW;
	if(audioE.volume == 0) {
		addClass(musicVolumeBtn, 'mute');
	} else {
		removeClass(musicVolumeBtn, 'mute');
	};
};

musicListBtn.onclick = function() {
	this.H = this.H ? 0 : musicList.offsetHeight + 30;
	move(musicListBox, {
		height: this.H
	}, 500, 'easeIn');
};

musicTop.onclick = musicAlbum.onclick = musicLyric.onclick = function() {
	if(musicListBtn.H) {
		musicListBtn.H = 0;
		move(musicListBox, {
			height: 0
		}, 500, 'easeIn');
	};
};

musicLyricBox.onmousedown = function(ev) {
	var ev = ev || event;
	var oldY = ev.clientY;
	var n = null;
	var T = musicLyricContent.offsetTop;
	drafting = false;
	document.onmousemove = function(ev) {
		var ev = ev || event;
		if(Math.abs(ev.clientY - oldY) > 10) {
			musicLyricBox.style.cursor = 'pointer';
			musicLyricLine.style.display = 'block';
			musicLyricContent.style.top = (T + (ev.clientY - oldY)) + 'px';
			for(var i = 0; i < lis.length; i++) {
				if((lis[i].offsetTop + musicLyricContent.offsetTop) <= 200) {
					for(var j = 0; j < lis.length; j++) {
						if(inspectClass(lis[j], 'active')) {
							removeClass(lis[j], 'active');
						};
					};
					n = i;
					addClass(lis[i], 'active');
				};
			};
		};
	};
	document.onmouseup = function() {
		drafting = true;
		musicLyricBox.style.cursor = 'auto';
		musicLyricLine.style.display = 'none';
		if(n) {
			audioE.currentTime = lrcArr[n].time;
			move(musicLyricContent, {
				top: -lis[n].offsetTop + 200
			}, 200, 'easeOut');
		};
		nowTime.innerHTML = getTime(audioE.currentTime);
		playProgressPoint.style.left = audioE.currentTime / audioE.duration * (playProgressBarW - playProgressPoint.offsetWidth) + 'px';
		playNowProgress.style.width = audioE.currentTime / audioE.duration * playProgressBarW + 'px';
		document.onmousemove = document.onmouseup = null;
	};
	return false;
};

function analysis(data) {
	var Data = data.data.song.list;
	if(Data.length == 0) {
		return false;
	};
	var arr = [];
	for(var i = 0; i < Data.length; i++) {
		var Json = {};
		Json.id = Data[i].songmid;
		Json.songname = Data[i].songname;
		Json.img = Data[i].albummid;
		Json.lrc = Data[i].songid;
		Json.singer = '';
		for(var j = 0; j < Data[i].singer.length; j++) {
			if(Data[i].singer[j + 1]) {
				Json.singer += Data[i].singer[j].name + '/';
			} else {
				Json.singer += Data[i].singer[j].name;
			}
		};
		Json.albumname = Data[i].albumname;
		arr.push(Json);
	};
	return arr;
}

function getMusicData(data) {
	var arr = analysis(data);
	musicSearchList.innerHTML = '';
	if(arr != false) {
		for(var i = 0; i < 10; i++) {
			var li = document.createElement('li');
			li.innerHTML += arr[i].songname;
			li.innerHTML += '-' + arr[i].singer;
			if(arr[i].albumname) {
				li.innerHTML += '-' + arr[i].albumname;
			};
			musicSearchList.appendChild(li);
			li.index = i;
			li.onclick = function() {
				var Json = {};
				var mid = arr[this.index].id;
				var imgStr = arr[this.index].img;
				Json.musicId = Data[Data.length - 1].musicId + 1;
				Json.url = 'http://ws.stream.qqmusic.qq.com/C200' + mid + '.m4a?vkey=' + musicKey + '&guid=0&fromtag=30';
				Json.img = 'http://imgcache.qq.com/music/photo/mid_album_90/' + imgStr.charAt(imgStr.length - 2) + '/' + imgStr.charAt(imgStr.length - 1) + '/' + imgStr + '.jpg';
				Json.info = {};
				Json.info.songname = arr[this.index].songname;
				Json.info.songer = arr[this.index].singer;
				Json.info.album = arr[this.index].albumname;
				Data.push(Json);
				var musicItem = document.createElement('li');
				addClass(musicItem, 'music_item');
				musicItem.innerHTML = '<span class="music_songname">' + Json.info.songname + '</span>-' +
					'<span class="music_songer">' + Json.info.songer + '</span></li>';
				musicList.appendChild(musicItem);
				loopArr.push(Json.musicId);
				musicItem.index = Json.musicId;
				var musicSongname = musicItem.getElementsByClassName('music_songname')[0];
				musicSongnames.push(musicSongname);
				musicItem.onclick = function() {
					num = this.index;
					loadMusic(num);
				};
				loadMusic(Json.musicId);
			};
		};
	} else {
		musicSearchList.innerHTML = '很抱歉，暂时没有找到与“' + musicSearch.value + '”相关的结果';
	};
};

function jsonCallback(data) {
	musicKey = data.key;
};

function getUrlKey() {
	var oS = document.createElement('script');
	oS.src = 'http://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=0';
	document.body.appendChild(oS);
	document.body.removeChild(oS);
};
getUrlKey();

musicSearchBtn.onclick = function() {
	var value = musicSearch.value;
	musicSearchContent.className = 'open';
	var oS = document.createElement('script');
	oS.src = 'https://c.y.qq.com/soso/fcgi-bin/search_cp?remoteplace=txt.yqq.center&searchid=36089162846035037&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=10&w=' + value + '&g_tk=1667609335&jsonpCallback=getMusicData&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq';
	document.body.appendChild(oS);
	document.body.removeChild(oS);
};

closeSearch.onclick = function() {
	musicSearchContent.className = 'close';
	musicSearch.value = '';
	musicSearchList.innerHTML = '';
};

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

fn();

function fn() {
    var canvas = document.getElementById('spectrum'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, //频谱条宽度
        gap = 2, //频谱条间距
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 800 / (10 + 2), //频谱条数量
        capYPositionArray = []; //将上一画面各帽头的位置保存到这个数组
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.5, '#0f0');
    gradient.addColorStop(0, '#0f0');
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
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight); //则使用前一次保存的值来绘制帽头
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight); //否则使用当前值直接绘制
                capYPositionArray[i] = value;
            };
            //开始绘制频谱条
            ctx.fillStyle = gradient;
            ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
        }
        requestAnimationFrame(drawMeter);
    }
    requestAnimationFrame(drawMeter);
}