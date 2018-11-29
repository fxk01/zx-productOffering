Page({
  data:{
    smart_thumb:"备案-立即办理",
    smart_consult:"备案-在线咨询"
  },
  Gofillinformation:function (e) {
    wx.navigateTo({
      url: '/example/fillinformation/fillinformation?flag=智能备案'
    })
  },
  makePhonecall:function (e) {
    wx.makePhoneCall({
      phoneNumber: '4006662398' //仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage: function () {
    return {
      title: '积募小管家',
      path: '/example/recordSmart/recordSmart',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  }
});