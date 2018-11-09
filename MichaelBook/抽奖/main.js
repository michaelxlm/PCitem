// JavaScript Document
(function (win) {
    var degDivide = 60;//各奖品旋转角度范围60°
    var prizeName;//奖品名称
    //奖品次序及奖品名称
    var prizeTypeArr = ['继续加油！', '二等奖', '参与奖', '三等奖', '继续加油！', '一等奖'];
    //奖品编号
    var prizeTypeArrType = [0, 1, 2, 3, 4, 5];
    //奖品范围开始度数
    var prizeTypeDegArr = [[0], [60], [120], [180], [240], [300]];
    var disk = {//初始化插件参数
        prizeType: 0,
        nowDeg: 0,
        willDeg: 0,
        turnFlag: true,
        count: null,
        init: function (id, count, flag) {
            var t = this;
            //点击指定原生，触发抽奖方法
            divPointer.onclick = function () {
                t.lottery();
            }
        },
        //抽奖方法实现
        lottery: function () {
            var t = this;
            //赋值奖品编号
            t.prizeType = 3;
            t._judge();
        },
        //获取指针旋转角度数
        _judge: function () {
            var t = this,
                judgeArr = prizeTypeDegArr[t.prizeType],
                judgeArrLen = judgeArr.length;
            if (judgeArrLen == 1) {//设置旋转圈数
                t.willDeg = 1800 + judgeArr[0] + 2 + (degDivide - 4) * Math.random();
                prizeName = prizeTypeArr[t.prizeType];
            } else if (judgeArrLen > 1) {
                var judgeArrRan = Math.floor(judgeArrLen * Math.random());
                t.willDeg = 1800 + judgeArr[judgeArrRan] + 2 + (degDivide - 4) * Math.random();
                prizeName = prizeTypeArr[t.prizeType];
            } else {
                return;
            }
            t._turn();
        },
        //实现转盘旋转效果
        _turn: function () {
            var t = this;
            setTimeout(function () {
                divPointer.style.webkitTransitionTimingFunction = 'cubic-bezier(.53,.3,.24,1.01)';
                divPointer.style.webkitTransitionDuration = '2s';
                divPointer.style.webkitTransitionProperty = 'all';
                divPointer.style.webkitTransform = 'rotate(' + t.willDeg + 'deg)';

                divPointer.style.msTransitionTimingFunction = 'cubic-bezier(.53,.3,.24,1.01)';
                divPointer.style.msTransitionDuration = '2s';
                divPointer.style.msTransitionProperty = 'all';
                divPointer.style.msTransform = 'rotate(' + t.willDeg + 'deg)';

            }, 100);
            //转盘停止后操作
            setTimeout(function () {
                //未中奖显示
                if (t.prizeType == 0 || t.prizeType == 4) {
                    alert('未中奖~');
                    return false;
                } else {
                    alert('中奖了~');
                }

            }, 2100)
        }

    };
    win.disk = disk;
})(window);