<template>
  <v-container fluid class="custom-table-content fill-height">
    <v-row class="fill-height">
      <v-col class="fill-height left-list-panel" cols="3">
        <v-card outlined class="fill-height" elevation="24">
          <v-card-title class="justify-space-between title">
            {{ $t('actives.organizations') }}
          </v-card-title>
          <v-text-field
            v-model="search"
            :label="$t('main.search')"
            outlined
            clearable
            hide-details
            class="px-3 py-2 search-field"
          ></v-text-field>
          <v-col class="d-flex flex-row pa-2 ma-0 filter-field">
            <v-checkbox
              :input-value="onlyActiveOrganizationsInActives"
              :label="$t('actives.only_active')"
              class="d-flex align-center px-3 ma-0 text-no-wrap text-truncate"
              hide-details
              @change="changeOnlyActiveOrganizationsFilterInActives"
            ></v-checkbox>
            <v-checkbox
              :input-value="onlyOciiOrganizationsInActives"
              :label="$t('actives.ocii')"
              class="d-flex align-center px-3 ma-0"
              hide-details
              @change="changeOnlyOciiOrganizationsFilterInActives"
            ></v-checkbox>
          </v-col>
          <v-list shaped class="item-list overflow-auto">
            <v-list-item-group :value="selectedOrganizationIdInActives" color="primary">
              <v-list-item
                :value="organization.id"
                v-for="organization in filteredOrganizations"
                :key="organization.id"
                @click.prevent="setSelectedOrganizationInActives(organization.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ organization.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col class="fill-height" cols="9">
        <v-card outlined class="fill-height" elevation="24">
          <v-tabs
            v-if="selectedOrganizationInActives"
            height="40"
            slider-size="1"
            color="white"
            grow
            :value="selectedTabIndex"
          >
            <v-tab
              v-for="[tab, id] of Object.entries(activesTabs)"
              :key="id"
              @change="selectOrganizationTabInActives(id)"
            >
              {{ $t(`actives.${tab.toLowerCase()}`) }}
            </v-tab>
          </v-tabs>
          <v-tabs-items
            v-if="selectedOrganizationInActives"
            class="org-tab-items"
            :value="selectedOrganizationTabInActives"
          >
            <v-tab-item :value="activesTabs.SEGMENTS" class="fill-height">
              <Segments />
            </v-tab-item>
            <v-tab-item :value="activesTabs.NETWORKS" class="fill-height">
              <Networks />
            </v-tab-item>
            <v-tab-item :value="activesTabs.NODES" class="fill-height">
              <Nodes />
            </v-tab-item>
          </v-tabs-items>
          <div
            v-else
            class="d-flex fill-height title align-center justify-center grey--text text--lighten-1 font-weight-light"
          >
            {{ $t('organizations.organizationMainData.organization_not_selected') }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ORGANIZATION_TABS_IN_ACTIVES } from '@/constants/enums'
  import { mapGetters, mapActions, mapState } from 'vuex'
  import { sortBy } from 'lodash'
  import rightsMixin from '@/mixins/rightsMixin'
  import Segments from '@/components/Actives/Segments'
  import Networks from '@/components/Actives/Networks'
  import Nodes from '@/components/Actives/Nodes'

  export default {
    name: 'Organizations',
    mixins: [rightsMixin],
    components: {
      Segments,
      Networks,
      Nodes,
    },
    data: () => ({
      search: '',
      activesTabs: ORGANIZATION_TABS_IN_ACTIVES,
    }),
    methods: {
      ...mapActions('organizations', [
        'selectOrganizationIdInActives',
        'deselectOrganizationIdInActives',
        'changeOnlyActiveOrganizationsFilterInActives',
        'changeOnlyOciiOrganizationsFilterInActives',
        'selectOrganizationTabInActives',
        'deselectSegmentIdInNetworks',
        'deselectNetworkIdInNodes',
      ]),
      setSelectedOrganizationInActives(organizationId) {
        if (this.selectedOrganizationIdInActives === organizationId) {
          this.deselectOrganizationIdInActives()
        } else {
          this.selectOrganizationIdInActives(organizationId)
        }
      },
    },
    computed: {
      ...mapGetters('organizations', ['organizations', 'selectedOrganizationInActives']),
      ...mapState('organizations', [
        'selectedOrganizationIdInActives',
        'onlyActiveOrganizationsInActives',
        'onlyOciiOrganizationsInActives',
        'selectedOrganizationTabInActives',
      ]),
      filteredOrganizations() {
        let filteredOrganizations = Object.values(this.organizations)
        filteredOrganizations = filteredOrganizations.filter((item) => {
          let result = true
          if (this.onlyActiveOrganizationsInActives && !item.isActive) return false
          if (this.onlyOciiOrganizationsInActives && !item.isOcii) return false
          if (this.search) {
            const nameMatch = item.name.toLowerCase().includes(this.search.toLowerCase())
            result = result && nameMatch
          }

          return result
        })

        return sortBy(filteredOrganizations, 'name')
      },
      selectedTabIndex() {
        return Object.values(this.activesTabs).findIndex((tab) => tab.id === this.selectedOrganizationTabInActives)
      },
    },
  }
</script>
<style lang="scss">
  .org-tab-items {
    height: calc(100% - 40px);

    .v-window__container {
      height: 100%;
    }
  }
</style>
