<template>
  <div style="margin-top: 50px;" class="q-pa-xs">
    <div class="row" v-if="showInput" >
      <div class="col-xs-12 col-sm-9 col-md-6 col-lg-3 q-px-sm">
        <q-input outlined autofocus v-model="inputText" @keyup.enter="onReadText"></q-input>
      </div>
    </div>
  </div>

  <div class="row" v-if="!selectedUdc">
    <div class="col-xs-12 text-center q-py-lg">
      <span class="text-h6 text-grey-7">Leggere un UDC</span>
    </div>
  </div>

  <!-- lista delle possibili transazioni per questo tipo di udc -->
  <div class="row" v-if="selectedUdc">
    <div class="col-xs-12 text-left q-pa-sm">
      <wh-udc-component :udc="selectedUdcData" @closeUdc="onCloseUdc"></wh-udc-component>

      <q-card class="q-mt-md">
        <q-card-section v-if="!_.isEmpty(enabledTransactionTypes)" class="q-pa-xs">
          <q-list separator>
            <q-item v-for="type in enabledTransactionTypes" :key="type.id" clickable @click="onSelectTransactionType(type)">
              <q-item-section avatar>
                <q-avatar color="grey-4">{{ type.name }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-bold">
                  {{ type.label }}
                </q-item-label>
                <q-item-label caption>
                  {{ type.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-else class="text-center">
          <span class="text-caption text-grey-7">Nessuna transazione disponibile per questo UDC</span>
        </q-card-section>
      </q-card>
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
  <wms-udc-dialog v-model="wmsUdcDialogShow"
    :udc="selectedUdcData"
    :transactionType="selectedTransactionTypeData"
    :udcPickingData="udcPickingData"
    :locationData="selectedLocationData"
    :itemData="selectedItemData"
    @cancel="onCancelTransaction" @itemAssigned="onItemAssigned"></wms-udc-dialog>
</template>
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-unreachable -->
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
import whUdcComponent from './components/whUdcComponent.vue'
import wmsUdcDialog from './dialogs/wmsUdcDialog.vue'

const emit = defineEmits(['selectDoc'])

const applicationStore = useApplicationStore()
const serviceStore = useServiceStore()

const q$ = useQuasar()

const batteryStatusLevel = ref(0)
const batteryStatusPlugged = ref(false)

const newUdcDialogShow = ref(false)

const selectedUdc = ref(false)
const selectedUdcData = ref({})

const wmsUdcDialogShow = ref(false)
const udcPickingData = ref({})

const selectedTransactionType = ref(false)
const selectedTransactionTypeData = ref({})

const showInput = ref(false)
const inputText = ref('')

const transactionTypes = ref([])
const enabledTransactionTypes = ref([])

const selectedItemData = ref({})
const selectedLocationData = ref({})

onMounted(() => {
  if (applicationStore.deviceReady) {
    window.addEventListener('batterystatus', onBatteryStatus, false)
    window.broadcaster.addEventListener('it.g7gelati.tapp.ACTION', true, onScanTextReceived);
  }
  loadTransactionTypes()
})

onUnmounted (() => {
  window.removeEventListener('batterystatus', onBatteryStatus)
  if (window.broadcaster) {
    window.broadcaster.removeEventListener('it.g7gelati.tapp.ACTION', onScanTextReceived)
  }
})

const loadTransactionTypes = async function() {
  serviceStore.apiCall(apiGetData, { obj: 'WMS_TRANSACTION_TYPES', q: { qS: '', gR: {}, qC: 'all', qF: {}, qPg: { pN: 1, pS: 500 } }, gridRequest: false }, true).then(function(r) {
    transactionTypes.value = _.get(r, 'rows', [])
  })
}

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
  /* se non ho ancora selezionato un udc allora mi aspetto un UDC */
  if (!selectedUdc.value) {
    serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: text, options: { data: true }}, true).then(function(r) {
      const isUdc = _.get(r, 'data.labelTypeFound', false)
      const udcData = _.get(r, 'data.labelData', {})

      const udcBarcode = _.get(udcData, 'barcode', '')
      const udcLocationId = _.get(udcData, 'locationId', 0)
      const udcStatus = _.get(udcData, 'status', '')

      /* filtro le transazione abilitate in base allo stato dell' UDC */
      enabledTransactionTypes.value = transactionTypes.value.filter(function(t) {
        const allowedStatuses = JSON.parse(_.get(t, 'loadingUnitStatus', []))
        return allowedStatuses.includes(udcStatus)
      })

      selectedUdc.value = true
      selectedUdcData.value = udcData
    })

  } else {
    serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC', 'LABEL_ITEM', 'LABEL_LOCATION'], barcode: text, options: { data: true }}, true).then(function(r) {
      const labelType = _.get(r, 'data.labelType', '')

      if (labelType === 'LABEL_UDC') {
        udcPickingData.value = _.get(r, 'data.labelData', {})
      }
      if (labelType === 'LABEL_LOCATION') {
        selectedLocationData.value = _.get(r, 'data.labelData', {})
      }

      /* se etichetta controllo che l'articolo sia presente in bolla */
      if (labelType === 'LABEL_ITEM') {
        selectedItemData.value = _.get(r, 'data.labelData', {})
      }
    })
  }
}

