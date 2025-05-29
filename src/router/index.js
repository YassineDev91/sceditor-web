import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Editor from '@/views/Editor.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'), // Lazy-loaded
  },
  {
    path:'/editor',
    name:'Editor',
    component: Editor
  },
  {
    path:'/docs',
    name:'Docs',
    component: () => import('@/views/Docs.vue') // Lazy-loaded
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;