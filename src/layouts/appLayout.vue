<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-brown-4">
        <q-btn v-if="isHome" flat dense round icon="fal fa-home"/>
        <q-btn v-if="!isHome" flat dense round icon="fal fa-arrow-left" @click="onHome"></q-btn>
        <q-toolbar-title>{{ applicationStore.applicationTitle }} </q-toolbar-title>
        <q-btn flat dense round icon="fal fa-bars">
          <q-menu>
            <q-card style="min-width:300px;">
              <q-card-section class="q-pa-none">
                <q-list separator>
                  <q-item clickable @click="onLogout">
                    <q-item-section avatar>
                      <q-icon name="fal fa-arrow-right-from-bracket"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Esci</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useMeta } from 'quasar'
import { useApplicationStore } from 'stores/application'
import { useServiceStore } from 'stores/service'
import { useRoute , useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const applicationStore = useApplicationStore()
const serviceStore = useServiceStore()

const isHome = computed(() => {
  return route.name === 'rtHome'
})

useMeta(function () {
  return {
    title: applicationStore.applicationTitle
  }
})

const onHome = function() {
  router.push({ name: 'rtHome' })
}

const onLogout = function() {
  serviceStore.logout()
  router.push({ name: 'rtLogin' })
}
</script>
