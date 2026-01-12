<template>
  <div class="row">
    <div class="col-xs-12">
      <q-list bordered separator class="q-mt-sm">
        <q-item v-for="d in docs" :key="d.id" style="padding-left:2px;" clickable @click="onSelectDoc(d)">
          <q-item-section>
            <q-item-label caption>
              Linea
            </q-item-label>
            <q-item-label>
              {{ d.codLinea }}
            </q-item-label>
            <q-item-label caption>
              Articolo:
            </q-item-label>
            <q-item-label>
              {{ d.codArticolo }} {{ d.descrArticolo }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="text-subtitle2 text-bold">
              {{ d.qta }} CT
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import _ from 'lodash'
import { useServiceStore } from 'stores/service'
import { useQuasar } from 'quasar'

import { apiGetData } from 'api/data'
import dayJs from 'dayjs'

const serviceStore = useServiceStore()
const q$ = useQuasar()

const emit = defineEmits(['selectDoc'])

const props = defineProps({
})

const docs = ref([])

onMounted(() => {
  const f = {
    dataY: dayJs().year(),
    dataM: dayJs().month() + 1,
    dataD: dayJs().date()
  }
  serviceStore.apiCall(apiGetData, { obj: 'PROD_PLAN', q: { qS: '', gR: {}, qC: 'all', qF: f, qPg: { pN: 1, pS: 250 } }, gridRequest: false }, true).then(function(r) {
    docs.value = _.get(r, 'rows', [])
  })
})

const onSelectDoc = function(doc) {
  emit('selectDoc', doc)
}
</script>
