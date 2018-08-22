const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 电话号码验证
function checkPhone(phone){
    if(!(/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/.test(phone))){
        return false;
    }
}
// function formatTime(date) {
//     var year = date.getFullYear()
//     var month = date.getMonth() + 1
//     var day = date.getDate()
//
//     var hour = date.getHours()
//     var minute = date.getMinutes()
//     var second = date.getSeconds()
//
//     return [year, month, day].map(formatNumber).join('-')
// }

function formatTime1(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [hour, minute, second].map(formatNumber).join(':')
}


module.exports = {
  formatTime: formatTime,
    formatTime1: formatTime1,
    checkPhone: checkPhone
}
