<template>
  <div v-if="p9s.canRead(ruleEntities.STATUS)">
    <v-menu
      :disabled="!p9s.canUpdate(ruleEntities.STATUS)"
      bottom
      offset-y
      v-if="filteredStatusOptions.length > 0"
      close-on-click
      :close-on-content-click="false"
      v-model="isVisible"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn :color="incident.statusData.color" outlined v-bind="attrs" v-on="on">
          {{ incident.statusData.name }}
          <v-icon class="ml-2">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list outlined>
        <v-list-item v-for="status in filteredStatusOptions" :key="status.id">
          <IncidentClosureDialog v-if="status.id === incidentStatuses.CLOSED" :status="status" />
          <v-btn v-else small outlined :color="status.color" @click="setIncidentStatus(status.id)">
            {{ status.name }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-else :color="incident.statusData.color" outlined>
      {{ incident.statusData.name }}
    </v-btn>
  </div>
  <v-chip v-else color="orange" label outlined>{{ $t('readPermissions.cant_read_status') }}</v-chip>
</template>

<script>
  import Incident from '@/store/models/incident'
  import rightsMixin from '@/mixins/rightsMixin'
  import { getIncidentStatuses } from '@/constants/constants'
  import { mapActions } from 'vuex'
  import { RULE_ENTITIES, STATUS } from '@/constants/enums'
  import IncidentClosureDialog from '@/components/dialogs/IncidentClosureDialog'

  export default {
    name: 'IncidentStatusField',
    mixins: [rightsMixin],
    components: {
      IncidentClosureDialog,
    },
    props: {
      incident: {
        type: Incident,
        required: true,
      },
    },
    data: () => ({
      ruleEntities: RULE_ENTITIES,
      incidentStatuses: STATUS,
      closureDialogIsActive: false,
      isVisible: false,
    }),
    computed: {
      filteredStatusOptions() {
        const availableStatuses = this.availableStatuses(this.incident)
        const statusOptions = Object.values(getIncidentStatuses())
        return statusOptions.filter((item) => {
          return availableStatuses.includes(item.id) && item.id !== this.incident.status
        })
      },
    },
    methods: {
      ...mapActions('incidents', ['updateIncident']),
      setIncidentStatus(status) {
        this.updateIncident({ status })
      },
      closeDropdown() {
        this.isVisible = false
      },
    },
    watch: {
      'incident.status'(oldStatus, newStatus) {
        if (oldStatus !== newStatus) {
          this.closeDropdown()
        }
      },
    },
  }
</script>
