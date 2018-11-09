/*AudioContext书写点击音*/
function audioContent() {
    // 创建音频上下文
    var audioCtx = new AudioContext();
// 创建音调控制对象
    var oscillator = audioCtx.createOscillator();
// 创建音量控制对象
    var gainNode = audioCtx.createGain();
// 音调音量关联
    oscillator.connect(gainNode);
// 音量和设备关联
    gainNode.connect(audioCtx.destination);
// 音调类型指定为正弦波
    oscillator.type = 'sine';
// 设置音调频率
    oscillator.frequency.value = 196.00;
// 先把当前音量设为0
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
// 0.01秒时间内音量从刚刚的0变成1，线性变化
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
// 声音走起
    oscillator.start(audioCtx.currentTime);
// 1秒时间内音量从刚刚的1变成0.001，指数变化
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
// 1秒后停止声音
    oscillator.stop(audioCtx.currentTime + 1);
}
(function () {
    var dogBarkingBuffer = null;
// Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    /*获取音乐链接地址*/
    var musicList = [];
    $.ajax({
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923',
        type: "get",
        dataType: 'jsonp',
        jsonp: "jsonpCallback",
        scriptCharset: 'GBK',//解决中文乱码
        success: function (data) {
            //最新音乐数据
            console.log(data);
            for (var i = 0; i < data.songlist.length; i++) {
                musicList.push({
                    url: 'http://isure.stream.qqmusic.qq.com/C100' + data.songlist[i].data.songmid + '.m4a?fromtag=0&guid=126548448'
                });
            }
            loadDogSound(musicList[0].url);
        },
        error: function (e) {
            console.log('error');
        }
    });
    console.log(musicList);
    function createXHR() {
        if (typeof XMLHttpRequest != "undefined") {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != "undefined") {
            if (typeof arguments.callee.activeXString != "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];

                for (var i = 0, len = versions.length; i < len; i++) {
                    try {
                        var xhr = new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        return xhr;
                    } catch (ex) {
                        //跳过
                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error("NO XHR object available");
        }
    }

    function loadDogSound(url) {//加载音频
        var request = createXHR();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.setRequestHeader("Access-Control-Allow-Origin", "http://ws.stream.qqmusic.qq.com/");
        // Decode asynchronously
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                dogBarkingBuffer = buffer;
                console.log(dogBarkingBuffer);
            }, onError);
        };
        request.send(null);
    }

})();