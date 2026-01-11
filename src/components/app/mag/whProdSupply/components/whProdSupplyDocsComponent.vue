<template>
  <q-toolbar>
    <q-btn flat dense icon="fal fa-sync" @click="refreshData"></q-btn>
    <q-select outlined dense label="Linea" v-model="lineaProd" class="q-ml-sm" style="width:120px;" :options="lineeProd" clearable emit-value map-options></q-select>
    <q-space></q-space>
    <q-checkbox v-model="docStatus" checked-icon="fal fa-lock-open" unchecked-icon="fal fa-lock" :true-value="'C'"  :false-value="'A'" size="lg"/>
    <q-btn-toggle v-model="docType" toggle-color="teal" :options="[ { label: 'MP', value: 1 }, { label: 'IMB', value: 2 } ]"></q-btn-toggle>
  </q-toolbar>
  <div class="row q-mt-sm" v-if="_.isEmpty(prodSupplyDocs)">
    <div class="col-xs-12 text-center q-py-xl">
      <span class="text-grey-6 text-subtitle">Nessuna lista da visualizzare</span>
    </div>
  </div>
  <div class="row q-mt-sm" v-else>
    <div class="col-xs-12">
      <q-scroll-area :style="listStyle">
        <q-list separator>
          <template v-for="d in prodSupplyDocs" :key="`wmDoc${d.id}`">
            <q-item clickable @click="onSelectDoc(d)">
              <q-item-section avatar>
                <q-avatar>{{ d.codLinea }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>Lista n.: <span class="text-bold">{{ d.id }}</span> del {{ dayJs(d.dataDoc).format('DD/MM/YYYY') }}</q-item-label>
                <q-item-label>Qta lista.: {{ _.round(d.qtaTotLista, 0) }} / {{ _.round(d.qtaTotLetta, 0)  }}</q-item-label>
                <q-item-label>{{ d.tipoLp === 1 ? 'Materie prime' : 'Imballi' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon :name="d.stato==='C' ? 'fal fa-lock': 'fal fa-lock-open'" :color="d.stato==='C' ? 'red-6': 'green-6'"></q-icon>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import _ from 'lodash'
import dayJs from 'dayjs'
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar, LocalStorage } from 'quasar'
import { useServiceStore } from 'stores/service'

import { apiGetData } from 'api/data'

const emit = defineEmits(['selectDoc'])

const serviceStore = useServiceStore()

const q$ = useQuasar()

const prodSupplyDocs = ref([])

const listStyle = computed(() => {
  const subTract = 226
  const h = q$.screen.height - subTract
  return `width: 100%; height:${h}px;`
})

const lineaProd = ref()
const docType = ref(LocalStorage.getItem('lpType') ? LocalStorage.getItem('lpType') : 1)
const docStatus = ref(LocalStorage.getItem('lpStatus') ? LocalStorage.getItem('lpStatus') : 'A')

const lineeProd = ref([
  { value: 'L01', label: 'L01' },
  { value: 'L02', label: 'L02' },
  { value: 'L03', label: 'L03' },
  { value: 'L04', label: 'L04' },
  { value: 'L05', label: 'L05' },
  { value: 'L06', label: 'L06' },
  { value: 'L0A', label: 'L0A' },
  { value: 'L0C', label: 'L0C' },
  { value: 'L0F', label: 'L0F' },
  { value: 'L0H', label: 'L0H' }
])

onMounted(() => {
  refreshData()
})

watch(docType, function (v) {
  LocalStorage.set("lpType", v)
  refreshData()
})

watch(docStatus, function (v) {
  LocalStorage.set("lpStatus", v)
  refreshData()
})

watch(lineaProd, function () {
  refreshData()
})

const refreshData = function () {
  const f = {
    tipoLp: docType.value
  }

  if (docStatus.value === 'A') {
    f.stato = ['I', 'S']
  }

  if (lineaProd.value) {
    f.codLinea = lineaProd.value
  }

  serviceStore.apiCall(apiGetData, { obj: 'WH_PROD_SUPPLY_DOCS', q: { qS: '', gR: {}, qC: 'all', qF: f, qPg: { pN: 1, pS: 25 } }, gridRequest: false }, true).then(function(r) {
    prodSupplyDocs.value = _.get(r, 'rows', [])
  })
}

const onSelectDoc = function (doc) {
  emit('selectDoc', doc)
}
</script>
