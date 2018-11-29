var data_api = require("../api/data_api.js");
var config=require('../api/config');
Page({
  data:{
    zanObj: {},
    advItem:[],  //初始化
    totalNum:0, //总数据条数
    advLen:0, //已加载的数据条数
    pagesize: 10, //每页条数
    page: 1,  //第一页
  },
  onLoad: function (options) {
    var that = this;
    that.getAdvCourse();  //获取进阶系列课；
  },
  getAdvCourse:function () {
    var that=this;
    var page_type=4;
    var page=that.data.page;  //默认为第一页
    var pagesize=that.data.pagesize; //默认10条
    data_api.getAdvCourse(page,pagesize,page_type,{
      success:function (res) {
        console.log(res,"advres");
        if(res.data && res.data.code=="1001"){
          var size = that.data.advLen + res.data.data.length;
          var Url=config.service.host;
          var advItem = res.data.data;
          var totalNum=res.data.total;
          advItem.forEach(function (item) {
            if(item['miu']){
              item['miu']= Url+item['miu'].match(/..\/(\S*)/)[1];
            }
          })

          that.setData({
            advLen: size,
            advItem:that.data.advItem.concat(advItem),
            totalNum:totalNum,
            zanObj: {
              loading: false
            }
          })
          // 停止下拉刷新
          wx.stopPullDownRefresh();
          console.log(that.data.advItem,'advItem');
        }

      },fail:function (msg) {
        wx.stopPullDownRefresh();
        that.setData({
          zanObj: {
            loading: false
          }
        })
        console.log(msg);
      }
    },"GET")
  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    that.setData({ zanObj: { loading: true } });
    if (that.data.advLen < that.data.totalNum) {
      that.setData({
        page: that.data.page + 1,
      })
      that.getAdvCourse();
    } else {
      that.setData({ zanObj: { loading_nodata: true } });
      console.log("没有更多数据了...")
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      advLen:0,
      advItem: [],
      page: 1,
      zanObj: {}
    })
    that.getAdvCourse();
  },

  GoadvDetail:function (e) {
    var advid=e.currentTarget.dataset.advid;
    wx.navigateTo({
      url: '/example/advDetail/advDetail?flag=advanceList&&id='+advid,
    })
  },
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/advcourses/advcourses',
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