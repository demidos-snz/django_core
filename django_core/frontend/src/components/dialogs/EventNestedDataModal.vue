<template>
  <v-dialog :fullscreen="true" v-model="isActive" max-width="90%">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" icon v-bind="attrs" v-on="on">
        <v-icon> mdi-information-variant </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span class="headline" ref="title">{{ $t('incidents.incidentTableData.events_from') }} {{ event.key }}</span>
        <v-btn small @click="saveCSV">
          csv
          <v-icon small> mdi-download </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-2 event-list">
        <v-simple-table fixed-header class="fill-height">
          <template v-slot:default>
            <thead>
              <tr>
                <th>#</th>
                <th>
                  {{ $t('incidents.incidentTableData.eventsTab.date') }}
                </th>
                <th>
                  {{ $t('incidents.incidentTableData.eventsTab.description') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subEvent, index) in event.nestedEvents" :key="subEvent.id">
                <td>{{ index + 1 }}</td>
                <td>{{ subEvent.data.date | dateFormat }}</td>
                <td>
                  <v-tooltip top color="grey darken-3">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on" class="d-inline-block text-truncate subevent-description">
                        {{ subEvent.data.description }}
                      </span>
                    </template>
                    <span class="subevent-tooltip">{{ subEvent.data.description }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import Incident from '@/store/models/incident'
  import { Event } from '@/store/models/event'
  import mainMixin from '@/mixins/mainMixin'
  import { loadAsFile } from '@/api/events'
  import { isNil } from 'lodash'

  export default {
    name: 'EventNestedDataModal',
    mixins: [mainMixin],
    props: {
      incident: {
        type: Incident,
        required: true,
      },
      event: {
        type: Event,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
    }),

    methods: {
      saveCSV() {
        const params = { eventId: this.event.id, incidentId: this.incident.id, formatFile: 'csv' }

        loadAsFile(params).then((data) => {
          const [error, response] = data
          if (isNil(error) && response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${this.$refs.title.innerHTML}.csv`)
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(url)
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .event-list {
    overflow: auto;
    height: 100%;

    .subevent-description {
      max-width: 200ch;
    }
    .subevent-tooltip {
      display: flex;
      max-width: 400px;
      word-break: break-word;
    }
  }
</style>
