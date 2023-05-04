<template>
  <v-row class="ma-0 fill-height">
    <v-col class="fill-height">
      <v-card class="inc-tabledata-card fill-height">
        <v-tabs height="40" slider-size="1" color="white" grow :value="selectedTabIndex">
          <v-tab
            v-for="[tab, id] of Object.entries(incidentTabs)"
            :key="id"
            :disabled="[incidentTabs.ASSETS, incidentTabs.IOCS].includes(id)"
            @change="activeTab = id"
          >
            {{ $t(`incidents.incidentTableData.${tab.toLowerCase()}`) }}
            <EventSelectionDialog
              v-if="id === incidentTabs.EVENTS"
              :disabled="activeTab !== incidentTabs.EVENTS || !canCreateIncidentEvents(incident)"
              :organizationId="incident.organizationId"
              :incident="incident"
            />
            <AttachmentUploadDialog
              v-if="id === incidentTabs.FILES"
              :disabled="activeTab !== incidentTabs.FILES || !canAddAttachments"
              :incidentId="incident.id"
            />
            <AssetSelectionDialog
              v-if="id === incidentTabs.ASSETS"
              :disabled="activeTab !== incidentTabs.ASSETS || !canUpdateAffectedAssets(incident)"
              :incidentId="incident.id"
            />
            <IocSelectionDialog
              v-if="id === incidentTabs.IOCS"
              :disabled="activeTab !== incidentTabs.IOCS || !canUpdateIocs(incident)"
              :incidentId="incident.id"
            />
          </v-tab>
        </v-tabs>
        <v-tabs-items class="inc-tabledata-tableitems" :value="activeTab">
          <v-tab-item :value="incidentTabs.EVENTS">
            <template v-if="p9s.canRead(ruleEntities.EVENTS)">
              <template v-if="otherEvents.length > 0 || mpSiemEvents.length > 0">
                <v-expansion-panels multiple accordion class="overflow-auto fill-height">
                  <v-expansion-panel v-if="mpSiemEvents.length > 0">
                    <v-expansion-panel-header class="pb-0"> MP_SIEM </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-simple-table fixed-header class="fill-height">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.id') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.name') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.date') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.source') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.sourceIp') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.destination') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.destinationIp') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.severity') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.description') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.actions') }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="event in sort(mpSiemEvents, 'event_id_from_siem', 'desc')" :key="event.id">
                              <td>{{ event.data.key }}</td>
                              <td>
                                <v-tooltip top color="grey darken-3">
                                  <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="d-inline-block text-truncate max-width-30c">
                                      {{ event.name }}
                                    </span>
                                  </template>
                                  <span class="d-flex text-break max-width-200">{{ event.name }}</span>
                                </v-tooltip>
                              </td>
                              <td>{{ event.deviceReceiptTime }}</td>
                              <td>{{ event.sourceHostName }}</td>
                              <td>{{ event.sourceAddress }}</td>
                              <td>{{ event.destinationHostName }}</td>
                              <td>{{ event.destinationAddress }}</td>
                              <td>{{ event.severity }}</td>
                              <td>
                                <v-tooltip top color="grey darken-3">
                                  <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="d-inline-block text-truncate max-width-30c">
                                      {{ event.description }}
                                    </span>
                                  </template>
                                  <span class="d-flex text-break max-width-200">{{ event.description }}</span>
                                </v-tooltip>
                              </td>
                              <td>
                                <v-btn
                                  color="red"
                                  :disabled="!p9s.canDelete(ruleEntities.EVENTS)"
                                  icon
                                  @click="deleteEventItem(event.id)"
                                >
                                  <v-icon> mdi-delete-outline </v-icon>
                                </v-btn>
                                <EventNestedDataModal :incident="incident" :event="event" :incidentId="incident.id" />
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel v-if="otherEvents.length > 0">
                    <v-expansion-panel-header class="pb-0"> ViPNet_IDS </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-simple-table fixed-header class="fill-height">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.date') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.sensor') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.sid') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.node') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.source') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.destination') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.event') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.object') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.domain') }}
                              </th>
                              <th>
                                {{ $t('incidents.incidentTableData.eventsTab.actions') }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="event in sort(otherEvents, 'event_id_from_siem', 'desc')" :key="event.id">
                              <td>{{ event.data.deviceReceiptTime }}</td>
                              <td>{{ (event.sensor && event.sensor.name) || '-' }}</td>
                              <td>{{ event.data.sid }}</td>
                              <td>{{ event.data.hostName }}</td>
                              <td>{{ event.data.sourceAddress }}</td>
                              <td>{{ event.data.destinationAddress }}</td>
                              <td>
                                <v-tooltip top color="grey darken-3">
                                  <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="d-inline-block text-truncate max-width-30c">
                                      {{ event.data.name }}
                                    </span>
                                  </template>
                                  <span class="d-flex text-break max-width-200">{{ event.data.name }}</span>
                                </v-tooltip>
                              </td>
                              <td>{{ event.data.object }}</td>
                              <td>{{ event.data.destinationNtDomain }}</td>
                              <td>
                                <v-btn
                                  color="red"
                                  :disabled="!p9s.canDelete(ruleEntities.EVENTS)"
                                  icon
                                  @click="deleteEventItem(event.id)"
                                >
                                  <v-icon> mdi-delete-outline </v-icon>
                                </v-btn>
                                <EventDataModal :event="event" />
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </template>
              <div
                v-else
                class="d-flex fill-height justify-center align-center title grey--text text--lighten-1 font-weight-light"
              >
                {{ $t('incidents.incidentTableData.eventsTab.no_events') }}
              </div>
            </template>
            <template v-else>
              <div
                class="d-flex fill-height justify-center align-center title grey--text text--lighten-1 font-weight-light"
              >
                {{ $t('readPermissions.cant_read_events') }}
              </div>
            </template>
          </v-tab-item>
          <v-tab-item :value="incidentTabs.HISTORY">
            <v-simple-table fixed-header class="fill-height">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.historyTab.date') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.historyTab.event') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.historyTab.operator') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="action in incident.historyActions" :key="action.id">
                    <td>{{ action.createdDatetime }}</td>
                    <td class="text-break">{{ action.text }}</td>
                    <td>{{ action.user.fullName }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item :value="incidentTabs.COMMENTS">
            <div class="incidents-comments fill-height">
              <v-row class="my-0 px-3 py-2 d-flex flex-column">
                <v-col class="message-history-col" ref="msgList">
                  <v-timeline class="pb-1 pt-0">
                    <v-timeline-item
                      class="pb-1"
                      color="blue darken-4"
                      v-for="comment in incident.comments"
                      :key="comment.id"
                      :left="comment.userId !== operator.id"
                      :right="comment.userId === operator.id"
                      small
                    >
                      <span slot="opposite">{{ comment.createdDatetime }}</span>
                      <v-card outlined>
                        <v-card-title
                          class="h-3 pb-2 pt-1"
                          :class="comment.userId === operator.id ? 'justify-space-between' : 'justify-start'"
                        >
                          <v-btn
                            color="red"
                            icon
                            x-small
                            v-if="canDeleteComment(comment)"
                            @click="deleteCommentItem(comment.id)"
                          >
                            <v-icon> mdi-close-circle </v-icon>
                          </v-btn>
                          <span class="subtitle-2">
                            {{ comment.user.fullName }}
                          </span>
                        </v-card-title>
                        <v-card-text class="pb-2 text-left">
                          <div v-for="(text, index) in comment.text.split('\n')" :key="index">
                            {{ text }}
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </v-col>
                <v-col class="message-input-col">
                  <v-textarea
                    outlined
                    rows="1"
                    no-resize
                    v-model="commentText"
                    hide-details
                    :disabled="!canAddComments"
                    :append-outer-icon="'mdi-send'"
                    clear-icon="mdi-close-circle"
                    class="text-wrap"
                    :label="$t('incidents.incidentTableData.commentsTab.message')"
                    type="text"
                    @click:append-outer="sendComment"
                    @keyup.ctrl.enter="sendComment"
                    @click:clear="clearComment"
                    :placeholder="$t('incidents.incidentTableData.commentsTab.ctrlEnter')"
                  ></v-textarea>
                </v-col>
              </v-row>
            </div>
          </v-tab-item>
          <v-tab-item :value="incidentTabs.FILES">
            <v-simple-table fixed-header class="fill-height">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.filesTab.date') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.filesTab.comment') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.filesTab.file') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.filesTab.operator') }}
                    </th>
                    <th>
                      {{ $t('incidents.incidentTableData.filesTab.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="attachment in incident.attachments" :key="attachment.id">
                    <td>{{ attachment.createdDatetime }}</td>
                    <td class="text-break">{{ attachment.description }}</td>
                    <td class="text-break">{{ attachment.name }}</td>
                    <td>{{ attachment.user.fullName }}</td>
                    <td>
                      <v-btn
                        color="red"
                        :disabled="!canDeleteAttachment(attachment)"
                        icon
                        @click="deleteFileItem(attachment.id)"
                      >
                        <v-icon> mdi-delete-outline </v-icon>
                      </v-btn>
                      <v-btn color="green" icon download target="_blank" :href="attachment.file">
                        <v-icon> mdi-download </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item :value="incidentTabs.ASSETS">
            <v-simple-table fixed-header class="fill-height">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.assetsTab.segment') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.assetsTab.ip') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.assetsTab.host') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in incident.affectedActives" :key="activity.id">
                    <td>{{ activity.segment }}</td>
                    <td>{{ activity.ipResource }}</td>
                    <td>{{ activity.hostname }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item :value="incidentTabs.IOCS">
            <v-simple-table fixed-header class="fill-height">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.iocsTab.hostname') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.iocsTab.hash_resource') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.iocsTab.ip') }}
                    </th>
                    <th class="text-left">
                      {{ $t('incidents.incidentTableData.iocsTab.url') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ioc in incident.iocs" :key="ioc.id">
                    <td>{{ ioc.hostname }}</td>
                    <td>{{ ioc.hashResource }}</td>
                    <td>{{ ioc.ipResource }}</td>
                    <td>{{ ioc.url }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { isNil, orderBy } from 'lodash'
  import EventSelectionDialog from '@/components/dialogs/EventSelectionDialog'
  import AttachmentUploadDialog from '@/components/dialogs/AttachmentUploadDialog'
  import AssetSelectionDialog from '@/components/dialogs/AssetSelectionDialog'
  import IocSelectionDialog from '@/components/dialogs/IocSelectionDialog'
  import EventDataModal from '@/components/dialogs/EventDataModal'
  import EventNestedDataModal from '@/components/dialogs/EventNestedDataModal'
  import rightsMixin from '@/mixins/rightsMixin'
  import { RULE_ENTITIES, SENSOR_TYPES, INCIDENT_TABS } from '@/constants/enums'

  export default {
    components: {
      EventSelectionDialog,
      AttachmentUploadDialog,
      AssetSelectionDialog,
      IocSelectionDialog,
      EventDataModal,
      EventNestedDataModal,
    },
    name: 'IncidentTableData',
    props: {
      incident: {
        type: Object,
        required: true,
      },
    },
    mixins: [rightsMixin],
    data: () => ({
      activeTab: INCIDENT_TABS.EVENTS,
      commentText: '',
      sort: orderBy,
      ruleEntities: RULE_ENTITIES,
      incidentTabs: INCIDENT_TABS,
    }),
    methods: {
      ...mapActions('incidents', ['createComment', 'deleteComment', 'deleteAttachment']),
      ...mapActions('events', ['removeIncidentEvent']),

      deleteEventItem(id) {
        this.removeIncidentEvent(id)
      },

      deleteFileItem(id) {
        this.deleteAttachment(id)
      },

      sendComment() {
        this.createComment(this.commentText)
        this.clearComment()
      },

      deleteCommentItem(commentId) {
        this.deleteComment(commentId)
      },

      clearComment() {
        this.$set(this, 'commentText', '')
      },

      scrollMsgContainer() {
        setTimeout(() => {
          const container = this.$refs.msgList
          if (!isNil(container)) {
            container.scrollTop = container.scrollHeight * 2
          }
        }, 100)
      },
    },
    computed: {
      ...mapGetters('operator', ['operator']),
      ...mapGetters('permissions', ['p9s']),

      mpSiemEvents() {
        return this.incident.events.filter((item) => {
          const sensor = item.sensor
          return sensor && sensor.typeSensor === SENSOR_TYPES.MP_SIEM
        })
      },

      otherEvents() {
        return this.incident.events.filter((item) => {
          const sensor = item.sensor
          if (sensor) {
            return sensor.typeSensor !== SENSOR_TYPES.MP_SIEM
          } else {
            return true
          }
        })
      },

      selectedTabIndex() {
        return Object.values(this.incidentTabs).findIndex((tab) => tab === this.activeTab)
      },
    },
    watch: {
      'incident.comments'() {
        this.scrollMsgContainer()
      },
      'activeTab'(newVal) {
        newVal !== this.incidentTabs.COMMENTS || this.scrollMsgContainer()
      },
    },
  }
</script>
<style lang="scss">
  .inc-tabledata-card {
    border: 1px solid #fff !important;

    .inc-tabledata-tableitems {
      height: calc(100% - 40px);
    }
    .v-window__container,
    .v-window-item,
    .v-data-table__wrapper {
      height: 100%;
    }
  }
  .incidents-comments {
    .message-input-col {
      position: absolute;
      bottom: 0;
      height: 80px;
    }
    .message-history-col {
      position: absolute;
      bottom: 80px;
      top: 0;
      overflow-y: auto;
    }
  }
</style>
