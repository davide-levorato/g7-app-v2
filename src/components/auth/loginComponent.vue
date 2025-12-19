<template>
    <q-page class="row no-wrap items-center justify-center bkg">
    <div class="col-xs-12 col-sm-7 col-md-5 col-lg-4 col-xl-3 q-pa-sm">
      <q-card bordered class="crd shadow-2 q-pt-lg q-pb-lg">
        <q-card-section v-if="showLoginError" class="col text-center q-py-none">
          <!--
          messaggio di errore
          -->
          <div class="row">
            <div class="col-xs-12 q-px-sm">
            <q-banner inline-actions class="text-white bg-red-6">
              Utente o password errati
            </q-banner>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
            <!-- Form di login -->
            <div class="row">
              <div class="col-xs-12 q-px-sm">
                <q-input autofocus outlined label="Utente" name="g7Username" v-model.trim="r$.$value.g7Username" :error="formField.error(r$, 'g7Username')" :error-message="formField.message(r$, 'g7Username')" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"></q-input>
              </div>
            </div>

            <div class="row q-mt-md">
              <div class="col-xs-12 q-px-sm">
                <q-input outlined label="Password" v-model.trim="r$.$value.g7Password" :error="formField.error(r$, 'g7Password')" :error-message="formField.message(r$, 'g7Password')" :type="showPassword ? 'text' : 'password'" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'fad fa-eye' : 'fad fa-eye-slash'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-xs-12 q-px-sm">
              <q-btn no-caps label="Login" color="brown-5" padding="md lg" class="full-width" @click="onSubmit"></q-btn>
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-xs-12 q-px-sm text-right text-caption text-grey-6">
              v. {{ applicationStore.appVersion }}
            </div>
          </div>
        </q-card-section>
        <q-resize-observer @resize="onCardResize" />
      </q-card>
    </div>
    <div class="col-xs-1 gt-sm text-center">
      <q-img contain basic style="max-width:110px;" src="/img/logo.png"/>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useRegle } from '@regle/core'
import { required, withMessage } from '@regle/rules'
import { useRoute, useRouter } from 'vue-router'
import { useServiceStore } from 'src/stores/service.js'
import { useApplicationStore } from 'src/stores/application.js'
import { useFormField } from 'src/components/common/form/useFormField'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()

const serviceStore = useServiceStore()
const applicationStore = useApplicationStore()

const infoCardHeight = ref(0)
const showLoginError = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const onCardResize = function (size) {
  infoCardHeight.value = size.height
}

const { t } = useI18n({ useScope: 'global' })
const formField = useFormField()

const validators = {
  g7Username: {
    required: withMessage(required, t('common.form.val.txtRequired'))
  },
  g7Password: {
    required: withMessage(required, t('common.form.val.txtRequired'))
  }
}

const formState = ref({
  g7Username: '',
  g7Password: ''
})

const { r$ } = useRegle(
  formState,
  validators,
  {
    autoDirty: false
  }
)

const onSubmit = async function () {
  const { valid, data } = await  r$.$validate()

  if (valid) {
    showLoginError.value = false
    loading.value = true

    const fn = await serviceStore.login({ username: data.g7Username, password: data.g7Password })
    loading.value = false

    if (fn.res) {
      const rF = route.redirectFrom ? route.redirectForm : { name: "rtHome" }
      router.push(rF)
    } else {
      showLoginError.value = true
    }
  }
}

</script>
<style scoped>
.bkg {
  background-color: #ffffff;
  background-image: url('/img/g/500g_spagnola.jpg');
  background-repeat: no-repeat;
  background-position: 0% 0%;
  background-size: 40%;
}
.crd {
  background-color: rgba(238, 233, 216, 0.85) !important;
}
</style>
