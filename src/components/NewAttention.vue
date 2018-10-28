<template>
    <div>
      <div class="weui-cells">
        <div class="weui-cell weui-cell_access js_item" @click="getDistrict()">
          <div class="weui-cell  noPadding">
            <div class="weui-cell__hd">
              <label for="" class="weui-label">苑区</label>
            </div>
            <div class="weui-cell__bd weui-cell__ft">
              <p class="selected">
                {{this.$store.state.district}}
              </p>
            </div>

          </div>
        </div>
        <div class="weui-cell" >
          <div class="weui-cell__hd"><label class="weui-label">宿舍号</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input marginRight" v-model="room1"  minlength="3"  maxlength="3"   placeholder="如505"/>
          </div>
        </div>
        <div class="weui-cell addHeight">
          <div class="weui-cell__hd">
            <label for="" class="weui-label widthAuto">余额提醒</label>
          </div>
          <div class="weui-cell__bd marginTop">
            <van-radio-group v-model="radio">
              <div class="weui-flex chooseHow">
                <div class="weui-flex__item">
                  <div class="placeholder">
                    <van-radio name="5">5元</van-radio>
                  </div>
                </div>
                <div class="weui-flex__item">
                  <div class="placeholder">
                    <van-radio name="10">10元</van-radio>
                  </div>
                </div>
                <div class="weui-flex__item">
                  <div class="placeholder">
                    <van-radio name="15">15元</van-radio>
                  </div>
                </div>
              </div>
              <div class="weui-flex chooseHow">
                <div class="weui-flex__item">
                  <div class="placeholder">
                    <van-radio name="20">20元</van-radio>
                  </div>
                </div>
                <div class="weui-flex__item">
                  <div class="placeholder">
                    <van-radio name="25">25元</van-radio>
                  </div>
                </div>
                <div class="weui-flex__item">
                  <div class="placeholder">
                    <van-radio name="30">30元</van-radio>
                  </div>
                </div>
              </div>
            </van-radio-group>
          </div>
        </div>
      </div>
      <div class="button-sp-area">
        <button @click="newAttention"  class="weui-btn blue"><i v-if="loading" class="weui-loading"></i>关注</button>
      </div>
    </div>
</template>

<script>

import 'weui'
import weui from 'weui.js'
import 'vant/lib/vant-css/icon-local.css'
export default {
  name: 'NewAttention',
  props: {
    dormitoryData: {
      require: true
    }
  },
  data () {
    return {
      // district: '', // 苑区
      radio: '5',
      loading: false
    }
  },
  computed: {
    room1: {
      get () {
        return this.$store.state.room
      },
      set (value) {
        this.$store.commit('updateRoom', value)
      }
    }
  },
  methods: {
    getDistrict () {
      let self = this
      weui.picker(this.dormitoryData, {
        className: 'ignore',
        container: 'body',
        defaultValue: [1, 1, 1],
        onChange: function (result) {
        },
        onConfirm: function (result) {
          self.$store.commit('changeBuilding', result[2].value)
          self.$store.commit('change_dormitory_name', result[1].label)
          self.$store.commit('changeDistrict', result[0].label + result[2].label)
          self.$store.commit('changeId', result[2].id)
        },
        id: 'doubleLinePicker'
      })
    },
    newAttention () {
      let self = this
      if (this.$store.state.room !== '' && this.$store.state.district !== '') {
        weui.confirm('当关注目标宿舍的水费或电费低于设定值将会通过微信推送提醒给您', {
          title: '确定关注',
          buttons: [{
            label: '取消',
            type: 'default',
            onClick: function () { console.log('no') }
          }, {
            label: '确定',
            type: 'primary',
            onClick: function () {
              self.loading = true
              self.axios({
                methods: 'post',
                url: '/subscribe',
                params: {
                  open_id: localStorage.getItem('open_id'),
                  apartment_id: self.$store.state.apartment_id,
                  room_name: self.$store.state.building + '-' + self.$store.state.room,
                  threshold: self.radio
                }

              }).then(function (res) {
                self.loading = false
                if (res.data.code === 200) {
                  weui.toast('关注成功', {
                    duration: 3000,
                    className: 'success',
                    callback: function () { console.log('close') }
                  })
                  // 储存宿舍的必要信息
                  localStorage.setItem('district', self.$store.state.district)
                  localStorage.setItem('apartment_id', self.$store.state.apartment_id)
                  localStorage.setItem('building', self.$store.state.building)
                  localStorage.setItem('room', self.$store.state.room)
                  localStorage.setItem('dormitory_name', self.$store.state.dormitory_name)
                } else if (res.data.code === 1003) {
                  weui.alert('关注宿舍失败，不存在该宿舍', {
                    title: '关注失败',
                    buttons: [{
                      label: '确定',
                      type: 'primary',
                      onClick: function () { console.log('ok') }
                    }]
                  })
                } else if (res.data.code === 1005) {
                  weui.alert('关注宿舍失败，已关注过该宿舍', {
                    title: '关注失败',
                    buttons: [{
                      label: '确定',
                      type: 'primary',
                      onClick: function () { console.log('ok') }
                    }]
                  })
                } else {
                  weui.alert('关注宿舍失败，发生异常了', {
                    title: '关注失败',
                    buttons: [{
                      label: '确定',
                      type: 'primary',
                      onClick: function () { console.log('ok') }
                    }]
                  })
                }
              }).catch(function (error) {
                self.loading = false
                console.log(error)
                weui.alert('关注宿舍失败，发生异常了', {
                  title: '关注失败',
                  buttons: [{
                    label: '确定',
                    type: 'primary',
                    onClick: function () { console.log('ok') }
                  }]
                })
              })
            }
          }]
        })
      } else {
        weui.topTips('请选择苑区或填写宿舍号！', {
          duration: 3000,
          className: 'tip',
          callback: function () { console.log('close') }
        })
      }
    }

  }

}
</script>

<style scoped>

  .blue{
    background-color: #4ea3ee;
    color: #fff;
    font-size: 30px;
    width: 649px;
    height: 90px;
    line-height: 90px;
    letter-spacing: 16px;
    border-radius: 10px;
  }
  .weui-cells{
    margin-bottom: 96px;
    box-shadow: 0 0 10px #dadada;

  }
  .weui-cell{
    height: 96px;
    font-size: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .weui-cell:before{
    border-color: #dcdcdc;
  }
  .weui-label{
    text-align: left;
    color: #050505;
  }
  ::-moz-placeholder { color: #bfbfbf; }
  ::-webkit-input-placeholder { color:#bfbfbf; }
  :-ms-input-placeholder { color:#bfbfbf; }
  .marginRight{
    text-indent: 50px;
  }
  .selected{
    text-indent: 50px;
    height: 100%;
    padding-right: 30px;
    text-align: left;
  }
  .weui-cell__ft:after{
    height: 16px;
    width: 16px;
    margin-top: -8px;
    right: 15px;
    content:''
  }
  .noPadding{
    padding: 0;
    width: 100%;

  }
  .weui-cell__hd .widthAuto{
    width: auto !important;
  }
  .weui-cell__bd{
    text-align: left;
  }
  .chooseHow{
    margin-left: 32px;
    width:414px !important;
  }
  .marginTop{
    margin-top:30px;
  }
  .addHeight{
    height: 140px;
    padding-bottom: 40px;
  }

</style>
