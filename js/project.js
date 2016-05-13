/**
 * Created by Administrator on 2016/4/19.
 */
$(function() {
 window.onload = function(){
  ajax();
 }

/*-------------------------------------------
 渲染ajax数据
 ---------------------------------------------*/
function ajax(){

 var Hash = window.location.href.split('=')[1];
 console.log(Hash);
 $.ajax({
  async: true,
  type : "POST",
  dataType : "json",
  url : "js/demo_ajax_json.js",
  success : function(json){
    var str = json.projects;
      //调用向前翻页函数
      $('.prev-button').on('click',function(){
          goPrev();
      })
      //调用向后翻页函数
      var sum = Number(str.length);
      $('.next-button').on('click',function(){
          goNext(sum);
      })
    for(var i=0;i<str.length;i++){
      $('h1').text(str[Hash].nam);
      $('.text-muted').text(str[Hash].link);
      $('.rightText').find('p').text(str[Hash].decription) ;
      $('.text-intro').find('img').eq(0).attr('src',str[Hash].pic1);
      $('.text-intro').find('img').eq(1).attr('src',str[Hash].pic2);
      $('.text-intro').find('img').eq(2).attr('src',str[Hash].pic3);
    }
  },
  contentType:'application/x-www-form-urlencoded; charset=UTF-8'
 });
}
/*-------------------------------------------
 向前翻页
 ---------------------------------------------*/
function goPrev(){
    var nowPage = window.location.href.split('=')[1];
    var prevPage= 0;
    if(nowPage>0){
        prevPage = nowPage-1;
    }else{
        prevPage = 0;
    }
    location.href = "project.html?page="+prevPage;
}
    /*-------------------------------------------
     向后翻页
     ---------------------------------------------*/
    function goNext(sum){
        var nowPage = window.location.href.split('=')[1];
        if(nowPage<sum){
            nowPage++;
        }else{
            nowPage = sum-1;
        }
        location.href = "project.html?page="+nowPage;
    }

})