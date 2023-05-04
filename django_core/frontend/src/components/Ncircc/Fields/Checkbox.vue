<template>
  <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
    <v-row class="px-3 py-2">
      <v-checkbox :input-value="value" @change="save" v-on="$listeners" dense v-bind="$attrs" />
    </v-row>
  </v-col>
</template>

<script>
  export default {
    name: 'Checkbox',
    props: ['value'],
    methods: {
      save(value) {
        this.$emit('input', value)
      },
    },
  }
</script>

<style scoped></style>
