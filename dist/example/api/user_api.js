var config=require('./config');
var open_api = require('../js/openapi.js');
var util = require('../js/util');
/**
 * 获取首页数据
 */
function login() {
  var token = wx.getStorageSync("token");
  var userInfo = wx.getStorageSync("userInfo");
  if (!token || !userInfo) {
    loginS2();
  } else {
      // userinfoCheck(token,userInfo);   //检索是否保存了用户信息；
      open_api.checkSession({//1、判断登录是否过期
        fail: function () {
          loginS2();
        }, success: function () {
          var appInstance = getApp();
          appInstance.globalData.token = token;
          appInstance.globalData.userInfo = userInfo;
        }
      });
    }
}

function userinfoCheck(token,userInfo) {
  wx.request({
    url: config.service.host+'userinfo/check', //请求地址
    data: '',
    header:{//请求头
      "Accept-Language": "zh-CN",
      "Content-Type":"applciation/json",
      "token": token,
    },
    method:"GET",
    success:function(res){
      // console.log(res);   //code==1,用户信息已经丢失，需要请求‘userinfo/miss/fix’接口；code==0,用户信息完整；
      if(res.data&&res.data.code){
        if(res.data.code=='1'){
          userInfomiss(token,userInfo)
        }else{
          return;
        }
      }
    },
    fail:function(errMsg){
      console.log(errMsg,"miss");
    },//请求失败
  })
}

// 向后台传送用户-- userInfo信息
function userInfomiss(token,userInfo) {
  wx.request({
    url: config.service.host+'userinfo/miss/fix', //请求地址
    data:util.json2Form(userInfo),
    header:{//请求头
      "Accept-Language": "zh-CN",
      "Content-Type":"application/x-www-form-urlencoded",
      "token": token
    },
    method:"post",
    success:function(res){
      // console.log(res);
    },
    fail:function(errMsg){
      console.log(errMsg,"miss");
    },//请求失败
  })
}

// function loginS2(callback) {
//   open_api.login({ //2、过期调用登录界面
//     success: function (code) {
//       open_api.getUserInfo({ //3、登录成功后调用getUserInfo
//         success: function (res) {
//           var encryptedData = res.encryptedData; //包括敏感数据在内的完整用户信息的加密数据
//           var signature = res.signature;  //使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档
//           var iv = res.iv;  //加密算法的初始向量，详细见加密数据解密算法
//           var userInfo = res.userInfo;  //用户信息对象，不包含 openid 等敏感信息
//           var params = {
//             code: code,
//             encryptedData: encryptedData,
//             signature: signature,
//             iv: iv
//           };
//
//           wx.request({
//             url: config.service.host+'hefuwechat/login', //请求地址
//             data: params,
//             header:{//请求头
//               "Accept-Language": "zh-CN",
//               "Content-Type":"applciation/json"
//             },
//             method:"GET",//get为默认方法/POST
//             success:function(res){
//               var token = res.data.token;
//               //缓存token, userInfo
//               saveUserInfo(token, userInfo);
//               if(callback){
//                 callback.success(token);
//               }
//             },
//             fail:function(errMsg){
//               console.log(errMsg,"hefuwechat/login");
//               if(callback){
//                 callback.success(token);
//               }
//             },//请求失败
//           })
//         },
//         fail: function (errMsg) {
//           console.log(errMsg,"error");
//           wx.openSetting({
//             success: (res) => {
//               console.log(res,'openSetting')
//               res.authSetting = {
//                 "scope.userInfo": true,
//                 "scope.userLocation": true
//               }
//             }
//           })
//         }
//       });
//     },
//     fail: function () {
//       console.log("fail");
//     }
//   });
// }


function loginS2(callback) {
  open_api.login({ //2、过期调用登录界面
    success: function (code) {
    console.log(code,'code================');
      var params = {
            code: code,
            encryptedData: '',
            signature: '',
            iv: ''
          };
      wx.request({
        url: config.service.host+'hefuwechat/login', //请求地址
        data: params,
        header:{//请求头
          "Accept-Language": "zh-CN",
          "Content-Type":"applciation/json"
        },
        method:"GET",//get为默认方法/POST
        success:function(res){
          var token = res.data.token;
          //缓存token, userInfo
          var userInfo='';
          saveUserInfo(token, userInfo);
          if(callback){
            callback.success(token);
          }
        },
        fail:function(errMsg){
          console.log(errMsg,"hefuwechat/login");
          if(callback){
            callback.success(token);
          }
        },//请求失败
      })
    },
    fail: function () {
      console.log("fail");
    }
  });
}


function saveUserInfo(token, userInfo) {
  try {
    var appInstance = getApp();
    appInstance.globalData.userInfo = userInfo;
    appInstance.globalData.token = token;
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('token', token);
  } catch (e) {
    console.log(e);
  }
}

function loginS3 (data,callBack) {          //如果用户确定授权，将用户信息传输与后台；
    wx.login({ //2、过期调用登录界面
        success: function (codedata) {
            var params = {
                code: codedata.code,
                encryptedData: data.encryptedData,
                signature: data.signature,
                iv: data.iv
            };
            wx.request({
                url: config.service.host+'hefuwechat/getuserinfo', //请求地址 hefuwechat/login
                data: params,
                header:{//请求头
                    "Accept-Language": "zh-CN",
                    "Content-Type":"applciation/json"
                },
                method:"GET",//get为默认方法/POST
                success:function(res){

                    loginS2({           //成功后刷新token;
                        success:function () {
                            if(callBack){
                                callBack.getFn();
                            }
                        }
                    });
                    // if(callBack){
                    // 	callBack.getFn();
                    // }
                    // console.log(res,'----getuserinfo----');
                    if(res.data.code=='1000' || res.data.code=='1001'){
                        wx.setStorageSync('userInfoS', true);
                    }
                    // var token = res.data.token;
                    //缓存token, userInfo
                    // console.log(res,'----------token3-----------')
                },
                fail:function(errMsg){
                    // console.log(errMsg,"getuserinfo");
                },//请求失败
            })
        },
        fail: function () {
            // console.log("fail");
        }
    });
}

module.exports = {
  login: login,
  loginS2:loginS2,
    loginS3:loginS3
};