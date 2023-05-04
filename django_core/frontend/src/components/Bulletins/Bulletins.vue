<template>
  <v-container fluid fill-height class="custom-table-content">
    <v-data-table
      :headers="tableConstants.bulletinTableHeaders"
      :items="bulletins"
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
          <BulletinCreationDialog v-if="canCreateBulletins()" />
        </v-row>
      </template>
      <template v-for="(h, index) in tableConstants.bulletinTableHeaders" v-slot:[`header.${h.value}`]="{ header }">
        {{ $t(`bulletins.bulletinsTable.${header.value}`) }}

        <FilterPopover
          v-if="h.filterable"
          table="bulletins"
          :headerData="h"
          :filterData="filters"
          :key="index"
          @applyFilterValue="addFilter"
          @clearFilterValue="clearFilter"
          :inputData="getTableFilterInputData(h.value, 'bulletins')"
        />
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <p class="ma-0 text-break max-width-250">{{ item.name }}</p>
      </template>
      <template v-slot:[`item.typeBulletin`]="{ item }">
        {{ item.type }}
      </template>
      <template v-slot:[`item.number`]="{ item }">
        {{ item.number }}
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ item.date }}
      </template>
      <template v-slot:[`item.read`]="{ item }">
        <template v-if="isSuperuser">
          <BulletinViews :bulletin="item" />
        </template>
        <template v-else>
          <v-tooltip bottom v-if="!item.downloaded">
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-checkbox disabled></v-checkbox>
              </div>
            </template>
            <span>{{ $t('bulletins.bulletinsTable.downloadFirst') }}</span>
          </v-tooltip>
          <v-checkbox
            v-else
            :input-value="item.read"
            :disabled="item.read || !item.downloaded"
            @change="markBulletinRead(item.id)"
          ></v-checkbox>
        </template>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon small color="green" class="mr-1" @click="downloadBulletin(item)">
          <v-icon dark> mdi-download</v-icon>
        </v-btn>

        <template v-if="isSuperuser">
          <v-btn icon small color="red" :disabled="!canDeleteBulletin()" @click="deleteBulletinInstance(item.id)">
            <v-icon dark> mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import { tableConstants } from '@/constants/constants'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import FilterPopover from '@/components/tableHelpers/filterPopover'
  import rightsMixin from '@/mixins/rightsMixin'
  import tableFiltersMixin from '@/mixins/tableFiltersMixin'
  import { fromStorage, toStorage } from '@/store/utils'
  import { isNil } from 'lodash'
  import BulletinCreationDialog from '@/components/dialogs/BulletinCreationDialog'
  import { ROLE } from '@/constants/enums'
  import BulletinViews from '@/components/dialogs/BulletinViews'

  export default {
    name: 'Bulletins',
    components: {
      BulletinViews,
      BulletinCreationDialog,
      FilterPopover,
    },
    mixins: [tableFiltersMixin, rightsMixin],
    data: () => ({
      tableConstants: tableConstants,
    }),
    methods: {
      ...mapActions('alerts', ['addAlert']),
      ...mapActions('bulletins', [
        'loadBulletins',
        'setSearchText',
        'handlePagination',
        'handleSortBy',
        'handleSortDesc',
        'addFilter',
        'clearFilter',
        'deleteBulletinInstance',
        'setFilters',
        'markBulletinRead',
        'downloadBulletin',
      ]),

      loadFilters() {
        const key = `bulletinFilters${this.operator.id}`
        const filters = fromStorage(key)
        const parsedFilters = JSON.parse(filters)

        if (!isNil(parsedFilters)) {
          this.setFilters(parsedFilters)
        }
      },

      storeFilters() {
        const key = `bulletinFilters${this.operator.id}`
        const stringifiedFilters = JSON.stringify(this.filters)

        toStorage(key, stringifiedFilters)
      },
    },
    computed: {
      ...mapState('bulletins', ['isLoading', 'searchText', 'totalItems', 'filters', 'page', 'itemsPerPage']),
      ...mapGetters('bulletins', ['bulletins']),
      ...mapGetters('operator', ['operator']),

      isSuperuser() {
        return this.operator.role === ROLE.SUPERUSER
      },
    },
    created() {
      window.addEventListener('unload', this.storeFilters)
      this.loadFilters()
      this.loadBulletins()
    },
  }
</script>
<style lang="scss"></style>
