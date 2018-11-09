const common = require('../../utils/common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textarea: '',
        contact: '',
        modalShow: true,
        phone: ""
    },
    textareaInput: function (e) {
        this.setData({
            textarea: e.detail.value
        });
    },
    contactInput: function (e) {
        this.setData({
            contact: e.detail.value
        });
    },
    onLoad: function () {
        var vs = this;
        wx.getStorage({
            key: 'phone',
            success: function (res) {
                if (res.data) {
                    vs.setData({
                        phone: res.data,
                    });
                }
            }
        });
    },
    // 提交反馈
    subFeedback: function () {
        var that = this;
        if (this.data.textarea == "") {
            wx.showToast({
                title: '反馈内容不得为空!',
                icon: 'none',
                duration: 2000
            });
        } else {
            /*意见反馈接口*/
            wx.request({
                url: common.basePath + 'QTCoupon/coupon/updateSuggest',
                data: {
                    phone: that.data.phone,
                    context: that.data.textarea,
                    contactWay: that.data.contact,
                },
                method: "GET",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (result) {
                    console.log(result);
                    var res = result.data;
                    if (res.return_code === "200") {//成功
                        //请求成功，弹出提示，随后消失并清空文本框
                        that.setData({
                            modalShow: false
                        });
                        setTimeout(function () {
                            that.setData({
                                modalShow: true,
                                textarea: '',
                                contact: ''
                            });
                        }, 2000);
                    }
                }
            });

        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     * 下拉清空数据
     */
    onPullDownRefresh: function () {
        this.setData({
            textarea: '',
            contact: ''
        });
        wx.stopPullDownRefresh();
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