//logs.js
const util = require('../../utils/util.js');
import GMAPI from "../../script/api";
Page({
  data: {
      logs: [],
      checkbox:(wx.getStorageSync('remember')==''?0:1),
      checkbox_Bool:(wx.getStorageSync('remember')==''?false:true),
      logo_phone:'',
      logo_password:'',
      height:null
  },
  onLoad: function () {
      var that=this;
      wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  height:res.windowHeight
              });
          }
      });
      wx.setNavigationBarTitle({
          title: '登录'
      });
      console.log(wx.getStorageSync('remember'));

      if(wx.getStorageSync('remember')==''){
          this.setData({
              logo_phone:'',
              logo_password:'',
              checkbox_Bool:false
          })
      }else{
          this.setData({
              checkbox_Bool:true,
              logo_phone:wx.getStorageSync('remember').phone,
              logo_password:wx.getStorageSync('remember').password
          })
      }
  },
    getFocusPassword: function (e) {
        this.setData({
            password: e.detail.value
        });
    },
    clearInput: function (){
        this.setData({
            phoneNumber:'',
        });
    },
    // input值
    checkboxChange: function(e) {
        this.setData({
            checkbox:e.detail.value
        });
        wx.setStorage({
            key: 'checkbox',
            data:(e.detail.value==1)
        });
        wx.setStorage({
            key: 'remember',
            data: {phone:e.detail.value.phone,password:e.detail.value.password}
        });
    },

    formSubmit_phone:function(e){
      var that=this;
        if(e.detail.value.phone.length!=11||e.detail.value.phone==''||GMAPI.checkPhone(e.detail.value.phone)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration:2000
            });
        }else if(e.detail.value.password==''||e.detail.value.password.length<6){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration:2000
            });
        }else{
            if(this.data.checkbox==1){
                this.setData({
                    logo_phone:e.detail.value.phone,
                    logo_password:e.detail.value.password
                });
            }
            GMAPI.doSendMsg('api/verification/dologin', {phone:e.detail.value.phone,password:e.detail.value.password},'POST',that.onMsgCallBack_Logon);
        }
    },
    onMsgCallBack_Logon:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        var that=this;
        console.log(data)
        if(data.code==200){
            wx.setStorage({
                key: 'userInfo',
                data: data.data
            });
            if(that.data.checkbox==1){
                wx.setStorage({
                    key: 'remember',
                    data: {phone:that.data.logo_phone,password:that.data.logo_password}
                });
            }else{
                wx.setStorage({
                    key: 'remember',
                    data:''
                });
            }
            wx.switchTab({
                url: '/pages/index/index'
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
