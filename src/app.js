var user_api = require('./example/api/user_api.js');
var regeneratorRuntime = require('./example/utils/regenerate');
App({
  onLaunch: function () {
    // //登录
    // user_api.login();
    // this.globalData.backgroundPlayer = wx.getBackgroundAudioManager();
  },
  //第一种状态的底部
  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;

    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },
  //第二种状态的底部
  editTabBar2: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar2 = this.globalData.tabBar2;
    for (var i = 0; i < tabBar2.list.length; i++) {
      tabBar2.list[i].active = false;
      if (tabBar2.list[i].pagePath == _pagePath) {
        tabBar2.list[i].active = true;
      }
    }
    _curPage.setData({
      tabBar2: tabBar2
    });
  },

  //
  async onLaunch() {
    var that=this;
    this.globalData.backgroundPlayer = wx.getBackgroundAudioManager();
    user_api.login();
    wx.getSystemInfo({
      success: function(res) {
        if(res.model.indexOf("iPhone X")>-1){
          that.globalData.isIphoneX=true
        }
        // else if(res.model.indexOf("iPhone 6")>-1){
        //   console.log("iPhone 6测试");
        //   that.globalData.isIphoneX=true
        // }
      }
    });
    try {
    } catch (e) {

    }
  },
  globalData: {
    isIphoneX:false,   //默认设备不是iphoneX
    userInfo: null,
    token: null,
    tabBar: {
      "color": "#636363",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "width": "width: 30px",
          "pagePath": "privateSchool/privateSchool",
          "text": "关于积募",
          "iconPath": "./images/tabBt1.png",
          "selectedIconPath": "../images/tabBt1.png",
          "clas":"menu-item",
          "selectedColor": "#636363",
          openType: false,
          active: false,
        },
        {
          "width": "width: 25px",
          "pagePath": "freecourses/freecourses",
          "text": "私募学堂",
          "iconPath": "./images/tabBt2.png",
          "selectedIconPath": "../images/tabBt2.png",
          "selectedColor": "#0078ff",
          "clas": "menu-item",
          openType: true,
          active: true,
        },
      ],
      "position": "bottom"
    },
    tabBar2: {
      "color": "#636363",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "privateSchool/privateSchool",
          "text": "关于积募",
          "iconPath": "../images/tabBt1.png",
          "selectedIconPath": "../images/tabBt1.png",
          "clas":"menu-item",
          "selectedColor": "#636363",
          active: false
        },
        {
          "pagePath": "freecourses/freecourses",
          "text": "私募学堂",
          "iconPath": "../images/tabBt2.png",
          "selectedIconPath": "../images/tabBt2.png",
          "selectedColor": "#0078ff",
          "clas": "menu-item",
          active: true,
        },
      ],
      "position": "bottom"
    },
  }
});