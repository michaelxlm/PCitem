//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isLogin: false,//是否已绑定手机号。false：为绑定
        height: app.globalData.windowHeight - 55,
        avatarImageSrc:"/images/headImage.png",
        phone:"",
        carNumbers:[],

    },
    toMineCar: function () {
        if(this.data.isLogin){
            //点击我的车牌时，判断该用户下有无车牌
            if(this.data.carNumbers.length > 0){
                /*跳转至车牌页面*/
                wx.navigateTo({
                    url: '../carNumber/carNumber',
                });
            }else{
                /*跳转至无车牌页面*/
                wx.navigateTo({
                    url: '../noCar/noCar',
                });
            }
        }else{
            wx.showToast({
                title: '请先绑定手机号',
                icon: 'none',
                duration: 2000
            })
        }
    },
    /*跳转至意见反馈页面*/
    toFeedback: function () {
      wx.navigateTo({
        url: '../feedback/feedback',
      });
    },
    onShareAppMessage: function () {
        return {
            title: '轻停优惠券小程序',
            path: '/index/index'
        }
    },
    togoPhone: function () {
        wx.navigateTo({
            url: '../login/login',
        });
    },
    onLoad: function () {
        var vs=this;
        wx.getStorage({
            key: 'headImg',
            success: function(res) {
                if(res.data){
                    vs.setData({
                        avatarImageSrc:res.data,
                    });
                }

            }
        });
        wx.getStorage({
            key: 'phone',
            success: function(res) {
                if(res.data){
                    vs.setData({
                        phone:res.data,
                    });
                }

            }
        });
        wx.getStorage({
            key: 'carNumbers',
            success: function(res) {
                if(res.data){
                    vs.setData({
                        carNumbers:res.data,
                    });
                }

            }
        });
        /*初始化底部菜单*/
        app.editTabBar();
        /*判断是否已经绑定手机号*/
        if (true) {
            this.setData({isLogin: true});
        } else {
            this.setData({isLogin: false});
        }
    },
});
