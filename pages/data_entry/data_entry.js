import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        date: '',
        endData:GMAPI.formatTime(Date.parse(new Date()),'Y-M-D'),
        text_Date: '',
        note: '',
        userInfo: '',
        hint:'',
        radio:null,
        head_ImgURL:'',
        url:"https://chunhao.guangzhoubaidu.com/uploads/chunhao/",
        address_Array: [],
        city:'',
        address_id:null
    },
    radioChange: function(e) {
        this.setData({
            radio:e.detail.value
        });
    },
      onLoad:function () {
            var that=this;
          wx.setNavigationBarTitle({
              title: '资料录入'
          });
          wx.showLoading();
          GMAPI.doSendMsg('api/user/userInfo', {id:wx.getStorageSync('userInfo').uid},'POST',that.onMsgCallBack_UserData);
          GMAPI.doSendMsg('api/verification/addressArray', {id:wx.getStorageSync('userInfo').uid},'POST',that.onMsgCallBack_Address);
      },
    onShow:function(){
        var that=this;
        this.setData({
            photos_Text:app.data.photos_Text,
            note:app.data.note
        })
    },
    bindPickerChange: function(e) {
        var that=this;
        var index=parseInt(e.detail.value);
        var list=this.data.address_Array;
        this.setData({
            address_id:list[index].id,
            city:list[index].name
        });
    },
    onMsgCallBack_UserData:function (jsonBack){
        wx.hideLoading();
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                userInfo:data.data,
                city:data.data.address,
                address_id:(data.data.memberArray==''?'':data.data.memberArray.address_id),
                radio:(data.data.memberArray==''?'':data.data.memberArray.sex),
                date:(data.data.memberArray==''?'':(data.data.memberArray.birth==0?'':GMAPI.formatTime(data.data.memberArray.birth*1000,'Y-M-D'))),
                head_ImgURL:(data.data.avatar==''?'':data.data.avatar),
                hint:(data.data.avatar==''?'点击头像上传':''),
                note:(data.data.memberArray==''?app.data.note:(data.data.memberArray.remarks==''?app.data.note:data.data.memberArray.remarks))
            });
            if(data.data.memberArray.idc_z==''){
                this.setData({
                    photos_Text:''
                })
            }else if(data.data.memberArray.idc_f==''){
                this.setData({
                    photos_Text:''
                })
            }else if(data.data.memberArray.idc_header==''){
                this.setData({
                    photos_Text:''
                });
            }else{
                this.setData({
                    photos_Text:'已上传'
                })
            }
            app.data.photos_Z=(data.data.memberArray==''?app.data.photos_Z:data.data.memberArray.idc_z);
            app.data.photos_F=(data.data.memberArray==''?app.data.photos_F:data.data.memberArray.idc_f);
            app.data.photos_Head=(data.data.memberArray==''?app.data.photos_Head:data.data.memberArray.idc_header);
            app.data.note=(data.data.memberArray==''?app.data.note:(data.data.memberArray.remarks==''?app.data.note:data.data.memberArray.remarks))
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    onMsgCallBack_Address:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                address_Array:data.data
            })
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    formSubmit_DataEntry:function(e){
        var that=this;
        console.log(that.data.date)
        if(e.detail.value.name==''){
            wx.showToast({
                title: '用户名不能为空',
                icon: 'none',
                duration:2000
            });
        }else if(that.data.radio==null){
            wx.showToast({
                title: '用户性别必须选择',
                icon: 'none',
                duration:2000
            });
        }else if(e.detail.value.password==''){
            wx.showToast({
                title: '密码用户名不能为空',
                icon: 'none',
                duration:2000
            });
        }else if(that.data.date==''){
            wx.showToast({
                title: '时间不能为空',
                icon: 'none',
                duration:2000
            });
        }else if(that.data.city==''){
            wx.showToast({
                title: '地址不能为空',
                icon: 'none',
                duration:2000
            });
        }else if(e.detail.value.bcn_idc==''){
            wx.showToast({
                title: '银行卡号不能为空',
                icon: 'none',
                duration:2000
            });
        }else if(e.detail.value.bcn_name==''){
            wx.showToast({
                title: '持卡人不能为空',
                icon: 'none',
                duration:2000
            });
        }else {
            var json = {
                data: {
                    uid: wx.getStorageSync('userInfo').uid,
                    name:e.detail.value.name,
                    birth: GMAPI.doTurnTimestamp(e.detail.value.age)/1000,
                    sex:that.data.radio,
                    address_id:that.data.address_id,
                    bcn_idc:e.detail.value.bcn_idc,
                    bcn_name:e.detail.value.bcn_name,
                    remarks:that.data.note,
                    post_id:'',
                    status:'',
                    entry_time:'',
                    quit_time:'',
                    add_time:'',
                    update_time:''
                }
            };
            GMAPI.doSendMsg('api/user/userDoSub',json,'POST',that.onMsgCallBack_UserCenter);
        }
    },
    onMsgCallBack_UserCenter:function (jsonBack){
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
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    jump_Note:function () {
        wx.navigateTo({
            url:'/pages/note/note'
        })
    },
    jump_UploadPhotos:function () {
        wx.navigateTo({
            url:'/pages/upload_photos/upload_photos'
        })
    },
    onChooseImage: function(e) {
        var that = this;
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
                        var data = JSON.parse(res.data);

                        that.setData({
                            hint:'',
                            head_ImgURL:that.data.url+data.data
                        });
                        that.onValidation();
                    }
                })
            }
        })
    },
    onValidation:function(){
        var that=this;
        var json ={data:{uid: wx.getStorageSync('userInfo').uid,avatar:that.data.head_ImgURL}};

        GMAPI.doSendMsg('api/user/userDoSub',json,'POST',that.onMsgCallBack_PhotoTop);
    },
    onMsgCallBack_PhotoTop:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        if(data.code==200){
            wx.showToast({
                title:'头像'+data.msg,
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
    }

});

