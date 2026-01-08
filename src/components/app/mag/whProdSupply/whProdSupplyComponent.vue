<template>
  <div style="margin-top: 50px;" class="q-pa-xs">
    <div class="row" v-if="showInput" >
      <div class="col-xs-12 col-sm-9 col-md-6 col-lg-3 q-px-sm">
        <q-input outlined autofocus v-model="inputText" @keyup.enter="onReadText"></q-input>
      </div>
    </div>
  </div>

  <!--
    lista delle liste di prelievo
  -->
  <div class="row" v-if="!selectedDoc">
    <div class="col-xs-12">
      <wh-prod-supply-docs-component @selectDoc="onSelectDoc"></wh-prod-supply-docs-component>
    </div>
  </div>

  <div class="row" v-if="selectedDoc && !selectedUdc">
    <div class="col-xs-12">
      <wh-prod-supply-doc-rows-component :doc="selectedDocData" :docRows="selectedDocRowsData"></wh-prod-supply-doc-rows-component>
    </div>
  </div>

  <q-page-sticky expand position="top">
    <q-toolbar class="bg-brown-2 text-black">
      <q-btn flat dense round icon="fal fa-input-text" @click="onSwitchInput"></q-btn>
      <q-space></q-space>
      <q-btn flat dense round icon="fal fa-pallet-boxes" @click="onNewUdc"></q-btn>
    </q-toolbar>
  </q-page-sticky>
  <new-udc-dialog v-model="newUdcDialogShow"></new-udc-dialog>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import dayJs from 'dayjs'
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

import { useServiceStore } from 'stores/service'

import { apiGetData } from 'api/data'

import newUdcDialog from 'dialogs/mag/newUdcDialog.vue'
import whProdSupplyDocsComponent from './components/whProdSupplyDocsComponent.vue'
import whProdSupplyDocRowsComponent from './components/whProdSupplyDocRowsComponent.vue'

const emit = defineEmits(['selectDoc'])

const serviceStore = useServiceStore()

const q$ = useQuasar()

const newUdcDialogShow = ref(false)

const selectedDoc = ref(false)
const selectedDocData = ref({})
const selectedDocRowsData = ref({})

const selectedUdc = ref(false)
const selectedUdcData = ref({})

const showInput = ref(false)
const inputText = ref('')

const onSelectDoc = function(doc) {
  selectedDoc.value = true
  selectedDocData.value = doc
  onLoadDocRows(doc.id)
}

const onSwitchInput = function () {
  showInput.value = !showInput.value
}

const onNewUdc = function() {
  newUdcDialogShow.value = true
}

const onLoadDocRows = function(nroDoc) {
  const f = { idBlpt: nroDoc }
  serviceStore.apiCall(apiGetData, { obj: 'WH_PROD_SUPPLY_DOC_ROWS', q: { qS: '', gR: {}, qC: 'all', qF: f, qPg: { pN: 1, pS: 500 } }, gridRequest: false }, true).then(function(r) {
    selectedDocRowsData.value = _.get(r, 'rows', [])
  })
}
</script>
