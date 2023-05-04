<template>
  <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
    <v-row class="px-3 py-2">
      <v-text-field v-on="$listeners" outlined dense :hide-details="hideDetails" v-bind="$attrs" autocomplete="off">
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"
          ><slot :name="name" v-bind="slotData"
        /></template>
        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      </v-text-field>
    </v-row>
  </v-col>
</template>

<script>
  export default {
    name: 'TextField',
    props: {
      hideDetails: {
        type: Boolean,
        default: true,
      },
    },
  }
</script>

<style scoped></style>
