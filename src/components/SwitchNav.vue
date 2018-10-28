<template>
  <div class="switch-nav">
    <div class="feng-flex">
      <div class="feng-switch-button" v-bind:class="{'right-move':this.$store.state.isAttention}">
        {{this.$store.state.buttonText}}
      </div>
      <div class="feng-flex__item" @click="NewAttention">
        <router-link to="/" class="feng-link" >
          新关注
         </router-link>
      </div>
      <div class="feng-flex__item"  @click="HadAttention">
        <router-link to="/AttentionDormitory/HadAttention" class="feng-link" >
          已关注
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwitchNav',
  data () {
    return {
      // isAttention: false,
      // buttonText: '新关注'
    }
  },
  methods: {
    NewAttention () {
      this.$store.commit('changeAttentionState', false)
      this.$store.commit('changeButtonText', '新关注')
    },
    HadAttention () {
      this.$store.commit('changeAttentionState', true)
      this.$store.commit('changeButtonText', '已关注')
    }
  }

}
</script>

<style scoped>
  .switch-nav{
    width: 507px;
    height: 62px;
    background: #e5e5e5;
    border-radius: 30px;
    margin:auto;
    line-height: 62px;
    font-size: 28px;
    margin-bottom: 62px;
  }
  .feng-flex{
    display: flex;
    height: 100%;
    border-radius: inherit;
    position: relative;
  }
  .feng-flex__item{
    flex: 1;
  }
  .feng-link{
    display:block;
    height: 100%;
  }
  #app .feng-link{
    color: #aca1a1 !important;

  }
  .feng-switch-button{
    position: absolute;
    left: 0;
    width: 50%;
    height: 100%;
    transition: left ease-in-out .2s;
    background-color: #fff;
    box-sizing: border-box;
    border: 2px solid #c7c7c7;
    box-shadow: 0 0 14px #c7c7c7;
    border-radius: inherit;
  }
  .right-move{
    left: 50%;
  }
</style>
