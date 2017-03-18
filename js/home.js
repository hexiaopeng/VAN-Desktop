function BookHome(){
    this.search = window.location.search.substring(1);
    this.source = $.getUrl(this.search,'a');
    console.log(this.source);
}
var bookHome = new BookHome();
