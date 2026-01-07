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
      <div class="col-xs-12">
        <wh-inbound-docs-component @selectDoc="onSelectDoc"></wh-inbound-docs-component>
      </div>
    </div>
    <div class="row" v-if="selectedDoc && !selectedUdc">
      <div class="col-xs-12">
        <wh-inbound-doc-rows-component :ddt="selectedDocData" :ddtRows="selectedDocRowsData" @closeDoc="onCloseDoc"></wh-inbound-doc-rows-component>
      </div>
    </div>
    <div class="row" v-if="selectedDoc && selectedUdc">
      <div class="col-xs-12">
        <wh-inbound-docs-udc-component :ddt="selectedDocData" :udc="selectedUdcData" @updateUdc="onUpdateUdc" @closeUdc="onCloseUdc"></wh-inbound-docs-udc-component>
      </div>
    </div>
  </div>
  <q-page-sticky expand position="top">
    <q-toolbar class="bg-brown-2 text-black">
      <q-btn flat dense round icon="fal fa-input-text" @click="onSwitchInput"></q-btn>
      <q-space></q-space>
      <q-btn flat dense round icon="fal fa-pallet-boxes" @click="onNewUdc"></q-btn>
    </q-toolbar>
  </q-page-sticky>
  <q-page-sticky expand position="bottom" :offset="[18, 18]">
    <div class="row full-width">
      <div class="col-xs-6 text-left">
        <q-btn rounded outline icon="fal fa-screwdriver-wrench" color="blue-4" text-color="blue-4" size="lg">
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
        <q-btn rounded icon="fal fa-raygun" color="yellow-4" text-color="black" size="lg" @click="onScan"></q-btn>
      </div>
    </div>
  </q-page-sticky>
  <new-udc-dialog v-model="newUdcDialogShow"></new-udc-dialog>
  <udc-location-dialog v-model="udcLocationDialogShow" :udc="selectedUdcData" :location="selectedLocationData" @udcAssigned="onUdcAssigned"></udc-location-dialog>
  <item-dialog v-model="itemDialogShow" :udc="selectedUdcData" :item="selectedItemData" :lot="selectedLotData" :docRowData="selectedDocRowData" @itemAssigned="onItemAssigned"></item-dialog>
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

import newUdcDialog from 'dialogs/mag/newUdcDialog.vue'

import whInboundDocsComponent from './components/whInboundDocsComponent.vue'
import whInboundDocRowsComponent from './components/whInboundDocRowsComponent.vue'
import whInboundDocsUdcComponent from './components/whInboundDocsUdcComponent.vue'

import udcLocationDialog from './dialogs/udcLocationDialog.vue'
import itemDialog from './dialogs/itemDialog.vue'

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
const selectedDocRowData = ref({})

const selectedUdc = ref(false)
const selectedUdcData = ref({})

const selectedItemData = ref({})
const selectedLotData = ref({})
const selectedLocationData = ref({})

const lastBarcodeRead = ref('')

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

const onNewUdc = function() {
  newUdcDialogShow.value = true
}

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
  /* se ho selezionato un ddt ma non un udc allora verifico UDC
  */
  if (selectedDoc.value) {
    if (!selectedUdc.value) {
      serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: text, options: { data: true }}, true).then(function(r) {
        const isUdc = _.get(r, 'data.labelTypeFound', false)
        const udcData = _.get(r, 'data.labelData', {})

        const udcBarcode = _.get(udcData, 'barcode', '')
        const udcLocationId = _.get(udcData, 'locationId', 0)
        const udcStatus = _.get(udcData, 'status', '')

        if (udcLocationId || (udcStatus !== 'N' && udcStatus !== 'G')) {
          vibrate('error')
          q$.notify({
            message: `UDC ${udcBarcode} non valido`,
            color: 'red-6'
          })
          return
        }

        selectedUdc.value = true
        selectedUdcData.value = udcData
        inputText.value = ''
      })
    }

    /*
    se ho selezionato un udc valido allora controllo l'etichetta
    */
    if (selectedUdc.value) {
      lastBarcodeRead.value = text
      serviceStore.apiCall(apiIdLabel, { check: ['LABEL_ITEM', 'LABEL_LOCATION'], barcode: text, options: { data: true }}, true).then(function(r) {
        const labelType = _.get(r, 'data.labelType', '')

        /*
          se label type location vado ad inserire l'UDC nel vano e lo chiudo (chiedo conferma?)
        */
        /*
        se label ean item chiedo quantità e inserisco l'articolo / lotto nell'udc
        */
        if (labelType === 'LABEL_LOCATION') {
          // const locationId = _.get(r, 'data.labelData.locationId', 0)
          selectedLocationData.value = _.get(r, 'data.labelData', {})
          udcLocationDialogShow.value = true
        }
        /* se etichetta controllo che l'articolo sia presente in bolla */
        if (labelType === 'LABEL_ITEM') {
          selectedItemData.value = _.get(r, 'data.labelData.item', {})
          selectedLotData.value = _.get(r, 'data.labelData.lot', {})

          const idx = _.findIndex(selectedDocRowsData.value, function (rd) {
            const itemMatch = rd.idArticolo === selectedItemData.value.idArticolo
            const lotMatch = selectedLotData.value.idLotto ? selectedLotData.value.idLotto === rd.idLotto : true
            return itemMatch && lotMatch
          })

          if (idx === -1) {
            vibrate('error')
            q$.notify({
              message: `Articolo non valido`,
              color: 'red-6'
            })
            return
          } else {
            selectedDocRowData.value = selectedDocRowsData.value[idx]
            selectedItemData.value.qtaRes = selectedDocRowsData.value[idx].qta - selectedDocRowsData.value[idx].qtaCar
            itemDialogShow.value = true
          }
        }
      })
    }
  }
}

