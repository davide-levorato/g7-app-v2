<template>
  <q-dialog persistent v-model="dlgModel">
    <q-card flat :style="q$.screen.lt.sm?'width:95vw;min-width:95vw':'width:85vw;min-width:85vw'">
      <q-card-section class="bg-grey-4 q-pa-sm">
        <span class="text-subtitle2">UDC {{ udcBarcode }} {{ transactionType.label }}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row q-mt-sm" v-if="!_.isEmpty(item)">
          <div class="col-xs-12 q-px-sm">
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-bold">
                    {{ item.codArticolo }} {{ item.codLotto }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ item.descrArticolo }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  {{ item.qty }} {{ item.umGestione }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <!-- il template viene visualizzato solo se spostamento a vano ammesso -->
        <template v-if="transactionType.loading">
          <div class="row q-mt-sm q-pa-none">
            <div class="col-xs-6 q-px-sm self-center">
              <q-input autofocus dense outlined v-model="itemTarget" hide-bottom-space label="Articolo"></q-input>
            </div>
            <div class="col-xs-6 q-px-sm self-center">
              <q-input dense autofocus outlined v-model.number="r$.$value.itemQty" hide-bottom-space label="Quantità caricata" :error="formField.error(r$, 'itemQty')" :error-message="formField.message(r$, 'itemQty')" ></q-input>
            </div>
          </div>
          <div class="row q-mt-sm q-pa-none" v-if="itemTargetData.item">
            <div class="col-xs-12 q-px-sm self-center">
              {{ itemTargetData.item.codArticolo }} {{ itemTargetData.item.descrArticolo }} {{ itemTargetData.lot.codLotto }}
            </div>
          </div>
        </template>
        <template v-if="transactionType.location">
          <div class="row q-mt-sm q-pa-none">
            <div class="col-xs-12 q-px-sm self-center">
              <q-input autofocus outlined v-model="locationTarget" hide-bottom-space label="Vano Trasferimento"></q-input>
            </div>
          </div>
        </template>
        <!-- il template viene visualizzato solo se picking ammesso -->
        <template v-if="transactionType.picking">
          <div class="row q-mt-sm q-pa-none">
            <div class="col-xs-6 q-px-sm text-left self-center">
              <q-toggle keep-color dense v-model="picking" label="Picking" color="green-6"></q-toggle>
            </div>
            <div class="col-xs-6 q-px-sm self-center">
              <q-input dense :disable="!picking" :autofocus="!picking" outlined v-model.number="r$.$value.itemQty" hide-bottom-space label="Quantità prelevata" :error="formField.error(r$, 'itemQty')" :error-message="formField.message(r$, 'itemQty')" ></q-input>
            </div>
          </div>
          <div v-if="picking" class="row q-mt-sm q-pa-none">
            <div class="col-xs-12 q-px-sm self-center">
              <q-input autofocus outlined v-model="udcTargetPicking" hide-bottom-space label="UDC Trasferimento"></q-input>
            </div>
          </div>
        </template>
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
        <q-btn no-caps icon="fal fa-save" color="green-6" label="Preleva" @click="onAssignItem"></q-btn>
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

import { apiMagMov } from 'api/mag'

const props = defineProps({
  udc: {
    type: Object,
    default: function() { return {}}
  },
  transactionType: {
    type: Object,
    default: function() { return {}}
  },
  locationData: {
    type: Object,
    default: function() { return {}}
  },
  itemData: {
    type: Object,
    default: function() { return {}}
  },
  udcPickingData: {
    type: Object,
    default: function() { return {}}
  }
})

const emit = defineEmits(['itemAssigned', 'cancel'])
const { t } = useI18n({ useScope: 'global' })
const formField = useFormField()

const formState = {
  itemQty: null
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

const udcBarcode = computed(() => {
  return _.get(props.udc, 'barcode', '')
})

const item = ref({})
const itemList = ref({})

const picking = ref(false)

const locationTargetData = ref({})
const locationTarget = ref('')

const itemTargetData = ref({})
const itemTarget = ref('')

const udcTargetPickingData = ref({})
const udcTargetPicking = ref('')

watchEffect(() => {
  locationTarget.value = props.locationData.barcode ? props.locationData.barcode : ''
  locationTargetData.value = props.locationData.barcode ? props.locationData : {}

  itemTarget.value = props.itemData.item ? (props.itemData.item.codArticolo + ' - ' + props.itemData.lot.codLotto) : ''
  itemTargetData.value = props.itemData.item ? props.itemData : {}

  udcTargetPicking.value = props.udcPickingData.barcode ? props.udcPickingData.barcode : ''
  udcTargetPickingData.value = props.udcPickingData.barcode ? props.udcPickingData : {}
})

watch(dlgModel, function(v) {
  if (v) {
    result.value = true
    resultMessage.value = ''

    r$.$reset()

    const udcItems = _.get(props.udc, 'items', [])
    if (!_.isEmpty(udcItems)) {
      item.value = udcItems[0]
    }

    /* se  UDC in mag e causale mag vuota abilito di default ground */
    if (!_.isEmpty(item.value)) {
      r$.$value.itemQty = item.value.qty
      validators.itemQty.maxValue = withMessage(maxValue(item.value.qty), t('common.form.val.maxValue', { val: item.value.qty }))
    }
  }
})

const onCancel = function () {
  r$.$reset()
  r$.$value.itemQty = null

  picking.value = false

  locationTargetData.value = {}
  locationTarget.value = ''

  itemTargetData.value = {}
  itemTarget.value = ''

  udcTargetPickingData.value = {}
  udcTargetPicking.value = ''

  dlgModel.value = false
  emit('cancel')
}

const onAssignItem = async function () {
  const { valid, data } = await r$.$validate()

  result.value = true
  resultMessage.value = ''

  if (valid) {
    const p = {
      transactionTypeId: props.transactionType.id,
      idUdc: props.udc.id,
      qta: r$.$value.itemQty,
      picking: picking.value,
      udcPickingData: udcTargetPickingData.value,
      locationData: locationTargetData.value,
      itemData: itemTargetData.value
    }

    const r = await serviceStore.apiCall(apiMagMov, p, true)

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
