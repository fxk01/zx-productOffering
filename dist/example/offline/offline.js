var data_api = require("../api/data_api.js");
var config=require('../api/config');
var WxParse = require('../wxParse/wxParse.js');
Page({
  data:{
    zanObj: {},
    offlineItem:[],  //初始化
    totalNum:0, //总数据条数
    offLen:0, //已加载的数据条数
    pagesize: 10, //每页条数
    page: 1,  //第一页
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ zanObj: { loading: true } });
    that.getOfflineCourse();  //获取进阶系列课；
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    that.setData({ zanObj: { loading: true } });
    if (that.data.offLen < that.data.totalNum) {
      that.setData({
        page: that.data.page + 1,
      })
      that.getOfflineCourse()
    } else {
      that.setData({ zanObj: { loading_nodata: true } });
      console.log("没有更多数据了...")
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      offLen:0,
      offlineItem: [],
      page: 1,
      zanObj: {}
    })
    that.getOfflineCourse();
  },

  getOfflineCourse:function () {
    var that=this;
    var page_type=5;
    var page=that.data.page;  //默认为第一页
    var pagesize=that.data.pagesize; //默认10条
    data_api.getOfflineCourse(page,pagesize,page_type,{
      success:function (res) {
        console.log(res,"offline-res");
        if(res.data && res.data.code=="1001"){
          var size = that.data.offLen + res.data.data.length;
          var Url=config.service.host;
          var offlineItem = res.data.data;
          var totalNum=res.data.total;
          var replyArr=[];
          offlineItem.forEach(function (item) {
            if(item['targetTime'] && item['miu'] &&item['contentProfile']){
              item['targetTime']=item['targetTime'].substring(0,item['targetTime'].indexOf(" ")) ;
              item['miu']= Url+item['miu'].match(/..\/(\S*)/)[1];
              item['contentProfile']=item['content'].substring(0,3000);
              replyArr.push(item['content']);
            }
          })
          that.setData({
            offLen: size,
            offlineItem:that.data.offlineItem.concat(offlineItem),
            totalNum:totalNum,
            zanObj: {
              loading: false
            }
          })
          // 停止下拉刷新
          wx.stopPullDownRefresh();
          console.log(replyArr,"replyArroffline");
          for (var i = 0; i < offlineItem.length; i++) {
            WxParse.wxParse('reply' + i, 'html', offlineItem[i].content, that);
            if (i === offlineItem.length - 1) {
              WxParse.wxParseTemArray("replyTemArray",'reply', offlineItem.length, that)
            }
          }
          console.log(that.data.offlineItem,'offlineItem');
        }

      },fail:function (msg) {
        // that.setData({ loadingHidden: true });
        wx.stopPullDownRefresh();
        that.setData({
          zanObj: {
            loading: false,
          }
        });
        console.log(msg);
      }
    },"GET")
  },

  Godetail:function (e) {
        wx.navigateTo({
            url: '/example/detail/detail'
        })
    },
  GoofflineDetail:function (e) {
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/example/offlineDetail/offlineDetail?id='+id,
    })
  },
  onShareAppMessage: function () {
    return {
      title: '积募小管家',
      path: '/example/offline/offline',
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