import {commonBlock} from './commonFun'
let errorHandler = function (code, callback) {
  let errorMsg = ''
  switch (code) {
    case -1:
      errorMsg = '异常,请重试'
      callback(errorMsg)
      break
    case 1000:
      errorMsg = '参数验证失败'
      callback(errorMsg)
      break
    case 1001:
      errorMsg = '登录失败'
      callback(errorMsg)
      break
    case 1002:
      errorMsg = '页面失效,重新登录中...'
      callback(errorMsg)
      commonBlock()
      break
    case 1005:
      errorMsg = '已经关注该宿舍'
      callback(errorMsg)
      break
    case 1006:
      errorMsg = '关注失败'
      callback(errorMsg)
      break
    case 1007:
      errorMsg = '关注个数到达上限'
      callback(errorMsg)
      break
    case 1008:
      errorMsg = '取消关注宿舍失败'
      callback(errorMsg)
      break
    case 10011:
      errorMsg = '内网异常'
      callback(errorMsg)
      break
    default:
      errorMsg = '未知异常'
      callback(errorMsg)
      break
  }
}

export {errorHandler}
