/*当页面加载状态改变的时候执行这个方法*/
void function (ele) {// 在这里，ele 就是全局对象了
    if (document.readyState == "uninitialized") {//（未初始化）还没有调用send()方法
        console.log("Uninitialized");
    }
    if (document.readyState == "loading") {//（载入）已调用send()方法，正在发送请求
        console.log("loading");
    }
    if (document.readyState == "loaded") {//（载入完成）send()方法执行完成，已经接收到全部响应内容
        console.log("Loaded");
    }
    if (document.readyState == "interactive") {//（交互）正在解析响应内容
        console.log("Interactive");
    }
    if (document.readyState == "completed") {//（完成）响应内容解析完成，可以在客户端调用了
        console.log("Completed");
    }
}(this);//在浏览器里，this 就是 window 对象
/*页面关闭调用方法*/
document.onunload = function () {
    alert("onunload");
};
window.onbeforeunload = function () {
    alert("onbeforeunload");
    console.log("onbeforeunload");
};
/*页面初始化调用方法*/
window.onload = function () {
    console.log("onload");
};

/*预防js异步加载导致js未能生效*/
htmlLoaded();
function htmlLoaded() {
    var htmlStates = false;
    if (window.document.title == "已加载htmlStates页面") {
        htmlStates = true;
    }
    window.document.title = "已加载htmlStates页面";
    if (htmlStates == false) {
        setTimeout(function () {
            htmlLoaded();
        }, 100);
    }

}
/*判断浏览器是否支持h5*/
function checkHtml5() {
    if (typeof(Worker) !== "undefined") {
        alert("支持HTML5");
    } else {
        alert("不支持HTML5");
    }
}