var config=require('../api/config.js');
Page({
  data: {

  },
  getUser:function (e) {
    console.log(e);
    console.log(e.detail);

    // errMsg:"getUserInfo:ok"

    this.loginS3(e.detail);
  },

  loginS3:function (data) {
  wx.login({ //2、过期调用登录界面
    success: function (codedata) {
      console.log(codedata.code,'code1================');
      var params = {
            code: codedata.code,
            rawData: data.encryptedData,
            signature: data.signature,
            iv: data.iv
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
         console.log(token,'----------token1-----------')
        },
        fail:function(errMsg){
          console.log(errMsg,"hefuwechat/login");
        },//请求失败
      })
    },
    fail: function () {
      console.log("fail");
    }
  });
}



});