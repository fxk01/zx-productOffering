var app = getApp();

Page({
  data: {
    isIphoneX:app.globalData.isIphoneX,
  },
  gohaveActive:function () {
    wx.navigateTo({
      url: '/example/haveActive/haveActive'
    })
  },

  gomycollection:function () {
    wx.navigateTo({
      url: '/example/mycollection/mycollection'
    })
  },

  gobuyCourse:function () {
    wx.navigateTo({
      url: '/example/buyCourse/buyCourse'
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/mine/mine',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});