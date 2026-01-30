<template>
  <q-dialog persistent maximized v-model="dlgModel">
    <q-card flat>
      <q-card-section class="bg-white q-pa-none">
        <q-tabs v-model="selTab" no-caps switch-indicator active-bg-color="white" align="left" inline-label class="bg-brown-2">
          <q-tab name="magItems">Mag fisico art. {{ item.codArticolo }}</q-tab>
          <q-tab name="lpItems">Lista prel. articolo</q-tab>
        </q-tabs>
        <q-tab-panels v-model="selTab">
          <q-tab-panel name="magItems" class="q-pa-none">
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
          </q-tab-panel>
          <q-tab-panel name="lpItems" class="q-pa-none">
            <q-scroll-area :style="listStyle">
              <q-list separator>
                <q-item v-for="l in wmsItemListData" :key="`item${l.id}`">
                  <q-item-section>
                    <q-item-label class="text-bold">{{ l.codArticolo }}</q-item-label>
                    <q-item-label>UDC: {{ l.udc }} - Lotto: {{ l.codLotto }}</q-item-label>
                    <q-item-label>Qta: {{ l.qta }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
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
  doc: {
    type: Object,
    default: function() { return {}}
  },
  item: {
    type: Object,
    default: function() { return {}}
  }
})

const emit = defineEmits(['itemAssigned'])

const q$ = useQuasar()
const serviceStore = useServiceStore()

const selTab = ref('magItems')

const dlgModel = defineModel()

const wmsItemData = ref([])
const wmsItemListData = ref([])

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
  serviceStore.apiCall(apiGetData, { obj: 'WMS_ITEMS', q: { qS: '', gR: {}, qC: 'all', qF: f, qPg: { pN: 1, pS: 250 } }, gridRequest: false }, true).then(function(r) {
    wmsItemData.value = _.get(r, 'rows', [])
  })
  serviceStore.apiCall(apiGetData, { obj: 'WH_PROD_SUPPLY_DOC_ROW_ITEMS', q: { qS: '', gR: {}, qC: 'all', qF: {
    idLista: props.doc.id,
    idArticolo: props.item.idArticolo
  }, qPg: { pN: 1, pS: 250 } }, gridRequest: false }, true).then(function(r) {
    wmsItemListData.value = _.get(r, 'rows', [])
  })
}

const onCancel = function () {
  dlgModel.value = false
}
</script>
