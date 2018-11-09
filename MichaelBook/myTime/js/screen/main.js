/*样式自适应----字体大小*/
/*(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 12 * (clientWidth / 320) + 'px';//其中“20”根据你设置的html的font-size属性值做适当的变化
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);*/
/**
 * Created by xuliming on 2017/11/22.
 * 处理屏幕高度改变时
 */
(function () {
    /*移动展业*/
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    console.log(browser.versions);
    if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
        document.write("<script type='text/javascript' src='js/screen/cordova-ios.js'><\/script>");
    } else if (browser.versions.android) {
        /* else if (browser.versions.android || browser.versions.webKit) {*/
        document.write("<script type='text/javascript' src='js/screen/cordova-android.js'><\/script>");
    }
    if (getBrowser() != "chrome" && getBrowser() != "firefox" && getBrowser() != "ie") {//判断浏览器版本是否是ie、谷歌、火狐
        alert("本系统暂不支持此浏览器，请您重新下载！(系统支持IE8及以上版本、谷歌、火狐浏览器)");
    }
    /* 获取浏览器文档模式 :document.documentMode */
    if (document.documentMode < 8) {
        alert("您当前的浏览器文档模式:IE " + document.documentMode + ",本系统暂不支持此版本，请您升级浏览器版本或重新下载！(系统支持IE8及以上版本、谷歌、火狐浏览器)");
    }
    into();
})();
function into() {
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;//当前可是区域高度
    window.onload = function () {
        $("body").height(clientHeight).css("overflow", "auto");
    };
    /*处理软键盘弹起时间*/
    window.onresize = function () {
        var triggerElement = document.activeElement;//当前获取焦点的元素
        var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var keyBoardHeight = clientHeight - nowClientHeight;//键盘高度
        if (keyBoardHeight > 0) {
            //键盘弹出的事件处理
            $("body").height(nowClientHeight).css("overflow", "auto");
            setTimeout(function () {
                triggerElement.scrollIntoView(true);
            }, 100);
            triggerElement.scrollTop = nowClientHeight / 2;
        }
    };
}
/*获取浏览器版本*/
function getBrowser(getVersion) {
    //注意关键字大小写
    var ua_str = navigator.userAgent.toLowerCase(), ie_Tridents, trident, match_str, ie_aer_rv, browser_chi_Type;
    //判断IE 浏览器,
    //blog: http://blog.csdn.net/aerchi/article/details/51697592
    if ("ActiveXObject" in self) {
        // ie_aer_rv:  指示IE 的版本.
        // It can be affected by the current document mode of IE.
        ie_aer_rv = (match_str = ua_str.match(/msie ([\d.]+)/)) ? match_str[1] :
            (match_str = ua_str.match(/rv:([\d.]+)/)) ? match_str[1] : 0;

        // ie: Indicate the really version of current IE browser.
        ie_Tridents = {"trident/7.0": 11, "trident/6.0": 10, "trident/5.0": 9, "trident/4.0": 8};
        //匹配 ie8, ie11, edge
        trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/)) ? match_str[1] : undefined;
        browser_chi_Type = (ie_Tridents[trident] || ie_aer_rv) > 0 ? "ie" : undefined;
    } else {
        //判断 windows edge 浏览器
        // match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
        // match_str[1]: 返回版本号,如: "edge"

        //若要返回 "edge" 请把下行的 "ie" 换成 "edge"。 注意引号及冒号是英文状态下输入的
        browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/)) ? "ie" :
            //判断firefox 浏览器
            (match_str = ua_str.match(/firefox\/([\d.]+)/)) ? "firefox" :
                //判断chrome 浏览器
                (match_str = ua_str.match(/chrome\/([\d.]+)/)) ? "chrome" :
                    //判断opera 浏览器
                    (match_str = ua_str.match(/opera.([\d.]+)/)) ? "opera" :
                        //判断safari 浏览器
                        (match_str = ua_str.match(/version\/([\d.]+).*safari/)) ? "safari" : undefined;
    }
    //返回浏览器类型和版本号
    if (match_str) {
        var verNum, verStr;
        verNum = trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str[1];
        verStr = (getVersion != undefined) ? browser_chi_Type + "/" + verNum : browser_chi_Type;
        return verStr;
    }
}
/*
 * 获取页面信息
 *  网页可见区域宽：document.body.clientWidth
 网页可见区域高：document.body.clientHeight
 网页可见区域宽：document.body.offsetWidth (包括边线的宽)
 网页可见区域高：document.body.offsetHeight (包括边线的宽)
 网页正文全文宽：document.body.scrollWidth
 网页正文全文高：document.body.scrollHeight
 网页被卷去的高：document.body.scrollTop
 网页被卷去的左：document.body.scrollLeft
 网页正文部分上：window.screenTop
 网页正文部分左：window.screenLeft
 屏幕分辨率的高：window.screen.height
 屏幕分辨率的宽：window.screen.width
 屏幕可用工作区高度：window.screen.availHeight
 屏幕可用工作区宽度：window.screen.availWidth


 HTML精确定位:scrollLeft,scrollWidth,clientWidth,offsetWidth
 scrollHeight: 获取对象的滚动高度。
 scrollLeft:设置或获取位于对象左边界和窗口中目前可见内容的最左端之间的距离
 scrollTop:设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离
 scrollWidth:获取对象的滚动宽度
 offsetHeight:获取对象相对于版面或由父坐标 offsetParent 属性指定的父坐标的高度
 offsetLeft:获取对象相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置
 offsetTop:获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置
 event.clientX 相对文档的水平座标
 event.clientY 相对文档的垂直座标
 event.offsetX 相对容器的水平坐标
 event.offsetY 相对容器的垂直坐标
 document.documentElement.scrollTop 垂直方向滚动的值
 event.clientX+document.documentElement.scrollTop 相对文档的水平座标+垂直方向滚动的量
 * */

