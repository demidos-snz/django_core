<template>
  <v-dialog v-model="isActive" max-width="650px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="white" class="mr-3" outlined v-bind="attrs" v-on="on">
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.siemCreationDialog.analytic_system_creation') }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-radio-group v-model="newSiem.typeSiem" :column="false">
                <v-radio class="mr-3" label="TIAS" :value="siemTypes.TIAS"></v-radio>
                <v-radio label="Elastic" :value="siemTypes.ELASTIC"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Id" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newSiem.identifier"
                  :label="$t('dialogs.siemCreationDialog.identifier')"
                  outlined
                  clearable
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newSiem.name"
                  :label="$t('dialogs.siemCreationDialog.name')"
                  outlined
                  clearable
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Addres" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newSiem.address"
                  :label="$t('dialogs.siemCreationDialog.address')"
                  outlined
                  clearable
                  :error-messages="errors"
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Url" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newSiem.url"
                  label="URL"
                  outlined
                  clearable
                  :error-messages="errors"
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <v-text-field
                v-model="newSiem.login"
                :label="$t('dialogs.siemCreationDialog.login')"
                outlined
                clearable
                class="pr-2"
              ></v-text-field>
              <v-text-field
                v-model="newSiem.password"
                :label="$t('dialogs.siemCreationDialog.password')"
                outlined
                clearable
                type="password"
                class="pl-2"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveSiem" :disabled="invalid || saveDisabled">
            {{ $t('main.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import validationMixin from '../../mixins/validationMixin'
  import { SIEM_TYPES } from '@/constants/enums'

  const NEW_SIEM = {
    address: '',
    name: '',
    login: '',
    password: '',
    identifier: '',
    url: '',
    typeSiem: SIEM_TYPES.TIAS,
  }

  export default {
    name: 'SiemCreationDialog',
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      newSiem: { ...NEW_SIEM },
      saveDisabled: false,
      siemTypes: SIEM_TYPES,
    }),
    methods: {
      ...mapActions('organizations', ['createSiemInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveSiem() {
        this.saveDisabled = true
        const [error, response] = await this.createSiemInstance(this.newSiem)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    watch: {
      async isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
