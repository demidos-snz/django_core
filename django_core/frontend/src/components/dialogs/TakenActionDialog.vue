<template>
  <v-dialog v-model="dialog" max-width="650px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" x-small class="ml-2" :disabled="disabled">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title class="white--text headline">
        <span class="headline">{{ $t('dialogs.takenActionDialog.taken_action_selection') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-autocomplete
                :no-data-text="$t('main.no_data')"
                v-model="selected"
                deletable-chips
                :items="Object.values(actionsTakenSamples)"
                item-value="id"
                item-text="text"
                :search-input.sync="search"
                hide-details
                hide-selected
                outlined
                chips
                small-chips
                :label="$t('dialogs.takenActionDialog.actions')"
                :disabled="!p9s.canUpdate(ruleEntities.ACTIONS_TAKEN)"
                multiple
                :menu-props="{
                  maxHeight: 350,
                  maxWidth: 576,
                }"
              >
                <template v-slot:no-data>
                  <v-list-item @click="addActionTaken">
                    <span class="subheading">Создать</span>
                    <v-chip class="ml-2" label small> "{{ search }}" </v-chip>
                  </v-list-item>
                </template>
                <template v-slot:selection="data">
                  <v-chip
                    :input-value="data.selected"
                    @click:close="remove(data.item.id)"
                    :close="p9s.canDelete(ruleEntities.ACTIONS_TAKEN)"
                    class="chip--select-multi"
                  >
                    <span class="chip-selected-value">{{ data.item.text }}</span>
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-content v-text="data.item.text" />
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
        <v-btn color="green" outlined @click="add()">
          {{ $t('main.apply') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { isNil } from 'lodash'
  import Incident from '@/store/models/incident'
  import { RULE_ENTITIES } from '@/constants/enums'

  export default {
    name: 'TakenActionsDialog',
    props: {
      incident: {
        type: Incident,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      dialog: false,
      search: '',
      selected: [],
      ruleEntities: RULE_ENTITIES,
    }),

    computed: {
      ...mapGetters('incidents', ['actionsTakenSamples']),
      ...mapGetters('permissions', ['p9s']),
    },

    methods: {
      ...mapActions('incidents', ['createActionTakenSample', 'updateActionsTaken']),
      remove(id) {
        const newSelection = this.selected.filter((sampleId) => sampleId !== id)
        this.setSelected(newSelection)
      },

      setSelected(ids) {
        this.$set(this, 'selected', ids)
      },

      closeDialog() {
        this.dialog = false
        this.setSelected([])
      },

      addActionTaken() {
        this.createActionTakenSample(this.search).then((data) => {
          const [error, response] = data
          if (isNil(error)) {
            this.setSelected([...this.selected, response.data.id])
            this.$set(this, 'search', '')
          }
        })
      },

      add() {
        this.updateActionsTaken(this.selected)
        this.closeDialog()
      },
    },
    watch: {
      dialog(enabled) {
        if (enabled) {
          this.setSelected([...this.incident.usedActionTakenSamples])
        }
      },
    },
  }
</script>
<style lang="scss">
  .chip--select-multi {
    .chip-selected-value {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>
