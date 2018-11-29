var network = require('../js/network.js');

// 关于积募
function getJimuinfo(callback,Method) {
  var params = {};
  network.request("display/jimuinfo", params, callback, Method);
}

function getCourseDetail(id,callback,Method) {
  var params = {
    id:id
  };
  network.request("display/detail", params, callback, Method);
}

function getCalendar(callback,Method) {
  var params = {};
  network.request("display/calendar", params, callback, Method);
}

function getIcon(page_type,callback,Method) {
  var params = {
    page_type:page_type
  };
  network.request("display/baicondar", params, callback, Method);
}

function getBanner(page_type,callback,Method) {
  var params = {
    page_type:page_type
  };
  network.request("display/baicondar", params, callback, Method);
}

function subForm(name, organization, phone,service_flag,callback,Method) {
  var params = {
    name: name,
    organization: organization,
    phone: phone,
    service_flag:service_flag
  };
  network.request("jimu/saveSubmitUserInfo", params, callback, Method);
}

function subFormRiLi(phone, email, callback, Method) {
  var params = {
    phone: phone,
    email: email,
  };
  network.request("jimu/saveContactInfo", params, callback, Method);
}

function enrollmentForm(name, organization, phone,callback,Method) {
  var params = {
    name: name,
    organization: organization,
    phone: phone
  };
  network.request("jimu/register", params, callback, Method);
}

// 订阅模板
function subscribeForm(formId,callback,Method) {
  var params = {
    formId: formId
  };
  network.request("jimu/subscribe", params, callback, Method);
}

function subFormRiLi(phone, email, callback, Method) {
  var params = {
    phone: phone,
    email: email,
  };
  network.request("jimu/saveContactInfo", params, callback, Method);
}

// mine-openId:56 order/submit?productid=1
function getPay(productid, callback, Method) {
  var params = {
    productid: productid
  };
  network.request("order/submit", params, callback, Method);
}

// 存储音频
// productid=productid&courseid=COURSEID&duration=DURATION&currenttime=CURRENTTIME
function setAudioStorage(productid,courseid,duration,currenttime,callback, Method) {
  var params = {
    productid: productid,
    courseid:courseid,
    duration:duration,
    currenttime:currenttime
  };
  network.request("record/save", params, callback, Method);
}

// 得到存储过的音频/get?productid=productid
function getAudioStorage(productid,callback, Method) {
  var params = {
    productid: productid
  };
  network.request("record/get", params, callback, Method);
}

// 私募研习社首页数据回显
function getEchomodule(page,pagesize,callback, Method) {
  var params = {
    page:page?page:'1',
    pagesize:pagesize?pagesize:'10'
  };
  console.log(page,pagesize,'1');
  network.request("echo/module", params, callback, Method);
}

// // 更多--热点解读
// function hotreadEchomodule(page,pagesize,callback, Method) {
//   var params = {
//     page:page?page:'1',
//     pagesize:pagesize?pagesize:'10'
//   };
//   console.log(page,pagesize,'2');
//   network.request("echo/module", params, callback, Method);
// }
//
// // 更多--进阶系列
// function advEchomodule(page,pagesize,callback, Method) {
//   var params = {
//     page:page?page:'1',
//     pagesize:pagesize?pagesize:'10'
//   };
//   console.log(page,pagesize,'3');
//   network.request("echo/module", params, callback, Method);
// }
//
// // 更多--线下私享会
// function offlineEchomodule(page,pagesize,callback, Method) {
//   var params = {
//     page:page?page:'1',
//     pagesize:pagesize?pagesize:'10'
//   };
//   console.log(page,pagesize,'4');
//   network.request("echo/module", params, callback, Method);
// }
//
// //更多--干货
// function drygoodsEchomodule(page,pagesize,callback, Method) {
//   var params = {
//     page:page?page:'1',
//     pagesize:pagesize?pagesize:'10'
//   };
//   console.log(page,pagesize,'5');
//   network.request("echo/module", params, callback, Method);
// }

// 私募研习社音频获取（首页和详情页都是 productid）
function getCompliance(productid,page,pagesize,callback, Method) {
  var params = {
    productid: productid,
    page:page,
    pagesize:pagesize
  };
  network.request("echo/module/product/course/unfold", params, callback, Method);
}

// 私募研习社商品详情页 listendetail,(线下活动详情页offlineDetailnew)
function getProductDetail(productid,callback, Method) {
  var params = {
    productid: productid
  };
  network.request("echo/product/detail", params, callback, Method);
}

// 私募研习社商品详情页之--收藏 listendetail
function proFavorite(productid,callback, Method) {
  var params = {
    productid: productid
  };
  network.request("product/favorite", params, callback, Method);
}

// 私募研习社商品详情页之下载课件 listendetail--> // productid,email,address,phone,title,comment,
function downMaterialFnSub(productid,email,address,phone,title,comment,callback, Method) {
  var params = {
    productid: productid,
    email:email,
    address:address,
    phone:phone,
    title:title,
    comment:comment
  };
  network.request("product/download/material", params, callback, Method);
}

//线下活动报名 --activyRegistration--
function activityRegister(productid,name,phone,company,title,callback, Method) {
  var params = {
    productid: productid,
    name:name,
    phone:phone,
    company:company,
    title:title    //选填
  };
  network.request("product/activity/register", params, callback, Method);
}

// 我的--已报活动
function meRegister(callback, Method) {
  var params = {};
  network.request("me/register", params, callback, Method);
}

// 我的--收藏
function meFavorite(callback, Method) {
  var params = {};
  network.request("me/favorite", params, callback, Method);
}

// 我的--已购项目
function mePurchased(callback, Method) {
  var params = {};
  network.request("me/purchased", params, callback, Method);
}

// 干货--购买书本先填写信息
function dryGoodsUsersubmit(productid,email,address,phone,title,comment,callback, Method) {
  var params = {
    productid:productid,
    email:email,
    address:address,
    phone:phone,
    title:title,
    comment:comment
  };
  network.request("product/entity/userinfo/submit", params, callback, Method);
}

// 线下活动-offlinelist更多页面
function getModuleId(moduleid,page,pagesize,callback, Method) {
  var params = {
    moduleid:moduleid,
    page:page,
    pagesize:pagesize,
  };
  network.request("echo/module/product/unfold", params, callback, Method);
}

// channelId＝7绑定手机号
module.exports = {
  subForm: subForm,
  subscribeForm:subscribeForm,
  subFormRiLi: subFormRiLi,
  enrollmentForm:enrollmentForm,
  getBanner:getBanner,
  getIcon:getIcon,
  getCalendar:getCalendar,
  getJimuinfo:getJimuinfo,
  getCourseDetail:getCourseDetail,
  getPay:getPay,
  setAudioStorage:setAudioStorage,
  getAudioStorage:getAudioStorage,
  getEchomodule:getEchomodule,
  getProductDetail:getProductDetail,
  getCompliance:getCompliance,
  proFavorite:proFavorite,
  downMaterialFnSub:downMaterialFnSub,
  activityRegister:activityRegister,
  dryGoodsUsersubmit:dryGoodsUsersubmit,
  meRegister:meRegister,
  meFavorite:meFavorite,
  mePurchased:mePurchased,
  getModuleId:getModuleId
};