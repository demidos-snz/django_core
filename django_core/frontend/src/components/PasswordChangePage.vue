<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" class="text-center">
      <v-col class="max-width-360">
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-card class="px-8 py-4" elevation="24" outlined>
            <v-card-title class="justify-center"> AM Incident Management </v-card-title>
            <v-card-text class="py-4">
              <v-row class="d-flex flex-column">
                <v-col>
                  <validation-provider name="Login" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="login"
                      :label="$t('passwordChangePage.login')"
                      @keyup.enter="changePass"
                      outlined
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col>
                  <validation-provider name="OldPassword" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="oldPassword"
                      :label="$t('passwordChangePage.old_password')"
                      @keyup.enter="changePass"
                      outlined
                      :type="oldPasswordHidden ? 'password' : 'text'"
                      :error-messages="errors"
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
                </v-col>
                <v-col>
                  <validation-provider name="NewPassword" :rules="newPasswordRules" v-slot="{ errors }">
                    <v-text-field
                      v-model="newPassword"
                      :label="$t('passwordChangePage.new_password')"
                      @keyup.enter="changePass"
                      outlined
                      :type="newPasswordHidden ? 'password' : 'text'"
                      :error-messages="errors"
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
                </v-col>
                <v-col>
                  <validation-provider name="Confirmation" rules="required|confirmed:NewPassword" v-slot="{ errors }">
                    <v-text-field
                      v-model="confirmation"
                      :label="$t('passwordChangePage.confirmation')"
                      @keyup.enter="changePass"
                      outlined
                      :type="confirmationHidden ? 'password' : 'text'"
                      :error-messages="errors"
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
            <v-card-actions class="pb-3">
              <v-row class="d-flex flex-column">
                <v-col>
                  <v-btn class="mr-4" color="success" :disabled="invalid" @click="changePass">
                    {{ $t('passwordChangePage.enter') }}
                  </v-btn>
                  <v-btn @click="clearData">
                    {{ $t('main.clear') }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="goToLogin">
                    {{ $t('main.cancel') }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn outlined color="grey lighten-4" @click="changeLocale">
                    {{ $i18n.locale }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </validation-observer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import validationMixin from '@/mixins/validationMixin'
  import { mapActions, mapGetters } from 'vuex'
  import PasswordHintModal from '@/components/dialogs/PasswordHintModal'

  export default {
    name: 'PasswordChangePage',
    mixins: [validationMixin],
    components: {
      PasswordHintModal,
    },
    data: () => ({
      login: '',
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
      ...mapActions('operator', ['loginUser', 'changePassword']),
      ...mapActions('ui', ['changeLocale']),
      async changePass() {
        const params = {
          email: this.login,
          oldPassword: this.oldPassword,
          newPassword1: this.newPassword,
          newPassword2: this.confirmation,
        }
        const [error, response] = await this.changePassword(params)
        if (!error && response.status === 200) {
          await this.logIn()
        }
      },
      async logIn() {
        const params = {
          email: this.login,
          password: this.newPassword,
        }
        await this.loginUser(params)
      },
      goToLogin() {
        this.$router.push({ name: 'login' })
      },
      clearData() {
        Object.assign(this.$data, this.$options.data.apply(this))
        this.$refs.observer.reset()
      },
    },
    watch: {
      operator(user) {
        if (user.id) {
          this.$router.push({ name: 'incidents' })
        }
      },
    },
  }
</script>
<style scoped lang="scss"></style>
