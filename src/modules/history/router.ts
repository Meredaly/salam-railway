const Module = () => import('./Module.vue')

const History = () => import('./pages/History.vue')

const moduleRoute = {
  path: '/history',
  component: Module,
  roles: ['ROLE_ADMIN', 'ROLE_LOGIST'],
  children: [
    {
      path: '',
      component: History,
      meta: {
        roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
      }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
