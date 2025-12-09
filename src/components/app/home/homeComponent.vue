<template>
  <q-page>
    <div class="row" >
      <div class="col-xs-12">
        <template v-for="(mi, idx) in menuItems" :key="'mnItem_'+idx">
          <!-- menu expansion item -->
          <template v-if="mi.type==='ei'">
            <q-item class="bg-brown-2">
              <q-item-section avatar>
                <q-avatar><q-icon :name="mi.icon" size="md"></q-icon></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label><span class="text-bold">{{ mi.label }}</span></q-item-label>
              </q-item-section>
            </q-item>
            <div class="row">
              <template v-for="(i, idx) in mi.children" :key="'menuItem__top__' + idx">
                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 text-center q-pa-sm">
                  <template v-if="i.type === 'mi'">
                    <menu-item :icon="i.icon" :label="i.label" :to="i.route"></menu-item>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useServiceStore } from 'stores/service'
// import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import { APP_MENU } from 'boot/appMenu'
import menuItem from './components/menuItemComponent.vue'

const serviceStore = useServiceStore()
// const q$ = useQuasar()
const { t } = useI18n({ useScope: 'global' })

const menuItems = ref([])
onMounted(()=>{
  prepareMenu()
})

const prepareMenu = function () {
  menuItems.value = []
  const userRole = serviceStore.user.role
  const userApplications = serviceStore.user.applications

  for (var i = 0; i < APP_MENU.length; i++) {
    var itemEnabled = false
    const uRIdx = _.findIndex(APP_MENU[i].userRoles, function(r) { return r.r === userRole })
    if (uRIdx !== -1) {
      const roleApp = APP_MENU[i].userRoles[uRIdx].a
      if (roleApp !== 'all' && userRole !== 'SA') {
        // controllo se l'applicazione è inclusa in quelle previste per l'utente
        itemEnabled = _.includes(userApplications, APP_MENU[i].application)
      } else {
        itemEnabled = true
      }
    }
    if (itemEnabled) {
      const item = _.clone(APP_MENU[i])
      item.children = []
      if (APP_MENU[i].type === 'ei') {
        for (var k = 0; k < APP_MENU[i].items.length; k++) {
          /* recupero icona e label */
          const appIdx = _.findIndex(serviceStore.applications, function(a) {
            return a.name === APP_MENU[i].items[k].application
          })
          if (appIdx !== -1) {
            if (!APP_MENU[i].items[k].label || _.isEmpty(APP_MENU[i].items[k].label)) {
              APP_MENU[i].items[k].label = t('applications.' + serviceStore.applications[appIdx].name + '.menuLabel')
            }
            if (!APP_MENU[i].items[k].icon || _.isEmpty(APP_MENU[i].items[k].icon)) {
              APP_MENU[i].items[k].icon = serviceStore.applications[appIdx].icon
            }

          }
          var childItemEnabled = false
          const chRIdx = _.findIndex(APP_MENU[i].items[k].userRoles, function(r) { return r.r === userRole })
          if (chRIdx !== -1) {
            const roleApp = APP_MENU[i].items[k].userRoles[chRIdx].a
            if (roleApp !== 'all') {
              // controllo se l'applicazione è inclusa in quelle previste per l'utente
              const appFoundIdx = _.findIndex(userApplications, function(app) { return app.name === APP_MENU[i].items[k].application })
              childItemEnabled = appFoundIdx !== -1
            } else {
              childItemEnabled = true
            }
          }
          if (childItemEnabled) {
            if (APP_MENU[i].items[k].type === 'mi') {
              item.children.push(_.clone(APP_MENU[i].items[k]))
            }
            /* if (APP_MENU[i].items[k].type === 'DASHBOARDS') {
              item.folders = this.dashboardFolders
              const ds = _.get(this.serviceStore.settings, 'dashboards', [])
              for (var z = 0; z < ds.length; z++) {
                if (ds[z].id !== 0) {
                  const mn = _.cloneDeep(APP_MENU[i].items[k])
                  mn.label = ds[z].name
                  mn.folder = ds[z].folder
                  mn.type = 'mi'
                  mn.route.params = { id: ds[z].id }
                  item.children.push(mn)
                }
              }
            } */
          }
        }
      }
      if ((item.type === 'ei' && !_.isEmpty(item.children)) || item.type !== 'ei') {
        menuItems.value.push(item)
      }
    }
  }
}
</script>
