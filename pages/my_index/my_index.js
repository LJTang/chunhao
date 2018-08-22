//index.js
//获取应用实例
import GMAPI from "../../script/api";
const app = getApp();
Page({
  data: {
    userInfo:{},
    hasUserInfo: false,
  },
  onLoad: function () {
      wx.setNavigationBarTitle({
          title: '个人中心'
      });
  },
    onShow: function () {
      var that=this;
      GMAPI.doSendMsg('api/user/userInfo', {id:wx.getStorageSync('userInfo').uid},'POST',that.onMsgCallBack_UserCenter);
  },
    onMsgCallBack_UserCenter:function (jsonBack){
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
    jump_DataEntry:function(e){
        wx.navigateTo({
            url:'/pages/data_entry/data_entry'
        })
    },
    jump_AccountSecurity:function(e){
        wx.navigateTo({
            url:'/pages/account_security/account_security'
        })
    },
    jump_Binding:function(e){
        wx.navigateTo({
            url:'/pages/binding/binding'
        })
    },
    logUot:function () {
        wx.setStorage({
            key: 'remember',
            data:''
        });
        wx.setStorage({
            key: 'checkbox',
            data:''
        });
        wx.reLaunch({
            url: '/pages/logs/logs'
        })
    }
})
