/**
 * Created by Administrator on 2016/4/19.
 */
$(function() {
 window.onload = function(){
  ajax();
 }
})
/*-------------------------------------------
 ‰÷»æajax ˝æ›
 ---------------------------------------------*/
function ajax(){
 //$.post("js/demo_ajax_json.js",function(json){
 // var str = json.projects;
 // for(var i=0;i<str.length;i++){
 //  if(i==0){
 //   $('h1').text(str[0].nam);
 //   $('.text-muted').text(str[0].link);
 //   $('.rightText').find('p').text(str[0].decription) ;
 //   $('.text-intro').find('img').eq(0).attr('src',str[0].pic1);
 //   $('.text-intro').find('img').eq(1).attr('src',str[0].pic2);
 //   $('.text-intro').find('img').eq(2).attr('src',str[0].pic3);
 //  }
 //
 // }
 //},'json')
 var Hash = window.location.href.split('=')[1];
 console.log(Hash);
 $.ajax({
  async: true,
  type : "POST",
  dataType : "json",
  url : "js/demo_ajax_json.js",
  success : function(json){
    var str = json.projects;
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