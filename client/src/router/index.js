import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/edit-link/:id',
      name: 'edit-link',
      // uses lazy load as this does not need to be loaded immediately
      component: () => import('@/views/EditLinkView.vue')
    },
    {
      path: '/404',
      name: '404',
      // uses lazy load as this does not need to be loaded immediately
      component: () => import('@/views/404View.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('@/views/404View.vue'),
    }
  ]
})

export default router
