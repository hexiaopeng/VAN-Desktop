function Book(){
    this.hash = location.hash.substring(1);
    this.num = 0;
    this.a = 0;
}

Book.prototype = {
    constructor:Book,
    init:function(){
        var _this = this;
        this.judgeHash();
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
        });
        $.getEle('.font_family').addEventListener('click',function(e){
            if (this.onOff) {
                $.getEle('#icon_detail_4').style.display = 'none';
                $.move($.getEle('#icon_detail_4'),{opacity : 0},'200','easeOut');
            }else {
                $.getEle('#icon_detail').style.display = 'none';
                $.getEle('#icon_detail_2').style.display = 'none';
                $.getEle('#icon_detail_3').style.display = 'none';
                $.getEle('#icon_detail_4').style.display = 'block';
                $.move($.getEle('#icon_detail_4'),{opacity : 1},'200','easeOut');
            }
            this.onOff = !this.onOff;
            _this.noBubble(e);
        });
        $.getEle('.icon-bg').addEventListener('click',function(e){
            if (this.onOff) {
                $.getEle('#icon_detail').style.display = 'none';
                $.move($.getEle('#icon_detail'),{opacity : 0},'200','easeOut');
            }else {
                $.getEle('#icon_detail').style.display = 'block';
                $.getEle('#icon_detail_2').style.display = 'none';
                $.getEle('#icon_detail_3').style.display = 'none';
                $.getEle('#icon_detail_4').style.display = 'none';
                $.move($.getEle('#icon_detail'),{opacity : 1},'200','easeOut');
            }
            this.onOff = !this.onOff;
            _this.noBubble(e);
        });
        $.getEle('.icon-text').addEventListener('click',function(e){
            if (this.onOff) {
                $.getEle('#icon_detail_2').style.display = 'none';
                $.move($.getEle('#icon_detail_2'),{opacity : 0},'200','easeOut');
            }else {
                $.getEle('#icon_detail').style.display = 'none';
                $.getEle('#icon_detail_2').style.display = 'block';
                $.getEle('#icon_detail_3').style.display = 'none';
                $.getEle('#icon_detail_4').style.display = 'none';
                $.move($.getEle('#icon_detail_2'),{opacity : 1},'200','easeOut');
            }
            this.onOff = !this.onOff;
            _this.noBubble(e);
        });
        $.getEle('.icon-width').addEventListener('click',function(e){
            if (this.onOff) {
                $.getEle('#icon_detail_3').style.display = 'none';
                $.move($.getEle('#icon_detail_3'),{opacity : 0},'200','easeOut');
            }else {
                $.getEle('#icon_detail').style.display = 'none';
                $.getEle('#icon_detail_2').style.display = 'none';
                $.getEle('#icon_detail_3').style.display = 'block';
                $.getEle('#icon_detail_4').style.display = 'none';
                $.move($.getEle('#icon_detail_3'),{opacity : 1},'200','easeOut');
            }
            this.onOff = !this.onOff;
            _this.noBubble(e);
        });
        this.changeFont();
        this.changeBg();
        this.changeFontSize();
        this.changeWidth();
        document.addEventListener('click',this.closeHeader);
        $.getEle('#icon_detail_4').addEventListener('click',this.noBubble)
        $.getEle('#icon_detail').addEventListener('click',this.noBubble)
        $.getEle('#icon_detail_2').addEventListener('click',this.noBubble)
        $.getEle('#icon_detail_3').addEventListener('click',this.noBubble)
        window.onhashchange = function(){
            _this.hash = location.hash.substring(1)
            _this.judgeHash();
        };
        $.getEle('#iconBackTop').addEventListener('click',this.toTop)
    },
    judgeHash:function(){
        if ($.getUrl(this.hash,'t') == 'local') {
            this.local();
        } else if ($.getUrl(this.hash,'t') == 'search' || $.getUrl(this.hash,'t') == 'online') {
            this.online();
        };
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
                $.getEle('.content_section').innerHTML = template('booktemp',_this.data.data[cid]);
                _this.addCatalog(_this.data.data)
                _this.infoStyle();
            }
        })
    },
    online:function(){
        var _this = this;
        var bookId = $.getUrl(this.hash,'bookId');
        var cid = $.getUrl(this.hash,'cid');
        $.ajax({
            url:'http://route.showapi.com/211-1',
            data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&bookId='+ bookId,
            success:function (data) {
                var obj = JSON.parse(data);
                _this.addCatalog(obj.showapi_res_body.book.chapterList.sort(function(a,b){
                    return a.cid - b.cid;
                }));
            }
        });
        $.ajax({
            url:'http://route.showapi.com/211-4',
            data:'showapi_appid=33871&showapi_sign=1f10779654da46eaa4316bd4df768e93&bookId='+ bookId + '&cid=' + cid,
            success:function (data) {
                var obj = JSON.parse(data);
                if (obj.showapi_res_body.ret_code == 0) {
                    $.getEle('.content').innerHTML = '<section class="content_section">' +obj.showapi_res_body.txt +'</section>';
                    _this.infoStyle();
                }
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
    },
    infoStyle:function(){
        var font = $.getEle('#icon_detail_4');
        var color = $.getEle('#icon_detail');
        $.getEle('.content').style.fontFamily = $.getEle.call(font,'.active').getAttribute('title');
        $.getEle('.content').style.fontSize =
        $.getEle('.font_size_text').innerHTML + 'px';
        if ($.getEle('.content_section')) {
            $.getEle('.content_section').style.backgroundColor =
            $.getEle.call(color,'.active').dataset.color;
            $.getEle('.content_section').style.width = $.getEle('.font_width_text').innerHTML + 'px';
        }
    },
    changeFont:function(){
        var _this = this;
        var lis = $.getEle('#icon_detail_4 li');
        for (var i = 0; i < lis.length; i++) {
            lis[i].addEventListener('click',function(){
                for (var i = 0; i < lis.length; i++) {
                    $.removeClass(lis[i],'active');
                };
                $.addClass(this,'active');
                _this.infoStyle();
            })
        }
    },
    changeBg:function(){
        var _this = this;
        var spans = $.getEle('#icon_detail span');
        for (var i = 0; i < spans.length; i++) {
            spans[i].addEventListener('click',function(){
                for (var i = 0; i < spans.length; i++) {
                    $.removeClass(spans[i],'active');
                };
                $.addClass(this,'active');
                _this.infoStyle();
            })
        }
    },
    changeFontSize:function(){
        var _this = this;
        var sub = $.getEle('.font_size_sub');
        var plus = $.getEle('.font_size_plus');
        sub.addEventListener('click',function(ev){
            var num = Number($.getEle('.font_size_text').innerHTML);
            num -= 2;
            if (num < 12) {
                num = 12;
            }
            $.getEle('.font_size_text').innerHTML = num;
            _this.infoStyle();
        });
        plus.addEventListener('click',function(ev){
            var num = Number($.getEle('.font_size_text').innerHTML);
            num += 2;
            if (num > 30) {
                num = 30;
            }
            $.getEle('.font_size_text').innerHTML = num;
            _this.infoStyle();
        })
    },
    changeWidth:function(){
        var _this = this;
        var sub = $.getEle('.font_width_sub');
        var plus = $.getEle('.font_width_plus');
        sub.addEventListener('click',function(ev){
            var num = Number($.getEle('.font_width_text').innerHTML);
            num -= 100;
            if (num < 700) {
                num = 700;
            };
            if ($.getEle('.font_width_text')) {
                $.getEle('.font_width_text').innerHTML = num;
                _this.infoStyle();
            }
        });
        plus.addEventListener('click',function(ev){
            var num = Number($.getEle('.font_width_text').innerHTML);
            num += 100;
            if (num > 1700) {
                num = 1700;
            }
            if ($.getEle('.font_width_text')) {
                $.getEle('.font_width_text').innerHTML = num;
                _this.infoStyle();
            }
        })
    },
    closeHeader:function(){
        $.getEle('#icon_detail_4').style.display = 'none';
        $.move($.getEle('#icon_detail_4'),{opacity : 0},'200','easeOut');
        $.getEle('.font_family').onOff = false;
        $.getEle('#icon_detail').style.display = 'none';
        $.move($.getEle('#icon_detail'),{opacity : 0},'200','easeOut');
        $.getEle('.icon-bg').onOff = false;
        $.getEle('#icon_detail_2').style.display = 'none';
        $.move($.getEle('#icon_detail_2'),{opacity : 0},'200','easeOut');
        $.getEle('.icon-text').onOff = false;
        $.getEle('#icon_detail_3').style.display = 'none';
        $.move($.getEle('#icon_detail_3'),{opacity : 0},'200','easeOut');
        $.getEle('.icon-width').onOff = false;
    },
    noBubble:function(e){
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else {
            window.event.cancelBubble = true;
            return false;
        }
    },
    toTop:function(){
        var x = document.body.scrollTop || document.documentElement.scrollTop;
        var timer = setInterval(function(){
            x-=50;
            if (x < 100) {
                clearInterval(timer);
                x = 0;
            };
            window.scrollTo(0,x);
        },10)
    }
}

var book = new Book();
book.init();
