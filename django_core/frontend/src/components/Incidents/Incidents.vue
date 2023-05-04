<template>
  <v-container fluid fill-height class="custom-table-content">
    <ResizableTable
      :headers="visibleColumns"
      :storageKey="`incidentColWidth${operator.id}`"
      :items="incidents"
      :loading="isLoading"
      :server-items-length="totalItems"
      :page="page"
      :items-per-page="itemsPerPage"
      :footer-props="{
        'show-first-last-page': true,
        'items-per-page-options': tableConstants.itemsPerPage,
      }"
      @pagination="handlePagination($event)"
      @update:sort-by="handleSortBy($event)"
      @click:row="goToIncident($event)"
      @update:sort-desc="handleSortDesc($event)"
      :multi-sort="false"
      tableClass="elevation-24 row-pointer fill-height full-width"
      fixed-header
    >
      <template v-slot:top>
        <v-row class="d-flex align-center px-3 pt-2 mb-2 custom-table-top">
          <v-col cols="4">
            <v-radio-group :value="filters.cm_line || 0" :column="false" :disabled="!canFilterIncidentLines">
              <v-radio
                @click="changeCmLine(line.id)"
                class="mr-3"
                v-for="line in getCmLines()"
                :key="line.id"
                :label="line.name"
                :value="line.id"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <IncidentTableConfigurationDialog />
          </v-col>
          <v-col cols="3">
            <v-text-field
              color="white"
              outlined
              @input="storeSearchText"
              :value="searchText"
              :label="$t('main.search')"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <IncidentCreationDialog :disabled="!canCreateIncident" />
          </v-col>
        </v-row>
      </template>
      <template v-for="(h, index) in visibleColumns" v-slot:[`header.${h.value}`]="{ header }">
        <span :key="index" :id="h.value" title="valueIndicator">{{ header.text }}</span>
        <FilterPopover
          v-if="h.filterable"
          table="incidents"
          :headerData="h"
          :filterData="filters"
          :key="h.value"
          @applyFilterValue="applyFilter"
          @clearFilterValue="removeFilter"
          :inputData="getTableFilterInputData(h.value, 'incidents')"
        />
      </template>
      <template v-slot:[`item.severity_level`]="{ item }">
        <v-chip :color="item.severityLevel.color" text-color="black">
          {{ item.severityLevel.name }}
        </v-chip>
      </template>
      <template v-slot:[`item.organization`]="{ item }">
        {{ item.organization && item.organization.nameVerbose }}
      </template>
      <template v-slot:[`item.type_incident`]="{ item }">
        {{ item.typeData.name }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        {{ item.statusData.name }}
      </template>
      <template v-slot:[`item.assigned`]="{ item }">
        {{ item.assigned ? item.assigned.fullName : '-' }}
      </template>
      <template v-slot:[`item.author`]="{ item }">
        {{ item.author ? item.author.fullName : '-' }}
      </template>
      <template v-slot:[`item.registration_datetime`]="{ item }">
        {{ item.registrationDatetime }}
      </template>
      <template v-slot:[`item.last_modified_datetime`]="{ item }">
        {{ item.lastModifiedDatetime }}
      </template>
      <template v-slot:[`item.closed_datetime`]="{ item }">
        {{ item.closedDatetime }}
      </template>
      <template v-slot:[`item.ncircc_notification__reg_number`]="{ item }">
        {{ item.ncirccRegNumber ? item.ncirccRegNumber : '-' }}
      </template>
      <template v-slot:[`item.ncircc_notification__status`]="{ item }">
        {{ item.ncirccStatus }}
      </template>
      <template v-slot:[`item.comments__comment__text`]="{ item }">
        {{ item.lastComment }}
      </template>
      <template v-slot:[`item.datetime_of_last_viewing_by_client`]="{ item }">
        {{ item.lastViewedByClient }}
      </template>
    </ResizableTable>
  </v-container>
</template>

<script>
  import FilterPopover from '@/components/tableHelpers/filterPopover'
  import rightsMixin from '@/mixins/rightsMixin'
  import tableFiltersMixin from '@/mixins/tableFiltersMixin'
  import IncidentCreationDialog from '@/components/dialogs/IncidentCreationDialog'
  import { tableConstants, getCmLines } from '@/constants/constants'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { toStorage, fromStorage } from '@/store/utils'
  import { isNil } from 'lodash'
  import IncidentTableConfigurationDialog from '@/components/dialogs/IncidentTableConfigurationDialog'
  import ResizableTable from '@/components/tableHelpers/ResizableTable'

  export default {
    name: 'Incidents',
    components: {
      IncidentCreationDialog,
      FilterPopover,
      IncidentTableConfigurationDialog,
      ResizableTable,
    },
    mixins: [tableFiltersMixin, rightsMixin],
    data: () => ({
      tableConstants,
      getCmLines,
    }),

    computed: {
      ...mapState('incidents', [
        'isLoading',
        'searchText',
        'totalItems',
        'filters',
        'page',
        'itemsPerPage',
        'displayedColumns',
      ]),
      ...mapGetters('incidents', ['incidents']),
      ...mapGetters('organizations', ['organizations']),
      ...mapGetters('users', ['users']),

      visibleColumns() {
        const columns = this.tableConstants.getIncidentTableHeaders()
        const result = this.displayedColumns.reduce((results, columnValue) => {
          const foundCol = columns.find((item) => item.value === columnValue)
          if (foundCol) {
            results.push(foundCol)
          }
          return results
        }, [])

        return result
      },
    },

    methods: {
      ...mapActions('incidents', [
        'loadIncidents',
        'storeSearchText',
        'changeCmLine',
        'handlePagination',
        'handleSortBy',
        'handleSortDesc',
        'applyFilter',
        'removeFilter',
        'setFilters',
      ]),

      loadFilters() {
        const key = `incidentFilters${this.operator.id}`
        const filters = fromStorage(key)
        const parsedFilters = JSON.parse(filters)

        if (!isNil(parsedFilters)) {
          this.setFilters(parsedFilters)
        }
      },

      storeFilters() {
        const key = `incidentFilters${this.operator.id}`
        const stringifiedFilters = JSON.stringify(this.filters)

        toStorage(key, stringifiedFilters)
      },

      goToIncident(incident) {
        this.$router.push({ name: 'incidents', params: { incidentId: incident.id } })
      },
    },

    created() {
      window.addEventListener('unload', this.storeFilters)
      this.loadFilters()
      this.loadIncidents()
    },

    beforeDestroy() {
      this.storeFilters()
    },
  }
</script>
<style lang="scss"></style>
