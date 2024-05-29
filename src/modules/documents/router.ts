const Module = () => import('./Module.vue')

const Documents = () => import('./pages/Documents.vue')

const moduleRoute = {
  path: '/documents',
  component: Module,
  meta: {
    roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
  },
  children: [
    {
      path: '',
      component: Documents,
      meta: {
        roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
      }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
