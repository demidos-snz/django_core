<template>
  <v-container fluid class="custom-table-content fill-height">
    <v-row class="fill-height">
      <v-col class="fill-height left-list-panel py-0" cols="3">
        <v-card outlined class="fill-height" elevation="24">
          <v-card-title class="justify-space-between title">
            {{ $t('organizations.organizations') }}
            <OrganizationCreationDialog :disabled="!canCreateOrganization" />
          </v-card-title>
          <v-text-field
            v-model="search"
            :label="$t('organizations.search')"
            outlined
            clearable
            hide-details
            class="px-3 py-2 search-field"
          ></v-text-field>
          <v-col class="d-flex flex-row pa-2 ma-0 filter-field">
            <v-checkbox
              :input-value="onlyActiveOrganizations"
              :label="$t('organizations.only_active')"
              class="d-flex align-center px-3 ma-0 text-no-wrap text-truncate"
              hide-details
              @change="changeOnlyActiveOrganizationsFilter"
            ></v-checkbox>
            <v-checkbox
              :input-value="onlyOciiOrganizations"
              :label="$t('organizations.ocii')"
              class="d-flex align-center px-3 ma-0"
              hide-details
              @change="changeOnlyOciiOrganizationsFilter"
            ></v-checkbox>
          </v-col>
          <v-treeview
            ref="organizationsTree"
            :items="organizationsTree"
            shaped
            activatable
            :multiple-active="false"
            :search="searchData"
            :filter="filter"
            class="item-list overflow-auto"
            :value="[selectedOrganizationId]"
            @update:active="setSelectedOrganization"
          ></v-treeview>
        </v-card>
      </v-col>
      <v-col class="fill-height py-0" cols="9">
        <v-card outlined class="fill-height" elevation="24">
          <v-tabs v-if="selectedOrganization" height="40" slider-size="1" color="white" grow :value="selectedTabIndex">
            <v-tab v-for="[tab, id] of Object.entries(organizationTabs)" :key="id" @change="selectOrganizationTab(id)">
              {{ $t(`organizations.${tab.toLowerCase()}`) }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-if="selectedOrganization" class="org-tab-items" :value="selectedOrganizationTab">
            <v-tab-item :value="organizationTabs.MAIN" class="fill-height">
              <OrganizationMainData />
            </v-tab-item>
            <v-tab-item :value="organizationTabs.INFORMATION_SECURITY" class="fill-height">
              <OrganizationSegmentStructure />
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
  import OrganizationCreationDialog from '@/components/dialogs/OrganizationCreationDialog'
  import { ORGANIZATION_TABS } from '@/constants/enums'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { isNil, sortBy } from 'lodash'
  import OrganizationMainData from '@/components/Organizations/OrganizationMainData'
  import OrganizationSegmentStructure from '@/components/Organizations/OrganizationSegmentStructure'
  import rightsMixin from '@/mixins/rightsMixin'
  import { buildTree } from '@/utils'

  export default {
    name: 'Organizations',
    mixins: [rightsMixin],
    components: {
      OrganizationCreationDialog,
      OrganizationMainData,
      OrganizationSegmentStructure,
    },
    data: () => ({
      search: '',
      organizationTabs: ORGANIZATION_TABS,
    }),
    methods: {
      ...mapActions('organizations', [
        'selectOrganizationId',
        'deselectOrganizationId',
        'changeOnlyActiveOrganizationsFilter',
        'changeOnlyOciiOrganizationsFilter',
        'selectOrganizationTab',
      ]),
      setSelectedOrganization(ids) {
        if (!ids.length) {
          this.deselectOrganization()
        } else {
          this.selectOrganizationId(ids[0])
        }
      },
      deselectOrganization() {
        if (this.selectedOrganizationId) {
          this.$refs.organizationsTree.updateSelected(this.selectedOrganizationId, false)
          this.$refs.organizationsTree.updateActive(this.selectedOrganizationId, false)
          this.deselectOrganizationId()
        }
      },
      filter(item) {
        if (this.onlyOciiOrganizations && !item.isOcii) return false
        if (this.onlyActiveOrganizations && !item.isActive) return false

        if (this.search) {
          const nameMatch =
            item.name.toLowerCase().includes(this.search.toLowerCase()) ||
            item.shortName.toLowerCase().includes(this.search.toLowerCase())
          return nameMatch
        }
        return true
      },
    },
    computed: {
      ...mapGetters('organizations', ['organizations', 'selectedOrganization']),
      ...mapState('organizations', [
        'selectedOrganizationId',
        'onlyActiveOrganizations',
        'onlyOciiOrganizations',
        'selectedOrganizationTab',
      ]),

      organizationsTree() {
        const tree = buildTree(Object.values(this.organizations))
        return sortBy(tree, 'name')
      },

      selectedTabIndex() {
        return Object.values(this.organizationTabs).findIndex((tab) => tab.id === this.selectedOrganizationTab)
      },

      searchData() {
        /*
         * v-treeview требует, чтобы тип search был строкой, а у нас фильтрация происходит по 3-м полям, поэтому из этих
         * 3-х собирается одна строка, иначе функция фильтрации не вызывается. Если фильтровать самим - компонент вообще
         * ломается
         * */
        return this.search + this.onlyActiveOrganizations.toString() + this.onlyOciiOrganizations.toString()
      },
    },
    mounted() {
      const preselectedOrganization = parseInt(this.$route.query.organization)
      const preselectedSensor = parseInt(this.$route.query.sensor)

      if (!Number.isNaN(preselectedOrganization)) {
        const selectedOrganizationId = parseInt(preselectedOrganization)
        this.selectOrganizationId(selectedOrganizationId)

        const tree = this.$refs.organizationsTree
        if (tree) {
          tree.updateActive(selectedOrganizationId, true)
          let parent = this.selectedOrganization.parent
          while (!isNil(parent)) {
            tree.updateOpen(parent.id, true)
            parent = parent.parent
          }
        }
      }

      if (!Number.isNaN(preselectedSensor)) {
        this.selectOrganizationTab(this.organizationTabs.INFORMATION_SECURITY)
      }
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
