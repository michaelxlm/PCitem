/*首页页面初始化方法*/
$(function () {
    /*js预加载全部html页面*/
    var htmlList = [
        {
            htmlName: "alert"
        }, {
            htmlName: "canvas"
        }, {
            htmlName: "compatible"
        }, {
            htmlName: "css"
        }, {
            htmlName: "cssDIS"
        }, {
            htmlName: "form"
        }, {
            htmlName: "href"
        }, {
            htmlName: "js"
        }, {
            htmlName: "json"
        }, {
            htmlName: "svg"
        }, {
            htmlName: "text"
        }, {
            htmlName: "cssFlex"
        }],//html名称列表
    innerDiv = "";
    for (var i = 0; i < htmlList.length; i++) {
        innerDiv += "<div id='" + htmlList[i].htmlName + "' style='display: none;'></div>";
    }
    $("#mainContent").append(innerDiv);
    /*jquery页面预加载*/
    for (var j = 0; j < htmlList.length; j++) {
        $("#" + htmlList[j].htmlName).load("html/" + htmlList[j].htmlName + ".html");
    }
    menUInto();//为全部div页面添加样式
});
/*首页导航点击页面内容切换*/
function html(href) {
    var ObjectID = document.getElementById('ObjectID'),
    mainContent = document.getElementById("mainContent");
    changeMainContent(href, mainContent);
    /*处理cssTextShow样式下字符串默认换行*/
    var re = new RegExp("\n", "g");
    /*全部换行符正则*/
    var cssTextShow = document.getElementsByClassName("cssTextShow");
    for (var cs = 0, len = cssTextShow.length; cs < len; cs++) {
        cssTextShow[cs].innerHTML = cssTextShow[cs].innerHTML.replace(re, "<br/>");
    }
}