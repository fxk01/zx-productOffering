Page({
  onShareAppMessage: function () {
    return {
      title: '积募小管家',
      path: '/example/medical/medical',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },
});