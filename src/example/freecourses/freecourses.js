var data_api = require("../api/data_api.js");

Page({
  data:{
    zanObj: {},
    freeItem:[],  //初始化
    totalNum:0, //总数据条数
    freeLen:0, //已加载的数据条数
    pagesize: 10, //每页条数
    page: 1,  //第一页
  },
  onLoad: function (options) {
    let that = this;
    that.setData({ zanObj: { loading: true } });
    that.getFreeCourse();  //获取免费公开课；
  },
  // Godetail:function (e) {
  //     wx.navigateTo({
  //         url: '/example/detail/detail'
  //     })
  // },
  getFreeCourse:function () {  //获取课程
    var that=this;
    var page_type=3;
    var page=that.data.page;  //默认为第一页
    var pagesize=that.data.pagesize; //默认10条
    data_api.getFreeCourse(page,pagesize,page_type,{
      success:function (res) {
        console.log(res);
        if(res.data && res.data.code=="1001"){
          var size = that.data.freeLen + res.data.data.length;
          console.log(size,"size");
          var freeItem = res.data.data;
          var totalNum=res.data.total;
          freeItem.forEach(function (item) {
            if(item['targetTime']){
              item['targetTime']=item['targetTime'].substring(0,item['targetTime'].indexOf(" ")) ;
            }
          })
          that.setData({
            freeLen: size,
            freeItem:that.data.freeItem.concat(freeItem),
            totalNum:totalNum,
            zanObj: {
              loading: false
            }
          })
          console.log(that.data.freeLen,"freeLen");
          // 停止下拉刷新
          wx.stopPullDownRefresh();
          console.log(that.data.freeItem,'freeItem');
        }
      },fail:function (msg) {
        that.setData({
          zanObj: {
            loading: false
          }
        })
        wx.stopPullDownRefresh();
        console.log(msg);
      }
    },"GET")
  },

  //上拉加载
  onReachBottom: function () {
    var that = this;
    that.setData({ zanObj: { loading: true } });
      if (that.data.freeLen < that.data.totalNum) {
        that.setData({
          page: that.data.page + 1,
        })
        that.getFreeCourse()
      } else {
        that.setData({ zanObj: { loading_nodata: true } });
        console.log("没有更多数据了...")
      }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
      that.setData({
        freeLen:0,
        freeItem: [],
        page: 1,
        zanObj: {}
      })
      that.getFreeCourse();
  },

  GofreeDetail:function (e) {
    var freeId=e.currentTarget.dataset.freeid;
    wx.navigateTo({
      url: '/example/advDetail/advDetail?flag=freeList&&id='+freeId,
    });
    console.log(freeId,e);
  },
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/freecourses/freecourses',
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
  }
});