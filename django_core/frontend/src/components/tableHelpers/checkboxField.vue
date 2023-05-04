<template>
  <v-autocomplete
    :no-data-text="$t('main.no_data')"
    color="white"
    hide-details
    clearable
    :return-object="false"
    small
    :multiple="headerData.multiple"
    item-text="name"
    item-value="id"
    outlined
    :label="headerData.text"
    :items="inputData"
    v-model="filterValue"
    :menu-props="{
      maxWidth: 262,
      openOnHover: true,
    }"
  >
    <template v-slot:item="data">
      <v-list-item-content v-text="data.item.name" />
    </template>
  </v-autocomplete>
</template>

<script>
  export default {
    name: 'CheckboxField',
    props: {
      table: String,
      headerData: {},
      apply: {
        type: Boolean,
        default: false,
        required: true,
      },
      inputData: {
        type: Array,
        default: () => {
          return []
        },
        required: false,
      },
      filterData: {},
    },
    data: () => ({
      filterValue: null,
    }),
    methods: {
      clear() {
        this.filterValue = null
      },
      setFilterValue(data) {
        if (data[this.headerData.filterKey]) {
          this.filterValue = data[this.headerData.filterKey].val
        } else {
          this.filterValue = null
        }
      },
    },
    watch: {
      apply(newVal) {
        if (newVal) {
          this.$emit('filterValueUpdated', this.filterValue)
        }
      },
      filterData(newVal) {
        if (newVal) {
          this.setFilterValue(newVal)
        }
      },
    },
    mounted() {
      this.setFilterValue(this.filterData)
    },
  }
</script>
