var CryptoJS = require('aes.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("010401020C0008070100020B0E07030507050702090F030807010902080A0809");//加密秘钥
var iv = CryptoJS.enc.Utf8.parse('010401020C0008');//秘钥偏移量
//解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//加密方法
function Encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}

//创建Message对象并转化成json字符串方法
function CreateMessage(status,from,to,msgType,message){
  var dataObj = {};
  dataObj.status = status;
  dataObj.from = from;
  dataObj.to = to;
  dataObj.msgType = msgType;
  dataObj.message = message;
  return JSON.stringify(dataObj);
}

//创建Message对象并转化成json字符串方法
function CreateChatRecord(source, sign, to, message) {
  var dataObj = {};
  dataObj.status = status;
  dataObj.from = from;
  dataObj.to = to;
  dataObj.message = message;
  return JSON.stringify(dataObj);
}

//暴露接口
module.exports.Decrypt = Decrypt;
module.exports.Encrypt = Encrypt;
module.exports.CreateMessage = CreateMessage;