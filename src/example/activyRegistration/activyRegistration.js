var data_api = require("../api/data_api.js");
var user_api = require('../api/user_api.js');

Page({
  data:{
    disableBool:false,
    displayPage:true,
    emailNum:'',   //姓名
    phoneNum:'',   //手机号
    addrText:'',   //公司名称
    dutyText:'',  //职务
    emailIsChange:true,  //姓名是否正确
    phoneIsChange:true,  //手机号是否正确
    addrIsChange:true,   //公司名称是否正确
  },

  onLoad: function (options) {
    var that = this;
    var productid=options.productid;    //课程id
    that.setData({productid:productid});
  },

  blockPageNewFn:function(e){
      var that=this;
      var userInfoS=wx.getStorageSync("userInfoS");
      if(userInfoS){
          this.blockPageFn();
      }else{     //无缓存users,即 用户未授权过
          if(e.detail.userInfo){       // 同意授权用户信息...（含头像等），即用户点击确定
              user_api.loginS3(e.detail,{
                  getFn:function () {
                      that.blockPageFn();
                  }
              });
          }else{                         // 用户点击取消

          }
      }
  },

  blockPageFn: function () {
    var that=this;
    var productid=that.data.productid;

    var name=that.data.emailNum;
    var company=that.data.addrText;
    var phone=that.data.phoneNum;
    var title=that.data.dutyText;

    if(name&&company&&phone){
      that.setData({disableBool:true});
      data_api.activityRegister(productid,name,phone,company,title,{
        success: function (res) {
          if(res.data.code==1000){
            that.setData({displayPage:false})
          }else if(res.data.code==60007){
            console.log("提交失败");
          }else{
            console.log(res.data.msg);
          }
        },fail(msg) {
          that.showToast(msg,"loading",2000);
        }
      }, "GET")
    }else{
      if(name==''){
        that.setData({emailIsChange:false})
      }

      if(company==''){
        that.setData({addrIsChange:false})
      }

      if(phone==''){
        that.setData({phoneIsChange:false})
      }
    }

  },

  goDryGoodsPage:function () {
    wx.redirectTo({
      url: '../dryGoods/dryGoods'
    })
  },

  // 去积募干货页
  goDryGoodsPage:function () {
    wx.redirectTo({
      url: '../dryGoods/dryGoods'
    })
  },

  // 失去焦点获取value值 --姓名
  emailblurFn: function (e) {
    var emailNum= e.detail.value;
    var len = emailNum.length;
    if (emailNum) {
      if (len>1) {
        this.setData({ emailNum: emailNum, emailIsChange:true,boolean:false})
      } else {
        this.setData({emailIsChange:false})
      }
    }else{
      this.setData({emailIsChange:false})
    }
  },
  emailfocusFn: function (e) {
    this.setData({emailIsChange:true})
  },

  // 手机
  phoneblurFn: function (e) {
    var phoneNum=e.detail.value;
    if(phoneNum){
      if(/^1[34578]\d{9}$/.test(phoneNum)){
        this.setData({phoneNum:phoneNum,phoneIsChange:true})
      }else{
        this.setData({phoneIsChange:false})
      }
    }else{
      this.setData({phoneIsChange:false})
    }
  },

  phonefocusFn: function (e) {
    this.setData({phoneIsChange:true})
  },

  // 收货地址
  addrblurFn: function (e) {
    var addrText=e.detail.value;
    if(addrText){
      this.setData({addrText:addrText,addrIsChange:true})
    }else{
      this.setData({addrIsChange:false})
    }
  },

  addrfocusFn: function (e) {
    this.setData({addrIsChange:true})
  },

  // 职务
  dutyblurFn: function (e) {
    var dutyText=e.detail.value;
    if(dutyText){
      this.setData({dutyText:dutyText,dutyIsChange:true})
    }else{
      this.setData({dutyIsChange:false})
    }
  },

  dutyfocusFn: function (e) {
    this.setData({dutyIsChange:true})
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/activyRegistration/activyRegistration?productid='+this.data.productid,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});