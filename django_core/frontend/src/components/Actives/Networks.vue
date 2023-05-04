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
            :label="$t('actives.networksTab.segment')"
            :value="selectedSegmentIdInNetworks"
            @change="selectSegmentIdInNetworks($event)"
            :items="selectedOrganizationSegments"
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
          <NetworkCreationDialog :disabled="!canCreateActives" />
        </v-col>
      </v-row>
      <v-row class="ma-0 mt-2 fill-height overflow-y-auto">
        <v-col>
          <v-simple-table class="networks-table">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">{{ $t('actives.networksTab.name') }}</th>
                  <th class="text-center">{{ $t('actives.networksTab.address_range') }}</th>
                  <th class="text-center">{{ $t('actives.networksTab.cii') }}</th>
                  <th class="text-center">{{ $t('actives.networksTab.internet_access') }}</th>
                  <th class="text-center">{{ $t('actives.networksTab.segment') }}</th>
                  <th class="text-center">{{ $t('actives.networksTab.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="network in filteredNetworks" :key="network.id">
                  <td class="text-center">{{ network.name }}</td>
                  <td class="text-center">{{ network.address }}</td>
                  <td class="text-center">
                    <v-icon v-if="network.isOcii" small color="green"> mdi-check </v-icon>
                    <v-icon v-else small color="red"> mdi-close </v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon v-if="network.internetAccess" small color="green"> mdi-check </v-icon>
                    <v-icon v-else small color="red"> mdi-close </v-icon>
                  </td>
                  <td class="text-center">{{ network.segment ? network.segment.name : '' }}</td>
                  <td class="text-center">
                    <NetworkUpdateDialog :network="network" :disabled="!canUpdateActives" />
                    <v-btn
                      icon
                      small
                      class="ml-2"
                      color="red"
                      @click="deleteNetworkInstance(network.id)"
                      :disabled="!canDeleteActives"
                    >
                      <v-icon> mdi-delete-outline </v-icon>
                    </v-btn>
                    <v-btn icon small class="ml-2" @click="goToNetworkNodes(network.id)">
                      <v-icon> mdi-share</v-icon>
                    </v-btn>
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
  import NetworkCreationDialog from '@/components/dialogs/NetworkCreationDialog'
  import NetworkUpdateDialog from '@/components/dialogs/NetworkUpdateDialog'

  export default {
    name: 'Networks',
    mixins: [rightsMixin],
    components: {
      NetworkCreationDialog,
      NetworkUpdateDialog,
    },
    data: () => ({
      search: '',
      isOcii: false,
      activesTabs: ORGANIZATION_TABS_IN_ACTIVES,
    }),
    methods: {
      ...mapActions('organizations', [
        'selectSegmentIdInNetworks',
        'deleteNetworkInstance',
        'selectNetworkIdInNodes',
        'selectOrganizationTabInActives',
      ]),
      goToNetworkNodes(networkId) {
        const tabId = ORGANIZATION_TABS_IN_ACTIVES.NODES

        this.selectNetworkIdInNodes(networkId)
        this.selectOrganizationTabInActives(tabId)
      },
    },
    computed: {
      ...mapGetters('organizations', [
        'selectedOrganizationSegmentsInActives',
        'selectedOrganizationNetworksInActives',
      ]),
      ...mapState('organizations', ['selectedSegmentIdInNetworks']),
      selectedOrganizationSegments() {
        return Object.values(this.selectedOrganizationSegmentsInActives)
      },
      filteredNetworks() {
        const segmentId = this.selectedSegmentIdInNetworks
        const totalOrgSegments = this.selectedOrganizationSegmentsInActives
        const totalOrgNetworks = this.selectedOrganizationNetworksInActives
        let networks = segmentId ? totalOrgSegments[segmentId].networks : totalOrgNetworks

        networks = networks.filter((item) => {
          let result = true
          if (this.isOcii && !item.isOcii) return false
          if (this.search) {
            const match =
              item.name.toLowerCase().includes(this.search.toLowerCase()) || item.address.includes(this.search)
            result = result && match
          }

          return result
        })

        return networks
      },
    },
  }
</script>
<style lang="scss">
  .networks-table,
  .nodes-table {
    tr {
      th:not(:last-child),
      td:not(:last-child) {
        border-right: thin solid rgba(255, 255, 255, 0.12);
      }
    }
  }
</style>
