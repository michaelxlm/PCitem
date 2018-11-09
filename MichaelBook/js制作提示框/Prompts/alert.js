/**
 * Created by xuliming on 2017/11/24.
 */
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
    alertModelDiv.style.padding = "2%";
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
/*弹出式提示框--带有单个按钮*/
function alertModelButton(ele, buttonText, func) {
    addMask();//添加遮罩层
    var alertModelDiv = document.createElement("div");
    alertModelDiv.style.position = "fixed";
    alertModelDiv.style.top = "35%";
    alertModelDiv.style.left = "36%";
    alertModelDiv.style.width = "28%";
    alertModelDiv.style.color = "black";
    alertModelDiv.style.background = "rgba(255,255,255,1)";
    alertModelDiv.style.borderRadius = "4px";
    alertModelDiv.style.padding = "2%";
    alertModelDiv.style.textAlign = "center";
    alertModelDiv.style.lineHeight = "28px";
    document.body.appendChild(alertModelDiv);
    addModelP(ele, alertModelDiv);
    addModelButton(buttonText, func, alertModelDiv);

}
/*添加遮罩层*/
function addMask() {
    var addMaskDiv = document.createElement("div");
    addMaskDiv.style.position = "fixed";
    addMaskDiv.style.top = "0";
    addMaskDiv.style.left = "0";
    addMaskDiv.style.right = "0";
    addMaskDiv.style.bottom = "0";
    addMaskDiv.style.background = "rgba(0,0,0,0.7)";
    document.body.appendChild(addMaskDiv);
}
/*添加button按钮*/
function addModelButton(ele, func, modelDiv) {
    var alertModelButton = document.createElement("button");
    alertModelButton.innerText = ele;
    alertModelButton.style.borderRadius = "4px";
    alertModelButton.style.padding = "4px 12px";
    alertModelButton.style.background = "orange";
    alertModelButton.style.color = "white";
    alertModelButton.style.border = "none!important";
    alertModelButton.style.margin = "6px auto";
    alertModelButton.onclick = func;
    modelDiv.appendChild(alertModelButton);
}
/*添加文本内容
 * ele:文本内容
 * modelDiv:添加到上层的div
 * */
function addModelP(ele, modelDiv) {
    var alertModelP = document.createElement("p");
    alertModelP.innerHTML = ele;
    modelDiv.appendChild(alertModelP);
}