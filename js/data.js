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
							title: 'Always Come Back To Your Love_Samantha Mumba_',
							class: 'music',
							type: 'mp3',
							id: 5,
							pid: 2,
						},
						{
							title: 'K歌之王_陈奕迅_打得火热',
							class: 'music',
							type: 'mp3',
							id: 6,
							pid: 2,
						},
						{
							title: 'Maps_Maroon 5Big Sean_',
							class: 'music',
							type: 'mp3',
							id: 7,
							pid: 2,
						},
						{
							title: 'See You Again_Wiz KhalifaCharlie Puth_',
							class: 'music',
							type: 'mp3',
							id: 8,
							pid: 2,
						},
						{
							title: 'Waiting for Love_Avicii_Waiting For Love',
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
				},
				{
					title: 'book',
					class: 'folder',
					id: 4,
					pid: 0,
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
	getfile: function(arr,id) {
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
	addfile:function(parent,obj){
		parent.child = parent.child || [];
		parent.child.push(obj);
		return parent;
	},
	indexOf:function(arr,value){
		for(var i=0; i<arr.length; i++){
			if(arr[i] === value){
				return i;
			};
		};
		return -1;
	},
	removefile:function(parent,obj){
		parent.child = parent.child || [];
		var index = this.index(parent.child,obj);
		if(index){
			parent.child.splice(index,1);
		};
		return parent;
	}
};

var data = new DataTree();
//data.getfile(data.nodes,1)
//console.log(data.nodes.length)
console.log(data.getfile(data.nodes,16))

