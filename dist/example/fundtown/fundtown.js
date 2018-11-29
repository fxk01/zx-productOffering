Page({
  data:{
    isShow:false,
  },

  changeBgFn:function (e) {
    var isShow=this.data.isShow;
    this.setData({isShow:!isShow})
  },

  onShareAppMessage: function () {
    return {
      title: '积募小管家',
      path: '/example/fundtown/fundtown',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});