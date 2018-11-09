var interval = null;
const common = require('../../utils/common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        code: '',
        disable: false,
        codeText: '获取验证码',
        currentTime: 60,
        VerificationCode: "",//返回的验证码值
        openId: "",
        unionId: "",
        headImg: "",
        nickname: "",
    },
    mobileInput: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    /**
     * 点击发送验证码，先验证手机号格式，验证通过发送验证码
     */
    sendCode: function () {
        var mobile = this.data.mobile;
        var mobileReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
        if (mobile == '') {
            wx.showToast({
                title: '手机号不能为空！',
                icon: 'none'
            });
        } else {
            if (!mobileReg.test(mobile)) {
                wx.showToast({
                    title: '手机号有误！',
                    icon: 'none'
                });
            } else {
                var that = this;
                this.getCode();
                /*发送验证码接口*/
                wx.request({
                    url: common.basePath + 'QTCoupon/user/getVerificationCode',
                    data: {
                        phone: mobile,
                    },
                    method: "GET",
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                        if (res.data.return_code === "200") {//成功
                            wx.showToast({
                                title: '短信发送成功请注意查收！',
                                icon: 'none'
                            });
                            setTimeout(function(){
                                wx.hideToast()
                            },2000);
                            console.log(res.data.result.code);
                            that.setData({
                                VerificationCode: res.data.result.code,
                            })
                        }else if(res.data.return_code === "400"){
                            wx.showToast({
                                title: '短信发送失败！',
                                icon: 'none'
                            });
                            setTimeout(function(){
                                wx.hideToast()
                            },2000);
                        }

                    }
                });
                that.setData({
                    disabled: true
                })
            }
        }
    },
    getCode: function () {
        var that = this;
        var currentTime = that.data.currentTime;
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                codeText: currentTime + "秒"
            });
            if (currentTime <= 0) {
                clearInterval(interval);
                that.setData({
                    codeText: "重新发送",
                    currentTime: 60,
                    disabled: false
                });
            }
        }, 1000);
    },
    codeInput: function (e) {
        this.setData({
            code: e.detail.value
        })
    },
    next: function () {
        var sm=this;
        if (this.data.code == this.data.VerificationCode) {
            /*注册用户并返回全部用户信息*/
            wx.request({
                url: common.basePath + 'QTCoupon/user/register',
                data: {
                    phone: sm.data.mobile,
                    openId:sm.data.openId,
                    unionId: sm.data.unionId,
                    headImg: sm.data.headImg,
                    nickname: sm.data.nickname,
                },
                method: "GET",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (result) {
                    console.log(result);
                    var res=result.data;
                    if (res.return_code === "200") {//成功
                        wx.showToast({
                            title: '注册成功！',
                            icon: 'none'
                        });
                        setTimeout(function(){
                            wx.hideToast()
                        },2000);
                        wx.setStorage({
                            key: "phone",
                            data: sm.data.mobile
                        });
                        wx.reLaunch({
                            url: '../carNumber/carNumber'
                        });
                    } else if (res.return_code === "300") {//该手机号已经被注册
                        wx.showToast({
                            title: '该手机号已经被注册！',
                            icon: 'none'
                        });
                        setTimeout(function(){
                            wx.hideToast()
                        },2000);
                    } else if (res.return_code === "400") {//服务端异常
                        wx.showToast({
                            title: '服务器异常，请稍后重试！',
                            icon: 'none'
                        });
                        setTimeout(function(){
                            wx.hideToast()
                        },2000);
                    }
                }
            });
        } else {
            wx.showToast({
                title: '验证码有误！',
                icon: 'none'
            });
            setTimeout(function(){
                wx.hideToast()
            },2000);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var sm=this;
        wx.getStorage({
            key: 'openId',
            success: function(res) {
                console.log(res.data);
                sm.setData({
                    openId: res.data,
                });
            }
        });
        wx.getStorage({
            key: 'UnionId',
            success: function(res) {
                console.log(res.data);
                sm.setData({
                    unionId: res.data,
                });
            }
        });
        wx.getStorage({
            key: 'headImg',
            success: function(res) {
                console.log(res.data);
                sm.setData({
                    headImg: res.data,
                });
            }
        });
        wx.getStorage({
            key: 'nickname',
            success: function(res) {
                console.log(res.data);
                sm.setData({
                    nickname: res.data,
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

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