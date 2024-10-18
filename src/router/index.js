import { createRouter, createWebHashHistory } from 'vue-router'
import Temperature from '../views/temperature/temperature.vue'
import DualPoint from '../views/dualPoint/dualPoint.vue'
import Blind from '../views/blind/blind.vue'
import Dashboard from '../views/dashboard/dashboard.vue'
import WorkSpace from '@/components/WorkSpace.vue'

const routes = [
  {
    path: '/',
    component: WorkSpace,
    children:[
      {
        path: '', // 访问根路径时
        redirect: '/temperature' // 重定向到 /temperature
      },
      {
        path: 'temperature',
        component: Temperature
      },
      {
        path: 'dualPoint',
        component: DualPoint
      },
      {
        path: 'blind',
        component: Blind
      },
      {
        path: 'dashboard',
        component: Dashboard
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
