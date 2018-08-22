//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
      wx.setNavigationBarTitle({
          title: '账号安全'
      });
  },
    jump_Modify:function(e){
        var index=e.currentTarget.dataset.index;
        wx.navigateTo({
            url:'/pages/modify/modify?id='+parseInt(index)
        })
    }
})