function getInfo() {
    var s = "";
    s += " 网页可见区域宽：" + document.body.clientWidth + "\n";
    s += " 网页可见区域高：" + document.body.clientHeight + "\n";
    s += " 网页可见区域宽：" + document.body.offsetWidth + " (包括边线和滚动条的宽)" + "\n";
    s += " 网页可见区域高：" + document.body.offsetHeight + " (包括边线的宽)" + "\n";
    s += " 网页正文全文宽：" + document.body.scrollWidth + "\n";
    s += " 网页正文全文高：" + document.body.scrollHeight + "\n";
    s += " 网页被卷去的高(ff)：" + document.body.scrollTop + "\n";
    s += " 网页被卷去的高(ie)：" + document.documentElement.scrollTop + "\n";
    s += " 网页被卷去的左：" + document.body.scrollLeft + "\n";
    s += " 网页正文部分上：" + window.screenTop + "\n";
    s += " 网页正文部分左：" + window.screenLeft + "\n";
    s += " 屏幕分辨率的高：" + window.screen.height + "\n";
    s += " 屏幕分辨率的宽：" + window.screen.width + "\n";
    s += " 屏幕可用工作区高度：" + window.screen.availHeight + "\n";
    s += " 屏幕可用工作区宽度：" + window.screen.availWidth + "\n";
    s += " 你的屏幕设置是 " + window.screen.colorDepth + " 位彩色" + "\n";
    s += " 你的屏幕颜色分辨率 " + window.screen.pixelDepth + " 位彩色" + "\n";
    s += " 你的屏幕设置PPI/DPI:" + js_getDPI() + " 每英寸像素/每英寸点" + "\n";
    alert(s);
}
/*获取屏幕分辨率*/
function js_getDPI() {
    var arrDPI = [];
    if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }
    else {
        var tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
    }
    return arrDPI[0] + "/" + arrDPI[1];
}
