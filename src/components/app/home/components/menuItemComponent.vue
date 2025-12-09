<template>
  <q-card square class="bg-blue-grey-1 shadow-2">
    <q-card-section class="q-pa-none">

      <q-item class="q-px-xs" active-class="bg-blue-grey-4" :to="props.to" exact clickable>
        <q-item-section class="text-center">
          <q-item-label class="text-center q-py-xs">
            <div class="row items-center justify-center" style="max-height:110px; min-height:110px;overflow: hidden;">
              <q-icon v-if="props.icon && props.icon!==''" :name="props.icon" size="70px" class="q-ma-md"></q-icon>
              <span v-else class="text-subtitle2" >{{_.toUpper(_.first(i.label))}}</span>
            </div>
          </q-item-label>
          <q-item-label class="q-px-none text-center q-py-xs text-subtitle2" line="1" style="max-height:45px; height:45px; overflow:hidden;">{{props.label}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
<script setup>
import _ from 'lodash'

const props = defineProps({
  icon: { type: String },
  label: { type: String },
  to: { type: Object }
})
</script>
