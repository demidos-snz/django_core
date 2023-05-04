<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" outlined class="mx-3" v-bind="attrs" v-on="on" x-large>
        <v-icon class="pr-3"> mdi-plus</v-icon>
        {{ $t('dialogs.bulletinCreationDialog.bulletin') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.bulletinCreationDialog.bulletin_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newBulletin.name"
                  :label="$t('dialogs.bulletinCreationDialog.name')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="Number" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newBulletin.number"
                  :label="$t('dialogs.bulletinCreationDialog.number')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="typeBulletin" rules="required" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="bulletinTypes"
                  v-model="newBulletin.typeBulletin"
                  item-value="id"
                  item-text="name"
                  :label="$t('dialogs.bulletinCreationDialog.typeBulletin')"
                  :error-messages="errors"
                  outlined
                  :menu-props="{
                    maxWidth: 350,
                  }"
                >
                </v-select>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="File" rules="required" v-slot="{ errors }">
                <v-file-input
                  v-model="newBulletin.file"
                  type="file"
                  counter
                  :label="$t('dialogs.bulletinCreationDialog.file')"
                  prepend-icon="mdi-paperclip"
                  outlined
                  :error-messages="errors"
                  :show-size="1000"
                ></v-file-input>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <v-dialog
                ref="dateDialog"
                v-model="dateModal"
                :return-value.sync="newBulletin.registrationDate"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider name="registrationDate" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="newBulletin.registrationDate"
                      :label="$t('dialogs.bulletinCreationDialog.registration_date')"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      :error-messages="errors"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker
                  v-model="newBulletin.registrationDate"
                  scrollable
                  color="primary"
                  header-color="grey darken-3"
                  :max="todayDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dateModal = false">
                    {{ $t('main.cancel') }}
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.dateDialog.save(newBulletin.registrationDate)">
                    {{ $t('main.ok') }}
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col class="pb-0 pt-0">
              <v-checkbox
                class="ma-0 ml-2 mt-3"
                v-model="newBulletin.isNccci"
                hide-details
                :label="$t('organizations.gossopka')"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="saveBulletin" :disabled="invalid || saveDisabled">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import { getBulletinTypes } from '@/constants/constants'
  import validationMixin from '@/mixins/validationMixin'

  const NEW_BULLETIN = {
    name: null,
    typeBulletin: null,
    number: null,
    registrationDate: null,
    file: null,
    isNccci: false,
  }

  export default {
    name: 'BulletinCreationDialog',
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      dateModal: false,
      newBulletin: { ...NEW_BULLETIN },
      saveDisabled: false,
      todayDate: new Date().toISOString().substr(0, 10),
    }),
    methods: {
      ...mapActions('bulletins', ['createBulletinInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveBulletin() {
        this.saveDisabled = true
        const [error, response] = await this.createBulletinInstance(this.newBulletin)
        if (!error && response.status === 201) {
          this.closeDialog()
        } else {
          this.saveDisabled = false
        }
      },
    },
    computed: {
      bulletinTypes() {
        return Object.values(getBulletinTypes())
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
