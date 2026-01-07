const routes = [
  {
    path: '/',
    component: () => import('src/layouts/appLayout.vue'),
    meta: {
      auth: 'required',
      title: ''
    },
    children: [
      {
        path: 'home',
        name: 'rtHome',
        component: () => import('src/components/app/home/homeComponent.vue'),
        meta: {
          auth: 'required',
          application: 'DASHBOARD'
        }
      }
    ]
  },
  {
    path: '/mag',
    component: () => import('src/layouts/appLayout.vue'),
    meta: {
      auth: 'required',
      title: ''
    },
    children: [
      {
        path: 'magInv',
        name: 'rtMagInv',
        component: () => import('src/components/app/mag/magInv/magInvComponent.vue'),
        meta: {
          auth: 'required',
          application: 'MAG_INV'
        }
      },
      {
        path: 'whInbound',
        name: 'rtWhInbound',
        component: () => import('src/components/app/mag/whInbound/whInboundComponent.vue'),
        meta: {
          auth: 'required',
          application: 'WH_INBOUND'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('src/layouts/loginLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'rtLogin',
        component: () => import('src/components/auth/loginComponent.vue'),
        meta: {
          auth: 'without',
          title: ''
        }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
