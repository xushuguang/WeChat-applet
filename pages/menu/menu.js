// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickName: options.nickName,
      avatarUrl: options.avatarUrl
    })
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
  
  },
  /**
   * 用户点击二维码按钮
   */
  qrcode: function(){
    wx.navigateTo({
      url: '../qrcode/qrcode',
    })
  },
  /**
   * 用户点击聊一聊按钮
   */
  chat: function () {
    var nickName = this.data.nickName;
    var avatarUrl = this.data.avatarUrl; 
    wx.navigateTo({
      url: '../chat/chat?nickName=' + nickName + "&avatarUrl=" + avatarUrl,
    })
  },
  /**
   * 用户点击视频会议按钮
   */
  video: function () {
    var nickName = this.data.nickName;
    var avatarUrl = this.data.avatarUrl;
    wx.navigateTo({
      url: '../video/video',
    })
  },
  watch: function () {
    var nickName = this.data.nickName;
    var avatarUrl = this.data.avatarUrl;
    wx.navigateTo({
      url: '../play/play',
    })
  }
})