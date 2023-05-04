<template>
  <v-scroll-y-transition mode="out-in">
    <v-card class="d-flex flex-column fill-height pa-0 ma-0">
      <v-row class="ma-0 mt-2">
        <v-col class="pa-3" cols="3">
          <v-text-field v-model="search" :label="$t('main.search')" outlined clearable hide-details></v-text-field>
        </v-col>
        <v-col class="pa-3" cols="3">
          <v-autocomplete
            :no-data-text="$t('main.no_data')"
            :label="$t('actives.nodesTab.network')"
            :value="selectedNetworkIdInNodes"
            @change="selectNetworkIdInNodes($event)"
            :items="selectedOrganizationNetworksInActives"
            item-text="name"
            item-value="id"
            :multiple="false"
            outlined
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col class="d-flex pa-3" cols="auto">
          <v-checkbox
            v-model="isOcii"
            :label="$t('actives.only_cii_objects')"
            class="ma-0 pa-0"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col class="d-flex justify-end pa-3">
          <NodeCreationDialog :disabled="!canCreateActives" />
        </v-col>
      </v-row>
      <v-row class="ma-0 mt-2 fill-height overflow-y-auto">
        <v-col>
          <v-simple-table class="nodes-table">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">{{ $t('actives.nodesTab.public_ip') }}</th>
                  <th class="text-center">{{ $t('actives.nodesTab.private_ip') }}</th>
                  <th class="text-center">{{ $t('actives.nodesTab.mac_address') }}</th>
                  <th class="text-center">{{ $t('actives.nodesTab.network') }}</th>
                  <th class="text-center">{{ $t('actives.nodesTab.hostname') }}</th>
                  <th class="text-center">{{ $t('actives.nodesTab.cii') }}</th>
                  <th class="text-center">{{ $t('actives.nodesTab.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="node in filteredNodes" :key="node.id">
                  <td class="text-center">{{ node.publicIpAddress }}</td>
                  <td class="text-center">{{ node.privateIpAddress }}</td>
                  <td class="text-center">{{ node.macAddress }}</td>
                  <td class="text-center">{{ node.network ? node.network.address : '' }}</td>
                  <td class="text-center">{{ node.hostname }}</td>
                  <td class="text-center">
                    <v-icon v-if="node.isOcii" small color="green"> mdi-check </v-icon>
                    <v-icon v-else small color="red"> mdi-close </v-icon>
                  </td>
                  <td class="text-center">
                    <NodeUpdateDialog :node="node" :disabled="!canUpdateActives" />
                    <v-btn
                      icon
                      small
                      class="ml-2"
                      color="red"
                      @click="deleteNodeInstance(node.id)"
                      :disabled="!canUpdateActives"
                    >
                      <v-icon> mdi-delete-outline </v-icon>
                    </v-btn>
                    <NodeInfoDialog :node="node" />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>
  </v-scroll-y-transition>
</template>

<script>
  import rightsMixin from '@/mixins/rightsMixin'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { ORGANIZATION_TABS_IN_ACTIVES } from '@/constants/enums'
  import NodeCreationDialog from '@/components/dialogs/NodeCreationDialog'
  import NodeUpdateDialog from '@/components/dialogs/NodeUpdateDialog'
  import NodeInfoDialog from '@/components/dialogs/NodeInfoDialog'

  export default {
    name: 'Nodes',
    mixins: [rightsMixin],
    components: {
      NodeCreationDialog,
      NodeUpdateDialog,
      NodeInfoDialog,
    },
    data: () => ({
      search: '',
      isOcii: false,
      activesTabs: ORGANIZATION_TABS_IN_ACTIVES,
    }),
    methods: {
      ...mapActions('organizations', [
        'deleteNodeInstance',
        'selectNetworkIdInNodes',
        'selectOrganizationTabInActives',
      ]),
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationNodesInActives', 'selectedOrganizationNetworksInActives']),
      ...mapState('organizations', ['selectedNetworkIdInNodes']),
      filteredNodes() {
        const networkId = this.selectedNetworkIdInNodes
        const totalOrgNodes = this.selectedOrganizationNodesInActives
        const totalOrgNetworks = this.selectedOrganizationNetworksInActives
        let nodes = totalOrgNodes

        if (networkId) {
          const foundNetwork = totalOrgNetworks.find((network) => network.id === networkId)
          if (!foundNetwork) return []
          nodes = foundNetwork.nodes
        }

        nodes = nodes.filter((item) => {
          let result = true
          if (this.isOcii && !item.isOcii) return false
          if (this.search) {
            const match =
              item.macAddress.toLowerCase().includes(this.search.toLowerCase()) ||
              item.network.address.toLowerCase().includes(this.search.toLowerCase()) ||
              item.hostname.toLowerCase().includes(this.search.toLowerCase()) ||
              item.privateIpAddress.includes(this.search) ||
              item.publicIpAddress.includes(this.search)
            result = result && match
          }

          return result
        })

        return nodes
      },
    },
  }
</script>
<style scoped lang="scss"></style>
