var data_api = require("../api/data_api.js");
Page({
  data:{
    myRegisterList:[],
    loadingHidden:false
  },
  onLoad: function (options) {
    this.meRegisterFn();
  },

  meRegisterFn:function () {
    var that=this;
    data_api.meRegister({
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var myRegisterList=res.data.data?res.data.data:[];
          that.setData({
            myRegisterList:myRegisterList
          })
          that.offlineListFn(myRegisterList);
        }else{
          that.setData({ loadingHidden: true,myRegisterList:null });
        }
      },fail:function (msg) {
        that.setData({ loadingHidden: true });
      },complete:function (msg) {
      }
    },"GET")
  },

  offlineListFn:function(myRegisterList) {
    var that=this;
    // myRegisterList.forEach(function (item,idx) {
      // item['miu1']=item['miu'].substring(0,item['miu'].indexOf(" "));   //2017/12/12 11:26
      // if(item['miu1']){
      //   item['miuYear']=item['miu1'].substring(0,item['miu'].indexOf("/"));
      //   item['miuDate']=item['miu1'].substring(item['miu'].indexOf("/")+1).replace(/\//g, ".") ;
      // }
      // -------------------------------------------
    //   if(item['miu'].indexOf(" ")){
    //     item['miu']=item['miu'].substring(0,item['miu'].indexOf(" ")).replace(/-/g, ".");
    //   }else{
    //     item['miu']=item['miu'].replace(/-/g, ".");
    //   }
    //
    //     item['miuYear']=item['miu'].substring(0,4);
    //     item['miuDate']=item['miu'].substring(5);
    //
    // });
    // that.setData({myRegisterList:myRegisterList})
    // ------------------------------------------------
    var dateArr=[];
    var ArrInfo1=[];
    myRegisterList.forEach(function (item,idx) {
      var oldTime3 = (new Date(item['miu'])).getTime();
      dateArr.push(oldTime3);
    });
    dateArr.sort(that.sortNumber1);   //时间由大到小排序
    for (var j = 0; j < dateArr.length; j++) {
      var Arr1 = dateArr[j];
      for (var z = 0; z < myRegisterList.length; z++) {
        var oldTime = (new Date(myRegisterList[z].miu)).getTime();

        if (Arr1 ==oldTime) {
          if(myRegisterList[z]['miu'].indexOf(" ")!='-1'){
            myRegisterList[z]['miu']=myRegisterList[z]['miu'].substring(0,myRegisterList[z]['miu'].indexOf(" ")).replace(/-/g, ".");
          }else{
            myRegisterList[z]['miu']=myRegisterList[z]['miu'].replace(/-/g, ".");
          }
          myRegisterList[z]['miuYear']=myRegisterList[z]['miu'].substring(0,4);
          myRegisterList[z]['miuDate']=myRegisterList[z]['miu'].substring(5);
          ArrInfo1.push(myRegisterList[z]);
        }
      }
    }
    that.setData({ loadingHidden: true });
    that.setData({
      myRegisterList:ArrInfo1
    })
  },

  sortNumber1:function (a,b) {
    return b - a
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

  // 分享
  onShareAppMessage: function () {
    return {
      title: '私研社',
      path: '/example/haveActive/haveActive',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (err) {
        console.log("转发失败")
      }
    }
  },


});