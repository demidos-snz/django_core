<template>
  <v-dialog v-model="isActive" max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" outlined v-bind="attrs" v-on="on" x-large :disabled="disabled">
        <v-icon class="pr-3"> mdi-plus </v-icon>
        {{ $t('dialogs.nodeCreationDialog.node') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.nodeCreationDialog.node_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="d-flex pb-0">
              <validation-provider name="PublicIp" rules="ip" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newNode.publicIpAddress"
                  :label="$t('dialogs.nodeCreationDialog.public_ip')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="PrivateIp" rules="required|ip" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newNode.privateIpAddress"
                  :label="$t('dialogs.nodeCreationDialog.private_ip')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="MacAddress" rules="required|mac" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newNode.macAddress"
                  :label="$t('dialogs.nodeCreationDialog.mac_address')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Network" rules="required" class="half-width" v-slot="{ errors }">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :label="$t('dialogs.nodeCreationDialog.network')"
                  v-model="newNode.networkId"
                  :items="selectedOrganizationNetworksInActives"
                  item-text="name"
                  item-value="id"
                  :multiple="false"
                  :error-messages="errors"
                  outlined
                  class="pl-2"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="InformationSource" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newNode.informationSource"
                  :label="$t('dialogs.nodeCreationDialog.information_source')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Criticality" rules="" class="half-width" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="criticalityLevels"
                  v-model="newNode.criticality"
                  item-text="name"
                  item-value="id"
                  :label="$t('dialogs.nodeCreationDialog.criticality')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                >
                </v-select>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="EstimatedCost" rules="min_value:1" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newNode.estimatedCost"
                  :label="$t('dialogs.nodeCreationDialog.estimated_cost')"
                  outlined
                  type="number"
                  hide-spin-buttons
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Hostname" rules="" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newNode.hostname"
                  :label="$t('dialogs.nodeCreationDialog.hostname')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Location" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newNode.geoAddress"
                  :label="$t('dialogs.nodeCreationDialog.geo_address')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                name="ProcessedDataSecrecy"
                rules="required|min_value:1"
                class="half-width"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="newNode.processedDataSecrecy"
                  :label="$t('dialogs.nodeCreationDialog.processed_data_secrecy')"
                  outlined
                  type="number"
                  hide-spin-buttons
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="newNode.internetAccess"
                :label="$t('dialogs.nodeCreationDialog.internet_access')"
                class="ma-0"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="newNode.isOcii"
                :label="$t('dialogs.nodeCreationDialog.is_cii_object')"
                class="ma-0"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveNetwork()" :disabled="invalid || saveDisabled">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import { getNodeCriticalityLevels } from '@/constants/constants'

  const NEW_NODE = {
    macAddress: '',
    privateIpAddress: '',
    publicIpAddress: '',
    processedDataSecrecy: null,
    informationSource: '',
    criticality: null,
    estimatedCost: '',
    hostname: '',
    networkId: null,
    isOcii: false,
    internetAccess: false,
  }

  export default {
    name: 'NodeCreationDialog',
    props: {
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      newNode: { ...NEW_NODE },
      saveDisabled: false,
    }),
    methods: {
      ...mapActions('organizations', ['createNodeInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      presetAddress() {
        if (this.selectedOrganizationNcirccInActives) {
          this.newNode.geoAddress = this.selectedOrganizationNcirccInActives.address
        }
      },
      async saveNetwork() {
        this.saveDisabled = true
        const [error, response] = await this.createNodeInstance(this.newNode)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationNetworksInActives', 'selectedOrganizationNcirccInActives']),
      criticalityLevels() {
        return Object.values(getNodeCriticalityLevels())
      },
    },
    watch: {
      isActive(newVal) {
        if (newVal) {
          this.presetAddress()
        } else {
          this.closeDialog()
        }
      },
    },
  }
</script>
