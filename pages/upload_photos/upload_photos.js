import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        url:"https://chunhao.guangzhoubaidu.com/uploads/chunhao/",
        view_Boole:true,
        password_Boole:true,
        phoneNumber:'',
        verificationCode:'',
        password:'',
        codeClick: true,
        countDown:180,
        codeText:'获取验证码',
        imgURL:'',
        imgURL2:'',
        imgURL3:''
    },
    onLoad:function (option) {
        var text='',that=this;
        console.log(app.data.photos_Z,app.data.photos_F,app.data.photos_Head);
        this.setData({
            title:text,
            imgURL:(app.data.photos_Z==''?'/images/photos1.png':app.data.photos_Z),
            imgURL2:(app.data.photos_F==''?'/images/photos1.png':app.data.photos_F),
            imgURL3:(app.data.photos_Head==''?'/images/photos3.png':app.data.photos_Head)
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight - 98
                });

            }
        });
        // GMAPI.doSendMsg('api/uploads/fileupload','','POST',that.onMsgCallBack_Photo);
    },


//添加图片
    listenerButtonChooseImage: function(e) {
        var that = this;
        var index=e.currentTarget.dataset.index;
        wx.chooseImage({
            count: 1,
            //original原图，compressed压缩图
            sizeType: ['original'],
            //album来源相册 camera相机
            sourceType: ['album', 'camera'],
            //成功时会回调
            success: function(res) {
                console.log(res);
                wx.uploadFile({
                    url: 'https://chunhao.guangzhoubaidu.com/api/uploads/fileupload', //仅为示例，非真实的接口地址
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    formData:'',
                    success: function(res){
                        console.log(res);
                        var data = JSON.parse(res.data);
                        if(index==0){
                            that.setData({
                                imgURL:that.data.url+data.data
                            });
                        }else if(index==1){
                            that.setData({
                                imgURL2:that.data.url+data.data
                            })
                        }else{
                            that.setData({
                                imgURL3:that.data.url+data.data
                            })
                        }
                    }
                })


            }
        })
    },
    onValidation:function(){
        var that=this;
        if(that.data.imgURL==''){
            wx.showToast({
                title:'身份证正面照必须上传',
                icon: 'none',
                duration:2000
            });
        }else if(that.data.imgURL2==''){
            wx.showToast({
                title:'身份证反面照必须上传',
                icon: 'none',
                duration:2000
            });
        }else if(that.data.imgURL3==''){
            wx.showToast({
                title:'个人半身照必须上传',
                icon: 'none',
                duration:2000
            });
        }else {

            var json = {
                data: {
                    uid: wx.getStorageSync('userInfo').uid,
                    idc_z: that.data.imgURL,
                    idc_f: that.data.imgURL2,
                    idc_header: that.data.imgURL3
                }
            };
            GMAPI.doSendMsg('api/user/userDoSub', json, 'POST', that.onMsgCallBack_onPhoto);
        }
    },
    onMsgCallBack_onPhoto:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
            app.data.photos_Text='已上传';
            setTimeout(function () {
                wx.navigateBack({
                    delta:1
                });
            },2000)
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    }
});

