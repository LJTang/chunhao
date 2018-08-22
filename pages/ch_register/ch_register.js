const util = require('../../utils/util.js');
import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        view_Boole:true,
        password_Boole:true,
        phoneNumber:'',
        verificationCode:'',
        password:'',
        codeClick: true,
        countDown:180,
        codeText:'获取验证码',
    },
    onLoad:function (option) {
        var text='',that=this;

        wx.setNavigationBarTitle({
            title: '注册'
        });

        this.setData({
            title:text
        });
    },
    getFocus: function (e) {
        this.setData({
            phoneNumber: e.detail.value
        });
    },
    getFocusCode: function (e) {
        this.setData({
            verificationCode: e.detail.value
        });
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
    clearInputCode: function (){
        this.setData({
            verificationCode:'',
        });
    },
    clearInputPassword: function (){
        this.setData({
            password:'',
        });
    },
    onValidation: function (e) {
        var that=this;
        // wx.navigateTo({
        //     url:'/pages/product_details/product_details'
        // })
    },
    //倒计时
    gm_SendCode: function () {
        var that=this;
        if(this.data.phoneNumber.length!=11||that.data.phoneNumber==''||GMAPI.checkPhone(that.data.phoneNumber)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000
            });
        }else{
            if(that.data.codeText=='获取验证码'||that.data.codeText=='重新获取'){
                // var strMsgSend = GCMAPI.doCreate_gcmMsg_134_GetConnect(1, this.data.phoneNumber);
                // GZK_Coder.doSendMsgWXSMA(strMsgSend, this.onMsgCallBack_134);
                that.onMsgCallBack_134();
            }
        }
    },
    onMsgCallBack_134:function (jsonBack) {
        // if(jsonBack.intSendSMSStatus==0){
            this.setData({
                codeClick: false
            });
            if (this.data.countDown<180) {
                this.setData({
                    codeClick: true
                });
                return;
            }
            this.setData({
                codeText: this.data.countDown + 's'
            });
            var that=this;
            var timer=null;
            timer = setInterval(function () {
                that.data.countDown--;
                that.setData({
                    codeClick: false
                });
                if (that.data.countDown <= 0) {
                    that.setData({
                        codeClick: true
                    });
                    clearInterval(timer);
                    that.data.countDown = 180;
                    that.setData({
                        codeText: '重新获取'
                    });
                    return
                }
                that.setData({
                    codeText: that.data.countDown + 's'
                })
            }, 1000);


            wx.showToast({
                title: '验证码已发送，请注意查收',
                icon: 'none',
                duration: 3000
            });
/*
        }else if(jsonBack.intSendSMSStatus==1){
            wx.showToast({
                title: '验证电话号码为空',
                icon: 'none',
                duration: 3000
            });
        }else if(jsonBack.intSendSMSStatus==2){
            wx.showToast({
                title: '验证电话号码错误',
                icon: 'none',
                duration: 3000
            });
        }else{
            wx.showToast({
                title: '验证码发送失败',
                icon: 'none',
                duration: 3000
            });
        }
*/
    },


    ch_Register:function(e){
        var that=this;
        if(e.detail.value.phone.length!=11||e.detail.value.phone==''||GMAPI.checkPhone(e.detail.value.phone)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration:2000
            });
        }else if(e.detail.value.password==''){
            wx.showToast({
                title: '请输入正确的密码',
                icon: 'none',
                duration:2000
            });
        }else{

            GMAPI.doSendMsg('api/verification/register',{phone:e.detail.value.phone,password:e.detail.value.password},'POST',that.onMsgCallBack_Register);
        }
    },
    onMsgCallBack_Register:function (jsonBack){
        console.log(jsonBack)
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.setStorage({
                key: 'userInfo',
                data: data.data
            });
            wx.showToast({
                title:'注册成功',
                icon: 'none',
                duration:2000
            });
            wx.setStorage({
                key: 'checkbox',
                data:''
            });
            wx.setStorage({
                key: 'remember',
                data: ''
            });
            setTimeout(function () {
                wx.switchTab({
                    url:'/pages/index/index'
                });
            },2000 )
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    }
});
