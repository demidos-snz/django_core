<template>
  <validation-observer ref="observer">
    <v-row class="pa-0 fill-height">
      <v-col cols="4">
        <v-card elevation="0" class="fill-height">
          <fieldset>
            <legend class="ml-3">{{ $t('ncircc.notification.general_information') }}</legend>
            <validation-provider name="category" rules="required" v-slot="{ errors }">
              <SimpleAutocomplete
                :label="$t('ncircc.notification.notification_category')"
                disabled
                :items="categories"
                v-model="ncirccManager.category"
                :error-messages="errors"
              />
            </validation-provider>
            <validation-provider name="type" rules="required" v-slot="{ errors }">
              <SimpleAutocomplete
                :label="$t('ncircc.notification.incident_type')"
                :error-messages="errors"
                :items="types"
                v-model="ncirccManager['type']"
                :disabled="ncirccManager.submitted"
              />
            </validation-provider>
            <validation-provider name="company" rules="required" v-slot="{ errors }">
              <TextField
                :label="$t('ncircc.notification.company')"
                :disabled="!needExtraData"
                v-model="ncirccManager['company']"
                :error-messages="errors"
              />
            </validation-provider>
            <validation-provider name="ownername" rules="required" v-slot="{ errors }">
              <TextField
                :label="$t('ncircc.notification.ownername')"
                :disabled="ncirccManager.submitted"
                v-model="ncirccManager['ownername']"
                :error-messages="errors"
              />
            </validation-provider>
            <validation-provider name="activitystatus" rules="required" v-slot="{ errors }">
              <SimpleAutocomplete
                :label="$t('ncircc.notification.response_status')"
                :items="statuses"
                v-model="ncirccManager['activitystatus']"
                :error-messages="errors"
                :disabled="!needExtraData"
              />
            </validation-provider>
            <Checkbox
              :disabled="ncirccManager.submitted"
              :label="$t('ncircc.notification.ncircc_assistance_required')"
              v-model="ncirccManager['assistance']"
            />
            <DatePicker
              :disabled="ncirccManager.submitted"
              v-model="ncirccManager['detecttime']"
              :label="$t('ncircc.notification.detecttime')"
            />
            <DatePicker
              :disabled="!needExtraData"
              v-model="ncirccManager['endtime']"
              :label="$t('ncircc.notification.endtime')"
            />
            <validation-provider name="eventdescription" rules="required" v-slot="{ errors }">
              <TextArea
                :disabled="!needExtraData"
                v-model="ncirccManager['eventdescription']"
                :label="$t('ncircc.notification.description')"
                :error-messages="errors"
              />
            </validation-provider>
            <validation-provider name="detectiontool" rules="required" v-slot="{ errors }">
              <TextField
                :disabled="!needExtraData"
                v-model="ncirccManager['detectiontool']"
                :label="$t('ncircc.notification.detectiontool')"
                :error-messages="errors"
              />
            </validation-provider>
            <validation-provider name="tlp" rules="required" v-slot="{ errors }">
              <SimpleAutocomplete
                :disabled="ncirccManager.submitted"
                label="TLP"
                :items="tlpItems"
                v-model="ncirccManager['tlp']"
                :error-messages="errors"
              >
                <template v-slot:item="{ item }">
                  <v-badge inline left tile :color="item.color" />
                  {{ item.name }}
                </template>
              </SimpleAutocomplete>
            </validation-provider>
            <template v-if="ncirccManager.hasImpactBlock">
              <validation-provider
                name="integrityimpact"
                :rules="isFieldCantBeCleared('integrityimpact') ? 'required' : ''"
                v-slot="{ errors }"
              >
                <SimpleAutocomplete
                  :disabled="!needExtraData"
                  :label="$t('ncircc.notification.impact_on_integrity')"
                  :items="impactItems"
                  v-model="ncirccManager['integrityimpact']"
                  :error-messages="errors"
                />
              </validation-provider>
              <validation-provider
                name="availabilityimpact"
                :rules="isFieldCantBeCleared('availabilityimpact') ? 'required' : ''"
                v-slot="{ errors }"
              >
                <SimpleAutocomplete
                  :disabled="!needExtraData"
                  :label="$t('ncircc.notification.impact_on_accessibility')"
                  :items="impactItems"
                  v-model="ncirccManager['availabilityimpact']"
                  :error-messages="errors"
                />
              </validation-provider>
              <validation-provider
                name="confidentialityimpact"
                :rules="isFieldCantBeCleared('confidentialityimpact') ? 'required' : ''"
                v-slot="{ errors }"
              >
                <SimpleAutocomplete
                  :disabled="!needExtraData"
                  :label="$t('ncircc.notification.impact_on_privacy')"
                  :items="impactItems"
                  v-model="ncirccManager['confidentialityimpact']"
                  :error-messages="errors"
                />
              </validation-provider>

              <TextArea
                :disabled="!needExtraData"
                v-model="ncirccManager['customimpact']"
                :label="$t('ncircc.notification.other_consequences')"
              />
            </template>
          </fieldset>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card elevation="0" class="fill-height">
          <fieldset>
            <legend class="ml-3">{{ $t('ncircc.notification.controlled_resource_info') }}</legend>
            <validation-provider name="affectedsystemname" rules="required" v-slot="{ errors }">
              <TextField
                :disabled="ncirccManager.submitted"
                v-model="ncirccManager['affectedsystemname']"
                :label="$t('ncircc.notification.incident_detection_resource')"
                :error-messages="errors"
              />
            </validation-provider>
            <validation-provider name="affectedsystemcategory" rules="required" v-slot="{ errors }">
              <SimpleAutocomplete
                :disabled="ncirccManager.submitted"
                v-model="ncirccManager['affectedsystemcategory']"
                :label="$t('ncircc.notification.ocii_categorization_information')"
                :items="affectedSystemCategories"
                :error-messages="errors"
              />
            </validation-provider>
            <validation-provider name="affectedsystemfunction" rules="required" v-slot="{ errors }">
              <SimpleAutocomplete
                :disabled="ncirccManager.submitted"
                v-model="ncirccManager['affectedsystemfunction']"
                :label="$t('ncircc.notification.scope_of_subject_functioning')"
                :items="affectedSystemFunctions"
                :error-messages="errors"
              />
            </validation-provider>
            <Checkbox
              :label="$t('ncircc.notification.network_connection')"
              disabled
              v-model="ncirccManager.affectedsystemconnection"
            />
          </fieldset>
          <fieldset>
            <legend class="ml-3">{{ $t('ncircc.notification.controlled_resource_location') }}</legend>
            <validation-provider name="location" rules="required" v-slot="{ errors }">
              <SimpleAutocomplete
                :disabled="ncirccManager.submitted"
                v-model="ncirccManager['location']"
                :label="$t('ncircc.notification.location_by_iso')"
                :items="iso31662Codes"
                :error-messages="errors"
              />
            </validation-provider>
            <TextField
              :disabled="!needExtraData"
              v-model="ncirccManager['city']"
              :label="$t('ncircc.notification.locality')"
            />
          </fieldset>
          <fieldset v-if="ncirccManager.needAddASInfo">
            <legend class="ml-3">ASN</legend>
            <TextField
              :disabled="ncirccManager.submitted"
              v-model="ncirccManager['relatedindicatorsasn']"
              :label="$t('ncircc.notification.as_number')"
            />
            <TextField
              :disabled="ncirccManager.submitted"
              v-model="ncirccManager['relatedindicatorsas']"
              :label="$t('ncircc.notification.as_name')"
            />
            <TextField
              :disabled="ncirccManager.submitted"
              v-model="ncirccManager['relatedindicatorsaslir']"
              :label="$t('ncircc.notification.lir_name')"
            />
          </fieldset>
          <fieldset v-if="ncirccManager.submitted">
            <legend class="ml-3">{{ $t('ncircc.notification.information_about_notification') }}</legend>
            <TextField
              v-model="ncirccManager['registrationNumber']"
              :label="$t('ncircc.notification.notification_registration_number')"
              disabled
            />
            <SimpleAutocomplete
              :label="$t('ncircc.notification.notification_status')"
              disabled
              :items="notificationStatuses"
              v-model="ncirccManager.status"
            />
            <v-col class="d-flex flex-column overflow-auto max-full-height" cols="12">
              <v-row class="px-3 py-2">
                {{ $t('ncircc.notification.last_update') }}: {{ ncirccManager.modified }}</v-row
              >
            </v-col>
          </fieldset>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card elevation="0" class="fill-height">
          <fieldset v-if="ncirccManager.needAddObservableInfo">
            <legend class="ml-3" v-if="!ncirccManager.isVulnerability">
              {{ $t('ncircc.notification.technical_information_about_the_attacked_resource') }}
            </legend>
            <legend class="ml-3" v-else>
              {{ $t('ncircc.notification.technical_information_about_the_vulnerable_resource') }}
            </legend>
            <MultipleCombinedAutocomplete
              v-model="ncirccManager['relatedobservablesipv4']"
              :items="ncirccManager.items['relatedobservablesipv4']"
              :creation-fields="relatedobservablesipv4Fields"
              label="IPv4"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              v-model="ncirccManager['relatedobservablesipv6']"
              :items="ncirccManager.items['relatedobservablesipv6']"
              :creation-fields="relatedobservablesipv6Fields"
              label="IPv6"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="relatedObservableDomainFields"
              v-model="ncirccManager['relatedobservablesdomain']"
              :items="ncirccManager.items['relatedobservablesdomain']"
              :label="$t('ncircc.notification.domain_name')"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="relatedObservablesURIFields"
              v-model="ncirccManager['relatedobservablesuri']"
              :items="ncirccManager.items['relatedobservablesuri']"
              :label="$t('ncircc.notification.uri_address')"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              v-if="!ncirccManager.isVulnerability"
              :creation-fields="relatedObservablesEmailFields"
              v-model="ncirccManager['relatedobservablesemail']"
              :items="ncirccManager.items['relatedobservablesemail']"
              :label="$t('ncircc.notification.email_address')"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="observablesServiceFields"
              :label="$t('ncircc.notification.network_service')"
              v-model="ncirccManager['relatedobservablesservice']"
              :items="ncirccManager.items['relatedobservablesservice']"
              :disabled="!needExtraData"
            />
          </fieldset>
          <fieldset v-if="ncirccManager.needAddIndicatorsInfo">
            <legend class="ml-3">
              {{ $t('ncircc.notification.technical_information_about_the_malicious_system') }}
            </legend>
            <MultipleCombinedAutocomplete
              :creation-fields="relatedIndicatorsIPv4Fields"
              label="IPv4"
              :get-text="indicatorFunctionGetText"
              v-model="ncirccManager['relatedindicatorsipv4']"
              :items="ncirccManager.items['relatedindicatorsipv4']"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="relatedIndicatorsIPv6Fields"
              label="IPv6"
              :get-text="indicatorFunctionGetText"
              v-model="ncirccManager['relatedindicatorsipv6']"
              :items="ncirccManager.items['relatedindicatorsipv6']"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="relatedIndicatorsDomainFields"
              :label="$t('ncircc.notification.domain_name')"
              :get-text="indicatorFunctionGetText"
              v-model="ncirccManager['relatedindicatorsdomain']"
              :items="ncirccManager.items['relatedindicatorsdomain']"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="relatedIndicatorsURIFields"
              :label="$t('ncircc.notification.uri_address')"
              :get-text="indicatorFunctionGetText"
              v-model="ncirccManager['relatedindicatorsuri']"
              :items="ncirccManager.items['relatedindicatorsuri']"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="relatedIndicatorsEmailFields"
              :label="$t('ncircc.notification.email_address')"
              v-model="ncirccManager['relatedindicatorsemail']"
              :items="ncirccManager.items['relatedindicatorsemail']"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="malwareHashFields"
              :label="$t('ncircc.notification.hash_sum_of_the_malicious_module')"
              v-model="ncirccManager['malwarehash']"
              :items="ncirccManager.items['malwarehash']"
              :disabled="!needExtraData"
            />
            <MultipleCombinedAutocomplete
              :creation-fields="relatedIndicatorsVulnFields"
              :label="$t('ncircc.notification.description_of_the_exploited_vulnerabilities')"
              v-model="ncirccManager['relatedindicatorsvuln']"
              :items="ncirccManager.items['relatedindicatorsvuln']"
              :disabled="!needExtraData"
            />
          </fieldset>
          <template v-if="ncirccManager.needAddVulnerabilityInfo">
            <fieldset>
              <legend class="ml-3">
                {{ $t('ncircc.notification.technical_information_about_the_vulnerability') }}
              </legend>
              <validation-provider name="productinfo" rules="required" v-slot="{ errors }">
                <MultipleCombinedAutocomplete
                  :creation-fields="productInfoFields"
                  :label="$t('ncircc.notification.name_of_the_affected_product')"
                  :get-text="productInfoGetText"
                  v-model="ncirccManager['productinfo']"
                  :items="ncirccManager.items['productinfo']"
                  :error-messages="errors"
                  :disabled="!needExtraData"
                />
              </validation-provider>
              <TextField
                :disabled="!needExtraData"
                v-model="ncirccManager['vulnerabilityid']"
                :label="$t('ncircc.notification.vulnerability_identifier')"
              />
            </fieldset>
            <fieldset>
              <legend class="ml-3">{{ $t('ncircc.notification.category_of_vulnerable_software_product') }}</legend>
              <validation-provider
                name="productcategory"
                :rules="isFieldCantBeCleared('productcategory') ? 'required' : ''"
                v-slot="{ errors }"
              >
                <SimpleAutocomplete
                  :disabled="!needExtraData"
                  :label="$t('ncircc.notification.category_of_vulnerable_software_product')"
                  :items="productCategoryItems"
                  v-model="ncirccManager['productcategory']"
                  :error-messages="errors"
                />
              </validation-provider>
            </fieldset>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </validation-observer>
