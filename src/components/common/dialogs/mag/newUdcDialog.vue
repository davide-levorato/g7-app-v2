<template>
  <q-dialog persistent v-model="dlgModel">
    <q-card flat :style="q$.screen.lt.sm?'width:95vw;min-width:95vw':'width:85vw;min-width:85vw'">
      <q-card-section class="bg-grey-4 q-pa-sm">
        <span class="text-h6">Nuovi UDC</span>
      </q-card-section>
      <q-card-section class="q-pa-xs">
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <q-input autofocus outlined label="UDC da stampare" name="udcQty" v-model.number="r$.$value.udcQty" :error="formField.error(r$, 'udcQty')" :error-message="formField.message(r$, 'udcQty')" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"></q-input>
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-xs-12 q-px-sm">
            <q-select outlined :options="printers" v-model="r$.$value.selectedPrinterName"
            label="Stampante" emit-value option-value="name" option-label="label" map-options
            :error="formField.error(r$, 'selectedPrinterName')" :error-message="formField.message(r$, 'selectedPrinterName')"></q-select>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn no-caps label="Annulla" @click="onCancel"></q-btn>
        <q-btn no-caps icon="fal fa-print" label="Stampa" @click="onPrint"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import _ from 'lodash'
import { useQuasar } from 'quasar'
import { useRegle } from '@regle/core'
import { required, minValue, maxValue, withMessage } from '@regle/rules'
import { useFormField } from 'src/components/common/form/useFormField'
import { useI18n } from 'vue-i18n'
import { useServiceStore } from 'src/stores/service.js'
import { apiPrintUdc } from 'api/mag'

const q$ = useQuasar()

const serviceStore = useServiceStore()

const printers = serviceStore.user.printers
const { t } = useI18n({ useScope: 'global' })
const dlgModel = defineModel()

const formField = useFormField()

const validators = {
  udcQty: {
    required: withMessage(required, t('common.form.val.txtRequired')),
    minValue: withMessage(minValue(1), t('common.form.val.minValue', { val: 1 })),
    maxValue: withMessage(maxValue(100), t('common.form.val.maxValue', { val: 100 })),
  },
  selectedPrinterName: {
    required: withMessage(required, t('common.form.val.txtRequired'))
  }
}

const formState = ref({
  udcQty: 1,
  selectedPrinterName: _.get(serviceStore, 'user.settings.selectedPrinterName', null)
})

const { r$ } = useRegle(
  formState,
  validators,
  {
    autoDirty: false
  }
)

watch(dlgModel, function(v) {
  if (v === true) {
    r$.$value.udcQty = 1
    r$.$reset()
  }
})

const onCancel = function () {
  r$.$reset()
  dlgModel.value = false
}

const onPrint = async function () {
  const { valid, data } = await r$.$validate()

  if (valid) {
    q$.loading.show()
    await serviceStore.saveSettings({ selectedPrinterName: data.selectedPrinterName })
    await serviceStore.apiCall(apiPrintUdc, { udcQty: data.udcQty, printerName: data.selectedPrinterName }, true)
    q$.loading.hide()
    r$.$reset()
    dlgModel.value = false
  }
}

</script>
