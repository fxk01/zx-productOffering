var data_api = require("../api/data_api.js");
var toast = require('../template/toast/toast');
Page({
  data:{
    loadingHidden:true,
    displayPage:true,
    disableBool:false,
    toast: {     //是否显示提示、提示内容
      show: false,
      content: ''
    },
    emailNum:'',   //邮箱
    phoneNum:'',   //手机号
    addrText:'',   //收货地址
    dutyText:'',  //职务
    commentText:'',  //备注
    emailIsChange:true,  //邮箱是否正确
    phoneIsChange:true,  //手机号是否正确
    addrIsChange:true,   //收货地址是否正确
    // dutyIsChange:true,
    // commentIsChange:true,

    displayPage:true
  },

  onLoad: function (options) {
    var that = this;
    console.log(options,'options')
    var productid=options.productid;    //课程id
    var BarTitleText=options.BarTitleText;
    var mainType=options.mainType;
    var mainPurchase=options.mainPurchase;   //是否已购买 且购买的为电子书方可下载课件；
    wx.setNavigationBarTitle({  title: BarTitleText})
    that.setData({productid:productid,BarTitleText:BarTitleText,mainType:mainType,mainPurchase:mainPurchase});
  },

  // var productid=that.data.productid;
  // var email=that.data.email;
  // var address=that.data.address;
  // var phone=that.data.phone;
  // var title=that.data.title;
  dryGoodsUsersubFn: function () {
    var that=this;
    var productid=that.data.productid;
    var mainType=that.data.mainType;
    var email=that.data.emailNum;
    var address=that.data.addrText;
    var phone=that.data.phoneNum;
    var title=that.data.dutyText;
    var comment=that.data.commentText;
    if(mainType=='1'){  //电子书
      if(email&&phone){
        data_api.dryGoodsUsersubmit(productid,email,address,phone,title,comment,{
          success: function (res) {
            if(res.data.code==1000){
              that.setData({disableBool:true})
              toast.toast({              //提交成功
                show: true,
                content: '信息填写成功,即将进入支付页面'
              });
              setTimeout(function(){
                wx.navigateTo({
                  url: '../pay/pay?productid='+that.data.productid+'&mainType='+mainType
                })
              },1500);

            }else if(res.data.code==60007){     //提交失败；
              toast.toast({              //提交成功
                show: true,
                content: '提交失败'
              });
            }else{
              toast.toast({              //提交成功
                show: true,
                content: '提交失败'
              });
            }
          },fail(msg) {
            // that.showToast(msg,"loading",2000);
          }
        }, "GET")
      }else{
        if(email==''){
          that.setData({emailIsChange:false})
        }

        if(phone==''){
          that.setData({phoneIsChange:false})
        }
      }
    }else{   //实物书或者 实物+电子书
      if(email&&address&&phone){
        data_api.dryGoodsUsersubmit(productid,email,address,phone,title,comment,{
          success: function (res) {
            if(res.data.code==1000){
              that.setData({disableBool:true})
              toast.toast({              //提交成功
                show: true,
                content: '信息填写成功,即将进入支付页面'
              });
              setTimeout(function(){
                wx.navigateTo({
                  url: '../pay/pay?productid='+that.data.productid+'&mainType='+mainType
                })
              },1500);

            }else if(res.data.code==60007){     //提交失败；
              toast.toast({              //提交成功
                show: true,
                content: '提交失败'
              });
            }else{
              toast.toast({              //提交成功
                show: true,
                content: '提交失败'
              });
            }
          },fail(msg) {
            // that.showToast(msg,"loading",2000);
          }
        }, "GET")
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
    }

  },

  dryGoodsLoodFn:function () {
    var that=this;
    var productid=that.data.productid;
    var email=that.data.emailNum;
    var address=that.data.addrText;
    var phone=that.data.phoneNum;
    var title=that.data.dutyText;
    var comment=that.data.commentText;
    if(email&&phone){
      that.setData({disableBool:true,loadingHidden:false});
      data_api.downMaterialFnSub(productid,email,address,phone,title,comment,{
        success: function (res) {
          if(res.data.code==1000){
            that.setData({displayPage:false,disableBool:false,loadingHidden:true})
          }else if(res.data.code==60007){     //提交失败；
            that.setData({disableBool:false,loadingHidden:true})
          }else{
            that.setData({disableBool:false,loadingHidden:true})
          }
        },fail(msg) {
          that.setData({disableBool:false,loadingHidden:true})
        }
      }, "GET")

    }else{
      if(email==''){
        that.setData({emailIsChange:false})
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

  //备注
  commentblurFn:function (e) {
    var commentText=e.detail.value;
    if(commentText){
      this.setData({commentText:commentText,commentIsChange:true})
    }else{
      this.setData({commentIsChange:false})
    }
  },

  commentfocusFn:function (e) {
    this.setData({commentIsChange:true})
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/dryGoodsForm/dryGoodsForm?productid='+this.data.productid+'&BarTitleText='+this.data.BarTitleText+'&mainPurchase='+this.data.mainPurchase+'mainType='+this.data.mainType,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});