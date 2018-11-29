var data_api = require("../api/data_api.js");
var user_api = require('../api/user_api.js');
var WxNotificationCenter = require("../template/WxNotificationCenter/WxNotificationCenter.js");

Page({
  data:{
    successTxt:'',
    payStatus:'-1'    //显示当前页面
    // isEnd:'0',     //是否活动结束而不是是否已购买（"0"未购买，”1“已购买），活动结束isEnd:为1，立即报名isEnd->为0
  },
  onLoad:function (options) {
    var that = this;
    var mainType=options.mainType;
    var productid=options.productid;    //线下活动商品id
    that.setData({
      mainType:mainType,
      productid:productid
    });
    that.payFn(productid);
    that.successTxt(mainType);
  },

  // 购买成功信息提示
  successTxt:function (mainType) {
    var that=this;
    var successTxt='';
    if(mainType=='1'){
      successTxt='购买成功，已发送至您的邮箱，请查收！'
    }else if(mainType=='2'){
      successTxt='购买成功，我们会尽快为您发货！'
    }else{
      successTxt='购买成功，我们会尽快为您发货！电子版已发送至您的邮箱，请查收！'
    }
    that.setData({successTxt:successTxt})
  },

  // 付款
  payFn:function (productid) {
    var that=this;
    // var productid=that.data.productid;
    var that=this;
    data_api.getPay(productid,{
      success:function (res) {
        if(res && res.data.code=='70000'){
          // that.requestPayment(res.data.data);
          that.setData({
            payInfo:res.data.info,
            reqPaymentData:res.data.data
          });
        }else if(res.data.code=='70001'){
          // console.log(res,'提交订单失败');
        }else if(res.data.code=='70001'){
          // console.log(res,'提交订单成功，再次签名失败');
        }
      },fail:function (msg) {
        // console.log(msg);
      },complete:function (msg) {
        that.setData({
          lock:true     //关闭‘解锁全部课程弹框’})
        })
      }
    },"GET")
  },

  requestPaymentFnNew:function(e){
      var that=this;
      var userInfoS=wx.getStorageSync("userInfoS");
      if(userInfoS){
          this.requestPaymentFn();
      }else{     //无缓存users,即 用户未授权过
          if(e.detail.userInfo){       // 同意授权用户信息...（含头像等），即用户点击确定
              user_api.loginS3(e.detail,{
                  getFn:function () {
                      that.requestPaymentFn();
                  }
              });
          }else{                         // 用户点击取消

          }
      }
  },

  //申请支付
  requestPaymentFn: function(){
    var that=this;
    var reqPaymentData=that.data.reqPaymentData;
    wx.requestPayment({
      'timeStamp': reqPaymentData.timeStamp,
      'nonceStr': reqPaymentData.nonceStr,
      'package': reqPaymentData.package,
      'signType': reqPaymentData.signType,
      'paySign': reqPaymentData.paySign,
      'success':function(res){                   //调取小程序接口，支付成功
        that.setData({
          payStatus:'1',
          // lock:true     //关闭‘解锁全部课程弹框’
          zanObj: {}
        });
        // 如果支付成功则应该刷新之前页面解锁,而且将底部--立即购买重新渲染，更改为--’立即下载‘
        WxNotificationCenter.postNotificationName('PayChanged')
      },
      'fail':function(res){                      //调取小程序接口，支付失败
        // console.log(res);
        that.setData({
          payStatus:'0',
          // lock:true
        })
      }
    })
  },

  // 返回上一个页面
  returnFn:function () {
    wx.navigateBack({     //返回上一页面或多级页面
      delta:1
    })
  },

  godryGoodsPage:function () {
    wx.redirectTo({
      url: '../dryGoods/dryGoods'
    })
  },

  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/pay/pay?productid='+this.data.productid,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },
});