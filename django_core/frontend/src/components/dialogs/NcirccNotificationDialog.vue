<template>
  <v-dialog v-model="isActive" fullscreen hide-overlay persistent>
    <v-card class="border data-container">
      <v-card-title class="top-bar">{{ $t('dialogs.ncirccNotificationDialog.ncircc_notification') }}</v-card-title>
      <v-card-text class="pa-0">
        <v-row class="ma-0 fill-height border">
          <v-col cols="2" class="overflow-auto data-container">
            <v-list shaped class="item-list">
              <v-list-item-group v-model="selectedMenuItem" color="primary">
                <template v-for="item of ncirccNotificationMenuItems">
                  <v-list-item v-if="item.show(incident)" :value="item.id" :key="item.id">
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>{{ item.name }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col cols="10" class="overflow-auto data-container">
            <component ref="currentMenu" :is="currentMenu" :incident="incident" :initial-data="initialData" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="bottom-bar">
        <v-spacer />
        <EvidenceUploadDialog v-if="isEvidencesOpen" />
        <v-progress-circular indeterminate size="25" width="2" class="mr-2" v-if="sending" />
        <template v-else>
          <v-btn v-if="showSendBtn" outlined color="green" @click="sendData">{{
            $t('dialogs.ncirccNotificationDialog.send_to_ncircc')
          }}</v-btn>
          <v-btn v-if="showSaveBtn" outlined color="green" @click="sendUpdates">{{ $t('main.save') }}</v-btn>
        </template>
        <v-btn outlined color="red" @click="closeDialog">{{ $t('main.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Incident from '@/store/models/incident'
  import { getNcirccNotificationMenuItems } from '@/constants/constants'
  import Comments from '@/components/Ncircc/Comments'
  import Evidences from '@/components/Ncircc/Evidences'
  import Notification from '@/components/Ncircc/Notification'
  import { NCIRCC_DIALOG_TABS } from '@/constants/enums'
  import EvidenceUploadDialog from '@/components/dialogs/EvidenceUploadDialog'
  import rightsMixin from '@/mixins/rightsMixin'

  export default {
    name: 'NcirccNotificationDialog',
    components: { EvidenceUploadDialog },
    mixins: [rightsMixin],
    props: {
      incident: {
        type: Incident,
        required: true,
      },
      isActive: {
        type: Boolean,
        required: true,
      },
      initialData: {
        type: Object,
        required: false,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        selectedMenuItem: NCIRCC_DIALOG_TABS.NOTIFICATION,
        ncirccNotificationMenuItems: getNcirccNotificationMenuItems(),
        currentMenuComponent: null,
        evidenceModal: false,
        sending: false,
      }
    },
    computed: {
      isNotificationOpen() {
        return this.selectedMenuItem === NCIRCC_DIALOG_TABS.NOTIFICATION
      },
      isEvidencesOpen() {
        return this.selectedMenuItem === NCIRCC_DIALOG_TABS.EVIDENCES
      },
      currentMenu() {
        switch (this.selectedMenuItem) {
          case NCIRCC_DIALOG_TABS.NOTIFICATION:
          default:
            return Notification
          case NCIRCC_DIALOG_TABS.COMMENTS:
            return Comments
          case NCIRCC_DIALOG_TABS.EVIDENCES:
            return Evidences
        }
      },
      hasChanges() {
        if (!this.currentMenuComponent) return false
        return this.currentMenuComponent.hasChanges
      },

      showSendBtn() {
        if (!this.isNotificationOpen || !this.hasChanges) return false
        if (!this.canCreateNcirccData(this.incident)) return false
        return !this.incident.submittedToNcircc
      },

      showSaveBtn() {
        if (!this.canUpdateNcirccData(this.incident)) return false
        if (!this.isNotificationOpen || !this.hasChanges || this.showSendBtn) return false
        return this.incident.ncirccNeedMoreInfo
      },
    },
    methods: {
      closeDialog() {
        this.$emit('close')
      },
      sendData() {
        if (!this.currentMenuComponent) return

        this.sending = true
        this.currentMenuComponent.sendData().finally(() => {
          this.sending = false
        })
      },
      sendUpdates() {
        if (!this.currentMenuComponent) return

        this.sending = true
        this.currentMenuComponent.sendUpdates().finally(() => {
          this.sending = false
        })
      },
    },
    mounted() {
      this.$set(this, 'currentMenuComponent', this.$refs.currentMenu)
    },
  }
</script>

<style lang="scss" scoped>
  .data-container {
    --top-bar-height: 60px;
    --bottom-bar-height: 60px;

    .top-bar {
      height: var(--top-bar-height);
    }

    .bottom-bar {
      height: var(--bottom-bar-height);
    }

    height: calc(100vh - var(--top-bar-height) - var(--bottom-bar-height));
  }
</style>
