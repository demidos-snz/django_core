<template>
  <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
    <v-row class="px-3 py-2">
      <v-autocomplete
        :no-data-text="$t('main.no_data')"
        deletable-chips
        :search-input.sync="search"
        hide-details
        hide-selected
        outlined
        chips
        dense
        small-chips
        multiple
        :item-text="getItemText"
        :label="label"
        v-bind="$attrs"
        v-on="$listeners"
        return-object
        :items="elements"
        :allow-overflow="false"
        ref="combinedAutocomplete"
      >
        <template v-slot:append-item>
          <v-dialog v-model="isActive" max-width="700">
            <template v-slot:activator="{ on, attrs }">
              <v-col class="pa-3 align-center d-flex">
                <v-row class="pl-3">
                  <v-btn outlined small color="green" v-bind="attrs" v-on="on">{{ $t('main.add') }}</v-btn>
                </v-row>
              </v-col>
            </template>
            <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
              <v-card outlined>
                <v-card-title class="white--text headline">
                  <span class="headline">{{ $t('ncircc.notification.new_element') }}: {{ label }}</span>
                </v-card-title>
                <v-card-text class="py-1">
                  <template v-for="item of creationFields">
                    <validation-provider
                      :rules="getValidationRules(item)"
                      :name="item.name"
                      :key="item.name"
                      v-slot="{ errors }"
                    >
                      <component
                        v-model="field[item.name]"
                        :is="getFieldComponent(item.type)"
                        v-bind="item"
                        :error-messages="errors"
                        :hide-details="false"
                      />
                    </validation-provider>
                  </template>
                </v-card-text>
                <v-card-actions class="pb-5 px-4">
                  <v-spacer></v-spacer>
                  <v-btn color="red" outlined @click="closeDialog">
                    {{ $t('main.cancel') }}
                  </v-btn>
                  <v-btn color="green" outlined :disabled="invalid" @click="sendItem">
                    {{ $t('main.add') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </validation-observer>
          </v-dialog>
        </template>
      </v-autocomplete>
    </v-row>
  </v-col>
</template>

<script>
  import validationMixin from '@/mixins/validationMixin'
  import TextField from '@/components/Ncircc/Fields/TextField'
  import SimpleAutocomplete from '@/components/Ncircc/Fields/SimpleAutocomplete'
  import { mapActions } from 'vuex'
  import { isEqual } from 'lodash'

  export default {
    name: 'MultipleCombinedAutocomplete',
    mixins: [validationMixin],
    props: {
      label: {
        type: String,
        required: true,
      },
      items: {
        type: Array,
        required: false,
        default() {
          return []
        },
      },
      creationFields: {
        type: Array,
        required: true,
      },
      getText: {
        type: Function,
        required: false,
      },
    },
    data: () => ({
      search: null,
      isActive: false,
      field: {},
      newItems: [],
    }),
    computed: {
      elements() {
        return [...(this.items || []), ...this.newItems]
      },
    },
    methods: {
      ...mapActions('alerts', ['addAlert']),
      closeDialog() {
        this.$set(this, 'isActive', false)
      },

      getFieldComponent(type) {
        switch (type) {
          case 'text':
            return TextField
          case 'select':
            return SimpleAutocomplete
        }
      },

      getValidationRules(item) {
        if (item.hasOwnProperty('validationRules')) {
          return item.validationRules
        }
        if (item.required) {
          return 'required'
        }
        return ''
      },

      sendItem() {
        if (this.checkIfItemExists(this.field)) {
          return this.addAlert({
            message: this.$t('ncircc.notification.element_exists'),
            type: 'error',
          })
        }

        this.$emit('input', this.field)
        this.closeDialog()
        this.$set(this, 'newItems', [...this.newItems, this.field])
        this.$set(this, 'field', {})
        this.$refs.combinedAutocomplete.blur()
      },

      checkIfItemExists(item) {
        return (
          this.newItems.some((newItem) => isEqual(newItem, item)) ||
          this.items.some((newItem) => isEqual(newItem, item))
        )
      },

      getItemText(item) {
        if (this.getText) {
          return this.getText(item)
        }

        return this.getTextBase(item)
      },

      getTextBase(item) {
        if (this.creationFields.length === 1) {
          return item[this.creationFields[0].name]
        }

        const data = []
        for (const field of this.creationFields) {
          let value = item[field.name]

          if (field.type === 'select') {
            for (const option of field.items) {
              if (option.id === value) {
                value = option.name
                break
              }
            }
          }

          data.push(field.label + ': ' + value)
        }
        return data.join(', ')
      },
    },
  }
</script>

<style lang="scss">
  .v-select.v-input--dense .v-chip {
    margin: 4px 2px 0;
  }
</style>
