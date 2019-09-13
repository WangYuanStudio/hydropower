<template>
  <div id="app">
    <div class="weui-tab">
      <div class="weui-tab__panel">
        <router-view :dormitoryData="dormitoryData" />
      </div>
      <div class="weui-tabbar">
        <router-link :to="this.$store.state.hasAttention>0?'/AttentionDormitory/HadAttention':'/AttentionDormitory'" class="weui-tabbar__item " >
          <i class="iconfont icon-home"></i>
          <p class="weui-tabbar__label">关注宿舍</p>
        </router-link>
        <router-link to="/CheckBalances" class="weui-tabbar__item " >
          <i class="iconfont icon-yue"></i>
          <p class="weui-tabbar__label">查询余额</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import 'weui'

import weui from 'weui.js'
import {data as dormitoryData} from '../data.js'
import {commonBlock, login, fetchData} from './common/commonFun.js'
import {ApiUrl} from './common/config.js'
export default {
  name: 'App',
  data () {
    return {
      title: '查询余额',
      dormitoryData: ''
    }
  },
  created () {
    
    let self = this
    // 获取code ,以获取token
    let code = this.$route.query.code
    // console.log(this.$store.state.token)
    // 首先检查code
    if (code) {
      if (sessionStorage.getItem('token') !== null) {
        // 判断token是否有效
        axios({
          method: 'post',
          url: ApiUrl + '/check/token',
          data: {
            token: sessionStorage.getItem('token')
          }
        }).then((res) => {
          // token无效
          if (res.data.error !== 0) {
            // 重新登录获取token
            login(code, self)
          } else {
            console.log('更新token到全局变量')
            // 继续使用原来的token
            self.$store.commit('update_token', sessionStorage.getItem('token'))
            if (sessionStorage.getItem('count') !== null) {
              sessionStorage.removeItem('count')
            }
            fetchData(self)
          }
        })
      } else {
        // 会话结束需重新登录
        console.log('会话结束')
        login(code, self)
      }
    } else {
      // 重定向获取code
      commonBlock()
    }

    // 获取宿舍信息
    this.dormitoryData = dormitoryData
    if (localStorage.getItem('district') !== null && localStorage.getItem('room') !== null) {
      self.$store.commit('change_dormitory_name', localStorage.getItem('dormitory_name'))
      self.$store.commit('changeDistrict', localStorage.getItem('district'))
      self.$store.commit('changeId', localStorage.getItem('apartment_id'))
      self.$store.commit('updateRoom', localStorage.getItem('room'))
      self.$store.commit('change_some', localStorage.getItem('some'))
    }
  },
  methods: {
  }
}
</script>

<style>

#app {
  font-family:'Microsoft Yahei','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #fff;
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.weui-tabbar__item i{
  font-size: 32px;
}
.weui-tabbar__item{
  color: #050505 !important;
}
.weui-tabbar .weui-tabbar__label{
  font-size: 22px;
  color: inherit;
}
.weui-tabbar{
  height: 110px;
  background-color: #fff !important;
  box-shadow: 0 0 10px #dadada;
}
.router-link-active{
  color: #4ea3ee !important;
}
.weui-tab__panel{
  padding-bottom: 100px;
}

#weui-picker-confirm{
  color: #4ea3ee !important;
}
.van-radio .van-icon-checked{
  color: #4ea3ee;
}
.weui-label{
 width: 105px !important;
}
.van-radio__input{
  font-size: 28px !important;
}
.weui-dialog__btn_primary{
  color: #4ea3ee !important;

}

</style>
