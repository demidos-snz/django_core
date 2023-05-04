<template>
  <v-scroll-y-transition mode="out-in">
    <v-card class="d-flex flex-row fill-height pa-3 ma-0">
      <v-col class="fill-height org-data">
        <validation-observer class="pa-0 fill-height" ref="OrgObserver" v-slot="{ invalid }">
          <fieldset class="fill-height rounded">
            <legend class="ml-3">{{ $t('organizations.organizationMainData.organization') }}</legend>
            <v-row class="top-row d-flex flex-column overflow-auto ma-0 flex-nowrap max-full-height">
              <v-col class="d-flex pb-0">
                <validation-provider name="Address" rules="" class="full-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('address', $event)"
                    :value="getLocalChanges('address')"
                    :label="$t('organizations.organization_address')"
                    :hint="$t('fieldHints.organization.organization_address')"
                    outlined
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="d-flex pb-0">
                <validation-provider name="Name" rules="required" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('name', $event)"
                    :value="getLocalChanges('name')"
                    :label="$t('organizations.organizationMainData.name')"
                    :hint="$t('fieldHints.organization.name')"
                    outlined
                    :error-messages="errors"
                    class="pr-2"
                  ></v-text-field>
                </validation-provider>
                <validation-provider name="ShortName" rules="required" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('shortName', $event)"
                    :value="getLocalChanges('shortName')"
                    :label="$t('organizations.organizationMainData.short_name')"
                    :hint="$t('fieldHints.organization.short_name')"
                    outlined
                    :error-messages="errors"
                    class="pl-2"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="d-flex pb-0">
                <validation-provider name="Prefix" rules="required" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('hrid', $event)"
                    :value="getLocalChanges('hrid')"
                    :label="$t('organizations.organizationMainData.prefix')"
                    :hint="$t('fieldHints.organization.prefix')"
                    outlined
                    readonly
                    :error-messages="errors"
                    class="pr-2"
                  ></v-text-field>
                </validation-provider>
                <validation-provider name="Email" rules="email" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('email', $event)"
                    :value="getLocalChanges('email')"
                    :label="$t('organizations.organizationMainData.email')"
                    :hint="$t('fieldHints.organization.email')"
                    outlined
                    :error-messages="errors"
                    class="pl-2"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="d-flex pb-0">
                <v-dialog v-model="contractDateModal" persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider name="ContractDate" rules="required" class="half-width" v-slot="{ errors }">
                      <v-text-field
                        class="pr-2"
                        :value="getLocalChanges('contractDate')"
                        :label="$t('organizations.organizationMainData.contract_start_date')"
                        :hint="$t('fieldHints.organization.contract_start_date')"
                        append-icon="mdi-calendar"
                        readonly
                        outlined
                        :error-messages="errors"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </validation-provider>
                  </template>
                  <v-date-picker
                    :value="changes.contractDate || selectedOrganization.contractDate"
                    @change="addContractDateChanges($event)"
                    color="primary"
                    header-color="grey darken-3"
                  />
                </v-dialog>
                <validation-provider
                  name="ContractDuration"
                  class="half-width"
                  rules="required|positive|min_value:1|max_value:100"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    @input="addChanges('contractDuration', $event)"
                    :value="getLocalChanges('contractDuration')"
                    :label="$t('organizations.organizationMainData.contract_duration')"
                    outlined
                    :error-messages="errors"
                    type="number"
                    class="pl-2"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="d-flex pb-0">
                <validation-provider name="Contract" rules="" class="full-width" v-slot="{ errors }">
                  <v-textarea
                    @input="addChanges('contract', $event)"
                    :value="getLocalChanges('contract')"
                    :label="$t('organizations.organizationMainData.contract')"
                    :hint="$t('fieldHints.organization.contract')"
                    outlined
                    :error-messages="errors"
                    rows="1"
                    auto-grow
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col class="d-flex pb-0">
                <validation-provider name="ExternalIpToIm" rules="ip" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('externalIpToIm', $event)"
                    :value="getLocalChanges('externalIpToIm')"
                    :label="$t('organizations.organizationMainData.external_ip_address')"
                    :hint="$t('fieldHints.organization.ip')"
                    outlined
                    :error-messages="errors"
                    class="pr-2"
                  ></v-text-field>
                </validation-provider>
                <validation-provider name="MonitoringMode" class="half-width" v-slot="{ errors }">
                  <v-autocomplete
                    :no-data-text="$t('main.no_data')"
                    @change="addChanges('monitoringMode', $event)"
                    :value="getLocalChanges('monitoringMode')"
                    :label="$t('organizations.organizationMainData.monitoring_mode')"
                    :hint="$t('fieldHints.organization.monitoring_mode')"
                    outlined
                    :error-messages="errors"
                    :items="monitoringModes()"
                    item-value="id"
                    item-text="name"
                    class="pl-2"
                  >
                  </v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col class="d-flex">
                <v-autocomplete
                  :no-data-text="$t('main.no_data')"
                  :allow-overflow="false"
                  deletable-chips
                  :return-object="true"
                  chips
                  small-chips
                  hide-details
                  :value="getLocalChanges('userIds')"
                  @change="addUserChanges($event)"
                  :items="userList"
                  item-text="surname"
                  item-value="id"
                  :label="$t('organizations.organizationMainData.users')"
                  multiple
                  outlined
                >
                  <template v-slot:item="data">
                    <v-list-item-content>{{ data.item.fullName }}</v-list-item-content>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip @click:close="removeUser(data.item.id)" :input-value="data.selected" close small>
                      <span>{{ data.item.fullName }}</span>
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col class="d-flex py-2 flex-row">
                <v-checkbox
                  class="ma-0"
                  @change="addChanges('isActive', $event)"
                  :input-value="getLocalChanges('isActive')"
                  hide-details
                  :label="$t('organizations.organizationMainData.active')"
                ></v-checkbox>
                <v-checkbox
                  class="ma-0 ml-4"
                  @change="addChanges('firstLineCm', $event)"
                  :input-value="getLocalChanges('firstLineCm')"
                  hide-details
                  :label="$t('organizations.organizationMainData.first_line_cm')"
                ></v-checkbox>
                <v-checkbox
                  class="ma-0 ml-4"
                  @change="addChanges('isOcii', $event)"
                  :input-value="getLocalChanges('isOcii')"
                  hide-details
                  :label="$t('organizations.organizationMainData.ocii')"
                ></v-checkbox>
              </v-col>
              <v-spacer class="fill-height"></v-spacer>
            </v-row>
            <v-divider></v-divider>
            <v-row class="bottom-row d-flex justify-space-between ma-0">
              <v-col class="d-flex flex-start text-left pa-0 ml-2" cols="auto">
                <p class="d-flex flex-column ma-0 mr-2 col-auto py-0 align-self-center">
                  <span>{{ $t('organizations.organizationMainData.created') }}:</span>
                  <span>{{ $t('organizations.organizationMainData.modified') }}:</span>
                  <span>{{ $t('organizations.organizationMainData.inactivated') }}:</span>
                </p>
                <p class="d-flex flex-column ma-0 col-auto py-0 align-self-center">
                  <span class="grey--text text--lighten-1 font-weight-light">
                    {{ selectedOrganization.created }}
                  </span>
                  <span class="grey--text text--lighten-1 font-weight-light">
                    {{ selectedOrganization.modified }}
                  </span>
                  <span class="grey--text text--lighten-1 font-weight-light">
                    {{ selectedOrganization.inactivated }}
                  </span>
                </p>
              </v-col>
              <v-col cols="auto" class="d-flex justify-end align-center">
                <v-tooltip top v-if="invalid">
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip v-bind="attrs" v-on="on" outlined color="red" class="mr-2">
                      <v-icon> mdi-alert </v-icon>
                    </v-chip>
                  </template>
                  <p>{{ $t('main.required_fields') }}</p>
                </v-tooltip>
                <v-btn color="success" outlined :disabled="!hasChanges || invalid" @click="saveOrganization">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </fieldset>
        </validation-observer>
      </v-col>
      <v-col class="fill-height ncircc-data org-data">
        <Ncircc />
      </v-col>
    </v-card>
  </v-scroll-y-transition>
