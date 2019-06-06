<template>
  <ul class="ul-total">
    <li class="attention-info" v-for="(item,index) in data" :key="index" >
      <van-icon name="delete" color="#4ea3ee" class="move" @click="deleteItem(item.id,index)"  />
      <div class="marginRight"  @click="changeThreshold(item.id,item.threshold,index)">
        <van-icon name="wap-home" color="#c8c8c8" class="changeStlye"  />
        {{item.room}}
        <p class="addTop" >
          当余额低于 <span class="blueColor">{{item.threshold}}</span> 元时发出充值提醒
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
import 'weui'
import {thresholdData} from '../../data.js'
import weui from 'weui.js'
import {errorHandler} from '../common/errorHandler.js'
import {commonAlert} from '../common/commonFun.js'
import {ApiUrl} from '../common/config.js'
export default {
  name: 'HadAttemtion',
  data () {
    return {
      show: true,
      data: ''
    }
  },
  methods: {
    deleteItem (id, index) {
      let self = this
      weui.confirm('取消关注后将不再收到有关水电余额的推送提醒', {
        title: '确定取消关注',
        buttons: [{
          label: '取消',
          type: 'default',
          onClick: () => { console.log('no') }
        }, {
          label: '确定',
          type: 'primary',
          onClick: () => {
            self.axios({
              method: 'DELETE',
              url: ApiUrl + '/star/' + id,
              headers: {
                token: self.$store.state.token
              }
            }).then((res) => {
              if (res.data.error === 0) {
                // self.fetchData()
                this.data.splice(index, 1)
                weui.toast('取消关注成功', {
                  duration: 800,
                  className: 'success',
                  callback: function () { console.log('close') }
                })
              } else {
                errorHandler(res.data.error, (errorMsg) => {
                  if (res.data.error === 1002) {
                    self.$toast(errorMsg)
                  } else {
                    commonAlert('取消关注失败', errorMsg)
                  }
                })
              }
            }).catch(function (error) {
              commonAlert('取消关注失败', '未知异常')
              console.log(error)
            })
          }
        }]
      })
    },
    fetchData () {
      let self = this
      this.axios({
        method: 'get',
        url: ApiUrl + '/star',
        headers: {
          token: self.$store.state.token
        }
      }).then(function (res) {
        if (res.data.error === 0) {
          self.data = res.data.data
          // for (let x in self.data) {
          //   // self.data[x].room = self.data[x].room.replace(/-/g, '栋')
          // }
        } else {
          errorHandler(res.data.error, (errorMsg) => {
            if (res.data.error === 1002) {
              self.$toast(errorMsg)
            } else {
              commonAlert('获取信息失败', errorMsg)
            }
          })
        }
      }).catch(function (error) {
        commonAlert('获取信息失败', '未知异常')
        console.log(error)
      })
    },
    changeThreshold (id, threshold, index) {
      let self = this
      weui.confirm('确定修改预警余额', {
        title: '确定修改',
        buttons: [{
          label: '取消',
          type: 'default',
          onClick: () => { console.log('no') }
        }, {
          label: '确定',
          type: 'primary',
          onClick: () => {
            weui.picker(thresholdData, {
              className: 'ignore',
              container: 'body',
              defaultValue: [10],
              onChange: (result) => {
              },
              onConfirm: (result) => {
                let newThreshold = result[0].value
                if (newThreshold === threshold) {
                  commonAlert('修改失败', '不能与第一次设置的预警余额相同')
                } else {
                  axios({
                    method: 'put',
                    url: ApiUrl + '/star',
                    headers: {
                      token: self.$store.state.token
                    },
                    data: {
                      threshold: newThreshold,
                      star_id: id
                    }
                  }).then((res) => {
                    if (res.data.error === 0) {
                      this.$set(this.data[index], 'threshold', newThreshold)
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
              },
              id: 'thresholdPicker'
            })
          }
        }]
      })
    }
  },
  created () {
    if (sessionStorage.getItem('isFirst') === null) {
      this.$toast('点击框内文字区域可修改预警余额')
      sessionStorage.setItem('isFirst', 1)
    }
    // weui.topTips('点击可修改预警余额提醒', {
    //   duration: 3000,
    //   className: 'tipHanle',
    //   callback: function () { console.log('close') }
    // })
    this.fetchData()
  }
}
</script>

<style scoped>
  .marginRight{
    margin-right: 130px;
  }
  .addTop{
    margin-top:10px
  }
  .attention-info{
    width: 653px;
    height: 156px;
    padding: 28px;
    border: 2px solid #d2d2d2;
    margin: 0 auto;
    border-radius: 10px;
    box-sizing: border-box;
    text-align: left;
    font-size: 28px;
    position: relative;
    margin-bottom: 54px;
  }
  .blueColor{
    color: #4ea3ee;
  }
  .move{
    position: absolute;
    right: 28px;
    top:54px;
    font-size: 32px;
  }
  .ul-total{
    margin-top: -10px;
  }
  .changeStlye{
    font-size: 32px;
    vertical-align: -4px;
  }

</style>
