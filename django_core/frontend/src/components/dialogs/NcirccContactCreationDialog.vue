<template>
  <v-dialog v-model="isActive" max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      {{ $t('dialogs.ncirccCreationDialog.additional_contacts') }}
      <v-btn color="success" v-bind="attrs" v-on="on" icon small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.ncirccCreationDialog.contact_adding') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="FullName" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newContact.name"
                  :label="$t('dialogs.ncirccCreationDialog.full_name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Email" rules="required|email" v-slot="{ errors }">
                <v-text-field
                  v-model="newContact.email"
                  :label="$t('dialogs.ncirccCreationDialog.email')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Phone" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newContact.phone"
                  :label="$t('dialogs.ncirccCreationDialog.phone')"
                  outlined
                  :error-messages="errors"
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
          <v-btn color="green" outlined @click="addContact" :disabled="invalid">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import validationMixin from '@/mixins/validationMixin'

  const NEW_CONTACT = {
    name: '',
    email: '',
    phone: '',
  }

  export default {
    name: 'NcirccContactCreationDiaog',
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      newContact: { ...NEW_CONTACT },
      saveDisabled: false,
    }),
    methods: {
      ...mapActions('organizations', ['createContactInstance']),
      closeDialog() {
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async addContact() {
        this.saveDisabled = true
        this.newContact.ncirccId = this.selectedOrganizationNcircc.id
        const [error, response] = await this.createContactInstance(this.newContact)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationNcircc']),
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
