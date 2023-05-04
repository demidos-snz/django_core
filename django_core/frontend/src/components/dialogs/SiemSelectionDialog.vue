<template>
  <v-dialog v-model="isActive" max-width="650px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" class="pa-0" x-small outlined rounded>
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title class="white--text headline">
        <span class="headline">{{ $t('dialogs.siemSelectionDialog.analytic_system_selection') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="justify-end">
            <SiemCreationDialog />
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete
                :no-data-text="$t('main.no_data')"
                :value="getLocalChanges('siemIds')"
                @change="addChanges('siemIds', $event)"
                deletable-chips
                :items="siemList"
                item-value="id"
                item-text="name"
                :return-object="false"
                :search-input.sync="search"
                hide-details
                outlined
                chips
                small-chips
                :label="$t('dialogs.siemSelectionDialog.systems')"
                multiple
              >
                <template v-slot:selection="data">
                  <v-chip
                    @click:close="removeSiem(data.item.id)"
                    :input-value="data.selected"
                    close
                    class="chip--select-multi"
                  >
                    <span class="chip-selected-value">{{ `${data.item.name} (${data.item.address})` }}</span>
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-content v-text="`${data.item.name} (${data.item.address})`" />
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pb-5 px-10">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.cancel') }}
        </v-btn>
        <v-btn color="green" outlined @click="updateOrganizationSiems" :disabled="!hasChanges">
          {{ $t('main.apply') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import SiemCreationDialog from '@/components/dialogs/SiemCreationDialog'
  import Vue from 'vue'
  import { xor, isEmpty } from 'lodash'
  import { getChanges } from '@/utils'

  export default {
    name: 'SiemSelectionDialog',
    components: {
      SiemCreationDialog,
    },
    data: () => ({
      isActive: false,
      changes: {},
      search: '',
    }),
    methods: {
      ...mapActions('organizations', ['updateOrganizationInstanceSiems']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      addChanges(fieldName, eventData) {
        if (this.changes.hasOwnProperty(fieldName)) {
          const diffs = xor(this.selectedOrganization[fieldName], eventData)
          if (diffs.length === 0) {
            return Vue.delete(this.changes, fieldName)
          }
        }

        Vue.set(this.changes, fieldName, eventData)
      },
      getLocalChanges(fieldName) {
        return getChanges(fieldName, this.changes, this.selectedOrganization)
      },
      removeSiem(id) {
        const siemIds = this.getLocalChanges('siemIds')
        const neSiemIds = siemIds.filter((siemId) => siemId !== id)
        this.addChanges('siemIds', neSiemIds)
      },
      async updateOrganizationSiems() {
        if (this.hasChanges) {
          const [error, response] = await this.updateOrganizationInstanceSiems({
            id: this.selectedOrganization.id,
            params: this.changes,
          })
          if (!error && response.status === 200) {
            Vue.delete(this.changes, 'siemIds')
          }
        }
        this.closeDialog()
      },
    },
    computed: {
      ...mapGetters('organizations', ['siems', 'selectedOrganization']),
      siemList() {
        return Object.values(this.siems)
      },
      hasChanges() {
        return !isEmpty(this.changes)
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
