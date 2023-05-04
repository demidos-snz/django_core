<template>
  <validation-observer ref="SegmentObserver" v-slot="{ invalid }">
    <v-card outlined>
      <v-card-title>
        {{ $t('organizations.organizationSegmentStructure.segment_info') }}
      </v-card-title>
      <v-col>
        <validation-provider name="Name" rules="required" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('name', $event)"
            :value="getLocalChanges('name')"
            :label="$t('organizations.organizationSegmentStructure.name')"
            outlined
            :error-messages="errors"
          ></v-text-field>
        </validation-provider>
      </v-col>
      <v-col class="d-flex">
        <v-spacer></v-spacer>
        <v-btn color="success" outlined :disabled="invalid || !isSegmentEdited" @click="saveSegment()">
          <v-icon> mdi-content-save </v-icon>
        </v-btn>
      </v-col>
    </v-card>
  </validation-observer>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import Vue from 'vue'
  import { isNil, isEqual, isEmpty } from 'lodash'
  import { getChanges } from '@/utils'

  export default {
    name: 'Segment',
    mixins: [validationMixin],
    data: () => ({
      changes: {},
    }),
    methods: {
      ...mapActions('organizations', ['updateSegmentInstance']),
      addChanges(fieldName, eventData) {
        const id = this.selectedStructureSegmentId
        const oldData = this.selectedOrganizationSegments

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
        const sourceObj = this.selectedOrganizationSegments[this.selectedStructureSegmentId]
        const changesObj = this.changes[sourceObj.id]

        return getChanges(fieldName, changesObj, sourceObj)
      },
      async saveSegment() {
        const segmentId = this.selectedStructureSegmentId
        const changes = this.changes[segmentId]

        const [error, response] = await this.updateSegmentInstance({
          id: segmentId,
          params: changes,
        })
        if (!error && response.status === 200) {
          Vue.delete(this.changes, segmentId)
        }
      },
    },
    computed: {
      ...mapState('organizations', ['selectedStructureSegmentId']),
      ...mapGetters('organizations', ['selectedOrganizationSegments']),
      isSegmentEdited() {
        const segmentId = this.selectedStructureSegmentId
        return this.changes.hasOwnProperty(segmentId)
      },
    },
  }
</script>
