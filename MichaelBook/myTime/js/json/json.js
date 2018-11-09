/**
 * 应该使用json3格式
 */
/* json*/
var json=function (ele) {
    JsStrings:{
        /*
         * JSON.parse()
         * 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。
         * 提供可选的reviver函数用以在返回之前对所得到的对象执行变换(操作)。
         * */
        JSON.parse(ele, function (key, value) {
            if (key === "") {
                return value;
            } else {
                return value;
            }
        });
    }
    JsonString:{
        /*
         * JSON.stringify()
         * 方法是将一个JavaScript值(对象或者数组)转换为一个 JSON字符串，
         * 如果指定了replacer是一个函数，则可以替换值，
         * 或者如果指定了replacer是一个数组，可选的仅包括指定的属性。
         * */
        JSON.stringify(ele, function (key, value) {
            if (typeof value === "string") {
                return undefined;
            }
            return value;
        });
    }

};