<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mx-2" color="success" :disabled="disabled" v-bind="attrs" v-on="on" icon small>
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.assetSelectionDialog.active_selection') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Segment" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :label="$t('dialogs.assetSelectionDialog.segment')"
                  :allow-overflow="false"
                  v-model="asset.segment"
                  :items="availableSegments"
                  :error-messages="errors"
                  item-text="name"
                  item-value="id"
                  :multiple="false"
                  outlined
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="IpResource" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="asset.ip_resource"
                  :label="$t('dialogs.assetSelectionDialog.ip_resource')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="HostName" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="asset.hostname"
                  :label="$t('dialogs.assetSelectionDialog.hostname')"
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
          <v-btn color="green" outlined @click="add" :disabled="invalid">
            {{ $t('main.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { isNil } from 'lodash'
  import validationMixin from '../../mixins/validationMixin'

  export default {
    name: 'AssetSelectionDialog',
    mixins: [validationMixin],
    props: {
      incidentId: {
        type: Number,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
      availableSegments: [],
      asset: {
        segment: null,
        ip_resource: '',
        hostname: '',
      },
    }),
    methods: {
      ...mapActions(['addAsset', 'getAvailableSegments']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async add() {
        const params = { id: this.incidentId, params: this.asset }
        await this.addAsset(params)
        if (isNil(this.lastError)) {
          this.closeDialog()
        }
      },
    },
    computed: {
      ...mapGetters(['lastError']),
    },
    watch: {
      async isActive(newVal) {
        if (newVal) {
          this.availableSegments = await this.getAvailableSegments(this.incidentId)
        } else {
          this.closeDialog()
        }
      },
    },
  }
</script>
