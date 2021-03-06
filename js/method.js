function Method(){
}

Method.prototype = {
	constructor:Method,
	/**
	 * [ajax description]定义的ajax方法
	 * @param  {[type]} obj [description]
	 *                      传入参数：
	 *                      			type请求类型，
	 *                      			url请求地址，
	 *                      			data请求数据，
	 *                      			success成功函数，
	 *                      			fail失败函数
	 */
	ajax:function (obj){
		var jsonObj = {
			type:'get',
			url:this.url,
			data:'',
			success:function(text){},
			fail:function(){
				alert('出错啦，Err:' + xhr.status);
			}
		};

		for (var k in obj) {
			jsonObj[k] = obj[k];
		}

		var xhr = null;
		try{
			xhr = new XMLHttpRequest();
		}catch(e){
			xhr = new ActiveXObject('Micrsoft.XMLHTTP');
		}

		if (jsonObj.type == 'get') {
			jsonObj.url += '?' + jsonObj.data;
		}

		xhr.open(jsonObj.type,jsonObj.url,true);

		if (jsonObj.type == 'get') {
			xhr.send();
		} else{
			xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
			xhr.send(jsonObj.data);
		}

		xhr.onreadystatechange = function(){

			if(xhr.readyState == 4){
				if (xhr.status == 200) {
					jsonObj.success && jsonObj.success(xhr.responseText);
				}else{
					jsonObj.fail && jsonObj.fail(xhr.responseText);
				}
			}
		};
	},
	/**
	 * [parseLyric description]  定义的歌词解析方法
	 * @param  {[type]} lrc [description]  传入需要解析的歌词字符串
	 * @return {[type]}     [description]  返回解析成功的歌词数组
	 */
	parseLyric:function (lrc){
		var lyrics = lrc.split('\n');
		var lrcArr = [];
		for (var i=0; i<lyrics.length; i++) {
			var lrcObj = {};
			lrcObj.id = i;
			var lyric = lyrics[i];
			var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
			var timeArr = lyric.match(timeReg);
			if (!timeArr) {
				continue;
			}
			lrcObj.clause = lyric.replace(timeReg,'');
			for (var k=0; k<timeArr.length; k++) {
				var t = timeArr[k];
				var m = Number(String(t.match(/\[\d*/i)).slice(1)),
					s = Number(String(t.match(/\:\d*/i)).slice(1));
				lrcObj.time = m * 60 + s;
			}
			lrcArr.push(lrcObj);
		}
		return lrcArr;
	},
	/**
	 * [isDOM description]  定义的查看对象是否为DOM对象的方法
	 * @param  {[type]}  obj [description]  传入要查看的对象
	 * @return {Boolean}     [description]  返回布尔值
	 */
	isDOM:function(obj){
		return ( typeof HTMLElement === 'object' )? obj instanceof HTMLElement:obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
	},
	/**
	 * [getEle description]  定义的获取DOM元素的方法
	 * @param  {[type]} str [description] 传入获取元素的选择器字符串，支				持ID,CLASS,TAGNAME
	 * @return {[type]}     [description]
	 */
	getEle:function(str) {
        var parent;
        if (!$.isDOM(this)) {
            parent = document;
        }else {
            parent = this;
        }
        var resule = [];
        var reg = new RegExp('\\S+');
        if (reg.test(str)) {
            var i = str.search(reg);
            var w = str.match(reg)[0];
        }else {
            return;
        }
        var str1 = str.substring(i+w.length);
        var aEle = parent.getElementsByTagName('*');
        if (w.charAt(0) == '#') {
            var a = document.getElementById(w.substring(1));
            if (reg.test(str1)) {
                var nextResule = $.getEle.call(a,str1);
                if (nextResule.length != 0) {
                    for (var j = 0; j < nextResule.length; j++) {
                        resule.push(nextResule[j]);
                    }
                }
            } else {
                resule.push(a);
            }
        }else if (w.charAt(0) == '.') {
            var sclass = w.substring(1);
            var Reg = new RegExp('\\b' + sclass + '\\b')
            for (var i = 0; i < aEle.length; i++) {
                if (Reg.test(aEle[i].className)) {
                    if (reg.test(str1)) {
                        var nextResule = $.getEle.call(aEle[i],str1);
                        if (nextResule.length != 0) {
                            for (var j = 0; j < nextResule.length; j++) {
                                resule.push(nextResule[j]);
                            }
                        }
                    } else {
                        resule.push(aEle[i]);
                    }
                }
            }
        }else {
            var tag = parent.getElementsByTagName(w);
            for (var i = 0; i < tag.length; i++) {
                if (reg.test(str1)) {
                    var nextResule = $.getEle.call(tag[i],str1);
                    if (nextResule.length != 0) {
                        for (var j = 0; j < nextResule.length; j++) {
                            resule.push(nextResule[j]);
                        }
                    }
                } else {
                    resule.push(tag[i]);
                }
            }
        }
        if (resule.length == 0) {
        	return null;
        } else if(resule.length == 1){
        	return resule[0];
        }else{
			return resule;
		}
    },
	/**
	 * [getUrl description]  定义的解析url参数的方法
	 * @param  {[type]} str  [description]  传入要解析的url字符串
	 * @param  {[type]} para [description]  传入要解析的参数字符串
	 * @return {[type]}      [description]  返回解析到的参数值，如果没有返回空
	 */
	getUrl:function(str,para){
		var reg = new RegExp(para + '=[^&]*');
		return str.match(reg)?str.match(reg)[0].split('=')[1]:null;
	},
	/**
	 * [JsonP description]  定义的JSONP跨域方法
	 * @param {[type]} obj [description]  传入参数对象
	 */
	JsonP:function(obj){
		var opt = {
			url: obj.url || '',
			data:obj.data || {},
			success:obj.success || function(){},
			callback:obj.callback || 'callback',
			error:obj.error || function(){},
			timeout: obj.timeout || 0
		}
		var arr = [];
		var callbackName = 'callback' + new Date().getTime();
		opt.data[opt.callback] = callbackName;
		var urlArr = opt.url.split("?")
		var paraArr = urlArr[1] ? urlArr[1].split('&') : [];
		for (var i = 0; i < paraArr.length; i++) {
			opt.data[paraArr[i].split('=')[0]] = paraArr[i].split('=')[1];
		};
		for(var attr in opt.data){
			arr.push(attr +'='+ encodeURI(opt.data[attr]));
		}
		opt.data = arr.join('&');
		window[callbackName] = function(data){
			opt.success(data);
			Script.loaded = true;
		}
		var Script = document.createElement('script');
		Script.src = urlArr[0] + '?' + opt.data;
		Script.loaded = false;
		document.getElementsByTagName('head')[0].appendChild(Script);
		document.getElementsByTagName('head')[0].removeChild(Script);
		var supportLoad = "onload" in Script;
		var onEvent = supportLoad ? "onload" : "onreadystatechange";
		Script[onEvent] = function() {
			if(Script.readyState && Script.readyState !="loaded"){
	            return;
	        }
	        if(Script.readyState == 'loaded' && Script.loaded == false){
	            Script.onerror();
	            return;
	        }
	        Script = Script[onEvent] = Script.onerror = window[callbackName] = null;
		};
		Script.onerror = function(){
	        if(window[callbackName] == null){
	            console.log("请求超时，请重试！");
	        }
	        opt.error();//如果有专门的error方法的话，就调用。
	        Script = Script[onEvent] = Script.onerror = window[callbackName] = null;
	    }

		if(opt.timeout!= 0){
	        setTimeout(function() {
	            if(Script && Script.loaded == false){
	                window[callbackName] = null;//超时，且未加载结束，注销函数
	                Script.onerror();
	            }
	        }, opt.timeout);
	    }
	},
	parseTxt:function(str){
		var resule = [];
		var arr = str.match(/[^\u2606]+/g);
		for (var i = 0; i < arr.length; i++) {
			var  secArr = arr[i].match(/[^\n]+/g);
			var secObj = {
				cid : i,
				name:secArr[0],
				content:[]
			};
			for (var j = 1; j < secArr.length; j++) {
				secObj.content.push(secArr[j]);
			};
			resule.push(secObj);
		};
		return resule;
	},
	/**
	 * [arrIndexOf description]  定义的查找数组指定值位置的方法
	 * @param  {[type]} arr [description]  传入需要查找的数组
	 * @param  {[type]} v   [description]  传入需要查找的值
	 * @return {[type]}     [description]  返回查找值在数组中的位置下标，如果没有找到则返回-1
	 */
	arrIndexOf:function (arr, v) {
		for (var i=0; i<arr.length; i++) {
			if (arr[i] == v) {
				return i;
			}
		}
		return -1;
	},
	/**
	 * [addClass description]  定义的给指定元素对象添加类名的方法
	 * @param {[type]} obj       [description]  传入需要添加类名的元素对象
	 * @param {[type]} className [description]  传入需要添加的类名
	 */
	addClass:function (obj, className) {
		if (obj.className == ''){
			obj.className = className;
		} else {
			var arrClassName = obj.className.split(' ');
			if ( this.arrIndexOf(arrClassName, className) == -1 ) {
				obj.className += ' ' + className;
			}
		}
	},
	/**
	 * [removeClass description]  定义的给指定元素对象移出类名的方法
	 * @param  {[type]} obj       [description]  传入需要移出类名的对象
	 * @param  {[type]} className [description]  传入需要移出的类名
	 */
	removeClass:function (obj, className) {
		if (obj.className != '') {
			var arrClassName = obj.className.split(' ');
			var _index = this.arrIndexOf(arrClassName, className);
			if ( _index != -1 ) {
				arrClassName.splice(_index, 1);
				obj.className = arrClassName.join(' ');
			}
		}
	},
	/**
	 * [inspectClass description]  定义的检测指定元素对象是否包含指定类名的方法
	 * @param  {[type]} obj       [description]  传入需要检测的元素对象
	 * @param  {[type]} className [description]  传入需要检测的类名
	 * @return {[type]}           [description]  如果检测到指定类名返回true，如果检测没有指定类名返回false
	 */
	inspectClass:function (obj, className) {
		if (obj.className != '') {
			var arrClassName = obj.className.split(' ');
			var _index = this.arrIndexOf(arrClassName, className);
			if ( _index != -1 ) {
				return true;
			}else{
				return false;
			}
		}
	},
	/**
	 * [drag description]  定义的拖拽方法
	 * @param  {[type]} obj    [description]  传入被拖拽的元素对象
	 * @param  {[type]} downFn [description]  传入鼠标按下执行的函数
	 * @param  {[type]} moveFn [description]  传入鼠标移动执行的函数
	 * @param  {[type]} upFn   [description]  传入鼠标抬起执行的函数
	 * @param  {[type]} This   [description]  传入调用的this对象
	 */
	drag:function(obj,downFn,moveFn,upFn,This){
		obj.onmousedown = function(ev){
			downFn(ev,This);
			document.onmousemove = function(ev){
				moveFn(ev,This);
			};
			document.onmouseup = function(ev){
				upFn(ev,This);
			};
			return false;
		}
	},
	/**
	 * [addZero description]  定义的为数字补零的方法
	 * @param  {[type]} num [description]  传入需要补零的数字
	 * @return {[type]}     [description]  如果传入数字小于10则返回补0的字符串，否则返回传入数字的字符串
	 */
	addZero:function (num){
		return num<10?'0'+num:''+num;
	},
	/**
	 * [getTime description]  定义的秒转为分秒格式的方法
	 * @param  {[type]} num [description]  传入指定数字
	 * @return {[type]}     [description]		返回传入数字转为分秒格式的字符串
	 */
	getTime:function (num){
		var str = '';
		var iM = Math.floor(num/60);
		var iS = Math.floor(num%60);
		str = this.addZero(iM) + ':' + this.addZero(iS);
		return str;
	},
	/**
	 * [getOffsetToBody description]  定义的获取指定元素到body的偏移值的方法
	 * @param {[type]} obj  [description]  传入需要获取的元素对象
	 * @param {[type]} attr [description]  传入需要获取的偏移值：offsetLeft | offsetTop
	 */
	getOffsetToBody:function (obj,attr){
		if (obj == document.body || obj == null) {
			return 0;
		}
		return arguments.callee(obj.offsetParent,attr) + obj[attr];
	},
	/**
	 * [move description]  定义的运动方法
	 * @param  {[type]} obj      [description]  传入需要运动的元素对象
	 * @param  {[type]} attrs    [description]  传入需要运动的属性对象：{属性名：属性值}
	 * @param  {[type]} duration [description]  传入运动持续的时间
	 * @param  {[type]} fx       [description]  传入运动的效果
	 * @param  {[type]} endFn    [description]  传入回调函数
	 */
	move:function (obj,attrs,duration,fx,endFn){
		clearInterval(obj.time)
		var j = {};
		var _this = this;
		for(var attr in attrs){
			j[attr] = {};
			j[attr].b = parseFloat(getComputedStyle(obj)[attr]);
			j[attr].c = attrs[attr] - j[attr].b;
		}
		var d = duration;
		var newTime = new Date().getTime();
		obj.time = setInterval(function(){
			var t = new Date().getTime() - newTime;
			if(t >= d){
				t = d;
			}
			for(var attr in j){
				var b = j[attr].b;
				var c = j[attr].c;
				var v = _this.Tween[fx](t, b, c, d);
				if(attr == 'opacity'){
					obj.style[attr] = v;
				}else{
					obj.style[attr] = v +'px';
				}
			}
			if(t == d){
				clearInterval(obj.time);
				endFn && endFn();
			}
		},20);
	},
	/**
	 * [Tween description]  定义的运动效果函数
	 * @type {Object}
	 */
	Tween:{
		linear: function (t, b, c, d){  //匀速
			return c*t/d + b;
		},
		easeIn: function(t, b, c, d){  //加速曲线
			return c*(t/=d)*t + b;
		},
		easeOut: function(t, b, c, d){  //减速曲线
			return -c *(t/=d)*(t-2) + b;
		},
		easeBoth: function(t, b, c, d){  //加速减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t + b;
			}
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInStrong: function(t, b, c, d){  //加加速曲线
			return c*(t/=d)*t*t*t + b;
		},
		easeOutStrong: function(t, b, c, d){  //减减速曲线
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
			if ((t/=d/2) < 1) {
				return c/2*t*t*t*t + b;
			}
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
			if (t === 0) {
				return b;
			}
			if ( (t /= d) == 1 ) {
				return b+c;
			}
			if (!p) {
				p=d*0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p/4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
			if (t === 0) {
				return b;
			}
			if ( (t /= d) == 1 ) {
				return b+c;
			}
			if (!p) {
				p=d*0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},
		elasticBoth: function(t, b, c, d, a, p){
			if (t === 0) {
				return b;
			}
			if ( (t /= d/2) == 2 ) {
				return b+c;
			}
			if (!p) {
				p = d*(0.3*1.5);
			}
			if ( !a || a < Math.abs(c) ) {
				a = c;
				var s = p/4;
			}
			else {
				var s = p/(2*Math.PI) * Math.asin (c/a);
			}
			if (t < 1) {
				return - 0.5*(a*Math.pow(2,10*(t-=1)) *
				Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			}
			return a*Math.pow(2,-10*(t-=1)) *
			Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
		},
		backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 3.70158;  //回缩的距离
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		backBoth: function(t, b, c, d, s){
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			if ((t /= d/2 ) < 1) {
				return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			}
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
			return c - Tween['bounceOut'](d-t, 0, c, d) + b;
		},
		bounceOut: function(t, b, c, d){
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
			}
			return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
		},
		bounceBoth: function(t, b, c, d){
			if (t < d/2) {
				return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
			}
			return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
		}
	}
};

var $ = new Method();
