function BookHome(){
    this.hash = window.location.hash.substring(1);
    location.hash = $.getUrl(this.hash,'t') || 't=local'
    this.source = $.getUrl(this.hash,'t');
    this.isOpen = false;
}

BookHome.prototype = {
    constructor: BookHome,
    init:function(){
        var _this = this;
        if (this.source == 'search') {
            this.searchBook();
        }else if (this.source == 'online') {
            this.online();
        }else if (this.source == 'local') {
            this.local();
        }else {

        };
        this.addTypeList();
        $.getEle('.online').addEventListener('click',function(ev){
            _this.ripple(this,ev);
            _this.openList(this);
        });
        $.getEle('.lately').addEventListener('click',function(ev){
            _this.ripple(this,ev);
        });
        $.getEle('.local').addEventListener('click',function(ev){
            _this.ripple(this,ev);
            location.hash = 't=local&page=1';
        });
        $.getEle('.search').addEventListener('click',function(ev){
            location.hash = 't=search&keyword=' + $.getEle.call($.getEle('.nav_search'),'input').value;
        });

        window.onhashchange = function(){
            _this.source = $.getUrl(location.hash,'t') || 'local';
            _this.hash = window.location.hash.substring(1);
            if (_this.source == 'search') {
                $.getEle('#BookLoad').style.display = 'block';
                _this.searchBook();
            }else if (_this.source == 'online') {
                $.getEle('#BookLoad').style.display = 'block';
                _this.online();
            }else if (_this.source == 'local') {
                $.getEle('#BookLoad').style.display = 'block';
                _this.local();
            }else {

            };
        }
    },
    local:function(){
        var _this = this;
        this.con = $.getUrl(this.hash,'c') || 'list';
        var page = null;
        var num = null;
        if (this.con == 'list') {
            page = Number($.getUrl(this.hash,'page')) || 1;
            $.getEle('#BookLoad').style.display = 'none';
            this.data = {
                data:data.getFileByClass(data.nodes, 'book').slice((page-1)*20,page*20)
            };
            $.getEle('.BookList').innerHTML = template('listTemp',this.data);
            _this.inChapter();
        } else if(this.con == 'chapter'){
            num = Number($.getUrl(this.hash,'catalog')) || 24;
            var obj = data.getFile(data.nodes,num)
            $.ajax({
                url:'book/' + obj.title + '.txt',
                success:function(data){
                    $.getEle('#BookLoad').style.display = 'none';
                    _this.data = {
                        id:obj.id,
                        name:obj.name,
                        author:obj.author,
                        updateTime:obj.updateTime,
                        typeName:obj.typeName,
                        data:$.parseTxt(data)
                    };
                    $.getEle('.BookList').innerHTML = template('chapterTemp',_this.data);
                    _this.inContent();
                }
            })
        }
    },
    searchBook:function(){
        var _this = this;
        this.con = $.getUrl(this.hash,'c') || 'list';
        var keyword = null;
        var page = null;
        var num = null;
        if (this.con == 'list') {
            page = Number($.getUrl(this.hash,'page')) || 1;
            keyword = $.getUrl(this.hash,'keyword') || '';
            $.ajax({
                url:'http://route.showapi.com/211-2',
                data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&keyword='+ keyword + '&page=' + page,
                success:function(data){
                    $.getEle('#BookLoad').style.display = 'none';
                    _this.data = {
                        data:JSON.parse(data).showapi_res_body.pagebean.contentlist
                    }
                    $.getEle('.BookList').innerHTML = template('listTemp',_this.data);
                    _this.inChapter();
                }
            })
        } else if(this.con == 'chapter'){
            num = Number($.getUrl(this.hash,'catalog'));
            $.ajax({
                url:'http://route.showapi.com/211-1',
                data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&bookId='+ num,
                success:function(data){
                    $.getEle('#BookLoad').style.display = 'none';
                    var obj = JSON.parse(data);
                    if (obj.showapi_res_body.ret_code != 0) {
                        $.getEle('.BookList').innerHTML = '没有找到您要的小说';
                    } else {
                        _this.data = {
                            id:obj.showapi_res_body.book.id,
                            name:obj.showapi_res_body.book.name,
                            author:obj.showapi_res_body.book.author,
                            updateTime:obj.showapi_res_body.book.updateTime,
                            typeName:obj.showapi_res_body.book.typeName,
                            data:obj.showapi_res_body.book.chapterList.sort(function(a,b){
                                return a.cid - b.cid;
                            })
                        }
                        $.getEle('.BookList').innerHTML = template('chapterTemp',_this.data);
                        _this.inContent();
                    }
                }
            })
        }
    },
    online:function(){
        var _this = this;
        this.con = $.getUrl(this.hash,'c') || 'list';
        var typeId = null;
        var num = null;
        if (this.con == 'list') {
            page = Number($.getUrl(this.hash,'page')) || 1;
            typeId = Number($.getUrl(this.hash,'typeId')) || 1;
            $.ajax({
                url:'http://route.showapi.com/211-2',
                data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&typeId='+ typeId + '&page=' + page,
                success:function(data){
                    $.getEle('#BookLoad').style.display = 'none';
                    _this.data = {
                        data:JSON.parse(data).showapi_res_body.pagebean.contentlist
                    }
                    $.getEle('.BookList').innerHTML = template('listTemp',_this.data);
                    _this.inChapter();
                }
            })
        } else if(this.con == 'chapter'){
            num = Number($.getUrl(this.hash,'catalog'));
            $.ajax({
                url:'http://route.showapi.com/211-1',
                data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&bookId='+ num,
                success:function(data){
                    $.getEle('#BookLoad').style.display = 'none';
                    var obj = JSON.parse(data);
                    if (obj.showapi_res_body.ret_code != 0) {
                        $.getEle('.BookList').innerHTML = '没有找到您要的小说';
                    } else {
                        _this.data = {
                            id:obj.showapi_res_body.book.id,
                            author:obj.showapi_res_body.book.author,
                            newChapter:obj.showapi_res_body.book.newChapter,
                            name:obj.showapi_res_body.book.name,
                            author:obj.showapi_res_body.book.author,
                            updateTime:obj.showapi_res_body.book.updateTime,
                            typeName:obj.showapi_res_body.book.typeName,
                            data:obj.showapi_res_body.book.chapterList.sort(function(a,b){
                                return a.cid - b.cid;
                            })
                        }
                        $.getEle('.BookList').innerHTML = template('chapterTemp',_this.data);
                        _this.inContent();
                    }
                }
            })
        }
    },
    addTypeList:function(){
        var _this = this;
        $.ajax({
            url:'http://route.showapi.com/211-3',
            data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93',
            success:function(data){
                var arr = JSON.parse(data).showapi_res_body.typeList;
                var html = '';
                for (var i = 0; i < arr.length; i++) {
                    html += '<li data-type="'+arr[i].id+'">'
                    +           '<a href="javascript:;">'
                    +               arr[i].name
                    +               '<span class="ink"></span>'
                    +           '</a>'
                    +           '</li>'
                }
                $.getEle('.search_list').innerHTML = html;
                _this.lists = $.getEle('.search_list li');
                for (var i = 0; i < _this.lists.length; i++) {
                    _this.lists[i].addEventListener('click',function(ev){
                        for (var i = 0; i < _this.lists.length; i++) {
                            $.removeClass(_this.lists[i],'active')
                        }
                        $.addClass(this,'active');
                        location.hash = 't=online&typeId=' + this.dataset.type;
                        event.stopPropagation();
                    });
                }
            }
        })
    },
    ripple:function(That,ev){
        var span = $.getEle.call(That,'span')[0] || $.getEle.call(That,'span');
        if(span){
            span.className = 'ink';
            span.style.width = That.offsetWidth + 'px';
            span.style.height = That.offsetWidth + 'px';
            span.style.top = ev.pageY - That.getBoundingClientRect().top - That.offsetWidth / 2 + 'px';
            span.style.left = ev.pageX - That.getBoundingClientRect().left - That.offsetWidth / 2 + 'px';
            span.className = 'ink animate-ink';
        }
    },
    openList:function(That){
        var ul = $.getEle.call(That,'ul');
        var icon = $.getEle.call(That,'.more');
        if (ul) {
            if (this.isOpen) {
                $.move(ul, {height: 0}, 300, 'easeOut');
                $.removeClass(icon,'moreClick');
                this.isOpen = false;
            }else{
                $.move(ul, {height: 48 * this.lists.length}, 300, 'easeOut');
                $.addClass(icon,'moreClick');
                this.isOpen = true;
            }
        }
    },
    inChapter:function(){
        var lis = $.getEle('.BookList_item');
        this.hash = window.location.hash.substring(1);
        var _this = this;
        for (var i = 0; i < lis.length; i++) {
            lis[i].addEventListener('click',function(ev){
                location.hash = 't=' + $.getUrl(_this.hash,'t') + '&c=chapter&catalog=' + this.dataset.id;
            })
        }
    },
    inContent:function(){
        var catalog = $.getEle('.catalog');
        var chapterItems = $.getEle('.chapter_item');
        var _this = this;
        for (var i = 0; i < chapterItems.length; i++) {
            chapterItems[i].addEventListener('click',function(){
                var t = $.getUrl(location.hash.substring(1),'t');
                window.open('book.html#t=' + t + '&bookId=' + catalog.dataset.id + '&cid=' + this.dataset.cid,'_self');
            })
        }
    }

}
var bookHome = new BookHome();
bookHome.init();
