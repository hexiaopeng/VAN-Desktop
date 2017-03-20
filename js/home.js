function BookHome(){
    this.search = window.location.search.substring(1);
    this.hash = window.location.hash.substring(1);
    this.source = $.getUrl(this.search,'t') || 'local';
    this.isOpen = $.getUrl(this.hash,'o') == 1 ? true : false;
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
        // $.getEle('.bg').onclick = function(ev){
        //     _this.ripple(this,ev)
        // }
        console.log($.getEle('.online'));
        $.getEle('.online').addEventListener('click',function(){
            _this.openList(this);
        })

    },
    local:function(){
        var _this = this;
        this.con = $.getUrl(this.hash,'c') || 'list';
        var page = null;
        var num = null;
        if (this.con == 'list') {
            page = Number($.getUrl(this.hash,'page')) || 1;
            this.data = {
                data:data.getFileByClass(data.nodes, 'book').slice((page-1)*20,page*20)
            };
            $.getEle('.BookList').innerHTML = template('listTemp',this.data);
        } else if(this.con == 'chapter'){
            num = Number($.getUrl(this.hash,'catalog')) || 24;
            var obj = data.getFile(data.nodes,num)
            $.ajax({
                url:'book/' + obj.title + '.txt',
                success:function(data){
                    _this.data = {
                        name:obj.name,
                        author:obj.author,
                        updateTime:obj.updateTime,
                        typeName:obj.typeName,
                        data:$.parseTxt(data)
                    };
                    $.getEle('.BookList').innerHTML = template('chapterTemp',_this.data);
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
                    _this.data = {
                        data:JSON.parse(data).showapi_res_body.pagebean.contentlist
                    }
                    $.getEle('.BookList').innerHTML = template('listTemp',_this.data);
                }
            })
        } else if(this.con == 'chapter'){
            num = Number($.getUrl(this.hash,'catalog'));
            $.ajax({
                url:'http://route.showapi.com/211-1',
                data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&bookId='+ num,
                success:function(data){
                    var obj = JSON.parse(data);
                    if (obj.showapi_res_body.ret_code != 0) {
                        $.getEle('.BookList').innerHTML = '没有找到您要的小说';
                    } else {
                        _this.data = {
                            name:obj.showapi_res_body.book.name,
                            author:obj.showapi_res_body.book.author,
                            updateTime:obj.showapi_res_body.book.updateTime,
                            typeName:obj.showapi_res_body.book.typeName,
                            data:obj.showapi_res_body.book.chapterList
                        }
                        $.getEle('.BookList').innerHTML = template('chapterTemp',_this.data);
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
                    _this.data = {
                        data:JSON.parse(data).showapi_res_body.pagebean.contentlist
                    }
                    $.getEle('.BookList').innerHTML = template('listTemp',_this.data);
                }
            })
        } else if(this.con == 'chapter'){
            num = Number($.getUrl(this.hash,'catalog'));
            $.ajax({
                url:'http://route.showapi.com/211-1',
                data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&bookId='+ num,
                success:function(data){
                    var obj = JSON.parse(data);
                    if (obj.showapi_res_body.ret_code != 0) {
                        $.getEle('.BookList').innerHTML = '没有找到您要的小说';
                    } else {
                        _this.data = {
                            name:obj.showapi_res_body.book.name,
                            author:obj.showapi_res_body.book.author,
                            updateTime:obj.showapi_res_body.book.updateTime,
                            typeName:obj.showapi_res_body.book.typeName,
                            data:obj.showapi_res_body.book.chapterList
                        }
                        $.getEle('.BookList').innerHTML = template('chapterTemp',_this.data);
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
                    html += '<li>'
                    +           '<a data-type="'+arr[i].id+'" href="javascript:;">'
                    +               arr[i].name
                    +               '<span class="ink"></span>'
                    +           '</a>'
                    +           '</li>'
                }
                $.getEle('.search_list').innerHTML = html;
                _this.lists = $.getEle('.search_list li');
            }
        })
    },
    ripple:function(That,ev){
        var span = $.getEle.call(That,'span');
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
            if (this.onOff) {
                $.move(ul, {height: 0}, 300, 'easeOut');
                $.removeClass(icon,'moreClick');
                this.onOff = false;
            }else{
                $.move(ul, {height: 48 * this.lists.length}, 300, 'easeOut');
                $.addClass(icon,'moreClick');
                this.onOff = true;
            }
        }
    }

}
var bookHome = new BookHome();
bookHome.init();
