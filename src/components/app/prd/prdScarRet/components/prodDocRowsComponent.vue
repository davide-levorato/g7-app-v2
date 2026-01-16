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
          <q-item-section side>
              <div class="text-right">Prel: {{ r.qtyCar }} {{ r.codUm }}</div>
              <div class="text-right">
                  Reso: {{ r.qtyScar }} {{ r.codUm }}
              </div>
              <div class="text-right q-py-xs">
                <q-btn flat no-caps icon="fal fa-box-arrow-up" label="Reso" @click="onScarItem(r)"></q-btn>
              </div>
          </q-item-section>
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

const emit = defineEmits(['selectDocRows', 'closeDoc', 'scarItem'])

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


const listStyle = computed(() => {
  const subTract = 170 + (props.showInput ? 55 : 0)
  const h = q$.screen.height - subTract
  return `width: 100%; height:${h}px;`
})

const onScarItem = function(r) {
  emit('scarItem', r)
}

</script>
