var base = {
    baseURL: "http://10.6.240.172:8080/wechat/"
};
function NTAjax(params, func) {
    $.ajax({
        type: params.type == undefined ? 'post' : params.type,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: params.url == undefined ? '#' : base.baseURL + params.url,
        cache: params.cache == undefined ? false : params.cache,
        async: params.async == undefined ? true : params.async,
        data: params.data == undefined ? null : params.data,
        dataType: params.dataType == undefined ? 'json' : params.dataType,
        success: func,
        error: func
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // net::ERR_CONNECTION_REFUSED 发生时，也能进入
        alertModelAutomatic("网络出错");
    });
}
/*定时隐藏弹出框*/
function alertModelAutomatic(ele) {
    var alertModelDiv = document.createElement("div");
    alertModelDiv.setAttribute("id", "alertModelAutomaticId");
    alertModelDiv.style.position = "fixed";
    alertModelDiv.style.top = "35%";
    alertModelDiv.style.left = "36%";
    alertModelDiv.style.width = "28%";
    alertModelDiv.style.color = "white";
    alertModelDiv.style.background = "rgba(0,0,0,0.6)";
    alertModelDiv.style.borderRadius = "4px";
    alertModelDiv.style.padding = "2% 4%";
    alertModelDiv.style.textAlign = "center";
    alertModelDiv.style.lineHeight = "28px";
    document.body.appendChild(alertModelDiv);
    var alertModelP = document.createElement("p");
    alertModelP.setAttribute("id", "alertModelAutomaticIdP");
    alertModelP.innerHTML = ele;
    alertModelDiv.appendChild(alertModelP);
    setTimeout(function () {
        document.body.removeChild(alertModelDiv);
    }, 1500);
}
