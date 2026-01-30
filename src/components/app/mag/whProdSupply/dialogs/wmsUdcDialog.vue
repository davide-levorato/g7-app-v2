<template>
  <q-dialog persistent v-model="dlgModel">
    <q-card flat :style="q$.screen.lt.sm?'width:95vw;min-width:95vw':'width:85vw;min-width:85vw'">
      <q-card-section class="bg-grey-4 q-pa-sm">
        <span class="text-subtitle2">Preleva UDC {{ udcBarcode }}</span>
        <span v-if="picking" class="q-ml-sm text-subtitle2">PICKING</span>
        <span v-else class="q-ml-sm text-subtitle2">COMPLETO</span>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <q-banner dense v-if="!itemInList" class="text-center bg-orange-6 text-black">Articolo fuori lista</q-banner>
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
                    {{ item.codLotto }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="itemInList">
                <q-item-section>
                  <q-item-label caption>
                    Qta residua in lista
                  </q-item-label>
                  <q-item-label class="text-bold">
                    {{ itemList.qtaRes }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="row q-mt-sm q-pa-none">
          <div class="col-xs-6 q-px-sm text-center self-center">
            <q-toggle keep-color dense v-model="picking" label="Picking" color="green-6"></q-toggle>
          </div>
          <div class="col-xs-6 q-px-sm self-center">
            <q-input :disable="!picking" :autofocus="!picking" outlined v-model.number="r$.$value.itemQty" hide-bottom-space label="Quantità prelevata" :error="formField.error(r$, 'itemQty')" :error-message="formField.message(r$, 'itemQty')" ></q-input>
          </div>
        </div>
        <div v-if="picking" class="row q-mt-sm q-pa-none">
          <div class="col-xs-12 q-px-sm self-center">
            <q-input autofocus outlined v-model="udcTargetPicking" hide-bottom-space label="UDC Trasferimento" @update:model-value="onUpdateUDCPicking"></q-input>
            <div class="q-px-sm q-py-sm text-bold" v-if="!_.isEmpty(udcTargetPickingData)">{{ udcTargetPickingData.barcode }}</div>
          </div>
        </div>
        <div class="row q-mt-sm items-center">
          <div class="col-xs-6 q-px-sm">
            <q-toggle v-model="printLabels" label="St etichette"></q-toggle>
          </div>
          <div class="col-xs-6 q-px-sm">
            <q-input autofocus outlined v-model.number="labelNumber" label="Num etich"></q-input>
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
        <q-btn no-caps :disable="assigning" icon="fal fa-save" color="green-6" label="Preleva" @click="onAssignItem"></q-btn>
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

import { apiIdLabel, apiUdcDelItem } from 'api/mag'

import { useRegle } from '@regle/core'
import { required, minValue, maxValue, number, withMessage } from '@regle/rules'
import { useFormField } from 'src/components/common/form/useFormField'
import { useI18n } from 'vue-i18n'

import { apiLpSetItem } from 'api/mag'

const props = defineProps({
  docData: {
    type: Object,
    default: function() { return {}}
  },
  docRowData: {
    type: Object,
    default: function() { return {}}
  },
  udc: {
    type: Object,
    default: function() { return {}}
  },
  docItems: {
    type: Object,
    default: function() { return {}}
  },
  udcPickingData: {
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

const assigning = ref(false)

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

const itemInList = ref(false)
const picking = ref(false)

const udcTargetPicking = ref('')
const udcTargetPickingData = ref({})

const printLabels = ref(true)
const labelNumber = ref(1)

watchEffect(() => {
  udcTargetPicking.value = props.udcPickingData.barcode ? props.udcPickingData.barcode : ''
})

watch(dlgModel, function(v) {
  if (v) {
    result.value = true
    resultMessage.value = ''
    assigning.value = false

    r$.$reset()

    /*
      controllo che l'udc contenga uno degli articoli in lista
      se non ne contiene neanche uno avviserò l'utente per l'aggiunta dell'articolo alla lista
    */
    const udcItems = _.get(props.udc, 'items', [])
    item.value = udcItems[0]

    r$.$value.itemQty = item.value.qty

    const udcItemsInListArray = _.intersectionWith(udcItems, props.docItems, function(u, d) {
      return u.itemId === d.idArticolo
    })

    itemInList.value = !_.isEmpty(udcItemsInListArray)
    if (itemInList.value) {
      const idx = _.findIndex(props.docItems, function (i) {
        return i.idArticolo === item.value.itemId
      })
      if (idx !== -1) {
        itemList.value = props.docItems[idx]
      }
    }

    validators.itemQty.maxValue = withMessage(maxValue(item.value.qty), t('common.form.val.maxValue', { val: item.value.qty }))
  }
})

const onCancel = function () {
  r$.$reset()
  r$.$value.itemQty = null

  dlgModel.value = false
}

const onUpdateUDCPicking = function(udc) {
  serviceStore.apiCall(apiIdLabel, { check: ['LABEL_UDC'], barcode: udc, options: { data: true }}, true).then(function(r) {
    const labelType = _.get(r, 'data.labelType', '')

    if (labelType === 'LABEL_UDC') {
      udcTargetPickingData.value = _.get(r, 'data.labelData', {})
      udcTargetPicking.value = _.get(r, 'data.labelData.barcode', '')
    }
  })
}

const onAssignItem = async function () {
  const { valid, data } = await r$.$validate()

  result.value = true
  resultMessage.value = ''

  if (valid) {
    assigning.value = true
    const p = {
      idLista: props.docData.id,
      idUdcPrelievo: props.udc.id,
      idArticolo: item.value.itemId,
      qta: r$.$value.itemQty,
      picking: picking.value,
      udcPicking: udcTargetPicking.value,
      print: { printLabels: printLabels.value, labelNumber: labelNumber.value }
    }
    //
    const r = await serviceStore.apiCall(apiLpSetItem, p, true)

    result.value = _.get(r, 'data.result', false)
    resultMessage.value = _.get(r, 'data.message', '')

    assigning.value = false

    if (result.value) {
      r$.$reset()
      r$.$value.itemQty = null
      emit('itemAssigned')
      dlgModel.value = false
    }
  }
}
</script>
