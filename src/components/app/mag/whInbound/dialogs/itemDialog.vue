<template>
  <q-dialog persistent v-model="dlgModel">
    <q-card flat :style="q$.screen.lt.sm?'width:95vw;min-width:95vw':'width:85vw;min-width:85vw'">
      <q-card-section class="bg-grey-4 q-pa-sm">
        <span class="text-subtitle2">Assegna Articolo a UDC</span>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <span class="text-subtitle2">
              Assegnare articolo {{itemCode}} all'UDC {{ udcBarcode }}
            </span>
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Cod Articolo
                  </q-item-label>
                  <q-item-label class="text-bold">
                    {{ item.codArticolo }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Descr Articolo
                  </q-item-label>
                  <q-item-label class="text-bold">
                    {{ item.descrArticolo }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Lotto
                  </q-item-label>
                  <q-item-label class="text-bold">
                    {{ lot.codLotto }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <q-input autofocus outlined v-model.number="r$.$value.itemQty" label="Quantità" :error="formField.error(r$, 'itemQty')" :error-message="formField.message(r$, 'itemQty')" ></q-input>
          </div>
        </div>
        <div v-if="!result" class="row">
          <div class="col-xs-12 q-px-sm">
           <q-banner rounded dense class="bg-red-6 text-white">
              <template v-slot:avatar>
                <q-icon name="fal fa-exclamation-triangle" color="white"/>
              </template>
              {{ resultMessage }}
            </q-banner>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn no-caps label="Annulla" @click="onCancel"></q-btn>
        <q-btn no-caps icon="fal fa-save" color="green-6" label="Assegna" @click="onAssignItem"></q-btn>
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

import { useRegle } from '@regle/core'
import { required, minValue, maxValue, number, withMessage } from '@regle/rules'
import { useFormField } from 'src/components/common/form/useFormField'
import { useI18n } from 'vue-i18n'

import { apiUdcSetItem } from 'api/mag'

const props = defineProps({
  docRowData: {
    type: Object,
    default: function() { return {}}
  },
  udc: {
    type: Object,
    default: function() { return {}}
  },
  item: {
    type: Object,
    default: function() { return {}}
  },
  lot: {
    type: Object,
    default: function() { return {}}
  }
})

const emit = defineEmits(['itemAssigned'])
const { t } = useI18n({ useScope: 'global' })
const formField = useFormField()

const formState = {
  itemQty: null
}

const validators = {
  itemQty: {
    required: withMessage(required, t('common.form.val.txtRequired')),
    number: withMessage(number, t('common.form.val.txtNumber')),
    minValue: withMessage(minValue(.01), t('common.form.val.minValue', { val: .01 })),
    maxValue: withMessage(maxValue(1000000), t('common.form.val.maxValue', { val: 1000000 })),
  }
}

const { r$ } = useRegle(
  formState,
  validators,
  {
    autoDirty: false
  }
)

const q$ = useQuasar()
const serviceStore = useServiceStore()

const dlgModel = defineModel()

const result = ref(true)
const resultMessage = ref('')

const udcBarcode = computed(() => {
  return _.get(props.udc, 'barcode', '')
})

watch(dlgModel, function(v) {
  if (v) {
    result.value = true
    resultMessage.value = ''

    r$.$value.itemQty = props.item.qtaRes
    r$.$reset()
  }
})

const itemCode = computed(() => {
  return _.get(props.item, 'codArticolo', '')
})

const onCancel = function () {
  r$.$reset()
  r$.$value.itemQty = null
  dlgModel.value = false
}

const onAssignItem = async function () {
  const { valid, data } = await r$.$validate()

  result.value = true
  resultMessage.value = ''

  if (valid) {
    const r = await serviceStore.apiCall(apiUdcSetItem, {
      udcId: props.udc.id,
      itemId: props.item.idArticolo,
      lotId: props.lot.idLotto ? props.lot.idLotto : null,
      qty: data.itemQty,
      nroDdt: props.docRowData.nroDdt,
      idRigaDdt: props.docRowData.idRigaDdt
    }, true)

    result.value = _.get(r, 'data.result', false)
    resultMessage.value = _.get(r, 'data.message', '')

    if (result.value) {
      r$.$reset()
      r$.$value.itemQty = null
      emit('itemAssigned')
      dlgModel.value = false
    }
  }
}
</script>
