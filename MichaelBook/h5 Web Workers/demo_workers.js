/**
 * Created by minchael on 2017/7/4.
 */
var i=0;

function timedCount()
{
    i=i+1;
    postMessage(i);/*用于向 HTML 页面传回一段消息。*/
    setTimeout("timedCount()",500);
}

timedCount();