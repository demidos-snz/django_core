<template>
  <v-row class="ma-0 fill-height incident-main-data">
    <div :class="[canReadNcircc ? 'side-col-short' : 'side-col-long', 'fill-height pa-3']">
      <v-card elevation="24" class="fill-height">
        <fieldset class="main-info-fieldset fill-height">
          <legend class="ml-3">{{ $t('incidents.incidentMainData.general') }}</legend>
          <v-col class="d-flex flex-column overflow-auto max-full-height">
            <v-row>
              <v-col v-if="p9s.canRead(ruleEntities.TYPE)">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :value="incident.typeIncident"
                  @change="setTypeIncident"
                  :items="getIncidentTypes()"
                  item-value="id"
                  item-text="name"
                  :label="$t('incidents.incidentMainData.type')"
                  outlined
                  :disabled="!p9s.canUpdate(ruleEntities.TYPE)"
                  dense
                  hide-details
                  full-width
                >
                </v-autocomplete>
              </v-col>
              <v-col v-else>
                <v-chip class="alert-container container" color="orange" label outlined>
                  {{ $t('readPermissions.cant_read_type') }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="p9s.canRead(ruleEntities.SEVERITY)" class="d-flex">
                <v-col class="pa-0 align-center d-flex" cols="4">
                  <span>
                    {{ $t('incidents.incidentMainData.severity_level') }}
                  </span>
                </v-col>
                <v-col class="pa-0 align-center d-flex" cols="auto">
                  <v-menu open-on-click bottom offset-y v-if="p9s.canUpdate(ruleEntities.SEVERITY)">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn :color="incident.severityLevel.color" outlined v-bind="attrs" v-on="on">
                        {{ incident.severityLevel.name }}
                        <v-icon class="ml-2">mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list outlined>
                      <v-list-item v-for="level in severityLevels" :key="level.name">
                        <v-btn small outlined :color="level.color" @click="setSeverityLevel(level.id)">
                          {{ level.name }}
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn v-else :color="incident.severityLevel.color" outlined>
                    {{ incident.severityLevel.name }}
                  </v-btn>
                </v-col>
              </v-col>
              <v-col class="align-center d-flex" v-else>
                <v-chip class="alert-container container" color="orange" label outlined>
                  {{ $t('readPermissions.cant_read_severity') }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row v-if="incident.verdict">
              <v-col v-if="p9s.canRead(ruleEntities.STATUS)" class="d-flex">
                <v-col class="pa-0 align-center d-flex" cols="4">
                  <span>
                    {{ $t('incidents.incidentMainData.verdict') }}
                  </span>
                </v-col>
                <v-col class="pa-0 align-center d-flex" cols="auto">
                  <v-btn :color="incident.verdict.color" outlined>
                    {{ incident.verdict.name }}
                  </v-btn>
                  <v-tooltip right v-if="incident.verdictId === verdictTypes.FALSE_POSITIVE">
                    <template v-slot:activator="{ on }">
                      <v-btn icon class="ml-2" v-on="on">
                        <v-icon color="grey">mdi-help-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>
                      {{ $t('incidents.incidentMainData.reason') }}:
                      {{ incident.verdictReason ? incident.verdictReason.text : '-' }}
                    </span>
                  </v-tooltip>
                </v-col>
              </v-col>
              <v-col class="align-center d-flex" v-else>
                <v-chip class="alert-container container" color="orange" label outlined>
                  {{ $t('readPermissions.cant_read_verdict') }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="p9s.canRead(ruleEntities.DESCRIPTION)">
                <v-textarea
                  hide-details
                  :readonly="!p9s.canUpdate(ruleEntities.DESCRIPTION)"
                  filled
                  outlined
                  :rows="incident.verdict ? '5' : '7'"
                  name="incident-description"
                  :value="incident.description"
                  :label="$t('incidents.incidentMainData.description')"
                  @change="setDescriptionIncident"
                ></v-textarea>
              </v-col>
              <v-col v-else>
                <v-chip class="alert-container container" color="orange" label outlined>
                  {{ $t('readPermissions.cant_read_description') }}
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
        </fieldset>
      </v-card>
    </div>
    <div :class="[canReadNcircc ? 'users-col-short' : 'users-col-long', 'fill-height pa-3']">
      <v-card elevation="24" class="fill-height">
        <fieldset class="place-fieldset">
          <legend class="ml-3">{{ $t('incidents.incidentMainData.location') }}</legend>
          <v-col class="d-flex flex-column max-full-height">
            <v-row class="px-3">
              <v-col class="pa-0 pb-3" cols="3" lg="4" md="5">
                <span>
                  {{ $t('incidents.incidentMainData.segments') }}
                </span>
              </v-col>
              <v-col class="d-flex pa-0 ma-0 text-truncate">
                <v-col cols="auto" class="d-flex pa-0 ma-0 text-truncate segments-col">
                  <v-chip v-for="item in incident.segments.slice(0, 1)" :key="item.id" class="mr-2" label small>
                    <span class="d-inline-block text-truncate">
                      {{ item.name }}
                    </span>
                  </v-chip>
                </v-col>
                <v-col cols="auto" class="d-flex pa-0 ma-0 width-50">
                  <v-tooltip right color="grey darken-3" v-if="incident.segments.length > 1">
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip label small class="justify-center full-width" v-bind="attrs" v-on="on">
                        <span> + {{ incident.segments.length - 1 }} </span>
                      </v-chip>
                    </template>
                    <div class="d-flex flex-wrap max-width-400">
                      <v-chip v-for="item in incident.segments.slice(1)" :key="item.id" class="my-1 mr-2" label small>
                        <span class="tooltip-data max-width-25c">
                          {{ item.name }}
                        </span>
                      </v-chip>
                    </div>
                  </v-tooltip>
                </v-col>
              </v-col>
            </v-row>
            <v-row class="px-3">
              <v-col class="pa-0 pb-3" cols="3" lg="4" md="5">
                <span>
                  {{ $t('incidents.incidentMainData.sensors') }}
                </span>
              </v-col>
              <v-col class="d-flex pa-0 ma-0 text-truncate">
                <v-col cols="auto" class="d-flex pa-0 ma-0 text-truncate sensors-col">
                  <v-chip v-for="item in incident.sensors.slice(0, 1)" :key="item.id" class="mr-2" label small>
                    <span class="d-inline-block text-truncate">
                      {{ item.name }}
                    </span>
                  </v-chip>
                </v-col>
                <v-col cols="auto" class="d-flex pa-0 ma-0 width-50">
                  <v-tooltip right color="grey darken-3" v-if="incident.sensors.length > 1">
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip label small class="justify-center full-width">
                        <span v-bind="attrs" v-on="on"> + {{ incident.sensors.length - 1 }} </span>
                      </v-chip>
                    </template>
                    <div class="d-flex flex-wrap sensors-tooltip">
                      <v-chip v-for="item in incident.sensors.slice(1)" :key="item.id" class="my-1 mr-2" label small>
                        <span class="tooltip-data max-width-25c">
                          {{ item.name }}
                        </span>
                      </v-chip>
                    </div>
                  </v-tooltip>
                </v-col>
              </v-col>
            </v-row>
            <v-spacer></v-spacer>
          </v-col>
        </fieldset>
        <fieldset class="users-fieldset">
          <legend class="ml-3">{{ $t('incidents.incidentMainData.users') }}</legend>
          <v-col class="d-flex flex-column max-full-height fill-height pa-0 overflow-auto">
            <v-col>
              <v-tooltip bottom color="grey darken-3" :disabled="!tooltipStates.author">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    @mouseover="setUsersTooltipState('author', $event)"
                    class="author-field"
                    :label="$t('incidents.incidentMainData.author')"
                    :value="incident.author.fullName"
                    outlined
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  >
                  </v-text-field>
                </template>
                <span class="tooltip-data max-width-360">
                  {{ incident.author.fullName }}
                </span>
              </v-tooltip>
            </v-col>
            <v-col v-if="p9s.canRead(ruleEntities.OPERATOR)">
              <v-tooltip bottom color="grey darken-3" :disabled="!tooltipStates.author">
                <template v-slot:activator="{ on, attrs }">
                  <v-autocomplete
                    @mouseover="setUsersTooltipState('assigned', $event)"
                    :label="$t('incidents.incidentMainData.operator')"
                    :no-data-text="$t('main.no_data')"
                    :allow-overflow="false"
                    :readonly="!p9s.canUpdate(ruleEntities.OPERATOR)"
                    :value="incident.assignedId"
                    @change="setIncidentOperator"
                    :items="incident.availableOperators"
                    :placeholder="incident.assignedId ? $t('main.hidden_user') : ''"
                    item-text="fullName"
                    item-value="id"
                    :multiple="false"
                    hide-details
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  >
                    <template v-slot:item="data">
                      <v-list-item-content>{{ data.item.fullName }}</v-list-item-content>
                    </template>
                  </v-autocomplete>
                </template>
                <span class="tooltip-data max-width-360">
                  {{ incident.author.fullName }}
                </span>
              </v-tooltip>
            </v-col>
            <v-col class="pa-0 pb-3 align-center d-flex" v-else>
              <v-chip class="alert-container container" outlined label color="orange">
                {{ $t('readPermissions.cant_read_operator') }}
              </v-chip>
            </v-col>
            <v-col v-if="p9s.canRead(ruleEntities.CM_LINE)">
              <v-chip outlined label class="text-uppercase">
                {{ $t('incidents.incidentMainData.line') }}: {{ incident.cmLine }}
              </v-chip>
              <v-dialog v-if="incident.cmLine === cmLines.FIRST_LINE" v-model="cmLineConfirmDialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="ml-3"
                    :disabled="!p9s.canUpdate(ruleEntities.CM_LINE)"
                    outlined
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t('incidents.incidentMainData.transfer') }}
                  </v-btn>
                </template>
                <v-card outlined>
                  <v-card-title class="headline">
                    {{ $t('incidents.incidentMainData.transfer') }}
                  </v-card-title>
                  <v-card-text class="py-2">
                    <p class="word-break text-center">
                      {{ $t('incidents.incidentMainData.transfer_confirmation') }}
                    </p>
                  </v-card-text>
                  <v-card-actions class="pb-2">
                    <v-spacer></v-spacer>
                    <v-btn color="red" outlined @click="cmLineConfirmDialog = false"> {{ $t('main.no') }} </v-btn>
                    <v-btn color="green" outlined @click="changeIncidentLine"> {{ $t('main.yes') }} </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col class="pa-0 pb-3 align-center d-flex" v-else>
              <v-chip outlined label color="orange" class="alert-container container">
                {{ $t('readPermissions.cant_read_cm_line') }}
              </v-chip>
            </v-col>
            <v-spacer class="fill-height"></v-spacer>
          </v-col>
        </fieldset>
      </v-card>
    </div>
    <div v-if="canReadNcircc" class="ncircc-col fill-height pa-3">
      <v-card elevation="24" class="fill-height">
        <NcirccFieldset :incident="incident" />
      </v-card>
    </div>
    <div :class="[canReadNcircc ? 'side-col-short' : 'side-col-long', 'fill-height pa-3']">
      <v-card elevation="24" class="fill-height">
        <fieldset class="works-fieldset fill-height">
          <legend class="ml-3">{{ $t('incidents.incidentMainData.works') }}</legend>
          <v-tabs height="30" slider-size="1" v-model="activeTab" class="px-2" hide-slider>
            <v-tab>
              {{ $t('incidents.incidentMainData.recommendations') }}
              <RecommendationDialog
                :incident="incident"
                :disabled="activeTab !== 0 || !p9s.canUpdate(ruleEntities.RECOMMENDATIONS)"
              />
            </v-tab>
            <v-tab>
              {{ $t('incidents.incidentMainData.taken_actions') }}
              <TakenActionDialog
                :incident="incident"
                :disabled="activeTab !== 1 || !p9s.canUpdate(ruleEntities.ACTIONS_TAKEN)"
              />
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="activeTab" class="mt-2 works-fieldset-data">
            <v-tab-item key="recommendations">
              <v-card class="px-2 elevation-0 fill-height">
                <v-row class="mt-2" v-if="p9s.canRead(ruleEntities.RECOMMENDATIONS)">
                  <v-col class="mx-2">
                    <v-container v-if="!incident.hasRecommendations()" class="fill-height justify-center" fluid>
                      <p>
                        {{ $t('incidents.incidentMainData.no_recommendations') }}
                      </p>
                    </v-container>
                    <draggable
                      v-model="draggableRecommendations"
                      draggable=".drag-item"
                      handle=".drag-icon"
                      :force-fallback="true"
                    >
                      <transition-group>
                        <div
                          class="drag-item"
                          v-for="recommendation in incident.recommendations"
                          :key="recommendation.id"
                        >
                          <v-tooltip
                            bottom
                            color="grey darken-3"
                            :disabled="!tooltipStates.recommendations[recommendation.id]"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                @mouseover="setTooltipState(recommendation.id, tooltipTypes.RECOMMENDATIONS, $event)"
                                hide-details
                                class="rec-item-field"
                                :key="recommendation.id"
                                :label="recommendation.user.fullName"
                                :value="recommendation.text"
                                readonly
                                outlined
                                v-bind="attrs"
                                v-on="on"
                              >
                                <template v-slot:prepend v-if="incident.recommendations.length > 1">
                                  <v-btn
                                    small
                                    :ripple="false"
                                    class="drag-icon"
                                    v-if="
                                      incident.recommendations.length > 1 && p9s.canUpdate(ruleEntities.RECOMMENDATIONS)
                                    "
                                    icon
                                  >
                                    <v-icon small>mdi-arrow-up-down</v-icon>
                                  </v-btn>
                                </template>
                                <template v-slot:append>
                                  <v-btn
                                    :disabled="!canDeleteRecommendation(recommendation)"
                                    @click="removeRecommendation(recommendation.id)"
                                    icon
                                  >
                                    <v-icon>mdi-close</v-icon>
                                  </v-btn>
                                </template>
                                <template v-slot:append-outer>
                                  <v-checkbox
                                    @click="changeRecommendationConfirmation(recommendation)"
                                    :disabled="!p9s.canUpdate(ruleEntities.RECOMMENDATION_CONFIRMATION)"
                                    :input-value="recommendation.confirmed"
                                    hide-details
                                  ></v-checkbox>
                                </template>
                              </v-text-field>
                            </template>
                            <span class="tooltip-data max-width-360">
                              {{ recommendation.text }}
                            </span>
                          </v-tooltip>
                        </div>
                      </transition-group>
                    </draggable>
                  </v-col>
                </v-row>
                <v-row class="mt-2" v-else>
                  <v-chip label outlined color="orange" class="alert-container container mx-2">
                    {{ $t('readPermissions.cant_read_recommendations') }}
                  </v-chip>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item key="actions">
              <v-card class="px-2 elevation-0 fill-height">
                <v-row class="mt-2" v-if="p9s.canRead(ruleEntities.ACTIONS_TAKEN)">
                  <v-col class="mx-2">
                    <v-container v-if="!incident.hasActionsTaken()" class="fill-height justify-center" fluid>
                      <p>
                        {{ $t('incidents.incidentMainData.no_actions') }}
                      </p>
                    </v-container>
                    <draggable
                      v-model="draggableActionsTaken"
                      draggable=".drag-item"
                      handle=".drag-icon"
                      :force-fallback="true"
                    >
                      <transition-group>
                        <div class="drag-item" v-for="actionTaken in incident.actionsTaken" :key="actionTaken.id">
                          <v-tooltip
                            bottom
                            color="grey darken-3"
                            :disabled="!tooltipStates.actionsTaken[actionTaken.id]"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                hide-details
                                @mouseover="setTooltipState(actionTaken.id, tooltipTypes.ACTIONS_TAKEN, $event)"
                                class="rec-item-field"
                                :key="actionTaken.id"
                                :label="actionTaken.user.fullName"
                                :value="actionTaken.text"
                                readonly
                                outlined
                                v-bind="attrs"
                                v-on="on"
                              >
                                <template v-slot:prepend v-if="incident.actionsTaken.length > 1">
                                  <v-btn
                                    small
                                    :ripple="false"
                                    class="drag-icon"
                                    v-if="p9s.canUpdate(ruleEntities.ACTIONS_TAKEN)"
                                    icon
                                  >
                                    <v-icon small>mdi-arrow-up-down</v-icon>
                                  </v-btn>
                                </template>
                                <template v-slot:append>
                                  <v-btn
                                    v-if="p9s.canDelete(ruleEntities.ACTIONS_TAKEN)"
                                    @click="removeActionTaken(actionTaken.id)"
                                    icon
                                  >
                                    <v-icon>mdi-close</v-icon>
                                  </v-btn>
                                </template>
                              </v-text-field>
                            </template>
                            <span class="tooltip-data max-width-360">
                              {{ actionTaken.text }}
                            </span>
                          </v-tooltip>
                        </div>
                      </transition-group>
                    </draggable>
                  </v-col>
                </v-row>
                <v-row class="mt-2" v-else>
                  <v-chip label outlined color="orange" class="alert-container container mx-2">
                    {{ $t('readPermissions.cant_read_actions_taken') }}
                  </v-chip>
                </v-row>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </fieldset>
      </v-card>
    </div>
  </v-row>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import RecommendationDialog from '@/components/dialogs/RecommendationDialog'
  import TakenActionDialog from '@/components/dialogs/TakenActionDialog'
  import rightsMixin from '@/mixins/rightsMixin'
  import { getIncidentTypes, getSeverityLevels } from '@/constants/constants'
  import Incident from '@/store/models/incident'
  import { CM_LINE, RULE_ENTITIES, TOOLTIP_TYPES, VERDICT } from '@/constants/enums'
  import draggable from 'vuedraggable'
  import NcirccFieldset from '@/components/Incidents/Ncircc/NcirccFieldset'

  export default {
    name: 'IncidentMainData',
    props: {
      incident: {
        type: Incident,
        required: true,
      },
    },
    components: {
      NcirccFieldset,
      RecommendationDialog,
      TakenActionDialog,
      draggable,
    },
    mixins: [rightsMixin],
    data: () => ({
      tooltipStates: {
        recommendations: {},
        actionsTaken: {},
        author: false,
        assigned: false,
      },
      cmLineConfirmDialog: false,
      activeTab: null,
      ruleEntities: RULE_ENTITIES,
      incidentTypes: getIncidentTypes,
      cmLines: CM_LINE,
      tooltipTypes: TOOLTIP_TYPES,
      verdictTypes: VERDICT,
    }),

    methods: {
      ...mapActions('incidents', [
        'reorderRecommendations',
        'reorderActionsTaken',
        'deleteRecommendation',
        'confirmRecommendation',
        'deleteActionTaken',
        'updateIncident',
      ]),
      setTooltipState(id, type, event) {
        const target = event.target
        const showTooltip = target.scrollWidth > target.clientWidth
        this.$set(this.tooltipStates[type], id, showTooltip)
      },
      setUsersTooltipState(type, event) {
        const target = event.target
        const showTooltip = target.scrollWidth > target.clientWidth
        this.$set(this.tooltipStates, 'author', showTooltip)
      },
      changeRecommendationConfirmation(recommendation) {
        const params = {
          recommendationId: recommendation.id,
          confirmed: !recommendation.confirmed,
        }
        this.confirmRecommendation(params)
      },
      setIncidentOperator(assignedId) {
        this.updateIncident({ assignedId })
      },
      setTypeIncident(typeIncident) {
        this.updateIncident({ typeIncident })
      },
      setDescriptionIncident(description) {
        this.updateIncident({ description })
      },
      setSeverityLevel(severityLevel) {
        this.updateIncident({ severityLevel })
      },
      changeIncidentLine() {
        this.$set(this, 'cmLineConfirmDialog', false)
        this.updateIncident({ cmLine: CM_LINE.SECOND_LINE })
      },
      removeRecommendation(id) {
        this.deleteRecommendation(id)
      },
      removeActionTaken(id) {
        this.deleteActionTaken(id)
      },
    },

    computed: {
      ...mapGetters('permissions', ['p9s']),
      ...mapGetters('operator', ['operator']),
      severityLevels() {
        return Object.values(getSeverityLevels())
      },

      draggableRecommendations: {
        get() {
          return this.incident.recommendations.map((rec) => rec.id)
        },
        set(newOrder) {
          this.reorderRecommendations(newOrder)
        },
      },

      draggableActionsTaken: {
        get() {
          return this.incident.actionsTaken.map((action) => action.id)
        },
        set(newOrder) {
          this.reorderActionsTaken(newOrder)
        },
      },

      canReadNcircc() {
        return this.canReadNcirccData(this.incident)
      },
    },
  }
</script>
<style lang="scss">
  .incident-main-data {
    --place-fieldset-height: 100px;
    --ncircc-fieldset-height: 160px;
    --users-col-short-width: 350px;
    --users-col-long-width: 450px;
    --ncircc-col-width: 350px;

    .users-col-long {
      width: var(--users-col-long-width);
    }

    .users-col-short {
      width: var(--users-col-short-width);
    }

    .ncircc-col {
      width: var(--ncircc-col-width);
    }

    .side-col-short {
      width: calc((100% - var(--users-col-short-width) - var(--ncircc-col-width)) / 2);
    }

    .side-col-long {
      width: calc((100% - var(--users-col-long-width)) / 2);
    }

    .users-fieldset {
      height: calc(100% - var(--place-fieldset-height));

      .users-row {
        flex-direction: column;
      }
    }

    .place-fieldset {
      height: var(--place-fieldset-height);

      .segments-col,
      .sensors-col {
        width: calc(100% - 50px);
      }
      .sensors-tooltip {
        max-width: 400px;
        opacity: 1 !important;
      }
    }

    .works-fieldset {
      min-width: 100%;

      .works-fieldset-data {
        height: calc(100% - 38px);
        overflow-y: auto;
      }
      .v-tab--active {
        border: 1px solid #fff;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
      }
    }

    .rec-item-field {
      padding-bottom: 15px !important;

      .v-input__prepend-inner {
        margin-top: 15px;
      }

      .v-input__append-inner {
        margin-top: 0 !important;
        align-self: center;
      }
      .v-input__append-outer {
        margin-top: -3px;
      }
    }

    .tooltip-data {
      display: inline-block;
      word-break: break-word;
    }

    .sortable-drag {
      > .v-input {
        > .v-input__control:first-of-type {
          > .v-input__slot {
            background: black;
          }
        }
      }
    }
  }
</style>
