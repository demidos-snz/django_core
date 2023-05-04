<template>
  <fieldset class="fill-height">
    <legend class="ml-3">{{ $t('incidents.incidentMainData.ncircc') }}</legend>
    <v-col class="d-flex flex-column max-full-height fill-height overflow-auto pa-0">
      <v-col v-if="incident.submittedToNcircc" class="pa-0">
        <v-col>
          <v-text-field
            :value="incident.ncircc.registrationNumber"
            :label="$t('incidents.ncirccFieldset.registration_number')"
            outlined
            hide-details
            readonly
          />
        </v-col>
        <v-col>
          <v-text-field
            :value="incident.ncircc.statusVerbose"
            :label="$t('incidents.ncirccFieldset.status')"
            outlined
            hide-details
            readonly
          />
        </v-col>
        <v-col>
          <v-text-field
            :value="incident.ncircc.created"
            :label="$t('incidents.ncirccFieldset.identified')"
            outlined
            hide-details
            readonly
            dense
          />
        </v-col>
        <v-col>
          <v-text-field
            :value="incident.ncircc.modified"
            :label="$t('incidents.ncirccFieldset.updated')"
            outlined
            hide-details
            readonly
            dense
          />
        </v-col>
        <v-col>
          <v-btn outlined small @click="openCreateNcirccNotificationDialog">{{
            $t('incidents.ncirccFieldset.open_notification')
          }}</v-btn>
        </v-col>
      </v-col>
      <v-col v-else class="d-flex flex-column justify-center align-center">
        <p>{{ $t('incidents.ncirccFieldset.not_sent_yet') }}</p>
        <div>
          <NcirccNotificationCreationDialog
            :disabled="!canCreateNcirccData(incident) || incident.submittedToNcircc"
            :incident="incident"
            @open-notification-dialog="setNotificationData"
          />
        </div>
      </v-col>
      <NcirccNotificationDialog
        v-if="ncirccNotificationOpened"
        :initial-data="newNcirccNotificationData"
        :incident="incident"
        :is-active="ncirccNotificationOpened"
        @close="closeNcirccNotificationDialog"
      />
    </v-col>
  </fieldset>
</template>

<script>
  import NcirccNotificationDialog from '@/components/dialogs/NcirccNotificationDialog'
  import NcirccNotificationCreationDialog from '@/components/dialogs/NcirccNotificationCreationDialog'
  import Incident from '@/store/models/incident'
  import rightsMixin from '@/mixins/rightsMixin'

  export default {
    name: 'NcirccFieldset',
    mixins: [rightsMixin],
    props: {
      incident: {
        required: true,
        type: Incident,
      },
    },
    components: {
      NcirccNotificationDialog,
      NcirccNotificationCreationDialog,
    },
    data: () => ({
      ncirccNotificationOpened: false,
      newNcirccNotificationData: {},
    }),
    computed: {},
    methods: {
      setNotificationData(data) {
        this.$set(this, 'newNcirccNotificationData', data)
        this.openCreateNcirccNotificationDialog()
      },

      openCreateNcirccNotificationDialog() {
        this.$set(this, 'ncirccNotificationOpened', true)
      },

      closeNcirccNotificationDialog() {
        this.$set(this, 'ncirccNotificationOpened', false)
        this.$set(this, 'newNcirccNotificationData', {})
      },
    },
  }
</script>

<style scoped></style>
