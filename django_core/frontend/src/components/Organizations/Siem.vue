<template>
  <validation-observer ref="SiemObserver" v-slot="{ invalid }">
    <v-card outlined>
      <v-card-title class="d-flex">
        {{ selectedStructureSiem.type }}
      </v-card-title>
      <v-col class="pb-0">
        <validation-provider name="Identifier" rules="required" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('identifier', $event)"
            :value="getLocalChanges('identifier')"
            :label="$t('organizations.organizationMainData.identifier')"
            :hint="$t('fieldHints.analytic_system.identifier')"
            outlined
            :error-messages="errors"
          ></v-text-field>
        </validation-provider>
      </v-col>
      <v-col class="pb-0">
        <validation-provider name="Name" rules="required" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('name', $event)"
            :value="getLocalChanges('name')"
            :label="$t('organizations.organizationMainData.name')"
            :hint="$t('fieldHints.analytic_system.name')"
            outlined
            :error-messages="errors"
          ></v-text-field>
        </validation-provider>
      </v-col>
      <v-col class="d-flex pb-0">
        <validation-provider name="Address" rules="required|ip" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('address', $event)"
            :value="getLocalChanges('address')"
            :label="$t('organizations.organizationMainData.address')"
            :hint="$t('fieldHints.analytic_system.address')"
            outlined
            :error-messages="errors"
            class="pr-2"
          ></v-text-field>
        </validation-provider>
        <validation-provider name="Url" rules="required|url" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('url', $event)"
            :value="getLocalChanges('url')"
            label="URL"
            :hint="$t('fieldHints.analytic_system.url')"
            outlined
            :error-messages="errors"
            class="pl-2"
          ></v-text-field>
        </validation-provider>
      </v-col>
      <v-col class="d-flex pb-0">
        <validation-provider name="Login" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('login', $event)"
            :value="getLocalChanges('login')"
            :label="$t('organizations.organizationMainData.login')"
            :hint="$t('fieldHints.analytic_system.login')"
            :error-messages="errors"
            outlined
            class="pr-2"
          ></v-text-field>
        </validation-provider>
        <validation-provider name="Password" class="half-width" v-slot="{ errors }">
          <v-text-field
            @input="addChanges('password', $event)"
            :value="getLocalChanges('password')"
            :label="$t('organizations.organizationMainData.password')"
            :error-messages="errors"
            outlined
            type="password"
            class="pl-2"
          ></v-text-field>
        </validation-provider>
      </v-col>
      <v-col class="d-flex">
        <v-checkbox
          v-if="selectedStructureSiem.isTias"
          class="d-flex align-center ma-0 pa-0"
          :color="getLocalChanges('isSync') ? 'green' : 'grey'"
          hide-details
          @change="addChanges('isSync', $event)"
          :input-value="getLocalChanges('isSync')"
          :label="$t('organizations.organizationMainData.fetch_structure')"
        ></v-checkbox>
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="unbindSiem()">
          <v-icon> mdi-delete-outline </v-icon>
        </v-btn>
        <v-btn color="success" class="ml-2" outlined :disabled="!isSiemEdited || invalid" @click="saveSiem()">
          <v-icon> mdi-content-save </v-icon>
        </v-btn>
      </v-col>
    </v-card>
  </validation-observer>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import rightsMixin from '@/mixins/rightsMixin'
  import Vue from 'vue'
  import { isNil, isEqual, isEmpty } from 'lodash'
  import { getChanges } from '@/utils'

  export default {
    name: 'Siem',
    mixins: [validationMixin, rightsMixin],
    data: () => ({
      changes: {},
    }),
    methods: {
      ...mapActions('organizations', [
        'updateSiemInstance',
        'updateOrganizationInstanceSiems',
        'deselectStructureItemData',
      ]),
      addChanges(fieldName, eventData) {
        const id = this.selectedStructureSiemId
        const oldData = this.selectedOrganizationSiems

        if (isEqual(oldData[id][fieldName], eventData)) {
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
        const itemId = this.selectedStructureSiemId
        const changesObj = this.changes[itemId]
        const sourceObj = this.selectedOrganizationSiems[itemId]
        return getChanges(fieldName, changesObj, sourceObj)
      },
      async saveSiem() {
        const siemId = this.selectedStructureSiemId
        const params = this.changes[siemId]

        const [error, response] = await this.updateSiemInstance({
          id: siemId,
          params: params,
        })
        if (!error && response.status === 200) {
          Vue.delete(this.changes, siemId)
        }
      },
      async unbindSiem() {
        const siemId = this.selectedStructureSiemId
        const newSiemIds = this.selectedOrganization.siemIds.filter((id) => id !== siemId)
        await this.updateOrganizationInstanceSiems({
          id: this.selectedOrganization.id,
          params: { siemIds: newSiemIds },
        })
        this.deselectStructureItemData()
      },
    },
    computed: {
      ...mapState('organizations', ['selectedStructureSiemId']),
      ...mapGetters('organizations', ['selectedOrganizationSiems', 'selectedStructureSiem', 'selectedOrganization']),
      isSiemEdited() {
        const siemId = this.selectedStructureSiemId
        return !isEmpty(this.changes[siemId])
      },
    },
  }
</script>
