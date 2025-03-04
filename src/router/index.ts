import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const isAuthenticated = () => !!localStorage.getItem("authToken"); // Example authentication check

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },
      {
        name: 'management',
        path: '/management',
        component: RouteViewComponent,
        children: [
          {
            name: 'users',
            path: 'users',
            component: () => import('../pages/users/UsersPage.vue'),
          },
          {
            name: 'projects',
            path: 'projects',
            component: () => import('../pages/projects/ProjectsPage.vue'),
          }
        ]
      },
      {
        name: 'faq',
        path: '/faq',
        component: () => import('../pages/faq/FaqPage.vue'),
      },
      {
        name: 'catalog',
        path: '/catalog',
        component: () => import('@/pages/catalog/CatalogPage.vue'),
      },
      {
        name: "application-details",
        path: "catalog/applications/:id",
        component: () => import("@/pages/applications/ApplicationDetails.vue")
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        meta: { public: true },
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'logout',
        path: 'logout',
        meta: { public: true },
        component: () => import('../pages/auth/Logout.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        meta: { public: true },
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        meta: { public: true },
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        meta: { public: true },
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        meta: { public: true },
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  if (to.meta.public === true) {
    next();
  } else if (isAuthenticated()) {
    next();
  } else {
    next('/auth/login')
  }
});


export default router;
