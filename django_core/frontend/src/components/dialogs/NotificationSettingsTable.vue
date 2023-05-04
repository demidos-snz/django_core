<template>
  <v-simple-table fixed-header height="38vh">
    <thead>
      <tr>
        <th>{{ $t('dialogs.loggedUserModal.organization') }}</th>
        <th>{{ $t('dialogs.loggedUserModal.notificationTypes.newIncident') }}</th>
        <th>
          {{ $t('dialogs.loggedUserModal.notificationTypes.updatedIncident') }}
        </th>
        <th>
          {{ $t('dialogs.loggedUserModal.notificationTypes.closedIncident') }}
        </th>
        <th>{{ $t('dialogs.loggedUserModal.notificationTypes.weekReport') }}</th>
        <th v-if="telegramAllowed">
          {{ $t('dialogs.loggedUserModal.notificationTypes.telegram') }}
        </th>
        <th v-if="smsAllowed">
          {{ $t('dialogs.loggedUserModal.notificationTypes.sms') }}
        </th>
      </tr>
      <tr v-if="smsAllowed">
        <th>{{ $t('dialogs.loggedUserModal.notificationTypes.created') }}</th>
        <th>{{ $t('dialogs.loggedUserModal.notificationTypes.updated') }}</th>
        <th>{{ $t('dialogs.loggedUserModal.notificationTypes.closed') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="organization in organizations" :key="organization.id">
        <td>{{ organization.name }}</td>
        <td v-for="(item, index) of values" :key="index">
          <v-checkbox
            @change="handleChange($event, organization.id, ...item)"
            class="d-inline-flex"
            :input-value="nm.getValue(organization.id, ...item)"
          ></v-checkbox>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  const CHANNELS = {
    EMAIL: 'email',
    SMS: 'sms',
    TELEGRAM: 'telegram',
  }

  const MESSAGE_TYPES = {
    NEW_INCIDENT: 'newIncident',
    UPDATE_INCIDENT: 'updatedIncident',
    CLOSED_INCIDENT: 'closedIncident',
    ORGANIZATION_WEEK_INCIDENTS: 'organizationWeekIncidents',
  }

  export default {
    name: 'NotificationSettingsTable',
    computed: {
      ...mapGetters('operator', ['operator', 'notificationManager', 'emailAllowed', 'smsAllowed', 'telegramAllowed']),
      ...mapGetters('organizations', ['organizations']),

      nm() {
        return this.notificationManager
      },

      values() {
        const values = [
          [MESSAGE_TYPES.NEW_INCIDENT, CHANNELS.EMAIL],
          [MESSAGE_TYPES.UPDATE_INCIDENT, CHANNELS.EMAIL],
          [MESSAGE_TYPES.CLOSED_INCIDENT, CHANNELS.EMAIL],
          [MESSAGE_TYPES.ORGANIZATION_WEEK_INCIDENTS, CHANNELS.EMAIL],
        ]

        if (this.telegramAllowed) {
          values.push([null, CHANNELS.TELEGRAM])
        }

        if (this.smsAllowed) {
          values.push([MESSAGE_TYPES.NEW_INCIDENT, CHANNELS.SMS])
          values.push([MESSAGE_TYPES.UPDATE_INCIDENT, CHANNELS.SMS])
          values.push([MESSAGE_TYPES.CLOSED_INCIDENT, CHANNELS.SMS])
        }

        return values
      },
    },

    methods: {
      ...mapActions('operator', ['updateUserNotificationsSettings']),

      handleChange(checked, organizationId, type, channel) {
        let params = {
          organizationId,
          channel,
        }
        if (channel === CHANNELS.TELEGRAM) {
          params = {
            ...params,
            [MESSAGE_TYPES.NEW_INCIDENT]: checked,
            [MESSAGE_TYPES.UPDATE_INCIDENT]: checked,
            [MESSAGE_TYPES.CLOSED_INCIDENT]: checked,
          }
        } else {
          params[type] = checked
        }

        this.updateUserNotificationsSettings(params)
      },
    },
  }
</script>

<style scoped>
  td,
  th {
    text-align: center !important;
  }

  .theme--dark.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    border-bottom: thin solid rgba(255, 255, 255, 0.12);
  }
</style>
