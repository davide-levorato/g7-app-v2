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
    name: 'Qlt',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-medal',
    label: 'Qualità',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [{
      name: 'Qlt01',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}],
      application: 'QLT_TRC_MP',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtQlt001' },
      action: {}
    }]
  },
  {
    name: 'Coge',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-store',
    label: 'Commerciale',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [{
      name: 'Com01',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'COM_BDG_ITEMS'}],
      application: 'COM_BDG_ITEMS',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCom001' },
      action: {}
    }, {
      name: 'Com02',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'COM_BDG_ITEM'}],
      application: 'COM_BDG_ITEM',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCom002' },
      action: {}
    }, {
      name: 'Com03',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'COM_BDG_CUSTOMER'}],
      application: 'COM_BDG_CUSTOMER',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCom003' },
      action: {}
    } ]
  },
  {
    name: 'Comm',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-tower-control',
    label: 'Controllo di Gestione',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [
    {
      name: 'Coge001',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'CG_PRO_BIL',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCoge001' },
      action: {}
    },
    {
      name: 'Coge002',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'CG_CST_MPI',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCoge002' },
      action: {}
    },
    {
      name: 'Coge005',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'CG_CST_MON',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCoge005' },
      action: {}
    },
    {
      name: 'Coge003',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PROD_PAR'}],
      application: 'CG_PROD_PAR',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCoge003' },
      action: {}
    },
    {
      name: 'Coge004',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_CST_MPI'}],
      application: 'CG_CST_PF',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCoge004' },
      action: {}
    },
    {
      name: 'Coge004b',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_CST_MPI'}],
      application: 'CG_CST_PF_CLI',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtCoge004b' },
      action: {}
    }
  ]
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
    items: [{
      name: 'Sped001',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'VEN_SPED_STATUS',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMag003' },
      action: {}
    }, {
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
    }, {
      name: 'Mag004',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'MAG_INV'}],
      application: 'MAG_PALLET_BUILD',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMag004' },
      action: {}
    }, {
      name: 'Mag005',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'MAG_CHECK'}],
      application: 'MAG_CHECK',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMag005' },
      action: {}
    }, {
      name: 'Mag006',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'MAG_SSCC'}],
      application: 'MAG_SSCC',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMag006' },
      action: {}
    }, {
      name: 'Mag008',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'MAG_SSCC'}],
      application: 'WMS_WAREHOUSE_MAPS',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMag108' },
      action: {}
    }, {
      name: 'Mag009',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'MAG_SSCC'}],
      application: 'MAG_LOG_DATA',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtMag008' },
      action: {}
    }]
  },
  {
    name: 'Ven',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-truck-fast',
    label: 'Vendite/Spedizioni',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [{
      name: 'VenSped01',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'VEN_SPED',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtVen001' },
      action: {}
    }]
  },
  {
    name: 'Prod',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-industry-windows',
    label: 'Produzione',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [{
      name: 'Prod001',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'PRD_PLAN',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtProd001' },
      action: {}
    },
    /* {
      name: 'Prod002',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'PRD_SCHEDULE',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtProd002' },
      action: {}
    }, */
    {
      name: 'Prod003',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'PRD_MAN_ORDERS',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtProd003' },
      action: {}
    },
    {
      name: 'Prod004',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'PRD_MON',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtProd004' },
      action: {}
    },
    {
      name: 'Prod005',
      type: 'mi',
      userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'CG_PRO_BIL'}],
      application: 'PRD_BDG',
      visible: {
        miniMode: true,
        normalMode: true
      },
      route: { name: 'rtProd005' },
      action: {}
    }
  ]
  },
  {
    name: 'Stats',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'all'}],
    application: '',
    icon: 'fal fa-database',
    label: 'Statistiche',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [
      {
        name: 'Stats001',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'ST_YEAR_PERIOD'}],
        application: 'ST_YEAR_PERIOD',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtStats001' },
        action: {}
      },
      {
        name: 'ven-bi',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'ST_VEN_BI'}],
        application: 'ST_VEN_BI',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtSTAVenBI' },
        action: {}
      },
      {
        name: 'ven-map',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'ST_VEN_MAP'}],
        application: 'ST_VEN_MAP',
        icon: 'fal fa-earth-europe',
        label: 'Map vendite mondo',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtSTAVenMapW' },
        action: {}
      },
      {
        name: 'ven-map-i',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}, {r: 'U', a:'ST_VEN_MAP'}],
        application: 'ST_VEN_MAP',
        icon: 'fal fa-map-pin',
        label: 'Map vendite italia',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtSTAVenMapI' },
        action: {}
      }
    ],
    route: {},
    action: {}
  },
  /*
  admin section
  */
  {
    name: 'Admin',
    type: 'ei',
    userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}],
    application: '',
    icon: 'fal fa-gears',
    label: 'Admin',
    visible: {
      miniMode: true,
      normalMode: true
    },
    items: [
      {
        name: 'gruppi',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}],
        application: 'ADM_GROUPS',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtAdmGroups' },
        action: {}
      }, {
        name: 'Utenti',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}],
        application: 'ADM_USERS',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtAdmUsers' },
        action: {}
      }, {
        name: 'Schedulazione jobs',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}],
        application: 'ADM_SCHEDULER',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtAdmScheduler' },
        action: {}
      }, {
        name: 'Column editor',
        type: 'mi',
        userRoles: [{r: 'SA', a:'all'}, {r: 'A', a:'all'}],
        application: 'ADM_COLUMN_EDITOR',
        visible: {
          miniMode: true,
          normalMode: true
        },
        route: { name: 'rtAdmColEd' },
        action: {}
      }
    ],
    route: {},
    action: {}
  },
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

