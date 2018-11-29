Page({
  data: {
    create_thumb:"省心创设-立即办理",
    create_consult:"省心创设-在线咨询"
  },
    Gofillinformation:function (e) {
        wx.navigateTo({
            url: '/example/fillinformation/fillinformation?flag=省心创设'
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
      path: '/example/tocreate/tocreate',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  }
});