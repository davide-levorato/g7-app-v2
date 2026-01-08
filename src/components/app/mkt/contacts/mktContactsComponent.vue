<template>
  <q-toolbar class="bg-grey-3">
    <q-btn v-if="!editing" label="Nuovo" no-caps icon="fal fa-address-card" @click="onNewContact"></q-btn>
    <q-btn v-if="editing" label="Salva" no-caps icon="fal fa-save" @click="onEditSave"></q-btn>
    <q-btn v-if="editing" label="Annulla" no-caps class="q-ml-md" icon="fal fa-arrow-rotate-left" @click="onEditCancel"></q-btn>
  </q-toolbar>
  <div class="row">
    <div class="col-xs-12">
      <template v-if="editing">
        <mkt-contact-form-component :contact="contact" @change="onContactChange"></mkt-contact-form-component>
      </template>
      <template v-else>
        <mkt-contacts-list-component @edit="onEdit"></mkt-contacts-list-component>
      </template>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { useQuasar } from 'quasar'
import { ref, computed, watch, onMounted } from 'vue'

import _ from 'lodash'
import dayJs from 'dayjs'

import mktContactsListComponent from './components/mktContactsListComponent.vue'
import mktContactFormComponent from './components/mktContactFormComponent.vue'

import { useServiceStore } from "src/stores/service.js"
import { useApplicationStore } from "src/stores/application"

import { apiGetData, apiSetData } from 'api/data.js'

const q$ = useQuasar()
const serviceStore = useServiceStore()

const editing = ref(false)

const contact = ref({})

const onEdit = function (rec) {

  const r = rec

  r.g7Products = r.g7Products ? JSON.parse(r.g7Products) : null
  r.sivieroMariaProducts = r.sivieroMariaProducts ? JSON.parse(r.sivieroMariaProducts) : null

  contact.value = rec
  editing.value = true
}

const onNewContact = function () {
  contact.value = {
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
  }
  editing.value = true
}

const onEditCancel = function () {
  contact.value = {
    privateLabelProducts: false,
    gelatoMadreProducts: false
  }
  editing.value = false
}

const onContactChange = function(c) {
  contact.value = c
}

const onEditSave = function () {
  const c = _.cloneDeep(contact.value)

  c.g7Products = contact.value.g7Products ? JSON.stringify(contact.value.g7Products) : null
  c.sivieroMariaProducts = contact.value.sivieroMariaProducts ? JSON.stringify(contact.value.sivieroMariaProducts) : null

  serviceStore.apiCall(apiSetData, { obj: 'MKT_CONTACTS', record: c, params: {}}, true).then(function(r) {
    contact.value = {
      privateLabelProducts: false,
      gelatoMadreProducts: false
    }
    editing.value = false
  })

}
</script>
