<template>
<q-list separator>
  <q-item-label header>DDT {{ props.ddt.nroDdt }}</q-item-label>
  <div class="row q-mt-sm">
    <div class="col-xs-9">
      <div><span class="text-h6">DDT {{ props.ddt.nroDdt }}</span></div>
      <div><span class="text-caption">Leggere UDC</span></div>
    </div>
    <div class="col-xs-3 text-right">
      <q-btn icon="fal fa-arrow-right-from-dotted-line" outline color="blue-4" text-color="blue-4" size="md" @click="onCloseDoc"></q-btn>
    </div>
  </div>
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
</q-list>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import dayJs from 'dayjs'
import { ref, onMounted, computed } from 'vue'

const emit = defineEmits(['selectDocRows', 'closeDoc'])

const props = defineProps({
  ddt: { type: Object, default: function () { return {}} },
  ddtRows: { type: Object, default: function () { return {}}}
})

onMounted(() => {

})

const onCloseDoc = function () {
  emit('closeDoc')
}

</script>
