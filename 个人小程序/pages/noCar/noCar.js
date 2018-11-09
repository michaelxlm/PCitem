Page({

  /**
   * 页面的初始数据
   */
  data: {},
  bindCar: function (event) {
    wx.navigateTo({
      url: '../carNumber/carNumber',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
  },
  showAlertup() {
    this.alert.showAlert();
  },

  //取消事件
  _error() {
    console.log('你点击了取消');
    this.alert.hideAlert();
  },
  //确认事件
  _success() {
    console.log('你点击了确定');
    this.alert.hideAlert();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得popup组件
    this.alert = this.selectComponent("#alert");
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
})