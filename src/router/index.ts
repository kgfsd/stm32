import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DeviceControl from '../views/DeviceControl.vue'
import CommandControl from '../views/CommandControl.vue'
import Messages from '../views/Messages.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/device',
      name: 'device',
      component: DeviceControl
    },
    {
      path: '/command',
      name: 'command',
      component: CommandControl
    },
    {
      path: '/message',
      name: 'message',
      component: Messages
    }
  ]
})

export default router