<template>
  <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
    <v-row class="px-3 py-2">
      <v-autocomplete v-on="$listeners" v-bind="$attrs" outlined dense hide-details item-value="id" item-text="name">
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      </v-autocomplete>
    </v-row>
  </v-col>
</template>

<script>
  export default {
    name: 'SimpleAutocomplete',
  }
</script>

<style scoped></style>
