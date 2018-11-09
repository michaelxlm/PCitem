/**
 * Created by xuliming on 2017/11/27.
 */
function menUInto() {
    var mainContent = document.getElementById("mainContent");
    mainContent.childNodes.forEach(function (value) {/*为下一级子元素添加class*/
        addClass(value, "page");
    });
}
/*清除原有active 对当前id添加新active*/
function changeMainContent(pageId, fatherNode) {
    fatherNode.childNodes.forEach(function (value) {
        removeClass(value, "active");
        if (value.id == pageId) {
            addClass(value, "active");
        }
    });
}
/*添加class不会删除原来的class*/
function addClass(obj, cls) {
    var obj_class = obj.className,//获取 class 内容.
        blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    obj.className = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.替换原来的 class.
}
/*移除class不会删除原来的class*/
function removeClass(obj, cls) {
    var obj_class = ' ' + obj.className + ' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' ');//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
    obj.className = obj_class.replace(' ' + cls + ' ', ' ').replace(/(^\s+)|(\s+$)/g, '');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd ';;;去掉首尾空格. ex) 'bcd ' -> 'bcd';;;替换原来的 class.
}
/*判断obj对象内是否存在cls -className*/
function hasClass(obj, cls) {
    var obj_class = obj.className,//获取 class 内容.
        obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    for (var x = 0, len = obj_class_lst.length; x < len; x++) {
        if (obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}