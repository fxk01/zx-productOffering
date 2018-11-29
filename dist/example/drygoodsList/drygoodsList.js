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
    zanObj: {},
    loadingHidden: false,   //进入页面显示加载。。
    Len:0, //已加载的数据条数
    totalNum:0, //总数据条数
    drygoodsList:[],
    pagesize: 10, //每页条数
    page: 1,  //第一页
    toView: 'red',
  },

  onUnload: function () {
    var that = this;
    that.setData({
      loadingHidden: true
    })
  },


  onLoad(options) {
    var drygoodsId=options.drygoodsId;
    var drygoodsName=options.drygoodsName;
    this.setData({drygoodsName:drygoodsName,drygoodsId:drygoodsId})
    console.log(options,'options~');
    this.drygoodsListFn(drygoodsId);
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    var drygoodsId=that.data.drygoodsId;
    that.setData({ zanObj: { loading: true } });
    if (that.data.Len < that.data.totalNum) {
      that.setData({
        page: that.data.page + 1,
      })
      that.drygoodsListFn(drygoodsId);
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
    var drygoodsId=that.data.drygoodsId;
    console.log('111')
    that.setData({
      Len:0, //已加载的数据条数
      drygoodsList:[],
      page: 1,
      zanObj: {}
    })
    that.drygoodsListFn(drygoodsId);
  },

  drygoodsListFn:function (id) {
    var that=this;
    var page=that.data.page;
    var pagesize=that.data.pagesize;
    data_api.getModuleId(id,page,pagesize,{
      success:function (res) {
        console.log(res)
        if(res.data && res.data.code=="1001"){
          var drygoodsList=res.data.data;
          var Url=config.service.host;
          var totalNum=res.data.totals;
          var size = that.data.Len + res.data.data.length;
          drygoodsList.forEach(function (item,idx) {
            if(item['miu']){
              item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
            }
          });
          that.setData({
            drygoodsList:that.data.drygoodsList.concat(drygoodsList),
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

  sortNumber:function (a,b) {
    return a - b
  },

  sortNumber1:function (a,b) {
    return b - a
  },

  Gotomedical:function (e) {
    wx.navigateTo({
      url: '/example/medical/medical'
    })
  },
  GofundTown:function (e) {
    wx.navigateTo({
      url: '/example/fundtown/fundtown'
    })
  },
  Gotocreate:function (e) {
    wx.navigateTo({
      url: '/example/tocreate/tocreate'
    })
  },

  Godetail:function (e) {
    wx.navigateTo({
      url: '/example/detail/detail'
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/drygoodsList/drygoodsList?drygoodsId='+this.data.drygoodsId+'&drygoodsName='+this.data.drygoodsName,
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

  GoOfflineDetailnewPage:function (e) {
    var id=e.currentTarget.dataset.id;
    var price=e.currentTarget.dataset.price;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    // 报名结束：1.00 、立即报名标识：0.00-->
    wx.navigateTo({
      url: '/example/offlineDetailnew/offlineDetailnew?productid='+id+"&price="+price+'&BarTitleText='+BarTitleText
    })
  },

  // 去干货详情页
  goDrygoodsdetail:function (e) {
    var id=e.currentTarget.dataset.id;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    wx.navigateTo({
      url: '/example/dryGoodsdetail/dryGoodsdetail?productid='+id+'&BarTitleText='+BarTitleText
    })
  },

});