import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/about', name: 'about', component: () => import('../pages/AboutPage.vue') },
    { path: '/catalog', name: 'catalog', component: () => import('../pages/CatalogPage.vue') },
    { path: '/catalog/:slug', name: 'product', component: () => import('../pages/ProductPage.vue') },
    { path: '/process', name: 'process', component: () => import('../pages/ProcessPage.vue') },
    { path: '/digital-catalog', name: 'digital-catalog', component: () => import('../pages/DigitalCatalogPage.vue') },
    { path: '/digital-catalog/:slug', name: 'digital-product', component: () => import('../pages/DigitalProductDetail.vue') },
    { path: '/constructor', name: 'constructor', component: () => import('../pages/ConstructorPage.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('../pages/CheckoutPage.vue') },
  ],
})

export default router
