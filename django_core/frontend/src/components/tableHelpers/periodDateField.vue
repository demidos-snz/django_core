<template>
  <v-col class="d-flex flex-column">
    <v-dialog ref="startDateDialog" v-model="startDateModal" :return-value.sync="startDate" persistent width="290px">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="startDate"
          :label="$t(`main.from`)"
          readonly
          outlined
          class="pb-3"
          hide-details
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        :locale="$i18n.locale"
        v-model="startDate"
        first-day-of-week="1"
        header-color="grey darken-3"
        scrollable
        color="primary"
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="clearDate('start')"> {{ $t('main.clear') }} </v-btn>
        <v-btn text color="primary" @click="startDateModal = false"> {{ $t('main.cancel') }} </v-btn>
        <v-btn text color="primary" @click="setStartDate"> {{ $t('main.ok') }} </v-btn>
      </v-date-picker>
    </v-dialog>
    <v-dialog ref="endDateDialog" v-model="endDateModal" :return-value.sync="endDate" persistent width="290px">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="endDate"
          :label="$t(`main.to`)"
          readonly
          outlined
          hide-details
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        :locale="$i18n.locale"
        v-model="endDate"
        first-day-of-week="1"
        header-color="grey darken-3"
        scrollable
        color="primary"
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="clearDate('end')"> {{ $t('main.clear') }} </v-btn>
        <v-btn text color="primary" @click="endDateModal = false"> {{ $t('main.cancel') }} </v-btn>
        <v-btn text color="primary" @click="setEndDate"> {{ $t('main.ok') }} </v-btn>
      </v-date-picker>
    </v-dialog>
  </v-col>
</template>

<script>
  export default {
    name: 'PeriodDateField',
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
      isDatePeriodActive: false,
      startDateModal: false,
      endDateModal: false,
      startDate: null,
      endDate: null,
    }),
    methods: {
      setStartDate() {
        this.$refs.startDateDialog.save(this.startDate)
        this.startTimeModal = true
      },
      setEndDate() {
        this.$refs.endDateDialog.save(this.endDate)
        this.endTimeModal = true
      },
      clearDate(type) {
        switch (type) {
          case 'start':
            this.$refs.startDateDialog.save(null)
            this.startDate = null
            break

          case 'end':
            this.$refs.endDateDialog.save(null)
            this.endDate = null
            break

          default:
            break
        }
      },
      clear() {
        this.clearDate('start')
        this.clearDate('end')
      },
      setFilterValue(data) {
        if (data[this.headerData.filterKey]) {
          const rawData = this.filterData[this.headerData.filterKey].val
          this.startDate = rawData.start
          this.endDate = rawData.end
        } else {
          this.startDate = null
          this.startTime = null
        }
      },
    },
    watch: {
      apply(newVal) {
        if (newVal) {
          const value = {
            start: this.startDate,
            end: this.endDate,
          }
          this.$emit('filterValueUpdated', value)
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
