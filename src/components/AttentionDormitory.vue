
<template>
  <div>
    <div class="header">
      关注宿舍
    </div>
    <SwitchNav/>
    <router-view :dormitoryData="dormitoryData" ></router-view>
    <!--临时招新广告摊位-->
    <AdSign  
      v-if="zhaoxinBlock"
      :txt="zhaoxin.txt"/>
  </div>
</template>

<script>
import AdSign from '@/components/Ad_sign'
import SwitchNav from './SwitchNav'
import {zhaoxinAlert} from '../common/commonFun.js'
export default {
  name: 'AttentionDormitory',
  props: {
    dormitoryData: {
      require: true
    }
  },
  data(){
    return{
      zhaoxin:{
        month:'9',
        lastDay:'20',
        txt:'广告将9月20号消失'
      },
      zhaoxinBlock:false
    }
  },
  components: {
    SwitchNav,
    AdSign
  },

  created () {
    //执行显示招新广告
    if(sessionStorage.getItem('showAd')===null){
      zhaoxinAlert('网园咨询工作室招新啦!','如果你对IT,学技术感兴趣可以点击下方图片报名')
    }
    console.log(new Date().getMonth()+1)
    let nowMonth=new Date().getMonth()+1
    let nowDay=new Date().getDate()
    if(nowMonth==this.zhaoxin.month&&nowDay<this.zhaoxin.lastDay){
      this.zhaoxinBlock=true
    }
  }
}
</script>

<style scoped>

  .header{
    height: 96px;
    line-height: 96px;
    text-align: center;
    font-size: 32px;
    box-shadow: 0 0 10px #dadada;
    margin-bottom: 36px;
  }
</style>
