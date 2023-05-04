<template>
  <v-dialog v-model="isActive" max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small v-bind="attrs" v-on="on" class="pa-0 ml-2" icon>
        <v-icon>mdi-information-variant</v-icon>
      </v-btn>
    </template>
    <v-card outlined v-if="isActive">
      <v-card-title class="white--text headline">
        <span class="headline">{{ $t('dialogs.nodeInfoDialog.node_info') }}</span>
      </v-card-title>
      <v-card-text class="py-4">
        <v-row class="d-flex flex-column">
          <v-col class="d-flex pb-0">
            <v-text-field
              v-model="node.publicIpAddress"
              :label="$t('dialogs.nodeInfoDialog.public_ip')"
              outlined
              class="pr-2"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="node.privateIpAddress"
              :label="$t('dialogs.nodeInfoDialog.private_ip')"
              outlined
              class="pl-2"
              readonly
            ></v-text-field>
          </v-col>
          <v-col class="d-flex pb-0">
            <v-text-field
              v-model="node.macAddress"
              :label="$t('dialogs.nodeInfoDialog.mac_address')"
              outlined
              class="pr-2 half-width"
              readonly
            ></v-text-field>
            <v-autocomplete
              :no-data-text="$t('main.no_data')"
              :label="$t('dialogs.nodeInfoDialog.network')"
              v-model="node.networkId"
              :items="selectedOrganizationNetworksInActives"
              item-text="name"
              item-value="id"
              :multiple="false"
              outlined
              class="pl-2 half-width"
              readonly
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex pb-0">
            <v-text-field
              v-model="node.informationSource"
              :label="$t('dialogs.nodeInfoDialog.information_source')"
              outlined
              class="pr-2 half-width"
              readonly
            ></v-text-field>
            <v-select
              :no-data-text="$t('main.no_data')"
              :items="criticalityLevels"
              v-model="node.criticality"
              item-text="name"
              item-value="id"
              :label="$t('dialogs.nodeInfoDialog.criticality')"
              outlined
              class="pl-2 half-width"
              readonly
            >
            </v-select>
          </v-col>
          <v-col class="d-flex pb-0">
            <v-text-field
              v-model="node.estimatedCost"
              :label="$t('dialogs.nodeInfoDialog.estimated_cost')"
              outlined
              type="number"
              hide-spin-buttons
              class="pr-2"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="node.hostname"
              :label="$t('dialogs.nodeInfoDialog.hostname')"
              outlined
              class="pl-2"
              readonly
            ></v-text-field>
          </v-col>
          <v-col class="d-flex pb-0">
            <v-text-field
              v-model="node.geoAddress"
              :label="$t('dialogs.nodeInfoDialog.geo_address')"
              outlined
              class="pr-2"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="node.processedDataSecrecy"
              :label="$t('dialogs.nodeInfoDialog.processed_data_secrecy')"
              outlined
              type="number"
              hide-spin-buttons
              class="pl-2"
              readonly
            ></v-text-field>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="node.internetAccess"
              :label="$t('dialogs.nodeInfoDialog.internet_access')"
              class="ma-0"
              hide-details
              readonly
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="node.isOcii"
              :label="$t('dialogs.nodeInfoDialog.is_cii_object')"
              class="ma-0"
              hide-details
              readonly
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pb-5 px-4">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Node from '@/store/models/node'
  import { getNodeCriticalityLevels } from '@/constants/constants'

  export default {
    name: 'NodeInfoDialog',
    props: {
      node: {
        type: Node,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
    }),
    methods: {
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationNetworksInActives']),
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
