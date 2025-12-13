import { defineStore } from "pinia"
import { LocalStorage } from "quasar"
import _ from "lodash"

export const useApplicationStore = defineStore("application", {
  state: function () {
    const lSt = LocalStorage.getItem('app')
    const locale = _.get(lSt, 'lang', 'itIt')

    return {
      intCurrentRoute: {},

      intDeviceReady: false,

      intLeftDrawerOpen: true,
      intLeftDrawerMini: false,
      intLocale: locale,

      // dati applicazione corrente
      intCurrentApplication: '',
      intApplicationIcon: '',
      intApplicationTitle: '',
      intApplicationBrowserTitle: '',

      // impostazioni di default definite dell'admin
      intCompanySettings: {
        general: {
          showStats: true,
        },
        table: {
          showFilters: true,
          state: {}
        },
        calendar: {
          compactMode: true
        }
      },
      // impostazioni globali definite dall'utente
      intGlobalSettings: { },
      // impostazioni specifiche definite dall'utente per ogni applicazione
      intApplicationSettings: { }
    }
  },
  getters: {
    deviceReady: function(state) {
      return state.intDeviceReady
    },
    currentRoute: function (state) {
      return state.intCurrentRoute
    },
    leftDrawerOpen: function (state) {
      return state.intLeftDrawerOpen
    },
    leftDrawerMini: function (state) {
      return state.intLeftDrawerMini
    },
    locale: function(state) {
      return state.intLocale
    },
    /*
    current application data
    */
    application: function(state) {
      return state.intCurrentApplication
    },
    applicationTitle: function(state) {
      return state.intApplicationTitle
    },
    applicationBrowserTitle: function(state) {
      return state.intApplicationBrowserTitle
    },
    applicationIcon: function(state) {
      return state.intApplicationIcon
    },
    /* ritorna tutte le impostazioni utente, utilizzata nello store per salvare nel backend */
    globalSettings: function(state) {
      return state.intGlobalSettings
    },
    userSettings: function(state) {
      return state.intApplicationSettings
    },
    /* ritorna le impostazioni dell'applicazione corrente */
    applicationSettings: function(state) {
      const globalSettings = _.defaultsDeep(state.intGlobalSettings , state.intCompanySettings)
      const appSettings = _.get(state.intApplicationSettings, state.intCurrentApplication, {})
      return _.defaultsDeep(appSettings, globalSettings)
    },
  },
  actions: {
    setDeviceReady(ready) {
      this.intDeviceReady = ready
    },
    leftDrawerOpenSet(p) {
      this.intLeftDrawerOpen = p
    },
    leftDrawerMiniSet(p) {
      this.intLeftDrawerMini = p
    },
    setLocale (locale) {
      this.intLocale = locale
      LocalStorage.set('app', { lang: locale })
    },
    /* utilizzata nello store per impostare l'applicazione corrente
    */
    initCurrentApplication (applicationName, appIcon, applicationTitle, browserTitle) {
      this.intCurrentApplication = applicationName

      this.intApplicationIcon = appIcon
      this.intApplicationTitle = applicationTitle
      this.intApplicationBrowserTitle = browserTitle
    },
    /* inizializza le impostazioni amministratore
    funzione chiamata dal service store in fase di loading delle impostazioni
    */
    initCompanySettings (settings) {
      this.intCompanySettings = settings
    },
    /* inizializza le impostazioni utente globali
    funzione chiamata dal service store in fase di loading delle impostazioni
    */
    initGlobalSettings (settings) {
      this.intGlobalSettings = settings
    },
    /* inizializza le impostazioni utente per applicazione
    funzione chiamata dal service store in fase di loading delle impostazioni
    */
    initApplicationSettings (settings) {
      this.intApplicationSettings = settings
    },
    /* memorizza le impostazioni dell'applicazione corrente */
    setApplicationSettings (settings) {
      this.intApplicationSettings[this.intCurrentApplication] = settings
    }
  }
})
