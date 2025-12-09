import { defineStore } from "pinia"
import { LocalStorage } from "quasar"
import _ from "lodash"
import { jwtDecode } from 'jwt-decode'

import { apiGetData } from 'api/data'
import { apiLogin, apiLogout, apiRefreshToken, apiGetUserInfo } from 'api/auth'
import { apiSetSettings } from 'api/users'
import { apiValidateToken } from "src/lib/api/auth"
import { getQuery } from "src/lib/api/service"

import axios from 'axios'
const SERVICE_URL = 'https://dev-api-v4.g7gelati.it'
const APPLICATION_VERSION = '0.2.1'

const axiosBase = axios.create({ timeout: 1500000 })
const apiBase = axios.create({ baseURL: SERVICE_URL, timeout: 1500000 })

import { i18n } from 'boot/i18n'
import { useApplicationStore } from "stores/application"

const applicationStore = useApplicationStore()

// Add a response interceptor
apiBase.interceptors.response.use(
  function (response) {
    const rData = _.get(response, 'data', {})
    const r = {};
    r.res = _.get(rData, 'fn.result.status', 'err') === 'ok'
    r.result = _.get(rData, 'fn.result', {})
    r.data = _.get(rData, 'data', {})
    r.count = _.get(rData, 'count', 0)
    r.rows = _.get(rData, 'rows', [])
    return r
  },
  function (error) {
    return Promise.reject(error)
  }
)

