<template>
<q-list separator>
  <div class="row q-mt-sm">
    <div class="col-xs-5">
      <div><span class="text-h6">DDT {{ props.ddt.nroDdt }}</span></div>
      <div><span class="text-caption">Leggere UDC</span></div>
    </div>
    <div class="col-xs-4 text-right">
      <q-btn :disable="!ddtComplete.complete||props.ddt.stato==='C'" icon="fal fa-check-double" outline color="green-6" text-color="blue-4" label="Chiudi" size="md" @click="onCompleteDoc"></q-btn>
    </div>
    <div class="col-xs-3 text-right">
      <q-btn icon="fal fa-arrow-right-from-dotted-line" outline color="blue-4" text-color="blue-4" size="md" @click="onCloseDoc"></q-btn>
    </div>
  </div>
  <q-scroll-area :style="listStyle">
    <template v-for="r in ddtRows" :key="`wmDow${r.idRigaDdt}`">
      <q-item>
        <q-item-section>
          <q-item-label class="q-pa-none" style="height:30px; padding: 0px !important;">
            <div class="row no-wrap full-width">
              <div class="col-xs-6 text-left q-py-xs"><span class="text-bold">{{ r.codArticolo }}</span> {{ r.codLotto }}</div>
              <div :class="'col-xs-3 text-right q-py-xs q-pr-xs ' + (r.qta===r.qtaCar?'bg-green-3':'bg-red-3')" style="border:1px solid #cdcdcd;">{{ r.qta }} {{ r.codUm }}</div>
              <div :class="'col-xs-3 text-right q-py-xs q-pr-xs ' + (r.qta===r.qtaCar?'bg-green-3':'bg-red-3')" style="border:1px solid #cdcdcd;">{{ r.qtaCar }} {{ r.codUm }}</div>
            </div>
          </q-item-label>
          <q-item-label caption>{{ r.descrRigaDdt }}</q-item-label>
          <q-item-label caption v-if="!_.isEmpty(r.note)">{{ r.note }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-scroll-area>
</q-list>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import dayJs from 'dayjs'
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useServiceStore } from 'stores/service'

import { apiInboundDocComplete } from 'api/mag'
const serviceStore = useServiceStore()

const emit = defineEmits(['selectDocRows', 'closeDoc', 'completeDoc'])

const q$ = useQuasar()

const props = defineProps({
  ddt: { type: Object, default: function () { return {}} },
  ddtRows: { type: Object, default: function () { return {}}},
  ddtComplete: { type: Object, default: function () { return {}}},
  showInput: { type: Boolean, default: false }
})

onMounted(() => {

})

const onCloseDoc = function () {
  emit('closeDoc')
}

const listStyle = computed(() => {
  const subTract = 170 + (props.showInput ? 55 : 0)
  const h = q$.screen.height - subTract
  return `width: 100%; height:${h}px;`
})

const onCompleteDoc = function () {
  q$.dialog({
    title: 'Conferma chiusura bolla',
    message: `<div>Chiudere la bolla <span class="text-bold">${props.ddt.nroDdt}</span>?</div>
              <div class="q-mt-md q-pa-sm bg-orange-6 text-center">Il documento non potrà essere riaperto</div>`,
    html: true,
    cancel: {
      label: 'Annulla',
      'no-caps': true
    },
    ok: {
      label: 'Conferma',
      push: true,
      icon: 'fal fa-check-double',
      color: 'green-6',
      'no-caps': true
    },
    persistent: true
  }).onOk( async () => {
    const r = await serviceStore.apiCall(apiInboundDocComplete, { nroDdt: props.ddt.nroDdt }, true)

    emit('completeDoc')
  })
}

</script>
