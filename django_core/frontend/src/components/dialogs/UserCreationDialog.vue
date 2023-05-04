<template>
  <v-dialog v-model="isActive" max-width="700px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" v-bind="attrs" v-on="on" :disabled="disabled" icon large>
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.userCreationDialog.user_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="d-flex pb-0">
              <validation-provider name="Name" rules="required|alpha" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newUser.name"
                  :label="$t('dialogs.userCreationDialog.name')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Surname" rules="required|alpha" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newUser.surname"
                  :label="$t('dialogs.userCreationDialog.surname')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Patronymic" rules="alpha" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newUser.patronymic"
                  :label="$t('dialogs.userCreationDialog.patronymic')"
                  outlined
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Email" rules="required|email" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newUser.email"
                  :label="$t('dialogs.userCreationDialog.email')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Password" :rules="passwordRules" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newUser.password1"
                  :label="$t('dialogs.userCreationDialog.password')"
                  outlined
                  :error-messages="errors"
                  :type="isPasswordHidden ? 'password' : 'text'"
                  class="pr-2"
                >
                  <template v-slot:append>
                    <div class="v-input__icon v-input__icon--append">
                      <v-btn @click="() => (isPasswordHidden = !isPasswordHidden)" icon>
                        <v-icon>{{ isPasswordHidden ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
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
                    </div>
                  </template>
                </v-text-field>
              </validation-provider>
              <validation-provider
                name="Confirmation"
                rules="required|confirmed:Password"
                class="half-width"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="newUser.password2"
                  :label="$t('dialogs.userCreationDialog.password_confirmation')"
                  outlined
                  :error-messages="errors"
                  :type="isConfirmationHidden ? 'password' : 'text'"
                  class="pl-2"
                >
                  <template v-slot:append>
                    <div class="v-input__icon v-input__icon--append">
                      <v-btn @click="() => (isConfirmationHidden = !isConfirmationHidden)" icon>
                        <v-icon>{{ isConfirmationHidden ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Role" rules="required" class="half-width" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="userRoles"
                  v-model="newUser.role"
                  item-value="id"
                  item-text="name"
                  :label="$t('dialogs.userCreationDialog.role')"
                  :error-messages="errors"
                  outlined
                  class="pr-2"
                >
                </v-select>
              </validation-provider>
              <validation-provider name="Phone" rules="phone" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newUser.phone"
                  :label="$t('dialogs.userCreationDialog.phone')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveUser" :disabled="invalid || saveDisabled">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'
  import { getUserRoles } from '@/constants/constants'
  import PasswordHintModal from '@/components/dialogs/PasswordHintModal'

  const NEW_USER = {
    name: '',
    surname: '',
    patronymic: '',
    password1: '',
    password2: '',
    email: '',
    phone: null,
    role: null,
  }

  export default {
    name: 'UserCreationDialog',
    components: {
      PasswordHintModal,
    },
    props: {
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      isPasswordHidden: true,
      isConfirmationHidden: true,
      newUser: { ...NEW_USER },
      saveDisabled: false,
    }),
    computed: {
      userRoles() {
        return Object.values(getUserRoles())
      },
      passwordRules() {
        const rules = [
          'required',
          'characters_between:8,16',
          'at_least_one_lower',
          'at_least_one_upper',
          'at_least_one_digit',
          'at_least_one_special',
          'no_whitespace',
          'password_incorrect_symbols',
        ]

        return rules.join('|')
      },
    },
    methods: {
      ...mapActions('users', ['createUserInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveUser() {
        this.saveDisabled = true
        const [error, response] = await this.createUserInstance(this.newUser)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
