var config = require('../api/config.js');
var user_api = require('../api/user_api.js');
var util = require('./util');
var appInstance=getApp();
var token='';

function request(url, data, callback, method) {
  token=appInstance.globalData.token ? appInstance.globalData.token : wx.getStorageSync("token");
  if(!token){
    user_api.loginS2({
      success:function (token) {
        net(url, data, callback, method,token);
      }
    });     //重新登陆
  }else{
    net(url, data, callback, method,token);
  }
}

function net(url, data, callback, method,token) {
  token = token;
  if (!method) {
    method = "GET";
  }

  var header = {
    "Accept-Language": "zh-CN",
    "token": token,
  };
  if (method === "POST") {
    header["Content-Type"] = "application/x-www-form-urlencoded";
    data = util.json2Form(data);
  }

//TODO 使用promise优化回调结构
  wx.request({
    url: config.service.host + url,
    data: data,
    method: method,
    header: header,
    success: function (res) {
      var errMsg = res.errMsg || res.msg;
      if (!callback) {
        return;
      }
      if (res) {
        if (res.statusCode==200) {
          if(res.data.code==1003){
            // alert("请登录！")
            util.showModal("登陆后方能操作,请您先登录!",{
              confirm:function (res) {
                user_api.loginS2();  //重新登录
              },cancel:function (res) {
              }
            });
          }else if (res.data.code==1010) {     //测试和开发人员线下和线上两次存储token不一致，应提示测试用户退出重新登录
            wx.removeStorageSync("token");
            appInstance.globalData.token = null;
            callback.fail(errMsg);
            wx.showToast({
              title: '请退出重新登陆',
              icon: 'loading',
              duration: 4000
            })
            // console.log('请退出重新登陆；code=1010');
          }else if(res.data.code==1009){
            util.showModal('您的登录已过期,请点击"确定"按钮重新登录后再执行此操作',{
              confirm:function (res) {
                user_api.loginS2();  //重新登录
              },cancel:function (res) {
              }
            });
          }else{
            callback.success(data ? res : {});
          }
        } else {
          if (res.data.errorCode == 10004) {     //不存在该用户
            wx.removeStorageSync("token");
            appInstance.globalData.token = null;
          }
          callback.fail(errMsg);
          wx.showToast({
            title: '请退出重新登陆；',
            icon: 'loading',
            duration: 4000
          })
        }
      } else {
        callback.fail("服务器错误");
      }
    }, fail: function (errMsg) {
      callback.fail && callback.fail(errMsg);
    },complete:	function (res) {
      // console.log(callback,'--------------callback--!');
      if(callback){
        callback.complete &&  callback.complete(res);
      }
    }
  })
}

module.exports = {
  request: request
};