export const useServiceStore = defineStore('service', {
  state: function () {
    const lS = LocalStorage.getItem('auth')

    const loggedIn = _.get(lS, 'li', false)
    const token = _.get(lS, 'token', '')
    const decodedToken = { exp: 0 }

    if (token !== '') {
      decodedToken.exp = jwtDecode(token).exp
    }

    return {
      intApiBaseSet: false,
      intAuthToken: token,
      intAuthTokenExp: decodedToken.exp,
      intLoggedIn: loggedIn,
      intUser: {},     // user info

      intApplications: [],  // applications

      intRequests: 0,

      intError: false,  // errore di sistema, viene visualizzato in un banner o in un dialog
      intLastError: { name: '', message: '' },  // errore di sistema, viene visualizzato in un banner o in un dialog

    }
  },
  getters: {
    applicationVersion: function(/* state */) {
      return APPLICATION_VERSION
    },
    authToken: function (state) {
      return state.intAuthToken
    },
    authTokenExp: function (state) {
      return state.intAuthTokenExp
    },
    loggedIn: function (state) {
      return state.intLoggedIn
    },
    user: function (state) {
      return state.intUser
    },
    userSettings: function(state) {
      return state.intSettings
    },
    applications: function (state) {
      return state.intApplications
    },
    applicationName: function (/* state */) {
      return applicationStore.application
    },
    requests: function (state) {
      return state.intRequests;
    },
    error: function (state) {
      return state.intError;
    },
    lastError: function (state) {
      return state.intLastError.message;
    }
  },
  actions: {
    requestGet(endPoint, params, background = false) {
      return new Promise((resolve /*, reject */) => {
        const t = this
        if (!background) { this.requestAdd() }
        axiosBase.get(endPoint, { params: params })
          .then((apiRes) => {
            if (!background) { t.requestSub() }
            resolve(apiRes)
          })
          .catch((err) => {
            console.error(err)
            if (!background) { t.requestSub() }
            /*
            in caso di errore resetto lo stato di autenticazione e imposto errore di sistema
            */
            t.resetAuthentication()
            t.setLastError(err)
            resolve({ res: false, data: {}, count: 0, rows: [], result: { code: err.name, message: err.message, status: err } })
          })
      })
    },

    apiCall(apiPath, p, direct = false, background = false) {
      return new Promise((resolve /*, reject */) => {
        const t = this
        if (!background) { this.requestAdd() }
        const params = direct ? p : getQuery(p)
        apiBase.post(apiPath, params)
          .then((apiRes) => {
            if (!background) { t.requestSub() }
            resolve(apiRes)
          })
          .catch((err) => {
            console.error(err)
            if (!background) { t.requestSub() }
            /*
            in caso di errore resetto lo stato di autenticazione e imposto errore di sistema
            */
            t.resetAuthentication()
            t.setLastError(err)
            resolve({ res: false, data: {}, count: 0, rows: [], result: { code: err.name, message: err.message, status: err } })
          })
      })
    },
    apiDownload(apiPath, p, fileLabel) {
      return new Promise((/* resolve, reject */) => {
        this.requestAdd()
        axios({
          url: SERVICE_URL + '/' + apiPath,
          method: 'POST',
          data: p,
          responseType: 'blob',
          headers: { authorization: this.intAuthToken }
        }).then((response) => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', fileLabel)
          document.body.appendChild(fileLink)
          fileLink.click()
        })
      })
    },
    resetLastError() {
      this.intError = false
      this.intLastError = { name: '', message: '' }
    },
    setLastError(lE) {
      this.intError = true
      this.intLastError.name = _.get(lE, 'name', '')
      this.intLastError.message = _.get(lE, 'message', '')
    },
    requestAdd() {
      this.intRequests++
    },
    requestSub() {
      this.intRequests--
      if (this.intRequests < 0) {
        this.intRequests = 0
      }
    },
    /*
    recupera le info dell'utente se non già inizializzate
    */
    getUserInfo(forceRefresh = false) {
      /* */
      return new Promise((resolve /*, reject */) => {
        if (_.isEmpty(this.intUser) || forceRefresh) {
          const t = this
          this.apiCall(apiGetUserInfo, {}, true).then(function(r) {
            const user = _.get(r, 'data.user', {})
            t.intUser = user

            /* inizializzo le impostazioni utente */
            // applicationStore.initCompanySettings({ name: 'CompanySettings' })
            applicationStore.initGlobalSettings(_.get(user, 'settings.global', {}))
            applicationStore.initApplicationSettings(_.get(user, 'settings.applications', {}))

            /* user settings */
            t.intSettings = user.settings

            if (!t.intSettings.applications) {
              t.intSettings.applications = []
            }

            if (!t.intSettings.printers) {
              t.intSettings.printers = []
            }

            t.apiCall(apiGetData, { obj: 'APPLICATIONS', qB: { s: '', f: {}, p: {}, c: 'all' }}).then(function(r) {
              t.intApplications = _.get(r, 'rows', [])
              resolve(true)
            })
          }).catch((/* err */) => {
            t.intUser = {}
            resolve(false)
          })
        } else {
          resolve(true)
        }
      })
    },
    saveAuthState() {
      LocalStorage.set("auth", {
        li: this.loggedIn,
        token: this.intAuthToken
      })
      // this.setBaseApiToken()
    },
    /* salva le impostazioni nel backend */
    saveSettings(settings) {
      const t = this
      return new Promise((resolve /*, reject */) => {
        this.apiCall(apiSetSettings, { settings: settings }, true).then(function(/* r */) {
          t.intUser.settings = _.merge(t.intUser.settings, settings)
          resolve(true)
        }).catch(function(/* e */) {
          resolve(false)
        })
      })
    },
    /*
    resetta lo stato di autenticazione
    viene chiamata in caso di errore grave o eccezione in una chiamata api
    */
    resetAuthentication() {
      this.intAuthToken = ''
      this.intAuthTokenExp = ''
      this.intLoggedIn = false
      this.intApiBaseSet = false
      this.saveAuthState()
    },
    async login(u) {
      return new Promise((resolve /*, reject */) => {
        const t = this
        this.requestAdd()
        apiBase.post(apiLogin, { username: u.username, password: u.password, locale: u.locale }).then((loginResponse) => {
          t.requestSub()
          if (loginResponse.res) {
            t.intLoggedIn = true
            t.intAuthToken = _.get(loginResponse, 'data.token', '')
            t.intUser = _.get(loginResponse, 'data.user', {})

            const decodedToken = jwtDecode(t.intAuthToken)
            t.intAuthTokenExp = decodedToken.exp

            t.saveAuthState()

            resolve(loginResponse)
          } else {
            resolve(loginResponse)
          }
        })
        .catch((err) => {
          t.requestSub()
          /*
          in caso di errore resetto lo stato di autenticazione e imposto errore di sistema
          */
          t.resetAuthentication()
          t.setLastError(err)
          resolve({ res: false, data: {}, count: 0, rows: [], result: { code: err.name, message: err.message, status: err } })
        })
      })
    },
    async validateToken() {
      return new Promise((resolve /*, reject */) => {
        const t = this
        apiBase.post(apiValidateToken, { }).then((vtResponse) => {
          const vt = _.get(vtResponse, 'data.valid', false)
          if (!vt) {
            t.resetAuthentication()
          }
          resolve(vt)
        })
        .catch((/* err */) => {
          t.resetAuthentication()
          resolve(false)
        })
      })
    },
    async logout() {
      return new Promise((resolve /*, reject */) => {
        const t = this
        t.intLoggedIn = false
        apiBase.post(apiLogout, { }).then((/* loginResponse */) => {
          t.resetAuthentication()
          resolve(true)
        })
        .catch((err) => {
          console.error(err)
          t.resetAuthentication()
          resolve(false)
        })
      })
    },
    async refreshToken() {
      return new Promise((resolve, reject) => {
        const t = this
        apiBase.post(apiRefreshToken, { }).then(function (response) {
          if (response.result) {
            t.intAuthToken = _.get(response, 'data.token', '')

            const decodedToken = jwtDecode(t.intAuthToken)
            t.intAuthTokenExp = decodedToken.exp

            t.saveAuthState()
          }
          resolve(true)
        })
        .catch((error) => {
          /*
          eseguo il reject
          */
          reject(error)
        })
      })
    },
    async setBaseApiToken() {
      if (this.intApiBaseSet) { return }
      this.intApiBaseSet = true
      const t = this
      apiBase.interceptors.request.use(
        function (config) {
          config.headers.authorization = t.intAuthToken
          return config
        },
        function (error) {
          return Promise.reject(error)
        }
      )
    },
    /* chiamata dal router
      prepara tutti i dati per l'applicazione selezionata
    */
    routeSet(r) {
      const application = _.get(r, 'meta.application', 'not-found')
      const idx = _.findIndex(this.intApplications, function (a) { return a.name === application })

      var appIcon = 'fal fa-star'
      var browserTitle = '------'
      var applicationTitle = '------'
      var applicationName = ''

      if (idx !== -1) {
        applicationName = this.applications[idx].name

        this.intCurrentApplicationName = applicationName

        appIcon = this.applications[idx].icon
        /* this.intCurrentRoute = r */
        const t = i18n.global.t

        applicationTitle = t('applications.' + applicationName + '.title')
        browserTitle = t('applications.' + applicationName + '.browserTitle')
      }

      this.intApplicationIcon = appIcon
      this.intApplicationTitle = applicationTitle
      this.intApplicationBrowserTitle = browserTitle

      applicationStore.initCurrentApplication(applicationName, appIcon, applicationTitle, browserTitle)
    }
  }
})
