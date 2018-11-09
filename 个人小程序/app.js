//app.js
const common = require('utils/common.js');
App({
    /*保存个人数据信息*/
    setStorageInfo: function (list) {
        console.log("获取用户信息");
        console.log(list);
        wx.setStorage({
            key: "encryptedData",
            data: list.encryptedData
        });
        wx.setStorage({
            key: "iv",
            data: list.iv
        });
        wx.setStorage({
            key: "signature",
            data: list.signature
        });
        wx.setStorage({
            key: "nickname",
            data: list.userInfo.nickName
        });
        wx.setStorage({
            key: "headImg",
            data: list.userInfo.avatarUrl
        });
    },
    onLaunch: function () {
        var that = this;
        // 登录
        that.globalData.tabbar.list[1].pagePath = "/pages/login/login";

        /*获取手机系统信息*/
        wx.getSystemInfo({
            success: function (res) {
                console.log("获取手机系统信息");
                console.log(res);
                that.globalData.windowWidth = res.windowWidth;
                that.globalData.windowHeight = res.windowHeight;
            }
        });

    },

    editTabBar: function () {
        var tabbar = this.globalData.tabbar,
            currentPages = getCurrentPages(),
            _this = currentPages[currentPages.length - 1],
            pagePath = _this.__route__;
        (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
        for (var i in tabbar.list) {
            tabbar.list[i].selected = false;
            (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
        }
        _this.setData({
            tabbar: tabbar
        });
    },
    globalData: {
        windowWidth: 0,
        windowHeight: 0,
        tabbar: {
            color: "#000000",
            selectedColor: "#ffffff",
            backgroundColor: "#ffffff",
            borderStyle: "#ddd",
            position: "bottom",
            list: [
                {
                    pagePath: "/pages/index/index",
                    text: "",
                    iconPath: "/images/IndexSelect.png",
                    selectedIconPath: "/images/IndexSelected.png",
                    selected: true
                },
                {
                    pagePath: "/pages/mine/mine",
                    text: "",
                    iconPath: "/images/mineSelect.png",
                    selectedIconPath: "/images/mineSelected.png",
                    selected: false
                }
            ]
        },
    },
});