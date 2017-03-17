console.log(1);
$.ajax({
    type:'get',
    url:'book/《爸爸一家亲》作者：碧色微橘(晋江银牌推荐VIP2016-01-31完结).txt',
    success:function(data){
        var str = data;
        var str1 = '()';        // console.log(str);
        var arr = str.match(/[^\u2606]+/g);
        // str.replace(/(\u2606[^\n]+)/g,function(a,b,c,d){
        //     arr[arr.length] = {
        //         title: b
        //     }
        //     // console.log(a,b,c);
        // })
        var arr1 =[];
        for(var i=0; i<arr.length; i++){
            arr1.push(arr[i].match(/[^\n]+/g));
            // arr[i].replace(/([^\n]+)+/,function(){
            //     console.log(arguments);
            //     // arr1.push({
            //     //     title:b,
            //     //     con:c
            //     // })
            // })
        }
        console.log(arr1);
    }
})
