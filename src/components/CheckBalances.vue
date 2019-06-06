<template>
  <div>
    <div class="header">
      查询余额
    </div>
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
          <input class="weui-input marginRight" @blur="handleBlur" v-on:focus="hidden" v-model="room1" minlength="3" maxlength="3"  placeholder="如505"/>
        </div>
      </div>
    </div>
    <div class="button-sp-area">
      <button @click="findBalance" class="weui-btn blue weui-btn_loading"><i v-if="loading" class="weui-loading"></i>查询</button>
    </div>
    <!-- <div v-if="show" class="showInfo paddingLeft">
      <p>
        {{this.$store.state.some+this.$store.state.room}}
      </p>
      <p>剩余水费：{{water}}元</p>
      <p>剩余电费：{{power}}元</p>
    </div> -->
  </div>
</template>

<script>

import 'weui'
import weui from 'weui.js'
import {errorHandler} from '../common/errorHandler.js'
import {commonAlert} from '../common/commonFun.js'
import {scrollTo} from '../utils/scrollSmooth.js'
import {ApiUrl} from '../common/config.js'
export default {
  name: 'CheckBalances',
  props: {
    dormitoryData: {
      require: true
    }
  },
  components: {

  },
  data () {
    return {
      // district: '', // 苑区
      // apartment_id: null,
      // room_name: null,
      // room: '',
      water: null,
      electric: null,
      loading: false,
      show: false,
      // building: '',
      room_name: ''
      // dormitory_name: ''
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
        // this.$store.commit('full_name', this.$store.state.some + value)
      }
    }
  },
  methods: {
    handleBlur () {
      scrollTo(0, 1200)
    },
    getDistrict () {
      let self = this
      self.show = false
      weui.picker(this.dormitoryData, {
        className: 'ignore',
        container: 'body',
        defaultValue: [1, 1, 1],
        onChange: function (result) {
        },
        onConfirm: function (result) {
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
      if (this.$store.state.room !== '' && this.$store.state.district !== '') {
        this.loading = true
        this.axios({
          method: 'get',
          url: ApiUrl + '/balance',
          headers: {
            token: self.$store.state.token
          },
          params: {
            buildno: self.$store.state.apartment_id,
            roomno: self.$store.state.room
          }
        }).then(function (res) {
          self.loading = false
          // 储存宿舍的必要信息
          // localStorage.setItem('district', self.$store.state.district)
          // localStorage.setItem('apartment_id', self.$store.state.apartment_id)
          // localStorage.setItem('building', self.$store.state.building)
          // localStorage.setItem('room', self.$store.state.room)
          // localStorage.setItem('dormitory_name', self.$store.state.dormitory_name)
          // localStorage.setItem('full_name', self.$store.state.full_name)
          if (res.data.error === 0) {
            if (res.data.data.water === '0.01' && res.data.data.water === '0.01') {
              commonAlert('查询失败', '该宿舍不存在')
            } else {
              self.show = true
              self.water = res.data.data.water
              self.power = res.data.data.power
              commonAlert('余额', '电费: ￥' + res.data.data.power + '<br>' +
                                  '水费: ￥' + res.data.data.water
              )
            }
          } else {
            errorHandler(res.data.error, (errorMsg) => {
              if (res.data.error === 1002) {
                self.$toast(errorMsg)
              } else {
                commonAlert('查询失败', errorMsg)
              }
            })
          }
        }).catch(function (error) {
          console.log(error)
          self.loading = false
        })
      } else {
        weui.topTips('请选择苑区或填写宿舍号！', {
          duration: 3000,
          className: 'tip',
          callback: function () { console.log('close') }
        })
      }
    },
    hidden () {
      this.show = false
    }

  },
  created () {

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
  text-indent: 30px;
}
.selected{
  text-indent: 30px;
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
.paddingLeft{
  padding-left: 15px;
}

.showInfo{
  padding-top: 70px;
  color: #e92f2f;
  font-size: 30px;
  text-align: left;
}
.header{
  height: 96px;
  line-height: 96px;
  text-align: center;
  font-size: 32px;
  box-shadow: 0 0 10px #dadada;
  margin-bottom: 50px;
}

</style>
