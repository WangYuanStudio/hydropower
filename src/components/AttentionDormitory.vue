
<template>
  <div>
    <div class="header">
      关注宿舍
    </div>
    <SwitchNav/>
    <router-view :dormitoryData="dormitoryData" ></router-view>
  </div>
</template>

<script>

import SwitchNav from './SwitchNav'
export default {
  name: 'AttentionDormitory',
  props: {
    dormitoryData: {
      require: true
    }
  },
  components: {
    SwitchNav

  },

  created () {

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
