var data_api = require("../api/data_api.js");
var config=require('../api/config');
Page({
  onLoad: function (options) {
    this.setData({
      zanObj: {
        loading: true
      },
      id: options.id,
      flag:options.flag
    });
    this.getCourseDetail();
    console.log(this.data.id,this.data.flag);
  },
  getCourseDetail:function () {
    var that=this;
    var id=that.data.id;
    data_api.getCourseDetail(id,{
      success:function (res) {
        console.log(res);
        if(res.data && res.data.code=="1001"){
          var CourseDetailList = res.data.data;
          console.log(CourseDetailList,"res.data.CourseDetailList")
          var Url=config.service.host;
          CourseDetailList['bgimage']= Url+CourseDetailList['bgimage'].match(/..\/(\S*)/)[1];

          that.setData({
            CourseDetailList:CourseDetailList,
            zanObj: {
              loading: false
            }
          })
          console.log(that.data.CourseDetailList,"CourseDetailList");
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
  makePhonecall:function (e) {
    wx.makePhoneCall({
      phoneNumber: '4006662398' //仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/advDetail/advDetail?id='+this.data.id+'&flag='+this.data.flag,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});