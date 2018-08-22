//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    motto: 'Hello World',
      note:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
        note:app.data.note,
    })
  },
    onShow: function () {
        this.setData({
            note:app.data.note,
        })
    },
    //完成事件
    onComplete:function (e) {
      app.data.note=e.detail.value;
        wx.setStorage({
            key: 'textarea',
            data:e.detail.value
        });
        wx.navigateBack({
            delta: 1
        });
    }
})
