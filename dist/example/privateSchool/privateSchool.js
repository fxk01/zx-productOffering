var WxParse = require('../wxParse/wxParse.js');
var data_api = require("../api/data_api.js");

Page({
  data:{
    zanObj: {},
  },
  onLoad: function (options) {
    var that = this;
    that.getJimuinfo();  //获取积募简介；
  },
  getJimuinfo:function () {
    var that=this;
    data_api.getJimuinfo({
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var jimuList = res.data.data;

          for (var i = 0; i < jimuList.length; i++) {
            WxParse.wxParse('reply' + i, 'html', jimuList[i].content, that);
            if (i === jimuList.length - 1) {
              WxParse.wxParseTemArray("replyTemArray",'reply', jimuList.length, that)
            }
          }

          that.setData({
            jimuList:jimuList,
            zanObj: {
              loading: false
            }
          })
          console.log(jimuList,'关于积募');
        }

      },fail:function (msg) {
        that.setData({
          zanObj: {
            loading: false
          }
        })
        console.log(msg);
      }
    },"GET")
  },

  onShareAppMessage: function () {
    return {
      title: '积募小管家',
      path: '/example/privateSchool/privateSchool',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },
  makePhonecall:function (e) {
    wx.makePhoneCall({
      phoneNumber: '4006662398' //仅为示例，并非真实的电话号码
    })
  },
});