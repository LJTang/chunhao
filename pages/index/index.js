import GMAPI from "../../script/api";

var app = getApp();
var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');
Page({
    data: {
        progress_txt: '正在匹配中...',
        count:0, // 设置 计数器 初始为0
        countTimer: null,// 设置 定时器 初始为null
        strData:'',
        startData:'',
        endData:GMAPI.formatTime(Date.parse(new Date()),'Y-M-D'),
        dateTime:GMAPI.formatTime(Date.parse(new Date()),'Y-M-D')
    },
    drawCircle: function (step){
        var context = wx.createCanvasContext('canvasProgress');
        // 设置渐变
        var gradient = context.createLinearGradient(130, 65, 65, 120);
        gradient.addColorStop("0", "#f85943");
        gradient.addColorStop("0.5", "#f85943");
        gradient.addColorStop("1.0", "#f85943");

        context.setLineWidth(10);
        context.setStrokeStyle(gradient);
        context.setLineCap('round');
        context.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(75, 75, 65, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
    },
    countInterval: function () {
        // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
        this.countTimer = setInterval(() => {
            if (this.data.count <= 60) {
                /* 绘制彩色圆环进度条
                注意此处 传参 step 取值范围是0到2，
                所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
                */
                this.drawCircle(this.data.count / (60/2));
                this.data.count++;
            } else {
                this.setData({
                    progress_txt: "匹配成功"
                });
                clearInterval(this.countTimer);
            }
        },10)
    },
    onReady: function () {
        // this.drawProgressbg();
        this.drawCircle(2);
        this.countInterval();
    },
    onToggle: function (e) {
        var that = this;
        for(var i=0;i<list.length;i++){

        }
        that.setData({
            selected:!that.data.selected
        })
    },
    onLoad:function (){

    },
    onShow:function(){
        var that=this;
        GMAPI.doSendMsg('api/salary/generatePayroll',{uid:wx.getStorageSync('userInfo').uid,nowtime:Date.parse(new Date())/1000},'POST',that.onMsgCallBack_Payroll);
    },
    onMsgCallBack_Payroll:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                strData:data.data,
                startData:GMAPI.formatTime(data.data.entry_time*1000,'Y-M-D')
            })
        }else{
            this.setData({
                strData:''
            })
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration:2000
            });
        }
    },
    bindDateChange: function(e) {
        var that=this;
        this.setData({
            dateTime: e.detail.value
        });
        GMAPI.doSendMsg('api/salary/generatePayroll',{uid:wx.getStorageSync('userInfo').uid,nowtime:GMAPI.doTurnTimestamp(e.detail.value)/1000},'POST',that.onMsgCallBack_Payroll);
    }
});

