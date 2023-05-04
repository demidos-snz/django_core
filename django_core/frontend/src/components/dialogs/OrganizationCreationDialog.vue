<template>
  <v-dialog v-model="isActive" max-width="700px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" v-bind="attrs" v-on="on" icon large :disabled="disabled">
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.organizationCreation.organization_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="d-flex pb-0">
              <validation-provider name="Name" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newOrganization.name"
                  :label="$t('dialogs.organizationCreation.name')"
                  :hint="$t('fieldHints.organization.name')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="ShortName" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newOrganization.shortName"
                  :label="$t('dialogs.organizationCreation.short_name')"
                  :hint="$t('fieldHints.organization.short_name')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Hrid" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newOrganization.hrid"
                  :label="$t('dialogs.organizationCreation.prefix')"
                  :hint="$t('fieldHints.organization.prefix')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="HeadOrganization" rules="" class="half-width" v-slot="{ errors }">
                <v-autocomplete
                  :items="organizationsList"
                  item-text="name"
                  item-value="id"
                  v-model="newOrganization.organizationId"
                  :label="$t('dialogs.organizationCreation.parent')"
                  outlined
                  :error-messages="errors"
                  :menu-props="{
                    maxWidth: 360,
                  }"
                  class="pl-2"
                >
                  <template v-slot:item="data">
                    <v-list-item-content v-text="data.item.name" />
                  </template>
                </v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Address" rules="required" class="full-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newOrganization.address"
                  :label="$t('dialogs.organizationCreation.address')"
                  :hint="$t('fieldHints.organization.address')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <v-dialog
                ref="contractDateDialog"
                v-model="contractDateModal"
                :return-value.sync="newOrganization.contractDate"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider name="ContractDate" rules="required" class="half-width" v-slot="{ errors }">
                    <v-text-field
                      v-model="newOrganization.contractDate"
                      :label="$t('dialogs.organizationCreation.contract_start_date')"
                      :hint="$t('fieldHints.organization.contract_start_date')"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      outlined
                      :error-messages="errors"
                      v-bind="attrs"
                      v-on="on"
                      class="pr-2"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker
                  v-model="newOrganization.contractDate"
                  scrollable
                  color="primary"
                  header-color="grey darken-3"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="contractDateModal = false">
                    {{ $t('main.cancel') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.contractDateDialog.save(newOrganization.contractDate)">
                    {{ $t('main.ok') }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
              <validation-provider
                name="ContractDuration"
                rules="required|min_value:2"
                class="half-width"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="newOrganization.contractDuration"
                  :label="$t('dialogs.organizationCreation.contract_duration')"
                  outlined
                  :error-messages="errors"
                  type="number"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="File" class="full-width" v-slot="{ errors }">
                <v-file-input
                  v-model="newOrganization.structureFile"
                  type="file"
                  counter
                  accept=".json"
                  :label="$t('dialogs.organizationCreation.structure')"
                  prepend-inner-icon="mdi-paperclip"
                  prepend-icon=""
                  outlined
                  :error-messages="errors"
                  :show-size="1000"
                ></v-file-input>
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveOrganization" :disabled="invalid || saveDisabled">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import validationMixin from '../../mixins/validationMixin'

  const NEW_ORGANIZATION = {
    name: '',
    shortName: '',
    hrid: '',
    contract: '',
    contractDate: '',
    contractDuration: '',
    structureFile: null,
    organizationId: null,
    address: '',
  }

  export default {
    name: 'OrganizationCreationDialog',
    props: {
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      contractDateModal: false,
      newOrganization: { ...NEW_ORGANIZATION },
      saveDisabled: false,
    }),
    computed: {
      ...mapGetters('organizations', ['organizations']),

      organizationsList() {
        return Object.values(this.organizations).map((item) => ({ id: item.id, name: item.nameVerbose }))
      },
    },
    methods: {
      ...mapActions('organizations', ['createOrganizationInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveOrganization() {
        this.saveDisabled = true
        const [error, response] = await this.createOrganizationInstance(this.newOrganization)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
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
