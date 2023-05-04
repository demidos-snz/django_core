<template>
  <v-dialog fullscreen v-model="dialog" persistent no-click-animation>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mx-2" color="success" :disabled="disabled" v-bind="attrs" v-on="on" icon small>
        <v-icon> mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title class="white--text headline">
        {{ $t('dialogs.eventSelection.event_selection') }}
      </v-card-title>
      <v-row class="pa-4 mx-0 data-container" justify="space-between">
        <v-col cols="2" class="overflow-auto data-container">
          <div class="title grey--text text--lighten-1 font-weight-light">
            {{ $t('organizations.organizationMainData.analytic_systems') }}
          </div>
          <v-list shaped class="item-list">
            <v-list-item-group :value="selectedSiemId" color="primary">
              <v-list-item
                :value="siem.id"
                :disabled="loading"
                v-for="siem of incident.organization.siems"
                :key="siem.id"
                @click.prevent="selectSiemId(siem.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-tooltip right open-delay="500">
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ siem.name }}</span>
                      </template>
                      <span>{{ siem.name }}</span>
                    </v-tooltip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <div class="title grey--text text--lighten-1 font-weight-light">
            {{ $t('incidents.incidentMainData.sensors') }}
          </div>
          <v-text-field
            v-model="search"
            :label="$t('main.search')"
            outlined
            clearable
            hide-details
            class="my-3"
          ></v-text-field>
          <p v-if="!segments.length">{{ $t('incidents.incidentTableData.eventsTab.no_sensors') }}</p>
          <v-treeview
            v-else
            :disabled="loading"
            :key="selectedSiemId"
            class="pr-2"
            item-children="sensors"
            @update:active="selectSensor"
            :multiple-active="false"
            :items="segments"
            :search="search"
            :filter="segmentFilter"
            activatable
            return-object
            shaped
            item-key="itemKey"
            color="primary"
            open-on-click
            transition
          >
            <template v-slot:label="{ item }">
              <v-tooltip right open-delay="500">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{ item.name }}</span>
                </template>
                <span>{{ item.name }}</span>
              </v-tooltip>
            </template>
          </v-treeview>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="10" class="d-flex text-center">
          <v-scroll-y-transition mode="out-in">
            <div
              v-if="!selectedSiemId"
              class="d-flex fill-height justify-center align-center title grey--text text--lighten-1 font-weight-light full-width"
            >
              {{ $t('dialogs.eventSelection.select_siem') }}
            </div>
            <div
              v-else-if="!selectedSensorId"
              class="d-flex fill-height justify-center align-center title grey--text text--lighten-1 font-weight-light full-width"
            >
              {{ $t('dialogs.eventSelection.select_sensor') }}
            </div>
            <v-card v-else elevation="0" class="full-width">
              <v-data-table
                v-model="selectedEvents"
                fixed-header
                calculate-widths
                :loading="loading"
                :headers="headers"
                :items="events"
                :search="tableSearch"
                :single-select="false"
                :page="page"
                :items-per-page="perPage"
                item-key="id"
                show-select
                dense
                height="calc(100vh - 300px)"
                class="elevation-0"
              >
                <template v-slot:top>
                  <v-row class="mb-1">
                    <v-col>
                      <v-text-field
                        prepend-inner-icon="mdi-format-text"
                        v-model="tableSearch"
                        hide-details
                        :label="$t('dialogs.eventSelection.search_in_events')"
                      />
                    </v-col>
                    <v-col>
                      <v-dialog
                        ref="startDateDialog"
                        v-model="startDateModal"
                        :return-value.sync="startDatetime"
                        persistent
                        width="400px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="startDatetime"
                            :label="$t('dialogs.eventSelection.period_start')"
                            prepend-inner-icon="mdi-calendar"
                            class="pb-3"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <DatetimePicker
                          ref="startDatPicker"
                          :datetimeFormat="datetimeFormat"
                          :dateFormat="dateFormat"
                          :timeFormat="timeFormat"
                          v-model="startDatetime"
                          :allowed-dates="getAllowedStartDates"
                          first-day-of-week="1"
                          header-color="grey darken-3"
                          scrollable
                          color="primary"
                        >
                          <template v-slot:actions>
                            <v-col class="d-flex flex-row justify-center">
                              <v-btn text color="primary" @click="clearDate('start')">
                                {{ $t('main.clear') }}
                              </v-btn>
                              <v-btn text color="primary" @click="startDateModal = false">
                                {{ $t('main.cancel') }}
                              </v-btn>
                              <v-btn text color="primary" @click="setDate('start')">
                                {{ $t('main.ok') }}
                              </v-btn>
                            </v-col>
                          </template>
                        </DatetimePicker>
                      </v-dialog>
                    </v-col>
                    <v-col>
                      <v-dialog
                        ref="endDateDialog"
                        v-model="endDateModal"
                        :return-value.sync="endDatetime"
                        persistent
                        width="400px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="endDatetime"
                            :label="$t('dialogs.eventSelection.period_end')"
                            prepend-inner-icon="mdi-calendar"
                            class="pb-3"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <DatetimePicker
                          ref="endDatPicker"
                          :datetimeFormat="datetimeFormat"
                          :dateFormat="dateFormat"
                          :timeFormat="timeFormat"
                          v-model="endDatetime"
                          :allowed-dates="getAllowedEndDates"
                          first-day-of-week="1"
                          header-color="grey darken-3"
                          scrollable
                          color="primary"
                        >
                          <template v-slot:actions>
                            <v-col class="d-flex flex-row justify-center">
                              <v-btn text color="primary" @click="clearDate('end')">
                                {{ $t('main.clear') }}
                              </v-btn>
                              <v-btn text color="primary" @click="endDateModal = false">
                                {{ $t('main.cancel') }}
                              </v-btn>
                              <v-btn text color="primary" @click="setDate('end')">
                                {{ $t('main.ok') }}
                              </v-btn>
                            </v-col>
                          </template>
                        </DatetimePicker>
                      </v-dialog>
                    </v-col>
                    <v-col class="d-flex align-center" cols="auto">
                      <v-btn color="green" outlined @click="handleFetchEvents()">
                        {{ $t('main.apply') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:[`body.prepend`]>
                  <tr v-if="selectedSensorType === sensorTypes.MP_SIEM" class="row-separate-columns">
                    <td>
                      <v-icon small>mdi-filter</v-icon>
                    </td>
                    <td>
                      <v-text-field v-model="filters.key" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.name" type="text"></v-text-field>
                    </td>
                    <td></td>
                    <td>
                      <v-text-field v-model="filters.sourceHostName" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.sourceAddress" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.destinationHostName" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.destinationAddress" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.severity" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.description" type="text"></v-text-field>
                    </td>
                  </tr>
                  <tr v-else class="row-separate-columns">
                    <td>
                      <v-icon small>mdi-filter</v-icon>
                    </td>
                    <td>
                      <v-text-field v-model="filters.sid" type="text"></v-text-field>
                    </td>
                    <td></td>
                    <td>
                      <v-text-field v-model="filters.hostName" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.sourceAddress" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.destinationAddress" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.name" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.object" type="text"></v-text-field>
                    </td>
                    <td>
                      <v-text-field v-model="filters.destinationNtDomain" type="text"></v-text-field>
                    </td>
                  </tr>
                </template>
                <template v-slot:[`item.sid`]="{ value }">
                  <div
                    class="d-inline-block text-truncate max-width-20c"
                    :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                  ></div>
                </template>
                <template v-slot:[`item.key`]="{ value }">
                  <div
                    class="d-inline-block text-truncate max-width-20c"
                    :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                  ></div>
                </template>
                <template v-slot:[`item.severity`]="{ value }">
                  <div
                    class="d-inline-block text-truncate max-width-20c"
                    :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                  ></div>
                </template>
                <template v-slot:[`item.deviceReceiptTime`]="{ value }">
                  <div
                    class="d-inline-block text-truncate max-width-20c"
                    :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                  ></div>
                </template>
                <template v-slot:[`item.hostName`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.sourceAddress`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.destinationAddress`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.sourceHostName`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.destinationHostName`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.name`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.object_`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.destinationNtDomain`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span>{{ value || '' }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.description`]="{ value }">
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="d-inline-block text-truncate max-width-20c"
                        :inner-html.prop="value || '' | highlightSearchResults(tableSearch)"
                      ></div>
                    </template>
                    <span class="event-description">{{ value || '' }}</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
          </v-scroll-y-transition>
        </v-col>
      </v-row>
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.cancel') }}
        </v-btn>
        <v-btn color="green" outlined @click="save" :disabled="!selectedEvents.length">
          {{ $t('main.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { isNil } from 'lodash'
  import moment from 'moment'
  import Incident from '@/store/models/incident'
  import mainMixin from '@/mixins/mainMixin'
  import validationMixin from '@/mixins/validationMixin'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { SENSOR_TYPES } from '@/constants/enums'
  import Sensor from '@/store/models/sensor'
  import { getEventSelectionDialogHeaders, dateFormat, timeFormat, datetimeFormat } from '@/constants/constants'
  import DatetimePicker from '@/components/tableHelpers/DatetimePicker'

  export default {
    name: 'EventSelectionDialog',
    mixins: [mainMixin, validationMixin],
    components: {
      DatetimePicker,
    },
    props: {
      incident: {
        type: Incident,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      sensorTypes: SENSOR_TYPES,
      dialog: false,
      selectedEvents: [],
      search: '',
      tableSearch: '',
      startDateModal: false,
      endDateModal: false,
      startDatetime: null,
      endDatetime: null,
      filters: {
        key: null,
        sid: null,
        hostName: null,
        sourceAddress: null,
        sourceHostName: null,
        destinationAddress: null,
        destinationHostName: null,
        name: null,
        object: null,
        destinationNtDomain: null,
        severity: null,
        description: null,
      },
      dateFormat,
      timeFormat,
      datetimeFormat,
    }),
    computed: {
      ...mapState('events', ['loading', 'page', 'perPage', 'selectedSensorId', 'selectedSiemId']),
      ...mapGetters('events', ['events', 'selectedSensor']),
      selectedSensorType() {
        return this.selectedSensor ? this.selectedSensor.typeSensor : null
      },
      headers() {
        const headers = getEventSelectionDialogHeaders()
        let headerItems = headers.default

        if (this.selectedSensorType === SENSOR_TYPES.MP_SIEM) {
          headerItems = headers[SENSOR_TYPES.MP_SIEM]
        }

        return Object.keys(headerItems).map((key) => {
          return {
            text: headerItems[key],
            value: key,
          }
        })
      },
      segments() {
        return this.incident.organization.segments
      },
      minStart() {
        if (!this.endDatetime) return null
        const resultDate = moment(this.endDatetime).subtract(1, 'month')
        return resultDate.format(this.dateFormat)
      },
      minEnd() {
        if (!this.startDatetime) return null
        const resultDate = moment(this.startDatetime).add(1, 'month')
        return resultDate.format(this.dateFormat)
      },
      segmentFilter() {
        return (item, search) => {
          switch (item.type) {
            case 'segment':
              return item.name.toLowerCase().includes(search.toLowerCase())
            case 'sensor':
              return (
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.address.toLowerCase().includes(search.toLowerCase())
              )
          }
        }
      },
    },

    methods: {
      ...mapActions('events', [
        'fetchEvents',
        'addEventsToIncident',
        'setSelectedSensorId',
        'setSelectedSiemId',
        'resetEventsPackData',
      ]),

      selectSiemId(siemId) {
        let id = siemId
        if (siemId === this.selectedSiemId) id = null
        this.setSelectedSiemId(id)
      },

      selectSensor(selected) {
        this.setSelectedSensorId(null)

        const selectedItem = selected[0]
        if (selectedItem instanceof Sensor) {
          this.setSelectedSensorId(selectedItem.id)
        }
      },

      closeDialog() {
        this.dialog = false
        this.$nextTick(() => {
          this.clearData()
        })
      },

      handleFetchEvents() {
        const params = {}
        for (const [key, value] of Object.entries(this.filters)) {
          if (value && value.trim()) params[key] = value.trim()
        }

        if (this.startDatetime && !this.endDatetime) {
          this.endDatetime = moment().format(this.datetimeFormat)
        }

        if (this.endDatetime && !this.startDatetime) {
          const end = moment(this.endDatetime).subtract(1, 'day')
          this.startDatetime = end.format(this.datetimeFormat)
        }

        if (this.startDatetime && this.endDatetime) {
          params.gte = moment.utc(this.startDatetime).format(this.datetimeFormat)
          params.lte = moment.utc(this.endDatetime).format(this.datetimeFormat)
        }

        this.resetEventsPackData()
        this.fetchEvents(params)
      },

      save() {
        const eventIds = this.selectedEvents.map((item) => item.id)
        this.addEventsToIncident({ eventIds }).then((data) => {
          const [error] = data
          if (isNil(error)) {
            this.closeDialog()
          }
        })
      },

      clearData() {
        this.selectedEvents = []
        this.startDateModal = false
        this.endDateModal = false
        this.startDatetime = null
        this.endDatetime = null
        this.resetEventsPackData()
      },

      setDate(type) {
        switch (type) {
          case 'start':
            this.$refs.startDatPicker.apply()
            this.$refs.startDateDialog.save(this.startDatetime)
            break
          case 'end':
            this.$refs.endDatPicker.apply()
            this.$refs.endDateDialog.save(this.endDatetime)
            break

          default:
            break
        }
      },

      clearDate(type) {
        switch (type) {
          case 'start':
            this.$refs.startDateDialog.save(null)
            this.startDateModal = false
            break

          case 'end':
            this.$refs.endDateDialog.save(null)
            this.endDateModal = false
            break

          default:
            break
        }
      },

      getAllowedStartDates(date) {
        if (this.minStart) {
          return moment(date).isSameOrAfter(this.minStart) && moment(date).isSameOrBefore(this.endDatetime)
        }
        return true
      },

      getAllowedEndDates(date) {
        if (this.minEnd) {
          return moment(date).isSameOrAfter(this.startDatetime) && moment(date).isSameOrBefore(this.minEnd)
        }
        return true
      },
    },

    beforeDestroy() {
      this.clearData()
    },

    watch: {
      selectedSensorId() {
        if (this.selectedSiemId && this.selectedSensorId) {
          this.clearData()
        }
      },

      dialog(value) {
        if (!value) {
          this.clearData()
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .data-container {
    height: calc(100vh - 115px);

    .event-description {
      display: flex;
      max-width: 200px;
      word-break: break-word;
    }
  }

  // .row-separate-columns {
  //   td:not(:last-child) {
  //     border-right: 1px solid #ffffff1f;
  //   }
  // }
</style>
