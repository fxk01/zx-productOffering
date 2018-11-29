/*开放接口 https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html*/

/**
 * wx.login(OBJECT)
 * 参考 https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html
 */
function login(callback){
  wx.login({
    success: function(res) {
      if (res.code) {
        callback.success(res.code);
      } else {
        callback.fail();
      }
    }, fail: function() {
      callback.fail();
    }
  });
}

function getUserInfo(callback){
  wx.getUserInfo(callback);
}

function checkSession(callback) {
  wx.checkSession(callback)
}

module.exports={
  login:login,
  getUserInfo:getUserInfo,
  checkSession:checkSession
};

