/**
 * Created by minchael on 2018/1/26.
 */
/*RGB颜色转换为16进制*/
function colorHex(ele) {
    var that = ele;
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0, len = aColor.length; i < len; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var k = 0, lens = aNum.length; k < lens; k += 1) {
                numHex += (aNum[k] + aNum[k]);
            }
            return numHex;
        }
    } else {
        return that;
    }
}

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
function colorRgb(ele) {
    var sColor = ele.toLowerCase();
    console.log(/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(sColor));
    if (sColor && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var j = 1; j < 7; j += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(j, j + 2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
}