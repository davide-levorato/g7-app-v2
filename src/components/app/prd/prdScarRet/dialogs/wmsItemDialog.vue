<template>
  <q-dialog persistent v-model="dlgModel">
    <q-card flat :style="q$.screen.lt.sm?'width:95vw;min-width:95vw':'width:85vw;min-width:85vw'">
      <q-card-section class="q-pa-xs">
        <div class="row q-mt-sm">
          <div class="col-xs-12">
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Articolo
                  </q-item-label>
                  <q-item-label class="text-bold">
                    {{ item.codArticolo }}
                  </q-item-label>
                  <q-item-label>
                    {{ item.descrArticolo }}
                  </q-item-label>
                  <q-item-label caption>
                    Lotto
                  </q-item-label>
                  <q-item-label class="text-bold">
                    {{ lot.codLotto }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="row q-mt-sm q-pa-none">
          <div class="col-xs-12 q-px-sm self-center">
            <q-input autofocus outlined v-model.number="r$.$value.itemQty" hide-bottom-space label="Quantità reso" :error="formField.error(r$, 'itemQty')" :error-message="formField.message(r$, 'itemQty')" >
              <template v-slot:append>
                {{ item.codUmGestione }}
              </template>
            </q-input>
          </div>
        </div>
        <div v-if="!result" class="row q-mt-sm">
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
        <q-btn no-caps icon="fal fa-save" color="green-6" label="Rendi" @click="onAssignItem"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, watch, computed, reactive, watchEffect } from 'vue'
import _ from 'lodash'
import { useQuasar } from 'quasar'
import { useServiceStore } from 'src/stores/service.js'

import { useRegle } from '@regle/core'
import { required, minValue, maxValue, number, withMessage } from '@regle/rules'
import { useFormField } from 'src/components/common/form/useFormField'
import { useI18n } from 'vue-i18n'

import { apiMagProdRet } from 'api/mag'

const props = defineProps({
  itemData: {
    type: Object,
    default: function() { return {}}
  }
})

const emit = defineEmits(['itemAssigned', 'cancel'])
const { t } = useI18n({ useScope: 'global' })
const formField = useFormField()

const formState = {
  itemQty: 0
}

const validators = reactive({
  itemQty: {
    required: withMessage(required, t('common.form.val.txtRequired')),
    number: withMessage(number, t('common.form.val.txtNumber')),
    minValue: withMessage(minValue(.01), t('common.form.val.minValue', { val: .01 })),
    maxValue: withMessage(maxValue(1000000), t('common.form.val.maxValue', { val: 1000000 })),
  }
})

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

const item = ref({})
const lot = ref({})

watchEffect(() => {
  item.value = props.itemData
})

watch(dlgModel, function(v) {
  if (v) {
    result.value = true
    resultMessage.value = ''

    r$.$reset()
  }
})

const onCancel = function () {
  r$.$reset()
  r$.$value.itemQty = null

  dlgModel.value = false
  emit('cancel')
}

const onAssignItem = async function () {
  const { valid, data } = await r$.$validate()

  result.value = true
  resultMessage.value = ''

  if (valid) {
    const p = {
      idPpt: item.value.idPpt,
      itemId: item.value.itemId,
      lotId: item.value.lotId ? item.value.lotId : null,
      qty: r$.$value.itemQty
    }

    const r = await serviceStore.apiCall(apiMagProdRet, p, true)

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
