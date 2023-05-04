import Vue from 'vue'
import VueRouter from 'vue-router'

const LoginPage = () => import('@/components/LoginPage')
const Organizations = () => import('@/components/Organizations/Organizations')
const IncidentPageWrapper = () => import('@/components/Incidents/IncidentPageWrapper')
const Reports = () => import('@/components/Reports/Reports')
const Users = () => import('@/components/Users/Users')
const Actives = () => import('@/components/Actives/Actives')
const NotFoundPage = () => import('@/components/NotFoundPage')
const Bulletins = () => import('@/components/Bulletins/Bulletins')
const PasswordChangePage = () => import('@/components/PasswordChangePage')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/organizations',
    name: 'organizations',
    component: Organizations,
  },
  {
    path: '/incidents/:incidentId?',
    name: 'incidents',
    component: IncidentPageWrapper,
    props: true,
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
  },
  {
    path: '/actives',
    name: 'actives',
    component: Actives,
  },
  {
    path: '/bulletins',
    name: 'bulletins',
    component: Bulletins,
  },
  {
    path: '/password_change',
    name: 'password_change',
    component: PasswordChangePage,
  },
  {
    path: '*',
    name: 'notfound',
    component: NotFoundPage,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_ROUTE_PATH,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({ name: 'incidents' })
  } else {
    next()
  }
})

export default router
