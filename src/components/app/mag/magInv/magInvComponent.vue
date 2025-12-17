<template>
  <q-page>
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-brown-2 text-black">
        <q-btn flat dense round icon="fal fa-input-text" @click="onSwitchInput"></q-btn>
        <q-space></q-space>
        <q-btn flat dense round icon="fal fa-pallet-boxes" @click="onNewUdc"></q-btn>
      </q-toolbar>
    </q-page-sticky>
    <div style="margin-top: 50px;" class="q-pa-sm">
      <div class="row" v-if="showInput" >
        <div class="col-xs-12 col-sm-9 col-md-6 col-lg-3 q-px-sm">
          <q-input outlined autofocus v-model="inputText" @keyup.enter="onReadText"></q-input>
        </div>
      </div>
      <div v-if="udcRead" class="q-mt-sm q-px-sm">
        <div class="row">
          <div class="col-xs-9">
            <span class="text-h6">
              UDC {{ udc.barcode }}
            </span>
          </div>
          <div class="col-xs-3 text-right">
            <q-btn icon="fal fa-arrow-right-from-dotted-line" outline color="blue-4" text-color="blue-4" size="md" @click="onCloseUdc"></q-btn>
          </div>
        </div>
        <q-list bordered separator class="q-mt-sm">
          <q-item v-for="item in udc.items" :key="item.id" style="padding-left:2px;" clickable @click="onDeleteItem(item)">
            <q-item-section>
              <q-item-label>
                {{ item.codArticolo }} {{ item.codLotto }}
              </q-item-label>
              <q-item-label caption>
                {{ item.descrArticolo }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge floating outline class="q-mt-xs">
                <q-icon name="fal fa-trash-alt" color="red-6" size="14px"></q-icon>
              </q-badge>
              <q-item-label class="text-subtitle2 text-bold">
                {{ item.qty }} {{ item.umGestione }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-else class="q-mt-lg text-center">
        <span class="text-h6">
          Leggere UDC
        </span>
      </div>
    </div>
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
    <udc-location-dialog v-model="udcLocationDialogShow" :udc="udc" :location="location" @udcAssigned="onUdcAssigned"></udc-location-dialog>
    <item-dialog v-model="itemDialogShow" :udc="udc" :item="item" :lot="lot" @itemAssigned="onItemAssigned"></item-dialog>
  </q-page>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'

import { useServiceStore } from 'stores/service'
import { useApplicationStore } from 'stores/application'

import { apiIdLabel, apiUdcDelItem } from 'api/mag'

import newUdcDialog from './dialogs/newUdcDialog.vue'
import udcLocationDialog from './dialogs/udcLocationDialog.vue'
import itemDialog from './dialogs/itemDialog.vue'

const serviceStore = useServiceStore()
const applicationStore = useApplicationStore()

const q$ = useQuasar()

const showInput = ref(false)
const inputText = ref('')

const newUdcDialogShow = ref(false)
const udcLocationDialogShow = ref(false)
const itemDialogShow = ref(false)

const batteryStatusLevel = ref(0)
const batteryStatusPlugged = ref(false)

/*
UDC che sto trattando
se vuoto significa che devo leggere un udc per iniziare il processo
*/
const udc = ref({})
const location = ref({})
const item = ref({})
const lot = ref({})

const udcRead = computed(() => {
  return !_.isEmpty(udc.value)
})
const udcBarcode = computed(() => {
  return _.get(udc.value, 'barcode', '')
})

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

const onCloseUdc = function() {
  udc.value = {}
  location.value = {}
  item.value = {}
  lot.value = {}
}

const onUdcAssigned = function() {
  udc.value = {}
  location.value = {}
  item.value = {}
  lot.value = {}
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

const loadUdcData = function (udcBarcode) {
  serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: udcBarcode, options: { data: true }}, true).then(function(r) {
    const isUdc = _.get(r, 'data.labelTypeFound', false)
    const udcData = _.get(r, 'data.labelData', {})
    udc.value = udcData

    inputText.value = ''
  })
}

/* controlla una lettura effettuata tramite input o scanner */
const onCheckText = function (text) {
  /* se udc + vuoto allora controllo se sto leggendo un UDC */
  if (!udcRead.value) {
    serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: text, options: { data: true }}, true).then(function(r) {
      const isUdc = _.get(r, 'data.labelTypeFound', false)
      const udcData = _.get(r, 'data.labelData', {})
      udc.value = udcData

      inputText.value = ''
    })
  } else {
    serviceStore.apiCall(apiIdLabel, { check: ['LABEL_ITEM', 'LABEL_LOCATION'], barcode: text, options: {}}, true).then(function(r) {
      const labelType = _.get(r, 'data.labelType', '')

      /*
        se label type location vado ad inserire l'UDC nel vano e lo chiudo (chiedo conferma?)
      */
      /*
      se label ean item chiedo quantità e inserisco l'articolo / lotto nell'udc
      */
      if (labelType === 'LABEL_LOCATION') {
        const locationId = _.get(r, 'data.labelData.locationId', 0)
        location.value = _.get(r, 'data.labelData', {})
        udcLocationDialogShow.value = true
      }
      if (labelType === 'LABEL_ITEM') {
        item.value = _.get(r, 'data.labelData.item', {})
        lot.value = _.get(r, 'data.labelData.lot', {})
        itemDialogShow.value = true
      }
    })
  }
}

const onBatteryStatus = function(status) {
  batteryStatusLevel.value = status.level
  batteryStatusPlugged.value = status.isPlugged
}

const onVibrate = function () {
  navigator.vibrate([200, 500, 200, 500])
}

const onScan = function() {
  window.broadcaster.fireNativeEvent( 'com.symbol.datawedge.api.ACTION', true, {
    'com.symbol.datawedge.api.SOFT_SCAN_TRIGGER': 'START_SCANNING',
    'SEND_RESULT': true
  })
}

const onDeleteItem = function(item) {
  q$.dialog({
    title: 'Conferma eliminazione',
    message: `Eliminare l'articolo ${item.codArticolo} ${item.descrArticolo} dall'UDC ${udcBarcode.value}?`,
    cancel: {
      label: 'Annulla',
      'no-caps': true
    },
    ok: {
      label: 'Elimina',
      push: true,
      icon: 'fal fa-trash-alt',
      color: 'negative',
      'no-caps': true
    },
    persistent: true
  }).onOk( async () => {
    const r = await serviceStore.apiCall(apiUdcDelItem, { id: item.id }, true)

    const result = _.get(r, 'data.result', false)
    const resultMessage = _.get(r, 'data.message', '')

    loadUdcData(udc.value.barcode)
  })
}

const onItemAssigned = function () {
  loadUdcData(udc.value.barcode)
}
</script>
