<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" class="pa-0" x-small outlined rounded>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.segmentCreationDialog.segment_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newSegment.name"
                  :label="$t('dialogs.segmentCreationDialog.name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveSegment" :disabled="invalid || saveDisabled">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'

  const NEW_SEGMENT = {
    name: '',
  }

  export default {
    name: 'SegmentCreationDialog',
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      newSegment: { ...NEW_SEGMENT },
      saveDisabled: false,
    }),
    methods: {
      ...mapActions('organizations', ['createSegmentInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveSegment() {
        this.saveDisabled = true
        this.newSegment.organizationId = this.selectedOrganization.id
        const [error, response] = await this.createSegmentInstance(this.newSegment)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganization']),
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
