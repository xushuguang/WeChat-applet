//获取应用实例
var app = getApp()
var Dec = require('../../utils/public.js');//引用封装好的加密解密js
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    output: '',
    input: '',
    imgURL: '',
    display1: 'block',
    display2: 'none'

  },
  input_rsa: function (e) {
    this.setData({
      input: e.detail.value
    })
    let v = e.detail.value
    console.log(v)
  },
  caozuo: function () {
    var _this = this;
    wx.showActionSheet({
      itemList: ['加密', '解密', '生成二维码', '扫码'],
      success: function (res) {
        var buttonNum = res.tapIndex
        if (buttonNum == 0) {//点击加密按钮
          var input_rsa = _this.data.input;
          var encStr = Dec.Encrypt(input_rsa);
          console.log(encStr)
          _this.setData({
            output: encStr,
            display1: 'block',
            input_rsa: '',
            display2: 'none'
          })
        } else if (buttonNum == 1) {//点击解密按钮
          var input_rsa = _this.data.output;
          var decStr = Dec.Decrypt(input_rsa);
          _this.setData({
            output: decStr,
            display1: 'block',
            display2: 'none'
          })

        } else if (buttonNum == 2) {//点击生成二维码按钮
          //先进行加密
          var input_rsa = _this.data.input;
          var encStr = Dec.Encrypt(input_rsa);
          _this.setData({
            imgURL: encStr,
            input_rsa: '',
            display1: 'none',
            display2: 'block'
          })
        } else if (buttonNum == 3) {//点击扫码按钮
          wx.scanCode({
            success: (res) => {
              //解密
              var input_rsa = res.result;
              var decStr = Dec.Decrypt(input_rsa);
              _this.setData({
                output: decStr,
                display1: 'block',
                display2: 'none'
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  onLoad: function () {
  },
})