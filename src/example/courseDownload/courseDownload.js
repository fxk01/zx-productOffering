var data_api = require("../api/data_api.js");

Page({
  data:{
    disableBool:false,  //默认表单提交按钮可点击
    loadingHidden:true,
    displayPage:true,
    emailNum:'',   //邮箱
    phoneNum:'',   //手机号
    addrText:'',   //收货地址
    dutyText:'',  //职务
    emailIsChange:true,  //邮箱是否正确
    phoneIsChange:true,  //手机号是否正确
    addrIsChange:true,   //收货地址是否正确
  },

  onLoad: function (options) {
    var that = this;
    var productid=options.productid;    //课程id
    that.setData({productid:productid});
  },
  // var productid=that.data.productid;
  // var email=that.data.email;
  // var address=that.data.address;
  // var phone=that.data.phone;
  // var title=that.data.title;

  blockPageFn: function () {
    var that=this;
    var productid=that.data.productid;
    // var email='1330890751@qq.com';
    // var address="我是地址";
    // var phone='18266771111';
    // var title='web';
    var email=that.data.emailNum;
    var address=that.data.addrText;
    var phone=that.data.phoneNum;
    var title=that.data.dutyText;
    var comment='';
    if(email&&address&&phone){
      that.setData({disableBool:true,loadingHidden:false});
      // productid,email,address,phone,title,comment,
      data_api.downMaterialFnSub(productid, email, address,phone, title,comment,{
        success: function (res) {
          if(res.data.code==1000){
            // displayPage:false,
            that.setData({displayPage:false,disableBool:false,loadingHidden:true})
          }else if(res.data.code==60007){
            that.setData({disableBool:false,loadingHidden:true})
            console.log("提交失败");
          }else{
            that.setData({disableBool:false,loadingHidden:true});
          }
        },fail(msg) {
          that.setData({disableBool:false,loadingHidden:true})
          that.showToast(msg,"loading",2000);
        }
      }, "POST")
    }else{
      if(email==''){
        that.setData({emailIsChange:false})
      }

      if(address==''){
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

  // 失去焦点获取value值 --邮箱
  emailblurFn: function (e) {
    var emailNum= e.detail.value;
    var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (emailNum) {
      if (reg.test(emailNum)) {
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
      path: '/example/courseDownload/courseDownload?productid='+this.data.productid,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },
});