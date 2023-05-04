<template>
  <v-dialog v-model="isActive" max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" outlined v-bind="attrs" v-on="on" x-large :disabled="disabled">
        <v-icon class="pr-3"> mdi-plus </v-icon>
        {{ $t('dialogs.segmentCreationDialogInActives.segment') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.segmentCreationDialogInActives.segment_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newSegment.name"
                  :label="$t('dialogs.segmentCreationDialogInActives.name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="newSegment.internetAccess"
                :label="$t('dialogs.segmentCreationDialogInActives.internet_access')"
                class="ma-0"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="newSegment.isOcii"
                :label="$t('dialogs.segmentCreationDialogInActives.is_cii_object')"
                class="ma-0"
                hide-details
              ></v-checkbox>
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
    isOcii: false,
    internetAccess: false,
  }

  export default {
    name: 'SegmentCreationDialogInActives',
    props: {
      disabled: {
        type: Boolean,
        required: true,
      },
    },
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
        this.newSegment.organizationId = this.selectedOrganizationInActives.id
        const [error, response] = await this.createSegmentInstance(this.newSegment)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationInActives']),
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
