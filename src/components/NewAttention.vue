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
            <input class="weui-input marginRight" @blur="handleBlur" v-model="room1"   maxlength="3"  type="tel"  placeholder="如505"/>
          </div>
        </div>
        <div class="weui-cell addHeight">
          <div class="weui-cell__hd">
            <label for="" style=" margin-top: -20px;" class="weui-label top widthAuto">余额提醒</label>
          </div>
          <div class="weui-cell__bd marginTop">
            <van-radio-group v-model="radio">
              <div class="weui-flex marginBottom chooseHow">
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
              <div class="weui-flex  chooseHow">
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
//import 'vant/lib/vant-css/icon-local.css'
import axios from 'axios'
import {errorHandler} from '../common/errorHandler.js'
import {commonAlert,zhaoxinAlert} from '../common/commonFun.js'
import {scrollTo} from '../utils/scrollSmooth.js'
import {ApiUrl} from '../common/config.js'
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
      loading: false,
      room_name: ''
    }
  },
  computed: {
    room1: {
      get () {
        return this.$store.state.room
      },
      set (value) {
        this.$store.commit('updateRoom', value)
        localStorage.setItem('room', value)
        // this.$store.commit('change_room', this.$store.state.some + value)
      }
    }
  },
  methods: {
    handleBlur () {
      scrollTo(0, 1200)
    },
    getDistrict () {
      let self = this
      weui.picker(this.dormitoryData, {
        className: 'ignore',
        container: 'body',
        defaultValue: [1, 1, 1],
        onChange: function (result) {
        },
        onConfirm: function (result) {
          console.log(result)
          self.$store.commit('change_some', result[2].label)
          localStorage.setItem('some', result[2].label)
          // self.$store.commit('changeBuilding', result[2].value)
          self.$store.commit('change_dormitory_name', result[1].label)
          self.$store.commit('changeDistrict', result[0].label + result[2].label)
          // 公寓id
          self.$store.commit('changeId', result[2].value)

          localStorage.setItem('district', result[0].label + result[2].label)
          localStorage.setItem('apartment_id', result[2].value)
          localStorage.setItem('dormitory_name', result[1].label)
        },
        id: 'doubleLinePicker'
      })
    },
    findBalance () {
      let self = this
      let result = this.axios({
        method: 'get',
        url: ApiUrl + '/balance',
        headers: {
          token: self.$store.state.token
        },
        params: {
          buildno: self.$store.state.apartment_id,
          roomno: self.$store.state.room
        }
      })
      return result
    },
    newAttention () {
      let self = this
      if (this.$store.state.room !== '' && this.$store.state.district !== '') {
        let result = this.findBalance()
        self.loading = true
        result.then((res) => {
          if (res.data.error === 0) {
            if (res.data.data.power === '0.01' && res.data.data.water === '0.01') {
              self.loading = false
              commonAlert('关注宿舍失败', '该宿舍不存在')
            } else {
              // weui.confirm('当关注目标宿舍的水费或电费低于设定值将会通过微信推送提醒给您', {
              //   title: '确定关注',
              //   buttons: [{
              //     label: '取消',
              //     type: 'default',
              //     onClick: function () { console.log('no') }
              //   }, {
              //     label: '确定',
              //     type: 'primary',
              //     onClick: function () {
              axios({
                method: 'post',
                url: ApiUrl + '/star',
                headers: {
                  token: self.$store.state.token
                },
                data: {
                  buildno: self.$store.state.apartment_id,
                  roomno: self.$store.state.room,
                  room: self.$store.state.some + self.$store.state.room,
                  threshold: self.radio
                }

              }).then(function (res) {
                self.loading = false
                if (res.data.error === 0) {
                  weui.toast('关注成功', {
                    duration: 800,
                    className: 'success',
                    callback: function () { console.log('close') }
                  })
                  // 储存宿舍的必要信息
                  // localStorage.setItem('building', self.$store.state.building)
                  // localStorage.setItem('full_name', self.$store.state.full_name)
                } else {
                  errorHandler(res.data.error, (errorMsg) => {
                    if (res.data.error === 1002) {
                      self.$toast(errorMsg)
                    } else if (res.data.error === 1005) {
                      // 已经关注过该宿舍,询问是否覆盖
                      weui.confirm('已关注过该宿舍,可继续修改余额提醒，是否修改', {
                        title: '确定修改',
                        buttons: [{
                          label: '取消',
                          type: 'default',
                          onClick: () => { console.log('no') }
                        }, {
                          label: '确定',
                          type: 'primary',
                          onClick: () => {
                            axios({
                              method: 'put',
                              url: ApiUrl + '/star',
                              headers: {
                                token: self.$store.state.token
                              },
                              data: {
                                threshold: self.radio,
                                star_id: res.data.data
                              }
                            }).then((res) => {
                              if (res.data.error === 0) {
                                weui.toast('修改成功', {
                                  duration: 800,
                                  className: 'success',
                                  callback: function () { console.log('close') }
                                })
                              } else {
                                errorHandler(res.data.error, (errorMsg) => {
                                  if (res.data.error === 1002) {
                                    self.$toast(errorMsg)
                                  } else {
                                    commonAlert('修改失败', errorMsg)
                                  }
                                })
                              }
                            }).catch((error) => {
                              console.log(error)
                            })
                          }
                        }]
                      })
                    } else {
                      commonAlert('关注宿舍失败', errorMsg)
                    }
                  })
                }
              }).catch(function (error) {
                self.loading = false
                console.log(error)
                commonAlert('关注宿舍失败', '未知异常')
              })
              //     }
              //   }]
              // })
            }
          } else {
            self.loading = false
            errorHandler(res.data.error, (errorMsg) => {
              if (res.data.error === 1002) {
                self.$toast(errorMsg)
              } else {
                commonAlert('验证宿舍失败', errorMsg + ',请重试')
              }
            })
          }
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
    height: 190px;
    padding-bottom: 50px;
  }
  .marginBottom{
    margin-bottom: 40px;
  }

</style>
