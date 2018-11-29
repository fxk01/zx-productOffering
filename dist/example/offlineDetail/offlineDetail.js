var WxParse = require('../wxParse/wxParse.js');
var data_api = require("../api/data_api.js");
var config=require('../api/config');
Page({
  data:{
    overgameTxt:"已结束",
    // big:{
    //   "code" :1001,
    //   "data" :[{
    //     "id": 1,
    //     "userId": 1,
    //     "name": null,
    //     "miu": "../upload/miu/b015376b58d046468bb09a4ce489906e.jpg",
    //     "title": "test",
    //     "period": "test",
    //     "lecturer": "test",
    //     "bgimage": "../upload/bgimages/b015376b58d046468bb09a4ce489906e.jpg",
    //     "content": "<h2>testtesttesttesttesttest</h2><span style='color: red;'>djgjjdgklkl</span>",
    //     "media": "../upload/media/b015376b58d046468bb09a4ce489906e.jpg",
    //     "pageType": 5,
    //     "deleted": 0,
    //     "deletedId": 1,
    //     "targetTime": "2017-12-29 12:56:09",
    //     "sign_begin_time": "2017-12-20 12:21:56",
    //     "sign_end_time": "2017-12-24 12:21:56"
    //   }]
    //   },
  },
  onLoad: function (options) {
    var Id=options.id;
    // if(Id==6 || Id==7){
      this.setData({
        overgameTxt: "报名已结束",
      })
    // };
    this.setData({
      offlineId: Id,
      zanObj: {
        loading: true
      }
    });
    this.getCourseDetail();
    console.log(this.data.offlineId);
  },
  getCourseDetail:function () {
    var that=this;
    var id=that.data.offlineId;
    data_api.getCourseDetail(id,{
      success:function (res) {
        console.log(res,"res");
        if(res.data && res.data.code=="1001"){
          var CourseDetailList = res.data.data;
        // var CourseDetailList=that.data.big.data[0];
        var detailContent='';
        // .replace(/&nbsp;/g, "\n");
        detailContent=CourseDetailList.content.replace(/&nbsp;/g, "\t");
        console.log(detailContent,'detailContent')
        WxParse.wxParse('detailContent', 'html', detailContent, that, 5);
          console.log(CourseDetailList,"res.data.CourseDetailList")
          var Url=config.service.host;
          var start=CourseDetailList['sign_begin_time'];
          var end=CourseDetailList['sign_end_time'];
          var beginTim = new Date(start).getTime();
          var nowTim=new Date().getTime();
          var endTim=new Date(end).getTime();
          if(beginTim<=nowTim && nowTim<endTim ){
            CourseDetailList['sign']=true;
          }else{
            CourseDetailList['sign']=false;
          }
          CourseDetailList['targetTime']=CourseDetailList['targetTime'].substring(0,CourseDetailList['targetTime'].indexOf(" ")) ;

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
  onShareAppMessage: function () {
    return {
      title: '积募小管家',
      path: '/example/offlineDetail/offlineDetail?id='+this.data.Id,
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