const onSelectTransactionType = function (transactionType) {
  selectedTransactionType.value = true
  selectedTransactionTypeData.value = transactionType

  wmsUdcDialogShow.value = true

  /*
  window.setTimeout(() => {
    selectedLocationData.value = {
        "id": 6281,
        "barcode": "E0403700",
        "number": 79,
        "level": 1,
        "maxUnitsLoad": 1,
        "rackLevels": 2,
        "rackLocations": 9,
        "aisleName": "01",
        "zoneName": "A"
    }
  }, 3500)

    /*
    const udc = {
      "id": 6224,
      "barcode": "00006224",
      "warehouseId": 1,
      "locationId": 8985,
      "location": {
          "id": 8985,
          "barcode": "G0100100",
          "number": 1,
          "level": 0,
          "maxUnitsLoad": 1,
          "rackLevels": 1,
          "rackLocations": 1,
          "aisleName": "01",
          "zoneName": "G"
      },
      "width": 1,
      "status": "W",
      "items": [
          {
              "id": 5739,
              "loadingUnitId": 6224,
              "batchId": 361260,
              "itemId": 11235,
              "codArticolo": "DBVAR36",
              "descrArticolo": "CAFFE' CONCENTRATO (con zucchero bruciato) RIPPLE",
              "codLotto": "T61-051125",
              "umGestione": "KG",
              "dtFineVal": "2026-02-05T00:00:00.000Z",
              "inboundDocId": null,
              "nroDdtAcq": null,
              "inboundDocItemId": null,
              "qty": 20
          }
      ]
  } */
    /* selectedItemData.value = {
    "item": {
        "idArticolo": 2440,
        "codArticolo": "ING02008",
        "descrArticolo": "LATTE IN POLVERE K",
        "idTipoArticolo": 10,
        "codUmGestione": "KG",
        "codUmVendita": null,
        "coeffConvAcqGest": 1,
        "coeffConvGestVen": 1,
        "pesoGestione": 1,
        "pesoVendita": null,
        "barCode": null,
        "barCode2": null,
        "idConfezione": null,
        "gestioneLotti": "Y",
        "movimentaMag": "Y",
        "gusto": null,
        "qtaGestPila": null,
        "descrConfezione": null,
        "cLunghezza": null,
        "cLarghezza": null,
        "cAltezza": null,
        "cVolume": null,
        "cPeso": null,
        "cPesoLordo": null,
        "cQtaV": null,
        "vLunghezza": null,
        "vLarghezza": null,
        "vAltezza": null,
        "vPeso": null,
        "vPesoLordo": null,
        "vQtaS": null,
        "sQtaB": null,
        "bLunghezza": null,
        "bLarghezza": null,
        "bAltezza": null,
        "descrContenitore": null,
        "descrEtichetta": null,
        "linea": "X MATERIE PRIME"
    },
    "lot": {
        "idLotto": 197051,
        "idArticolo": 2440,
        "codLotto": "G7-197051",
        "codLottoForn": "09252082",
        "idStatoLotto": 1,
        "chiuso": "N",
        "dtInizioVal": "2025-09-24T00:00:00.000Z",
        "dtFineVal": "2027-09-16T00:00:00.000Z"
    }

    }
  }, 3500) */
}

const onCancelTransaction = function () {
  selectedUdc.value = false
  selectedUdcData.value = {}

  udcPickingData.value = {}
  selectedItemData.value = {}
  selectedLocationData.value = {}

  selectedTransactionType.value = false
  selectedTransactionTypeData.value = {}

  loadTransactionTypes()
}

const onCloseUdc = function () {
  selectedUdc.value = false
  selectedUdcData.value = {}

  selectedTransactionType.value = false
  selectedTransactionTypeData.value = {}

  loadTransactionTypes()
}

const onItemAssigned = function () {
  selectedUdc.value = false
  selectedUdcData.value = {}

  udcPickingData.value = {}
  selectedItemData.value = {}
  selectedLocationData.value = {}

  selectedTransactionType.value = false
  selectedTransactionTypeData.value = {}

  loadTransactionTypes()
}
</script>

