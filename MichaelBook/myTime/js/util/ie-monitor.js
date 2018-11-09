/**

 * 添加监听事件的方法

 * @param ele  {htmlElement} target

 * @param eType {string} eventType,事件类型

 * @param handler {function} 事件处理方法

 */
var addHandler=document.body.addEventListener ?

    function(ele,eType,handler){//主流浏览器

        ele.addEventListener(eType,handler,false);

    }:

    function(ele,eType,handler){//IE

        ele.attachEvent("on" + eType,handler);

    };
/**

 *  移除事件的监听方法

 * @param ele  {htmlElement} target

 * @param eType {string} eventType,事件类型

 * @param handler  {function} 事件处理方法

 */
var removeHandler=document.body.removeEventListener ?

    function(ele,eType,handler){

        ele.removeEventListener(eType,handler,false);

    }:

    function(ele,eType,handler){

        ele.detachEvent("on" + eType,handler);

    };
