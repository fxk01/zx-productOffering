var app = getApp();
var config=require('../api/config');
var WxParse = require('../wxParse/wxParse.js');
var data_api = require("../api/data_api.js");
var user_api = require('../api/user_api.js');
var WxNotificationCenter = require("../template/WxNotificationCenter/WxNotificationCenter.js");

// 音频
var toast = require('../template/toast/toast');

Page({
  data:{
    mainPurchase:'0', //'0'--未购买；--'1'：已购买
    zanObj: {},
    loadingHidden: false,   //进入页面显示加载。
    toast: {     //是否显示提示、提示内容
      show: false,
      content: ''
    },
    // mainPurchase:'0',     //是否已购买
    lock:true,     //是否显示解锁弹框（true:不解锁）
    tabar_two:{
      leftTxt:'立即咨询',
      leftIcon:'../images/tabBt_consult_default.png',
      centerTxt1:'立即购买',
      centerIcon1:'../images/tabBt_buy.png',
      centerTxt2:'下载干货',
      centerIcon2:'../images/tabBt_buy.png',
      centerUrl:'',
      rightTxt:'我的',
      rightIcon:'../images/tabBt_mine_default.png',
      rightUrl:'../mine/mine'
    },
    payStatus:'-1'    //显示当前页面
  },
  //
  onLoad: function (options) {
    var that = this;
    var productid=options.productid;    //课程id
    var BarTitleText=options.BarTitleText;
    wx.setNavigationBarTitle({  title: BarTitleText})
    that.setData({productid:productid,BarTitleText:BarTitleText});
    this.getProductDetail(productid);    //非音频信息
    WxNotificationCenter.addNotification('PayChanged', that.didPayChanged, that);
  },

  didPayChanged:function () {
    var that=this;
    var productid=that.data.productid;
    this.getProductDetail(productid);
  },

  onUnload: function () {
    var that = this;
    WxNotificationCenter.removeNotification('PayChanged', that);
    that.setData({
      loadingHidden: true
    })
  },

    proFavoriteFnNew:function(e){
        var that=this;
        var userInfoS=wx.getStorageSync("userInfoS");
        if(userInfoS){
            this.proFavoriteFn();
        }else{     //无缓存users,即 用户未授权过
            if(e.detail.userInfo){       // 同意授权用户信息...（含头像等），即用户点击确定
                user_api.loginS3(e.detail,{
                    getFn:function () {
                        that.proFavoriteFn();
                    }
                });
            }else{                         // 用户点击取消

            }
        }
    },

  proFavoriteFn:function () {
    var that=this;
    var mainInfomation=that.data.mainInfomation;
    var productid=that.data.productid;
    data_api.proFavorite(productid,{
      success:function (res) {
        if(res.data && res.data.code=="1000"){
          mainInfomation.favorite='1';
            that.setData({
              mainInfomation:mainInfomation
            })
        }else{
          console.log("收藏失败")
        }
      },fail:function (msg) {
        console.log(msg);
      },complete:function (msg) {
      }
    },"GET")
  },

  // 得到详情页的产品简介和其他非音频信息
  getProductDetail:function (productid) {
    var that=this;
    var Url=config.service.host;
    data_api.getProductDetail(productid,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var mainInfomation=res.data.data;
          // type:1--虚拟商品（电子书）；2--实物书籍；3--电子书+实体；(为了实现小程序虚拟课程全部免费上线的目的，新需求：电子书购买改为‘咨询客服’)
          var mainPurchase=mainInfomation.purchase&&mainInfomation.type=='1'?'1':'0';
          if(mainInfomation.type=='1'){
            mainPurchase='1'
          };
          if(mainInfomation['miu']){
            mainInfomation['miuNew']= Url+mainInfomation['miu'].match(/..\/(\S*)/)[1];
          }

          var description_content=WxParse.wxParse('description_content', 'html', mainInfomation.description, that, 5)
          mainInfomation['prefePrice']=(mainInfomation['discountRate']*mainInfomation['price']).toFixed(2);

          that.setData({
            mainInfomation:mainInfomation,
            description_content:description_content,
            mainPurchase:mainPurchase,
            mainType:mainInfomation.type
          })
        }else{
          console.log("请求异常")
        }
      },fail:function (msg) {
        console.log(msg);
      },complete:function (msg) {
        that.setData({ loadingHidden: true })
      }
    },"GET")
  },

  closeModal:function () {
    this.setData({lock:true})
  },

  // 先填写表单，然后在表单页付款
  payFn:function () {
    wx.navigateTo({
      url: '../dryGoodsForm/dryGoodsForm?productid='+this.data.productid+'&BarTitleText='+this.data.BarTitleText+'&mainType='+this.data.mainType
    })
  },

  // 进入下载课件页面
  goCourseDownloadFn:function () {
    wx.navigateTo({
      url: '../dryGoodsForm/dryGoodsForm?productid='+this.data.productid+'&BarTitleText='+this.data.BarTitleText+'&mainPurchase='+this.data.mainPurchase+'&mainType='+this.data.mainType
    })
  },


  homebackPage:function () {
    // var pages = getCurrentPages();             //  获取页面栈
    // var currPage = pages[pages.length - 1];    // 当前页面
    // var prevPage = pages[pages.length - 2];    // 上一个页面
    // prevPage.setData({
    //   activeIndex: 2                       // 假数据
    // })
    wx.navigateBack({
      delta: 1
    })
  },

  blockPageFn:function () {
    this.setData({payStatus:'-1'});
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/dryGoodsdetail/dryGoodsdetail?productid='+this.data.productid+'&BarTitleText='+this.data.BarTitleText,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});