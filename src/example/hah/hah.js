var app = getApp();
var config=require('../api/config');
var WxParse = require('../wxParse/wxParse.js');
var data_api = require("../api/data_api.js");
var WxNotificationCenter = require("../template/WxNotificationCenter/WxNotificationCenter.js");

// 音频
var _utils = require('../utils/utils');
var _utils2 = _interopRequireDefault(_utils);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var toast = require('../template/toast/toast');

Page({
  data:{
    // tablist: [
    //   {id: '1',title: '简介'},
    //   {id: '2',title: '课程（12节）'},
    // ],
    tabSelectedId:'2',  //默认显示课程
  },
  onLoad: function (options) {

  },

  ChangeDetailTab:function (e) {
    var that = this;
    var tabSelectedId=e.currentTarget.dataset.id;
    that.setData({
      tabSelectedId:tabSelectedId
    })
  },




});