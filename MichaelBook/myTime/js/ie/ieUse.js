/**
 * Created by minchael on 2018/2/27.
 */
/*解决ie下console不兼容问题*/
/*window._console = window.console;//将原始console对象缓存
window.console = (function (orgConsole) {
    return {//构造的新console对象
        log: getConsoleFn("log"),
        debug: getConsoleFn("debug"),
        info: getConsoleFn("info"),
        warn: getConsoleFn("warn"),
        exception: getConsoleFn("exception"),
        assert: getConsoleFn("assert"),
        dir: getConsoleFn("dir"),
        dirxml: getConsoleFn("dirxml"),
        trace: getConsoleFn("trace"),
        group: getConsoleFn("group"),
        groupCollapsed: getConsoleFn("groupCollapsed"),
        groupEnd: getConsoleFn("groupEnd"),
        profile: getConsoleFn("profile"),
        profileEnd: getConsoleFn("profileEnd"),
        count: getConsoleFn("count"),
        clear: getConsoleFn("clear"),
        time: getConsoleFn("time"),
        timeEnd: getConsoleFn("timeEnd"),
        timeStamp: getConsoleFn("timeStamp"),
        table: getConsoleFn("table"),
        error: getConsoleFn("error"),
        memory: getConsoleFn("memory"),
        markTimeline: getConsoleFn("markTimeline"),
        timeline: getConsoleFn("timeline"),
        timelineEnd: getConsoleFn("timelineEnd")
    };
    function getConsoleFn(name) {
        console.log("！！");
        return function actionConsole() {
            console.log("！！！");
            if (typeof (orgConsole) !== "object") return;
            if (typeof (orgConsole[name]) !== "function") return;//判断原始console对象中是否含有此方法，若没有则直接返回
            return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数
        };
    }
}(window._console));*/
window.console = window.console || (function () {
        var c ={};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile= c.clear = c.exception = c.trace = c.assert = function(){};
        return c;
    })();
if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback){
        for (var i = 0; i < this.length; i++){
            callback.apply(this, [this[i], i, this]);
        }
    };
}
/*处理forEach兼容ie8*/



console.log("兼容ie了！！！！");
/*
 * window[ "eval" ].call( window, data ); 语法错误
 在IE浏览器中js报这个错，其实只要将js中所写的注释去掉就可以了。
 */
// 如果不支持placeholder，用jQuery来完成
if (!isSupportPlaceholder()) {
    // 遍历所有input对象, 除了密码框
    $('input').not("input[type='password']").each(
        function () {
            var self = $(this);
            var val = self.attr("placeholder");
            input(self, val);
        }
    );

    /**
     *  对password框的特殊处理
     * 1.创建一个text框
     * 2.获取焦点和失去焦点的时候切换
     */
    $('input[type="password"]').each(
        function () {
            var pwdField = $(this);
            var pwdVal = pwdField.attr('placeholder');
            var pwdId = pwdField.attr('id');
            // 重命名该input的id为原id后跟1
            pwdField.after('<input id="' + pwdId + '1" type="text" value=' + pwdVal + ' autocomplete="off" />');
            var pwdPlaceholder = $('#' + pwdId + '1');
            pwdPlaceholder.show();
            pwdField.hide();

            pwdPlaceholder.focus(function () {
                pwdPlaceholder.hide();
                pwdField.show();
                pwdField.focus();
            });

            pwdField.blur(function () {
                if (pwdField.val() == '') {
                    pwdPlaceholder.show();
                    pwdField.hide();
                }
            });
        }
    );
}

// 判断浏览器是否支持placeholder属性
function isSupportPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
}

// jQuery替换placeholder的处理
function input(obj, val) {
    var $input = obj;
    var value = val;
    $input.attr({value: val});
    $input.focus(function () {
        if ($input.val() == value) {
            $(this).attr({value: ""});
        }
    }).blur(function () {
        if ($input.val() == "") {
            $(this).attr({value: value});
        }
    });
}