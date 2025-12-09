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
      <q-btn label="vib" @click="onVibrate"></q-btn>
      <div>
        <span class="text-h6">
          <pre>{{ debugScan }}</pre>
        </span>
      </div>
      <!-- <div v-for="(k, idx) in debugScanKeys" :key="'k' + idx">
        <div>{{ k }}</div>
        <div style="border-bottom:1px solid #000000;">K: {{ debugScan[k] }}</div>
      </div>
    -->
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
                  <q-item clickable>
                    <q-item-section avatar>
                      <q-icon name="fal fa-camera"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Esci</q-item-label>
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
  </q-page>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import { ref, onMounted, onUnmounted } from 'vue'
import { useServiceStore } from 'stores/service'
import { apiIdLabel } from 'api/mag'

import newUdcDialog from './dialogs/newUdcDialog.vue'

const serviceStore = useServiceStore()

const showInput = ref(false)
const inputText = ref('')
const newUdcDialogShow = ref(false)

const batteryStatusLevel = ref(0)
const batteryStatusPlugged = ref(false)

const debugText = ref('')
const debugScan = ref({})
const debugScanKeys = ref([])

onMounted(() => {
  // document.addEventListener('deviceready', () => {
  // window.addEventListener('batterystatus', onBatteryStatus, false)
  // }, false)
  // window.broadcaster.addEventListener('it.g7gelati.tapp.ACTION', true, onScanTextReceived);

  debugText.value = 'mounted'
})

onUnmounted (() => {
  window.removeEventListener('batterystatus', onBatteryStatus)
})

const onNewUdc = function() {
  newUdcDialogShow.value = true
}

const onSwitchInput = function () {
  showInput.value = !showInput.value
}

const onReadText = function () {
  serviceStore.apiCall(apiIdLabel, { check: ['LABEL_LOCATION'], barcode: inputText.value}, true).then(function(r) {
    debugScan.value = r.data
  })
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

const onScanTextReceived = function(e) {
  debugScan.value = e
  debugScanKeys.value = _.keys(e)
  navigator.vibrate([200, 500, 200, 500])
}
</script>
