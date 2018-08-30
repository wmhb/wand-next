import Vue from 'vue'
import Router from 'vue-router'

import Store from '@/store'

// const Wand = () => import('@/views/Wand')
const Admin = () => import(/* webpackChunkName: "group-admin" */ '@/views/Admin')
const Login = () => import(/* webpackChunkName: "group-admin" */ '@/views/Login')

const Tweets = () => import('@/views/Tweets')
const Supporter = () => import('@/views/Supporter')
const Speakers = () => import('@/views/Speakers')
const Next = () => import('@/views/Next')
const Playing = () => import('@/views/Playing')

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!Store.getters.isAuthenticated) {
    next()
    return
  }
  next('/admin')
}

const ifAuthenticated = (to, from, next) => {
  if (Store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

const getActiveRoute = () => {
  const currActive = Store.getters.slides.active
  const activeRoute = (currActive && currActive !== 'login') ? currActive : 'tweets'
  return activeRoute
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Tweets,
      redirect: getActiveRoute()
    },
    {
      path: '/tweets',
      name: 'tweets',
      component: Tweets
    },
    {
      path: '/speakers/:id',
      name: 'speakers',
      component: Speakers
    },
    {
      path: '/speakers',
      redirect: '/speakers/0'
    },
    {
      path: '/supporter',
      name: 'supporter',
      component: Supporter
    },
    {
      path: '/next',
      name: 'next',
      component: Next
    },
    {
      path: '/playing',
      name: 'playing',
      component: Playing
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: ifAuthenticated
    }
  ]
})
