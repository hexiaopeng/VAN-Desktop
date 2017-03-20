/**
 * [DataTree description]  定义的数据构造函数
 */
function DataTree() {
	this.nodes = [{
			title: 'computer',
			class: 'folder',
			id: 0,
			pid: -1,
			child: [{
					title: 'music',
					class: 'folder',
					id: 2,
					pid: 0,
					child: [{
							title: 'Waiting for Love_Avicii_Waiting For Love',
							class: 'music',
							type: 'mp3',
							id: 5,
							pid: 2,
						},
						{
							title: 'Always Come Back To Your Love_Samantha Mumba_',
							class: 'music',
							type: 'mp3',
							id: 6,
							pid: 2,
						},
						{
							title: 'K歌之王_陈奕迅_打得火热',
							class: 'music',
							type: 'mp3',
							id: 7,
							pid: 2,
						},
						{
							title: 'Maps_Maroon 5Big Sean_',
							class: 'music',
							type: 'mp3',
							id: 8,
							pid: 2,
						},
						{
							title: 'See You Again_Wiz KhalifaCharlie Puth_',
							class: 'music',
							type: 'mp3',
							id: 9,
							pid: 2,
						},
						{
							title: '尘_金志文_尘',
							class: 'music',
							type: 'mp3',
							id: 10,
							pid: 2,
						},
						{
							title: '匆匆那年_王菲_匆匆那年',
							class: 'music',
							type: 'mp3',
							id: 11,
							pid: 2,
						},
						{
							title: '富士山下_陈奕迅_EASON MOVING ON STAGE 1',
							class: 'music',
							type: 'mp3',
							id: 12,
							pid: 2,
						},
						{
							title: '讲不出再见_谭咏麟_环球sacd天碟系列',
							class: 'music',
							type: 'mp3',
							id: 13,
							pid: 2,
						},
						{
							title: '慢慢_张学友_The Best of Jacky Cheung',
							class: 'music',
							type: 'mp3',
							id: 14,
							pid: 2,
						},
						{
							title: '美若黎明_李健_美若黎明',
							class: 'music',
							type: 'mp3',
							id: 15,
							pid: 2,
						},
						{
							title: '演员_薛之谦_绅士',
							class: 'music',
							type: 'mp3',
							id: 16,
							pid: 2,
						}
					]
				},
				{
					title: 'video',
					class: 'folder',
					id: 3,
					pid: 0,
					child:[
						{
							title:'【飞碟一分钟】一分钟告诉你别把早泄的锅扣在它头上',
							class:'video',
							type:'mp4',
							id:17,
							pid:3
						},
						{
							title:'【飞碟一分钟】一分钟告诉你全面两孩后，国人是否在奋力添丁',
							class:'video',
							type:'mp4',
							id:18,
							pid:3
						},
						{
							title:'【飞碟一分钟】一分钟告诉你我们为什么爱抖腿',
							class:'video',
							type:'mp4',
							id:19,
							pid:3
						},
						{
							title:'【飞碟一分钟】一分钟告诉你眼药水别乱用',
							class:'video',
							type:'mp4',
							id:20,
							pid:3
						},
						{
							title:'【飞碟一分钟】一分钟教女生夺回避孕主动权',
							class:'video',
							type:'mp4',
							id:21,
							pid:3
						},
						{
							title:'【飞碟一分钟】一分钟瞧瞧网约车新政到底帮了谁',
							class:'video',
							type:'mp4',
							id:22,
							pid:3
						},
						{
							title:'【飞碟一分钟】一分钟让办公室恋情不再尴尬',
							class:'video',
							type:'mp4',
							id:23,
							pid:3
						}
					]
				},
				{
					title: 'book',
					class: 'folder',
					id: 4,
					pid: 0,
					child:[
						{
							title:'《爸爸一家亲》作者：碧色微橘(晋江银牌推荐VIP2016-01-31完结)',
							class:'book',
							type:'txt',
							id:'24',
							pid:'4',
							name:'爸爸一家亲',
							author:'碧色微橘',
							updateTime:'2016-1-31',
							typeName:'现代都市',
							newChapter:'完结'
						}
					]
				}
			]
		},
		{
			title: 'recycleBin',
			class: 'folder',
			id: 1,
			pid: -1,
		}
	]
};
DataTree.prototype = {
	constructor:DataTree,
	/**
	 * [getFile description]  定义的获取数据中指定数据的方法
	 * @param  {[type]} arr [description]  传入需要查找的数组
	 * @param  {[type]} id  [description]  传入需要查找的数据id
	 * @return {[type]}     [description]  如果找到返回找的数据对象，没有则返回null
	 */
	getFile: function(arr,id) {
		for(var i=0; i<arr.length; i++){
			if(arr[i].id == id){
				return arr[i];
			};
			if(arr[i].class == 'folder' && arr[i].child){
				if(arguments.callee(arr[i].child,id)){
					return arguments.callee(arr[i].child,id)
				};
			};
		};
		return null;
	},
	/**
	 * [addFile description]  定义的插入数据方法
	 * @param  {[type]} parent [description]  传入需要插入的数据的父级
	 * @param  {[type]} obj    [description]  传入需要插入的数据对象
	 * @return {[tyoe]}        [description]  返回插入后的父级对象
	 */
	addFile:function(parent,obj){
		parent.child = parent.child || [];
		parent.child.push(obj);
		return parent;
	},
	/**
	 * [indexOf description]  定义的查找数组指定值的位置的方法
	 * @param  {[type]} arr   [description]  传入查找的数组
	 * @param  {[type]} value [description]  传入需要查找的值
	 * @return {[type]}       [description]  如果找到返回找到的位置下标，没有找到则返回-1
	 */
	indexOf:function(arr,value){
		for(var i=0; i<arr.length; i++){
			if(arr[i] === value){
				return i;
			};
		};
		return -1;
	},
	/**
	 * [removeFile description]  定义的移出数据中指定数据的方法
	 * @param  {[type]} obj [description]  传入需要移出的数据对象
	 * @return {[type]}     [description]  返回移出后的父级对象
	 */
	removeFile:function(obj){
		var parent = this.getParent(this.nodes,obj);
		parent.child = parent.child || [];
		var index = this.indexOf(parent.child,obj);
	 	if(index != -1){
			parent.child.splice(index,1);
		};
		return parent;
	},
	/**
	 * [getParent description]  定义的获取指定对象的父级的方法
	 * @param  {[type]} arr [description]  传入数据数组
	 * @param  {[type]} obj [description]  传入需要获取父级的对象
	 * @return {[type]}     [description]  返回找到的父级对象，如果没有则返回null
	 */
	getParent:function (arr,obj) {
		for(var i=0; i<arr.length; i++){
			if(arr[i].id == obj.pid){
				return arr[i];
			};
			if(arr[i].class == 'folder' && arr[i].child){
				if(arguments.callee(arr[i].child,obj)){
					return arguments.callee(arr[i].child,obj)
				};
			};
		};
		return null;
	},
	/**
	 * [getFileByClass description]  定义的获取指定类的数据方法
	 * @param  {[type]} data [description]  传入查找的数组
	 * @param  {[type]} cla  [description]  传入需要获取的class类
	 * @return {[type]}      [description]  返回找到数据的数组，没有找到则返回空数组
	 */
	getFileByClass:function (data,cla) {
		var arr = [];
		for(var i=0; i<data.length; i++){
			if(data[i].class == 'folder' && data[i].child){
				var result = arguments.callee(data[i].child,cla);
				if(result){
					for (var j = 0; j < result.length; j++) {
						arr.push(result[j]);
					};
				};
			};
			if(data[i].class == cla){
				arr.push(data[i]);
			};
		};
		return arr;
	}
};

var data = new DataTree();
