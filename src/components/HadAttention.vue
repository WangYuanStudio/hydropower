<template>
  <ul class="ul-total">
    <li class="attention-info" v-for="(item,index) in data" :key="index">
      <van-icon name="delete" color="#4ea3ee" class="move" @click="deleteItem(index)"  />
      <van-icon name="wap-home" color="#c8c8c8" class="changeStlye"  />
      {{item.room}}
      <p>
        当余额低于 <span class="blueColor">{{item.threshold}}</span> 元时发出充值提醒
      </p>
    </li>
  </ul>
</template>

<script>

import 'weui'
import weui from 'weui.js'
export default {
  name: 'HadAttemtion',
  data () {
    return {
      show: true,
      data: ''
    }
  },
  methods: {
    deleteItem (index) {
      let self = this
      weui.confirm('取消关注后将不再收到有关水电余额的推送提醒', {
        title: '确定取消关注',
        buttons: [{
          label: '取消',
          type: 'default',
          onClick: function () { console.log('no') }
        }, {
          label: '确定',
          type: 'primary',
          onClick: function () {
            self.axios({
              methods: 'DELETE',
              url: 'subscribe',
              params: {
                open_id: localStorage.getItem('open_id'),
                subscribe_id: index
              }
            }).then(function (res) {
              if (res.data.code === 200) {
                self.$delete(self.data, index)
                weui.toast('取消关注成功', {
                  duration: 3000,
                  className: 'success',
                  callback: function () { console.log('close') }
                })
              } else {
                weui.alert('没有已关注的宿舍或发生异常了', {
                  title: '查询失败',
                  buttons: [{
                    label: '确定',
                    type: 'primary',
                    onClick: function () { console.log('ok') }
                  }]
                })
              }
            }).catch(function (error) {
              weui.alert('不存在的关注事件编号或发生异常了', {
                title: '查询失败',
                buttons: [{
                  label: '确定',
                  type: 'primary',
                  onClick: function () { console.log('ok') }
                }]
              })
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
        url: '/subscribe',
        params: {
          open_id: localStorage.getItem('open_id')
        }
      }).then(function (res) {
        if (res.data.code === 200) {
          self.data = res.data.data
          for (let x in self.data) {
            self.data[x].room = self.data[x].room.replace(/-/g, '栋')
          }
        } else {
          weui.alert('发生异常了', {
            title: '查询失败',
            buttons: [{
              label: '确定',
              type: 'primary',
              onClick: function () { console.log('ok') }
            }]
          })
        }
      }).catch(function (error) {
        weui.alert('发生异常了', {
          title: '查询失败',
          buttons: [{
            label: '确定',
            type: 'primary',
            onClick: function () { console.log('ok') }
          }]
        })
        console.log(error)
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped>
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
