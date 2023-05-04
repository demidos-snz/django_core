<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="ml-2" outlined color="error" v-bind="attrs" :disabled="disabled" v-on="on">
        <span class="v-btn__content" v-show="$vuetify.breakpoint.width >= 1400">{{ $t('main.delete') }}</span>
        <v-icon v-show="$vuetify.breakpoint.width < 1400"> mdi-delete-outline </v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title>
        <span class="headline">{{ $t('dialogs.incidentDeletion.incident_deletion') }}</span>
      </v-card-title>
      <v-card-text class="py-2">
        <p class="word-break text-center">{{ $t('dialogs.incidentDeletion.confirmation') }}</p>
      </v-card-text>
      <v-card-actions class="pb-5">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.cancel') }}
        </v-btn>
        <v-btn color="green" outlined @click="handleDeleteIncident">
          {{ $t('main.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import Incident from '@/store/models/incident'
  import rightsMixin from '@/mixins/rightsMixin'

  export default {
    name: 'IncidentDeletionDialog',
    mixins: [rightsMixin],
    props: {
      incident: {
        type: Incident,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
    }),
    methods: {
      ...mapActions('incidents', ['deleteIncident']),
      closeDialog() {
        this.isActive = false
      },
      async handleDeleteIncident() {
        await this.deleteIncident(this.incident.id)
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .word-break {
    word-break: normal;
  }
</style>
