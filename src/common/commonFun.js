import 'weui'
import weui from 'weui.js'
import axios from 'axios'
import {ApiUrl} from './config'
const commonBlock = function () {
  let count = sessionStorage.getItem('count')
  if (count !== null) {
    //window.location.href = ApiUrl + '/error'
    // window.location.href = 'www.baidu.'
  } else {
    sessionStorage.setItem('count', 1)
    window.location.href = ApiUrl + '/auth'
  }
}
const commonAlert = function (title, errorMsg) {
  weui.alert(errorMsg, {
    title: title,
    buttons: [{
      label: '确定',
      type: 'primary',
      onClick: function () { console.log('ok') }
    }]
  })
}
const zhaoxinAlert = function (title,msg){
  //执行招新宣传广告
  weui.confirm(msg, {
    title: title,
    buttons: [{
      label: '我知道了',
      type: 'default',
      onClick: () => { sessionStorage.setItem('showAd', 1) }
    }, {
      label: '立即报名',
      type: 'primary',
      onClick: () => {
        //点击确认
        sessionStorage.setItem('showAd', 1)
        window.location.href="https://wx-app.wangyuan.info/wy_bmxt/start.html"
      }
    }]
  })
}
// 获取列表数据，有数据就重定向
const fetchData = function (self) {
  axios({
    method: 'get',
    url: ApiUrl + '/star',
    headers: {
      token: self.$store.state.token
    }
  }).then(function (res) {
    if (res.data.error === 0) {
      let length = res.data.data.length
      if (length > 0) {
        self.$router.push({path: '/AttentionDormitory/HadAttention'})
        // window.location.href = '/#/AttentionDormitory/HadAttention'
        self.$store.commit('update_hasAttention', length)
      }
    } else {
      // errorHandler(res.data.error, (errorMsg) => {
      //   commonAlert('获取信息失败', errorMsg)
      // })
    }
  }).catch(function (error) {
    // commonAlert('获取信息失败', '未知异常')
    console.log(error)
  })
}
const login = function (code, self) {
  // 获取token
  axios({
    method: 'post',
    url: ApiUrl + '/login',
    data: {
      code: code
    }
  }).then((res) => {
    if (res.data.error === 0) {
      self.$store.commit('update_token', res.data.data.token)
      sessionStorage.setItem('token', res.data.data.token)
      fetchData(self)
      // 如果成功登录移除错误计数
      if (sessionStorage.getItem('count') !== null) {
        sessionStorage.removeItem('count')
      }
    } else if (res.data.error === 1001) {
      // 处理没有授权的逻辑
      commonBlock()
    } else {}
  }).catch(function (error) {
    console.log(error)
  })
}
export {commonBlock, commonAlert, login, fetchData,zhaoxinAlert}
