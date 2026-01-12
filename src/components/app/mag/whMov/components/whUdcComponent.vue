<template>
  <div class="row q-mt-sm">
    <div class="col-xs-9 text-left self-center">
      <div>
        <span class="text-bold text-subtitle2">UDC: {{ udc.barcode }}</span>
        <span v-if="udc.status === 'W'" class="q-ml-sm">Vano: {{  udc.location.barcode }}</span>
        <span v-if="udc.status === 'G' || udc.status === 'N'" class="q-ml-sm"> A TERRA</span>
      </div>
    </div>
    <div class="col-xs-3 text-right">
      <q-btn icon="fal fa-arrow-right-from-dotted-line" outline color="blue-4" text-color="blue-4" size="md" @click="onCloseUdc"></q-btn>
    </div>
  </div>
  <div class="row">
    <div class="col-xs-12">
      <q-list bordered separator class="q-mt-sm">
        <q-item v-for="item in udc.items" :key="item.id" style="padding-left:2px;">
          <q-item-section>
            <q-item-label>
              {{ item.codArticolo }} {{ item.codLotto }}
            </q-item-label>
            <q-item-label caption>
              {{ item.descrArticolo }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
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
  udc: { type: Object, default: function () { return {}} }
})

const onCloseUdc = function () {
  emit('closeUdc')
}
</script>
