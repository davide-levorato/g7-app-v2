<template>
  <div class="row q-mt-sm">
    <div class="col-xs-12 col-md-9 col-lg-6 col-xl-4 q-px-sm">
      <q-input v-model="searchString" outlined debounce="400" label="Cerca...">
        <template v-if="!_.isEmpty(searchString)" v-slot:append>
          <q-icon name="fal fa-circle-xmark" @click.stop.prevent="searchString=''" class="cursor-pointer" />
        </template>
      </q-input>
    </div>
  </div>
  <div class="row q-mt-sm" v-if="_.isEmpty(contacts)">
    <div class="col-xs-12 text-center q-py-xl">
      <span class="text-grey-6 textsubtitle">Nessun contatto da visualizzare</span>
    </div>
  </div>
  <div class="row q-mt-sm" v-else>
    <div class="col-xs-12">
      <q-scroll-area :style="areaStyle">
        <q-card :style="cardStyle">
          <q-card-section class="q-pa-xs">
            <q-list separator>
              <q-item v-for="c in contacts" :key="c.id" clickable @click="onEdit(c)">
                <q-item-section>
                  <q-item-label caption>Cliente</q-item-label>
                  <q-item-label>{{ c.companyName }}</q-item-label>
                  <q-item-label caption>Contatto</q-item-label>
                  <q-item-label>{{ c.firstName }} {{ c.lastName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted } from 'vue'

import _ from 'lodash'
import dayJs from 'dayjs'

import { useServiceStore } from "src/stores/service.js"
import { useApplicationStore } from "src/stores/application"

import { apiGetData } from 'api/data.js'

const emit = defineEmits(['edit'])

const q$ = useQuasar()
const serviceStore = useServiceStore()

const searchString = ref('')
const contacts = ref([])

const cardStyle = computed(() => {
  const w = q$.screen.width
  return `width:${w}px; max-width:${w}px;`
})

const areaStyle = computed(() => {
  const subTract = 176
  const h = q$.screen.height - subTract
  return `width: 100%; height:${h}px;`
})

onMounted(()=>{
  refreshData()
})

watch(searchString, function(v) {
  refreshData()
})

const refreshData = function() {
  serviceStore.apiCall(apiGetData, { obj: 'MKT_CONTACTS', q: { qS: searchString.value, gR: {}, qC: 'all', qF: {}, qPg: { pN: 1, pS: 250 } }, gridRequest: false }, true).then(function(r) {
    contacts.value = _.get(r, 'rows', [])
  })
}

const onEdit = function (c) {
  emit('edit', c)
}
</script>
