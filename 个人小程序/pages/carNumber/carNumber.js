const common = require('../../utils/common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showAdd: false,//增加车牌部分是否显示
        carNumber: '',//input框的车牌
        carNumberList: [],//车牌号列表
        phone: "",//手机号
        provinceArray: ["京", "津", "冀", "晋", "蒙", "辽", "吉", "黑", "沪", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤", "桂", "琼", "渝", "川", "黔", "滇", "藏", "陕", "甘", "青", "宁", "新", "台", "港", "澳", "使"],//省份列表
        index: 0,//省份下标
        couponList:[],//优惠券数据
    },
    // picker改变下标
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        });
    },
    // 车牌改变值时并且小写变大写
    carInput: function (e) {
        var value = e.detail.value;
        this.setData({
            carNumber: value.toUpperCase()
        });
        return {
            value: value.toUpperCase()
        }
    },
    returnData: function (list,states) {
        var listStrings = '';
        list.map(function (item) {
            listStrings += item.carNumber + ',';
        });
        listStrings = listStrings.substring(0, listStrings.length - 1);
        var phoneNum = this.data.phone;
        /*保存最新的车牌列表*/
        wx.request({
            url: common.basePath + 'QTCoupon/user/modifyCarNumbers',
            data: {
                carNumbers: listStrings,//车牌列表
                phone: phoneNum,//手机号
            },
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if(res.data.return_code=="200"){
                    if(states=="add"){
                        wx.showToast({
                            title: '添加成功！',
                            icon: 'none'
                        });
                        setTimeout(function(){
                            wx.hideToast()
                        },2000);
                    }
                    if(states=="del"){
                        wx.showToast({
                            title: '删除成功！',
                            icon: 'none'
                        });
                        setTimeout(function(){
                            wx.hideToast()
                        },2000);
                    }
                    wx.setStorage({
                        key: "carNumbers",
                        data: list
                    });
                }else{
                    if(states=="add"){
                        wx.showToast({
                            title: '添加失败！',
                            icon: 'none'
                        });
                        setTimeout(function(){
                            wx.hideToast()
                        },2000);
                    }
                    if(states=="del"){
                        wx.showToast({
                            title: '删除失败！',
                            icon: 'none'
                        });
                        setTimeout(function(){
                            wx.hideToast()
                        },2000);
                    }
                }
            }
        });
    },
    // 点击车牌兑换券
    carNumberClick: function (e) {
        var carNumber = e.currentTarget.dataset.carnumber;
        console.log(carNumber);
        var that = this;
        var id='';
        if(that.data.couponList.length>0){
            id=that.data.couponList[0].id;
        }else{
            wx.showToast({
                title: '您暂时未有优惠券！',
                icon: 'none'
            });
            setTimeout(function(){
                wx.hideToast()
            },2000);
            return;
        }

        var storeName='';
        if(that.data.couponList[0].storeName){
            storeName=that.data.couponList[0].storeName;
        }
        console.log(carNumber);
        console.log(that.data.phone);
        console.log(id);
        wx.request({
            url: common.basePath + 'QTCoupon/coupon/useCoupon?carNumber='+carNumber+"&phone="+that.data.phone+"&couponId="+id,
       /*     data: {
                carNumber: carNumber,//车牌列表
                phone: that.data.phone,//手机号
                couponId: id,//优惠券id
            },*/
            method: 'GET',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                if(res.data.return_code==="200"){
                    /*使用成功*/
                    wx.navigateTo({
                        url: '../useSuccess/useSuccess?plate='+carNumber+'&store='+storeName+'&useTime=当日24:00之前',
                    });
                }else if(res.data.return_code==="300"){
                    /*使用失败-车辆不在场*/
                    wx.navigateTo({
                        url: '../useFailCar/useFailCar'
                    })
                }else if(res.data.return_code==="301"){
                    /*使用失败-网络连接失败*/
                    wx.navigateTo({
                        url: '../useFail/useFail',
                    })
                }
            }
        });
    },
    // 删除车牌号
    deleteCar: function (e) {
        var sm = this;
        var carNumber = e.currentTarget.dataset.carnumber;
        var list = sm.data.carNumberList;
        list.map(function (item, index) {
            if (item.carNumber === carNumber) {
                list.splice(index, 1);
            }
        });
        this.setData({
            carNumberList: list
        });
        if (list.length >= 1) {
            this.setData({
                showAdd: true
            });
        } else {
            this.setData({
                showAdd: false
            });
        }
        this.returnData(list,"del");
    },
    // 点击确认增加车牌
    addClick: function () {
        var car = this.data.provinceArray[this.data.index] + this.data.carNumber;
        console.log(car);
        var carReg = /^[A-Z]{1}[A-Z0-9]{5}$/;
        var carRegS = /^[0-9]{6}$/;
        if (this.data.carNumber == "") {
            wx.showToast({
                title: '车牌号不能为空！',
                icon: 'none'
            });
            setTimeout(function(){
                wx.hideToast()
            },2000);
        } else {
            if (this.data.provinceArray[this.data.index] == "使") {
                if (!carRegS.test(this.data.carNumber)) {
                    wx.showToast({
                        title: '请输入正确的车牌号！',
                        icon: 'none'
                    });
                    setTimeout(function(){
                        wx.hideToast()
                    },2000);
                } else {
                    var list = this.data.carNumberList;
                    list.push({
                        carNumber: car
                    });
                    this.setData({
                        carNumberList: list,
                        carNumber: '',
                        index: 0
                    });
                    if (this.data.carNumberList.length >= 1) {
                        this.setData({
                            showAdd: true
                        });
                    } else {
                        this.setData({
                            showAdd: false
                        });
                    }
                    this.returnData(list,"add");
                }
            } else {
                if (!carReg.test(this.data.carNumber)) {
                    wx.showToast({
                        title: '请输入正确的车牌号！',
                        icon: 'none'
                    });
                    setTimeout(function(){
                        wx.hideToast()
                    },2000);
                    this.setData({
                        carNumber: ""
                    });
                    console.log(this.data)
                } else {
                    var list = this.data.carNumberList;
                    list.push({
                        carNumber: car
                    });
                    this.setData({
                        carNumberList: list,
                        carNumber: '',
                        index: 0
                    });
                    if (this.data.carNumberList.length >= 1) {
                        this.setData({
                            showAdd: true
                        });
                    } else {
                        this.setData({
                            showAdd: false
                        });
                    }
                    this.returnData(list,"add");
                }
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var sm = this;
        /*获取车牌信息*/
        wx.getStorage({
            key: 'carNumbers',
            success: function (res) {
                console.log(res.data);
                if (res.data.length > 0) {
                    sm.setData({
                        carNumberList: res.data
                    });
                }
                if (res.data.length >= 1) {
                    sm.setData({
                        showAdd: true
                    });
                } else {
                    sm.setData({
                        showAdd: false
                    });
                }
            }
        });
        /*获取手机号*/
        wx.getStorage({
            key: 'phone',
            success: function (res) {
                console.log(res.data);
                sm.setData({
                    phone: res.data
                });
            }
        });
        /*获取优惠券数据*/
        wx.getStorage({
            key: 'couponList',
            success: function (res) {
                console.log(res.data);
                sm.setData({
                    couponList: res.data
                });
            }
        });

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '轻停优惠券小程序',
            path: '/index/index'
        }
    }
});