/**
 * Created by xuliming on 2017/11/25.
 */
/*确定鼠标点击按键*/
function whichButton(event) {
    var buttonNumber=event.button;
    if(buttonNumber==2){//点击了鼠标右键
        alert('您点击了鼠标右键');
    }else if(buttonNumber==0) {//点击了鼠标左键
        alert("您点击了鼠标左键！")
    } else if(buttonNumber==1) {//点击了鼠标中键
        alert("您点击了鼠标中键！");
    } else {
        alert("您点击了" + buttonNumber+ "号键，我不能确定它的名称。");
    }
}
/*某个键盘按键被按下*/
document.onkeydown = function (e) {
    if (!e) e = window.event;
    /*判断回车事件是否被触发*/
    if ((e.keyCode || e.which) == 13) {//keyCode被敲击的键生成的 Unicode 字符码
        var btnLogin = document.getElementById("submit_btn");   //submit_btn为按钮ID
        btnLogin.focus();/*自动点击确定按钮*/
    }
};
/*某个键盘按键被按下并松开*/
document.onkeypress=function (e) {

};
/*某个键盘按键被松开*/
document.onkeyup=function (e) {

};