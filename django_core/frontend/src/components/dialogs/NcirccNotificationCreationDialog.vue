<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mx-2" color="success" :disabled="disabled" v-bind="attrs" v-on="on" outlined>
        {{ $t('dialogs.ncirccNotificationCreationDialog.send_to_ncircc') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{
            $t('dialogs.ncirccNotificationCreationDialog.ncircc_notification_creation')
          }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="category" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  v-model="category"
                  :items="ncirccTypes"
                  item-value="id"
                  item-text="name"
                  :label="$t('dialogs.ncirccNotificationCreationDialog.notification_category')"
                  outlined
                  :error-messages="errors"
                >
                </v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="pt-0">
              <v-checkbox
                class="ma-0 mx-3 pa-0 d-flex align-center"
                v-model="hasNetwork"
                hide-details
                :label="$t('dialogs.ncirccNotificationCreationDialog.network_connection')"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined :disabled="invalid" @click="emitNotificationCreate">
            {{ $t('main.continue') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import validationMixin from '@/mixins/validationMixin'
  import Incident from '@/store/models/incident'
  import { getNcirccNotificationCategoryOptions } from '@/constants/constants'
  import { NCIRCC_NOTIFICATION_CATEGORY, TYPE_INCIDENT } from '@/constants/enums'

  const INCIDENT_TYPES = [
    TYPE_INCIDENT.BOTNET,
    TYPE_INCIDENT.DDOS_SUCCESS,
    TYPE_INCIDENT.MALWARE_SUCCESS,
    TYPE_INCIDENT.CAPTURE_TRAFFIC,
    TYPE_INCIDENT.PHISHING,
    TYPE_INCIDENT.COMPROMISE,
    TYPE_INCIDENT.INTEGRITY_VIOLATION,
    TYPE_INCIDENT.DISCLOSURE,
    TYPE_INCIDENT.PROHIBITED_CONTENT,
    TYPE_INCIDENT.SPAM,
    TYPE_INCIDENT.EXPLOITATION_SUCCESS,
    TYPE_INCIDENT.POLICY,
  ]

  const ATTACK_TYPES = [
    TYPE_INCIDENT.DDOS_ATTEMPT,
    TYPE_INCIDENT.BRUTE_FORCES,
    TYPE_INCIDENT.MALWARE_ATTEMPT,
    TYPE_INCIDENT.EXPLOITATION_ATTEMPT,
    TYPE_INCIDENT.SCAM,
    TYPE_INCIDENT.SCAN,
    TYPE_INCIDENT.SOCIAL_ENGINEERING,
  ]

  const VULNERABILITY_TYPES = [TYPE_INCIDENT.VULNERABILITY]

  export default {
    name: 'NcirccNotificationCreationDialog',
    mixins: [validationMixin],
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
      isActive: false,
      category: null,
      hasNetwork: false,
      ncirccTypes: getNcirccNotificationCategoryOptions(),
    }),
    methods: {
      closeDialog() {
        this.$set(this, 'isActive', false)
      },

      emitNotificationCreate() {
        const category = this.category
        const hasNetwork = this.hasNetwork
        this.$emit('open-notification-dialog', { category, hasNetwork })
      },
    },

    watch: {
      isActive(active) {
        if (active) {
          if (INCIDENT_TYPES.includes(this.incident.typeIncident)) {
            this.category = NCIRCC_NOTIFICATION_CATEGORY.INCIDENT
          } else if (ATTACK_TYPES.includes(this.incident.typeIncident)) {
            this.category = NCIRCC_NOTIFICATION_CATEGORY.ATTACK
          } else if (VULNERABILITY_TYPES.includes(this.incident.typeIncident)) {
            this.category = NCIRCC_NOTIFICATION_CATEGORY.VULNERABILITY
          }
        }
      },
    },
  }
</script>
