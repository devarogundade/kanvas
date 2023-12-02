import { createRouter, createWebHistory } from 'vue-router'
import KanvasView from '../KanvasView.vue'
import HomeView from '../views/HomeView.vue'
import GamesView from '../views/GamesView.vue'
import TemplatesView from '../views/TemplatesView.vue'
import TemplateView from '../views/TemplateView.vue'
import CreateView from '../views/CreateView.vue'

import GameView from '../rockpaperscissors/GameView.vue'
import ResultView from '../rockpaperscissors/ResultView.vue'

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
      name: 'kanvas',
      component: KanvasView,
      children: [
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
    },
    {
      path: '/rockpaperscissors',
      name: 'rockpaperscissors',
      component: GameView
    },
    {
      path: '/rockpaperscissors/result',
      name: 'rockpaperscissors-result',
      component: ResultView
    }
  ]
})

export default router
