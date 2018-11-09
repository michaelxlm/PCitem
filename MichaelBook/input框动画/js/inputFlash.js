//绑定监听事件
function addEventHandler(target, type, fn) {
    if (target.addEventListener) {
        if (type == 'onpropertychange') {
            target.addEventListener("input", fn);
        } else {
            target.addEventListener(type, fn);
        }
    } else {
        if (type == 'onpropertychange') {
            target.attachEvent(type, fn);
        } else {
            target.attachEvent("on" + type, fn);
        }
    }
}
/*判断是否存在class*/
function hasClass(elements, cName) {
    return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
}
/*移除class*/
function removeClass(elements, cName) {
    if (hasClass(elements, cName)) {
        elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换
    }
}
//获取样式
function getStyle(obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    } else {
        return getComputedStyle(obj, false)[name];
    }
}
var inputFlash = {
    init: function (k) {
        "use strict";
        for (var i = 0, j = k.length; i < j; i++) {
            inputFlash.start(k[i]);
        }
    },
    //初始化定义方法
    start: function (ele) {
        var styleInIt = {
            triggerIn: "focus",
            triggerOut: "blur",
            triggerChange: "onpropertychange",
            endTop: 0,
            startTop: 37,
            placeholder: "",
            lineHeight: "28",
            color: "blue",
            className: "aaaaa",
            value: ele.val,
            id: ele.id
        };
        var inputFlashClass = document.getElementsByClassName(styleInIt.className);
        var inputID = document.getElementById(styleInIt.id);
        /*styleInIt.lineHeight = getStyle(inputID, 'line-height').replace(/[^0-9]/ig, "");*/
        inputID.getAttribute("placeholder") ? styleInIt.placeholder = inputID.getAttribute("placeholder") : styleInIt.placeholder = "";
        console.log(styleInIt);
        addEventHandler(inputID, styleInIt.triggerChange, function () {
        });
        addEventHandler(inputID, styleInIt.triggerIn, function () {
            if (inputFlashClass) {
                inputFlash.changeClassStyle(styleInIt, "add");
                this.setAttribute("placeholder", "");
                this.style.color = styleInIt.color;
                this.style.lineHeight = styleInIt.lineHeight / 2 + "px";
                this.style.paddingTop = '14px';
            }
        });
        addEventHandler(inputID, styleInIt.triggerOut, function () {
            if (this.value == "") {
                this.style.color = "black";
                this.style.lineHeight = styleInIt.lineHeight + "px";
                this.style.paddingTop = '0';
                this.setAttribute("placeholder", styleInIt.placeholder);
                inputFlash.changeClassStyle(styleInIt, "remove");
            }
        });
    },
    /*编辑添加style内容*/
    addClassStyle: function (ele) {
        var doc = document;
        var styleFlash = document.createElement('style');
        styleFlash.setAttribute("type", "text/css");
        styleFlash.title = ele.className;
        var cssString = '.' + ele.className + ':before {content: "' + ele.value + '";' +
            'position: absolute;' +
            'top: ' + ele.endTop + 'px;' +
            'z-index: 999;' +
            'font-size: 16px;' +
            'line-height: ' + ele.lineHeight / 2 + 'px;' +
            'left: 58px;' +
            'color: ' + ele.color + ';' +
            'animation: inputFlashAnimation 0.25s;' +
            ' -moz-animation: inputFlashAnimation 0.25s; /* Firefox */' +
            ' -webkit-animation: inputFlashAnimation 0.25s; /* Safari 和 Chrome */ ' +
            '-o-animation: inputFlashAnimation 0.25s; /* Opera */' +
            '}' +
            '@keyframes inputFlashAnimation {' +
            '0% {top: ' + ele.startTop + 'px;}' +
            '100% {top: ' + ele.endTop + 'px;}' +
            '}' +
            '@-moz-keyframes inputFlashAnimation /* Firefox */{' +
            '0% {top: ' + ele.startTop + 'px;}' +
            '100% {top: ' + ele.endTop + 'px;}' +
            '}' +
            '@-webkit-keyframes inputFlashAnimation /* Safari 和 Chrome */{' +
            '0% {top: ' + ele.startTop + 'px;}' +
            '100% {top: ' + ele.endTop + 'px;}' +
            '}' +
            '@-o-keyframes inputFlashAnimation /* Opera */{' +
            '0% {top: ' + ele.startTop + 'px;}' +
            '100% {top: ' + ele.endTop + 'px;}' +
            '}' +
            '.' + ele.className + ' .ant-input-prefix,.' + ele.className + ' .ant-input-suffix{' +
            'color:' + ele.color + ';' +
            '}';
        if (styleFlash.styleSheet) {// IE
            styleFlash.styleSheet.cssText = cssString;
        } else {// w3c
            var cssText = doc.createTextNode(cssString);
            styleFlash.appendChild(cssText);
        }
        var heads = doc.getElementsByTagName("head");
        if (heads.length)
            heads[0].appendChild(styleFlash);
        else
            doc.documentElement.appendChild(styleFlash);
    },
    /*添加或删除style*/
    changeClassStyle: function (ele, states) {
        var styleList = document.head.getElementsByTagName("style");
        var titleList = [];
        for (var i = 0, j = styleList.length; i < j; i++) {
            titleList.push(styleList[i].title);
        }
        if (titleList.indexOf && typeof(titleList.indexOf) == 'function') {
            var index = titleList.indexOf(ele.className);
            if (index >= 0) {
                if (states === "remove") {
                    document.head.removeChild(styleList[index]);
                }
            } else {
                if (states === "add") {
                    inputFlash.addClassStyle(ele);
                }
            }
        }
    }
};