const loadUdcData = function (udcBarcode) {
  serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: udcBarcode, options: { data: true }}, true).then(function(r) {
    const udcData = _.get(r, 'data.labelData', {})
    selectedUdcData.value = udcData

    inputText.value = ''

    if (!_.isEmpty(lastBarcodeRead.value)) {
      serviceStore.apiCall(apiIdLabel, { check: ['LABEL_ITEM'], barcode: lastBarcodeRead.value, options: { data: true }}, true).then(function(r) {
        const labelType = _.get(r, 'data.labelType', '')

        /* se etichetta controllo che l'articolo sia presente in bolla */
        if (labelType === 'LABEL_ITEM') {
          selectedItemData.value = _.get(r, 'data.labelData.item', {})
          selectedLotData.value = _.get(r, 'data.labelData.lot', {})

          const idx = _.findIndex(selectedDocRowsData.value, function (rd) {
            const itemMatch = rd.idArticolo === selectedItemData.value.idArticolo
            const lotMatch = selectedLotData.value.idLotto ? selectedLotData.value.idLotto === rd.idLotto : true
            return itemMatch && lotMatch
          })

          if (idx === -1) {
            vibrate('error')
            q$.notify({
              message: `Articolo non valido`,
              color: 'red-6'
            })
            return
          } else {
            selectedDocRowData.value = selectedDocRowsData.value[idx]
            selectedItemData.value.qtaRes = selectedDocRowsData.value[idx].qta - selectedDocRowsData.value[idx].qtaCar
            itemDialogShow.value = true
          }
        }
      })
    }

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
  onLoadDocRows(doc.nroDdt)
}

const onCloseDoc =  function() {
  selectedDoc.value = false
  selectedDocData.value = {}

  selectedDocRowsData.value = []
  selectedDocRowData.value = {}

  selectedUdc.value = false
  selectedUdcData.value = {}

  selectedItemData.value = {}
  selectedLotData.value = {}
  selectedLocationData.value = {}

  lastBarcodeRead.value = ''
}

const onUdcAssigned = function() {
  selectedUdc.value = false
  selectedUdcData.value = {}
  // location.value = {}
  // item.value = {}
  // lot.value = {}
}

const onItemAssigned = function () {
  lastBarcodeRead.value = ''
  loadUdcData(selectedUdcData.value.barcode)
}

const onUpdateUdc = function() {
  loadUdcData(selectedUdcData.value.barcode)
  onLoadDocRows(selectedDocData.value.nroDdt)
}

const onCloseUdc = function () {
  onLoadDocRows(selectedDocData.value.nroDdt)
  selectedUdc.value = false
  selectedUdcData.value = {}
  lastBarcodeRead.value = ''
}

const onLoadDocRows = function(nroDoc) {
  const f = { nroDdt: nroDoc }
  serviceStore.apiCall(apiGetData, { obj: 'WH_INBOUND_DOC_ROWS', q: { qS: '', gR: {}, qC: 'all', qF: f, qPg: { pN: 1, pS: 250 } }, gridRequest: false }, true).then(function(r) {
    selectedDocRowsData.value = _.get(r, 'rows', [])
  })
}
</script>
