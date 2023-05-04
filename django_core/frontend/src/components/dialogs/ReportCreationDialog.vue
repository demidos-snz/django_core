<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" outlined class="mx-3" v-bind="attrs" v-on="on" x-large>
        <v-icon class="pr-3"> mdi-plus </v-icon>
        {{ $t('dialogs.reportCreationDialog.report') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.reportCreationDialog.report_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newReport.name"
                  :label="$t('dialogs.reportCreationDialog.name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Step" rules="required" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="reportTypes"
                  v-model="newReport.step"
                  item-value="id"
                  item-text="name"
                  :label="$t('dialogs.reportCreationDialog.type')"
                  :error-messages="errors"
                  outlined
                  :menu-props="{
                    maxWidth: 350,
                  }"
                >
                </v-select>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Organization" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :items="filteredOrganizations"
                  item-text="name"
                  item-value="id"
                  v-model="newReport.organizationId"
                  :label="$t('dialogs.reportCreationDialog.organization')"
                  :error-messages="errors"
                  outlined
                  :menu-props="{
                    maxWidth: 350,
                  }"
                >
                  <template v-slot:item="data">
                    <v-list-item-content v-text="data.item.nameVerbose" />
                  </template>
                </v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <v-dialog
                ref="periodStartDialog"
                v-model="periodStartModal"
                :return-value.sync="newReport.dateFrom"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider name="PeriodStart" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="newReport.dateFrom"
                      :label="$t('dialogs.reportCreationDialog.start_date')"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      :error-messages="errors"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker
                  :allowed-dates="isStartDateAllowed"
                  v-model="newReport.dateFrom"
                  scrollable
                  color="primary"
                  header-color="grey darken-3"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="periodStartModal = false">
                    {{ $t('main.cancel') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.periodStartDialog.save(newReport.dateFrom)">
                    {{ $t('main.ok') }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col class="pb-0">
              <v-dialog
                ref="periodEndDialog"
                v-model="periodEndModal"
                :return-value.sync="newReport.dateTo"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider name="PeriodEnd" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="newReport.dateTo"
                      :label="$t('dialogs.reportCreationDialog.end_date')"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      :error-messages="errors"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker
                  :allowed-dates="isEndDateAllowed"
                  v-model="newReport.dateTo"
                  scrollable
                  color="primary"
                  header-color="grey darken-3"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="periodEndModal = false">
                    {{ $t('main.cancel') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.periodEndDialog.save(newReport.dateTo)">
                    {{ $t('main.ok') }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveReport" :disabled="invalid || saveDisabled">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { getReportTypes } from '@/constants/constants'
  import validationMixin from '@/mixins/validationMixin'
  import { isEmpty } from 'lodash'
  import moment from 'moment'

  const NEW_REPORT = {
    name: '',
    organizationId: null,
    step: null,
    dateFrom: '',
    dateTo: '',
  }

  export default {
    name: 'ReportCreationDialog',
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      periodStartModal: false,
      periodEndModal: false,
      newReport: { ...NEW_REPORT },
      saveDisabled: false,
    }),
    methods: {
      ...mapActions('reports', ['createReportInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveReport() {
        this.saveDisabled = true
        const [error, response] = await this.createReportInstance(this.newReport)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
      isStartDateAllowed(date) {
        if (isEmpty(this.newReport.dateTo)) {
          return true
        }
        return moment(date).isSameOrBefore(this.newReport.dateTo)
      },
      isEndDateAllowed(date) {
        if (isEmpty(this.newReport.dateFrom)) {
          return true
        }
        return moment(date).isSameOrAfter(this.newReport.dateFrom)
      },
    },
    computed: {
      ...mapGetters('organizations', ['organizations']),
      reportTypes() {
        return Object.values(getReportTypes())
      },
      filteredOrganizations() {
        // Reports can be generated only for parent organizations
        return Object.values(this.organizations).filter((organization) => !organization.parentId)
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
