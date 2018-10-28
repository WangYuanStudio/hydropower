import Vue from 'vue'
import Router from 'vue-router'
import CheckBalances from '@/components/CheckBalances'
import AttentionDormitory from '@/components/AttentionDormitory'
import NewAttention from '@/components/NewAttention'
import HadAttention from '@/components/HadAttention'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/AttentionDormitory'
    },
    {
      path: '/CheckBalances',
      name: 'CheckBalances',
      component: CheckBalances
    },
    {
      path: '/AttentionDormitory',
      component: AttentionDormitory,
      children: [
        {
          path: '',
          name: NewAttention,
          component: NewAttention
        },
        {
          path: '/AttentionDormitory/HadAttention',
          component: HadAttention
        }
      ]
    }
  ]
})
