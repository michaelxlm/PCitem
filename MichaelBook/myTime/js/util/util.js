/**
 * Created by xuliming on 2017/11/24.
 */
/*判断输入值是否是数字*/
function isNumber(ele) {
    if (isNaN(ele)) {/*若不是*/
        return false;
    } else {/*若是*/
        return true;
    }
}
/*清除字符串中的空白*/
function trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
/*判断输入值的基本数据类型
 * JS中的基本类型：number、string、boolean
 * 特殊类型：null、undefined、object［对象］
 * */
function checkType(ele) {
    return typeof(ele);
}
/*
 * 判断maxString字符串中是否包含minString
 * */
function hasStrings(minString, maxString) {
    if (isString(minString) && isString(maxString)) {
        if (maxString.indexOf(minString) != -1) {
            return true;
        } else {
            return false;
        }
    } else {
        console.log("请传入字符串");
    }
}
/*
 * 判断对象是否是字符串
 * */
function isString(obj) {
    return Object.prototype.toString.call(obj) === "[object String]";
}
/*通过id 获取当前对象*/
function getID(ele) {
    return document.getElementById(ele);
}
/*通过class名称获取对象*/
function getClass(ele) {
    return document.getElementsByClassName(ele);
}
//event事件问题
document.onclick = function (ev) {//谷歌火狐的写法，IE9以上支持，往下不支持；
    var e = ev;
    console.log(e);
}
document.onclick = function () {//谷歌和IE支持，火狐不支持；
    var e = event;
    console.log(e);
}
document.onclick = function (ev) {//兼容写法；
    var e = ev || window.event;
    var mouseX = e.clientX;//鼠标X轴的坐标
    var mouseY = e.clientY;//鼠标Y轴的坐标
}
//DOM节点相关，主要兼容IE 6 7 8
function nextnode(obj) {//获取下一个兄弟节点
    if (obj.nextElementSibling) {
        return obj.nextElementSibling;
    } else {
        return obj.nextSibling;
    }
}
function prenode(obj) {//获取上一个兄弟节点
    if (obj.previousElementSibling) {
        return obj.previousElementSibling;
    } else {
        return obj.previousSibling;
    }
}
function firstnode(obj) {//获取第一个子节点
    if (obj.firstElementChild) {
        return obj.firstElementChild;//非IE678支持
    } else {
        return obj.firstChild;//IE678支持
    }
}
function lastnode(obj) {//获取最后一个子节点
    if (obj.lastElementChild) {
        return obj.lastElementChild;//非IE678支持
    } else {
        return obj.lastChild;//IE678支持
    }
}
//通过类名获取元素
document.getElementsByClassName('');//IE 6 7 8不支持；

//这里可以定义一个函数来解决兼容问题，当然别在这给我提jQuery...
//第一个为全局获取类名，第二个为局部获取类名
function byClass1(oClass) {//全局获取，oClass为你想要查找的类名，没有“.”
    var tags = document.all ? document.all : document.getElementsByTagName('*');
    var arr = [];
    for (var i = 0; i < tags.length; i++) {
        var reg = new RegExp('\\b' + oClass + '\\b', 'g');
        if (reg.test(tags[i].className)) {
            arr.push(tags[i]);
        }
    }
    return arr;//注意返回的也是数组，包含你传入的class所有元素；
}

function byClass2(parentID, oClass) {//局部获取类名，parentID为你传入的父级ID
    var parent = document.getElementById(parentID);
    var tags = parent.all ? parent.all : parent.getElementsByTagName('*');
    var arr = [];
    for (var i = 0; i < tags.length; i++) {
        var reg = new RegExp('\\b' + oClass + '\\b', 'g');
        if (reg.test(tags[i].className)) {
            arr.push(tags[i]);
        }
    }
    return arr;//注意返回的也是数组，包含你传入的class所有元素；
}
//获取元素的非行间样式值
function getStyle(object, oCss) {
    if (object.currentStyle) {
        return object.currentStyle[oCss];//IE
    } else {
        return getComputedStyle(object, null)[oCss];//除了IE
    }
}
//设置监听事件
function addEvent(obj, type, fn) {//添加事件监听，三个参数分别为 对象、事件类型、事件处理函数，默认为false
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);//非IE
    } else {
        obj.attachEvent('on' + type, fn);//ie,这里已经加上on，传参的时候注意不要重复加了
    }
}
function removeEvent(obj, type, fn) {//删除事件监听
    if (obj.removeEventListener) {
        obj.removeEventListener(type, fn, false);//非IE
    } else {
        obj.detachEvent('on' + type, fn);//ie，这里已经加上on，传参的时候注意不要重复加了
    }
}
//在这里加个元素到浏览器边缘的距离，很实用
function offsetTL(obj) {//获取元素内容距离浏览器边框的距离（含边框）
    var ofL = 0, ofT = 0;
    while (obj) {
        ofL += obj.offsetLeft + obj.clientLeft;
        ofT += obj.offsetTop + obj.clientTop;
        obj = obj.offsetParent;
    }
    return {left: ofL, top: ofT};
}
//js阻止事件传播，这里使用click事件为例
document.onclick = function (e) {
    var e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();//W3C标准
    } else {
        e.cancelBubble = true;//IE....
    }
};
//js阻止默认事件
document.onclick = function (e) {
    var e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();//W3C标准
    } else {
        e.returnValue = 'false';//IE..
    }
};
//关于event事件中的target
document.onmouseover = function (e) {
    var e = e || window.event;
    var Target = e.target || e.srcElement;//获取target的兼容写法，后面的为IE
    var from = e.relatedTarget || e.formElement;//鼠标来的地方，同样后面的为IE...
    var to = e.relatedTarget || e.toElement;//鼠标去的地方
};
//鼠标滚轮事件
//火狐中的滚轮事件
document.addEventListener("DOMMouseScroll", function (event) {
    alert(event.detail);//若前滚的话为 -3，后滚的话为 3
}, false);
//非火狐中的滚轮事件
document.onmousewheel = function (event) {
    alert(event.detail);//前滚：120，后滚：-120
};
//火狐下特有的节点加载事件，就是节点加载完才执行，和onload不同
//感觉用到的不多，直接把js代码放在页面结构后面一样能实现。。
document.addEventListener('DOMContentLoaded', function () {
}, false);//DOM加载完成。好像除IE6-8都可以.
