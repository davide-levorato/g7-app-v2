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
      },
      {
        path: 'whProdSupply',
        name: 'rtWhProdSupply',
        component: () => import('src/components/app/mag/whProdSupply/whProdSupplyComponent.vue'),
        meta: {
          auth: 'required',
          application: 'WH_PROD_SUPPLY'
        }
      },
      {
        path: 'whMov',
        name: 'rtWhMov',
        component: () => import('src/components/app/mag/whMov/whMovComponent.vue'),
        meta: {
          auth: 'required',
          application: 'WH_MOV'
        }
      }
    ]
  },
  {
    path: '/mkt',
    component: () => import('src/layouts/appLayout.vue'),
    meta: {
      auth: 'required',
      title: ''
    },
    children: [
      {
        path: 'contacts',
        name: 'rtMktContacts',
        component: () => import('src/components/app/mkt/contacts/mktContactsComponent.vue'),
        meta: {
          auth: 'required',
          application: 'MKT_CONTACTS'
        }
      }
    ]
  },
  {
    path: '/prd',
    component: () => import('src/layouts/appLayout.vue'),
    meta: {
      auth: 'required',
      title: ''
    },
    children: [
      {
        path: 'scar',
        name: 'rtPrdScar',
        component: () => import('src/components/app/prd/prdScar/prdScarComponent.vue'),
        meta: {
          auth: 'required',
          application: 'PRD_SCAR'
        }
      },
      {
        path: 'scar',
        name: 'rtPrdScarRet',
        component: () => import('src/components/app/prd/prdScarRet/prdScarRetComponent.vue'),
        meta: {
          auth: 'required',
          application: 'PRD_SCAR_RET'
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
