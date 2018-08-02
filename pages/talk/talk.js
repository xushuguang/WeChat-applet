var app = getApp();
var Dec = require('../../utils/public.js');//引用封装好的加密解密js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    chatRecord: '',
    fromName: '',
    toName: '',
    socketOpen: '',
    avatarUrl: '',
    display1: 'block',
    display2: 'none',
    voiceTempFilePath: '',
    imgTempFilePath: '',
    videoTempFilePath: '',

  },

  input_rsa: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    let v = e.detail.value
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = getApp().globalData.userInfo;
    console.log(options)
    this.setData({
      fromName: options.fromName,
      toName: options.user,
      socketOpen: options.socketOpen,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.toName
    })
    var _this = this;
    setInterval(function () {
      var key = _this.data.toName;
      _this.setData({
        chatRecord: wx.getStorageSync(key)
      })
    }, 500)
    setInterval(function () {
      var key = _this.data.toName;
      _this.setData({
        chatRecord: wx.getStorageSync(key)
      })
    }, 500)
  },
  onHide: function () {
  },
  sendmessage: function(){
    if (this.data.inputValue != ''){
      var fromName = this.data.fromName;
      var toName = this.data.toName;
      var message = Dec.Encrypt(this.data.inputValue);
      var msg = Dec.CreateMessage("talking",fromName,toName,"txt",message);
      if (this.data.socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      }
      var ourValue = this.data.inputValue;
      var storageVal = wx.getStorageSync(toName);
      if (storageVal == '') {//本地缓存中不存在，新建并存入缓存
        var data = [{ property: "out",msgType:"txt",message: ourValue}];
        wx.setStorageSync(toName, data);
      } else {
        if (storageVal.length > 10) {
          storageVal.splice(0, 1);
        }
        storageVal.push({ property: "out", msgType: "txt",message: ourValue});
        //更新
        wx.setStorageSync(toName, storageVal);
      }
      this.setData({
        inputValue: ''
      })
    }
  },
  /**
   * 点击向上箭头更多按钮
   */
  more: function () {
    var _this = this;
    var fromName = this.data.fromName;
      var toName = this.data.toName;
    wx.showActionSheet({
      itemList: ['播放录音', '拍照','录像','视频聊天'],
      success: function (res) {
        var buttonNum = res.tapIndex
        if (buttonNum == 0) {//点击播放录音按钮
          wx.playVoice({
            filePath: _this.data.voiceTempFilePath,
            complete: function () {
            }
          })
        } else if (buttonNum == 1) {//点击拍照按钮
          const canvas = wx.createCanvasContext("canvasTo");
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var imgTempFilePath = res.tempFilePaths[0];
              _this.setData({
                imgTempFilePath: imgTempFilePath
              })
              // 1. 绘制图片至canvas
              canvas.drawImage(imgTempFilePath, 0, 0, 150, 100);
              //绘制完成后执行回调，API 1.7.0
              canvas.draw(true, () => {
                // 2. 获取图像数据， API 1.9.0
                wx.canvasGetImageData({
                  canvasId: "canvasTo",
                  x: 0,
                  y: 0,
                  width: 150,
                  height: 100,
                  success(res) {
                    console.log(res)
                    var msg = Dec.CreateMessage("talking", fromName, toName, "img", Dec.Encrypt(res.data));
                    wx.sendSocketMessage({
                      data: msg
                    });
                  }
                })
              })
            }
          })
        } else if (buttonNum == 2) {//点击录像按钮
          wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              var videoTempFilePath = res.tempFilePath
              console.log(videoTempFilePath)
              _this.setData({
                videoTempFilePath: videoTempFilePath
              })
            }
          })
        } else if (buttonNum == 3) {//点击视频聊天按钮
          var dataObj = {};
          dataObj.livePushUrl = "rtmp://28642.livepush.myqcloud.com/live/28642_c5df403d5e?bizid=28642&txSecret=e0696d91eba5aed2af2ef65baf25271a&txTime=5B88147F";
          dataObj.livePlayUrl = "rtmp://28642.liveplay.myqcloud.com/live/28642_12323123qweqwe";
          var data = JSON.stringify(dataObj);
          var msg = Dec.CreateMessage("talking", fromName, toName, "video", Dec.Encrypt(data));
          wx.sendSocketMessage({
            data: msg,
          })
          wx.navigateTo({
            url: '../video/video',
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 点击语音按钮
   */
  voiceTap: function () {
    this.setData({
      display1: 'none',
      display2: 'block',
    })
  },
  /**
   * 点击文字按钮
   */
  textTap: function () {
    this.setData({
      display1: 'block',
      display2: 'none',
    })
  },
  /**
   * 开始录音
   */
  recordStart: function (e) {
    var _this = this;
    wx.startRecord({
      success: function (res) {
        console.log("录音成功返回的数据：" + res.tempFilePath)
        var voiceTempFilePath = res.tempFilePath;
        _this.setData({
          voiceTempFilePath: voiceTempFilePath
        })
      },
      fail: function (res) {
        console.log("录音失败。。。。。。。。。。。")
      }
    })
  },
  /**
   * 结束录音
   */
  recordStop: function (e) {
    wx.stopRecord()
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
})