<template>
  <v-scroll-y-transition mode="out-in">
    <v-card v-if="selectedUser" class="d-flex flex-row fill-height pa-3 ma-0">
      <v-col class="fill-height" cols="6">
        <validation-observer ref="UserDataObserver" v-slot="{ invalid }">
          <fieldset class="fill-height rounded">
            <legend class="ml-3">{{ $t('users.user_info') }}</legend>
            <v-row class="d-flex flex-column overflow-auto ma-0 flex-nowrap">
              <v-col class="d-flex pb-0">
                <validation-provider name="Name" rules="required|alpha" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('name', $event)"
                    :value="getLocalChanges('name')"
                    :label="$t('users.name')"
                    outlined
                    :error-messages="errors"
                    class="pr-2"
                  ></v-text-field>
                </validation-provider>
                <validation-provider name="Surname" rules="required|alpha" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('surname', $event)"
                    :value="getLocalChanges('surname')"
                    :label="$t('users.surname')"
                    outlined
                    :error-messages="errors"
                    class="pl-2"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="d-flex pb-0">
                <validation-provider name="Patronymic" rules="alpha" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('patronymic', $event)"
                    :value="getLocalChanges('patronymic')"
                    :label="$t('users.patronymic')"
                    outlined
                    :error-messages="errors"
                    class="pr-2"
                  ></v-text-field>
                </validation-provider>
                <validation-provider name="Email" rules="required|email" class="half-width" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('email', $event)"
                    :value="getLocalChanges('email')"
                    :label="$t('users.email')"
                    outlined
                    :error-messages="errors"
                    class="pl-2"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="pb-0">
                <validation-provider name="Role" rules="required" v-slot="{ errors }">
                  <v-select
                    :no-data-text="$t('main.no_data')"
                    @input="addChanges('role', $event)"
                    :value="getLocalChanges('role')"
                    :items="userRoles"
                    item-text="name"
                    item-value="id"
                    :label="$t('users.role')"
                    outlined
                    :error-messages="errors"
                  >
                  </v-select>
                </validation-provider>
              </v-col>
              <v-col class="pb-0">
                <validation-provider name="Phone" rules="phone" v-slot="{ errors }">
                  <v-text-field
                    @input="addChanges('phone', $event)"
                    :value="getLocalChanges('phone')"
                    :label="$t('users.phone')"
                    outlined
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="d-flex flex-row align-center">
                <v-chip class="ma-0 mr-3" label outlined>
                  {{ selectedUser.isClient ? $t('users.not_employee') : $t('users.employee') }}
                </v-chip>
                <v-checkbox
                  class="ma-0"
                  @change="addChanges('isActive', $event)"
                  :input-value="getLocalChanges('isActive')"
                  hide-details
                  :label="$t('users.active')"
                ></v-checkbox>
                <v-spacer></v-spacer>
                <v-progress-circular indeterminate size="35" width="2" class="mr-2" v-if="sending" />
                <v-btn
                  v-else
                  color="success"
                  outlined
                  :disabled="!(hasUserChanges || hasOrganizationChanges) || invalid"
                  @click="saveChanges"
                >
                  <v-icon> mdi-content-save </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </fieldset>
        </validation-observer>
      </v-col>
      <v-col class="fill-height" cols="6">
        <fieldset class="fill-height rounded orgs-fieldset">
          <legend class="ml-3">{{ $t('users.available_orgs') }}</legend>
          <v-row class="d-flex flex-column fill-height overflow-auto ma-0 flex-nowrap">
            <v-col>
              <v-autocomplete
                :no-data-text="$t('main.no_data')"
                deletable-chips
                chips
                small-chips
                hide-details
                :value="getLocalChanges('organizationIds')"
                @change="addChanges('organizationIds', $event)"
                :items="organizationList"
                :return-object="false"
                item-text="name"
                item-value="id"
                :label="$t('users.organizations')"
                multiple
                outlined
              >
                <template v-slot:item="data">
                  <v-list-item-content v-text="data.item.name" />
                </template>
                <template v-slot:selection="data">
                  <v-chip @click:close="removeOrganization(data.item.id)" :input-value="data.selected" close small>
                    <span class="text-truncate">{{ data.item.name }}</span>
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-card>
    <div
      v-else
      class="d-flex fill-height title align-center justify-center grey--text text--lighten-1 font-weight-light"
    >
      {{ $t('users.user_not_selected') }}
    </div>
  </v-scroll-y-transition>
</template>

<script>
  import validationMixin from '@/mixins/validationMixin'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { getUserRoles } from '@/constants/constants'
  import { isEqual, xor, omit, isEmpty } from 'lodash'
  import { getChanges } from '@/utils'
  import Vue from 'vue'

  export default {
    name: 'UserData',
    mixins: [validationMixin],
    data: () => ({
      changes: {},
      sending: false,
    }),
    methods: {
      ...mapActions('users', ['updateUserInstance', 'updateUserInstanceOrganizations']),
      addChanges(fieldName, eventData) {
        if (this.changes.hasOwnProperty(fieldName)) {
          if (fieldName === 'organizationIds') {
            const orgDiffs = xor(this.selectedUser.organizationIds, eventData)
            if (orgDiffs.length === 0) {
              return Vue.delete(this.changes, fieldName)
            }
          } else if (isEqual(this.selectedUser[fieldName], eventData)) {
            return Vue.delete(this.changes, fieldName)
          }
        }

        Vue.set(this.changes, fieldName, eventData)
      },
      getLocalChanges(fieldName) {
        return getChanges(fieldName, this.changes, this.selectedUser)
      },
      async saveChanges() {
        this.sending = true
        if (this.hasUserChanges) {
          const [error, response] = await this.updateUserInstance({ id: this.selectedUser.id, params: this.changes })
          if (!error && response.status === 200) {
            const changedKeys = Object.keys(this.changes)
            changedKeys.forEach((key) => {
              if (key !== 'organizationIds') {
                Vue.delete(this.changes, key)
              }
            })
          }
        }

        if (this.hasOrganizationChanges) {
          const [error, response] = await this.updateUserInstanceOrganizations({
            id: this.selectedUser.id,
            params: { organizationIds: this.changes.organizationIds },
          })
          if (!error && response.status === 200) {
            Vue.delete(this.changes, 'organizationIds')
          }
        }
        this.sending = false
      },
      removeOrganization(id) {
        const orgIds = this.getLocalChanges('organizationIds')
        const newOrgIds = orgIds.filter((orgId) => orgId !== id)
        this.addChanges('organizationIds', newOrgIds)
      },
    },
    computed: {
      ...mapGetters('users', ['users', 'selectedUser']),
      ...mapGetters('organizations', ['organizations']),
      ...mapState('users', ['selectedUserId']),
      organizationList() {
        return Object.values(this.organizations)
      },
      hasUserChanges() {
        return !isEmpty(omit(this.changes, 'organizationIds'))
      },
      hasOrganizationChanges() {
        return this.changes.hasOwnProperty('organizationIds')
      },
      userRoles() {
        return Object.values(getUserRoles())
      },
    },

    watch: {
      selectedUserId() {
        this.$set(this, 'changes', {})
      },
    },
  }
</script>
<style lang="scss" scoped>
  .orgs-fieldset {
    min-width: 0;
  }
</style>
