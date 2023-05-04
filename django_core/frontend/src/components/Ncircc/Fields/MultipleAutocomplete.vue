<template>
  <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
    <v-row class="px-3 py-2">
      <v-autocomplete
        :no-data-text="$t('main.no_data')"
        deletable-chips
        :search-input.sync="search"
        hide-details
        hide-selected
        outlined
        chips
        dense
        small-chips
        multiple
        v-bind="$attrs"
      >
        <template v-slot:no-data>
          <v-list-item v-show="search">
            <span class="subheading">{{ $t('main.create') }}</span>
            <v-chip class="ml-2" label small> "{{ search }}" </v-chip>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-row>
  </v-col>
</template>

<script>
  export default {
    name: 'MultipleAutocomplete',
    data: () => ({
      search: null,
    }),
  }
</script>

<style scoped></style>
