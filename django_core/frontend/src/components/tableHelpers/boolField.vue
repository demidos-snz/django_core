<template>
  <v-combobox
    :no-data-text="$t('main.no_data')"
    color="white"
    hide-details
    clearable
    small
    outlined
    :label="headerData.text"
    :items="items"
    v-model="filterValue"
    :menu-props="{
      maxWidth: 262,
      openOnHover: true,
    }"
  >
  </v-combobox>
</template>

<script>
  export default {
    name: 'BoolField',
    props: {
      table: String,
      headerData: {},
      apply: {
        type: Boolean,
        default: false,
        required: true,
      },
      filterData: {},
    },
    data: () => ({
      filterValue: null,
      items: [
        {
          text: 'Да',
          value: true,
        },
        {
          text: 'Нет',
          value: false,
        },
      ],
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
