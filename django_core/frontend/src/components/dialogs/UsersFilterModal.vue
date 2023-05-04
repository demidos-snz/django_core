<template>
  <v-menu
    v-model="isActive"
    :close-on-content-click="false"
    max-width="300px"
    :nudge-bottom="50"
    left
    bottom
    content-class="elevation-0"
    transition="slide-x-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined v-bind="attrs" v-on="on" class="filter-btn">
        <v-icon small>mdi-filter</v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-text>
        <v-col>
          <v-autocomplete
            :value="getFilterValue('roles')"
            @input="addFilter('roles', $event)"
            :no-data-text="$t('main.no_data')"
            :items="userRoles"
            item-text="name"
            item-value="id"
            :label="$t('users.role')"
            outlined
            dense
            hide-details
            multiple
            chips
            deletable-chips
            small-chips
            hide-selected
            :allow-overflow="false"
          >
          </v-autocomplete>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small outlined color="primary" @click="dropFilters()">{{ $t('main.reset') }}</v-btn>
        <v-btn small outlined color="success" @click="applyFilters()" :disabled="isEmptyFilter">
          {{ $t('main.apply') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
  import { getUserRoles } from '@/constants/constants'
  import { mapState, mapActions, mapGetters } from 'vuex'
  import Vue from 'vue'
  import { isEmpty } from 'lodash'
  import { toStorage, fromStorage } from '@/store/utils'

  export default {
    name: 'UsersFilterModal',
    data: () => ({
      isActive: false,
      filterParams: {},
    }),
    computed: {
      ...mapState('users', ['filters']),
      ...mapGetters('operator', ['operator']),
      userRoles() {
        return Object.values(getUserRoles())
      },
      isEmptyFilter() {
        return isEmpty(this.filterParams)
      },
    },
    methods: {
      ...mapActions('users', ['setFilters', 'resetFilters']),
      getFilterValue(filterKey) {
        if (this.filterParams[filterKey]) {
          return this.filterParams[filterKey]
        } else {
          return this.filters[filterKey] || null
        }
      },
      addFilter(fieldName, filterData) {
        Vue.set(this.filterParams, fieldName, filterData)
        /*
          Add filter deletion from 'filters object' if in future where will be not only array filter.
          Array filter do not require deletion because empty filter = empty array.
        */
      },
      applyFilters() {
        if (!this.isEmptyFilter) {
          this.setFilters(this.filterParams)
          this.closeModal()
        }
      },
      dropFilters() {
        this.resetFilters()
        this.closeModal()
      },
      closeModal() {
        Vue.set(this, 'filterParams', {})
        this.isActive = false
      },
      isEmptyValue(value) {
        if (Array.isArray(value)) return isEmpty(value)
        return !value
      },
      loadFilters() {
        const key = `userFilters${this.operator.id}`
        const filters = fromStorage(key)
        const parsedFilters = JSON.parse(filters)

        if (parsedFilters) {
          this.setFilters(parsedFilters)
        }
      },
      storeFilters() {
        const key = `userFilters${this.operator.id}`
        const stringifiedFilters = JSON.stringify(this.filters)

        toStorage(key, stringifiedFilters)
      },
    },
    created() {
      window.addEventListener('unload', this.storeFilters)
      this.loadFilters()
    },
    beforeDestroy() {
      this.storeFilters()
    },
  }
</script>
<style scoped>
  .filter-btn {
    min-width: 40px !important;
  }
</style>
