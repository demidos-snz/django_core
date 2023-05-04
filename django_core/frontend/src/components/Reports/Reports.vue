<template>
  <v-container fluid fill-height class="custom-table-content">
    <v-data-table
      :headers="tableConstants.reportTableHeaders"
      :items="reports"
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
      @update:sort-desc="handleSortDesc($event)"
      :multi-sort="false"
      class="elevation-24 row-pointer fill-height full-width"
      fixed-header
    >
      <template v-slot:top>
        <v-row class="d-flex align-center px-3 mb-2 custom-table-top">
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-text-field
              color="white"
              outlined
              @input="setSearchText"
              :value="searchText"
              :label="$t('main.search')"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <ReportCreationDialog v-if="canCreateReports" />
        </v-row>
      </template>
      <template v-for="(h, index) in tableConstants.reportTableHeaders" v-slot:[`header.${h.value}`]="{ header }">
        {{ $t(`reports.reportsTable.${header.value}`) }}

        <FilterPopover
          v-if="h.filterable"
          table="reports"
          :headerData="h"
          :filterData="filters"
          :key="index"
          @applyFilterValue="addFilter"
          @clearFilterValue="clearFilter"
          :inputData="getTableFilterInputData(h.value, 'reports')"
        />
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <p class="ma-0 text-break max-width-250">{{ item.name }}</p>
      </template>
      <template v-slot:[`item.step`]="{ item }">
        {{ item.stepData.name }}
      </template>
      <template v-slot:[`item.organization`]="{ item }">
        {{ item.organization.name }}
      </template>
      <template v-slot:[`item.created`]="{ item }">
        {{ item.created }}
      </template>
      <template v-slot:[`item.author`]="{ item }">
        {{ item.author.fullName }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        {{ item.statusData.name }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon small color="green" :href="item.file" :disabled="!item.file" target="_blank" download class="mr-1">
          <v-icon dark> mdi-download </v-icon>
        </v-btn>
        <v-btn icon small color="red" :disabled="!canDeleteReport(item)" @click="deleteReportInstance(item.id)">
          <v-icon dark> mdi-delete-outline </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import ReportCreationDialog from '@/components/dialogs/ReportCreationDialog'
  import { tableConstants } from '@/constants/constants'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import FilterPopover from '@/components/tableHelpers/filterPopover'
  import rightsMixin from '@/mixins/rightsMixin'
  import tableFiltersMixin from '@/mixins/tableFiltersMixin'
  import { toStorage, fromStorage } from '@/store/utils'
  import { isNil } from 'lodash'

  export default {
    name: 'Reports',
    components: {
      ReportCreationDialog,
      FilterPopover,
    },
    mixins: [tableFiltersMixin, rightsMixin],
    data: () => ({
      tableConstants: tableConstants,
    }),
    methods: {
      ...mapActions('alerts', ['addAlert']),
      ...mapActions('reports', [
        'loadReports',
        'setSearchText',
        'handlePagination',
        'handleSortBy',
        'handleSortDesc',
        'addFilter',
        'clearFilter',
        'deleteReportInstance',
        'setFilters',
      ]),
      loadFilters() {
        const key = `reportFilters${this.operator.id}`
        const filters = fromStorage(key)
        const parsedFilters = JSON.parse(filters)

        if (!isNil(parsedFilters)) {
          this.setFilters(parsedFilters)
        }
      },
      storeFilters() {
        const key = `reportFilters${this.operator.id}`
        const stringifiedFilters = JSON.stringify(this.filters)

        toStorage(key, stringifiedFilters)
      },
    },
    computed: {
      ...mapState('reports', ['isLoading', 'searchText', 'totalItems', 'filters', 'page', 'itemsPerPage']),
      ...mapGetters('reports', ['reports']),
      ...mapGetters('organizations', ['organizations']),
      ...mapGetters('users', ['users']),
      ...mapGetters('operator', ['operator']),
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (!vm.hasReportAccess) {
          vm.$router.push({ name: 'incidents' })
          vm.addAlert({
            message: vm.$t('main.page_access_denied'),
            type: 'error',
          })
        }
      })
    },
    created() {
      window.addEventListener('unload', this.storeFilters)
      this.loadFilters()
      this.loadReports()
    },
  }
</script>
<style lang="scss"></style>
