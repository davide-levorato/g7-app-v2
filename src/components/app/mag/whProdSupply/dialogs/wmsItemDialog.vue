<template>
  <q-dialog persistent maximized v-model="dlgModel">
    <q-card flat>
      <q-card-section class="bg-grey-4 q-pa-sm">
        <span class="text-subtitle2">Mag fisico art. {{ item.codArticolo }}</span>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-scroll-area :style="listStyle">
          <q-markup-table dense flat separator="cell">
            <thead>
              <tr>
                <td class="text-center text-weight-bold">Z</td>
                <td class="text-center text-weight-bold">C</td>
                <td class="text-center text-weight-bold">V</td>
                <td class="text-center text-weight-bold">P</td>
                <td class="text-center text-weight-bold">Lotto</td>
                <td class="text-center text-weight-bold">Qta</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="wI in wmsItemData" :key="`tr${wI.udcItemId}`">
                <td class="text-center">{{ wI.zona }}</td>
                <td class="text-center">
                  <div>{{ wI.corsia }}</div>
                  <div>{{ wI.latoVano==='R' ? 'Des' : 'Sin' }}</div>
                </td>
                <td class="text-center">{{ wI.numeroVano }}</td>
                <td class="text-center">{{ wI.piano }}</td>
                <td class="text-left">
                  <div class="row">
                    <div class="col-xs-3 col-md-1">UDC:</div><div class="col-xs-9 col-md-11 text-left text-bold">{{ wI.udc }}</div>
                    <div class="col-xs-3 col-md-1">Lotto:</div><div class="col-xs-9 col-md-11 text-left text-bold">{{ wI.codLotto }}</div>
                    <div class="col-xs-3 col-md-1">Del:</div><div class="col-xs-9 col-md-11 text-left">{{ wI.dtInizioVal ? dayJs(wI.dtInizioVal).format('DD/MM/YYYY') : '---' }}</div>
                    <div class="col-xs-3 col-md-1">Scad:</div><div class="col-xs-9 col-md-11 text-left">{{ wI.dtFineVal ? dayJs(wI.dtFineVal).format('DD/MM/YYYY') : '---' }}</div>
                  </div>
                </td>
                <td class="text-center">{{ wI.qtaInv }} {{ wI.um }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn no-caps label="Esci" @click="onCancel"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, watch, computed } from 'vue'
import _ from 'lodash'
import dayJs from 'dayjs'
import { useQuasar } from 'quasar'
import { useServiceStore } from 'src/stores/service.js'

import { apiGetData } from 'api/data'

const props = defineProps({
  item: {
    type: Object,
    default: function() { return {}}
  }
})

const emit = defineEmits(['itemAssigned'])

const q$ = useQuasar()
const serviceStore = useServiceStore()

const dlgModel = defineModel()

const wmsItemData = ref([])

watch(dlgModel, function(v) {
  if (v) {
    refreshData()
  }
})

const itemCode = computed(() => {
  return _.get(props.item, 'codArticolo', '')
})

const listStyle = computed(() => {
  const subTract = 110
  const h = q$.screen.height - subTract
  return `width: 100%; height:${h}px;`
})

const refreshData = function () {
  const f = {
    idArticolo: props.item.idArticolo
  }
  serviceStore.apiCall(apiGetData, { obj: 'WMS_ITEMS', q: { qS: '', gR: {}, qC: 'all', qF: f, qPg: { pN: 1, pS: 25 } }, gridRequest: false }, true).then(function(r) {
    wmsItemData.value = _.get(r, 'rows', [])
  })
}

const onCancel = function () {
  dlgModel.value = false
}
</script>
