    <%@ page language="java" contentType="text/html;charset=GBK" %>
        <%@ page import="com.ydth.ec.ActiveCard.*" %>
        <%@ page import="com.sinosoft.common.*" %>
        <%@ page import="java.util.*" %>
        <%@ page import="com.ydth.ec.ActiveCard.fco.*" %>
        <%@ page import="com.sinosoft.common.service.*" %>
            <%
String basePath = request.getContextPath();
request.setCharacterEncoding("GBK");
ActiveCardFCO fco = (ActiveCardFCO)session.getAttribute("fco");
if(fco == null){%>
        <script type="text/javascript">
        window.location.href="indexActivation.jsp";
        </script>
            <% }else {
ActiveCardService asc = ActiveCardService.getInstance();
InsuranceProductService ips = InsuranceProductService.getInstance();
InsurancePolicyService ps = InsurancePolicyService.getInstance();
ProductRule pRule = fco.getRule();
String[] showEffects = ips.getEffectDate(fco);
String effectDay = showEffects[0];
String modify = showEffects[1];
String none = showEffects[2];
String DuringTemp = pRule.get("TERM");//保险年限
String[] Duringstr = TimeSplit.parse(DuringTemp);
String DuringV = Duringstr[0];//保险年限
//int numDate = Integer.parseInt(DuringV);
String DuringTypeV =Duringstr[1];//保险类型 年 月 日
String endEffects="";
if(effectDay!=""){
endEffects = TimeSplit.add(DuringTemp,effectDay);
endEffects = Data.calDate(endEffects, -1, "D", endEffects);
}
fco.setActDateTo(endEffects);//激活截至日期存储字段
//产品id
String productId = fco.getProduct().get("PRODUCTID");
//取主卡投保人信息的实体
AppBean appBean = (AppBean)session.getAttribute("AppBean");
String Name = "";
String IDType = "";
String IDNo = "";
String Sex = "";
String BirthDay = "";
String Mobile = "";
String PostalAddress = "";
String ZipCode = "";
String Email = "";
if(appBean!=null){
Name = appBean.getName();
IDType = appBean.getIDType();
IDNo = appBean.getIDNo();
Sex = appBean.getSex();
BirthDay = appBean.getBirthDay();
Mobile = appBean.getMobile();
PostalAddress = appBean.getPostalAddress();
ZipCode = appBean.getZipCode();
Email = appBean.getEmail();
}
%>
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=gb2312">
        <meta name="keywords" content="英大泰和人寿保险股份有限公司,英大人寿,英大">
        <link href="<%=basePath %>/global/activeCardGlobal/css/ie.css" rel="stylesheet" type="text/css">
        <link href="<%=basePath %>/global/activeCardGlobal/css/common.css" rel="stylesheet" type="text/css">
        <style type="text/css">
        .btnOnMenu1{
        BACKGROUND-IMAGE: url(<%=basePath %>/global/images/menu/ECGL_card_botton_1.gif);
        BACKGROUND-REPEAT: no-repeat;
        cursor:pointer;
        HEIGHT: 24px;
        MARGIN-TOP: 2px;
        PADDING-BOTTOM: 1px;
        PADDING-LEFT: 1px;
        PADDING-RIGHT: 1px;
        PADDING-TOP: 1px;
        TEXT-ALIGN: center;
        WIDTH: 84px
        }
        .btnOnMenu2{
        BACKGROUND-IMAGE: url(<%=basePath %>/global/images/menu/ECGL_card_botton_2.gif);
        BACKGROUND-REPEAT: no-repeat;
        cursor:pointer;
        HEIGHT: 24px;
        MARGIN-TOP: 3px;
        PADDING-BOTTOM: 1px;
        PADDING-LEFT: 1px;
        PADDING-RIGHT: 1px;
        PADDING-TOP: 1px;
        TEXT-ALIGN: center;
        WIDTH: 84px
        }
        </style>
        <title>欢迎访问</title>
        <script language="javascript" src="<%=basePath %>/global/activeCardGlobal/js/Date.js"></script>
        <script language="javascript" src="<%=basePath %>/global/activeCardGlobal/js/common.js"></script>
        <script language="javascript" src="<%=basePath %>
        /global/activeCardGlobal/js/My97DatePicker/WdatePicker.js"></script>
        <script language="javascript" src="<%=basePath %>
        /global/activeCardGlobal/js/validate/validator/IDValidator.js"></script>
        <script language="javascript" src="<%=basePath %>/global/js/jquery/jquery-1.5.2.js"></script>

        <SCRIPT language="javascript">
        dent = true;
        var productId = '<%=productId%>';
        function checkIdNo(idNo) {
        var type;
        var birth;
        var sex;
        if(idNo.name == 'appIdentityNo') {
        type = document.getElementById('appIdentityType');
        birth = document.getElementById('appBirthday');
        sex = document.getElementById('appInsurantSex');
        } else if(idNo.name == 'IdentityNo') {
        type = document.getElementById('IdentityType');
        birth = document.getElementById('Birthday');
        sex = document.getElementById('InsurantSex');
        }

        var tmpStr;//生日判断
        var tmpInt;//性别判断
        var idStr = idNo.value;
        if(idStr==""){
        alert('证件号码错误');
        return;
        }
        if(type.value == '0') {
        dent = chkIDCard(idNo.value);
        if(dent == false) {
        alert('身份证错误');
        return;
        }
        if(idStr.length!=18){
        alert('身份证错误');
        return;
        }
        if (idStr.length==15){//身份证15位
        tmpStr=idStr.substring(6,12);
        tmpStr= "19" + tmpStr;
        tmpStr= tmpStr.substring(0,4) + "-" + tmpStr.substring(4,6) + "-" + tmpStr.substring(6);
        tmpInt = parseInt(idStr.substring(14));
        tmpInt = (tmpInt % 2) == 1 ? '0' : '1';
        birth.value = tmpStr;
        sex.value = tmpInt;
        }
        if(idStr.length==18){//身份证18位
        tmpStr=idStr.substring(6,14);
        tmpStr= tmpStr.substring(0,4) + "-" + tmpStr.substring(4,6) + "-" + tmpStr.substring(6);
        tmpInt = parseInt(idStr.substring(16,17));
        tmpInt = (tmpInt % 2) == 1 ? '0' : '1';
        birth.value = tmpStr;
        sex.value = tmpInt;
        //2011-01-24 身份证号码后面小写X转大写 欧阳 修改
        if(idStr.indexOf("x") == 17){
        idStr = idStr.replace("x", "X");
        idNo.value = idStr;
        }
        //结束
        }
        checkOtherAmnt();
        }
        else if(type.value == '1'){//护照
        if(!/^[A-Z]{1}\d{7}$/.test(idStr)){
        alert('护照错误');
        return;
        }
        }else if(type.value == '2'){//军官证
        if(idStr.length>18 || idStr.length<10){
        alert('军官证错误');
        return;
        }
        }else if(type.value == '5'){//户口簿
        if(idStr.length!=18){
        alert('户口簿错误');
        return;
        }
        }else if(type.value == 'c'){//台胞证
        if(idStr.length<18){
        alert('台胞证错误');
        return;
        }
        }else if(type.value == '7'){//回乡证
        if(idStr.length<18){
        alert('回乡证错误');
        return;
        }
        }else {
        checkOtherAmnt();
        dent = true;
        }
        }

        function changeRelation(iType) { //判断投被保人关系是否是本人
        if("00" == iType) {
        doSelf();
        } else {
        doOther();
        }
        }
        function doSelf() {
        var form = document.getElementById('frmInput');
        var name = form.appInsurantName.value;
        var idType = form.appIdentityType.value;
        var idNo = form.appIdentityNo.value;
        var sex = form.appInsurantSex.value;
        var birth = form.appBirthday.value;
        var phone = form.appPhone.value;
        var appMobile = form.appMobile.value;
        var applicantWorkunit = form.applicantWorkunit.value;
        var address = form.appAddress.value;
        var postalcode = form.appPostalCode.value;
        var email = form.appEmail.value;
        if("KD3310"==productId){
        var tMaritalStatus = form.tMaritalStatus.value;
        }
        form.InsurantName.value = name;
        form.IdentityType.value = idType;
        form.IdentityNo.value = idNo;
        form.InsurantSex.value = sex;
        form.Birthday.value = birth;
        form.Phone.value = phone;
        form.Mobile.value = appMobile;
        form.Address.value = address;
        form.insuredWorkunit.value = applicantWorkunit;
        form.PostalCode.value = postalcode;
        form.Email.value = email;
        if("KD3310"==productId){
        form.MaritalStatus.value = tMaritalStatus;
        }
        }

        function doOther() {
        var form = document.getElementById('frmInput');
        form.InsurantName.value = '';
        form.IdentityType.value = '';
        form.IdentityNo.value = '';
        form.InsurantSex.value = '';
        form.Birthday.value = '';
        form.Phone.value = '';
        form.Mobile.value='';
        form.Address.value= '';
        form.insuredWorkunit.value='';
        form.PostalCode.value= '';
        form.Email.value = '';
        if("KD3310"==productId){
        form.MaritalStatus.value = '';
        }
        }

        function goNext(){

        var effectiveDate = document.getElementById("effectiveDate").value;
        if(effectiveDate == ""){
        alert("生效日期不能为空");
        document.getElementById("effectiveDate").focus();
        return ;
        }

        /**防止用户选择本人,信息再次变更数据不一致**/
        var relation = document.getElementById("relation").value;
        if(relation == "00"){
        changeRelation(relation);
        }
        if(!isSelf()) {
        alert('投保人与被保人信息不一致');
        return;
        }
        if(!validate()){
        return false;
        }
        if("KD3310"==productId){
        if(!$("#tMaritalStatus").val()){
        alert("请选择投保人婚姻状况!");
        $("#tMaritalStatus").focus();
        return false;
        }
        if(!$("#MaritalStatus").val()){
        alert("请选择投保人婚姻状况!");
        $("#MaritalStatus").focus();
        return false;
        }
        if(!checkMaritalStatus()){
        return;
        }
        }
        if(!checkRelation()){
        return false;
        }
        if(!checkBC()) {
        return;
        }
        if(!checkOtherAmnt1()){
        return;
        }
        if(dent == true) {
        if(document.getElementById("relation").value == '') {
        alert('请选择与投保人关系');
        return;
        }

        document.getElementById("frmInput").target="mainFream";
        document.getElementById("frmInput").submit.click();


        } else {
        alert('不是有效身份证');
        }

        }
        // 子页面调用父页面的方法
        function dosubmit2(){
        document.getElementById('frmInput').action="MyJsp.jsp";
        document.getElementById('frmInput').target="";
        document.getElementById('frmInput').submit.click();
        }

        function isSelf() {
        var form = document.getElementById('frmInput');
        var relation=document.getElementById("relation").value;
        if(relation=='00'){ // 本人
        //投保人信息
        var appInsurantName = document.getElementById("appInsurantName").value;
        var appIdentityType = document.getElementById("appIdentityType").value ;
        var appIdentityNo = document.getElementById("appIdentityNo").value;
        var appInsurantSex = document.getElementById("appInsurantSex").value;
        var appBirthday = document.getElementById("appBirthday").value;
        var appPhone = document.getElementById("appPhone").value;
        var appAddress = document.getElementById("appAddress").value;
        var applicantWorkunit = document.getElementById("applicantWorkunit").value;
        var appEmail = document.getElementById("appEmail").value;
        if("KD3310"==productId){
        var tMaritalStatus = document.getElementById("tMaritalStatus").value;
        }
        //被保人信息
        var InsurantName = document.getElementById("InsurantName").value;
        var IdentityType = document.getElementById("IdentityType").value ;
        var IdentityNo = document.getElementById("IdentityNo").value;
        var InsurantSex = document.getElementById("InsurantSex").value;
        var Birthday = document.getElementById("Birthday").value;
        var Phone = document.getElementById("Phone").value;
        var Address = document.getElementById("Address").value;
        var insuredWorkunit = document.getElementById("insuredWorkunit").value;
        var Email = document.getElementById("Email").value;
        if("KD3310"==productId){
        var MaritalStatus = document.getElementById("MaritalStatus").value;
        }
        var judgeMaritalStatus = true;
        //如果是好孕母婴判断投被保人婚姻状态相同
        if("KD3310"==productId){
        judgeMaritalStatus = tMaritalStatus==MaritalStatus;
        }
        if(appInsurantName==InsurantName&&appIdentityType==IdentityType&&appIdentityNo==IdentityNo&&appInsurantSex==InsurantSex
        && appBirthday == Birthday
        && appPhone == Phone && appAddress == Address && applicantWorkunit == insuredWorkunit && appEmail == Email &&
        judgeMaritalStatus){
        return true;
        }else{
        return false;
        }
        }else{
        return true;
        }
        }

        function checkBC() {
        var mes = '';
        var form = document.getElementById('frmInput');
        var idType = form.appIdentityType.value;
        var idNo = form.appIdentityNo.value;
        var sex = form.appInsurantSex.value;
        var birth = form.appBirthday.value;
        if(idType == '0') {
        mes = checkapp(idNo,birth,sex);
        if(mes != '') {
        alert("投保人"+mes);
        return false;
        }
        }
        var inrIdType = form.IdentityType.value;
        var inrIdNo = form.IdentityNo.value;
        var inrSex = form.InsurantSex.value;
        var inrBirth = form.Birthday.value;
        if(inrIdType == '0') {
        mes = checkInsurant(inrIdNo,inrBirth,inrSex);
        if(mes != '') {
        alert("被保人"+mes);
        return false;
        }
        }
        return true;
        }
        //验证保险人
        function checkapp(IdentityNo,Birthday,InsurantSex){
        var mes = "";
        if ((IdentityNo != "")){
        if((IdentityNo.length!=15) && (IdentityNo.length!=18)){
        mes = "身份证号位数有误!";
        }else{
        var tmpStr;//生日判断
        var tmpInt;//性别判断

        if (IdentityNo.length==15){//身份证15位
        tmpStr=IdentityNo.substring(6,12);
        tmpStr= "19" + tmpStr;
        tmpStr= tmpStr.substring(0,4) + "-" + tmpStr.substring(4,6) + "-" + tmpStr.substring(6);
        tmpInt = parseInt(IdentityNo.substring(14));
        tmpInt = tmpInt % 2;
        }
        if(IdentityNo.length==18){//身份证18位
        tmpStr=IdentityNo.substring(6,14);
        tmpStr= tmpStr.substring(0,4) + "-" + tmpStr.substring(4,6) + "-" + tmpStr.substring(6);
        tmpInt = parseInt(IdentityNo.substring(16,17));
        tmpInt = tmpInt % 2;
        }
        if (InsurantSex != ""){//输入性别
        if (InsurantSex=="0" && tmpInt==0){//男
        mes = "性别与身份证号信息不一致！";
        }else if(InsurantSex=="1" && tmpInt!=0){//女
        mes = "性别与身份证号信息不一致！";
        }
        }
        if (Birthday != "" && Birthday != tmpStr){//输入生日
        mes = "生日与身份证号信息不一致！";
        }
        }
        }
        return mes;
        }


        //验证被保险人
        function checkInsurant(IdentityNo,Birthday,InsurantSex){
        var mes = "";
        if ((IdentityNo != "")){
        if((IdentityNo.length!=15) && (IdentityNo.length!=18)){
        mes = "身份证号位数有误!";
        }else{
        var tmpStr;//生日判断
        var tmpInt;//性别判断

        if (IdentityNo.length==15){//身份证15位
        tmpStr=IdentityNo.substring(6,12);
        tmpStr= "19" + tmpStr;
        tmpStr= tmpStr.substring(0,4) + "-" + tmpStr.substring(4,6) + "-" + tmpStr.substring(6);
        tmpInt = parseInt(IdentityNo.substring(14));
        tmpInt = tmpInt % 2;
        }
        if(IdentityNo.length==18){//身份证18位
        tmpStr=IdentityNo.substring(6,14);
        tmpStr= tmpStr.substring(0,4) + "-" + tmpStr.substring(4,6) + "-" + tmpStr.substring(6);
        tmpInt = parseInt(IdentityNo.substring(16,17));
        tmpInt = tmpInt % 2;
        }
        if (InsurantSex != ""){//输入性别
        if (InsurantSex=="0" && tmpInt==0){//男
        mes = "性别与身份证号信息不一致！";
        }else if(InsurantSex=="1" && tmpInt!=0){//女
        mes = "性别与身份证号信息不一致！";
        }
        }
        if (Birthday != "" && Birthday != tmpStr){//输入生日
        mes = "生日与身份证号信息不一致！";
        }
        }
        }
        return mes;
        }

        function hasRelated(box) {
        if(box.checked) {
        box.value = '1';
        } else {
        box.value = '0';
        }
        }
        function checkRelation(){

        var relation=document.getElementById("relation").value;
        var appSex = document.getElementById("appInsurantSex").value;
        var insSex = document.getElementById("InsurantSex").value;
        if("KD1002"==productId||"KD1003"==productId){
        var dateValue=document.getElementById("Birthday").value;
        var re = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
        var date = dateValue.match(re);
        var birthday = new Date(date[1], date[3]-1, date[4]);
        var now = new Date();
        var age=getAge(birthday,now);
        if(age<18){
        if(relation=="01"||relation=="02"||relation=="03"||relation=="04"){
        if(appSex=='0'&&insSex=='0'&&relation!='01'){//投保人性别为男
        alert("投保人与被保人应为父子关系!");
        return false;
        }else if(appSex=='0'&&insSex=='1'&&relation!='02'){//投保人性别为女
        alert("投保人与被保人应为父女关系!");
        return false;
        }else if(appSex=='1'&&insSex=='0'&&relation!='03'){//投保人性别为女
        alert("投保人与被保人应为母子关系!");
        return false;
        }else if(appSex=='1'&&insSex=='1'&&relation!='04'){//投保人性别为女
        alert("投保人与被保人应为母女关系!");
        return false;
        }
        }else{
        alert("被保险人为未成年人，投保人必须是被保险人父母!");
        return false;
        }
        }else{
        if(relation!='00'){ // 本人
        alert("投保人与被保险人必须为同一人!");
        return false;
        }
        }
        }
        return true;
        }
        //失去焦点方法
        function checkOtherAmnt(){
        var assuredBirthday1 = document.getElementById("Birthday").value;
        if(assuredBirthday1!=null){
        var r = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
        var date = assuredBirthday1.match(r);
        var birthday = new Date(date[1], date[3]-1, date[4]);
        var now = new Date();
        var age=getAge(birthday,now);
        if(age<18){
        document.getElementById("t").style.display="";
        }else{
        document.getElementById("t").style.display="none";
        }
        }else{
        document.getElementById("t").style.display="none";
        }
        }
        //提交时再次校验
        function checkOtherAmnt1(){
        var re = /^\d+$/;
        var OtherAmnt = document.getElementById("OtherAmnt");
        if(OtherAmnt != null){
        OtherAmnt = OtherAmnt.value;
        } else {
        return true;
        }

        if(document.getElementById("t").style.display==""){
        if(OtherAmnt == ""){
        alert("未成年人在其他保险公司已承保或正在申请的人身保险身故保额合计为空!");
        document.getElementById("OtherAmnt").focus();
        return false;
        }else if(re.test(OtherAmnt)){
        return true;
        }else{
        alert("未成年人在其他保险公司已承保或正在申请的人身保险身故保额合计格式不正确，请填写正整数!");
        document.getElementById("OtherAmnt").focus();
        return false;
        }
        }
        checkOtherAmnt();
        return true;
        }
        /*计算年龄
        * date1 出生日期
        * date2 当前日期
        */
        function getAge(date1,date2){
        var s1 = date1.getFullYear();
        var s2 = date1.getMonth()+1;
        var s3 = date1.getDate();
        var e1 = date2.getFullYear();
        var e2 = date2.getMonth()+1;
        var e3 = date2.getDate();
        var diffYears = e1 - s1;
        if(e2<s2 || (e2==s2 && e3<s3))diffYears = diffYears - 1;
        return diffYears;
        }

        /**
        * 母婴产品校验是否已婚
        */
        function checkMaritalStatus(){
        if($("#MaritalStatus").val()==""){
        alert("请选择婚姻状况!");
        $("#MaritalStatus").focus();
        return false;
        }else if($("#MaritalStatus").val()==1){
        if($("#InsurantSex").val()==1){
        return true;
        }else{
        alert("本产品只能女性购买!");
        $("#InsurantSex").focus();
        return false;
        }
        }else{
        alert("婚姻状况为已婚方能购买本产品!");
        $("#MaritalStatus").focus();
        return false;
        }
        }
        </SCRIPT>
        </head>
        <%@include file="../../../global/activeCardGlobal/js/validate/validate.jsp" %>
        <body leftmargin=0 topmargin=0 bgcolor="WHITE" LINK="BALCK" ALINK="#005826" VLINK="#197B30">
        <center>
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td height="126" colspan="4">
        <%@include file="/global/inc/head.jsp" %>
        </td>
        </tr>
        <tr>
        <td height="100%" valign="top">
        <%@include file="../../../product/leftPanel.jsp" %>
        </td>
        <td width="634" bgcolor=#e5efee>
        <table width=100% height=100% cellspacing=0 cellpadding=0 border=0 bordercolor=red>
        <tr>
        <td valign=top>
        <table height=100% width="813" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr height="26" style="font-size:12px; color:#00726f; text-align:right; padding:3px 30px 0 0;
        background:#eff7e8;">
        <td><img src="/ecydth/global/images/yd_ico_round.gif" border="0"/>&nbsp;&nbsp;您的位置：&nbsp;<a
        href="/ecydth/index.jsp" class="mid_t_top_a">首页</a>&nbsp;>>&nbsp;<a href="#" class="mid_t_top_a">卡单激活</a></td>
        </tr>

        <tr>
        <td colspan=2 valign=top align=center>
        <table width=634 cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td colspan=6>
        <!-- 卡单激活开始 -->
        <br>

            <%
                                                    HashMap hm0 = fco.getApplicantFormMap();
                                                    %>
        <form id="frmInput" action="rInsurantActivate.jsp" method="post" >
        <table width="634" border="0" align="center" cellpadding="0" cellspacing="0" >
        <tr>
        <td height=30>
        <table class=table_Show cellSpacing=0 cellPadding=0 width="634" border=0>
        <tr>
        <td align=left width=30 height=20></td>
        <td height=20></td>
        </tr>
        </table>
        <tr>
        <td height=9><img src="<%=basePath %>\global\activeCardGlobal\images\calculator_con_top.jpg"></td></tr>
        <tr>
        <td class=two_happy_nr_border2 align=left height=25 style="font-size=14px; color:#f16220;
        font-weight:bold;">&nbsp;>>&nbsp;在线激活步骤：</td></tr>
        <tr>
        <td class=two_happy_nr_border vAlign=top height=50>
        <table cellSpacing=0 cellPadding=0 border=0>
        <tr>
        <td class=jhk_s1 align=left>
        <table cellSpacing=0 cellPadding=0 width="100%" border=0>
        <tr>
        <td class=s1_font align=left width=40></td>
        <td class=s1_font align=left><B>输入</B><BR>卡号</td>
        </tr>
        </table>
        </td>
        <td align=left width=30><img src="<%=basePath %>/global/activeCardGlobal/images/steparr.jpg"></td>
        <td class=jhk_s2 align=left>
        <table cellSpacing=0 cellPadding=0 width="100%" border=0>
        <tr>
        <td class=s1_font align=left width=40></td>
        <td class=s1_font align=left><B>阅读</B><BR>相关条款</td>
        </tr>
        </table>
        </td>
        <td align=left width=30><img src="<%=basePath %>/global/activeCardGlobal/images/steparr.jpg"></td>
        <td class=jhk_s3 align=left>
        <table cellSpacing=0 cellPadding=0 width="100%" border=0>
        <tr>
        <td class=s1_font align=left width=40></td>
        <td class=s1_font_on align=left style="color:red;"><B>输入</B><BR>激活信息</td>
        </tr>
        </table>
        </td>
        <td align=left width=30><img src="<%=basePath %>/global/activeCardGlobal/images/steparr.jpg"></td>
        <td class=jhk_s4 align=left>
        <table cellSpacing=0 cellPadding=0 width="100%" border=0>
        <tr>
        <td class=s1_font align=left width=40></td>
        <td class=s1_font align=left><B>输入</B><BR>密码</td>
        </tr>
        </table>
        </td>
        <td align=left width=30><img src="<%=basePath %>/global/activeCardGlobal/images/steparr.jpg"></td>
        <td class=jhk_s5 align=left>
        <table cellSpacing=0 cellPadding=0 width="100%" border=0>
        <tr>
        <td class=s1_font align=left width=40></td>
        <td class=s1_font align=left><B>完成</B><BR>保险卡激活</td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td class=ca_top_font height=30 align=left style="padding-left:20px;"><img src="<%=basePath %>
        \global\activeCardGlobal\images\calculator_con_tri.jpg">&nbsp;请填写"<%=fco.getProduct().get("PRODUCTNAME") %>
        "的投被保人详细资料</td>
        </tr>
        <tr>
        <td align=center>
            <%
                                                                    if(hm0 != null){
                                                                    int widthOfName0 = 140;
                                                                    int widthOfValue0 = 200;
                                                                    String tmp = "";
                                                                    %>
        <table width="634" border="0" cellspacing="0" cellpadding="0" style="font-size:9pt;line-height:16pt;">
        <tr><td height=9><img src="<%=basePath %>\global\activeCardGlobal\images\calculator_con_top.jpg"></td></tr>
        <tr>
        <td width="615" height=30 class="two_happy_nr_border2" style="font-size=14px; color:#f16220;
        font-weight:bold;">&nbsp;保险期间</td>
        </tr>
        <tr>
        <td colspan="3" align="center" valign=top class="r_mid_table_bg" height="46">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td width="140" class="r_mid_table_font1">
        生效日期：
        </td>
        <td width="220" align=left>
            <%
                                                                                            //如果生效方式2 指定类型
                                                                                            String appway  = fco.getRule().get("APPOINTEFFECTWAY");
                                                                                            if("2".equals(appway)){
                                                                                            %>
        <input type="text" name="effectiveDate" id="effectiveDate"<%= modify %>
        value="<%= effectDay %>">
        <img<%= none %>
        name="button2" onclick="WdatePicker({el:$dp.$('effectiveDate'),minDate:'%y-%M-#{%d+1}'})" src="<%=basePath %>
        /global/activeCardGlobal/js/date/skin/datePicker.gif" alt="日历" height="22" align="absmiddle"/>&nbsp;<font
        class=ca_font>零时</font>
            <% }else{ %>
        <input type="text" name="effectiveDate" id="effectiveDate"<%= modify %>
        value="<%= effectDay %>" style="border:0 solid; background:#f5f4f2;" class=ca_font >&nbsp;<font
        class=ca_font>零时</font>
            <%
                                                                                            }
                                                                                            %>

        </td>
        <td width="100" align=left class="r_mid_table_font2"></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>


            <%
                                                                        if(!"".equals(endEffects)){
                                                                        %>

        <tr>
        <td colspan="3" align="center" valign=top class="r_mid_table_bg" height="46">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td width="140" class="r_mid_table_font1">
        生效止期：
        </td>
        <td width="220" align=left class=ca_font>
            <%=endEffects  %>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font class=ca_font>二十四时止</font>
        </td>

        <td width="100" align=left class="r_mid_table_font2"></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>


            <%
                                                                        }
                                                                        %>
        <tr>
        <td colspan="3" align="center" valign=top class="r_mid_table_bg" height="46">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td width="140" class="r_mid_table_font1">
        保险期间：
        </td>
        <td width="200" align=left class=ca_font >
            <%=DuringV  %>
            <%if(DuringTypeV.equals("d")){%>天<%}%>
            <%if(DuringTypeV.equals("m")){ %>月<%}%>
            <%if(DuringTypeV.equals("y")){ %>年<%}%>

        </td>
        <td width="100" align=left class="r_mid_table_font2"></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td colspan="3" align="center" height="40" valign=top class="r_mid_content_bg">
        <table width=100% cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align=left width="30" height="40" valign="middle" class="borderline2">&nbsp;<img
        src="../../../global/activeCardGlobal/images/ico_r_success.jpg"/></td>
        <td align=left class="borderline2" valign="middle" style="border-right:1px solid #E2E2E2;">&nbsp;<font
        color="#d7150c">投保人信息</font>
        </td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        String tagCn = "(必填)";
                                                                        if(hm0.containsKey("Name")){
                                                                        tagCn = "1".equals(hm0.get("Name").toString())?"(必填)":"";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appInsurantName");
        </script>
            <%	}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1"
        nowrap="nowrap">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</td>
        <td width="<%=widthOfValue0%>" class="" nowrap="nowrap" align="left">
            <%if(!"".equals(Name)){ %>
        <span class="r_mid_table_font1"><%=Name %></span>
        <input name="appInsurantName" id="appInsurantName" type="hidden" value="<%=Name %>">
            <%}else{ %>
        <input name="appInsurantName" id="appInsurantName" type="text" class="" size="25" maxlength="20">
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" class="r_mid_table_font2" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("IdType")){
                                                                        tagCn = "1".equals(hm0.get("IdType").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appIdentityType");
        </script>
            <%}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">证件类型：</td>
        <td width="<%=widthOfValue0%>" align=left>
            <%if(!"".equals(IDType)){
                                                                                            String IDTypeShow = "";
                                                                                            if("0".equals(IDType)){
                                                                                            IDTypeShow = "身份证";
                                                                                            }else if("1".equals(IDType)){
                                                                                            IDTypeShow = "护照";
                                                                                            }else if("2".equals(IDType)){
                                                                                            IDTypeShow = "军官证";
                                                                                            }else if("7".equals(IDType)){
                                                                                            IDTypeShow = "回乡证";
                                                                                            }else if("c".equals(IDType)){
                                                                                            IDTypeShow = "台胞证";
                                                                                            }else if("8".equals(IDType)){
                                                                                            IDTypeShow = "其他";
                                                                                            }
                                                                                            %>
        <span class="r_mid_table_font1"><%=IDTypeShow %></span>
        <input name="appIdentityType" id="appIdentityType" type="hidden" value="<%=IDType %>">
            <%}else{ %>
        <select id="appIdentityType" name="appIdentityType" class="link">
        <option value="">请选择</option>
        <option value="0">身份证</option>
        <option value="1">护照</option>
        <option value="2">军官证</option>
        <option value="7">回乡证</option>
        <option value="c">台胞证</option>
        <option value="8">其他</option>
        <!-- <option value="3">驾照</option>-->
        <!-- <option value="9">数据转换证件</option>-->
        </select>
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("IdNumber")){
                                                                        tagCn = "1".equals(hm0.get("IdNumber").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appIdentityNo");
        </script>
            <%}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">证件号码：</td>
        <td width="<%=widthOfValue0%>" align=left>
            <%if(!"".equals(IDNo)){ %>
        <span class="r_mid_table_font1"><%=IDNo %></span>
        <input name="appIdentityNo" id="appIdentityNo" type="hidden" value="<%=IDNo %>">
            <%}else{ %>
        <input id="appIdentityNo" name="appIdentityNo" type="text" class="" maxlength="30" size="25"
        onblur="checkIdNo(this);">
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("Sex")){
                                                                        tagCn = "1".equals(hm0.get("Sex").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appInsurantSex");
        </script>
            <%}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">性&nbsp;&nbsp;&nbsp;&nbsp;别：</td>
        <td width="<%=widthOfValue0%>" class="" align=left>
            <%if(!"".equals(Sex)){
                                                                                            String sexShow = "";
                                                                                            if("0".equals(Sex)){
                                                                                            sexShow = "男";
                                                                                            }else if("1".equals(Sex)){
                                                                                            sexShow = "女";
                                                                                            }
                                                                                            %>
        <span class="r_mid_table_font1"><%=sexShow %></span>
        <input name="appInsurantSex" id="appInsurantSex" type="hidden" value="<%=Sex %>">
            <%}else{ %>
        <select name="appInsurantSex" id="appInsurantSex" >
        <option value="">请选择</option>
        <option value="0">男</option>
        <option value="1">女</option>
        </select>
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("Birthday")){
                                                                        tagCn = "1".equals(hm0.get("Birthday").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appBirthday");
        </script>
            <%	}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
            <%if(productId.equals("KD3310")){%>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>

        <tr align="center" class="" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">婚&nbsp;&nbsp;&nbsp;&nbsp;否：</td>
        <td width="<%=widthOfValue0%>" class="" align=left>
        <select id="tMaritalStatus" name="tMaritalStatus" class="">
        <option value="">请选择</option>
        <option value="0">未婚</option>
        <option value="1">已婚</option>
        <option value="2">丧偶</option>
        <option value="3">分居</option>
        <option value="4">再婚</option>
        <option value="5">同居</option>
        <option value="6">离婚</option>
        <option value="7">单身</option>
        </select>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>


        </table>
        </td>
        </tr>
            <% } %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">出生日期：</td>
        <td width="<%=widthOfValue0%>" class="" nowrap="nowrap" align=left>
            <%if(!"".equals(BirthDay)){ %>
        <span class="r_mid_table_font1"><%=BirthDay %></span>
        <input name="appBirthday" id="appBirthday" type="hidden" value="<%=BirthDay %>">
            <%}else{ %>
        <input name="appBirthday" id="appBirthday" type="text" readonly class="" size="12" >
        <img onclick="WdatePicker({el:$dp.$('appBirthday'),maxDate:'%y-%M-%d'})" src="<%=basePath %>
        /global/activeCardGlobal/js/date/skin/datePicker.gif" alt="日历" height="22"
        align="absmiddle"/>&nbsp;&nbsp;&nbsp;&nbsp;
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%
                                                                        if(hm0.containsKey("Phone")){
                                                                        tagCn = "1".equals(hm0.get("Phone").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm0.get("Phone").toString())){ //必填项
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appPhone");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">&nbsp;联系电话：</td>
        <td width="<%=widthOfValue0%>" align=left nowrap="nowrap" >
        <input name="appPhone" id="appPhone" type="text" class="" maxlength="15" size="25"></td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("Mobile")){
                                                                        tagCn = "1".equals(hm0.get("Mobile").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm0.get("Mobile").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appMobile");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">&nbsp;手机号码：</td>
        <td width="<%=widthOfValue0%>" align=left nowrap="nowrap" >
            <%if(!"".equals(Mobile)){ %>
        <span class="r_mid_table_font1"><%=Mobile %></span>
        <input name="appMobile" id="appMobile" type="hidden" value="<%=Mobile %>">
            <%}else{ %>
        <input name="appMobile" id="appMobile" type="text" class="" maxlength="11" size="25" ></td>
            <%} %>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("Address")){
                                                                        tagCn = "1".equals(hm0.get("Address").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm0.get("Address").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appAddress");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>

        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">联系地址：</td>
        <td width="<%=widthOfValue0%>" align=left>
            <%if(!"".equals(PostalAddress)){ %>
        <span class="r_mid_table_font1"><%=PostalAddress %></span>
        <input name="appAddress" id="appAddress" type="hidden" value="<%=PostalAddress %>">
            <%}else{ %>
        <input name="appAddress" id="appAddress" type="text" class="" maxlength="40" size="25" >
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
        <!-- 投保人个人单位 -->
            <%
                                                                        if(hm0.containsKey("Workunit")){
                                                                        tagCn = "1".equals(hm0.get("Workunit").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm0.get("Workunit").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("applicantWorkunit");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>

        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">个人单位：</td>
        <td width="<%=widthOfValue0%>" align=left>
        <input name="applicantWorkunit" id="applicantWorkunit" type="text" class="" maxlength="40" size="25" >
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("Zipcode")){
                                                                        tagCn = "1".equals(hm0.get("Zipcode").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm0.get("Zipcode").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appPostalCode");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>

        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">邮政编码：</td>
        <td width="<%=widthOfValue0%>" align=left>
            <%if(!"".equals(ZipCode)){ %>
        <span class="r_mid_table_font1"><%=ZipCode %></span>
        <input name="appPostalCode" id="appPostalCode" type="hidden" value="<%=ZipCode %>">
            <%}else{ %>
        <input name="appPostalCode" id="appPostalCode" type="text" class="" maxlength=6 size="25" >
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm0.containsKey("Email")){
                                                                        tagCn = "1".equals(hm0.get("Email").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm0.get("Email").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("appEmail");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" height="46">
        <td align="center" width="<%=widthOfName0%>" class="r_mid_table_font1">电子邮件：</td>
        <td width="<%=widthOfValue0%>" align=left>
            <%if(!"".equals(Email)){ %>
        <span class="r_mid_table_font1"><%=Email %></span>
        <input name="appEmail" id="appEmail" type="hidden" value="<%=Email %>">
            <%}else{ %>
        <input name="appEmail" id="appEmail" type="text" class="" size="25" >
            <%} %>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

        </table>
            <%
                                                                    }
                                                                    %>

        <!-- 被保人 -->

            <%
                                                                    HashMap hm = fco.getInsuredFormMap();

                                                                    if(hm != null){
                                                                    int iwidthOfName = 140;
                                                                    int iwidthOfValue = 200;
                                                                    String tmp = "";
                                                                    %>
        <table width="634" border="0" cellspacing="0" cellpadding="0" style="font-size:9pt;line-height:16pt;">
        <tr>
        <td colspan="3" align="center" height="40" valign=top class="r_mid_content_bg">
        <table width=100% cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align=left width="30" height="40" valign="middle" class="borderline2">&nbsp;<img
        src="../../../global/activeCardGlobal/images/ico_r_success.jpg"/></td>
        <td align=left class="borderline2" valign="middle" style="border-right:1px solid #E2E2E2;">&nbsp;<font
        color="#d7150c">被保人信息</font>
        </td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        ActivationItem activeItem = new ActivationItem();
                                                                        String options = activeItem.makeInsurantTypeOption(fco.getProduct().get("ID"));
                                                                        String tagCn = "(必填)";

                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("relation");
        </script>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" height="40" width="140" class="r_mid_table_font1" nowrap="nowrap">与投保人关系：</td>
        <td align="left" width="200" nowrap="nowrap" >
        <select name="relation" id="relation" onchange="changeRelation(this.value);">
        <option value="">请选择</option>
            <%= options %>
        </select>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%

                                                                        if(hm.containsKey("Name")){
                                                                        tagCn = "1".equals(hm.get("Name").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("InsurantName");
        </script>
            <%	}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1"
        nowrap="nowrap">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</td>
        <td width="<%=iwidthOfValue%>" class="" nowrap="nowrap" align="left"><input name="InsurantName"
        id="InsurantName" type="text" class="" size="25" maxlength="20" >
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" class="r_mid_table_font2" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%
                                                                        if(hm.containsKey("IdType")){
                                                                        tagCn = "1".equals(hm.get("IdType").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("IdentityType");
        </script>
            <%}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>

        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">证件类型：</td>
        <td width="<%=iwidthOfValue%>" align=left>
        <select name="IdentityType" id="IdentityType" class="link" >
        <option value="">请选择</option>
        <option value="0">身份证</option>
        <option value="1">护照</option>
        <option value="2">军官证</option>
        <option value="4">出生证明</option>
        <option value="5">户口簿</option>
        <option value="7">回乡证</option>
        <option value="c">台胞证</option>
        <!-- option value="3">驾照</option>-->
        <!--<option value="9">数据转换证件</option>-->
        <option value="8">其他</option>
        </select>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%
                                                                        if(hm.containsKey("IdNumber")){
                                                                        tagCn = "1".equals(hm.get("IdNumber").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("IdentityNo");
        </script>
            <%}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>

        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">证件号码：</td>
        <td width="<%=iwidthOfValue%>" align=left>
        <input name="IdentityNo" id="IdentityNo" type="text" class="" size="25" onblur="checkIdNo(this);" >
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%
                                                                        if(hm.containsKey("Sex")){
                                                                        tagCn = "1".equals(hm.get("Sex").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("InsurantSex");
        </script>
            <%}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>


        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">性&nbsp;&nbsp;&nbsp;&nbsp;别：</td>
        <td width="<%=iwidthOfValue%>" class="" align=left>
        <select name="InsurantSex" id="InsurantSex" class="">
        <option value="">请选择</option>
        <option value="0">男</option>
        <option value="1">女</option>
        </select>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>

        </table>
        </td>
        </tr>


            <%if(productId.equals("KD3310")){%>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>

        <tr align="center" class="" height="46">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">婚&nbsp;&nbsp;&nbsp;&nbsp;否：</td>
        <td width="<%=iwidthOfValue%>" class="" align=left>
        <select id="MaritalStatus" name="MaritalStatus" class="">
        <option value="">请选择</option>
        <option value="0">未婚</option>
        <option value="1">已婚</option>
        <option value="2">丧偶</option>
        <option value="3">分居</option>
        <option value="4">再婚</option>
        <option value="5">同居</option>
        <option value="6">离婚</option>
        <option value="7">单身</option>
        </select>
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>


        </table>
        </td>
        </tr>
            <% } %>

            <%
                                                                        if(hm.containsKey("Birthday")){
                                                                        tagCn = "1".equals(hm.get("Birthday").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("Birthday");
        </script>
            <%	}else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" class="" height="46">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">出生日期：</td>
        <td width="<%=iwidthOfValue%>" class="" nowrap="nowrap" align=left>
        <input name="Birthday" id="Birthday" type="text" value="" readonly class="" onblur="checkOtherAmnt()" size="12">
        <img onclick="WdatePicker({el:'Birthday',maxDate:'%y-%M-%d'})" src="<%=basePath %>
        /global/activeCardGlobal/js/date/skin/datePicker.gif" style="cursor: pointer;" alt="日历" height="22"
        align="absmiddle"/>&nbsp;&nbsp;&nbsp;&nbsp;
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%
                                                                        if(hm.containsKey("Phone")){
                                                                        tagCn = "1".equals(hm.get("Phone").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm.get("Phone").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("Phone");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">联系电话：</td>
        <td width="<%=iwidthOfValue%>" align=left nowrap="nowrap">
        <input name="Phone" id="Phone" type="text" class="" maxlength="15" size="25">
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm.containsKey("Mobile")){
                                                                        tagCn = "1".equals(hm.get("Mobile").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm.get("Mobile").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("Mobile");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">手机号码：</td>
        <td width="<%=iwidthOfValue%>" align=left nowrap="nowrap">
        <input name="Mobile" id="Mobile" type="text" class="" maxlength="11" size="25" >
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%
                                                                        if(hm.containsKey("Address")){
                                                                        tagCn = "1".equals(hm.get("Address").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm.get("Address").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("Address");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>

        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">联系地址：</td>
        <td width="<%=iwidthOfValue%>" align=left nowrap="nowrap">
        <input name="Address" id="Address" type="text" class="" size="25">
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
        <!-- 个人单位 -->
            <%
                                                                        if(hm.containsKey("Workunit")){
                                                                        tagCn = "1".equals(hm.get("Workunit").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm.get("Workunit").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("insuredWorkunit");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>

        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr align="center" height="46">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">个人单位：</td>
        <td width="<%=iwidthOfValue%>" align=left>
        <input name="insuredWorkunit" id="insuredWorkunit" type="text" class="" maxlength="40" size="25">
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%
                                                                        if(hm.containsKey("Zipcode")){
                                                                        tagCn = "1".equals(hm.get("Zipcode").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm.get("Zipcode").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("PostalCode");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tmp = "none";
                                                                        tagCn = "";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">邮政编码：</td>
        <td width="<%=iwidthOfValue%>" align=left nowrap="nowrap">
        <input name="PostalCode" id="PostalCode" type="text" class="" maxlength=6 size="25" >
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>

            <%
                                                                        if(hm.containsKey("Email")){
                                                                        tagCn = "1".equals(hm.get("Email").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm.get("Email").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("Email");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tagCn = "";
                                                                        tmp = "none";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr style="display:<%=tmp%>">
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">电子邮件：</td>
        <td width="<%=iwidthOfValue%>" align=left nowrap="nowrap">
        <input name="Email" id="Email" type="text" class="" size="25">
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%if(productId.equals("KD1002")||productId.equals("KD1003")){ %>
        <tr id="t" style="display: none;">
        <td colspan="3" align="center" height="40" valign=top class="r_mid_table_bg">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align="center" width="<%=iwidthOfName%>" class="r_mid_table_font1">未成年人在其他保险公司以承保或正在申请的人身保险身故保额合计：</td>
        <td width="<%=iwidthOfValue%>" align=left nowrap="nowrap">
        <input name="OtherAmnt" id="OtherAmnt" type="text" class="" size="25">
        </td>
        <td width="100" align=left class="r_mid_table_font2"><font color="RED">万元(必填)</font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>
            <%} %>
            <%
                                                                        //职业等级
                                                                        if(hm0.containsKey("OccuptionType")){
                                                                        tagCn = "1".equals(hm0.get("OccuptionType").toString())?"(必填)":"";
                                                                        tmp = "";
                                                                        if("1".equals(hm0.get("OccuptionType").toString())){
                                                                        %>
        <script type="text/javascript">
        requiredValidator.add("occTypeCode");
        </script>
            <%
                                                                        }
                                                                        }else{
                                                                        tagCn = "";
                                                                        tmp = "none";
                                                                        }
                                                                        %>
        <tr style="display:<%=tmp%>">
        <td colspan="3" align="center" height="100" valign=top class="r_mid_table_bg" style="background:#F5F4F2;">
        <table width="634" cellspacing=0 cellpadding=0 border=0>
        <tr style="display:<%=tmp%>">
        <td align="center" width="<%=iwidthOfName%>" nowrap="nowrap" style="vertical-align:middle; font-size:12px;
        color:#403f3b; padding-right:10px; text-align:right;">职业等级：</td>
        <td width="200" align=right nowrap="nowrap">
            <%
                                                                                            Occupation occupation = new Occupation();
                                                                                            occupation.set("Coderate","1");
                                                                                            String str = occupation.find(occupation,0,1);
                                                                                            String[] strClass = str.split(",");
                                                                                            %>
        <br>
        <select name="Bigclass" id="Bigclass" style="width:280px;" onchange="doFindMidClass()" >
        <option value="">请选择大类</option>
            <%
                                                                                                for(int i = 0; i < strClass.length; i++) {
                                                                                                occupation.init(strClass[i]);
                                                                                                String bigclass=occupation.get("Bigclass");
                                                                                                String bigclassname=occupation.get("Occupationname");
                                                                                                %>
        <option value="<%= bigclass %>"><%= bigclass+ bigclassname %></option>
            <%
                                                                                                }
                                                                                                %>
        </select>
        <br>
        <select name="Midclass" id="Midclass" style="width:280px;" onchange="doFindLittleClass()">
        <option value="">请选择中类</option>
        </select>
        <br>
        <input type="hidden" name="midclassNum" id="Midclass" >
        <select name="Littleclass" id="Littleclass" style="width:280px;" onchange="doFindOccuCode()">
        <option value="">请选择小类</option>
        </select>
        <br>
        <select name="occTypeCode" id="occTypeCode" style="width:280px;" onchange="doFindOccrate()">
        <option value="">请选择职业</option>
        </select>
        <br>
        <input type="hidden" name="occCode" id="occCode" >

        <input type="hidden" name="occTypeCodeRate" id="occTypeCodeRate" >
        </td>


        <td width="120" align=left class="r_mid_table_font2"><font color="RED"><%= tagCn %></font></td>
        <td width="5" align=left></td>
        </tr>
        </table>
        </td>
        </tr>


        <!-- end -->

        <tr>
        <td colspan="3" align="left" height="40" valign=top class="r_mid_content_bg">
        <table width=100% cellspacing=0 cellpadding=0 border=0>
        <tr>
        <td align=left width="30" height="40" valign="middle" class="borderline2">&nbsp;<img
        src="../../../global/activeCardGlobal/images/ico_r_success.jpg"/></td>
        <td align=left width="600" class="borderline2" valign="middle" style="border-right:1px solid
        #E2E2E2;">&nbsp;<font color="#d7150c">受益人</font>
        </td>
        </tr>

        <tr>
        <td colspan="3" align="left" height="40" valign=top class="r_mid_table_bg" style="padding-left:75px;
        font-size:12px;">
        身故受益人为法定继承人
        </td>
        </tr>


        </table>
        </td>
        </tr>
        </table>
        <table width="634" border="0" cellspacing="0" cellpadding="0" style="font-size:9pt;line-height:16pt;">
        <tr>
        <td colspan="3" align=center valign="top" class="r_mid_content_foot_bg">
        <table border=0 cellpadding=0 cellspacing=0>
        <tr>
        <td height=20></td>
        </tr>
        <tr>
        <td class="btn_ent" align="center" onclick="window.location.href='cleanSession.jsp'">取消</td>
        <td width=50></td>
        <td id="gotoNext" class="btn_ent" align="center" onclick="goNext();">下一步</td>
        </tr>
        </table>
        </td>
        </tr>
        </table>

        <input type=reset id="reset" style="display:none">
        <input type=submit id="submit" style="display:none">
        </td>
        </tr>
        </table>
        </form>


        <iframe style="" name="SearchOccuNo" id="SearchOccuNo" src="" height=0 width=0></iframe>
        <!-- 卡单激活结束 -->
        </td>
        </tr>
        </table>

        </td>
        </tr>

        </table>


        </tr>
        </table>
        </td>
        <td></td>
        </tr>
        </table>
        <table width="1000" cellspacing="0" cellpadding="0" border="0">
        <tr>
        <td>

        </td>
        </tr>
        <tr>
        <td colspan="3">
        <%@include file="/global/inc/copyright.jsp" %>
        </td>
        </tr>
        </table>
        <iframe id="myFrame" style="display:none" width=200 height=200></iframe>
        <iframe id="mainFream" name="mainFream" style="display:none" width=200 height=200></iframe>
        </center>
        </body>
        <script type="text/javascript">
        // **********************************职业等级代码××××××××××××××××××××××××××××××××//
        var strGetMid="";
        var strOcCode="";
        var strOcCodeRate="";
        function doFindMidClass(){

        var str=document.getElementById('Bigclass').value;
        try
        {
        document.all.myFrame.src="getMid.jsp?Bigclass="+str;
        }catch(e)
        {
        alert(e.description);
        }


        }


        function doBranch(){

        document.getElementById("Midclass").innerHTML = "";
        document.getElementById("Midclass").style.display="";
        document.getElementById("Midclass").options[0] = new Option("请选择中类","");
        document.getElementById("Littleclass").innerHTML = "";
        document.getElementById("Littleclass").style.display="";
        document.getElementById("Littleclass").options[0] = new Option("请选择小类","");
        document.getElementById("occTypeCode").innerHTML = "";
        document.getElementById("occTypeCode").style.display="";
        document.getElementById("occTypeCode").options[0] = new Option("请选择职业","");
        if(strGetMid==""){
        document.getElementById("Midclass").options[0] = new Option("请选择","");
        return;
        }else{

        var tmp = strGetMid.split(",");
        //document.getElementById("Midclass").options[0] = new Option("请选择","");
        for(count=0;count<tmp.length;count++){
        document.getElementById("Midclass").options[count+1] = new Option(tmp[count],tmp[count]);
        }
        }


        }


        function doFindLittleClass(){
        var bigstr=document.getElementById('Bigclass').value;
        var str=document.getElementById('Midclass').value;
        //传递参数 做为三级联动参数
        str= str.substr(0,3);
        document.all.myFrame.src="getCreate.jsp?Bigclass="+bigstr+"&Midclass="+str;
        document.getElementById("midclassNum").value=str;
        }
        function doLittleBranch(){
        document.getElementById("Littleclass").innerHTML = "";
        document.getElementById("Littleclass").style.display="";
        document.getElementById("occTypeCode").innerHTML = "";
        document.getElementById("occTypeCode").style.display="";
        document.getElementById("occTypeCode").options[0] = new Option("请选择职业","");
        if(strGetLittle==""){
        document.getElementById("Littleclass").options[0] = new Option("请选择小类","");
        return;
        }else{
        var tmp = strGetLittle.split(",");
        document.getElementById("Littleclass").options[0] = new Option("请选择小类","");
        for(count=0;count<tmp.length;count++){
        document.getElementById("Littleclass").options[count+1] = new Option(tmp[count],tmp[count]);
        }
        }


        }
        function dosave(){

        var str=document.getElementById("Littleclass").value;
        //传递参数 做为三级联动参数
        str= str.substr(0,5);
        // alert(str);
        document.getElementById("litttleNum").value=str;
        }
        function doFindOccuCode(){
        var litCode = document.getElementById("Littleclass").value;
        //传递参数 做为四级联动参数
        litCode= litCode.substr(0,5);
        document.all.myFrame.src="getOccCode.jsp?litCode="+litCode;


        }
        function doOccCodeBranch(){
        document.getElementById("occTypeCode").innerHTML = "";
        document.getElementById("occTypeCode").style.display="";

        if(strOcCode==""){
        document.getElementById("occTypeCode").options[0] = new Option("请选择职业","");
        return;
        }else{
        var tmp = strOcCode.split(",");
        document.getElementById("occTypeCode").options[0] = new Option("请选择职业","");
        for(count=0;count<tmp.length;count++){
        document.getElementById("occTypeCode").options[count+1] = new Option(tmp[count],tmp[count]);
        }
        }

        }
        function doOccCodeStr2(){
        var strOcCode = document.getElementById("occTypeCode").value;
        strOcCode = strOcCode.substr(0,7);
        document.getElementById("occCode").value=strOcCode;
        }

        function doFindOccrate(){
        doOccCodeStr2();
        var occCode = document.getElementById("occTypeCode").value;
        //传递参数 做为四级联动参数
        occCode= occCode.substr(0,7);
        document.all.myFrame.src="getOccCoderate.jsp?occCoderate="+occCode;
        }
        function doOccCodeRateBranch(){
        document.getElementById("occTypeCodeRate").value=strOcCodeRate;
        }

        function doOccCodeStr(){
        var strOcCode = document.getElementById("occTypeCode").value;
        strOcCode = strOcCode.substr(0,7);
        document.getElementById("occCode").value=strOcCode;
        }
        </script>
        <script type="text/javascript">
        regexValidator.set(new RegExp("^$|^[u4e00-u9fa5·0-9A-z]{4,22}$"), "请输入 投保人真实姓名").add("appInsurantName");
        regexValidators[0].set(new RegExp("^$|^[u4e00-u9fa5·0-9A-z]{4,22}$"), "请输入被保人真实姓名").add("InsurantName");
        regexValidators[1].set(new RegExp("^$|^[A-Za-z0-9\u4e00-\u9fa5_()-]+$"),
        "请不要输入特殊字符，例如：%#@等").add("appIdentityNo");
        numValidator.add("appPhone");
        numValidator.add("Phone");
        regexValidators[2].set(new RegExp("^$|^[0-9]{11}$"), "只能输入11位的数字").add("appMobile");
        regexValidators[3].set(new RegExp("^$|^[0-9]{11}$"), "只能输入11位的数字").add("Mobile");
        regexValidators[4].set(new RegExp("^$|^[A-Za-z0-9\u4e00-\u9fa5_()-＃#]+$"), "请不要输入特殊字符，例如：%@等").add("Address");
        regexValidators[5].set(new RegExp("^$|^[A-Za-z0-9\u4e00-\u9fa5_()-＃#]+$"),
        "请不要输入特殊字符，例如：%@等").add("appAddress");
        regexValidators[6].set(new RegExp("^$|^[A-Za-z0-9\u4e00-\u9fa5_()-]+$"), "请不要输入特殊字符，例如：%#@等").add("IdentityNo");
        regexValidators[7].set(new RegExp("^$|^[0-9]{6}$"), "只能输入6位的数字").add("appPostalCode");
        regexValidators[8].set(new RegExp("^$|^[0-9]{6}$"), "只能输入6位的数字").add("PostalCode");
        regexValidators[9].set(new RegExp("^$|^[A-Za-z0-9\u4e00-\u9fa5_()-]+$"),
        "请不要输入特殊字符，例如：%#@等").add("applicantWorkunit");
        regexValidators[10].set(new RegExp("^$|^[A-Za-z0-9\u4e00-\u9fa5_()-]+$"),
        "请不要输入特殊字符，例如：%#@等").add("insuredWorkunit");
        emailValidator.add("appEmail");
        emailValidator.add("Email");
        // regexValidators[11].set(new RegExp("^$|^[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\\.[a-zA-Z0-9_-]+$"),
        "非法的邮箱格式,请修改").add("appEmail");
        // regexValidators[12].set(new RegExp("^$|^[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\\.[a-zA-Z0-9_-]+$"),
        "非法的邮箱格式,请修改").add("Email");
        validateIsDisplayAllError = false; //按顺序验证
        // validateErrorMsgDisplayStyle = 'alert';
        </script>
        </html>
            <%}
}%>














