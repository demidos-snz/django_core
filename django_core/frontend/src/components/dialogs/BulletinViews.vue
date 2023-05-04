<template>
  <v-dialog v-model="isActive" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" small>
        <v-icon> mdi-format-list-checks</v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title class="white--text headline">
        <span class="headline">{{ $t('dialogs.bulletinViews.title') }}: {{ bulletin.name }}</span>
      </v-card-title>
      <v-card-text class="py-4">
        <span v-if="!bulletin.hasReads"> {{ $t('dialogs.bulletinViews.no_views') }}</span>
        <v-simple-table v-else dark fixed-header>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">{{ $t('dialogs.bulletinViews.username') }}</th>
                <th class="text-center">{{ $t('dialogs.bulletinViews.download_datetime') }}</th>
                <th class="text-right">{{ $t('dialogs.bulletinViews.mark_read_datetime') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="view of bulletin.views" :key="view.id">
                <td class="text-left">{{ view.user.fullName }}</td>
                <td class="text-center">{{ view.downloadDateTime || '-' }}</td>
                <td class="text-right">{{ view.markReadDateTime || '-' }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions class="pb-5 px-4">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Bulletin from '@/store/models/bulletin'

  export default {
    name: 'BulletinViews',
    props: {
      bulletin: {
        type: Bulletin,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
    }),
    methods: {
      closeDialog() {
        this.isActive = false
      },
    },
  }
</script>
