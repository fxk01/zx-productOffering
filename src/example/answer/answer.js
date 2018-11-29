Page({
// 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/answer/answer',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },
})