</template>

<script>
  import {
    getActivityStatusItems,
    getActivityTypeItems,
    getAffectedSystemCategoryItems,
    getAffectedSystemFunctionItems,
    getImpactItems,
    getISO31662Codes,
    getNcirccNotificationCategoryOptions,
    getNotificationStatusItems,
    getProductCategoryItems,
    getTLPItems,
    getIncidentTypes,
  } from '@/constants/constants'
  import TextField from '@/components/Ncircc/Fields/TextField'
  import DatePicker from '@/components/Ncircc/Fields/DatePicker'
  import SimpleAutocomplete from '@/components/Ncircc/Fields/SimpleAutocomplete'
  import TextArea from '@/components/Ncircc/Fields/TextArea'
  import Checkbox from '@/components/Ncircc/Fields/Checkbox'
  import MultipleCombinedAutocomplete from '@/components/Ncircc/Fields/MultipleCombinedAutocomplete'
  import {
    getMalwareHashFields,
    getProductInfoFields,
    getRelatedIndicatorsDomainFields,
    getRelatedIndicatorsEmailFields,
    getRelatedIndicatorsIPv4Fields,
    getRelatedIndicatorsIPv6Fields,
    getRelatedIndicatorsURIFields,
    getRelatedIndicatorsVulnFields,
    getRelatedObservablesDomainFields,
    getRelatedObservablesEmailFields,
    getRelatedObservablesIPv4Fields,
    getRelatedObservablesIPv6Fields,
    getRelatedObservablesServiceFields,
    getRelatedObservablesURIFields,
  } from '@/constants/ncircc/dialogFIelds'
  import validationMixin from '@/mixins/validationMixin'
  import Incident from '@/store/models/incident'
  import NcirccManager from '@/store/models/ncircc_manager'
  import { mapActions, mapState } from 'vuex'
  import { NCIRCC_NOTIFICATION_STATUS } from '@/constants/enums'
  import rightsMixin from '@/mixins/rightsMixin'
  import { isNil } from 'lodash'

  export default {
    name: 'Notification',
    mixins: [validationMixin, rightsMixin],
    components: {
      MultipleCombinedAutocomplete,
      Checkbox,
      TextArea,
      SimpleAutocomplete,
      DatePicker,
      TextField,
    },
    props: {
      incident: {
        type: Incident,
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
        observablesServiceFields: getRelatedObservablesServiceFields(),
        relatedobservablesipv4Fields: getRelatedObservablesIPv4Fields(),
        relatedobservablesipv6Fields: getRelatedObservablesIPv6Fields(),
        relatedObservableDomainFields: getRelatedObservablesDomainFields(),
        relatedObservablesURIFields: getRelatedObservablesURIFields(),
        relatedObservablesEmailFields: getRelatedObservablesEmailFields(),
        relatedIndicatorsIPv4Fields: getRelatedIndicatorsIPv4Fields(),
        relatedIndicatorsIPv6Fields: getRelatedIndicatorsIPv6Fields(),
        relatedIndicatorsDomainFields: getRelatedIndicatorsDomainFields(),
        relatedIndicatorsURIFields: getRelatedIndicatorsURIFields(),
        relatedIndicatorsEmailFields: getRelatedIndicatorsEmailFields(),
        malwareHashFields: getMalwareHashFields(),
        relatedIndicatorsVulnFields: getRelatedIndicatorsVulnFields(),
        productInfoFields: getProductInfoFields(),
        categories: getNcirccNotificationCategoryOptions(),
        affectedSystemCategories: getAffectedSystemCategoryItems(),
        affectedSystemFunctions: getAffectedSystemFunctionItems(),
        notificationStatuses: getNotificationStatusItems(),
        impactItems: getImpactItems(),
        tlpItems: getTLPItems(),
        statuses: getActivityStatusItems(),
        types: getIncidentTypes(),
        iso31662Codes: getISO31662Codes(),
        productCategoryItems: getProductCategoryItems(),
        createdDateModal: false,
        closedDateModal: false,
        ncirccManager: new NcirccManager(this.incident, this.initialData),
      }
    },
    computed: {
      ...mapState('incidents', ['ncircc']),

      hasChanges() {
        return this.ncirccManager.hasChanges
      },

      needExtraData() {
        if (!this.canUpdateNcirccData(this.incident)) {
          return false
        }

        return (
          !this.ncirccManager.submitted ||
          (this.ncirccManager.submitted && this.ncirccManager.status === NCIRCC_NOTIFICATION_STATUS.SUPPLEMENT_REQUIRED)
        )
      },
    },
    methods: {
      ...mapActions('incidents', ['createNcirccNotification', 'updateNcirccNotification']),

      sendData() {
        return this.$refs.observer.validate().then((isValid) => {
          if (isValid) {
            return this.createNcirccNotification(this.ncirccManager.getData())
          }
        })
      },

      sendUpdates() {
        return this.$refs.observer.validate().then((isValid) => {
          if (isValid) {
            const data = this.ncirccManager.getData(true)
            data.category = this.ncirccManager.category
            data.affectedsystemconnection = this.ncirccManager.affectedsystemconnection

            return this.updateNcirccNotification(data)
          }
        })
      },

      indicatorFunctionGetText(item) {
        let func
        for (const option of getActivityTypeItems()) {
          if (option.id === item.function) {
            func = option.name
            break
          }
        }
        return `${item.value} (${func})`
      },

      productInfoGetText(item) {
        return `${item.name}:${item.version}`
      },

      /**
       * @param {string} fieldName
       * Проверяет необходимость указания значения в поле. Эти поля не обязательны, но если были переданы,
       * то очищать их нельзя при дополнении.
       */
      isFieldCantBeCleared(fieldName) {
        return this.needExtraData && !isNil(this.incident.ncircc[fieldName])
      },
    },

    watch: {
      ncircc() {
        this.$set(this, 'ncirccManager', new NcirccManager(this.incident, {}))
      },
    },
  }
</script>
