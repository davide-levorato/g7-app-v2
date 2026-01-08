<template>
  <q-scroll-area :style="areaStyle">
    <q-card :style="formStyle">
      <q-card-section class="q-pa-xs">
        <div class="row q-mt-md">
          <div class="col-xs-12 col-md-4 col-lg-4 q-px-sm q-py-xs">
            <q-input autofocus outlined v-model="fmContact.firstName" label="Nome"></q-input>
          </div>
          <div class="col-xs-12 col-md-5 col-lg-4 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.lastName" label="Cognome"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-5 col-lg-4 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.companyName" label="Ragione Sociale"></q-input>
          </div>
          <div class="col-xs-12 col-md-4 col-lg-4 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.role" label="Ruolo"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.address" label="Indirizzo"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-3 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.addzipCode" label="CAP"></q-input>
          </div>
          <div class="col-xs-12 col-md-3 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.city" label="Città"></q-input>
          </div>
          <div class="col-xs-12 col-md-3 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.country" label="Paese"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-4 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.telNumber" label="Telefono"></q-input>
          </div>
          <div class="col-xs-12 col-md-4 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.mobileTelNumber" label="Cellulare"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.email" label="Email"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.webSite" label="Sito web"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-select outlined clearable v-model="fmContact.channel" label="Canale di vendita" :options="channelOptions" emit-value map-options></q-select>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-select outlined multiple clearable v-model="fmContact.g7Products" label="Prodotti G7 di interesse" :options="g7ProductOptions" emit-value map-options></q-select>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-select outlined multiple clearable v-model="fmContact.sivieroMariaProducts" label="Prodotti Siviero Maria di interesse" :options="sivieroMariaProductOptions" emit-value map-options></q-select>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-checkbox v-model="fmContact.gelatoMadreProducts" label="Prodotti Gelato Madre di interesse" :true-value="true" :false-value="false"></q-checkbox>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-checkbox v-model="fmContact.privateLabelProducts" label="Prodotti Private Label di interesse"></q-checkbox>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.referral" label="Referente"></q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-md-9 q-px-sm q-py-xs">
            <q-input outlined v-model="fmContact.notes" type="textarea" label="Note"></q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-scroll-area>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { useQuasar } from 'quasar'
import { ref, computed, reactive, watch, onMounted, watchEffect } from 'vue'
import dayJs from 'dayjs'

import _ from 'lodash'

const q$ = useQuasar()

const props = defineProps({
  contact: { type: Object, defaukt: function () { return {}}}
})

const emit = defineEmits(['change'])

const formStyle = computed(() => {
  const w = q$.screen.width
  return `width:${w}px; max-width:${w}px;`
})

const areaStyle = computed(() => {
  const subTract = 100
  const h = q$.screen.height - subTract
  const w = q$.screen.width
  return `width:${w}px; max-width:${w}px;height:${h}px;`
})

const channelOptions = ref([
  { value: 'GDO/RETAIL', label: 'GDO/RETAIL' },
  { value: 'HORECA/FOODSERVICE', label: 'HORECA/FOODSERVICE' },
  { value: 'NORMAL TRADE', label: 'NORMAL TRADE' },
  { value: 'IMPORTATORE', label: 'IMPORTATORE' },
  { value: 'ALTRO', label: 'ALTRO' }
])

const g7ProductOptions = ref([
  { value: 'Monodose 80g – 150ml', label: 'Monodose 80g – 150ml' },
  { value: 'Vaschetta 300g – 500ml', label: 'Vaschetta 300g – 500ml' },
  { value: 'Vaschetta 500g – 1l', label: 'Vaschetta 500g – 1l' },
  { value: 'Vaschetta 1kg – 2l', label: 'Vaschetta 1kg – 2l' },
  { value: 'Vaschetta 2,6 kg – 4,750 l', label: 'Vaschetta 2,6 kg – 4,750 l' },
  { value: 'Gelato con crema spalmabile 230 g – 500ml', label: 'Gelato con crema spalmabile 230 g – 500ml' },
  { value: 'Gelato a strati 300g – 500ml', label: 'Gelato a strati 300g – 500ml' },
  { value: 'Altro', label: 'Altro' },
])

const sivieroMariaProductOptions = ref([
  { value: 'Monodose 80g – 150ml', label: 'Monodose 80g – 150ml' },
  { value: 'Vaschetta 500g – 1l', label: 'Vaschetta 500g – 1l' },
  { value: 'Vaschetta 1kg – 2l', label: 'Vaschetta 1kg – 2l' },
  { value: 'Vaschetta 2,6 kg – 4,750 l', label: 'Vaschetta 2,6 kg – 4,750 l' },
  { value: 'Gelato a strati 300g – 500ml', label: 'Gelato a strati 300g – 500ml' },
  { value: 'Altro', label: 'Altro' }])

const fmContact = reactive({
  id: null,
  firstName: '',
  lastName: '',
  role: '',
  eventName: 'Tutto Food',
  eventDate: dayJs().format('YYYY-MM-DD'),
  companyName: '',
  address: '',
  city: '',
  zipCode: '',
  country: '',
  telNumber: '',
  mobileTelNumber: '',
  website: '',
  email: '',
  channel: '',
  g7Products: [],
  sivieroMariaProducts: [],
  gelatoMadreProducts: false,
  privateLabelProducts: false,
  notes: '',
  referral: ''
})

watch(fmContact, function(v) {
  emit('change', v)
})

watchEffect(() => {
  // `foo` transformed to `props.foo` by the compiler
  fmContact.id = props.contact.id
  fmContact.firstName = props.contact.firstName
  fmContact.lastName = props.contact.lastName
  fmContact.role = props.contact.role
  fmContact.eventName = props.contact.eventName
  fmContact.eventDate = props.contact.eventDate
  fmContact.companyName = props.contact.companyName
  fmContact.address = props.contact.address
  fmContact.city = props.contact.city
  fmContact.zipCode = props.contact.zipCode
  fmContact.country = props.contact.country
  fmContact.telNumber = props.contact.telNumber
  fmContact.mobileTelNumber = props.contact.mobileTelNumber
  fmContact.website = props.contact.website
  fmContact.email = props.contact.email
  fmContact.channel = props.contact.channel
  fmContact.g7Products = props.contact.g7Products
  fmContact.sivieroMariaProducts = props.contact.sivieroMariaProducts

  fmContact.gelatoMadreProducts = props.contact.gelatoMadreProducts
  fmContact.privateLabelProducts = props.contact.privateLabelProducts

  fmContact.notes = props.contact.notes
  fmContact.referral = props.contact.referral
})

</script>
