var config=require('../api/config');
var app = getApp();
var data_api = require("../api/data_api.js");
Page({
  data:{
    zanObj: {},
    loadingHidden: false,   //进入页面显示加载。。
    Len:0, //已加载的数据条数
    totalNum:0, //总数据条数
    drygoodsList:[],
    pagesize: 10, //每页条数
    page: 1,  //第一页
    isIphoneX:app.globalData.isIphoneX,
  },
  onLoad: function (options) {
    console.log("hah");
    this.getEchomodule();
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    var drygoodsId=that.data.drygoodsId;
    that.setData({ zanObj: { loading: true } });
    if (that.data.Len < that.data.totalNum) {
      that.setData({
        page: that.data.page + 1,
      })
      that.drygoodsListFn(drygoodsId);
    } else {
      // that.setData({ zanObj: { loading_nodata: true } });
      that.setData({ zanObj: { loading: false } });
      console.log("没有更多数据了...")
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    console.log('111')
    var that = this;
    var drygoodsId=that.data.drygoodsId;
    console.log('111')
    that.setData({
      Len:0, //已加载的数据条数
      drygoodsList:[],
      page: 1,
      zanObj: {}
    })
    that.drygoodsListFn(drygoodsId);
  },

  getEchomodule:function () {
    var that=this;
    data_api.getEchomodule(1,4,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var data=res.data.data;
          if(data[4]){
            that.setData({
              drygoodsId:data[4].id,      //干货
              drygoodsName:data[4].name
            });
            that.drygoodsListFn(data[4].id);
          }else{
            that.setData({
              zanObj: {
                loading: false,
                nodata:true,
                nodata_text:'敬请期待'
              }
            })
          }

          console.log(data);
        }else if(res.data.code=="1002"){
          console.log("数据库操作异常")
        }else if(res.data.code=="1004"){
          console.log("查询结果为空")
        }

      },fail:function (msg) {
        console.log(msg);
      },complete:	function (res) {
        that.setData({ loadingHidden: true })
      }
    },"GET")
  },

  drygoodsListFn:function (id) {
    var that=this;
    var page=that.data.page;
    var pagesize=that.data.pagesize;
    data_api.getModuleId(id,page,pagesize,{
      success:function (res) {
        console.log(res)
        if(res.data && res.data.code=="1001"){
          var drygoodsList=res.data.data;
          var Url=config.service.host;
          var totalNum=res.data.totals;
          var size = that.data.Len + res.data.data.length;
          drygoodsList.forEach(function (item,idx) {
            if(item['miu']){
              item['miuNew']= Url+item['miu'].match(/..\/(\S*)/)[1];
            }
          });
          that.setData({
            drygoodsList:that.data.drygoodsList.concat(drygoodsList),
            totalNum:totalNum,
            Len: size,
            zanObj: {
              loading: false
            }
          });

        }else if(res.data.code=="1004"){
          that.setData({
            zanObj: {
              loading: false
            }
          })
        }

      },fail:function (msg) {

      },complete: function () {
        that.setData({
          loadingHidden: true
        });
        wx.stopPullDownRefresh();
      }
    },"GET")
  },

  // drygoodsListFn:function () {
  //   var that=this;
  //   var Url=config.service.host;
  //   var drygoodsList=that.data.drygoodsList;
  //   drygoodsList.productList.forEach(function (item,idx) {
  //     if(item.miu){
  //       item.miuNew=Url+item['miu'].match(/..\/(\S*)/)[1];
  //     }
  //   });
  //   that.setData({drygoodsList:drygoodsList})
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
      path: '/example/dryGoods/dryGoods',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },
});