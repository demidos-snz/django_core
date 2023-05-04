<template>
  <v-col class="d-flex flex-column">
    <v-dialog ref="startDateDialog" v-model="startDateModal" :return-value.sync="startDate" persistent width="290px">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="start"
          :label="$t(`main.from`)"
          readonly
          outlined
          class="pb-3"
          hide-details
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="startDate" first-day-of-week="1" header-color="grey darken-3" scrollable color="primary">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="clearDate('start')"> {{ $t('main.clear') }} </v-btn>
        <v-btn text color="primary" @click="startDateModal = false"> {{ $t('main.cancel') }} </v-btn>
        <v-btn text color="primary" @click="setStartDate"> {{ $t('main.ok') }} </v-btn>
      </v-date-picker>
    </v-dialog>
    <v-dialog ref="startTimeModal" v-model="startTimeModal" :return-value.sync="startTime" persistent width="290px">
      <v-time-picker
        v-if="startTimeModal"
        header-color="grey darken-3"
        v-model="startTime"
        format="24hr"
        color="primary"
        full-width
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="startTimeModal = false"> {{ $t('main.cancel') }} </v-btn>
        <v-btn text color="primary" @click="$refs.startTimeModal.save(startTime)"> {{ $t('main.ok') }} </v-btn>
      </v-time-picker>
    </v-dialog>
    <v-dialog ref="endDateDialog" v-model="endDateModal" :return-value.sync="endDate" persistent width="290px">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="end"
          :label="$t(`main.to`)"
          readonly
          outlined
          hide-details
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="endDate" first-day-of-week="1" header-color="grey darken-3" scrollable color="primary">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="clearDate('end')"> {{ $t('main.clear') }} </v-btn>
        <v-btn text color="primary" @click="endDateModal = false"> {{ $t('main.cancel') }} </v-btn>
        <v-btn text color="primary" @click="setEndDate"> {{ $t('main.ok') }} </v-btn>
      </v-date-picker>
    </v-dialog>
    <v-dialog ref="endTimeModal" v-model="endTimeModal" :return-value.sync="endTime" persistent width="290px">
      <v-time-picker
        v-if="endTimeModal"
        v-model="endTime"
        format="24hr"
        header-color="grey darken-3"
        color="primary"
        full-width
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="endTimeModal = false"> {{ $t('main.cancel') }} </v-btn>
        <v-btn text color="primary" @click="$refs.endTimeModal.save(endTime)"> {{ $t('main.ok') }} </v-btn>
      </v-time-picker>
    </v-dialog>
  </v-col>
</template>

<script>
  export default {
    name: 'PeriodDatetimeField',
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
      startTimeModal: false,
      endDateModal: false,
      endTimeModal: false,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
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
            break

          case 'end':
            this.$refs.endDateDialog.save(null)
            break

          default:
            break
        }
      },
      clear() {
        this.clearDate('start')
        this.startDate = null
        this.startTime = null
        this.clearDate('end')
        this.endDate = null
        this.endTime = null
      },
      setFilterValue(data) {
        if (data[this.headerData.filterKey]) {
          const rawData = data[this.headerData.filterKey].val.rawData
          this.startDate = rawData.startDate
          this.startTime = rawData.startTime
          this.endDate = rawData.endDate
          this.endTime = rawData.endTime
        } else {
          this.startDate = null
          this.startTime = null
          this.endDate = null
          this.endTime = null
        }
      },
    },
    computed: {
      start() {
        if (this.startDate) {
          return `${this.startDate} ${this.startTime || '00:00'}`
        }
        return null
      },
      end() {
        if (this.endDate) {
          return `${this.endDate} ${this.endTime || '23:59'}`
        }
        return null
      },
    },
    watch: {
      apply(newVal) {
        if (newVal) {
          const value = {
            rawData: {
              startDate: this.startDate,
              startTime: this.startTime,
              endDate: this.endDate,
              endTime: this.endTime,
            },
            start: this.start,
            end: this.end,
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
