<template>
  <v-dialog v-model="dialog" max-width="650px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" x-small class="ml-2" :disabled="disabled">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title class="white--text headline">
        <span class="headline">{{ $t('dialogs.recommendationDialog.recommendation_selection') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-autocomplete
                :no-data-text="$t('main.no_data')"
                v-model="selected"
                deletable-chips
                :items="recommendationSampleList"
                item-value="id"
                item-text="text"
                :search-input.sync="search"
                hide-details
                hide-selected
                outlined
                chips
                small-chips
                :disabled="!p9s.canUpdate(ruleEntities.RECOMMENDATIONS)"
                :label="$t('dialogs.recommendationDialog.recommendations')"
                multiple
                :menu-props="{
                  maxHeight: 350,
                  maxWidth: 576,
                }"
              >
                <template v-slot:no-data>
                  <v-btn
                    text
                    color="primary"
                    class="ma-1"
                    v-show="validateNewRecommendation(search)"
                    @click="addRecommendation"
                  >
                    {{ $t('main.create') }}: "{{ search }}""
                  </v-btn>
                </template>
                <template v-slot:selection="data">
                  <v-chip
                    :input-value="data.selected"
                    @click:close="remove(data.item.id)"
                    :close="canDeleteRecommendation(getRecommendation(data.item))"
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
        <v-btn color="green" outlined @click="add">
          {{ $t('main.apply') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Incident from '@/store/models/incident'
  import { isNil, keyBy } from 'lodash'
  import { RULE_ENTITIES } from '@/constants/enums'
  import rightsMixin from '@/mixins/rightsMixin'

  export default {
    name: 'RecommendationDialog',
    mixins: [rightsMixin],
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
      ...mapGetters('incidents', ['recommendationSamples']),
      ...mapGetters('permissions', ['p9s']),
      mappedRecommendations() {
        return keyBy(this.incident.recommendations, 'sampleId')
      },
      recommendationSampleList() {
        return Object.values(this.recommendationSamples)
      },
      selectedRecommendationTexts() {
        return this.selected.map((id) => {
          const sample = this.recommendationSampleList.find((rec) => rec.id === id)
          if (sample) {
            return sample.text
          }
          return null
        })
      },
    },

    methods: {
      ...mapActions('incidents', ['createRecommendationSample', 'updateRecommendations']),
      setSelected(ids) {
        this.$set(this, 'selected', ids)
      },

      remove(id) {
        const newSelection = this.selected.filter((sampleId) => sampleId !== id)
        this.setSelected(newSelection)
      },

      addRecommendation() {
        if (this.search) {
          this.createRecommendationSample(this.search).then((data) => {
            const [error, response] = data
            if (isNil(error)) {
              this.setSelected([...this.selected, response.data.id])
              this.$set(this, 'search', '')
            }
          })
        }
      },

      closeDialog() {
        this.dialog = false
        this.setSelected([])
      },

      add() {
        this.updateRecommendations(this.selected)
        this.closeDialog()
      },
      getRecommendation(sample) {
        return this.mappedRecommendations[sample.id] || {}
      },
      validateNewRecommendation(search) {
        return search && !this.selectedRecommendationTexts.includes(search)
      },
    },

    watch: {
      dialog(enabled) {
        if (enabled) {
          this.setSelected([...this.incident.usedRecommendationSamples])
        }
      },
    },
  }
</script>
