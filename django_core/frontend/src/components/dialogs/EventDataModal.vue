<template>
  <v-dialog v-model="isActive" max-width="700px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" icon v-bind="attrs" v-on="on">
        <v-icon> mdi-information-variant </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('dialogs.eventDataModal.event_data') }}</span>
      </v-card-title>
      <v-card-text class="event-details py-2">
        <pre>{{ JSON.stringify(event, null, 2) }}</pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { Event } from '@/store/models/event'

  export default {
    name: 'EventDataModal',
    props: {
      event: {
        type: Event,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
    }),
  }
</script>
<style lang="scss" scoped>
  .event-details {
    overflow: auto;
    height: 600px;
  }
</style>
