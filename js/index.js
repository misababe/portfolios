/**
 * Created by Administrator on 2016/4/8.
 */
    window.onresize = window.onload= function(){
        var iW = $(window).width();
        var iH = $(window).height();
        $('.parallax-box').css({width:iW*0.3,height:iH})
        $('.parallax-box').find('div img:first').css({width:iW*0.3,height:iH})
        //$('.parallax-box').find('div:gt(0)').css({top:0,right:0})

        var oPar = $('.parallax-box');
        var aDiv = $('.parallax-box').find('div:gt(0)');
        console.log(aDiv)

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

                console.log(x,y)

            }

            oPar.onmouseout = function(){
                document.onmousemove = oPar.onmouseout = null;
            }

            return false;
        }

    }
