<template>
  <v-card class="mb-3" outlined>
    <v-card-text>
      <v-row>
        <v-col class="pa-3">
          <v-text-field
            :value="getLocalChanges('name')"
            @input="addChanges('name', $event)"
            :label="$t('actives.segmentsTab.segmentCard.segment_name')"
            :hint="$t('fieldHints.actives.segment_name')"
            outlined
            :readonly="!canUpdateActives"
          ></v-text-field>
        </v-col>
        <v-col class="pa-3 pl-1">
          <v-col class="pa-0">
            <v-icon v-if="segment.internetAccess" class="mr-2" color="green"> mdi-check </v-icon>
            <v-icon v-else class="mr-2" color="red"> mdi-close </v-icon>
            <span>{{ $t('actives.segmentsTab.segmentCard.internet_access') }}</span>
          </v-col>
          <v-col class="pa-0 mt-2">
            <v-icon v-if="segment.isOcii" class="mr-2" color="green"> mdi-check </v-icon>
            <v-icon v-else class="mr-2" color="red"> mdi-close </v-icon>
            <span>{{ $t('actives.segmentsTab.segmentCard.is_cii_object') }}</span>
          </v-col>
        </v-col>
        <v-col class="pa-3">
          <v-row class="d-flex flex-column">
            <v-col class="pb-1 d-flex justify-end">
              <v-btn color="success" icon @click="saveSegment" :disabled="!isSegmentEdited">
                <v-icon> mdi-content-save </v-icon>
              </v-btn>
              <v-btn
                color="red"
                icon
                class="ml-1"
                :disabled="!canUpdateActives"
                @click="deleteSegmentInstance(segment.id)"
              >
                <v-icon> mdi-delete-outline </v-icon>
              </v-btn>
            </v-col>
            <v-col class="pt-1 d-flex justify-end">
              <v-btn outlined @click="goToSegmentNetworks">
                {{ $t('actives.segmentsTab.segmentCard.go_to_networks') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import { ORGANIZATION_TABS_IN_ACTIVES } from '@/constants/enums'
  import rightsMixin from '@/mixins/rightsMixin'
  import Segment from '@/store/models/segment'
  import { mapActions } from 'vuex'
  import { isEmpty, isNil, isEqual } from 'lodash'
  import { getChanges } from '@/utils'
  import Vue from 'vue'

  export default {
    name: 'SegmentCard',
    mixins: [rightsMixin],
    props: {
      segment: {
        type: Segment,
        required: true,
      },
    },
    data: () => ({
      changes: {},
      activesTabs: ORGANIZATION_TABS_IN_ACTIVES,
    }),
    methods: {
      ...mapActions('organizations', [
        'updateSegmentInstance',
        'deleteSegmentInstance',
        'selectOrganizationTabInActives',
        'selectSegmentIdInNetworks',
      ]),
      addChanges(fieldName, eventData) {
        if (isEqual(this.segment[fieldName], eventData)) {
          Vue.delete(this.changes, fieldName)
          if (isEmpty(this.changes)) {
            Vue.set(this, 'changes', {})
          }
          return
        }

        if (isNil(this.changes)) {
          Vue.set(this, 'changes', {})
        }

        Vue.set(this.changes, fieldName, eventData)
      },
      getLocalChanges(fieldName) {
        return getChanges(fieldName, this.changes, this.segment)
      },
      async saveSegment() {
        const [error, response] = await this.updateSegmentInstance({
          id: this.segment.id,
          params: this.changes,
        })
        if (!error && response.status === 200) {
          Vue.set(this, 'changes', {})
        }
      },
      goToSegmentNetworks() {
        const segmentId = this.segment.id
        const tabId = ORGANIZATION_TABS_IN_ACTIVES.NETWORKS

        this.selectSegmentIdInNetworks(segmentId)
        this.selectOrganizationTabInActives(tabId)
      },
    },
    computed: {
      isSegmentEdited() {
        return !isEmpty(this.changes)
      },
    },
    watch: {},
  }
</script>
<style lang="scss"></style>
