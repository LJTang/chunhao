//index.js
//获取应用实例
import GMAPI from "../../script/api";
const app = getApp()

Page({
  data: {
      userInfo:'',
      condition:[],
      goods:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
    onLoad:function (){
        var that=this;
        wx.setNavigationBarTitle({
            title: '评分'
        });
        wx.showLoading({
            title: '加载中',
        })
        GMAPI.doSendMsg('api/user/userInfo', {id:wx.getStorageSync('userInfo').uid},'POST',that.onMsgCallBack_UserCenter);
        GMAPI.doSendMsg('api/achievements/ex_condition','','POST',that.onMsgCallBack_Condition);
    },
    onMsgCallBack_UserCenter:function (jsonBack){
        setTimeout(function(){
            wx.hideLoading();
        },1000);
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                userInfo:data.data
            })
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    onMsgCallBack_Condition:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                condition:data.data,
                goods:data.data
            })
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    searchBtn:function(e){
      // var list=this.data.condition;
      // var index=e.currentTarget.dataset.index;
      //   for(var i=0;i<list.length;i++){
      //       list[index].c_value='';
      //   }
      //   this.setData({
      //       condition:list
      //   })
    },
    getBlur:function(e){
      // var list=this.data.condition;
      // var index=e.currentTarget.dataset.index;
      // var goods=this.data.goods;
      //   for(var i=0;i<list.length;i++){
      //       list[i].c_value=goods[index].c_value;
      //   }
      //   this.setData({
      //       condition:list
      //   })
    },
    formSubmit_Conditions:function(e){
        var that=this;

        var json={uid:wx.getStorageSync('userInfo').uid,c_value:e.detail.value};
        GMAPI.doSendMsg('api/achievements/personal_score',json,'POST',that.onMsgCallBack_SubmitConditions);
    },
    onMsgCallBack_SubmitConditions:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    click:function (e){

        // var list=this.data.condition;
        // var index=parseInt(e.currentTarget.dataset.index);
        // for(var i=0;i<list.length;i++){
        //     list[index].c_value='';
        // }
        // this.setData({
        //     condition:list
        // });
        // console.log(this.data.condition)
    }

})
