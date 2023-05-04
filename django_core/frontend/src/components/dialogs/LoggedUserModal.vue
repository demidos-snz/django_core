<template>
  <v-dialog fullscreen v-model="isActive">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mx-0" outlined fab x-small v-bind="attrs" v-on="on" color="white">
        <v-badge dot color="red" bordered v-if="operator.passwordIsObsolete">
          <v-icon dark>mdi-account</v-icon>
        </v-badge>
        <v-icon dark v-else>mdi-account</v-icon>
      </v-btn>
    </template>
    <v-card v-if="operator">
      <v-card-title>
        <span class="headline">{{ $t('dialogs.loggedUserModal.user_info') }}</span>
      </v-card-title>
      <v-card-text class="py-2 px-4">
        <v-row class="d-flex flex-column ma-0">
          <v-col class="d-flex pb-0">
            <v-text-field
              v-model="operator.name"
              disabled
              :label="$t('dialogs.loggedUserModal.name')"
              hide-details
              outlined
              class="pr-2"
            ></v-text-field>
            <v-text-field
              v-model="operator.surname"
              disabled
              :label="$t('dialogs.loggedUserModal.surname')"
              outlined
              hide-details
              class="pl-2 pr-2"
            ></v-text-field>
            <v-text-field
              v-model="operator.patronymic"
              disabled
              :label="$t('dialogs.loggedUserModal.patronymic')"
              outlined
              hide-details
              class="pl-2"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex pb-0">
            <v-text-field
              v-model="operator.email"
              :label="$t('dialogs.loggedUserModal.email')"
              outlined
              disabled
              hide-details
              readonly
              class="pr-2"
            >
              <template v-slot:append v-if="!operator.privateEmail">
                <v-tooltip bottom max-width="400">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="orange" dark v-bind="attrs" v-on="on"> mdi-exclamation-thick</v-icon>
                  </template>
                  <span>{{ $t('dialogs.loggedUserModal.publicEmail') }}</span>
                </v-tooltip>
              </template>
            </v-text-field>
            <v-text-field
              :value="operator.roleLocalized"
              :label="$t('dialogs.loggedUserModal.role')"
              outlined
              disabled
              hide-details
              class="pl-2 pr-2"
            ></v-text-field>
            <v-text-field
              v-model="operator.phone"
              :label="$t('dialogs.loggedUserModal.phone')"
              outlined
              disabled
              hide-details
              class="pl-2 pr-2"
            ></v-text-field>
            <v-text-field
              v-model="operator.telegramChatId"
              :label="$t('dialogs.loggedUserModal.telegram_chat_id')"
              outlined
              disabled
              hide-details
              readonly
              class="pl-2"
            >
              <template v-slot:append>
                <ConnectTelegramDialog />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>
        <span class="headline">{{ $t('dialogs.loggedUserModal.password_change') }}</span>
        <v-tooltip bottom max-width="400" v-if="operator.passwordIsObsolete">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="orange" dark v-bind="attrs" v-on="on"> mdi-exclamation-thick</v-icon>
          </template>
          <span>{{ $t('dialogs.loggedUserModal.password_expiration', { date: operator.passwordExpiration }) }}</span>
        </v-tooltip>
      </v-card-title>
      <validation-observer ref="passwordObserver" v-slot="{ invalid }" v-if="isActive">
        <v-card-text class="py-2 px-4 pb-0">
          <v-row class="d-flex flex-column ma-0">
            <v-col class="d-flex pb-0">
              <validation-provider name="OldPassword" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="oldPassword"
                  :label="$t('dialogs.loggedUserModal.old_password')"
                  outlined
                  class="pr-2"
                  :error-messages="errors"
                  :type="oldPasswordHidden ? 'password' : 'text'"
                >
                  <template v-slot:append>
                    <div class="v-input__icon v-input__icon--append">
                      <v-btn @click="() => (oldPasswordHidden = !oldPasswordHidden)" icon>
                        <v-icon>{{ oldPasswordHidden ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                      </v-btn>
                    </div>
                  </template></v-text-field
                >
              </validation-provider>
              <validation-provider name="NewPassword" :rules="newPasswordRules" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newPassword"
                  :label="$t('dialogs.loggedUserModal.new_password')"
                  outlined
                  class="pl-2"
                  :error-messages="errors"
                  :type="newPasswordHidden ? 'password' : 'text'"
                >
                  <template v-slot:append>
                    <div class="v-input__icon v-input__icon--append">
                      <v-btn @click="() => (newPasswordHidden = !newPasswordHidden)" icon>
                        <v-icon>{{ newPasswordHidden ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                      </v-btn>
                    </div>
                    <div class="ml-3 v-input__icon v-input__icon--append">
                      <v-tooltip
                        right
                        color="grey darken-3"
                        open-on-click
                        :open-on-focus="false"
                        :open-on-hover="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-information-variant</v-icon>
                          </v-btn>
                        </template>
                        <PasswordHintModal />
                      </v-tooltip>
                    </div> </template
                ></v-text-field>
              </validation-provider>
              <validation-provider
                name="Confirmation"
                rules="required|confirmed:NewPassword"
                class="half-width"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="confirmation"
                  :label="$t('dialogs.loggedUserModal.confirmation')"
                  outlined
                  class="pl-2"
                  :error-messages="errors"
                  :type="confirmationHidden ? 'password' : 'text'"
                >
                  <template v-slot:append>
                    <div class="v-input__icon v-input__icon--append">
                      <v-btn @click="() => (confirmationHidden = !confirmationHidden)" icon>
                        <v-icon>{{ confirmationHidden ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                      </v-btn>
                    </div>
                  </template></v-text-field
                >
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-7">
          <v-alert type="info" class="ma-0" dense outlined>
            {{ $t('dialogs.loggedUserModal.info') }}
          </v-alert>
          <v-spacer></v-spacer>
          <v-btn color="green" outlined @click="savePassword" :disabled="invalid">
            <v-icon> mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </validation-observer>
      <v-card-title>
        <span class="headline">{{ $t('dialogs.loggedUserModal.notificationSettings') }}</span>
      </v-card-title>
      <v-card-text class="py-2 px-7">
        <NotificationSettingsTable />
      </v-card-text>
      <v-card-actions class="px-7">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-text class="py-2 pb-4">
        <v-row class="d-flex align-center justify-center">
          <p class="title grey--text text--lighten-1 font-weight-light">
            {{ $t('dialogs.loggedUserModal.user_not_found') }}
          </p>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import NotificationSettingsTable from '@/components/dialogs/NotificationSettingsTable'
  import ConnectTelegramDialog from '@/components/dialogs/ConnectTelegramDialog'
  import PasswordHintModal from '@/components/dialogs/PasswordHintModal'

  export default {
    name: 'LoggedUserModal',
    components: { ConnectTelegramDialog, NotificationSettingsTable, PasswordHintModal },
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      oldPassword: '',
      newPassword: '',
      confirmation: '',
      oldPasswordHidden: true,
      newPasswordHidden: true,
      confirmationHidden: true,
    }),
    computed: {
      ...mapGetters('operator', ['operator']),
      newPasswordRules() {
        const rules = [
          'required',
          'characters_between:8,16',
          'at_least_one_lower',
          'at_least_one_upper',
          'at_least_one_digit',
          'at_least_one_special',
          'no_whitespace',
          'password_incorrect_symbols',
          'not_equal:@OldPassword',
        ]

        return rules.join('|')
      },
    },
    methods: {
      ...mapActions('operator', ['changePassword', 'logoutUser', 'resetStateData']),
      ...mapActions('alerts', ['addAlert']),
      closeDialog() {
        Object.assign(this.$data, this.$options.data.apply(this))
      },

      async savePassword() {
        const params = {
          oldPassword: this.oldPassword,
          newPassword1: this.newPassword,
          newPassword2: this.confirmation,
        }
        const [error, response] = await this.changePassword(params)
        if (!error && response.status === 200) {
          this.resetStateData()
          this.$router.push({ name: 'login' })
        }
      },

      processPasswordExpiration() {
        this.logoutUser()
        this.$router.push({ name: 'password_change' })
        this.addAlert({
          message: this.$t('main.outdated_password_notif'),
          type: 'error',
        })
      },
    },
    watch: {
      'isActive'(newVal) {
        newVal || this.closeDialog()
      },
      'operator.passwordIsOutdated'(newVal) {
        if (newVal) {
          this.processPasswordExpiration()
        }
      },
    },
  }
</script>
