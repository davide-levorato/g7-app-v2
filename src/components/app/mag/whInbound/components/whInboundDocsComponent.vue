<template>
<q-list separator>
  <q-item-label header>Lista DDT ingresso merce</q-item-label>
  <template v-for="d in inboundDocs" :key="`wmDoc${d.nroDdt}`">
    <q-item clickable @click="onSelectDoc(d)">
      <q-item-section>
        <q-item-label>Bolla n.: <span class="text-bold">{{ d.nroDdt }}</span> del {{ dayJs(d.dataDdt).format('DD/MM/YYYY') }}</q-item-label>
        <q-item-label>{{ d.ragioneSociale }}</q-item-label>
        <q-item-label>Rif.: {{ d.rifDoc }} del {{ dayJs(d.dataDocFornitore).format('DD/MM/YYYY') }}</q-item-label>
        <q-item-label caption v-if="!_.isEmpty(d.note)">{{ d.note }}</q-item-label>
      </q-item-section>
    </q-item>
  </template>
</q-list>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import dayJs from 'dayjs'
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

import { useServiceStore } from 'stores/service'

import { apiGetData } from 'api/data'

const emit = defineEmits(['selectDoc'])

const serviceStore = useServiceStore()

const q$ = useQuasar()

const inboundDocs = ref([])

onMounted(() => {
  refreshData()
})


const refreshData = function () {
  serviceStore.apiCall(apiGetData, { obj: 'WH_INBOUND_DOCS', q: { qS: '', gR: {}, qC: 'all', qF: {}, qPg: { pN: 1, pS: 25 } }, gridRequest: false }, true).then(function(r) {
    inboundDocs.value = _.get(r, 'rows', [])
  })
}

const onSelectDoc = function (doc) {
  emit('selectDoc', doc)
}


</script>