</template>

<script>
  import { getMonitoringModes, getScopeTypes, getSubjectTypes, getDistrictTypes } from '@/constants/constants'
  import Ncircc from '@/components/Organizations/Ncircc'
  import validationMixin from '@/mixins/validationMixin'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { isEqual, xor, isEmpty, sortBy } from 'lodash'
  import { getChanges } from '@/utils'
  import Vue from 'vue'

  export default {
    name: 'OrganizationMainData',
    mixins: [validationMixin],
    components: {
      Ncircc,
    },
    data: () => ({
      changes: {},
      siemChanges: {},
      contractDateModal: false,
      monitoringModes: getMonitoringModes,
      scopeTypes: getScopeTypes,
      subjectTypes: getSubjectTypes,
      districtTypes: getDistrictTypes,
      sending: false,
    }),
    methods: {
      ...mapActions('organizations', ['updateOrganizationInstance']),
      addChanges(fieldName, eventData) {
        if (this.changes.hasOwnProperty(fieldName)) {
          if (isEqual(this.selectedOrganization[fieldName], eventData)) {
            return Vue.delete(this.changes, fieldName)
          }
        }

        Vue.set(this.changes, fieldName, eventData)
      },
      addUserChanges(eventData) {
        /*
          Selected users should be sorted by fullname,
          so it is required to return an object from v-autocomplete
          sort it and map to id list to define changes and send to backend
        */
        eventData = sortBy(eventData, 'fullName')
        eventData = eventData.map((item) => {
          return item.hasOwnProperty('id') ? item.id : item
        })
        const fieldName = 'userIds'
        if (this.changes.hasOwnProperty(fieldName)) {
          const diffs = xor(this.selectedOrganization[fieldName], eventData)
          if (diffs.length === 0) {
            return Vue.delete(this.changes, fieldName)
          }
        }

        Vue.set(this.changes, fieldName, eventData)
      },
      getLocalChanges(fieldName) {
        return getChanges(fieldName, this.changes, this.selectedOrganization)
      },
      async saveOrganization() {
        this.sending = true
        if (this.hasChanges) {
          const [error, response] = await this.updateOrganizationInstance({
            id: this.selectedOrganization.id,
            params: this.changes,
          })
          if (!error && response.status === 200) {
            Vue.set(this, 'changes', {})
          }
        }
        this.sending = false
      },
      removeUser(id) {
        const userIds = this.getLocalChanges('userIds')
        const newUserIds = userIds.filter((userId) => userId !== id)
        this.addUserChanges(newUserIds)
      },
      addContractDateChanges(eventData) {
        this.addChanges('contractDate', eventData)
        this.contractDateModal = false
      },
    },
    computed: {
      ...mapGetters('users', ['users']),
      ...mapGetters('organizations', ['selectedOrganization']),
      ...mapState('organizations', ['selectedOrganizationId']),
      userList() {
        const userList = Object.values(this.users)
        return sortBy(userList, 'fullName')
      },
      hasChanges() {
        return !isEmpty(this.changes)
      },
    },
    watch: {
      selectedOrganizationId() {
        this.$set(this, 'changes', {})
      },
    },
  }
</script>
<style lang="scss">
  .org-data {
    --bottom-row-height: 90px;

    .top-row {
      height: calc(100% - var(--bottom-row-height));
    }
    .bottom-row {
      height: var(--bottom-row-height);
    }
  }
</style>
