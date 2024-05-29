const Module = () => import('./Module.vue')

const Dashboard = () => import('./pages/Dashboard.vue')

const moduleRoute = {
  path: '/dashboard',
  component: Module,
  meta: {
    roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
  },
  children: [
    {
      path: '',
      component: Dashboard,
      meta: {
        roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
      }
    },
    {
      path: 'pages',
      component: Module,
      meta: {
        roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
      },
      children: [
        {
          path: ':id',
          component: Dashboard,
          meta: {
            roles: ['ROLE_ADMIN', 'ROLE_LOGIST']
          }
        }
      ]
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
