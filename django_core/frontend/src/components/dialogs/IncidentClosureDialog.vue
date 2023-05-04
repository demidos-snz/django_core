<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn small outlined :color="status.color" v-bind="attrs" v-on="on">
        {{ status.name }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title>
          <span class="headline">{{ $t('dialogs.incidentClosureDialog.incident_closure') }}</span>
        </v-card-title>
        <v-card-subtitle>
          <span>{{ $t('dialogs.incidentClosureDialog.confirmation') }}</span>
        </v-card-subtitle>
        <v-card-text class="py-2">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Verdict" rules="required" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="incidentVerdictOptions"
                  v-model="verdict"
                  item-value="id"
                  item-text="name"
                  :label="$t('dialogs.incidentClosureDialog.verdict')"
                  outlined
                  :error-messages="errors"
                >
                </v-select>
              </validation-provider>
            </v-col>
            <v-col v-if="showReasonField" class="pb-0">
              <validation-provider name="Reason" rules="required" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="verdictReasons"
                  v-model="verdictReason"
                  item-value="id"
                  item-text="text"
                  :label="$t('dialogs.incidentClosureDialog.reason')"
                  outlined
                  :error-messages="errors"
                >
                </v-select>
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="setIncidentStatusClosed" :disabled="invalid || saveDisabled">
            {{ $t('main.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { STATUS, VERDICT } from '@/constants/enums'
  import validationMixin from '@/mixins/validationMixin'
  import { getIncidentVerdictTypes } from '@/constants/constants'

  export default {
    name: 'IncidentClosureDialog',
    mixins: [validationMixin],
    props: {
      status: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
      verdict: null,
      verdictReason: null,
      saveDisabled: false,
    }),
    methods: {
      ...mapActions('incidents', ['updateIncident']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async setIncidentStatusClosed() {
        const status = STATUS.CLOSED
        const verdict = this.verdict
        const verdictReason = this.verdictReason

        this.saveDisabled = true
        const [error, response] = await this.updateIncident({ status, verdict, verdictReason })
        if (!error && response.status === 200) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    computed: {
      ...mapState('incidents', ['verdictReasons']),
      incidentVerdictOptions() {
        return Object.values(getIncidentVerdictTypes())
      },
      showReasonField() {
        return this.verdict === VERDICT.FALSE_POSITIVE
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .word-break {
    word-break: normal;
  }
</style>
