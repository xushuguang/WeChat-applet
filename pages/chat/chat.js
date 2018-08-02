// pages/chat/chat.js
var app = getApp();
var Dec = require('../../utils/public.js');//引用封装好的加密解密js
var socketOpen = false;
var SocketTask = false;
var url = "ws://192.168.100.172:8082";
var socketMsgQueue = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    user: [],
    nickName: '',
    msgArray: [],
    avatarUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickName: options.nickName,
      avatarUrl: options.avatarUrl
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("页面初次渲染完成")
    var _this = this;
    SocketTask = wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
    if (SocketTask) {
      SocketTask.onOpen(res => {
        console.log('监听 WebSocket 连接打开事件。', res);
        socketMsgQueue = [];
        socketOpen = true;
        var message = Dec.CreateMessage("online",_this.data.nickName,"Server","上线");
        wx.sendSocketMessage({
          data: message
        })
      })
      SocketTask.onClose(onClose => {
        console.log('监听 WebSocket 连接关闭事件。', onClose)
      })
      SocketTask.onError(onError => {
        console.log('监听 WebSocket 错误。错误信息', onError)
      })
      SocketTask.onMessage(onMessage => {
        console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', onMessage.data);
        var obj = JSON.parse(onMessage.data);
        var status = obj.status;
        var msgType = obj.msgType;
        if (status == "userList") {//从服务端收到联系人列表
          var msg = JSON.parse(obj.message);
          _this.setData({
            user: msg
          })
        } else if (status == "talking"){//从服务端收到消息对话
          var pages = getCurrentPages();
          if(msgType == "video"){//消息对话是视频
            var msg = JSON.parse(Dec.Decrypt(obj.message));
            //看是否打开视频页
            console.log(pages)
            wx.showModal({
              title: '提示',
              content: obj.from+"请求与您视频，是否接受？",
              success: function (res) {
                if (res.confirm) {
                  console.log(msg)
                  var livePushUrl = encodeURIComponent(msg.livePushUrl);
                  wx.redirectTo({
                    url: '../video/video?livePushUrl=' + livePushUrl + "&livePlayUrl=" + msg.livePlayUrl,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{//消息对话不是视频
            //根据发送过来的message从本地缓存中取数据
            var storageVal = wx.getStorageSync(obj.from);
            if (storageVal == '') {//本地缓存中不存在，新建并存入缓存
              var data = [{ property: "in", msgType: obj.msgType, message: Dec.Decrypt(obj.message) }];
              wx.setStorageSync(obj.from, data);
            } else {
              if (storageVal.length > 10) {
                storageVal.splice(0, 1);
              }
              storageVal.push({ property: "in", msgType: obj.msgType, message: Dec.Decrypt(obj.message) });
              //更新
              wx.setStorageSync(obj.from, storageVal);
            }
            //向我的会话中增加新的会话消息
            if (pages[2] == undefined || pages[2] == '' || pages[2].data.toName != obj.from) {//没有打开聊天详情页
              var msgArray = _this.data.msgArray;
              msgArray.push(obj);
              _this.setData({
                msgArray: msgArray
              })
            }
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("页面显示")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("页面隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //页面卸载后关闭webSocket
    if(socketOpen){
      wx.closeSocket({
      })
    }
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
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTba: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //点击通讯录联系人
  bindtapUser: function (e) {
    var user = e.currentTarget.dataset.user
    let that = this;
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按
    if (touchTime > 350) {
      wx.showModal({
        title: '提示',
        content: '是否删除与此联系人的聊天记录',
        success: function (res) {
          if (res.confirm) {
            wx.removeStorageSync(user); 
            if (wx.getStorageSync(user)==''){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else {
      wx.navigateTo({
        url: '../talk/talk?user=' + user + "&socketOpen=" + socketOpen + "&fromName=" + this.data.nickName,
      })
    }
  },
  //点击会话
  myConversation: function(e) {
    var message = e.currentTarget.dataset.user;
    var msg = Dec.Decrypt(e.currentTarget.dataset.user.message)
    var msgArray = this.data.msgArray;
    msgArray.splice(e.currentTarget.dataset.id,1);
    this.setData({
      msgArray: msgArray
    })
    wx.navigateTo({
      url: '../talk/talk?user=' + message.from + "&socketOpen=" + socketOpen + "&fromName=" + this.data.nickName
    })
  },
  //按下事件开始  
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },  
})