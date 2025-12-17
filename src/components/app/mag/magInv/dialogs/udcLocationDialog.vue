<template>
  <q-dialog persistent v-model="dlgModel">
    <q-card flat :style="q$.screen.lt.sm?'width:95vw;min-width:95vw':'width:85vw;min-width:85vw'">
      <q-card-section class="bg-grey-4 q-pa-sm">
        <span class="text-subtitle2">Assegna UDC a vano</span>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <span class="text-subtitle2">
              Assegnare udc {{udcBarcode}} al vano {{ locationBarcode }}
            </span>
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-bold">
                    Zona
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{ props.location.zoneName }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-bold">
                    Corsia
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{ props.location.aisleName }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-bold">
                    Vano
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{ props.location.number }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-bold">
                    Piano
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <template v-if="props.location.rackLevels > props.location.level">
                      <q-select outlined options-cover :options="levelOptions" v-model="udcLevel"></q-select>
                    </template>
                    <template v-else>
                      {{ props.location.level }}
                    </template>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn no-caps label="Annulla" @click="onCancel"></q-btn>
        <q-btn no-caps icon="fal fa-save" color="green-6" label="Assegna" @click="onAssign"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, watch, computed } from 'vue'
import _ from 'lodash'
import { useQuasar } from 'quasar'
import { useServiceStore } from 'src/stores/service.js'
import { apiUdcSetLocation } from 'api/mag'

const props = defineProps({
  udc: {
    type: Object,
    default: function() { return {}}
  },
  location: {
    type: Object,
    default: function() { return {}}
  }
})

const q$ = useQuasar()
const serviceStore = useServiceStore()

const dlgModel = defineModel()

const udcBarcode = computed(() => {
  return _.get(props.udc, 'barcode', '')
})

const locationBarcode = computed(() => {
  return _.get(props.location, 'barcode', '')
})

const levelOptions = ref([])
const udcLevel = ref(0)

const emit = defineEmits(['udcAssigned'])

watch(dlgModel, function(v) {
  if (v) {
    const level = props.location.level
    const levels = props.location.rackLevels

    levelOptions.value = []
    udcLevel.value = level

    for (var i = level; i <= levels; i++) {
      levelOptions.value.push(i)
    }
  }
})

const onCancel = function () {
  dlgModel.value = false
}

const onAssign = function() {
  serviceStore.apiCall(apiUdcSetLocation, { udcId: props.udc.id, locationId: props.location.id }, true).then(function(r) {
    const res = _.get(r, 'data.result', false)
    if (res) {
      dlgModel.value = false
      emit('udcAssigned')
    }
  })
 }
</script>
