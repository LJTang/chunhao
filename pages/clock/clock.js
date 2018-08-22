var util = require('../../utils/util.js');
import GMAPI from "../../script/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      date:GMAPI.formatTime(Date.parse(new Date()),'Y-M-D'),
      clock:GMAPI.formatTime(Date.parse(new Date()),'h:m:s'),
      userInfo:{},
      s_time:{},
      x_time:{},
      sxText:'',
      clockInTime_Bool:true,
      clockOffTime_Bool:true,
      clockBtn_Bool:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // GMAPI.formatTime(data.data.order_detail.add_time,'Y-M-D h:m:s')
  onLoad: function () {
    var that = this;
      wx.setNavigationBarTitle({
          title: '打卡'
      });
      this.data.intervarID= setInterval(function () {
          var leftTime =Date.parse(new Date()); //计算剩余的毫秒数
          that.setData({
              clock:GMAPI.formatTime(leftTime,'h:m:s')
          });
      },1000);
        var times=Date.parse(new Date());
      GMAPI.doSendMsg('api/verification/SXarray','','POST',that.onMsgCallBack_ClockInAndOut_Time);
      GMAPI.doSendMsg('api/verification/punchLog', {uid:wx.getStorageSync('userInfo').uid,nowtime:times/1000},'POST',that.onMsgCallBack_Clock_Time);
  },
    onShow:function () {
        const time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        var stipulate=time + 12 * 60 * 60 * 1000;
        if(Date.parse(new Date())>stipulate){
            this.setData({
                sxText:'下班打卡'
            });
        }else{
            this.setData({
                sxText:'上班打卡'
            });
        }
        this.setData({
            userInfo:wx.getStorageSync('userInfo')
        });
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        });
        var that=this;

        GMAPI.doSendMsg('api/verification/punchLog', {uid:wx.getStorageSync('userInfo').uid,nowtime:GMAPI.doTurnTimestamp(e.detail.value)/1000},'POST',that.onMsgCallBack_Clock_Time);
    },
    onMsgCallBack_ClockInAndOut_Time:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                clock_data:data.data,
                s_time:data.data.s_time,
                x_time:data.data.x_time,
            })
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    onClock:function (){
        var that=this;
        GMAPI.doSendMsg('api/verification/hitTime', {uid:wx.getStorageSync('userInfo').uid,remarks:''},'POST',that.onMsgCallBack_Clock);
    },
    onMsgCallBack_Clock:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        var that=this;
        if(data.code==200){
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
            setTimeout(function () {
                GMAPI.doSendMsg('api/verification/punchLog', {uid:wx.getStorageSync('userInfo').uid,nowtime:Date.parse(new Date())/1000},'POST',that.onMsgCallBack_Clock_Time);
            },2000)
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },

    onMsgCallBack_Clock_Time:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        var that=this;
        if(data.code==200){
            var nowDate=GMAPI.formatTime(Date.parse(new Date()),'Y-M-D');
            var zhuan_Times=GMAPI.doTurnTimestamp(nowDate);
            if(zhuan_Times==GMAPI.doTurnTimestamp(that.data.date)){

                if(data.data.s_type==1&&data.data.x_type==2){
                    this.setData({
                        clockBtn_Bool:true
                    });
                }else if(data.data.x_type==2){
                    this.setData({
                        clockBtn_Bool:true
                    });
                }else{
                    this.setData({
                        clockBtn_Bool:false
                    });
                }
            }else{
                this.setData({
                    clockBtn_Bool:true
                });
            }
            this.setData({
                s_Clock_time:(data.data.s_time==0?'你早上没打卡':'打卡时间：'+GMAPI.formatTime((data.data.s_time)*1000,'h:m:s')),
                x_Clock_time:(data.data.x_time==0?'你下午没打卡':'打卡时间：'+GMAPI.formatTime((data.data.x_time)*1000,'h:m:s')),
            })
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    }

});
function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10)  {
        i = "0" + i;
    }
    return i;
}