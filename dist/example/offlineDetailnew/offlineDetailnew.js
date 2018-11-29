var WxParse = require('../wxParse/wxParse.js');
var data_api = require("../api/data_api.js");
var user_api = require('../api/user_api.js');
var config=require('../api/config');
var app = getApp();
Page({
  data:{
    isIphoneX:app.globalData.isIphoneX,
    loadingHidden: false,
    isEnd:'0',     //是否活动结束而不是是否已购买（"0"未购买，”1“已购买），活动结束isEnd:为1，立即报名isEnd->为0
    tabar_two:{
      leftTxt:'活动咨询',
      leftIcon:'../images/tabBt_consult_default.png',
      centerTxt1:'立即报名',
      centerIcon1:'../images/signup_color.png',
      centerTxt2:'活动结束',
      centerIcon2:'../images/signup_close.png',
      centerUrl:'',
      rightTxt:'我的',
      rightIcon:'../images/tabBt_mine_default.png',
      rightUrl:'../mine/mine'
    },
  },
  onLoad:function (options) {
    var that = this;
    var BarTitleText=options.BarTitleText;
    wx.setNavigationBarTitle({  title:BarTitleText });
    var productid=options.productid;    //线下活动商品id
    var isEnd=options.price;

  // <!--price;  //线下私享会&#45;&#45;》报名结束：1.00 、立即报名标识：0.00-->
    if(isEnd=='0.00'){    //可以立即报名
      that.setData({mainPurchase:'0'})
    }else{   //活动结束
      that.setData({mainPurchase:'1'})
    }
    that.setData({
      isEnd:isEnd,         //是否报名结束
      BarTitleText:BarTitleText,
      productid:productid
    });
    that.getProductDetailFn(productid);
  },

  onUnload: function () {
    var that = this;
    that.setData({
      loadingHidden: true
    })
  },

  getProductDetailFn:function (productid) {
    var that=this;
    // var productid=that.data.productid;
    data_api.getProductDetail(productid,{
      success:function (res) {
        if(res.data && res.data.code== "1001"){
          var mainInfomation=res.data.data;
          var Url=config.service.host;
          if(mainInfomation['image']){
            mainInfomation['imageNew']= Url+mainInfomation['image'].match(/..\/(\S*)/)[1];
          }
          var description_content=WxParse.wxParse('description_content', 'html', mainInfomation.description, that, 5);
          if(mainInfomation['miu'].indexOf(" ")!='-1'){
            mainInfomation['miu']=mainInfomation['miu'].substring(0,mainInfomation['miu'].indexOf(" ")).replace(/-/g, ".");
          }else{
            mainInfomation['miu']=mainInfomation['miu'].replace(/-/g, ".");
          }
          that.setData({
            mainInfomation:mainInfomation,
            description_content:description_content
          })
        }else{
          // console.log("失败")
        }
      },fail:function (msg) {
        // console.log(msg);
      },complete:function (msg) {
        that.setData({ loadingHidden: true })
      }
    },"GET")
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

  // 点击收藏
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
          // console.log("收藏失败");
        }
      },fail:function (msg) {
        // console.log(msg);
      },complete:function (msg) {

      }
    },"GET")
  },

  // 活动立即报名
  payFn:function () {
    wx.navigateTo({
        url: '../activyRegistration/activyRegistration?productid='+this.data.productid,
    })
  },

  homebackPage:function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/offlineDetailnew/offlineDetailnew?BarTitleText='+this.data.BarTitleText+'&productid='+this.data.productid+'&price='+this.data.isEnd,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});