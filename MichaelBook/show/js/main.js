var timeDifferenceTimer, timer;
$(function () {
    timeDifferenceTimer = setInterval(function () {
        var acquaintanceTime = timeDifference('2006/09/01 00:00:00');
        $("#Adays").html(acquaintanceTime.days);
        $("#Ahours").html(acquaintanceTime.hours);
        $("#Aminutes").html(acquaintanceTime.minutes);
        $("#Aseconds").html(acquaintanceTime.seconds);
        var vindicationTime = timeDifference('2013/1/11 20:00:00');
        $("#Vdays").html(vindicationTime.days);
        $("#Vhours").html(vindicationTime.hours);
        $("#Vminutes").html(vindicationTime.minutes);
        $("#Vseconds").html(vindicationTime.seconds);
    }, 1000);
});
/*点击开启信封*/
function startFunc() {
    $(".startDiv").css("display", "none");
    $(".contentDiv").css("display", "block");
    contentDivShow();
}
/*打开信封文字展示*/
function contentDivShow() {
    $.ajax({
        type: 'get',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'json/tsconfig.json',
        cache: false,
        async: true,
        data: null,
        dataType: 'json',
        success: function (object) {
            if (object.text) {
                var text = object.text.value;
                var inputText = $("#inputText");
                inputText.focus();
                var i = 0;
                timer = setInterval(function () {
                    inputText.val(text.substring(0, i));
                    inputText.focus();
                    i++;
                    inputText.height(inputText[0].scrollHeight);
                    if (text == inputText.val()) {
                        clearInterval(timer);
                        inputText.blur();
                    }
                }, 500);
            }
        },
        error: function (e) {
            console.log(e);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // net::ERR_CONNECTION_REFUSED 发生时，也能进入
        console.log(textStatus);
    });
}
/*计算两个时间相差
 * startDate:2015/05/01 00:00:00
 * */
function timeDifference(startDate) {
    var date1 = startDate;  //开始时间
    var date2 = new Date();    //结束时间
    var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}
/*页面关闭时执行方法*/
function htmlOnUnload() {
    timer && clearInterval(timer);
    timeDifferenceTimer && clearInterval(timeDifferenceTimer);
}