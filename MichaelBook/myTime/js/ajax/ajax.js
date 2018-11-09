/**
 * Created by minchael on 2018/3/6.
 */
function NTAjax(params) {
    $.ajax({
        type: params.type == undefined ? 'post' : params.type,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: params.url == undefined ? '#' : params.url,
        cache: params.cache == undefined ? false : params.cache,
        async: params.async == undefined ? true : params.async,
        data: params.data == undefined ? null : params.data,
        dataType: params.dataType == undefined ? 'json' : params.dataType,
        contentType: "application/json",
        success: function (data) {
            return data;
        },
        error: function (data) {
            return data;
        }
    });
}