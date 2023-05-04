<template>
  <div class="datetime-picker">
    <div class="selected-datetime">
      <span>{{ resultDatetime }}</span>
    </div>
    <div class="picker-area">
      <div class="datepicker-container">
        <v-date-picker
          v-model="date"
          @input="setDate"
          @change="setDate"
          v-bind="$attrs"
          no-title
          :scrollable="false"
          :color="$attrs.color || 'primary'"
        >
          <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"
            ><slot :name="name" v-bind="slotData"
          /></template>
          <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
        </v-date-picker>
      </div>
      <div class="timepicker-container">
        <div class="timevalues-list">
          <v-btn
            class="mb-1"
            small
            outlined
            v-for="(item, index) in timeValues"
            :key="index"
            @click="setTime(item)"
            :color="time === item ? $attrs.color || 'primary' : 'white'"
          >
            {{ item }}
          </v-btn>
        </div>
      </div>
    </div>
    <div class="relative-dates-area">
      <v-col class="d-flex flex-row align-center justify-center">
        <v-text-field
          outlined
          dense
          hide-details
          v-model="relativeValueNumber"
          type="number"
          class="mr-1"
          hide-spin-buttons
        ></v-text-field>
        <v-select
          outlined
          dense
          hide-details
          v-model="relativeValueType"
          item-value="type"
          item-text="name"
          :items="getRelativeValueTypes()"
          class="mx-1"
        ></v-select>
        <v-select
          outlined
          dense
          hide-details
          v-model="relativeValueDirection"
          item-value="type"
          item-text="name"
          :items="getRelativeValueDirections()"
          class="mx-1"
        ></v-select>
        <v-btn outlined class="ml-1" @click="setRelativeDatetime">{{ $t('main.ok') }}</v-btn>
      </v-col>
    </div>
    <div class="manual-input-area">
      <v-col class="d-flex flex-row align-center justify-center">
        <v-text-field
          outlined
          dense
          hide-details
          @input="handleManualInput"
          v-model="manualInput"
          :placeholder="datetimeFormat"
          class="mr-1"
        ></v-text-field>
        <v-btn outlined class="ml-1" @click="setManualDatetime">{{ $t('main.ok') }}</v-btn>
      </v-col>
    </div>
    <slot name="actions" class="actions-slot"> </slot>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapActions } from 'vuex'
  import { RELATIVE_VALUE_TYPE, RELATIVE_VALUE_DIRECTION } from '@/constants/enums'
  import { getRelativeValueTypes, getRelativeValueDirections } from '@/constants/constants'

  const datetimeRegexp =
    /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/g

  export default {
    name: 'DatetimePicker',
    props: {
      datetimeFormat: {
        type: String,
        required: true,
      },
      dateFormat: {
        type: String,
        required: true,
      },
      timeFormat: {
        type: String,
        required: true,
      },
    },
    data() {
      /*
        define data as a regular function,
        because "this" is not availailable in arrow functions
      */
      return {
        date: moment().format(this.dateFormat),
        time: moment().format(this.timeFormat),
        relativeValueNumber: 1,
        relativeValueType: RELATIVE_VALUE_TYPE.HOUR,
        relativeValueDirection: RELATIVE_VALUE_DIRECTION.FORWARD,
        getRelativeValueTypes,
        getRelativeValueDirections,
        manualInput: null,
      }
    },
    computed: {
      timeValues() {
        const hoursArray = Array.from({ length: 24 }, (element, index) => String(index).padStart(2, '0'))
        const minutesArray = Array.from({ length: 6 }, (element, index) => String(index * 10).padStart(2, '0'))
        const result = []

        hoursArray.forEach((hoursValue) => {
          minutesArray.forEach((minutesValue) => {
            const resultValue = `${hoursValue}:${minutesValue}`
            result.push(resultValue)
          })
        })

        return result
      },

      resultDatetime() {
        return `${this.date} ${this.time}`
      },
    },
    methods: {
      ...mapActions('alerts', ['addAlert']),
      setDate(date) {
        this.date = date
      },

      setTime(time) {
        this.time = time
      },

      setRelativeDatetime() {
        const selectedDate = moment(this.resultDatetime)
        const allowedDates = this.$attrs['allowed-dates']
        let newValue
        switch (this.relativeValueDirection) {
          case RELATIVE_VALUE_DIRECTION.FORWARD:
            newValue = selectedDate.add(this.relativeValueNumber, this.relativeValueType)
            break
          case RELATIVE_VALUE_DIRECTION.BACKWARD:
            newValue = selectedDate.subtract(this.relativeValueNumber, this.relativeValueType)
            break
          default:
            break
        }

        if (allowedDates) {
          if (!allowedDates(newValue)) {
            return this.addAlert({
              message: this.$t('dialogs.eventSelection.date_out_of_range'),
              type: 'error',
            })
          }
        }

        const [date, time] = newValue.format(this.datetimeFormat).split(' ')
        this.date = date
        this.time = time
      },

      setManualDatetime() {
        // Checking that date format is correct
        if (!this.manualInput || !this.manualInput.match(datetimeRegexp)) {
          return this.addAlert({
            message: this.$t('dialogs.eventSelection.wrong_date_format'),
            type: 'error',
          })
        }

        // Checking that date is correct
        if (moment(this.manualInput).format(this.datetimeFormat) === 'Invalid date') {
          return this.addAlert({
            message: this.$t('dialogs.eventSelection.wrong_date'),
            type: 'error',
          })
        }

        const allowedDates = this.$attrs['allowed-dates']
        if (allowedDates) {
          if (!allowedDates(this.manualInput)) {
            return this.addAlert({
              message: this.$t('dialogs.eventSelection.date_out_of_range'),
              type: 'error',
            })
          }
        }

        const [date, time] = this.manualInput.split(' ')
        this.date = date
        this.time = time
      },

      handleManualInput(inputData) {
        function getDividerSymbolsFromStr(formatStr) {
          const specialSymbols = ['-', ' ', ':']
          const dividerSymbolsObj = {}

          for (let index = 0; index < formatStr.length; index++) {
            if (specialSymbols.includes(formatStr[index])) {
              dividerSymbolsObj[index] = formatStr[index]
            }
          }

          return dividerSymbolsObj
        }

        let filteredInput = inputData.replace(/[^0-9]/g, '')
        const filteredFormat = this.datetimeFormat.replace(/[-:\s]/g, '')
        const maxLen = filteredFormat.length

        if (filteredInput.length > maxLen) {
          filteredInput = filteredInput.slice(0, maxLen)
        }

        const dividerSymbols = getDividerSymbolsFromStr(this.datetimeFormat)

        const dataArr = filteredInput.split('')

        Object.keys(dividerSymbols).forEach((key) => {
          if (dataArr[key] !== undefined) {
            dataArr.splice(key, 0, dividerSymbols[key])
          }
        })

        this.$nextTick(() => {
          this.manualInput = dataArr.join('')
        })
      },

      apply() {
        this.emitInput(this.resultDatetime)
      },

      emitInput(value) {
        this.$emit('input', value)
      },
    },
    watch: {
      resultDatetime(newVal) {
        this.emitInput(newVal)
      },
    },
  }
