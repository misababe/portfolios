$(function() {
    window.onload = function(){
        parallax();
    }
    window.onresize = function(){
        parallax();
    }
    $(".ajax-link").on('click',function(){
        console.log($(".ajax-link").index(this));
        goLink($(".ajax-link").index(this));
    });

    /*-------------------------------------------
     右侧视差效果
     ---------------------------------------------*/
    function parallax(){
            var iW = $(window).width();
            var iH = $(window).height();
            $('.parallax-box').css({width:iW*0.3,height:iH})
            $('.parallax-box').find('div img:first').css({width:iW*0.3,height:iH})
            //$('.parallax-box').find('div:gt(0)').css({top:0,right:0})

            var oPar = $('.parallax-box');
            var aDiv = $('.parallax-box').find('div:gt(0)');
            //console.log(aDiv)

            var x = 0;
            var y = 0;


            document.onmouseover = function(ev){
                var oEvent = ev || event;

                var disX = ev.clientX - x;
                var disY = ev.clientY - y;

                document.onmousemove = function(ev){
                    var oEvent = ev || event;

                    x = ev.clientX - disX;
                    y = ev.clientY - disY;



                    for(var i=0;i<aDiv.length;i++){
                        aDiv[i].style.marginLeft = x * aDiv[i].style.zIndex/50 + 'px';

                        aDiv[i].style.marginTop = y * aDiv[i].style.zIndex/50 + 'px';
                    }

                    //console.log(x,y)

                }

                oPar.onmouseout = function(){
                    document.onmousemove = oPar.onmouseout = null;
                }

                return false;
            }
    }

    /*-------------------------------------------
     渲染数据
     ---------------------------------------------*/
    //function ajax(){
    //    $.getJSON("js/demo_ajax_json.js",function(json){
    //        $.each(json.projects,function(index){
    //            console.log(json.projects[index].nam);
    //            var aImg = createImg(json.projects[index].thumb);
    //            //var aH4 = createTitle(result.products[index].nam,result.products[index].price);
    //            $('.ajax-ul').find('li').eq(index).prepend(aImg);
    //            //$('.circle-works').find('li').find('a').eq(index).append(aH4);
    //        })
    //        //var str = json.projects;
    //        //    for(var i=0;i<str.length;i++){
    //        //        if(i==0){
    //        //            console.log(str[0].thumb)
    //        //            $('.ajax-ul li img').eq(0).attr("src",str[0].thumb)
    //        //        }
    //        //
    //        //    }
    //    })
    //}

    /*-------------------------------------------
     点击跳转到作品详情页
     ---------------------------------------------*/
    function goLink(num){
        window.open("project.html?page="+num);
    }
    /*-------------------------------------------
     创建一个新的预览图img
     ---------------------------------------------*/
    function createImg(src){
        var newImg = document.createElement('img');
        newImg.className = 'autoW';
        newImg.src = src;

        return newImg;
    }

})


