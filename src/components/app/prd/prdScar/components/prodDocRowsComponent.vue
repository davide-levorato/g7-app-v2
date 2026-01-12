<template>
<q-list separator>
  <div class="row q-mt-sm">
    <div class="col-xs-9">
      <div><span class="text-h6">Linea {{ props.doc.codLinea }}</span></div>
    </div>
    <div class="col-xs-3 text-right">
      <q-btn icon="fal fa-arrow-right-from-dotted-line" outline color="blue-4" text-color="blue-4" size="md" @click="onCloseDoc"></q-btn>
    </div>
  </div>
  <div class="row q-mt-sm">
    <div class="col-xs-12 text-caption">
      <span class="text-bold">{{ props.doc.codArticolo }}</span>
    </div>
  </div>
  <div class="row q-mt-sm">
    <div class="col-xs-12 text-caption">
      <span class="">{{ doc.descrArticolo }}</span>
    </div>
  </div>
  <div class="text-caption text-center q-pa-md">
    <span>Leggere Etichetta articolo</span>
  </div>
  <q-scroll-area :style="listStyle">
    <q-list separator>
      <template v-for="r in docRows" :key="`wmDow${r.idRigaDdt}`">
        <q-item>
          <q-item-section>
            <q-item-label caption>Articolo</q-item-label>
            <q-item-label>{{ r.codArticolo }}</q-item-label>
            <q-item-label>{{ r.descrArticolo }}</q-item-label>
            <q-item-label caption>Lotto</q-item-label>
            <q-item-label>{{ r.codLotto }}</q-item-label>
          </q-item-section>
          <q-item-section-side>
            <div class="row no-wrap">
              <div class="col-xs-6 text-bold">{{ r.qty }} {{ r.codUm }}</div>
              <div class="col-xs-6">
                <q-btn flat icon="fal fa-trash-alt" color="red-6" @click="onDeleteItem(r)"></q-btn>
              </div>
            </div>
          </q-item-section-side>
        </q-item>
      </template>
    </q-list>
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

const serviceStore = useServiceStore()
import { apiDelData } from 'api/data'

const emit = defineEmits(['selectDocRows', 'closeDoc', 'deleteItem'])

const q$ = useQuasar()

const props = defineProps({
  doc: { type: Object, default: function () { return {}} },
  docRows: { type: Object, default: function () { return {}}}
})

onMounted(() => {

})

const onCloseDoc = function () {
  emit('closeDoc')
}

const onDeleteItem = function (item) {
  q$.dialog({
    title: 'Conferma eliminazione',
    message: `Eliminare la lettura?`,
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
    serviceStore.apiCall(apiDelData, { obj: 'WMS_PROD_DOC_ITEMS', recordId: item.id, params: {}}, true).then(function() {
      emit('deleteItem')
    })
  })
}

const listStyle = computed(() => {
  const subTract = 170 + (props.showInput ? 55 : 0)
  const h = q$.screen.height - subTract
  return `width: 100%; height:${h}px;`
})

</script>
