import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '',
          name: 'main',
          component: () => import('./components/Main.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('./views/Users.vue')
        },
        {
          path: 'equipments',
          name: 'equipments',
          component: () => import('./views/Equipments.vue')
        },
        {
          path: 'places',
          name: 'places',
          component: () => import('./views/Places.vue')
        }
      ]
    },
  ]
})
