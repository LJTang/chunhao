import GMAPI from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        phoneNumber:'',
        verificationCode:'',
        password:'',
        codeClick: true,
        countDown:180,
        codeText:'点击发送验证码',
    },
    onLoad:function (option) {

        var text='',that=this;
        wx.setNavigationBarTitle({
            title: '绑定账号'
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
            if(that.data.codeText=='点击发送验证码'||that.data.codeText=='重新获取'){
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
    }

});
