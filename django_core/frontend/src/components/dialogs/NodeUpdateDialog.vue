<template>
  <v-dialog v-model="isActive" max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small v-bind="attrs" v-on="on" class="pa-0" color="primary" icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.nodeUpdateDialog.node_update') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="d-flex pb-0">
              <validation-provider name="PublicIp" rules="required|ip" class="half-width" v-slot="{ errors }">
                <v-text-field
                  @input="addChanges('publicIpAddress', $event)"
                  :value="getLocalChanges('publicIpAddress')"
                  :label="$t('dialogs.nodeUpdateDialog.public_ip')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="PrivateIp" rules="required|ip" class="half-width" v-slot="{ errors }">
                <v-text-field
                  @input="addChanges('privateIpAddress', $event)"
                  :value="getLocalChanges('privateIpAddress')"
                  :label="$t('dialogs.nodeUpdateDialog.private_ip')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="MacAddress" rules="required|mac" class="half-width" v-slot="{ errors }">
                <v-text-field
                  @input="addChanges('macAddress', $event)"
                  :value="getLocalChanges('macAddress')"
                  :label="$t('dialogs.nodeUpdateDialog.mac_address')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Network" rules="required" class="half-width" v-slot="{ errors }">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :label="$t('dialogs.nodeUpdateDialog.network')"
                  @input="addChanges('networkId', $event)"
                  :value="getLocalChanges('networkId')"
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
                  @input="addChanges('informationSource', $event)"
                  :value="getLocalChanges('informationSource')"
                  :label="$t('dialogs.nodeUpdateDialog.information_source')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Criticality" rules="required" class="half-width" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="criticalityLevels"
                  @input="addChanges('criticality', $event)"
                  :value="getLocalChanges('criticality')"
                  :label="$t('dialogs.nodeUpdateDialog.criticality')"
                  item-text="name"
                  item-value="id"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                >
                </v-select>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider
                name="EstimatedCost"
                rules="required|min_value:1"
                class="half-width"
                v-slot="{ errors }"
              >
                <v-text-field
                  @input="addChanges('estimatedCost', $event)"
                  :value="getLocalChanges('estimatedCost')"
                  :label="$t('dialogs.nodeUpdateDialog.estimated_cost')"
                  outlined
                  type="number"
                  hide-spin-buttons
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Hostname" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  @input="addChanges('hostname', $event)"
                  :value="getLocalChanges('hostname')"
                  :label="$t('dialogs.nodeUpdateDialog.hostname')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Location" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  @input="addChanges('geoAddress', $event)"
                  :value="getLocalChanges('geoAddress')"
                  :label="$t('dialogs.nodeUpdateDialog.geo_address')"
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
                  @input="addChanges('processedDataSecrecy', $event)"
                  :value="getLocalChanges('processedDataSecrecy')"
                  :label="$t('dialogs.nodeUpdateDialog.processed_data_secrecy')"
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
                @change="addChanges('internetAccess', $event)"
                :input-value="getLocalChanges('internetAccess')"
                :label="$t('dialogs.nodeUpdateDialog.internet_access')"
                class="ma-0"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                @change="addChanges('isOcii', $event)"
                :input-value="getLocalChanges('isOcii')"
                :label="$t('dialogs.nodeUpdateDialog.is_cii_object')"
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
          <v-btn color="green" outlined :disabled="invalid || !isNodeEdited" @click="saveNode()">
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
  import { isNil, isEqual, isEmpty } from 'lodash'
  import Node from '@/store/models/node'
  import { getChanges } from '@/utils'
  import Vue from 'vue'
  import { getNodeCriticalityLevels } from '@/constants/constants'

  export default {
    name: 'nodeUpdateDialog',
    mixins: [validationMixin],
    props: {
      node: {
        type: Node,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
      changes: {},
    }),
    methods: {
      ...mapActions('organizations', ['updateNodeInstance']),
      addChanges(fieldName, eventData) {
        const id = this.node.id
        const oldData = this.node

        if (isEqual(oldData[fieldName], eventData)) {
          Vue.delete(this.changes[id], fieldName)
          if (isEmpty(this.changes[id])) {
            Vue.delete(this.changes, id)
          }
          return
        }

        if (isNil(this.changes[id])) {
          Vue.set(this.changes, id, {})
        }

        Vue.set(this.changes[id], fieldName, eventData)
      },
      getLocalChanges(fieldName) {
        const itemId = this.node.id
        const changesObj = this.changes[itemId]
        const sourceObj = this.node
        return getChanges(fieldName, changesObj, sourceObj)
      },
      async saveNode() {
        const nodeId = this.node.id
        const params = this.changes[nodeId]

        const [error, response] = await this.updateNodeInstance({
          id: nodeId,
          params: params,
        })
        if (!error && response.status === 200) {
          Vue.delete(this.changes, nodeId)
        }
      },
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationNetworksInActives']),
      isNodeEdited() {
        const nodeId = this.node.id
        return !isEmpty(this.changes[nodeId])
      },
      criticalityLevels() {
        return Object.values(getNodeCriticalityLevels())
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
