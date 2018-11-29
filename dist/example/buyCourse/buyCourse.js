var data_api = require("../api/data_api.js");
var config=require('../api/config');
Page({
  data:{
    myCourseList:[],
    loadingHidden:false,
    // tabar_two:{
    //   leftTxt:'首页',
    //   leftIcon:'../images/tabBt_consult_default.png',
    //   centerTxt:'立即购买',
    //   centerIcon:'../images/tabBt_buy.png',
    //   centerUrl:'',
    //   rightTxt:'我的',
    //   rightIcon:'../images/tabBt_mine_default.png',
    //   rightUrl:'../mine/mine'
    // },
  },

  onLoad: function (options) {
    this.mePurchasedFn();
  },

  mePurchasedFn:function () {
    var that=this;
    data_api.mePurchased({
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var myCourseList=res.data.data?res.data.data:[];
          that.setData({
            myCourseList:myCourseList
          })
          that.getBranchData(myCourseList);
        }else{
          that.setData({ loadingHidden: true,myCourseList:null });
        }
      },fail:function (msg) {
        console.log(msg);
        that.setData({ loadingHidden: true });
      },complete:function (msg) {
        console.log("msg")
      }
    },"GET")
  },

  getBranchData:function (myCourseList) {
    var that=this;
    for(var i=0;i<myCourseList.length;i++){
      if(myCourseList[i].id=='1'){
        that.setData({complianceList:myCourseList[i]})    //免费试听
      }else if(myCourseList[i].id=='2'){
        var hotreadList=myCourseList[i]
        that.setData({hotreadList:hotreadList})    //热点解读
        that.hotreadListFn(hotreadList);
      }else if(myCourseList[i].id=='3'){
        var advList=myCourseList[i];
        that.setData({advList:advList})       //进阶系列
        that.advListFn(advList);
      }else if(myCourseList[i].id=='4'){
        that.setData({offlineList:myCourseList[i]})     //线下私享会
      }else if(myCourseList[i].id=='5'){
        var dryGoodsList=myCourseList[i];
        that.setData({dryGoodsList:dryGoodsList}) //干货资料
        that.dryGoodsListFn(dryGoodsList);
      }else{
        return ;
      }
    }
    that.setData({ loadingHidden: true });
  },

  hotreadListFn:function (hotreadList) {
    var that=this;
    var Url=config.service.host;
    hotreadList.productList.forEach(function (item,idx) {
     if(item.miu){
       item.miuNew=Url+item['miu'].match(/..\/(\S*)/)[1];
     }
      item['createTime']=item['createTime'].substring(0,item['createTime'].indexOf(" ")).replace(/-/g, ".") ;
      if(item['updateTime']){
        item['updateTime']=item['updateTime'].substring(0,item['updateTime'].indexOf(" ")).replace(/-/g, ".") ;
      }
      // var kongNun=item['createTime'].indexOf(" ");
      // item['createTime']=item['createTime'].replace(/-/g, ".") ;
      // item['time_minute']=item['createTime'].substring(0,kongNun);
      // item['time_seconds']= item['createTime'].substring(kongNun,kongNun+6);
    });
    that.setData({hotreadList:hotreadList})
  },

  advListFn:function (advList) {
    var that=this;
    var Url=config.service.host;
    advList.productList.forEach(function (item,idx) {
      if(item['miu']){
        item.miuNew=Url+item['miu'].match(/..\/(\S*)/)[1];
      }
    });
    that.setData({advList:advList})
  },

  dryGoodsListFn:function (dryGoodsList) {
    var that=this;
    var Url=config.service.host;
    dryGoodsList.productList.forEach(function (item) {
      item['createTime']=item['createTime'].substring(0,item['createTime'].indexOf(" ")).replace(/-/g, ".") ;
      if(item['miu']){
        item.miuNew=Url+item['miu'].match(/..\/(\S*)/)[1];
      }
      if(item['updateTime']){
        item['updateTime']=item['updateTime'].substring(0,item['updateTime'].indexOf(" ")).replace(/-/g, ".") ;
      }
    });
    that.setData({dryGoodsList:dryGoodsList})
  },

  golistenDetailPage:function (e) {
    var id=e.currentTarget.dataset.id;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    var showdetail=e.currentTarget.dataset.showdetail;
    wx.navigateTo({
      url: '/example/listenDetail/listenDetail?productid='+id+'&BarTitleText='+BarTitleText+'&showdetail='+showdetail
    })
  },

  // GoOfflineDetailnewPage:function (e) {
  //   var id=e.currentTarget.dataset.id;
  //   var price=e.currentTarget.dataset.price;
  //   // if(price=='0.00'){ 报名结束：1.00 、立即报名标识：0.00-->
  //   wx.navigateTo({
  //     url: '/example/offlineDetailnew/offlineDetailnew?productid='+id+"&price="+price,
  //   })
  // },

  // 去干货详情页
  goDrygoodsdetail:function (e) {
    var id=e.currentTarget.dataset.id;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    wx.navigateTo({
      url: '/example/dryGoodsdetail/dryGoodsdetail?productid='+id+'&BarTitleText='+BarTitleText
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/buyCourse/buyCourse',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },



})