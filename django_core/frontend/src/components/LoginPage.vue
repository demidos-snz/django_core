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
                      :label="$t('loginPage.login')"
                      @keyup.enter="logIn"
                      outlined
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col>
                  <validation-provider name="Password" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="password"
                      :label="$t('loginPage.password')"
                      @keyup.enter="logIn"
                      outlined
                      :type="passwordHidden ? 'password' : 'text'"
                      :error-messages="errors"
                    >
                      <template v-slot:append>
                        <div class="v-input__icon v-input__icon--append">
                          <v-btn @click="() => (passwordHidden = !passwordHidden)" icon>
                            <v-icon>{{ passwordHidden ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
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
                  <v-btn class="mr-4" color="success" :disabled="invalid" @click="logIn">
                    {{ $t('loginPage.enter') }}
                  </v-btn>
                  <v-btn @click="clearData">
                    {{ $t('main.clear') }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="goToPasswordChange">
                    {{ $t('loginPage.change_password') }}
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

  export default {
    name: 'LoginPage',
    mixins: [validationMixin],
    data: () => ({
      login: '',
      password: '',
      passwordHidden: true,
    }),
    computed: {
      ...mapGetters('operator', ['operator']),
    },
    methods: {
      ...mapActions('operator', ['loginUser']),
      ...mapActions('ui', ['changeLocale']),
      async logIn() {
        this.$refs.observer.validate().then(async (validData) => {
          if (validData) {
            const params = {
              email: this.login,
              password: this.password,
            }
            await this.loginUser(params)
          }
        })
      },
      goToPasswordChange() {
        this.$router.push({ name: 'password_change' })
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
