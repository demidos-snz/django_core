<template>
  <v-text-field
    color="white"
    :label="headerData.text"
    outlined
    clearable
    small
    hide-details
    v-model="filterValue"
  ></v-text-field>
</template>

<script>
  export default {
    name: 'TextField',
    props: {
      table: String,
      apply: {
        type: Boolean,
        default: false,
        required: true,
      },
      headerData: {},
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
