<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" outlined v-bind="attrs" v-on="on" :disabled="disabled" x-large>
        <v-icon class="pr-3"> mdi-plus </v-icon>
        {{ $t('dialogs.incidentCreation.incident') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.incidentCreation.incident_creation') }}</span>
        </v-card-title>

        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Organization" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :items="Object.values(organizations)"
                  item-text="name"
                  item-value="id"
                  v-model="newIncident.organizationId"
                  :label="$t('dialogs.incidentCreation.organization')"
                  outlined
                  :error-messages="errors"
                  :menu-props="{
                    maxWidth: 360,
                  }"
                >
                  <template v-slot:item="data">
                    <v-list-item-content v-text="data.item.nameVerbose" />
                  </template>
                </v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Type" rules="required" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="incidentTypes()"
                  v-model="newIncident.typeIncident"
                  item-value="id"
                  item-text="name"
                  :label="$t('dialogs.incidentCreation.type')"
                  outlined
                  :error-messages="errors"
                  :menu-props="{
                    maxWidth: 360,
                  }"
                >
                </v-select>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newIncident.name"
                  :label="$t('dialogs.incidentCreation.name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Level" rules="required" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="severityLevels"
                  v-model="newIncident.severityLevel"
                  item-text="name"
                  item-value="id"
                  :label="$t('dialogs.incidentCreation.level')"
                  outlined
                  :error-messages="errors"
                  :menu-props="{
                    maxWidth: 360,
                  }"
                >
                </v-select>
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveIncident" :disabled="invalid || saveDisabled">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import { getIncidentTypes, getSeverityLevels } from '@/constants/constants'

  const NEW_INCIDENT = {
    organizationId: null,
    typeIncident: null,
    name: '',
    severityLevel: null,
  }

  export default {
    name: 'IncidentCreationDialog',
    props: {
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    mixins: [validationMixin],
    data: () => ({
      incidentTypes: getIncidentTypes,
      isActive: false,
      newIncident: {
        ...NEW_INCIDENT,
      },
      saveDisabled: false,
    }),
    computed: {
      ...mapGetters('organizations', ['organizations']),

      severityLevels() {
        return Object.values(getSeverityLevels())
      },
    },
    methods: {
      ...mapActions('incidents', ['createIncident']),

      reset() {
        this.$nextTick(() => {
          Object.assign(this.$data, this.$options.data.apply(this))
        })
      },
      closeDialog() {
        this.dialog = false
        this.saveDisabled = false
        this.reset()
      },
      async saveIncident() {
        this.saveDisabled = true
        const success = await this.createIncident(this.newIncident)
        if (success) {
          this.closeDialog()
        }
      },
    },

    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
