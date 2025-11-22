import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: () => import('@/pages/Home.vue') },
        { path: 'gallery', component: () => import('@/pages/Gallery.vue') }
      ]
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: 'login', component: () => import('@/pages/Login.vue') },
        { path: 'register', component: () => import('@/pages/Register.vue') }
      ]
    },
    {
      path: '/',
      component: DashboardLayout,
      children: [
        { path: 'generate', component: () => import('@/pages/Generate.vue') },
        { path: 'profile', component: () => import('@/pages/UserCenter.vue') }
      ]
    }
  ]
})

export default router
