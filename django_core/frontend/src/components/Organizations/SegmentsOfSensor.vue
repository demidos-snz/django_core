<template>
  <v-card outlined class="mt-2">
    <v-card-title>
      {{ $t('organizations.organizationSegmentStructure.segments') }}
    </v-card-title>
    <v-col class="pb-0">
      <v-autocomplete
        :no-data-text="$t('main.no_data')"
        deletable-chips
        chips
        small-chips
        hide-details
        :value="getLocalChanges('segmentIds')"
        @input="addChanges('segmentIds', $event)"
        :items="headOrganizationSegments"
        :return-object="false"
        item-text="name"
        item-value="id"
        :label="$t('organizations.organizationSegmentStructure.segments')"
        :hint="$t('fieldHints.sensor.segments')"
        multiple
        outlined
      >
        <template v-slot:item="data">
          <v-list-item-content v-text="data.item.name" />
        </template>
        <template v-slot:selection="data">
          <v-chip @click:close="removeSegment(data.item.id)" :input-value="data.selected" close small>
            <span class="text-truncate">{{ data.item.name }}</span>
          </v-chip>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col class="d-flex">
      <v-spacer></v-spacer>
      <v-btn color="success" outlined :disabled="!hasSegmentChanges" @click="saveSensorSegments()">
        <v-icon> mdi-content-save </v-icon>
      </v-btn>
    </v-col>
  </v-card>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import Vue from 'vue'
  import { isNil, isEqual, isEmpty } from 'lodash'
  import { getChanges } from '@/utils'

  export default {
    name: 'SegmentsOfSensor',
    data: () => ({
      changes: {},
    }),
    methods: {
      ...mapActions('organizations', ['updateSensorInstanceSegments']),
      addChanges(fieldName, eventData) {
        const id = this.selectedStructureSensorId
        const oldData = this.selectedOrganizationSensors[id][fieldName]

        if (isEqual(oldData, eventData)) {
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
        const sourceObj = this.selectedStructureSensor
        const changesObj = this.changes[sourceObj.id]
        return getChanges(fieldName, changesObj, sourceObj)
      },
      removeSegment(id) {
        const segmentIds = this.getLocalChanges('segmentIds')
        const newSegmentIds = segmentIds.filter((segmentId) => segmentId !== id)
        this.addChanges('segmentIds', newSegmentIds)
      },
      async saveSensorSegments() {
        const sensorId = this.selectedStructureSensorId
        const newSegmentIds = this.changes[sensorId].segmentIds

        const [error, response] = await this.updateSensorInstanceSegments({
          id: sensorId,
          params: { segmentIds: newSegmentIds },
        })
        if (!error && response.status === 200) {
          Vue.delete(this.changes[sensorId], 'segmentIds')
        }
      },
    },
    computed: {
      ...mapState('organizations', ['selectedStructureSensorId']),
      ...mapGetters('organizations', [
        'selectedOrganization',
        'selectedOrganizationSensors',
        'selectedStructureSensor',
        'segments',
        'headOrganizationSegments',
      ]),
      hasSegmentChanges() {
        const sensorId = this.selectedStructureSensorId

        if (!this.changes[sensorId]) return false
        return this.changes[sensorId].hasOwnProperty('segmentIds')
      },
    },
  }
</script>
