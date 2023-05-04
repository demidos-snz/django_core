<template>
  <v-container v-if="incidentLoading || isNil(currentIncident)" fluid fill-height class="justify-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-container>
  <v-container fluid v-else>
    <v-row class="bottom-border">
      <v-col class="d-flex align-center pt-0 overflow-hidden">
        <v-icon class="mr-2" v-if="currentIncident.confirmed"> mdi-check </v-icon>
        <IncidentStatusField :incident="currentIncident" />
        <v-col :cols="$vuetify.breakpoint.width > 1400 ? 4 : 3">
          <v-text-field
            v-if="p9s.canRead(ruleEntities.NAME)"
            :value="currentIncident.name"
            @change="setIncidentName"
            :prefix="`${currentIncident.hrid} - `"
            dense
            outlined
            :readonly="!p9s.canUpdate(ruleEntities.NAME)"
            hide-details
          >
          </v-text-field>
          <v-chip v-else color="orange" label outlined> {{ $t('readPermissions.cant_read_name') }} </v-chip>
        </v-col>
        <v-col class="d-flex flex-start text-left pa-0 ml-2" cols="auto">
          <p class="d-flex flex-column ma-0 mr-2 col-auto py-0 align-self-center">
            <span>{{ $t('incidents.incidentPage.created') }}:</span>
            <span>{{ $t('incidents.incidentPage.edited') }}:</span>
          </p>
          <p class="d-flex flex-column ma-0 col-auto py-0 align-self-center">
            <span class="grey--text text--lighten-1 font-weight-light">
              {{ currentIncident.registrationDatetime }}
            </span>
            <span class="grey--text text--lighten-1 font-weight-light">
              {{ currentIncident.lastModifiedDatetime }}
            </span>
          </p>
        </v-col>
        <v-col class="d-flex flex-start text-left pa-0 ml-2" cols="auto">
          <p class="d-flex flex-column ma-0 mr-2 col-auto py-0 align-self-center">
            <span>{{ $t('incidents.incidentPage.viewed_by_client') }}:</span>
            <span>{{ $t('incidents.incidentPage.closed') }}:</span>
          </p>
          <p class="d-flex flex-column ma-0 col-auto py-0 align-self-center">
            <span class="grey--text text--lighten-1 font-weight-light">
              {{ currentIncident.lastViewedByClient }}
            </span>
            <span class="grey--text text--lighten-1 font-weight-light">
              {{ currentIncident.closedDatetime }}
            </span>
          </p>
        </v-col>
      </v-col>
      <v-col class="d-flex justify-end align-center pt-0" cols="auto">
        <v-btn
          outlined
          color="white"
          class="mr-2 incident-download-button"
          @click="exportIncident"
          :disabled="exportBtnDisabled"
        >
          <img src="@/../public/pdf-export.png" alt="pdf-export" height="27" width="27" loading="eager" />
        </v-btn>
        <v-btn
          v-if="!currentIncident.transmissionDatetime"
          outlined
          color="primary"
          :disabled="!canSendNotification(currentIncident)"
          @click="sendNotification"
        >
          <span v-show="$vuetify.breakpoint.width >= 1400">
            {{ $t('incidents.incidentPage.send_to_customer') }}
          </span>
          <v-icon v-show="$vuetify.breakpoint.width < 1400">mdi-file-send</v-icon>
        </v-btn>
        <v-tooltip top color="grey darken-3" v-else>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <v-btn outlined color="success">
                {{ $t('incidents.incidentPage.sent_to_customer') }}
              </v-btn>
            </span>
          </template>
          {{ currentIncident.transmissionDatetime }}
        </v-tooltip>
        <IncidentDeletionDialog :incident="currentIncident" :disabled="!canDeleteIncident(currentIncident)" />
      </v-col>
    </v-row>
    <v-row class="main-data-row">
      <IncidentMainData :incident="currentIncident" />
    </v-row>
    <v-row class="table-data-row">
      <IncidentTableData :incident="currentIncident" />
    </v-row>
  </v-container>
</template>

<script>
  import { isNil } from 'lodash'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import IncidentDeletionDialog from '@/components/dialogs/IncidentDeletionDialog'
  import rightsMixin from '@/mixins/rightsMixin'
  import IncidentMainData from '@/components/Incidents/IncidentMainData'
  import IncidentTableData from '@/components/Incidents/IncidentTableData'
  import { RULE_ENTITIES } from '@/constants/enums'
  import IncidentStatusField from '@/components/Incidents/IncidentStatusField'

  export default {
    name: 'IncidentPage',
    components: {
      IncidentTableData,
      IncidentMainData,
      IncidentDeletionDialog,
      IncidentStatusField,
    },
    mixins: [rightsMixin],
    data: () => ({
      isNil,
      ruleEntities: RULE_ENTITIES,
      exportBtnDisabled: false,
    }),

    computed: {
      ...mapState('incidents', ['incidentLoading']),
      ...mapGetters('incidents', ['currentIncident']),
      ...mapGetters('operator', ['role', 'operator']),
      ...mapGetters('permissions', ['p9s']),
    },

    methods: {
      ...mapActions('incidents', [
        'openIncident',
        'closeIncident',
        'updateIncident',
        'sendConfirmation',
        'exportIncidentAsPdf',
      ]),
      setIncidentStatus(status) {
        this.updateIncident({ status })
      },

      setIncidentName(name) {
        this.updateIncident({ name })
      },

      sendNotification() {
        this.sendConfirmation()
      },

      async exportIncident() {
        this.exportBtnDisabled = true
        const [error, response] = await this.exportIncidentAsPdf(this.currentIncident.id)
        if (!error && response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')

          link.setAttribute('href', url)
          link.setAttribute('download', `${this.currentIncident.hrid}.pdf`)
          document.body.appendChild(link)

          link.click()
          link.remove()
          URL.revokeObjectURL(url)
        }

        this.exportBtnDisabled = false
      },
    },

    mounted() {
      this.openIncident(this.$route.params.incidentId)
    },

    beforeDestroy() {
      this.closeIncident()
    },
  }
</script>
<style lang="scss" scoped>
  .inc-name {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50ch;
  }
  .bottom-border {
    height: 73px;
    border-bottom: 1px solid rgb(94, 94, 94);
  }
  .main-data-row,
  .table-data-row {
    height: calc(100% / 2 - 73px / 2);
  }
  .incident-download-button {
    padding: 0 10px !important;
    min-width: 45px !important;
  }
</style>
