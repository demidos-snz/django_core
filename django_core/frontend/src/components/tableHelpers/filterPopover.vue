<template>
  <v-menu
    v-model="isOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    max-width="300px"
    offset-x
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-show="isActiveFilter" color="red" @click.stop="clearFilterValue">
        <v-icon small>mdi-cancel</v-icon>
      </v-btn>
      <v-btn icon v-bind="attrs" v-on="on" :color="isActiveFilter ? 'green' : 'white'">
        <v-icon small>mdi-filter</v-icon>
      </v-btn>
    </template>

    <v-card outlined class="pa-2">
      <checkbox-field
        :table="table"
        ref="filterField"
        v-if="isType(types.COMBOBOX)"
        :apply="apply"
        :headerData="headerData"
        :filterData="filterData"
        :inputData="inputData"
        @filterValueUpdated="initFilterUpdate"
      />
      <text-field
        :table="table"
        ref="filterField"
        :apply="apply"
        v-else-if="isType(types.TEXT)"
        :headerData="headerData"
        :filterData="filterData"
        @filterValueUpdated="initFilterUpdate"
      />
      <period-datetime-field
        :table="table"
        ref="filterField"
        :apply="apply"
        :headerData="headerData"
        :filterData="filterData"
        v-else-if="isType(types.PERIOD_DATE_TIME)"
        @filterValueUpdated="initFilterUpdate"
      />
      <period-date-field
        :table="table"
        ref="filterField"
        :apply="apply"
        :headerData="headerData"
        :filterData="filterData"
        v-else-if="isType(types.PERIOD_DATE)"
        @filterValueUpdated="initFilterUpdate"
      />
      <bool-field
        :table="table"
        ref="filterField"
        :apply="apply"
        v-else-if="isType(types.BOOL)"
        :headerData="headerData"
        :filterData="filterData"
        @filterValueUpdated="initFilterUpdate"
      />
      <v-card-actions class="d-flex justify-center">
        <v-btn outlined color="red" medium text @click="clearFilterValue"> {{ $t('main.reset') }} </v-btn>
        <v-btn outlined medium color="success" text @click="applyFilter"> {{ $t('main.apply') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import checkboxField from '@/components/tableHelpers/checkboxField'
  import textField from '@/components/tableHelpers/textField'
  import periodDatetimeField from '@/components/tableHelpers/periodDatetimeField'
  import periodDateField from '@/components/tableHelpers/periodDateField'
  import boolField from '@/components/tableHelpers/boolField'

  const FIELD_TYPES = {
    COMBOBOX: 'combobox',
    TEXT: 'text',
    PERIOD_DATE_TIME: 'periodDatetime',
    PERIOD_DATE: 'periodDate',
    BOOL: 'bool',
  }

  export default {
    components: {
      checkboxField,
      textField,
      periodDatetimeField,
      periodDateField,
      boolField,
    },
    props: {
      table: String,
      headerData: {},
      filterData: {},
      inputData: {
        type: Array,
        default: () => {
          return []
        },
        required: false,
      },
    },
    data: () => ({
      apply: false,
      isOpen: false,
      filterValue: null,
      types: FIELD_TYPES,
    }),
    methods: {
      clearFilterValue() {
        this.$refs.filterField && this.$refs.filterField.clear()
        this.$emit('clearFilterValue', this.headerData)
      },
      initFilterUpdate(value) {
        if (!this.isEmptyFilter(value)) {
          const params = cloneDeep(this.headerData)
          params.val = value

          this.$emit('applyFilterValue', params)
        }

        this.apply = false
        this.isOpen = false
      },
      isEmptyFilter(value) {
        let isEmpty = false

        if (!value) isEmpty = true
        else if ([this.types.PERIOD_DATE_TIME, this.types.PERIOD_DATE].includes(this.headerData.filterType)) {
          if (!value.start && !value.end) {
            isEmpty = true
          }
        }

        return isEmpty
      },
      applyFilter() {
        this.apply = true
      },
    },
    computed: {
      isActiveFilter() {
        return Object.prototype.hasOwnProperty.call(this.filterData, this.headerData.filterKey)
      },
      isType() {
        return (type) => {
          return this.headerData.filterType === type
        }
      },
    },
  }
</script>
