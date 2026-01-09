/*
user roles:
  A   ->  admin
  U   ->  normal user

applications:

type:
  ei  ->  expansion item
  mi  ->  menu item
  sp  ->  separator
*/
const APP_MENU = [
  {
    name: 'Dashboard',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: 'DASHBOARD',
    icon: 'fal fa-gauge-high',
    label: 'Dashboard',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [
      {
        name: 'Principale',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'DASHBOARD'}],
        application: 'DASHBOARD',
        label: 'Principale',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtMain', params: { id: 0 } },
        action: {}
      },
      {
        name: 'DASHBOARDS',
        application: 'DASHBOARD',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'DASHBOARD'}],
        type: 'DASHBOARDS',
        label: '',
        caption: '',
        tip: '',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtMain' }
      }
    ],
    route: {},
    action: {}
  },
  {
    name: 'Log',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-forklift',
    label: 'Logistica',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [/* {
      name: 'Mag002',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'MAG_INV'}],
      application: 'MAG_INV',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMagInv' },
      action: {}
    }, */ {
      name: 'Mag100',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'WH_INBOUND'}],
      application: 'WH_INBOUND',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtWhInbound' },
      action: {}
    }, {
      name: 'Mag110',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'WH_PROD_SUPPLY'}],
      application: 'WH_PROD_SUPPLY',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtWhProdSupply' },
      action: {}
    }
    ]
  },
  /* {
    name: 'Mkt',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-bulhorn',
    label: 'Marketing',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [{
      name: 'Mkt001',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'MKT_CONTACTS'}],
      application: 'MKT_CONTACTS',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMktContacts' },
      action: {}
    }]
  }, */
  {
    name: 'logout',
    type: 'mi',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    visible: {
      miniMode: true,
      normalMode: true
    },
    label: 'Esci',
    icon: 'fal fa-sign-out',
    route: { name: 'rtLogout' },
    action: { name: 'logout' }
  }
]
export { APP_MENU }
