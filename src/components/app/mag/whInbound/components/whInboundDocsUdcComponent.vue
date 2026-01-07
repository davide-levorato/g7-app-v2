<template>
  <div class="row q-mt-sm">
    <div class="col-xs-9">
      <div><span class="text-h6">UDC: {{ udc.barcode }}</span></div>
      <div><span class="text-caption">Leggere etichetta articolo</span> <span class="text-caption" v-if="!_.isEmpty(udc.items)"> o vano</span></div>
    </div>
    <div class="col-xs-3 text-right">
      <q-btn icon="fal fa-arrow-right-from-dotted-line" outline color="blue-4" text-color="blue-4" size="md" @click="onCloseUdc"></q-btn>
    </div>
  </div>
  <div class="row">
    <div class="col-xs-12">
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
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import { useServiceStore } from 'stores/service'
import { useQuasar } from 'quasar'

import { apiUdcDelItem } from 'api/mag'

const serviceStore = useServiceStore()
const q$ = useQuasar()

const emit = defineEmits(['updateUdc', 'closeUdc'])

const props = defineProps({
  ddt: { type: Object, default: function () { return {}} },
  udc: { type: Object, default: function () { return {}} }
})

const onDeleteItem = function(item) {
  q$.dialog({
    title: 'Conferma eliminazione',
    message: `Eliminare l'articolo ${item.codArticolo} ${item.descrArticolo} dall'UDC ${props.udc.barcode}?`,
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
    /* const r = */ await serviceStore.apiCall(apiUdcDelItem, { id: item.id }, true)

    emit('updateUdc')
  })
}

const onCloseUdc = function () {
  emit('closeUdc')
}
</script>
