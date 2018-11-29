var app = getApp();
var WxParse = require('./wxParse/wxParse.js');
var config=require('./api/config');
var data_api = require("./api/data_api.js");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

// 音频
var _utils = require('./utils/utils');
var _utils2 = _interopRequireDefault(_utils);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var toast = require('./template/toast/toast');

Page({
  data: {
    isIphoneX:app.globalData.isIphoneX,
    toast: {     //是否显示提示、提示内容
      show: false,
      content: ''
    },
    loadingHidden: false,   //进入页面显示加载。。
    totalNum:0, //总数据条数
    pagesize: 4, //每页条数
    page: 1,  //第一页
    getAudioBool:true,  //默认可以获取音频存储
    initBool:false,   //初始化
    drag:false,   //是否拖拽
    SimonDrumBanner:[],
    movies:[],
    iconItem:[],
    advItem:[],
    offlineItem:[],
    zx: '积募资讯',
    toView: 'red',
    scrollTop:0,
    tabs: ['机构服务', '产品服务', '研习社'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    second_height: 0,
  },

  onUnload: function () {
    var that = this;
    that.setData({
      loadingHidden: true
    })
  },

  onLoad(options) {
    if(options&&options.activeIndex){
      var activeIndex=options.activeIndex;
      this.setData({
        activeIndex: activeIndex,
      });
    }

    let that = this;

    // this.setData({
    //   msgList: [
    //     { url: 'url', title: '评估数据库1.0正式上线' },
    //     { url: 'url', title: '最新推出私募入会服务' },
    //     { url: 'url', title: '超人气募集监督机构+备案信披服务' }
    //   ]
    // });
    wx.getSystemInfo({
      success: function(res) {
        // res.screenHeight*2-120
        that.setData({
            scrollHeight: res.screenHeight*2-130,  //"-130"
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
        if(that.data.activeIndex=='2'){
          that.setData({
            scrollTop:250
          });
        }
      }
    });
  },

  // 下拉刷新 // "enablePullDownRefresh": true
  onPullDownRefresh: function () {
    this.setData({
      songlists:'',
      SimonDrumBanner:'',
      hotreadList:'',
      advList:'',
      offlineList:'',
      drygoodsList:''
    })
    this.getEchomodule();
  },

  // pageScroll: function (res) {   //监听scroll-view滑动的高度,懒加载用
  //   console.log(res.detail.scrollTop);  //-300
  //   this.setData({pageScrollTop:res.detail.scrollTop});
  // },

  // 获取首页私募研习社数据
  getEchomodule:function () {
    var that=this;
    var page=that.data.page;
    var pagesize=that.data.pagesize;
    data_api.getEchomodule(page,pagesize,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var data=res.data.data;
          // var productid=data[0].productList[0]?data[0].productList[0].id:'-1';   //免费试听商品的id

          for(var i=0;i<data.length;i++){
            if(data[i].id&&data[i].id=='1'){
              var productid=data[i].productList[0]?data[i].productList[0].id:'-1';   //免费试听商品的id
              that.setData({productid:productid,complianceData:data[i]})    //免费试听
              that.getComplianceFn(productid);    //获取首页免费试听课程
            }else if(data[i].id&&data[i].id=='2'){
              var hotreadList=data[i];
              that.setData({hotreadList:hotreadList})    //热点解读
              that.hotreadListFn(hotreadList);
            }else if(data[i].id&&data[i].id=='3'){
              var advList=data[i];
              that.setData({advList:advList})       //进阶系列
              that.advListFn(advList);
            }else if(data[i].id&&data[i].id=='4'){
              var offlineList=data[i];
              that.setData({offlineList:offlineList})     //线下私享会
              that.offlineListFn(offlineList);
            }else if(data[i].id&&data[i].id=='5'){
              var drygoodsList=data[i];
              that.setData({drygoodsList:drygoodsList}) //干货资料
              that.drygoodsListFn(drygoodsList);
            }else{
              return ;
            }
          }


          // that.setData({
          //   productid:productid,
          //   complianceData:data[0],
          //   hotreadList:data[1],     //热点解读
          //   advList:data[2],        //进阶系列
          //   offlineList:data[3],    //线下私享会
          //   drygoodsList:data[4]      //干货
          // });

          that.getBanner2();    //首页--研习社的轮播
          // that.getIcon();
          // if(data[1]){
          //   that.hotreadListFn(data[1]);
          // }
          // if(data[2]){
          //   that.advListFn(data[2]);
          // }
          // if(data[3]){
          //   console.log(data[3],'data[3]---')
          //   that.offlineListFn(data[3]);
          // }

          // if(data[4]){
          //   that.drygoodsListFn(data[4]);
          // }
          // that.getComplianceFn(productid);    //获取首页免费试听课程
        }else if(res.data.code=="1002"){
          // console.log("数据库操作异常")
        }else if(res.data.code=="1004"){
          // console.log("查询结果为空")
        }else{
          that.setData({ loadingHidden: true });
        }

      },fail:function (msg) {
        that.setData({ loadingHidden: true });
        // console.log(msg);
      }
    },"GET")
  },

  // 热点解读课
  hotreadListFn:function (hotreadList) {
    var that=this;
    var Url=config.service.host;
    hotreadList.productList.forEach(function (item,idx) {
      if(item['miu']){
        item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
      }
      if(item['createTime']){
        item['createTime']=item['createTime'].substring(0,item['createTime'].indexOf(" ")).replace(/-/g, ".") ;
      }
      if(item['updateTime']){
        item['updateTime']=item['updateTime'].substring(0,item['updateTime'].indexOf(" ")).replace(/-/g, ".") ;
      }
      // var kongNun=item['createTime'].indexOf(" ");
      // item['createTime']=item['createTime'].replace(/-/g, ".") ;
      // item['time_minute']=item['createTime'].substring(0,kongNun);
      // item['time_seconds']= item['createTime'].substring(kongNun,kongNun+6);
    });
    that.setData({hotreadList:hotreadList});
  },

  // 进阶系列课
  advListFn:function (advList) {
    var that=this;
    var Url=config.service.host;
    advList.productList.forEach(function (item,idx) {
      if(item['miu']){
        item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
      }
    });
    that.setData({advList:advList});
  },

  // 线下活动需要排序：最新的时间显示在前面
  offlineListFn:function (offlineList) {
    var that=this;
    var productList=offlineList.productList;
   // productList.forEach(function (item,idx) {
   //    item['miu']=item['miu'].substring(0,item['miu'].indexOf(" ")).replace(/\//g, ".") ;
   //  });
   //  console.log(offlineList)

    var dateArr=[];
    var ArrInfo1=[];
    productList.forEach(function (item,idx) {
      // item['miu']='2018-02-13 14:20:30';   测试
       var oldTime3 = (new Date(item['miu'])).getTime();
      dateArr.push(oldTime3);
     });
    dateArr.sort(that.sortNumber1);   //时间由大到小排序
    for (var j = 0; j < dateArr.length; j++) {
      var Arr1 = dateArr[j];
      for (var z = 0; z < offlineList.productList.length; z++) {
        var oldTime = (new Date(offlineList.productList[z].miu)).getTime();

        if (Arr1 ==oldTime) {
          if(offlineList.productList[z]['miu'].indexOf(" ")!='-1'){
            offlineList.productList[z]['miu']=offlineList.productList[z]['miu'].replace(/-/g, ".").substring(0,offlineList.productList[z]['miu'].indexOf(" "));
          }else{
            offlineList.productList[z]['miu']=offlineList.productList[z]['miu'].replace(/-/g, ".");
          }
          ArrInfo1.push(offlineList.productList[z]);
        }
      }
    }
    console.log( that.data.offlineList,'---offlineList999');
    offlineList.productList=ArrInfo1;
    that.setData({
      offlineList:offlineList
      // offlineList:{
      //   productList:ArrInfo1
      // }
    });
    console.log(that.data.offlineList,'==---offlineList---')
  },

  // 干货
  drygoodsListFn:function (drygoodsList) {
    var that=this;
    var Url=config.service.host;
    drygoodsList.productList.forEach(function (item,idx) {
      if(item['miu']){
        item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
      }
      // if(item['period'].indexOf(" ")!='-1'){
      //   item['period']=item['period'].substring(0,item['period'].indexOf(" ")).replace(/-/g, ".") ;
      // }else{
      //   item['period']=item['period'].replace(/-/g, ".") ;
      // }
    });
    that.setData({drygoodsList:drygoodsList});
  },

  // 音频
  getComplianceFn:function (complianceId) {
    var that=this;
    var page=that.data.page;
    var pagesize=4;
    var Url=config.service.host;
    data_api.getCompliance(complianceId,page,pagesize,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var songlists=res.data.data;
          songlists.forEach(function (item,idx) {
              item['isPlaying']=false;
              if(item['media']){
                item['media']= Url+item['media'].match(/..\/(\S*)/)[1];
              }
              item['mediaNew']=item['externalLink']?item['externalLink']:item['media'];
              item['coverImgUrl']='http://7xj5et.com1.z0.glb.clouddn.com/gallery/img/2.jpg';
              if(item['createTime']){
                item['createTime']=item['createTime'].substring(0,item['createTime'].indexOf(" ")).replace(/-/g, ".") ;
              }
          });
          that.setData({
            songlists:songlists,
            complianceList:songlists
          });
          that.getAudioStorage();
        }else if(res.data.code=="1002"){
          // console.log("数据库操作异常")
        }else if(res.data.code=="1004"){
          // console.log("查询结果为空");
        }

      },fail:function (msg) {
        // console.log(msg);
      },complete:function (msg) {
        that.bgFn();    //音频状态监控
      }
    },"GET")
  },

  getBanner:function () {
    var that=this;
    var page_type=1;
    data_api.getBanner(page_type,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var Url=config.service.host;
          var movies=res.data.data;
          movies.forEach(function (item) {
            if(item['image']){
              item['image']= Url+item['image'].match(/..\/(\S*)/)[1]
            }
          })
          that.setData({
            movies:movies
          })
        }

      },fail:function (msg) {
        // console.log(msg);
      }
    },"GET")
  },

  // 研习社banner
  getBanner2:function () {
    var that=this;
    var page_type=5;
    data_api.getBanner(page_type,{
      success:function (res) {
        console.log(res,'----------------------------res')
        if(res.data && res.data.code=="1001"){
          var Url=config.service.host;
          var movies=res.data.data;
          movies.forEach(function (item) {
            if(item['image']){
              item['image']= Url+item['image'].match(/..\/(\S*)/)[1]
            }
          })
          that.setData({
            SimonDrumBanner:movies
          });
        }

      },fail:function (msg) {
        // console.log(msg);
      },complete:	function (res) {
        that.setData({ loadingHidden: true })
        wx.stopPullDownRefresh();    // 停止下拉刷新
      }
    },"GET")
  },

  getIcon:function () {
    var that=this;
    var page_type=2;
    data_api.getIcon(page_type,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var Url=config.service.host;
          var iconItem=res.data.data;
          var arrList=[];
          var ArrInfo = [];
          iconItem.forEach(function (item) {
            if(item['image']){
              item['image']= Url+item['image'].match(/..\/(\S*)/)[1]
            }
            item['iconName']=that.getIconName(item['name']);
            arrList.push(item['name']);
          })
          arrList.sort(that.sortNumber);   //时间由小到大排序；
          for (var j = 0; j < arrList.length; j++) {
            var Arr = arrList[j];
            for (var z = 0; z < iconItem.length; z++) {
              if (Arr ==iconItem[z].name) {
                ArrInfo.push(iconItem[z]);
              }
            }
          }
          that.setData({
            iconItem:ArrInfo
          })
        }

      },fail:function (msg) {
        // console.log(msg);
      },complete:	function (res) {
        that.setData({ loadingHidden: true })
        wx.stopPullDownRefresh();    // 停止下拉刷新
      }
    },"GET")
  },

  sortNumber:function (a,b) {
    return a - b
  },

  sortNumber1:function (a,b) {
    return b - a
  },

  getIconName:function (status) {
    var json = {
      "1": "积募福袋",
      "2": "积募圈儿",
      "3": "合规日历",
      "4": "合规问答",
    };
    return json[status + ''];
  },

  tabClick: function (e) {
    var activeIndex=e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: activeIndex
    });
    if(activeIndex=='2'){
      this.setData({
        scrollTop:250
      });
    }
  },
  Gotomedical:function (e) {
    wx.navigateTo({
      url: '/example/medical/medical'
    })
  },
  GofundTown:function (e) {
    wx.navigateTo({
      url: '/example/fundtown/fundtown'
    })
  },
  Gotocreate:function (e) {
    wx.navigateTo({
      url: '/example/tocreate/tocreate'
    })
  },
  Gogogo:function (e) {
    // 1:积募福袋
    // 2:私募圈儿
    // 3:私募日历
    // 4:合规问答
    var Name=e.currentTarget.dataset.name;
    if(Name=='1'){
      wx.navigateTo({
        url: '/example/tempTutorial/tempTutorial'
      })
    }else if(Name=='2'){
      wx.navigateTo({
        url: '/example/privateCircle/privateCircle'
      })
    }else if(Name=='3'){
      wx.navigateTo({
        url: '/example/calendar/calendar'
      })
    }else if(Name=='4'){
      wx.navigateTo({
        url: '/example/complianceRubik/complianceRubik'
      })
    }
  },
  // 合规问答
  GocomplianceRubik:function (e) {
    wx.navigateTo({
      url: '/example/complianceRubik/complianceRubik'
    })
  },
  // 积募福袋
  GotempTutorial:function (e) {
    wx.navigateTo({
      url: '/example/tempTutorial/tempTutorial'
    })
  },
  // 私募圈儿
  GoprivateCircle:function (e) {
    wx.navigateTo({
      url: '/example/privateCircle/privateCircle'
    })
  },
  //私募日历
  Gocalendar: function (e) {
    wx.navigateTo({
      url: '/example/calendar/calendar'
    })
  },
  Gostewards:function (e) {
    wx.navigateTo({
      url: '/example/stewards/stewards'
    })
  },

  GorecordSmart:function (e) {
    wx.navigateTo({
      url: '/example/recordSmart/recordSmart'
    })
  },
  Gofreecourses:function (e) {
    wx.navigateTo({
      url: '/example/freecourses/freecourses'
    })
  },
  GoproductDesign:function (e) {
  wx.navigateTo({
    url: '/example/productDesign/productDesign'
  })
},

  GofundOperation:function (e) {
      wx.navigateTo({
          url: '/example/fundOperation/fundOperation'
      })
  },
  Goadvcourses:function (e) {
    wx.navigateTo({
      url: '/example/advcourses/advcourses'
    })
  },
  Gooffline:function (e) {
    wx.navigateTo({
      url: '/example/offline/offline?offlineId='+this.data.offlineList.id
    })
  },

  Godetail:function (e) {
    wx.navigateTo({
      url: '/example/detail/detail'
    })
  },

  gohotreadListPage:function () {
    var hotreadList=this.data.hotreadList;
    wx.navigateTo({
      url: '/example/hotreadList/hotreadList?hotreadId='+hotreadList.id+'&hotreadName='+hotreadList.name
    })
  },

  goadvListPage:function () {
    var advList=this.data.advList;
    wx.navigateTo({
      url: '/example/advList/advList?advId='+advList.id+'&advName='+advList.name
    })
  },

  goofflineListPage:function () {
    var offlineList=this.data.offlineList;
    wx.navigateTo({
      url: '/example/offlineList/offlineList?offlineId='+offlineList.id+'&offlineName='+offlineList.name
    })
  },

  godrygoodsListPage:function () {
    var drygoodsList=this.data.drygoodsList;
    wx.navigateTo({
      url: '/example/drygoodsList/drygoodsList?drygoodsId='+drygoodsList.id+'&drygoodsName='+drygoodsList.name
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/index?activeIndex='+this.data.activeIndex,
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },
  setIndex:function (e) {
    // 280
    this.setData({
      activeIndex:2,
        scrollTop:250
    });
    var that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  Gopage:function (e) {
    var swiTarget=e.currentTarget.dataset.target;
    if(swiTarget){
      wx.navigateTo({
        url: swiTarget,
      })
    }
  },
  makePhonecall:function (e) {
    wx.makePhoneCall({
      phoneNumber: '4006662398' //仅为示例，并非真实的电话号码
    })
  },

  golistenDetailPage:function (e) {
    var id=e.currentTarget.dataset.id;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    var showdetail=e.currentTarget.dataset.showdetail;
    wx.navigateTo({
      url: '/example/listenDetail/listenDetail?productid='+id+'&BarTitleText='+BarTitleText+'&showdetail='+showdetail
    })
  },

  GoOfflineDetailnewPage:function (e) {
    var id=e.currentTarget.dataset.id;
    var price=e.currentTarget.dataset.price;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    // 报名结束：1.00 、立即报名标识：0.00-->
    wx.navigateTo({
      url: '/example/offlineDetailnew/offlineDetailnew?productid='+id+"&price="+price+'&BarTitleText='+BarTitleText
    })
  },

  // 去干货详情页
  goDrygoodsdetail:function (e) {
    var id=e.currentTarget.dataset.id;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    wx.navigateTo({
      url: '/example/dryGoodsdetail/dryGoodsdetail?productid='+id+'&BarTitleText='+BarTitleText
    })
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
        //   console.log("setAudioStorage success")
        // }else{
        //   console.log("setAudioStorage fail")
        // }

      },fail:function (msg) {
        console.log(msg);
      }
    },"GET")
  },

  // 获取存储的音频 productid,courseid,duration,currenttime
  getAudioStorage:function () {
    var that=this;
    var productid=that.data.productid;      //商品的id
    data_api.getAudioStorage(productid,{
      success:function (res) {
        if(res.data && res.data.code=="1000"){
          if(res.data.data){    //有音频存储
            that.setData({
              initBool:true,
              res_courseId:res.data.data.courseId,        //3(当时播放歌曲的id)
              res_currentTime:res.data.data.currentTime,    //3000
              res_duration:res.data.data.duration,            //4000
              res_createTime:res.data.data.createTime,    //2018-03-23 17:45:44
            });
            that.Initialize();
          }else{
            that.setData({initBool:false});
          }
        }else{
          that.setData({initBool:false});
        }

      },fail:function (msg) {
        console.log(msg);
      }
    },"GET")
  },

  Initialize:function () {
    var that=this;
    var initBool=that.data.initBool;
    var getAudioBool=that.data.getAudioBool;
    if(initBool && getAudioBool){
      var res_courseId=that.data.res_courseId;
      var res_currentTime=that.data.res_currentTime;
      var res_duration=that.data.res_duration;

      that.duration = res_duration * 1000;   //变为ms然后后面计算
      that.currentTime = res_currentTime * 1000;
      var _setProgress2 = that.setProgress(that.duration, that.currentTime),
        duration = _setProgress2.duration,
        currentTime = _setProgress2.currentTime,
        progressWidth = _setProgress2.progressWidth;
      that.setData({
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
      if(songlists[currentIndex]){
        songlists[currentIndex].isPlaying=false;
      }
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
      if(songlists[currentIndex]){
        songlists[currentIndex].isPlaying=false;
      }
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
    console.log('show!!!')
    this.getEchomodule();   //获取私募研习社四个板块的信息
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
    var songlists=this.data.songlists;
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
      this.backgroundPlayer.play();//播放按钮
      if(!this.backgroundPlayer.src || currentSrc !== this.backgroundPlayer.src){
        this.backgroundPlayer.src = currentSrc;
        this.backgroundPlayer.title = currentTitle;
        this.backgroundPlayer.coverImgUrl = currentCoverImgUrl;
        wx.setStorageSync('currentPlayerId', currentId);
      }else{
        // console.log('that.backgroundPlayer.play()');
        that.backgroundPlayer.play();
        wx.setStorageSync('currentPlayerId', currentId);
      }
    }else{             //点击暂停按钮
      this.backgroundPlayer.pause();
    }

    var currentIndex = songlists.findIndex(function (item) {
      return Number(item.id) === Number(currentId);
    });
    if (currentIndex > -1) {
      this.setData({
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

});