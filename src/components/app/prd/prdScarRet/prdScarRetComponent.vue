<template>
  <div style="margin-top: 50px;" class="q-pa-xs">
    <div class="row" v-if="showInput" >
      <div class="col-xs-12 col-sm-9 col-md-6 col-lg-3 q-px-sm">
        <q-input outlined autofocus v-model="inputText" @keyup.enter="onReadText"></q-input>
      </div>
    </div>

    <!--
      lista delle bolle di ingresso merce
      l'utente deve selezionarne una
     -->
    <div class="row" v-if="!selectedDoc">
      <div class="col-xs-12 q-pb-xl">
        <prod-docs-component @selectDoc="onSelectDoc"></prod-docs-component>
      </div>
    </div>
    <div v-else>
      <prod-doc-rows-component :doc="selectedDocData" :docRows="selectedDocRowsData" @closeDoc="onCloseDoc" @scarItem="scarItem"></prod-doc-rows-component>
    </div>
  </div>
  <q-page-sticky expand position="top">
    <q-toolbar class="bg-brown-2 text-black">
      <q-btn flat dense round icon="fal fa-input-text" @click="onSwitchInput"></q-btn>
      <q-space></q-space>
    </q-toolbar>
  </q-page-sticky>
  <q-page-sticky expand position="bottom" :offset="[18, 18]">
    <div class="row full-width">
      <div class="col-xs-6 text-left">
        <q-btn rounded outline icon="fal fa-screwdriver-wrench" color="blue-4" text-color="blue-4" size="sm">
          <q-menu>
          <q-card style="min-width:300px;">
            <q-card-section class="q-pa-none">
              <q-list separator>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="fal fa-battery"></q-icon>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      <q-linear-progress size="25px" :value="batteryStatusLevel" rounded color="blue-6">
                        <div class="absolute-full flex flex-center">
                          <q-badge color="white" text-color="blue-6" :label="batteryStatusLevel+'%'" />
                        </div>
                      </q-linear-progress>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-menu>
        </q-btn>
      </div>
      <div class="col-xs-6 text-right">
        <q-btn rounded icon="fal fa-raygun" color="yellow-4" text-color="black" size="sm" @click="onScan"></q-btn>
      </div>
    </div>
  </q-page-sticky>
  <wms-item-dialog v-model="itemDialogShow" :itemData="selectedItemData" @itemAssigned="onItemAssigned"></wms-item-dialog>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useQuasar } from 'quasar'

import { useServiceStore } from 'stores/service'
import { useApplicationStore } from 'stores/application'

import { apiGetData } from 'api/data'
import { apiIdLabel, apiUdcDelItem } from 'api/mag'

import prodDocsComponent from './components/prodDocsComponent.vue'
import prodDocRowsComponent from './components/prodDocRowsComponent.vue'

import wmsItemDialog from './dialogs/wmsItemDialog.vue'

const serviceStore = useServiceStore()
const applicationStore = useApplicationStore()

const q$ = useQuasar()

const newUdcDialogShow = ref(false)
const udcLocationDialogShow = ref(false)
const itemDialogShow = ref(false)

const showInput = ref(false)
const inputText = ref('')

const batteryStatusLevel = ref(0)
const batteryStatusPlugged = ref(false)

const selectedDoc = ref(false)
const selectedDocData = ref({})
const selectedDocRowsData = ref([])

const selectedItemData = ref({})
const selectedLotData = ref({})

onMounted(() => {
  if (applicationStore.deviceReady) {
    window.addEventListener('batterystatus', onBatteryStatus, false)
    window.broadcaster.addEventListener('it.g7gelati.tapp.ACTION', true, onScanTextReceived);
  }
})

onUnmounted (() => {
  window.removeEventListener('batterystatus', onBatteryStatus)
  if (window.broadcaster) {
    window.broadcaster.removeEventListener('it.g7gelati.tapp.ACTION', onScanTextReceived)
  }
})

const onSwitchInput = function () {
  showInput.value = !showInput.value
}

const onReadText = function () {
  onCheckText(inputText.value)
  inputText.value = ''
}

const onScanTextReceived = function(e) {
  const scanString = _.get(e, 'com.symbol.datawedge.data_string', '')

  // navigator.vibrate([200, 500, 200, 500])
  onCheckText(scanString)
}

/* controlla una lettura effettuata tramite input o scanner */
const onCheckText = function (text) {
  if (selectedDoc.value) {
    serviceStore.apiCall(apiIdLabel, { check: ['LABEL_ITEM'], barcode: text, options: { data: true }}, true).then(function(r) {
      const labelType = _.get(r, 'data.labelType', '')

      if (labelType === 'LABEL_ITEM') {
        console.log(_.get(r, 'data.labelData', {}))
        selectedItemData.value = _.get(r, 'data.labelData.item', {})
        selectedLotData.value = _.get(r, 'data.labelData.lot', {})
        itemDialogShow.value = true
      }
    })
  }
}

const loadDocRows = function() {
  const f = {
    idPpt: selectedDocData.value.id
  }
  serviceStore.apiCall(apiGetData, { obj: 'WMS_PROD_DOC_ITEM_SCARS', q: { qS: '', gR: {}, qC: 'all', qF: f, qPg: { pN: 1, pS: 250 } }, gridRequest: false }, true).then(function(r) {
    selectedDocRowsData.value = _.get(r, 'rows', [])
  })
}

const onBatteryStatus = function(status) {
  batteryStatusLevel.value = status.level
  batteryStatusPlugged.value = status.isPlugged
}

const vibrate = function (vibrationMessageType) {
  if (!navigator || !navigator.vibrate) {
    return
  }

  if (vibrationMessageType == 'error') {
    navigator.vibrate([300, 300, 100])
    return
  }

  if (vibrationMessageType == 'ok') {
    navigator.vibrate([100, 100, 300])
    return
  }

  navigator.vibrate([300])
}

const onScan = function() {
  window.broadcaster.fireNativeEvent( 'com.symbol.datawedge.api.ACTION', true, {
    'com.symbol.datawedge.api.SOFT_SCAN_TRIGGER': 'START_SCANNING',
    'SEND_RESULT': true
  })
}

/*
bolla di ingresso merce selezionata
*/
const onSelectDoc = function(doc) {
  selectedDoc.value = true
  selectedDocData.value = doc

  loadDocRows()
}

const scarItem = function (item) {
  selectedItemData.value = item
  itemDialogShow.value = true
}

const onCloseDoc = function () {
  selectedDoc.value = false
  selectedDocData.value = {}
  selectedDocRowsData.value = []
}

const onItemAssigned = function () {
  loadDocRows()
}

</script>
