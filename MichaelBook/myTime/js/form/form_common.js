/**
 * Created by xuliming on 2017/11/22.
 * from表单常规封装方法
 */
/*校验：允许输入nin~max位字符*/
function checkLength(min, max, ele) {
    var message = "";
    if (ele.length < min) {
        message = "输入位数不能少于" + min;
    } else if (ele.length < max) {
        message = "输入位数不能多于" + max;
    }
    return message;
}
/*校验：当长度超出限定位数时，自动删除最后的字符*/
function checkLengthOut(id, length) {
    if (isNumber(length)) {/*判断输入值是否是数字*/
        var value = $("#" + id).val();
        var RightValue = "";
        var textLength = 0;
        var l = 0;
        for (var m = 0; m < value.length; m++, l++) {
            var charAtValue = value.charAt(m);
            if ((/^([\u4E00-\u9FA5])+$/).test(charAtValue)) {
                textLength += 2;
            } else {
                textLength += 1;
            }
            if (textLength > length) {
                RightValue = value.substring(0, l);
                $("#" + id).val(RightValue);
                return;
            }
        }
    }
}
/*校验：当前输入文本汉字字节长度
 * 一个汉字算两个字节
 * */
function checkChineseLength(ele) {
    var regular = /^([\u4E00-\u9FA5])+$/;
    var length = 0;
    /*汉字个数*/
    for (var i = 0, len = ele.length; i < len; i++) {
        var value = ele.charAt(i);
        if (regular.test(value)) {
            length += 2;
        }
    }
    return length;
}
/*校验：当前输入文本非汉字字节长度 */
function checkOtherLength(ele) {
    var regular = /^([\u4E00-\u9FA5])+$/;
    var length = 0;
    /*汉字个数*/
    for (var i = 0, len = ele.length; i < len; i++) {
        var value = ele.charAt(i);
        if (!regular.test(value)) {
            length++;
        }
    }
    return length;
}

