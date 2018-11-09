/**
 * Created by xuliming on 2017/11/25.
 *
 * 立即执行函数写法(页面未加载时)
 *
 * 将声明方法转换为表达式
 * 1.传统的方法啰嗦，定义和执行分开写；
 * 2.传统的方法直接污染全局命名空间（浏览器里的 global 对象，如 window）
 *
 * 内部定义的变量不会和外部的变量发生冲突，俗称“匿名包裹器”或“命名空间”。
 *
 */
var text="text";
/* 形式1*/
void function (ele) {// 在这里，ele 就是全局对象了
    console.log("形式1:"+ele);
}(this);//在浏览器里，this 就是 window 对象

/* 形式2*/
/*(function (ele) {
    console.log("形式2:"+ele);
})(jQuery);//在jQuery库中立即执行*/

/* 形式3*/
(function (ele) {
    console.log("形式3:"+ele);
}(window));//在全局作用域中调用

/* 形式4*/
!function(ele){
    console.log("形式4:"+ele);
}(12345);

/* 形式5*/
+function(ele){
    console.log("形式5:"+ele);
}(123456);


/* 形式6*/
-function(ele){
    console.log("形式6:"+ele);
}(1234567);


/* 形式7*/
var fn=function(ele){
    console.log("形式7:"+ele);
}(12345678);