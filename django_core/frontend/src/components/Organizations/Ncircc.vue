<template>
  <validation-observer class="pa-0 fill-height" ref="NcirccObserver" v-slot="{ invalid }">
    <fieldset class="fill-height rounded">
      <legend class="ml-3">{{ $t('organizations.organizationMainData.ncircc') }}</legend>
      <v-row class="top-row d-flex flex-column overflow-auto ma-0 flex-nowrap max-full-height">
        <v-col class="d-flex pb-0">
          <validation-provider
            name="OrganizationName"
            :rules="isOcii ? 'required' : ''"
            class="full-width"
            v-slot="{ errors }"
          >
            <v-text-field
              @input="addChanges('organizationName', $event)"
              :value="getLocalChanges('organizationName')"
              :label="$t('organizations.organization_name')"
              :hint="$t('fieldHints.organization.organization_name')"
              outlined
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>
        </v-col>
        <v-col class="d-flex pb-0">
          <validation-provider name="Scope" :rules="isOcii ? 'required' : ''" class="half-width" v-slot="{ errors }">
            <v-autocomplete
              :no-data-text="$t('main.no_data')"
              @change="addChanges('sphere', $event)"
              :value="getLocalChanges('sphere')"
              :label="$t('organizations.operation_scope')"
              :hint="$t('fieldHints.organization.operation_scope')"
              outlined
              :error-messages="errors"
              :items="scopeTypes()"
              item-value="id"
              item-text="name"
              class="pr-2"
            >
            </v-autocomplete>
          </validation-provider>
          <validation-provider
            name="OciiCategory"
            :rules="isOcii ? 'required' : ''"
            class="half-width"
            v-slot="{ errors }"
          >
            <v-autocomplete
              :no-data-text="$t('main.no_data')"
              @change="addChanges('ocii', $event)"
              :value="getLocalChanges('ocii')"
              :label="$t('organizations.ocii_type')"
              :hint="$t('fieldHints.organization.ocii_type')"
              outlined
              :error-messages="errors"
              :items="ociiTypes()"
              item-value="id"
              item-text="name"
              class="pl-2"
            >
            </v-autocomplete>
          </validation-provider>
        </v-col>
        <v-col class="d-flex pb-0">
          <validation-provider
            name="SubjectType"
            :rules="isOcii ? 'required' : ''"
            class="half-width"
            v-slot="{ errors }"
          >
            <v-autocomplete
              :no-data-text="$t('main.no_data')"
              @change="addChanges('typeSubject', $event)"
              :value="getLocalChanges('typeSubject')"
              :label="$t('organizations.subject_type')"
              :hint="$t('fieldHints.organization.subject_type')"
              outlined
              :error-messages="errors"
              :items="subjectTypes()"
              item-value="id"
              item-text="name"
              class="pr-2"
            >
            </v-autocomplete>
          </validation-provider>
          <validation-provider
            name="DistrictType"
            :rules="isOcii ? 'required' : ''"
            class="half-width"
            v-slot="{ errors }"
          >
            <v-autocomplete
              :no-data-text="$t('main.no_data')"
              @change="addChanges('federalDistrict', $event)"
              :value="getLocalChanges('federalDistrict')"
              :label="$t('organizations.district_type')"
              :hint="$t('fieldHints.organization.district_type')"
              outlined
              :error-messages="errors"
              :items="districtTypes()"
              item-value="id"
              item-text="name"
              class="pl-2"
            >
            </v-autocomplete>
          </validation-provider>
        </v-col>
        <v-col class="d-flex pb-0">
          <validation-provider
            name="OKOGU"
            :rules="isOcii ? 'required|min_value:1|digits:7' : 'min_value:1|digits:7'"
            class="half-width"
            v-slot="{ errors }"
          >
            <v-text-field
              @input="addChanges('okogu', $event)"
              :value="getLocalChanges('okogu')"
              :label="$t('organizations.okogu')"
              :hint="$t('fieldHints.organization.okogu')"
              outlined
              :error-messages="errors"
              class="pr-2"
              type="number"
              hide-spin-buttons
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="OKOPF"
            :rules="isOcii ? 'required|min_value:1|digits:5' : 'min_value:1|digits:5'"
            class="half-width"
            v-slot="{ errors }"
          >
            <v-text-field
              @input="addChanges('okopf', $event)"
              :value="getLocalChanges('okopf')"
              :label="$t('organizations.okopf')"
              :hint="$t('fieldHints.organization.okopf')"
              outlined
              :error-messages="errors"
              class="pl-2"
              type="number"
              hide-spin-buttons
            ></v-text-field>
          </validation-provider>
        </v-col>
        <v-col class="d-flex pb-0">
          <validation-provider
            name="INN"
            :rules="isOcii ? 'required|min_value:1|digits:10' : 'min_value:1|digits:10'"
            class="half-width"
            v-slot="{ errors }"
          >
            <v-text-field
              @input="addChanges('inn', $event)"
              :value="getLocalChanges('inn')"
              :label="$t('organizations.inn')"
              :hint="$t('fieldHints.organization.inn')"
              outlined
              :error-messages="errors"
              class="pr-2"
              type="number"
              hide-spin-buttons
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="KPP"
            :rules="isOcii ? 'required|min_value:1|digits:9' : 'min_value:1|digits:9'"
            class="half-width"
            v-slot="{ errors }"
          >
            <v-text-field
              @input="addChanges('kpp', $event)"
              :value="getLocalChanges('kpp')"
              :label="$t('organizations.kpp')"
              :hint="$t('fieldHints.organization.kpp')"
              outlined
              :error-messages="errors"
              class="pl-2"
              type="number"
              hide-spin-buttons
            ></v-text-field>
          </validation-provider>
        </v-col>
        <v-col v-if="selectedOrganizationNcircc">
          <fieldset class="fill-height rounded contacts-field">
            <legend class="ml-3">
              <NcirccContactCreationDialog />
            </legend>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">{{ $t('organizations.organizationMainData.full_name') }}</th>
                    <th class="text-center">{{ $t('organizations.organizationMainData.email') }}</th>
                    <th class="text-center">{{ $t('organizations.organizationMainData.phone') }}</th>
                    <th class="text-center">{{ $t('organizations.organizationMainData.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="contact in selectedOrganizationNcircc.contacts" :key="contact.id">
                    <td class="text-center">{{ contact.name }}</td>
                    <td class="text-center">{{ contact.email }}</td>
                    <td class="text-center">{{ contact.phone }}</td>
                    <td class="text-center">
                      <v-btn color="red" icon @click="deleteContactInstance(contact.id)">
                        <v-icon> mdi-delete-outline </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </fieldset>
        </v-col>
        <v-spacer class="fill-height"></v-spacer>
      </v-row>
      <v-divider></v-divider>
      <v-row class="bottom-row d-flex justify-space-between ma-0">
        <v-spacer></v-spacer>
        <v-col cols="1" class="d-flex justify-end align-center">
          <v-btn color="success" outlined :disabled="!isNcirccEdited || invalid" @click="saveNcircc">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </fieldset>
  </validation-observer>
</template>

<script>
  import { getScopeTypes, getSubjectTypes, getDistrictTypes, getOciiTypes } from '@/constants/constants'
  import NcirccContactCreationDialog from '@/components/dialogs/NcirccContactCreationDialog'
  import validationMixin from '@/mixins/validationMixin'
  import { mapGetters, mapActions, mapState } from 'vuex'
  import Vue from 'vue'
  import { isNil, isEqual, isEmpty } from 'lodash'
  import { getChanges } from '@/utils'

  const NEW_NCIRCC = {
    sphere: null,
    typeSubject: null,
    federalDistrict: null,
    address: '',
    okogu: '',
    okopf: '',
    inn: '',
    kpp: '',
    ocii: null,
  }

  export default {
    name: 'Ncircc',
    mixins: [validationMixin],
    components: {
      NcirccContactCreationDialog,
    },
    data: () => ({
      changes: {},
      newNcircc: { ...NEW_NCIRCC },
      scopeTypes: getScopeTypes,
      subjectTypes: getSubjectTypes,
      districtTypes: getDistrictTypes,
      ociiTypes: getOciiTypes,
    }),
    methods: {
      ...mapActions('organizations', ['createNcirccInstance', 'updateNcirccInstance', 'deleteContactInstance']),
      addChanges(fieldName, eventData) {
        if (!this.isExistingNcircc) {
          return (this.newNcircc[fieldName] = eventData)
        }

        const id = this.selectedOrganizationId
        const oldData = this.selectedOrganizationNcircc

        if (isEqual(oldData[fieldName], eventData)) {
          Vue.delete(this.changes[id], fieldName)
          if (isEmpty(this.changes[id])) {
            Vue.delete(this.changes, id)
          }
          return
        }

        if (isNil(this.changes[id])) {
          Vue.set(this.changes, id, {})
        }

        Vue.set(this.changes[id], fieldName, eventData)
      },
      getLocalChanges(fieldName) {
        if (!this.isExistingNcircc) {
          return this.newNcircc[fieldName]
        }

        const id = this.selectedOrganizationId
        const changesObj = this.changes[id]
        const sourceObj = this.selectedOrganizationNcircc

        return getChanges(fieldName, changesObj, sourceObj)
      },
      async saveNcircc() {
        if (this.isExistingNcircc) {
          const ncirccId = this.selectedOrganizationNcircc.id
          const id = this.selectedOrganizationId
          const [error, response] = await this.updateNcirccInstance({
            id: ncirccId,
            params: this.changes[id],
          })
          if (!error && response.status === 200) {
            Vue.delete(this.changes, id)
          }
        } else {
          const params = { ...this.newNcircc }
          params.organizationId = this.selectedOrganizationId

          const [error, response] = await this.createNcirccInstance(params)
          if (!error && response.status === 201) {
            Vue.set(this, 'newNcircc', {})
          }
        }
      },
      clearNewNcircc() {
        this.newNcircc = { ...NEW_NCIRCC }
      },
    },
    computed: {
      ...mapState('organizations', ['selectedOrganizationId']),
      ...mapGetters('organizations', ['selectedOrganization', 'selectedOrganizationNcircc']),
      isNcirccEdited() {
        const id = this.selectedOrganizationId
        if (this.isExistingNcircc) return !isEmpty(this.changes[id])
        return JSON.stringify(this.newNcircc) !== JSON.stringify(NEW_NCIRCC)
      },
      isExistingNcircc() {
        return !isNil(this.selectedOrganizationNcircc)
      },
      isOcii() {
        return this.selectedOrganization.isOcii
      },
    },
    watch: {
      selectedOrganizationId() {
        this.clearNewNcircc()
      },
    },
  }
</script>
<style lang="scss">
  .ncircc-data {
    .contacts-field {
      min-height: 100px;
    }
  }
</style>
