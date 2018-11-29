Page({
  data:{
    design_thumb:"产品设计-立即办理",
    design_consult:"产品设计-在线咨询"
  },
  Gofillinformation:function (e) {
    wx.navigateTo({
      url: '/example/fillinformation/fillinformation?flag=产品设计'
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
      path: '/example/productDesign/productDesign',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  }
});