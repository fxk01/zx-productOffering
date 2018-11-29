var app = getApp();
var WxParse = require('../wxParse/wxParse.js');
var config=require('../api/config');
var data_api = require("../api/data_api.js");

var toast = require('../template/toast/toast');

Page({
  data: {
    isIphoneX:app.globalData.isIphoneX,
    toast: {     //是否显示提示、提示内容
      show: false,
      content: ''
    },
    loadingHidden: false,   //进入页面显示加载。。
    Len:0, //已加载的数据条数
    totalNum:0, //总数据条数
    advList:[],
    pagesize: 10, //每页条数
    page: 1,  //第一页
    zanObj: {}
  },

  onUnload: function () {
    var that = this;
    that.setData({
      loadingHidden: true
    })
  },

  onLoad(options) {
    var advId=options.advId;
    var advName=options.advName;
    console.log(options,'options~');
    this.setData({advId:advId,advName:advName})
    this.advListFn(advId);
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    var advId=that.data.advId;
    that.setData({ zanObj: { loading: true } });
    if (that.data.Len < that.data.totalNum) {
      that.setData({
        page: that.data.page + 1,
      })
      that.advListFn(advId);
    } else {
      // that.setData({ zanObj: { loading_nodata: true } });
      that.setData({ zanObj: { loading: false } });
      console.log("没有更多数据了...")
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    console.log('111')
    var that = this;
    var advId=that.data.advId;
    console.log('111')
    that.setData({
      Len:0, //已加载的数据条数
      advList:[],
      page: 1,
      zanObj: {}
    })
    that.advListFn(advId);
  },

  advListFn:function (id) {
    var that=this;
    var page=that.data.page;
    var pagesize=that.data.pagesize;
    data_api.getModuleId(id,page,pagesize,{
      success:function (res) {
        console.log(res)
        if(res.data && res.data.code=="1001"){
          var advList=res.data.data;
          var Url=config.service.host;
          var totalNum=res.data.totals;
          var size = that.data.Len + res.data.data.length;
          var Url=config.service.host;
          advList.forEach(function (item,idx) {
            if(item['miu']){
              item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
            }
          });
          that.setData({
            advList:that.data.advList.concat(advList),
            totalNum:totalNum,
            Len: size,
            zanObj: {
              loading: false
            }
          });

        }else if(res.data.code=="1004"){
          that.setData({
            zanObj: {
              loading: false
            }
          })
        }

      },fail:function (msg) {

      },complete: function () {
        that.setData({
          loadingHidden: true
        });
        wx.stopPullDownRefresh();
      }
    },"GET")
  },

  // 进阶系列课
  // advListFn:function (advList) {
  //   var that=this;
  //   var Url=config.service.host;
  //   advList.productList.forEach(function (item,idx) {
  //     if(item['miu']){
  //       item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
  //     }
  //   });
  //   that.setData({advList:advList});
  // },

  sortNumber:function (a,b) {
    return a - b
  },

  sortNumber1:function (a,b) {
    return b - a
  },


  goadvListPage:function () {
    wx.navigateTo({
      url: '/example/advList/advList'
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/advList/advList?advId='+this.data.advId+'&advName='+this.data.advName,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

  Gopage:function (e) {
    var swiTarget=e.currentTarget.dataset.target;
    if(swiTarget){
      wx.navigateTo({
        url: swiTarget,
      })
    }
  },
  makePhonecall:function (e) {
    wx.makePhoneCall({
      phoneNumber: '4006662398' //仅为示例，并非真实的电话号码
    })
  },

  golistenDetailPage:function (e) {
    var id=e.currentTarget.dataset.id;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    var showdetail=e.currentTarget.dataset.showdetail;
    wx.navigateTo({
      url: '/example/listenDetail/listenDetail?productid='+id+'&BarTitleText='+BarTitleText+'&showdetail='+showdetail
    })
  },

});