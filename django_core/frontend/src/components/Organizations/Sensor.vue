<template>
  <validation-observer ref="SensorObserver" v-slot="{ invalid }">
    <v-card outlined>
      <v-card-title>
        {{ $t('organizations.organizationSegmentStructure.sensor_info') }}
      </v-card-title>
      <v-col class="d-flex pb-0">
        <validation-provider name="Id" rules="required" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('identifier', $event)"
            :value="getLocalChanges('identifier')"
            :label="$t('organizations.organizationSegmentStructure.identifier')"
            :hint="$t('fieldHints.sensor.identifier')"
            outlined
            :error-messages="errors"
            class="pr-2"
          ></v-text-field>
        </validation-provider>
        <validation-provider name="Name" rules="required" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('name', $event)"
            :value="getLocalChanges('name')"
            :label="$t('organizations.organizationSegmentStructure.name')"
            :hint="$t('fieldHints.sensor.name')"
            outlined
            :error-messages="errors"
            class="pl-2"
          ></v-text-field>
        </validation-provider>
      </v-col>
      <v-col class="d-flex pb-0">
        <validation-provider name="HomeNet" rules="required" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('homeNet', $event)"
            :value="getLocalChanges('homeNet')"
            :label="$t('organizations.organizationSegmentStructure.home_net')"
            :hint="$t('fieldHints.sensor.home_net')"
            outlined
            :error-messages="errors"
            class="pr-2"
          ></v-text-field>
        </validation-provider>
        <validation-provider name="SensorType" rules="required" class="half-width" v-slot="{ errors }">
          <v-select
            :no-data-text="$t('main.no_data')"
            :items="sensorTypes"
            @input="addChanges('typeSensor', $event)"
            :value="getLocalChanges('typeSensor')"
            item-text="name"
            item-value="id"
            :label="$t('organizations.organizationSegmentStructure.sensor_type')"
            outlined
            :error-messages="errors"
            class="pl-2"
          >
            <template v-slot:item="data">
              <v-list-item-content v-text="data.item.name" />
            </template>
          </v-select>
        </validation-provider>
      </v-col>
      <v-col class="d-flex pb-0">
        <validation-provider name="Address" rules="required|ip" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('address', $event)"
            :value="getLocalChanges('address')"
            :label="$t('organizations.organizationSegmentStructure.address')"
            :hint="$t('fieldHints.sensor.address')"
            outlined
            :error-messages="errors"
            class="pr-2"
          ></v-text-field>
        </validation-provider>
        <validation-provider name="Url" rules="required|url" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('url', $event)"
            :value="getLocalChanges('url')"
            label="URL"
            :hint="$t('fieldHints.sensor.url')"
            outlined
            :error-messages="errors"
            class="pl-2"
          ></v-text-field>
        </validation-provider>
      </v-col>
      <v-col class="d-flex pb-0">
        <v-text-field
          @input="addChanges('login', $event)"
          :value="getLocalChanges('login')"
          :label="$t('organizations.organizationSegmentStructure.login')"
          :hint="$t('fieldHints.sensor.login')"
          outlined
          class="pr-2"
        ></v-text-field>
        <v-text-field
          @input="addChanges('password', $event)"
          :value="getLocalChanges('password')"
          :label="$t('organizations.organizationSegmentStructure.password')"
          outlined
          type="password"
          class="pl-2"
        ></v-text-field>
      </v-col>
      <v-col class="d-flex">
        <v-checkbox
          class="ma-0 pa-0 d-flex align-center"
          @change="addChanges('isActive', $event)"
          :input-value="getLocalChanges('isActive')"
          :disabled="!canChangeSensorActiveness"
          hide-details
          :label="$t('organizations.organizationSegmentStructure.is_active')"
        ></v-checkbox>
        <v-spacer></v-spacer>
        <v-btn color="success" outlined :disabled="invalid || !isSensorEdited" @click="saveSensor()">
          <v-icon> mdi-content-save </v-icon>
        </v-btn>
      </v-col>
    </v-card>
  </validation-observer>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import rightsMixin from '@/mixins/rightsMixin'
  import { sensorTypes } from '@/constants/constants'
  import Vue from 'vue'
  import { isNil, isEqual, omit, isEmpty } from 'lodash'
  import { getChanges } from '@/utils'

  export default {
    name: 'Sensor',
    mixins: [validationMixin, rightsMixin],
    data: () => ({
      changes: {},
      sensorTypes: Object.values(sensorTypes),
    }),
    methods: {
      ...mapActions('organizations', ['updateSensorInstance']),
      addChanges(fieldName, eventData) {
        const id = this.selectedStructureSensorId
        const oldData = this.selectedOrganizationSensors

        if (isEqual(oldData[id][fieldName], eventData)) {
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
        const itemId = this.selectedStructureSensorId
        const changesObj = this.changes[itemId]
        const sourceObj = this.selectedOrganizationSensors[itemId]
        return getChanges(fieldName, changesObj, sourceObj)
      },
      async saveSensor() {
        const sensorId = this.selectedStructureSensorId
        const params = this.changes[sensorId]

        const [error, response] = await this.updateSensorInstance({
          id: sensorId,
          params: params,
        })
        if (!error && response.status === 200) {
          Vue.delete(this.changes, sensorId)
        }
      },
    },
    computed: {
      ...mapState('organizations', ['selectedStructureSensorId']),
      ...mapGetters('organizations', ['selectedOrganizationSensors']),
      isSensorEdited() {
        const sensorId = this.selectedStructureSensorId
        if (!this.changes[sensorId]) return false
        return !isEmpty(omit(this.changes[sensorId], 'segmentIds'))
      },
    },
  }
</script>
