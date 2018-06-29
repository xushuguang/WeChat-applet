Page({
  //页面初始数据
  data: {
    age:'',
    name:'',
    imgUrl:'',
    voiceUrl:''
  },
  //点击登录按钮事件，调用后台java接口
  clickLogin:function(){
    var _this = this;
    wx.request({
      url: 'http://localhost:8888/demo',
      method:"GET",
      success:function(data){
       _this.setData({
         age: data.data.age,
         name: data.data.name
       })
      }
    })
  },
  //点击选择照片按钮事件
  checkImage:function(){
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        _this.setData({
          imgUrl: res.tempFilePaths
        })
      },
    })
  },
  //点击录音按钮事件
  infoVoice:function(){
    wx.startRecord({
      success: function (res) {
        voiceUrl = res.tempFilePath
      },
      fail: function (res) {
        //录音失败
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
    }, 5000)
  },
  playVoice:function(){
    wx.playVoice({
      filePath: voiceUrl,
      complete: function () {
      }
    })
    setTimeout(function () {
      wx.stopVoice()
    }, 5000)
  },
})