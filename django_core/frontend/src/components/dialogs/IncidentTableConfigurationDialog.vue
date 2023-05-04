<template>
  <v-dialog v-model="isActive" max-width="700px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon x-large color="grey" v-bind="attrs" v-on="on">
        <v-icon> mdi-cog-outline </v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title>
        <span class="headline">{{ $t('dialogs.incidentTableConfigurationDialog.table_configuration') }}</span>
      </v-card-title>
      <v-card-subtitle class="mt-2">
        <span>{{ $t('dialogs.incidentTableConfigurationDialog.displayed_columns') }}</span>
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col class="pl-6 d-flex flex-column column-array">
            <draggable v-model="draggableColumns" handle=".drag-icon">
              <transition-group>
                <v-text-field
                  v-for="column in draggableColumns"
                  :key="column.value"
                  dense
                  :value="column.text"
                  hide-details
                  readonly
                  outlined
                  class="mb-1"
                >
                  <template v-slot:prepend>
                    <div class="v-input__icon v-input__icon--prepend">
                      <v-checkbox
                        :input-value="selectedColumns.includes(column.value)"
                        hide-details
                        @change="changeColumnConfig($event, column.value)"
                        dense
                        class="ma-0 pa-0"
                      ></v-checkbox>
                    </div>
                    <div class="ml-2 v-input__icon v-input__icon--prepend">
                      <v-icon class="drag-icon">mdi-arrow-up-down</v-icon>
                    </div>
                  </template>
                </v-text-field>
              </transition-group>
            </draggable>
            <v-spacer class="fill-height" />
          </v-col>
          <v-col class="pr-6 d-flex flex-column column-array">
            <v-text-field
              v-for="column in nonSelectedColumns"
              :key="column.value"
              dense
              :value="column.text"
              hide-details
              readonly
              outlined
              class="mb-1"
            >
              <template v-slot:prepend>
                <div class="v-input__icon v-input__icon--prepend">
                  <v-checkbox
                    :input-value="selectedColumns.includes(column.value)"
                    hide-details
                    @change="changeColumnConfig($event, column.value)"
                    dense
                    class="ma-0 pa-0"
                  ></v-checkbox>
                </div>
              </template>
            </v-text-field>
            <v-spacer class="fill-height" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pb-5 px-4">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.cancel') }}
        </v-btn>
        <v-btn color="green" outlined @click="applyChanges" :disabled="!hasChanges">
          {{ $t('main.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { tableConstants } from '@/constants/constants'
  import { toStorage, fromStorage } from '@/store/utils'
  import { isNil, isEqual } from 'lodash'
  import { mapState, mapActions, mapGetters } from 'vuex'
  import draggable from 'vuedraggable'

  export default {
    name: 'IncidentTableConfigurationDialog',
    components: {
      draggable,
    },
    data: () => ({
      isActive: false,
      selectedColumns: [],
    }),
    methods: {
      ...mapActions('incidents', ['setDisplayedColumns', 'removeFilter']),
      loadDisplayedColumns() {
        const key = `incidentDisplayedColumns${this.operator.id}`
        const columns = fromStorage(key)
        const parsedColumns = JSON.parse(columns)

        if (!isNil(parsedColumns)) {
          this.setDisplayedColumns(parsedColumns)
        }

        this.selectedColumns = [...this.displayedColumns]
      },

      storeDisplayedColumns() {
        const key = `incidentDisplayedColumns${this.operator.id}`
        const stringifiedColumns = JSON.stringify(this.selectedColumns)

        toStorage(key, stringifiedColumns)
      },

      changeColumnConfig(isSelected, columnValue) {
        if (isSelected) {
          this.selectedColumns.push(columnValue)
        } else {
          this.selectedColumns = this.selectedColumns.filter((item) => item !== columnValue)
        }
      },

      applyChanges() {
        this.setDisplayedColumns(this.selectedColumns)
        this.storeDisplayedColumns()
        this.dropFiltersForNonSelected()
        this.closeDialog()
      },

      dropFiltersForNonSelected() {
        this.nonSelectedColumns.forEach((column) => {
          if (this.filters.hasOwnProperty(column.filterKey)) {
            this.removeFilter(this.filters[column.filterKey])
          }
        })
      },

      closeDialog() {
        this.selectedColumns = [...this.displayedColumns]
        this.isActive = false
      },
    },

    computed: {
      ...mapState('incidents', ['displayedColumns', 'filters']),
      ...mapGetters('operator', ['operator']),
      columnArray() {
        return tableConstants.getIncidentTableHeaders()
      },

      draggableColumns: {
        get() {
          const columns = this.selectedColumns.reduce((results, columnValue) => {
            const foundCol = this.columnArray.find((item) => item.value === columnValue)
            if (foundCol) {
              results.push(foundCol)
            }
            return results
          }, [])

          return columns
        },
        set(orderedColumns) {
          this.selectedColumns = orderedColumns.map((column) => column.value)
        },
      },

      nonSelectedColumns() {
        return this.columnArray.filter((column) => !this.selectedColumns.includes(column.value))
      },

      hasChanges() {
        return !isEqual(this.selectedColumns, this.displayedColumns)
      },
    },

    created() {
      this.loadDisplayedColumns()
    },
  }
</script>
<style scoped lang="scss">
  .drag-icon {
    cursor: pointer;
  }

  .column-array {
    height: 500px;
    overflow-y: auto;
  }
</style>
