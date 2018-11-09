/**
 * Created by xuliming on 2017/11/22.
 * 运用正则表达式处理表单
 */
/*正则校验：只能输入中英文*/
function checkedChineseAndEnglish(ele) {
    var regular = /^([A-Za-z]|[\u4E00-\u9FA5])+$/;
    if (!(regular.test(ele))) {
        alert("只能输入中英文！");
    }
}
/*正则校验：不能输入特殊字符*/
function checkedSpecial(ele) {
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,/*英文字符*/
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;/*中文字符*/
    if(regEn.test(ele) || regCn.test(ele)) {
        alert("不能包含特殊字符");
    }
}
/*正则校验：只能输入数字和字母*/
function checkedNumberAndEnglish(ele) {
    var regular = /^[A-Za-z0-9]+$/;
    if (!(regular.test(ele))) {
        alert("只能输入数字和字母");
    }
}
/*正则校验：只能输入中文*/
function checkedChinese(ele) {
    var regular = /^([\u4E00-\u9FA5])+$/;
    if (!(regular.test(ele))) {
        alert("只能输入中文！");
    }
}
/*正则校验：只能输入字母*/
function checkedEnglish(ele) {
    var regular = /^[A-Za-z]+$/;
    if (!(regular.test(ele))) {
        alert("只能输入字母");
    }
}
/*正则校验：只能输入小写字母*/
function checkedEnglishLower(ele) {
    var regular = /^[A-Za-z]+$/;
    if (!(regular.test(ele))) {
        alert("只能输入小写字母");
    }
}
/*正则校验：只能输入大写字母*/
function checkedEnglishCapital(ele) {
    var regular = /^[A-Z]+$/;
    if (!(regular.test(ele))) {
        alert("只能输入大写字母");
    }
}
/*正则校验：只能输入数字*/
function checkedNumber(ele) {
    var regular = /^[0-9]+$/;
    if (!(regular.test(ele))) {
        alert("只能输入数字");
    }
}
/*正则校验：不能输入特殊字符和数字*/
function checkedSpecialAndNumber(ele) {
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,/*英文字符*/
        regNB = /^[0-9]+$/,/*数字字符*/
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;/*中文字符*/

    if(regEn.test(ele) || regCn.test(ele) || regNB.test(ele)) {
        alert("不能包含特殊字符或数字");
    }
}
