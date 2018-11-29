var app = getApp();
var config=require('../api/config');
var WxParse = require('../wxParse/wxParse.js');
var data_api = require("../api/data_api.js");
var user_api = require('../api/user_api.js');
var WxNotificationCenter = require("../template/WxNotificationCenter/WxNotificationCenter.js");


// 音频
var _utils = require('../utils/utils');
var _utils2 = _interopRequireDefault(_utils);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var toast = require('../template/toast/toast');

Page({
  data:{
    showFavorite:true,
    isIphoneX:app.globalData.isIphoneX,
    zanObj: {},
    totalNum:0, //总数据条数
    songLen:0, //已加载的数据-音频条数
    songlists:[], //初始化
    pagesize: 6, //每页条数
    page: 1,  //第一页
    toast: {     //是否显示提示、提示内容
      show: false,
      content: ''
    },
    loadingHidden: false,
    mainPurchase:'0',     //是否已购买
    getAudioBool:true,  //默认可以获取音频存储
    initBool:false,   //初始化
    drag:false,   //是否拖拽
    lock:true,
    tabar_two:{
      leftTxt:'立即咨询',
      leftIcon:'../images/tabBt_consult_default.png',
      centerTxt1:'立即购买',
      centerIcon1:'../images/tabBt_buy.png',
      centerTxt2:'下载课件',
      centerIcon2:'../images/tabBt_buy.png',
      centerUrl:'',
      rightTxt:'我的',
      rightIcon:'../images/me-delfut.png',
      rightUrl:'../mine/mine'
    },
    // tablist: [
    //   {id: '1',title: '简介'},
    //   {id: '2',title: '课程（12节）'},
    // ],
    tabSelectedId:'2',
    payStatus:'-1'    //显示当前页面
  },
  onLoad: function (options) {
    var that = this;
    var BarTitleText=options.BarTitleText?options.BarTitleText:'课程';
    var showdetail=options.showdetail;   //1:免费试听模块；2:热点解读课；3：进阶系列课
    if(showdetail=='1'){
      that.setData({
        showFavorite:false
      })
    };
    // if(showdetail=='3'){
    //   that.setData({
    //     tabSelectedId:1
    //   })
    // };
    wx.setNavigationBarTitle({  title:BarTitleText });
    WxNotificationCenter.addNotification('listenPayChanged', that.didlistenPayChanged, that);
    var productid=options.productid;    //课程id
    that.setData({productid:productid,BarTitleText:BarTitleText,showdetail:showdetail});
    this.getProductDetail(productid);    //非音频信息
  },

  onUnload: function () {
    //移除通知
    var that = this;
    WxNotificationCenter.removeNotification('listenPayChanged', that);
  },

  // 当下一页面的支付完成后，及时刷新此页面（小锁解开，立即购买变为‘下载课程’）
  didlistenPayChanged:function () {
    var that=this;
    var productid=that.data.productid;
    that.setData({
      songLen:0,
      songlists: [],
      page: 1,
      zanObj: {}
    });
    that.getProductDetail(productid);    //非音频信息
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
          // console.log("收藏失败");
        }
      },fail:function (msg) {
        // console.log(msg);
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
          var showdetail=that.data.showdetail;
          var mainInfomation=res.data.data;

          if(mainInfomation.miu){
            mainInfomation.miuNew=Url+mainInfomation['miu'].match(/..\/(\S*)/)[1];
          };
          // var aa='<p class="MsoNormal">增值税、出口退免税、增值税项目专家<span></span></p><p class="MsoNormal">全国税务系统领军人才<span></span></p><p class="MsoNormal">专注上海市税务系统<span>12</span>年<span></span></p><p class="MsoNormal">参与起草落实<span>140</span>号文第四条的资管产品增值税征收管理文件<span></span></p><p class="MsoNormal">全面参与上海市营改增全面推进项目<span></span></p><p>执笔上海市委市府、国家税务总局、上海市税务局营改增重点课题</p><p>a&nbsp;bb&nbsp;c</p>'
          var description_content=WxParse.wxParse('description_content', 'html', mainInfomation.description, that, 5);
          mainInfomation['prefePrice']=(mainInfomation['discountRate']*mainInfomation['price']).toFixed(2);
          if(mainInfomation['createTime']){
            mainInfomation['createTime']=mainInfomation['createTime'].substring(0,mainInfomation['createTime'].indexOf(" ")).replace(/-/g, ".") ;
          }
          if(mainInfomation['updateTime']){
            mainInfomation['updateTime']=mainInfomation['updateTime'].substring(0,mainInfomation['updateTime'].indexOf(" ")).replace(/-/g, ".") ;
          }

          that.setData({
            mainInfomation:mainInfomation,
            description_content:description_content,
            mainPurchase:showdetail=='1'?'1':mainInfomation.purchase
            // mainPurchase:1
          })
        }else{
          // console.log("请求异常");
        }
      },fail:function (msg) {
        that.setData({ loadingHidden: true });
      },complete:function (msg) {
        that.getComplianceFn();       //获取音频资源
        that.getAudioStorage();         //获取最后一次的音频存储
      }
    },"GET")
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    if (that.data.songLen < that.data.totalNum) {
      that.setData({
        page: that.data.page + 1,
      })
      that.getComplianceFn();   //继续加载音频，下一页
    } else {
      that.setData({ zanObj: { loading: false } });
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      songLen:0,
      songlists: [],
      page: 1,
      zanObj: {}
    })
    that.getComplianceFn();
  },

  // onPageScroll: function (res) {   //监听页面滑动高度；
  //   console.log(res.scrollTop);
  // },

  // 音频
  getComplianceFn:function () {
    var that=this;
    var productid=that.data.productid;
    var page=that.data.page;
    var pagesize=that.data.pagesize;
    var Url=config.service.host;
    data_api.getCompliance(productid,page,pagesize,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var size = that.data.songLen + res.data.data.length;
          var songlists=res.data.data;
          var totalNum=res.data.totals;
          var mainPurchase=that.data.mainPurchase;     //是否购买；
          songlists.forEach(function (item,idx) {
            item['isLock']=(mainPurchase=='0')&&(item['free']=='0')?true:false;     //存在小锁
            item['isPlaying']=false;
            if(item['media']){
              item['media']= Url+item['media'].match(/..\/(\S*)/)[1];
            }
            item['mediaNew']=item['externalLink']?item['externalLink']:item['media'];
            item['coverImgUrl']='http://7xj5et.com1.z0.glb.clouddn.com/gallery/img/2.jpg';
          });

          that.setData({
            songLen: size,
            songlists:that.data.songlists.concat(songlists),
            totalNum:totalNum,
          });

        }else if(res.data.code=="1002"){
          // console.log("数据库操作异常")
        }else if(res.data.code=="1004"){
          // console.log("查询结果为空")
          that.setData({
            zanObj: {
              nodata:true
            }
          })
        }
      },fail:function (msg) {
        // console.log(msg);
      },complete:function (msg) {
        that.bgFn();    //音频状态监控
        that.setData({ loadingHidden: true });
        wx.stopPullDownRefresh();    // 停止下拉刷新
      }
    },"GET")
  },

  // 释放解锁全部课程module
  displayUnlockModule:function () {
    this.setData({
      lock:false
    })
  },

  ChangeDetailTab:function (e) {
    var that = this;
    var tabSelectedId=e.currentTarget.dataset.id;
    that.setData({
      tabSelectedId:tabSelectedId
    })
  },

  changeLock:function (e) {
    this.setData({lock:false})
  },

  closeModal:function () {
    this.setData({lock:true})
  },

  homebackPage:function () {
    wx.navigateBack({
      delta: 1
    })
  },

  // 跳转到音频付款页面（listenpay）；
  payFn:function () {
    this.setData({lock:true});
    wx.navigateTo({
      url: '../listenpay/listenpay?productid='+this.data.productid
    })
  },

  goCourseDownloadFn:function () {
      wx.navigateTo({
        url: '../courseDownload/courseDownload?productid='+this.data.productid
      })
  },

  blockPageFn:function () {
    this.setData({payStatus:'-1'});
  },

  // 存储音频 productid,courseid,duration,currenttime
  setAudioStorage:function (currenttime,duration) {
    var that=this;
    var productid=that.data.productid;      //商品的id
    var courseid=that.data.currentId;
    var currenttime=currenttime;
    var duration=duration;
    data_api.setAudioStorage(productid,courseid,duration,currenttime,{
      success:function (res) {
        // if(res.data && res.data.code=="1000"){
        // }
      // },fail:function (msg) {
        // console.log(msg);
      }
    },"GET")
  },

  // 获取存储的音频 productid,courseid,duration,currenttime
  getAudioStorage:function (e) {
    var that=this;
    var productid=that.data.productid;      //商品的id
    data_api.getAudioStorage(productid,{
      success:function (res) {
        if(res.data && res.data.code=="1000"){
          if(res.data.data){    //有音频存储
            that.setData({
              initBool:true,
              res_courseTit:res.data.data.title,
              res_courseId:res.data.data.courseId,        //3(当时播放歌曲的id)
              res_currentTime:res.data.data.currentTime,    //3000
              res_duration:res.data.data.duration,            //4000
              res_createTime:res.data.data.createTime,    //2018-03-23 17:45:44
            });
            that.Initialize();   //若有音频存储则初始化缓存
          }else{
            that.setData({initBool:false});
          }
        }else{
          that.setData({initBool:false});
        }
      },fail:function (msg) {
        that.setData({initBool:false});
      }
    },"GET")
  },

  Initialize:function () {
    var that=this;
    var initBool=that.data.initBool;
    var getAudioBool=that.data.getAudioBool;
    // console.log('initBool='+initBool,'getAudioBool='+getAudioBool,'获取音频存储开关1 、2');
    if(initBool && getAudioBool){
      var res_courseId=that.data.res_courseId;
      var res_currentTime=that.data.res_currentTime;
      var res_duration=that.data.res_duration;
      var res_courseTit=that.data.res_courseTit;

      that.duration = res_duration * 1000;   //变为ms然后后面计算
      that.currentTime = res_currentTime * 1000;
      var _setProgress2 = that.setProgress(that.duration, that.currentTime),
        duration = _setProgress2.duration,
        currentTime = _setProgress2.currentTime,
        progressWidth = _setProgress2.progressWidth;
      that.setData({
        res_courseTit:res_courseTit,  //之前播放到第几节+课程名称；
        currentId:res_courseId,
        duration: duration,
        currentTime: currentTime,
        progressWidth: progressWidth,
      })
    }
  },


  bgFn:function () {
    var that=this;
    var _this2=this;
    that.backgroundPlayer = app.globalData.backgroundPlayer;
    var currentIndex='';
    wx.getBackgroundAudioPlayerState({
      success: function success(res) {
        var songlists=that.data.songlists;
        var currentPlayerId = wx.getStorageSync('currentPlayerId');
        that.setData({
          getAudioBool:false,     //禁止获取音频存储
          initBool:false,
          currentId:currentPlayerId
        });
        // console.log(res.status,'res.status1~状态--2：没有音乐在播放，1：播放中，0：暂停中');
        if(res.status===0){
          that.duration = that.backgroundPlayer.duration * 1000;   //变为ms然后后面计算
          that.currentTime = that.backgroundPlayer.currentTime * 1000;

          var _setProgress2 = _this2.setProgress(that.duration, that.currentTime),
            duration = _setProgress2.duration,
            currentTime = _setProgress2.currentTime,
            progressWidth = _setProgress2.progressWidth;

          if (that.data.drag) {
            that.setData({
              currentTime: currentTime,
              // waiting: false
            });
            return;
          }
          that.setData({
            duration: duration,
            currentTime: currentTime,
            progressWidth: progressWidth,
            // waiting: false
          });
          if(currentPlayerId){
            songlists.forEach(function (item,idx) {
              if(currentPlayerId==item['id']){
                item['isPlaying']=false;
                currentIndex=idx;    //如果同其他页面有相同的歌曲，存播放歌曲的ID和当前listData的下标
              }else{
                item['isPlaying']=false;
              }
            });
            that.setData({
              songlists: songlists,
              currentIndex:currentIndex
            });
          }
        }else if(res.status===1){     //播放中
          if(currentPlayerId){
            songlists.forEach(function (item,idx) {
              if(currentPlayerId==item['id']){
                item['isPlaying']=true;
                currentIndex=idx;  //如果同其他页面有相同的歌曲，存播放歌曲的ID和当前listData的下标
              }else{
                item['isPlaying']=false;
              }
            });
            that.setData({
              songlists: songlists,
              currentIndex:currentIndex
            });
          }
        } else{     //2：没有音乐在播放
          songlists.forEach(function (item,idx) {
            item['isPlaying']=false;
          });
          that.setData({
            songlists: songlists,
            currentTime: '00:00',
            progressWidth: 0
          });
        }
      }
    });

    // --------------音频开始播放---------------------
    that.backgroundPlayer.onPlay(function () {
      // 获取当前播放的src
      var songlists=that.data.songlists;
      var currentId=that.data.currentId;
      var res_courseId=that.data.res_courseId;
      songlists.forEach(function (item,idx) {
        if(currentId==item['id']){
          item['isPlaying']=true;
        }else{
          item['isPlaying']=false;
        }
      });

      var initBool=that.data.initBool;
      if(initBool===true && currentId===res_courseId){
        that.backgroundPlayer.seek(parseFloat(that.data.res_currentTime));
      }
      that.setData({
        songlists: songlists,
        initBool:false
      });
    });

    // 音频播放进度控制
    that.backgroundPlayer.onTimeUpdate(function () {
      that.duration = that.backgroundPlayer.duration * 1000;   //变为ms然后后面计算
      that.currentTime = that.backgroundPlayer.currentTime * 1000;
      var _setProgress2 = _this2.setProgress(that.duration, that.currentTime),
        duration = _setProgress2.duration,
        currentTime = _setProgress2.currentTime,
        progressWidth = _setProgress2.progressWidth;

      if (that.data.drag) {
        that.setData({
          currentTime: currentTime,
          // waiting: false
        });
        return;
      }
      that.setData({
        duration: duration,
        currentTime: currentTime,
        progressWidth: progressWidth,
        // waiting: false
        // cur_currentTime:that.backgroundPlayer.currentTime,   //实时存储播放到哪儿，如没有必要则不轻易这样做
        // cur_duration:that.backgroundPlayer.duration          //实时存储播放总时长，如没有必要则不轻易这样做
      });
    });

    // 自然播放后，自动切换到下一首
    that.backgroundPlayer.onEnded(function () {
      var songlists=that.data.songlists;
      // 如果当前页面拥有同其他页面相同的歌曲
      if (that.data.currentIndex < Number(songlists && songlists.length - 1)) {
        var playerData=songlists[that.data.currentIndex + 1];
        if(playerData.isLock){
          playerData=songlists[0];
        }
        that.setData({
          playerData:playerData ,
          currentIndex: that.data.currentIndex + 1,
          currentId:playerData.id,
          currentTime: '00:00',
          progressWidth: 0
        });
        that.backgroundPlayer.src = that.data.playerData.media;
        that.backgroundPlayer.title = that.data.playerData.name;
        that.backgroundPlayer.coverImgUrl = that.data.playerData.coverImgUrl;
        wx.setStorageSync('currentPlayerId', that.data.playerData.id);
      } else {   //超过最后一首或当前页面没有与其他页面相同的歌曲
        var currentIndex=that.data.currentIndex;
        if(songlists[currentIndex]){
          songlists[currentIndex].isPlaying=false;
          that.setData({
            songlists:songlists,
            // duration: '00:00',
            currentTime: '00:00',
            progressWidth: 0
          });
        }
      }
    });

    // -----------------------音频暂停播放后--------------------------
    that.backgroundPlayer.onPause(function () {
      var songlists=that.data.songlists;
      var currentIndex=that.data.currentIndex;
      songlists[currentIndex].isPlaying=false;
      that.setData({ songlists: songlists });
      // 此时请求后台接口：存储前端src,title,currentTime,durationTime
      var aa=parseFloat(that.backgroundPlayer.currentTime).toFixed(6);
      var bb=parseFloat(that.backgroundPlayer.duration).toFixed(6);
      that.setAudioStorage(aa,bb);
    });

    // ------------------------音频停止后-----------------------------
    // (this.backgroundPlayer.src没有，但是playerData已经保存)
    that.backgroundPlayer.onStop(function () {
      var songlists=that.data.songlists;
      var currentIndex=that.data.currentIndex;
      songlists[currentIndex].isPlaying=false;
      that.setData({ songlists: songlists });
    });

    that.backgroundPlayer.onError(function (res) {
      var msg = '';
      switch (res.errCode) {
        case 10001:
          msg = '系统错误';
          break;
        case 10002:
          msg = '网络错误';
          break;
        case 10003:
          msg = '文件错误';
          break;
        case 10004:
          msg = '格式错误';
          break;
        default:
          msg = '未知错误';
          break;
      }
      toast.toast({
        show: true,
        content: msg
      });
    });
  },

  // -----------------音频模块 onShow-----------------
  onShow:function () {
    // var productid=this.data.productid;
    // console.log('onShow~~~~~~~')
    // this.getProductDetail(productid);    //非音频信息
  },

  changeSong:function (e) {
    var that=this;
    var currentId=e.currentTarget.dataset.id;
    var currentSrc=e.currentTarget.dataset.src;
    var currentTitle=e.currentTarget.dataset.title;
    var currentCoverImgUrl=e.currentTarget.dataset.coverimgurl;

    // 控制按钮为暂停还是播放
    var currentIsPlaying=e.currentTarget.dataset.isplaying;
    var currentIndex=e.currentTarget.dataset.index;
    var songlists=that.data.songlists;
    // songlists[currentIndex].isPlaying=!currentIsPlaying;
    songlists.forEach(function (item,idx) {
      if(currentId==item['id']){
        item['isPlaying']=!currentIsPlaying;
      }else{
        item['isPlaying']=false;
      }
    });
    that.setData({ songlists: songlists });

    if(songlists[currentIndex].isPlaying){
      that.backgroundPlayer.play();//播放按钮
      if(!that.backgroundPlayer.src || currentSrc !== that.backgroundPlayer.src){
        that.backgroundPlayer.src = currentSrc;
        that.backgroundPlayer.title = currentTitle;
        that.backgroundPlayer.coverImgUrl = currentCoverImgUrl;
        wx.setStorageSync('currentPlayerId', currentId);     //当前播放的歌曲id
      }else{
        that.backgroundPlayer.play();
        wx.setStorageSync('currentPlayerId', currentId);
      }
    }else{             //点击暂停按钮
      that.backgroundPlayer.pause();
    }



    var currentIndex = songlists.findIndex(function (item) {
      return Number(item.id) === Number(currentId);
    });
    if (currentIndex > -1) {
      that.setData({
        playerData: songlists[currentIndex],    //当前播放的data.song对应的那一条数据
        currentIndex: currentIndex,                          //当前播放对应的数据索引
        currentId:currentId
      });
    }
  },


  /**
   * 设置进度函数
   * @param duration
   * @param currentTime
   * @returns {{duration: *, currentTime: *, progressWidth: string}}
   */
  setProgress: function setProgress(duration, currentTime) {
    return {
      duration: _utils2.default.formatTime(new Date(duration)),
      currentTime: _utils2.default.formatTime(new Date(currentTime)),
      progressWidth: duration!=0?parseFloat(currentTime / duration * 100).toFixed(6):0
    };
  },

  /**
   * 拖拽开始，记录当前拖拽的pageX
   * @param e
   */
  touchStartProgress: function touchStartProgress(e) {
    this.setData({ drag: true });
    this.touchStart = e.changedTouches[0].pageX;
    this.progress = parseInt(this.data.progressWidth * _utils2.default.rpxIntoPx(500) / 100);
  },

  /**
   * 拖拽中，记录当前的pageX，并且与开始拖拽的点以及播放的当前进度条长度进行计算，得出拖拽的长度，重设播放进度条
   * @param e
   */
  touchMoveProgress: function touchMoveProgress(e) {
    var spacing = this.progress + e.changedTouches[0].pageX - this.touchStart;
    if (spacing >= _utils2.default.rpxIntoPx(500)) {
      spacing = _utils2.default.rpxIntoPx(500);
    } else if (spacing <= 0) {
      spacing = 0;
    }
    var progressWidth = parseFloat(spacing / _utils2.default.rpxIntoPx(500) * 100).toFixed(6);
    this.setData({
      progressWidth: progressWidth
    });
  },

  /**
   * 拖拽结束后，记录当前的pageX，并且与开始拖拽的点以及播放的当前进度条长度进行计算，得出拖拽的长度，重设播放进度条
   * @param e
   */
  touchEndProgress: function touchEndProgress(e) {
   var spacing = this.progress + e.changedTouches[0].pageX - this.touchStart;
    if (spacing >= _utils2.default.rpxIntoPx(500)) {
      spacing = _utils2.default.rpxIntoPx(500);
    } else if (spacing <= 0) {
      spacing = 0;
    }
    var progressWidth = parseFloat(spacing / _utils2.default.rpxIntoPx(500) * 100).toFixed(6);
    this.setData({
      progressWidth: progressWidth,
      drag: false
    });
    this.backgroundPlayer.play();
    this.currentTime = progressWidth * this.duration / 100 || 0;
    this.backgroundPlayer.seek(parseFloat(this.currentTime / 1000));
    this.backgroundPlayer.play();
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/listenDetail/listenDetail?productid='+this.data.productid+'&BarTitleText='+this.data.BarTitleText+'&showdetail='+this.data.showdetail,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

});