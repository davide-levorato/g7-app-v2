import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

/*
Property Values
weekday "narrow", "short", "long"
era "narrow", "short", "long"
year "2-digit", "numeric"
month "2-digit", "numeric", "narrow", "short", "long"
day "2-digit", "numeric"
hour "2-digit", "numeric"
minute "2-digit", "numeric"
second "2-digit", "numeric"
timeZoneName "short", "long"
*/
const dateTimeFormats = {
  'en-us': {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true }
  },
  'it-IT': {
    short: { day: '2-digit', year: 'numeric', month: '2-digit' },
    long: { year: 'numeric', month: 'long', day: '2-digit', weekday: 'short', hour: 'numeric', minute: 'numeric' }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'it-IT',
  fallbackLocale: 'it-IT',
  messages,
  globalInjection: true,
  dateTimeFormats
})

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n }
