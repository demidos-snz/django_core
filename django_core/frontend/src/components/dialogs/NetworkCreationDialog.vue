<template>
  <v-dialog v-model="isActive" max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" outlined v-bind="attrs" v-on="on" x-large :disabled="disabled">
        <v-icon class="pr-3"> mdi-plus </v-icon>
        {{ $t('dialogs.networkCreationDialog.network') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.networkCreationDialog.network_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newNetwork.name"
                  :label="$t('dialogs.networkCreationDialog.name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Address" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newNetwork.address"
                  :label="$t('dialogs.networkCreationDialog.address_range')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Segment" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :label="$t('dialogs.networkCreationDialog.segment')"
                  v-model="newNetwork.segmentId"
                  :items="selectedOrganizationSegments"
                  item-text="name"
                  item-value="id"
                  :multiple="false"
                  :error-messages="errors"
                  outlined
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="newNetwork.internetAccess"
                :label="$t('dialogs.networkCreationDialog.internet_access')"
                class="ma-0"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="newNetwork.isOcii"
                :label="$t('dialogs.networkCreationDialog.is_cii_object')"
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
          <v-btn color="green" outlined @click="saveNetwork()" :disabled="invalid || saveDisabled">
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

  const NEW_NETWORK = {
    name: '',
    address: '',
    segmentId: '',
    isOcii: false,
    internetAccess: false,
  }

  export default {
    name: 'NetworkCreationDialog',
    props: {
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      newNetwork: { ...NEW_NETWORK },
      saveDisabled: false,
    }),
    methods: {
      ...mapActions('organizations', ['createNetworkInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveNetwork() {
        this.saveDisabled = true
        const [error, response] = await this.createNetworkInstance(this.newNetwork)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationSegmentsInActives']),
      selectedOrganizationSegments() {
        return Object.values(this.selectedOrganizationSegmentsInActives)
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
