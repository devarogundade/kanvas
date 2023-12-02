import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GamesView from '../views/GamesView.vue'
import TemplatesView from '../views/TemplatesView.vue'
import TemplateView from '../views/TemplateView.vue'
import CreateView from '../views/CreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/games',
      name: 'games',
      component: GamesView
    },
    {
      path: '/games/:id',
      name: 'game',
      component: TemplatesView
    },
    {
      path: '/games/create',
      name: 'game-create',
      component: CreateView
    },
    {
      path: '/games/:id/template',
      name: 'template',
      component: TemplateView
    }
  ]
})

export default router
