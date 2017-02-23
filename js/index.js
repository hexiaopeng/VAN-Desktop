//var start =

function Start(){
	this.obj = document.getElementById('open_system');
	this.font = this.obj.getElementsByTagName('span');
	this.fullSureenAgree = this.obj.getElementsByClassName('full_screen_agree')
	this.fullSureenCancle = this.obj.getElementsByClassName('full_screen_cancle')

	this.init();

};
Start.prototype = {
	init:function(){
		this.autoPrompt();
	},

	autoPrompt:function(){
		var num = 0;
		var _this = this;
		var timer = setInterval(function(){
			_this.font[num].className = 'active';
			num++;
			if (num >= _this.font.length) {
				clearInterval(timer);
			};
		},300);
	},

	showBtn:function(){

	},

	fullScreen:function(element){
		if (element.requestFullscreen) {
			element.requestFullscreen();
		}else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		}else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		};
	},

};

var start = new Start();
