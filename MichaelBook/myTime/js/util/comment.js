/**
 * 该js用于页面操作
 *window.open()
 * 一、支持环境：
 * JavaScript1.0+/JScript1.0+/Nav2+/IE3+/Opera3+
 * 二、基本语法：
 * window.open(pageURL,name,parameters)
 * 其中：
 * pageURL 为子窗口路径
 * name 为子窗口句柄
 * parameters 为窗口参数(各参数用逗号分隔)
 * 其中yes/no也可使用1/0；pixel value为具体的数值，单位象素。

 参数 | 取值范围 | 说明

 alwaysLowered | yes/no | 指定窗口隐藏在所有窗口之后
 alwaysRaised | yes/no | 指定窗口悬浮在所有窗口之上
 depended | yes/no | 是否和父窗口同时关闭
 directories | yes/no | Nav2和3的目录栏是否可见
 height | pixel value | 窗口高度
 hotkeys | yes/no | 在没菜单栏的窗口中设安全退出热键
 innerHeight | pixel value | 窗口中文档的像素高度
 innerWidth | pixel value | 窗口中文档的像素宽度
 location | yes/no | 位置栏是否可见
 menubar | yes/no | 菜单栏是否可见
 outerHeight | pixel value | 设定窗口(包括装饰边框)的像素高度
 outerWidth | pixel value | 设定窗口(包括装饰边框)的像素宽度
 resizable | yes/no | 窗口大小是否可调整
 screenX | pixel value | 窗口距屏幕左边界的像素长度
 screenY | pixel value | 窗口距屏幕上边界的像素长度
 scrollbars | yes/no | 窗口是否可有滚动栏
 titlebar | yes/no | 窗口题目栏是否可见
 toolbar | yes/no | 窗口工具栏是否可见
 Width | pixel value | 窗口的像素宽度
 z-look | yes/no | 窗口被激活后是否浮在其它窗口之上
 */
$(function () {
    /**
     * window.open('https:www.baidu.com', '', 'toolbar=yes,location=yes,directions=yes,status=yes,menubar=yes,scrollbar=yes,resizable=yes');
     * 打开新浏览器显示页面*/
    /*
     *     加入关键字_blank,重复打开多个新页面
     *     window.open("html/css.html","_blank");
     * */

});
/*点击按钮，弹出新页面*/
function newHtml(htmlName) {
    if (cookie.get('popped') == '') {//利用cookie确保页面只弹出一次
    ShowDialog("outHtml/" + htmlName + ".html");
    document.cookie = "popped=yes";
    }
}
/*向新页面传递值*/
function sendData() {
    var open = window.opener;
    var oldId = document.getElementById("oldHtmlId");
    if (open) {
        var newId = open.document.getElementById("id");
        if (newId) {
            newId.value = oldId.value;
        }
    }

}

/*在页面中部弹出新页面*/
function ShowDialog(url) {
    var iWidth = window.screen.width / 2; //模态窗口宽度
    var iHeight = window.screen.height / 2;//模态窗口高度
    var iTop = (window.screen.height - iHeight) / 2;
    var iLeft = (window.screen.width - iWidth) / 2;
    var Detail = window.open(url, "Detail",
        "Scrollbars=yes,Toolbar=no,Location=no,Direction=no,Resizeable=no,   Width=" + iWidth + " ,Height=" + iHeight + ",top=" + iTop + ",left=" + iLeft);
    /*setTimeout(function () {//避免js异步加载覆盖掉代码
     Detail.document.title = "DNASDNJ";
     }, 150);*/
    htmlLoaded();
    function htmlLoaded() {
        Detail.document.title = "已加载htmlStates页面";
        Detail.onload =function(){ //判断iframe页面加载完成
            console.log('已加载')
        };
        setTimeout(function () {
            htmlLoaded();
        }, 100);

    }
    /*js检测window.open打开的窗口是否关闭*/
    var loop = setInterval(function() {
        if(Detail .closed) {
            clearInterval(loop);
            console.log("新窗口已关闭！");
        }
    }, 1000);
}

/*关闭当前页面*/
function closeHtml() {
    if (confirm("您确定要关闭本页吗？")) {
        window.opener = null;
        window.location.href="about:blank";
        window.close();
        cookie.clear();//清空cookie缓存
    }
}