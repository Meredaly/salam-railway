const Module = () => import('./Module.vue')

const Accounts = () => import('./pages/Accounts.vue')

const moduleRoute = {
  path: '/accounts',
  component: Module,
  roles: ['ROLE_ADMIN'],
  children: [
    {
      path: '',
      component: Accounts,
      meta: {
        roles: ['ROLE_ADMIN']
      }
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
