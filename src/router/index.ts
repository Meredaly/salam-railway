import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { useAuth } from '@/store/auth'
const routes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      meta: {
        roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
      }
    },
    ...routes
  ]
})

router.beforeEach(async (to, from, next) => {
  to
  from

  const auth = useAuth()
  if (to.path === '/login') {
    next()
    return
  }
  if (!auth.isAuth) {
    await auth.getProfile()
  }

  if ((to.meta?.roles as string[])?.includes(auth.getUser.role)) {
    next()
  } else {
    next('/login')
  }
})

export default router
