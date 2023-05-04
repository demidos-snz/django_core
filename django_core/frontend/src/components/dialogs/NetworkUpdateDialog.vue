<template>
  <v-dialog v-model="isActive" max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small v-bind="attrs" v-on="on" class="pa-0" color="primary" icon :disabled="disabled">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.networkUpdateDialog.network_update') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  @input="addChanges('name', $event)"
                  :value="getLocalChanges('name')"
                  :label="$t('dialogs.networkUpdateDialog.name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Address" rules="required" v-slot="{ errors }">
                <v-text-field
                  @input="addChanges('address', $event)"
                  :value="getLocalChanges('address')"
                  :label="$t('dialogs.networkUpdateDialog.address_range')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Segment" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :label="$t('dialogs.networkUpdateDialog.segment')"
                  @input="addChanges('segmentId', $event)"
                  :value="getLocalChanges('segmentId')"
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
                @change="addChanges('internetAccess', $event)"
                :input-value="getLocalChanges('internetAccess')"
                :label="$t('dialogs.networkUpdateDialog.internet_access')"
                class="ma-0"
                hide-details
                :readonly="network.internetAccess"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                @change="addChanges('isOcii', $event)"
                :input-value="getLocalChanges('isOcii')"
                :label="$t('dialogs.networkUpdateDialog.is_cii_object')"
                class="ma-0"
                hide-details
                :readonly="network.isOcii"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="success" outlined :disabled="invalid || !isNetworkEdited" @click="saveNetwork()">
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
  import { getChanges } from '@/utils'
  import Vue from 'vue'
  import { isNil, isEqual, isEmpty } from 'lodash'
  import Network from '@/store/models/network'

  export default {
    name: 'NetworkUpdateDialog',
    mixins: [validationMixin],
    props: {
      network: {
        type: Network,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
      changes: {},
    }),
    methods: {
      ...mapActions('organizations', ['updateNetworkInstance']),
      addChanges(fieldName, eventData) {
        const id = this.network.id
        const oldData = this.network

        if (isEqual(oldData[fieldName], eventData)) {
          Vue.delete(this.changes[id], fieldName)
          if (isEmpty(this.changes[id])) {
            Vue.delete(this.changes, id)
          }
          return
        }

        if (isNil(this.changes[id])) {
          Vue.set(this.changes, id, {})
        }

        Vue.set(this.changes[id], fieldName, eventData)
      },
      getLocalChanges(fieldName) {
        const itemId = this.network.id
        const changesObj = this.changes[itemId]
        const sourceObj = this.network
        return getChanges(fieldName, changesObj, sourceObj)
      },
      async saveNetwork() {
        const networkId = this.network.id
        const params = this.changes[networkId]

        const [error, response] = await this.updateNetworkInstance({
          id: networkId,
          params: params,
        })
        if (!error && response.status === 200) {
          Vue.delete(this.changes, networkId)
        }
      },
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationSegmentsInActives']),
      selectedOrganizationSegments() {
        return Object.values(this.selectedOrganizationSegmentsInActives)
      },
      isNetworkEdited() {
        const networkId = this.network.id
        return !isEmpty(this.changes[networkId])
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
