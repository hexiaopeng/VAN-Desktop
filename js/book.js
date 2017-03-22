function Book(){
    this.hash = location.hash.substring(1);
    this.num = 0;
}

Book.prototype = {
    constructor:Book,
    init:function(){
        if ($.getUrl(this.hash,'t') == 'local') {
            this.local();
        } else if ($.getUrl(this.hash,'t') == 'search' || $.getUrl(this.hash,'t') == 'online') {

        };
        $.getEle('#nav_catalogue').addEventListener('click',function(){
            var _this = this;
            $.move($.getEle('.nav'),{left: this.onOff ? -200 : 0}, '500','easeOut',function(){
                $.move($.getEle('#nav_list'),{left: _this.onOff ? -242 : 0},'200','easeOut');
                _this.onOff = !_this.onOff;
            });
            $.getEle('.content').onOff = true;
        });
        for (var i = 0; i < $.getEle('#nav_list dt').length; i++) {
            $.getEle('#nav_list dt')[i].addEventListener('click',function(){
                var H = document.documentElement.clientHeight;
                this.nextElementSibling.style.height = H - 66 + 'px';
                $.getEle('.nav_catalog_list').style.height = H - 66 - 43 + 'px';
                $.move(this.nextElementSibling,{marginLeft: 0},'500','easeOut')
            })
        };
        for (var i = 0; i < $.getEle('.nav_list_back').length; i++) {
            $.getEle('.nav_list_back')[i].addEventListener('click',function(){
                $.move(this.parentNode.parentNode,{marginLeft: -242},'500','easeOut')
            })
        };
        $.getEle('.content').addEventListener('click',function(){
            if (this.onOff) {
                $.move($.getEle('.nav'),{left: -200 }, '500','easeOut',function(){
                    $.move($.getEle('#nav_list'),{left: -242},'200','easeOut');
                    $.getEle('#nav_catalogue').onOff = !$.getEle('#nav_catalogue').onOff;
                });
                this.onOff = false;
            }
        })
    },
    local:function(){
        var _this = this;
        var bookId = $.getUrl(this.hash,'bookId');
        var cid = $.getUrl(this.hash,'cid');
        var obj = data.getFile(data.nodes,Number(bookId));
        $.ajax({
            url:'book/' + obj.title + '.txt',
            success:function(data){
                _this.data = {
                    id:obj.id,
                    data:$.parseTxt(data)
                };
                $.getEle('.content').innerHTML = template('booktemp',_this.data.data[cid]);
                _this.addCatalog(_this.data.data)
            }
        })
    },
    addCatalog:function(data){
        var _this = this;
        var html = '';
        for(var i=0; i<data.length; i++){
            html += '<li data-cid="' + data[i].cid + '">' + data[i].name + '</li>';
        };
        $.getEle('.nav_catalog_list').innerHTML = html;
        var lis = $.getEle('.nav_catalog_list li');
        for (var i = 0; i < lis.length; i++) {
            lis[i].addEventListener('click',function(){
                var hash = location.hash.substring(1);
                location.hash = 't=' + $.getUrl(hash,'t') + '&bookId=' + $.getUrl(hash,'bookId') + '&cid=' + this.dataset.cid;
            })
        }
    }
}

var book = new Book();
book.init();
