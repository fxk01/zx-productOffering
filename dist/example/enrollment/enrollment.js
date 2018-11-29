var data_api = require("../api/data_api.js");
Page({
  data: {
    disabled:false,
    reminder: '',  //提示信息
    name: '',
    nameHighlight:false,
    organization: '',
    orgHighlight:false,
    phone: '',
    phoneHighlight:false,
  },
  onLoad: function (options) {

  },
  getName:function (e) {
    var  name= e.detail.value;
    if(name){
      this.setData({ name: name, reminder: '',nameHighlight:true,disabled:false})
    }else{
      this.setData({reminder: '请输入您的姓名',nameHighlight:false })
    }

  },
  getMechanism:function (e) {
    var  organization= e.detail.value;
    if(organization){
      this.setData({ organization: organization, reminder:'', orgHighlight:true,disabled:false})
    }else{
      this.setData({reminder: '请输入您的机构',orgHighlight:false })
    }

  },
  getPhone:function (e) {
    var  phone= e.detail.value;
    if (phone) {
      if (/^1[34578]\d{9}$/.test(phone)) {
        this.setData({ phone: phone, reminder:'', phoneHighlight:true,disabled:false})
      } else {
        this.setData({ reminder: "手机号码格式不正确，请输入正确的手机号!",phoneHighlight:false})
      }
    }else{
      this.setData({ reminder: "",phoneHighlight:false})
    }
  },
  Submit: function () {
    var that = this;
    var name = this.data.name;
    var organization = this.data.organization;
    var phone = this.data.phone;
    data_api.enrollmentForm(name, organization, phone,{
      success: function (res) {
        if(res.data.code==60006){
          that.showToast("提交成功","success",2000);
          that.setData({disabled:true})
        }else if(res.data.code==60007){
          that.showToast("提交失败","loading",2000);
        }else{
          that.showToast(res.data.msg,"loading",2000);
        }
      },fail(msg) {
        that.showToast(msg,"loading",2000);
      }
    }, "GET")
  },
  showToast: function (title, icon, duration) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/enrollment/enrollment',
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