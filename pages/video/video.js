// // pages/video/video.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     pusherContext: '',
//     playerContext: '',
//   },
//   onPlay: function (ret) {
//     console.log("livePlayer code::::"+ret.detail.code)
//   },
//   onPush: function (ret) {
//     console.log("livePusher code::::"+ret.detail.code)
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     console.log("video options livePushUrl::"+options.livePushUrl)
//     console.log("video options livePlayUrl::" + options.livePlayUrl)
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
//     var _this = this;
//     this.data.pusherContext = wx.createLivePusherContext('pusher');
//     this.setData({
//       pusherUrl: "rtmp://28642.livepush.myqcloud.com/live/28642_c5df403d5e?bizid=28642&txSecret=e0696d91eba5aed2af2ef65baf25271a&txTime=5B88147F",
//     }, function () {
//       _this.data.pusherContext.stop();
//       _this.data.pusherContext.start();
//     })
//     this.data.playerContext = wx.createLivePlayerContext('player');
//     this.setData({
//       playerUrl: "rtmp://28642.liveplay.myqcloud.com/live/28642_c5df403d5e",
//     }, function () {
//       _this.data.playerContext.stop();
//       _this.data.playerContext.play();
//     })
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
  
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {
  
//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {
  
//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {
  
//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
  
//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
  
//   }
// })
Page({
  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher');
    this.ctx.start({
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })

  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  bindStart() {
    
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  bindSwitchCamera() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  }
})