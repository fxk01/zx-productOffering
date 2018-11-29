var data_api = require("../api/data_api.js");
var app = getApp();
var config=require('../api/config');
Page({
  data:{
    loadingHidden:false,
    isIphoneX:app.globalData.isIphoneX,
    myFavoriteList:[],
    tabar_two:{
      leftTxt:'首页',
      leftIcon:'../images/tabBt_consult_default.png',
      centerTxt:'立即购买',
      centerIcon:'../images/tabBt_buy.png',
      centerUrl:'',
      rightTxt:'我的',
      rightIcon:'../images/tabBt_mine_default.png',
      rightUrl:'../mine/mine'
    },
  },

  onLoad: function (options) {
    this.meFavoriteFn();
  },

  meFavoriteFn:function () {
    var that=this;
    data_api.meFavorite({
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var myFavoriteList=res.data.data?res.data.data:[];
          that.setData({
            myFavoriteList:myFavoriteList
          })
          that.getBranchData(myFavoriteList);
        }else{
          that.setData({ loadingHidden: true,myFavoriteList:null });
        }
      },fail:function (msg) {
        // console.log(msg);
        that.setData({ loadingHidden: true });
      },complete:function (msg) {
        // console.log("msg")
      }
    },"GET")
  },

  getBranchData:function (myFavoriteList) {
    var that=this;
    for(var i=0;i<myFavoriteList.length;i++){
      if(myFavoriteList[i].id&&myFavoriteList[i].id=='1'){
        that.setData({complianceList:myFavoriteList[i]})    //免费试听
      }else if(myFavoriteList[i].id&&myFavoriteList[i].id=='2'){
        var hotreadList=myFavoriteList[i];
        that.setData({hotreadList:hotreadList})    //热点解读
        that.hotreadListFn(hotreadList);
      }else if(myFavoriteList[i].id&&myFavoriteList[i].id=='3'){
        var advList=myFavoriteList[i];
        that.setData({advList:advList})       //进阶系列
        that.advListFn(advList);
      }else if(myFavoriteList[i].id&&myFavoriteList[i].id=='4'){
        var offlineList=myFavoriteList[i];
        that.setData({offlineList:offlineList})     //线下私享会
        that.offlineListFn(offlineList);
      }else if(myFavoriteList[i].id&&myFavoriteList[i].id=='5'){
        var dryGoodsList=myFavoriteList[i];
        that.setData({dryGoodsList:dryGoodsList}) //干货资料
        console.log(dryGoodsList,'dryGoodsList')
        that.drygoodsListFn(dryGoodsList);
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
      if(item['createTime']){
        item['createTime']=item['createTime'].substring(0,item['createTime'].indexOf(" ")).replace(/-/g, ".") ;
      }
      if(item['updateTime']){
        item['updateTime']=item['updateTime'].substring(0,item['updateTime'].indexOf(" ")).replace(/-/g, ".") ;
      }
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

  offlineListFn:function(offlineList) {
    var that=this;
    // offlineList.productList.forEach(function (item,idx) {
    //   item['miu1']=item['miu'].substring(0,item['miu'].indexOf(" "));   //2017/12/12 11:26
    //   if(item['miu1']){
    //     item['miuYear']=item['miu1'].substring(0,item['miu'].indexOf("/"));
    //     item['miuDate']=item['miu1'].substring(item['miu'].indexOf("/")+1).replace(/\//g, ".") ;
    //   }
    // });
    // that.setData({offlineList:offlineList})

    var dateArr=[];
    var ArrInfo1=[];
    offlineList.productList.forEach(function (item,idx) {
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
          offlineList.productList[z]['miuYear']=offlineList.productList[z]['miu'].substring(0,4);
          offlineList.productList[z]['miuDate']=offlineList.productList[z]['miu'].substring(5);
          ArrInfo1.push(offlineList.productList[z]);
        }
      }
    }
    offlineList.productList=ArrInfo1;
    that.setData({
      offlineList:offlineList
      // offlineList:{
      //   productList:ArrInfo1
      // }
    });
  },

  drygoodsListFn:function(dryGoodsList) {
    var that=this;
    var Url=config.service.host;
    dryGoodsList.productList.forEach(function (item,idx) {
      if(item['miu']){
        item.miuNew=Url+item['miu'].match(/..\/(\S*)/)[1];
      }
      if(item['createTime']){
        item['createTime']=item['createTime'].substring(0,item['createTime'].indexOf(" ")).replace(/-/g, ".") ;
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

  GoOfflineDetailnewPage:function (e) {
    var id=e.currentTarget.dataset.id;
    var price=e.currentTarget.dataset.price;
    var BarTitleText=e.currentTarget.dataset.bartitletext;
    // if(price=='0.00'){ 报名结束：1.00 、立即报名标识：0.00-->
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

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/mycollection/mycollection',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },

})