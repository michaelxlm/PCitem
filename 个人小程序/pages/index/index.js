//index.js
//获取应用实例
const common = require('../../utils/common.js');
const app = getApp();
Page({
    data: {
        userSates: false,//判断用户是否注册
        hasUserInfo: true,//判断用户是否授权
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        height: app.globalData.windowHeight - 55,
    },
    onShareAppMessage: function () {
        return {
            title: '轻停优惠券小程序',
            path: '/index/index'
        }
    },
    getInFo: function () {
        var that = this;
        wx.login({
            success: loginRes => {
                console.log(loginRes);
                /*获取openID和unionID*/
                if (loginRes.code) {
                    // 获取用户信息
                    wx.getSetting({
                        success: getSetRes => {
                            if (getSetRes.authSetting['scope.userInfo']) {
                                that.setData({
                                    hasUserInfo: true
                                });
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                                wx.getUserInfo({
                                    success: getUserInfoRes => {
                                        // 可以将 res 发送给后台解码出 unionId
                                        app.setStorageInfo(getUserInfoRes);
                                    }
                                })
                            } else {
                                that.setData({
                                    hasUserInfo: false
                                });
                                console.log("未授权")
                            }
                        }
                    });
                }
            }
        });
    },
    onLoad: function () {
        var sm = this;
        app.editTabBar();
        sm.getInFo();
        if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                sm.setData({
                    hasUserInfo: true
                });
                app.setStorageInfo(res);
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    sm.setData({
                        hasUserInfo: true
                    });

                    app.setStorageInfo(res);
                }
            })
        }
    },
    getUserInfoFunc: function (e) {
        var sm = this;
        console.log(e);
        if (e.detail.userInfo) {
            sm.setData({
                hasUserInfo: true
            });
            app.setStorageInfo(e.detail);
        } else {
            sm.setData({
                hasUserInfo: false
            });
            console.log('执行到这里，说明拒绝了授权');
            wx.showToast({
                title: "为了您更好的体验,请先同意授权",
                icon: 'none',
                duration: 2000
            });
        }

    }
});
