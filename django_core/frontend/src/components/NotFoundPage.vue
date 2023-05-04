<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" class="flex-column">
      <v-icon class="font-40r" color="white"> mdi-emoticon-sad </v-icon>
      <p class="text-center font-5r">{{ $t('main.page_not_found') }}</p>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NotFoundPage',
  }
</script>
<style lang="scss" scoped></style>
