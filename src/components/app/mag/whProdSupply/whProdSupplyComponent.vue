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

  <div class="row" v-if="selectedDoc">
    <div class="col-xs-12">
      <wh-prod-supply-doc-rows-component :doc="selectedDocData" :docRows="selectedDocRowsData" @closeDoc="onCloseDoc"></wh-prod-supply-doc-rows-component>
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
  <wms-udc-dialog v-model="showUdcDialog" :udc="selectedUdcData" :docData="selectedDocData" :docItems="selectedDocRowsData" :udcPickingData="udcPickingData" @itemAssigned="onItemAssigned"></wms-udc-dialog>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import dayJs from 'dayjs'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useQuasar } from 'quasar'

import { useApplicationStore } from 'stores/application'
import { useServiceStore } from 'stores/service'

import { apiIdLabel, apiUdcDelItem } from 'api/mag'
import { apiGetData } from 'api/data'

import newUdcDialog from 'dialogs/mag/newUdcDialog.vue'
import whProdSupplyDocsComponent from './components/whProdSupplyDocsComponent.vue'
import whProdSupplyDocRowsComponent from './components/whProdSupplyDocRowsComponent.vue'

import wmsUdcDialog from './dialogs/wmsUdcDialog.vue'

const emit = defineEmits(['selectDoc'])

const applicationStore = useApplicationStore()
const serviceStore = useServiceStore()

const q$ = useQuasar()

const batteryStatusLevel = ref(0)
const batteryStatusPlugged = ref(false)

const newUdcDialogShow = ref(false)

const selectedDoc = ref(false)
const selectedDocData = ref({})
const selectedDocRowsData = ref({})

const selectedUdc = ref(false)
const selectedUdcData = ref({})

const showInput = ref(false)
const inputText = ref('')

const showUdcDialog = ref(false)
const udcPickingData = ref({})

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

const onScan = function() {
  window.broadcaster.fireNativeEvent( 'com.symbol.datawedge.api.ACTION', true, {
    'com.symbol.datawedge.api.SOFT_SCAN_TRIGGER': 'START_SCANNING',
    'SEND_RESULT': true
  })
}

const onScanTextReceived = function(e) {
  const scanString = _.get(e, 'com.symbol.datawedge.data_string', '')

  // navigator.vibrate([200, 500, 200, 500])
  onCheckText(scanString)
}

const onSelectDoc = function(doc) {
  selectedDoc.value = true
  selectedDocData.value = doc
  onLoadDocRows(doc.id)
}

const onCloseDoc = function () {
  selectedDoc.value = false
  selectedDocData.value = {}
  selectedDocRowsData.value = []
}

const onSwitchInput = function () {
  showInput.value = !showInput.value
}

const onReadText = function () {
  onCheckText(inputText.value)
  inputText.value = ''
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

/* controlla una lettura effettuata tramite input o scanner */
const onCheckText = function (text) {
  /* se ho selezionato una ista di preliveo ma non un udc allora verifico la lettura di un udc
    l'udc letto deve essere in magazzino e contenere un articolo in lista
    se l'articolo non è in lista questo viene aggiunto
  */
  if (selectedDoc.value) {
    if (selectedDocData.value.stato === 'C') {
      vibrate('error')
      q$.notify({
        message: `Documento chiuso`,
        color: 'red-6'
      })
      return;
    }
  } else {
    return
  }

  /* se non ho ancora selezionato un udc allora mi aspetto un UDC */
  if (!selectedUdc.value) {
    serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: text, options: { data: true }}, true).then(function(r) {
      const isUdc = _.get(r, 'data.labelTypeFound', false)
      const udcData = _.get(r, 'data.labelData', {})

      const udcBarcode = _.get(udcData, 'barcode', '')
      const udcLocationId = _.get(udcData, 'locationId', 0)
      const udcStatus = _.get(udcData, 'status', '')

      if (!udcLocationId || udcStatus !== 'W') {
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

      showUdcDialog.value = true
    })
  } else {
    /* cerco un secondo UDC per trasferimento PICKING */
    serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: text, options: { data: false }}, true).then(function(r) {
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

      udcPickingData.value = udcData
    })
  }


}

const onItemAssigned = function () {
  onLoadDocRows(selectedDocData.value.id)
}
</script>
