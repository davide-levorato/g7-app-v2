<template>
<q-toolbar>
  <!-- <q-btn flat dense icon="fal fa-sync" @click="refreshData"></q-btn>-->
  <div class="text-center text-body2">LP {{ doc.id }} del {{ dayJs(doc.dataDoc).format('DD/MM/YYYY') }} Linea {{ doc.codLinea }}</div>
  <q-space></q-space>
  <q-btn icon="fal fa-arrow-right-from-dotted-line" outline color="blue-4" text-color="blue-4" size="md" @click="onCloseDoc"></q-btn>
</q-toolbar>
<q-scroll-area :style="areaStyle">
  <q-card>
    <q-card-section class="q-py-xs q-px-none">
      <q-list separator>
        <template v-for="r in docRows" :key="`wmDoc${r.idRigaDdt}`">
          <q-item clickable @click="onWmsItem(r)" style="padding-right:2px;">
            <q-item-section thumbnail>
              <q-icon name="fal fa-box-magnifying-glass" size="xs"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-pa-none" style="height:30px; padding: 0px !important;">
                <div class="row no-wrap full-width" >
                  <div class="col-xs-4 text-left q-py-xs"><span class="text-bold">{{ r.codArticolo }}</span></div>
                  <div :class="'col-xs-4 text-right q-py-xs q-pr-xs ' + (r.qta===r.qtaLetta?'bg-green-3':'bg-red-3')" style="border:1px solid #cdcdcd;">{{ _.round(r.qta, 0) }} {{ r.codUm }}</div>
                  <div :class="'col-xs-4 text-right q-py-xs q-pr-xs ' + (r.qta===r.qtaLetta?'bg-green-3':(r.qtaLetta>0?'bg-orange-3':''))" style="border:1px solid #cdcdcd;">{{ _.round(r.qtaLetta, 0) }} {{ r.codUm }}</div>
                </div>
              </q-item-label>
              <q-item-label caption>{{ r.descrArticolo }}</q-item-label>
              <q-item-label caption v-if="!_.isEmpty(r.note)">{{ r.note }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-card-section>
  </q-card>
  <wms-item-dialog v-model="wmsItemDialogShow" :doc="doc" :item="wmsItem"></wms-item-dialog>
</q-scroll-area>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import dayJs from 'dayjs'
import { useQuasar } from 'quasar'
import { ref, onMounted, computed } from 'vue'

import wmsItemDialog from '../dialogs/wmsItemDialog.vue'

const q$ = useQuasar()

const emit = defineEmits(['selectDocRows', 'closeDoc', 'refreshData'])

const props = defineProps({
  doc: { type: Object, default: function () { return {}} },
  docRows: { type: Object, default: function () { return {}}}
})

onMounted(() => {

})

const areaStyle = computed(() => {
  const subTract = 170
  const h = q$.screen.height - subTract
  return `width: 100%; height:${h}px;`
})

const wmsItemDialogShow = ref(false)
const wmsItem = ref({})

const onCloseDoc = function () {
  emit('closeDoc')
}

const refreshData = function () {

}

const onWmsItem = function(item) {
  wmsItem.value = {
    idArticolo: item.idArticolo,
    codArticolo: item.codArticolo,
    descrArticolo: item.descrArticolo
  }
  wmsItemDialogShow.value = true
}
</script>
