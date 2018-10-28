<template>
  <div id="app">
    <div class="weui-tab">
      <div class="weui-tab__panel">
        <router-view :dormitoryData="dormitoryData" />
      </div>
      <div class="weui-tabbar">
        <router-link to="/AttentionDormitory" class="weui-tabbar__item " >
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
import 'weui'
import weui from 'weui.js'
export default {
  name: 'App',
  data () {
    return {
      title: '查询余额',
      dormitoryData: ''
    }
  },
  created () {
    // 获取openid
    let self = this
    this.axios.get('/openid').then(function (res) {
      console.log(res.data.open_id)
      localStorage.setItem('open_id', res.data.open_id)
    }).catch(function (error) {
      console.log(error)
    })
    this.axios.get('/apartment').then(function (res) {
      self.dormitoryData = res.data.data
    }).catch(function (error) {
      weui.topTips('发生异常了！', {
        duration: 3000,
        className: 'tip',
        callback: function () { console.log('close') }
      })
      console.log(error)
    })
    if (localStorage.getItem('district') !== null && localStorage.getItem('room') !== null) {
      self.$store.commit('changeBuilding', localStorage.getItem('building'))
      self.$store.commit('change_dormitory_name', localStorage.getItem('dormitory_name'))
      self.$store.commit('changeDistrict', localStorage.getItem('district'))
      self.$store.commit('changeId', localStorage.getItem('apartment_id'))
      self.$store.commit('updateRoom', localStorage.getItem('room'))
    }
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

</style>
