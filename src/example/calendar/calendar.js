var WxParse = require('../wxParse/wxParse.js');
var data_api = require("../api/data_api.js");
var config=require('../api/config');
var util=require('../utils/util');
Page({
    data: {
      subscribeTxt:'立即订阅',
      subDisabled:false,
      loadingHidden: false,
      reminder: '',  //提示信息
      disabled:false,
      wxHighlight:false,
      emFormat:true,
      emHighlight:false,
      hasEmptyGrid: false,
      campany: "重庆",
      position: "重庆",
      start: "8.05",
      end: "000",
      // 假设点击9
      id: 9,
      changeColor: "color: #969696",
      cur_year: '',
      cur_month: '',
      cur_d: '',
      phoneRl: '',
      emailRl: '',
      calendarData:[],
      listData:[{
        id:1,
        title: "43543543",
        timer:"20171201", //2017-12-21 17:03:24
        content:"报名时间9月25日-11月3日2017年7月1日后1"
      },
        {
          id:2,
          title: "43543543",
          timer:"20171202",
          content:"管理规模5000万以上需报送2"
        },
        {
          id:3,
          timer:"20171203",
          content:"管理规模5000万以上需报送3"
        },
        {
          id:4,
          title: "43543543",
          timer:"20171211",
          content:"管理规模5000万以上需报送4"
        },
        {
          id:5,
          title: "43543543",
          timer:"20171212",
          content:"管理规模5000万以上需报送5"
        },
        {
          id:6,
          title: "43543543",
          timer:"20171213",
          content:"管理规模5000万以上需报送6"
        }
      ]
    },

  // get背景图
  getBg:function () {
    var that=this;
    var page_type=6;
    data_api.getIcon(page_type,{
      success:function (res) {
        if(res.data && res.data.code=="1001"){
          var Url=config.service.host;
          var Bg=res.data.data[0];
          Bg['image']= Url+Bg['image'].match(/..\/(\S*)/)[1],
          that.setData({
            Bg:Bg
          })
        }

      },fail:function (msg) {
        console.log(msg);
      }
    },"GET")
  },
    // 点击对应日所展示对应校招信息
    showInfo:function(e) {
      var that=this;
      var  cur= e.currentTarget.dataset.cur;
      var mouArr=that.data.mouArr;
      for(var i=0;i<mouArr.length;i++){
        if(cur==mouArr[i].time){
          that.showModal(mouArr[i].title);
        }
      }
    },
    onLoad:function(options) {
      const date = new Date();
      const cur_year = date.getFullYear();
      const cur_month = date.getMonth() + 1;
      const cur_day = date.getDate();
      const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
      this.getBg();   //获取背景图
      this.createMonth(cur_month);
      this.getCalendarData(cur_year, cur_month);   //拿数据；
      this.calculateEmptyGrids(cur_year, cur_month);

      this.setData({
        cur_year:cur_year,
        cur_month:cur_month,
        weeks_ch:weeks_ch,
        cur_day:cur_day
      });
    },

  createMonth:function (cur_month) {
    var createMonth=[1,'自查'];
    if(cur_month=='1'){
      createMonth=[1,'增值税 月报 季报 入会']
    }else if(cur_month=='2'){
      createMonth=[15,'过新年']
    }else if(cur_month=='3'){
      createMonth=[7,' 月报 补录']
    }else if(cur_month=='4'){
      createMonth=[30,'审计报告']
    }else if(cur_month=='5'){
      createMonth=[31,'年报']
    }
    this.setData({
      createMonth:createMonth
    })
  },

    getThisMonthDays:function(year, month) {
      // 得到这一月的总天数
      return new Date(year, month, 0).getDate();
    },
    // 获取当月第一天星期几
    getFirstDayOfWeek:function(year, month) {
      // 得到本月的第一天是周几，例如8月1号是周2
      const view_month = new Date(year, month, 0).getDate();
      // -------------------------------------------------------------------------------
      // 得到周六周日的天数,获得数组getDays67
      var getDays67 = [];
      var start_week = new Date(Date.UTC(year, month - 1, 1)).getDay();

      for(var i=1;i<=view_month;i++){
        start_week++;
        const rest = (start_week-1)%7

        if (rest == 6 || rest == 0 ){
          getDays67.push(i)
        }
      }
      this.setData({
        getDays67: getDays67
      })
      this.setData({
        start_week: new Date(Date.UTC(year, month - 1, 1)).getDay(),
      });
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },

//   **
//   * 日期转化为字符串， 4位年+2位月+2位日
// */
    getDateStr:function(date) {
      var _year = date.getFullYear();
      var _month = date.getMonth() + 1;    // 月从0开始计数
      var _d = date.getDate();

      _month = (_month > 9) ? ("" + _month) : ("0" + _month);
      _d = (_d > 9) ? ("" + _d) : ("0" + _d);
      return _year + _month + _d;
    },
    // 计算当月1号前空了几个格子
    calculateEmptyGrids:function(year, month) {
      const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
      var empytGrids = [];
      if (firstDayOfWeek > 0) {
        for (var i = 0; i < firstDayOfWeek; i++) {
          empytGrids.push(i);
        }
        this.setData({
          hasEmptyGrid: true,
          empytGrids:empytGrids
        });
      } else {
        this.setData({
          hasEmptyGrid: false,
          empytGrids: []
        });
      }
    },
    // 绘制当月天数占的格子
    calculateDays:function(year, month) {
      var that=this;
      var bindObj=[];
      const thisMonthDays = that.getThisMonthDays(year, month);
      const date1 = new Date();

      for (var i = 1; i <= thisMonthDays; i++) {
        var binddayArr={};
        var days='';
        var curTime='';
        var curDot='';
        //加一个判断，本天数字为空
        if (date1.getDate() == i && date1.getFullYear() == year && date1.getMonth() + 1 == month){
          days=date1.getDate();
        }else{
          days=i;
        }
        binddayArr.days=days;
        binddayArr.curDot=curDot;

        var _thisDay = new Date(year, month - 1, i );
        var _thisDayStr = this.getDateStr(_thisDay);
        curTime=_thisDayStr;
        binddayArr.curTime=curTime;
        bindObj.push(binddayArr);
      }

      var listData=that.data.calendarData;
      var mouArr=[];
      var replyArr = [];
      for(var j=0;j<bindObj.length;j++){
        var inicur=bindObj[j].curTime;
        var Dots='';
        for(var z=0;z<listData.length;z++){
          if(listData[z].time == inicur){
            Dots=true;
            bindObj[j].curDot=Dots;
            listData[z].mounth=util.formatNumber1(listData[z].time.substring(4,6));
            listData[z].date=util.formatNumber1(listData[z].time.substring(6,8));
            mouArr.push(listData[z]);
            replyArr.push(listData[z].content);
          }
        }
      }
      that.setData({
        bindObj:bindObj,
        mouArr:mouArr
      });
      for (var i = 0; i < replyArr.length; i++) {
        WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
        if (i === replyArr.length - 1) {
          WxParse.wxParseTemArray("replyTemArray",'reply', replyArr.length, that)
        }
      }
    },
    getCalendarData:function (cur_year, cur_month) {
      var that=this;
      data_api.getCalendar({
        success:function (res) {
          that.setData({ loadingHidden: true });
          if(res.data && res.data.code=="1001"){
            var calendarData=res.data.data;
            var arrList=[];
            calendarData.forEach(function (item) {
              var cc=item['time'].substring(0,item['time'].indexOf(" ")) ;
              item['time']=cc.replace(new RegExp("-", "gm"), "");
              arrList.push(item['time']);
            })

            arrList.sort(that.sortNumber);   //时间由小到大排序；
            var ArrInfo = [];
            for (var j = 0; j < arrList.length; j++) {
              var Arr = arrList[j];
              for (var z = 0; z < calendarData.length; z++) {
                // var ddd=calendarData[z].time.substring(0,calendarData[z].time.indexOf(" "))
                if (Arr ==calendarData[z].time) {
                  ArrInfo.push(calendarData[z]);
                }
              }
            }
            that.setData({
              calendarData:calendarData
              // calendarData:ArrInfo
            })
            that.calculateDays(cur_year, cur_month);
          }

        },fail:function (msg) {
          that.setData({ loadingHidden: true });
          console.log(msg);
        }
      },"GET")
    },

    sortNumber: function (a, b) {
      return a - b;
    },

    // 向前或向后一个月点击事件
    handleCalendar:function(e) {
      const handle = e.currentTarget.dataset.handle;
      const cur_year = this.data.cur_year;
      const cur_month = this.data.cur_month;
      if (handle === 'prev') {
        var newMonth = cur_month - 1;
        var newYear = cur_year;
        if (newMonth < 1) {
          newYear = cur_year - 1;
          newMonth = 12;
        }

        if(newYear==2017&&newMonth<12){
          newYear=2017;
          newMonth=12
        }
        this.createMonth(newMonth);
        this.calculateDays(newYear, newMonth);
        this.calculateEmptyGrids(newYear, newMonth);

        this.setData({
          cur_year: newYear,
          cur_month: newMonth
        })

      } else {
        var newMonth = cur_month + 1;
        var newYear = cur_year;
        if (newMonth > 12) {
          newYear = cur_year + 1;
          newMonth = 1;
        }

        var cur_months=new Date().getMonth() + 1;
        if(newYear==2018&&newMonth>cur_months){
          newYear=2018;
          newMonth=cur_months;
        }
        this.createMonth(newMonth);
        this.calculateDays(newYear, newMonth);
        this.calculateEmptyGrids(newYear, newMonth);

        this.setData({
          cur_year: newYear,
          cur_month: newMonth
        })
      }
    },

  //实现绑定的formSubmit 将formId传给服务器
  formSubmit: function (e) {
    var that = this;
    var formId=e.detail.formId;
    data_api.subscribeForm(formId,{
      success: function (res) {
        if(res.data.code==60006){
          that.showToast("订阅成功！","success",2000);
          that.setData({subDisabled:true,subscribeTxt:'已订阅'});
        }else if(res.data.code==60007){
          that.showToast("订阅失败","loading",2000);
        }else{
          that.showToast(res.data.msg,"loading",2000);
        }
      },fail(msg) {
        that.showToast(msg,"loading",2000);
      }
    },"GET")
  },
    // 分享
    onShareAppMessage: function () {
      return {
        title: '积募小管家',
        path: '/example/calendar/calendar',
        success: function (res) {
          console.log("分享成功")
        },
        fail: function (err) {
          console.log("转发失败")
        }
      }
    },
    getPhoneRl: function (e) {
      var phoneRl=e.detail.value;
      if(phoneRl){
        this.setData({ phoneRl: phoneRl, reminder:'', wxHighlight:true,disabled:false})
      }else{
        this.setData({phoneRl:'',wxHighlight:false})
      }
    },
    getEmail: function (e) {
      var emailRl= e.detail.value;
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (emailRl) {
        if (reg.test(emailRl)) {
          this.setData({ emailRl: emailRl, reminder:'', emHighlight:true,emFormat:true,disabled:false})
        } else {
          this.setData({emailRl:'',reminder: "邮箱格式不正确，请输入正确的邮箱!",emHighlight:false,emFormat:false})
        }
      }else{
        this.setData({emailRl:'',emHighlight:false,emFormat:true,reminder:''})
      }
    },
    Submit: function () {
      var that = this;
      var _phone = this.data.phoneRl;
      var _email = this.data.emailRl;

      if(_phone || _email){
        data_api.subFormRiLi(_phone, _email, {
          success: function (res) {
            if(res.data.code==60006){
              that.showToast("提交成功","success",2000);
              that.setData({disabled:true})
            }else if(res.data.code==60007){
              that.showToast("提交失败","loading",2000);
            }else{
              that.showToast(res.data.msg,"loading",2000);
            }
          },fail(msg) {
            that.showToast(msg,"loading",2000);
          }
        }, "GET")
      }else{
        that.setData({
          reminder: "手机号或者邮箱不能为空！",
          disabled:true
        })
      }

    },
    showModal: function (content) {
      wx.showModal({
        title: '提示',
        content: content,
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    },
    showToast: function (title, icon, duration) {
      wx.showToast({
        title: title,
        icon: icon,
        duration: duration
      })
    }
})
