<template>
  <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
    <v-row class="px-3 py-2">
      <v-dialog :return-value.sync="date" ref="dateDialog" v-model="isActiveDate" persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="value"
            prepend-icon="mdi-calendar"
            readonly
            outlined
            dense
            hide-details
            v-bind="{ ...attrs, ...$attrs }"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="date" scrollable color="primary" header-color="grey darken-3">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="isActiveDate = false">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn text color="primary" @click="storeDate(date)">
            {{ $t('main.ok') }}
          </v-btn>
        </v-date-picker>
      </v-dialog>
      <v-dialog ref="timeDialog" v-model="isActiveTime" :return-value.sync="time" persistent width="290px">
        <v-time-picker
          v-if="isActiveTime"
          header-color="grey darken-3"
          v-model="time"
          format="24hr"
          color="primary"
          full-width
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="isActiveTime = false"> {{ $t('main.cancel') }} </v-btn>
          <v-btn text color="primary" @click="save()"> {{ $t('main.ok') }} </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-row>
  </v-col>
</template>

<script>
  export default {
    name: 'DatePicker',
    props: ['value'],
    data: () => ({
      isActiveDate: false,
      isActiveTime: false,
      date: null,
      time: null,
    }),
    methods: {
      storeDate() {
        this.$set(this, 'isActiveTime', true)
      },

      save() {
        this.isActiveDate = false
        this.isActiveTime = false
        const dateTime = `${this.date} ${this.time || '00:00'}`
        this.$emit('input', dateTime)
      },
    },
  }
</script>

<style scoped></style>
