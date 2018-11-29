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
    hotreadList:[],
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
    var hotreadId=options.hotreadId;
    var hotreadName=options.hotreadName
    this.setData({hotreadId:hotreadId,hotreadName:hotreadName});
    this.hotreadListFn(hotreadId);
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    var hotreadId=that.data.hotreadId;
    that.setData({ zanObj: { loading: true } });
    if (that.data.Len < that.data.totalNum) {
      that.setData({
        page: that.data.page + 1,
      })
      that.hotreadListFn(hotreadId);
    } else {
      that.setData({ zanObj: { loading: false } });
      console.log("没有更多数据了...")
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    var hotreadId=that.data.hotreadId;
    that.setData({
      Len:0, //已加载的数据条数
      hotreadList:[],
      page: 1,
      zanObj: {}
    })
    that.hotreadListFn(hotreadId);
  },

  hotreadListFn:function (id) {
    var that=this;
    var page=that.data.page;
    var pagesize=that.data.pagesize;
    data_api.getModuleId(id,page,pagesize,{
      success:function (res) {
        console.log(res)
        if(res.data && res.data.code=="1001"){
          var hotreadList=res.data.data;
          var Url=config.service.host;
          var totalNum=res.data.totals;
          var size = that.data.Len + res.data.data.length;
          var Url=config.service.host;
          hotreadList.forEach(function (item,idx) {
            if(item['miu']){
              item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
            }
            if(item['createTime']){
              item['createTime']=item['createTime'].substring(0,item['createTime'].indexOf(" ")).replace(/-/g, ".") ;
            }
            if(item['updateTime']){
              item['updateTime']=item['updateTime'].substring(0,item['updateTime'].indexOf(" ")).replace(/-/g, ".") ;
            }

          });
          that.setData({
            hotreadList:that.data.hotreadList.concat(hotreadList),
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

  getIconName:function (status) {
    var json = {
      "1": "积募福袋",
      "2": "积募圈儿",
      "3": "合规日历",
      "4": "合规问答",
    };
    return json[status + ''];
  },

  tabClick: function (e) {
    var activeIndex=e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: activeIndex
    });
    if(activeIndex=='2'){
      this.setData({
        scrollTop:250
      });
    }
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
  Gogogo:function (e) {
    // 1:积募福袋
    // 2:私募圈儿
    // 3:私募日历
    // 4:合规问答
    var Name=e.currentTarget.dataset.name;
    if(Name=='1'){
      wx.navigateTo({
        url: '/example/tempTutorial/tempTutorial'
      })
    }else if(Name=='2'){
      wx.navigateTo({
        url: '/example/privateCircle/privateCircle'
      })
    }else if(Name=='3'){
      wx.navigateTo({
        url: '/example/calendar/calendar'
      })
    }else if(Name=='4'){
      wx.navigateTo({
        url: '/example/complianceRubik/complianceRubik'
      })
    }
  },
  // 合规问答
  GocomplianceRubik:function (e) {
    wx.navigateTo({
      url: '/example/complianceRubik/complianceRubik'
    })
  },
  // 积募福袋
  GotempTutorial:function (e) {
    wx.navigateTo({
      url: '/example/tempTutorial/tempTutorial'
    })
  },
  // 私募圈儿
  GoprivateCircle:function (e) {
    wx.navigateTo({
      url: '/example/privateCircle/privateCircle'
    })
  },
  //私募日历
  Gocalendar: function (e) {
    wx.navigateTo({
      url: '/example/calendar/calendar'
    })
  },
  Gostewards:function (e) {
    wx.navigateTo({
      url: '/example/stewards/stewards'
    })
  },

  GorecordSmart:function (e) {
    wx.navigateTo({
      url: '/example/recordSmart/recordSmart'
    })
  },
  Gofreecourses:function (e) {
    wx.navigateTo({
      url: '/example/freecourses/freecourses'
    })
  },
  GoproductDesign:function (e) {
    wx.navigateTo({
      url: '/example/productDesign/productDesign'
    })
  },

  GofundOperation:function (e) {
    wx.navigateTo({
      url: '/example/fundOperation/fundOperation'
    })
  },
  Goadvcourses:function (e) {
    wx.navigateTo({
      url: '/example/advcourses/advcourses'
    })
  },
  Gooffline:function (e) {
    wx.navigateTo({
      url: '/example/offline/offline'
    })
  },

  Godetail:function (e) {
    wx.navigateTo({
      url: '/example/detail/detail'
    })
  },

  gohotreadListPage:function () {
    wx.navigateTo({
      url: '/example/hotreadList/hotreadList'
    })
  },

  goadvListPage:function () {
    wx.navigateTo({
      url: '/example/advList/advList'
    })
  },

  goofflineListPage:function () {
    wx.navigateTo({
      url: '/example/offlineList/offlineList'
    })
  },

  godrygoodsListPage:function () {
    wx.navigateTo({
      url: '/example/drygoodsList/drygoodsList'
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/hotreadList/hotreadList?hotreadId='+this.data.hotreadId+'&hotreadName='+this.data.hotreadName,
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