</script>

<style scoped lang="scss">
  .datetime-picker {
    --picker-height: 300px;
    --picker-color: #424242;
    --background-color: #1e1e1e;
    --picker-border-style: thin solid #686767;

    border: var(--picker-border-style);
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .selected-datetime {
      display: flex;
      justify-content: center;
      background-color: var(--background-color);
      padding: 10px 20px;
      border-bottom: var(--picker-border-style);
      font-size: 20px;
      font-weight: bold;
      width: 100%;
    }

    .picker-area {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 100%;
      background: var(--picker-color);

      .v-picker {
        height: var(--picker-height) !important;
      }

      .v-picker__body {
        border-bottom-right-radius: 0 !important;
        border-top-right-radius: 0 !important;
      }

      .datepicker-container {
        background-color: var(--picker-color);
      }

      .timepicker-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: var(--picker-height);
        padding: 10px 0;
        background-color: var(--picker-color);
        border-left: var(--picker-border-style);

        .timevalues-list {
          display: flex;
          flex-direction: column;
          padding: 0 10px;
          height: 300px;
          overflow-y: auto;
        }
      }
    }

    .relative-dates-area,
    .manual-input-area {
      display: flex;
      justify-content: center;
      background-color: var(--background-color);
      border-top: var(--picker-border-style);
      width: 100%;
    }
  }
</style>
