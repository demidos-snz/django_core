<template>
  <v-scroll-y-transition mode="out-in">
    <v-card class="d-flex flex-row fill-height pa-3 ma-0">
      <v-col cols="5" class="fill-height">
        <v-col class="search-col">
          <v-text-field
            v-model="search"
            :label="$t('organizations.organizationSegmentStructure.search')"
            outlined
            clearable
            hide-details
          ></v-text-field>
        </v-col>
        <v-treeview
          :active="activeItems"
          ref="segmentsTree"
          class="overflow-auto pr-2 orgs-treeview"
          item-children="sensors"
          return-object
          item-key="itemKey"
          :items="treeItems"
          @update:active="selectItem"
          :multiple-active="false"
          :search="search"
          activatable
          shaped
          color="primary"
          transition
        >
          <template v-slot:append="data">
            <template>
              <SiemSelectionDialog v-if="isSiemRoot(data.item)" />
              <SegmentCreationDialog v-if="isSegmentRoot(data.item)" />
              <SensorCreationDialog v-if="isSegment(data.item)" :segmentId="data.item.id" />
              <v-icon v-if="isActiveSensor(data.item)" small color="green"> mdi-check </v-icon>
              <v-icon v-if="isInactiveSensor(data.item)" small color="red"> mdi-close </v-icon>
            </template>
          </template>
        </v-treeview>
      </v-col>
      <v-col class="fill-height overflow-auto">
        <div v-if="selectedStructureSensorId">
          <Sensor />
          <SegmentsOfSensor />
        </div>
        <Segment v-else-if="selectedStructureSegmentId" />
        <Siem v-else-if="selectedStructureSiemId" />
        <div
          v-else
          class="d-flex fill-height title align-center justify-center grey--text text--lighten-1 font-weight-light"
        >
          {{ $t('organizations.organizationSegmentStructure.item_not_selected') }}
        </div>
      </v-col>
    </v-card>
  </v-scroll-y-transition>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import SegmentCreationDialog from '@/components/dialogs/SegmentCreationDialog'
  import SensorCreationDialog from '@/components/dialogs/SensorCreationDialog'
  import SiemSelectionDialog from '@/components/dialogs/SiemSelectionDialog'
  import SegmentsOfSensor from '@/components/Organizations/SegmentsOfSensor'
  import Sensor from '@/components/Organizations/Sensor'
  import SensorClass from '@/store/models/sensor'
  import SegmentClass from '@/store/models/segment'
  import Segment from '@/components/Organizations/Segment'
  import Siem from '@/components/Organizations/Siem'
  import SiemClass from '@/store/models/siem'
  import { ORGANIZATION_STRUCTURE_ITEM_TYPES } from '@/constants/enums'
  import { isNil } from 'lodash'
  import { getChanges } from '@/utils'

  export default {
    name: 'OrganizationSegmentStructure',
    mixins: [validationMixin],
    components: {
      SegmentCreationDialog,
      SensorCreationDialog,
      Sensor,
      Segment,
      SegmentsOfSensor,
      Siem,
      SiemSelectionDialog,
    },
    data: () => ({
      changes: {},
      search: '',
      structureItemTypes: ORGANIZATION_STRUCTURE_ITEM_TYPES,
    }),
    methods: {
      ...mapActions('organizations', [
        'deselectStructureItemData',
        'selectStructureSegmentId',
        'selectStructureSensorId',
        'selectStructureSiemId',
      ]),
      selectItem(selection) {
        const selectedItem = selection[0]
        if (isNil(selectedItem)) {
          return this.deselectStructureItemData()
        }

        if (selectedItem instanceof SensorClass) {
          const sensorId = selectedItem.id
          const segmentId = selectedItem.currentSegment.id
          this.selectStructureSensorId({ sensorId, segmentId })
        } else if (selectedItem instanceof SegmentClass) {
          this.selectStructureSegmentId({ segmentId: selectedItem.id })
        } else if (selectedItem instanceof SiemClass) {
          this.selectStructureSiemId({ siemId: selectedItem.id })
        }
      },
      handlePreselect() {
        const preselectedSensorId = parseInt(this.$route.query.sensor)
        const tree = this.$refs.segmentsTree

        if (!Number.isNaN(preselectedSensorId)) {
          if (tree) {
            let found = false
            for (const segment of this.selectedOrganization.segments) {
              for (const sensor of segment.sensors) {
                if (sensor.id === preselectedSensorId) {
                  this.$refs.segmentsTree.updateActive(sensor.itemKey, true)
                  this.$refs.segmentsTree.updateOpen(this.structureItemTypes.SEGMENT_ROOT, true)
                  this.$refs.segmentsTree.updateOpen(segment.itemKey, true)
                  this.selectStructureSensorId({ sensorId: preselectedSensorId, segmentId: segment.id })
                  found = true
                  break
                }
              }
              if (found) break
            }
          }
          this.$router.replace({})
        }
      },
      isSegmentRoot(item) {
        return item.type === this.structureItemTypes.SEGMENT_ROOT
      },
      isSegment(item) {
        return item.type === this.structureItemTypes.SEGMENT
      },
      isActiveSensor(item) {
        return item.type === this.structureItemTypes.SENSOR && item.isActive
      },
      isInactiveSensor(item) {
        return item.type === this.structureItemTypes.SENSOR && !item.isActive
      },
      isSiem(item) {
        return item.hasOwnPropety('typeSiem')
      },
      isSiemRoot(item) {
        return item.type === this.structureItemTypes.SIEM_ROOT
      },
      getLocalChanges(fieldName) {
        return getChanges(fieldName, this.changes, this.selectedOrganization)
      },
    },
    computed: {
      ...mapState('organizations', [
        'selectedStructureSensorId',
        'selectedStructureSegmentId',
        'selectedStructureSiemId',
      ]),
      ...mapGetters('organizations', [
        'selectedOrganization',
        'selectedOrganizationSegments',
        'selectedStructureSensor',
        'siems',
      ]),
      activeItems() {
        if (this.selectedStructureSensor) {
          return [this.selectedStructureSensor]
        }
        return []
      },
      treeItems() {
        return [
          {
            name: this.$t('organizations.organizationSegmentStructure.analytic_systems'),
            type: this.structureItemTypes.SIEM_ROOT,
            itemKey: this.structureItemTypes.SIEM_ROOT,
            sensors: this.siemObjList,
          },
          {
            name: this.$t('organizations.organizationSegmentStructure.segments'),
            type: this.structureItemTypes.SEGMENT_ROOT,
            itemKey: this.structureItemTypes.SEGMENT_ROOT,
            sensors: Object.values(this.selectedOrganization.segments),
          },
        ]
      },
      siemIdsList() {
        return this.getLocalChanges('siemIds')
      },
      siemObjList() {
        return this.siemIdsList.map((siemId) => this.siems[siemId])
      },
    },
    mounted() {
      this.handlePreselect()
    },
  }
</script>
<style lang="scss" scoped>
  .search-col {
    height: 80px;
  }
  .orgs-treeview {
    height: calc(100% - 80px);
  }
</style>
