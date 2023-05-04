<template>
  <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
    <v-row class="px-3 py-2">
      <v-textarea v-on="$listeners" hide-details rows="3" outlined v-bind="$attrs"></v-textarea>
    </v-row>
  </v-col>
</template>

<script>
  export default {
    name: 'TextArea',
  }
</script>

<style scoped></style>
