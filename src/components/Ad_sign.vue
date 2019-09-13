
<template>
  <div class="ad">
    <div class="box">
      <div class="title">招新广告[{{txt}}]</div>
      <img @click="toSignPage" src="../assets/ad.png" alt="">
    </div>
  </div>
</template>

<script>


export default {
  name: 'AttentionDormitory',
  props:{
    txt:String
  },
  created () {

  },
  methods:{
    toSignPage(){
      window.location.href="https://wx-app.wangyuan.info/wy_bmxt/start.html"
    }
  }
}
</script>

<style scoped>
.ad{
  width: 100%;
  margin-top: 30px;
}
.box{
  position: relative;
  -webkit-box-shadow: 0 0 1.867vw #0a0a0a;
  box-shadow: 0 0 1.867vw #c7c7c7;
}
.box .title{
  text-align: left;
  color:#4ea3ee;
  padding-left: 10px;
}
.box img{
  width: 100%;
  object-fit: cover;
  opacity:.8;
  z-index: 1;
}

</style>
