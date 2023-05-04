<template>
  <v-dialog v-model="isActive" max-width="600px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" class="pa-0" x-small outlined rounded>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.sensorCreationDialog.sensor_creation') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="d-flex pb-0">
              <validation-provider name="Identifier" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newSensor.identifier"
                  :label="$t('dialogs.sensorCreationDialog.identifier')"
                  :hint="$t('fieldHints.sensor.identifier')"
                  outlined
                  :error-messages="errors"
                  clearable
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Name" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newSensor.name"
                  :label="$t('dialogs.sensorCreationDialog.name')"
                  :hint="$t('fieldHints.sensor.name')"
                  outlined
                  :error-messages="errors"
                  clearable
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="HomeNet" rules="required" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newSensor.homeNet"
                  :label="$t('dialogs.sensorCreationDialog.home_net')"
                  :hint="$t('fieldHints.sensor.home_net')"
                  outlined
                  :error-messages="errors"
                  clearable
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="SensorType" rules="required" class="half-width" v-slot="{ errors }">
                <v-select
                  :no-data-text="$t('main.no_data')"
                  :items="sensorTypes"
                  v-model="newSensor.typeSensor"
                  item-text="name"
                  item-value="id"
                  :label="$t('dialogs.sensorCreationDialog.sensor_type')"
                  outlined
                  :error-messages="errors"
                  class="pl-2"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <validation-provider name="Address" rules="required|ip" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newSensor.address"
                  :label="$t('dialogs.sensorCreationDialog.address')"
                  :hint="$t('fieldHints.sensor.address')"
                  outlined
                  :error-messages="errors"
                  clearable
                  class="pr-2"
                ></v-text-field>
              </validation-provider>
              <validation-provider name="Url" rules="required|url" class="half-width" v-slot="{ errors }">
                <v-text-field
                  v-model="newSensor.url"
                  label="URL"
                  :hint="$t('fieldHints.sensor.url')"
                  outlined
                  :error-messages="errors"
                  clearable
                  class="pl-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="d-flex pb-0">
              <v-text-field
                v-model="newSensor.login"
                :label="$t('dialogs.sensorCreationDialog.login')"
                :hint="$t('fieldHints.sensor.login')"
                outlined
                clearable
                class="pr-2"
              ></v-text-field>
              <v-text-field
                v-model="newSensor.password"
                :label="$t('dialogs.sensorCreationDialog.password')"
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
          <v-btn color="green" outlined @click="saveSensor" :disabled="invalid || saveDisabled">
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
  import { sensorTypes } from '@/constants/constants'

  const NEW_SENSOR = {
    name: '',
    identifier: '',
    address: '',
    url: '',
    homeNet: '',
    typeSensor: null,
    login: '',
    password: '',
  }

  export default {
    name: 'UserCreationDialog',
    props: {
      segmentId: {
        type: Number,
        required: true,
      },
    },
    mixins: [validationMixin],
    data: () => ({
      isActive: false,
      newSensor: { ...NEW_SENSOR },
      saveDisabled: false,
      sensorTypes: Object.values(sensorTypes),
    }),
    methods: {
      ...mapActions('organizations', ['createSensorInstance']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async saveSensor() {
        this.saveDisabled = true
        this.newSensor.segmentId = this.segmentId
        const [error, response] = await this.createSensorInstance(this.newSensor)
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
