<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mx-2" color="success" :disabled="disabled" v-bind="attrs" v-on="on" icon small>
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('dialogs.iocSelectionDialog.ioc_selection') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Name" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="ioc.host"
                  :error-messages="errors"
                  :label="$t('dialogs.iocSelectionDialog.host')"
                  outlined
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <v-text-field v-model="ioc.hash" :label="$t('dialogs.iocSelectionDialog.hash')" outlined></v-text-field>
            </v-col>
            <v-col class="pb-0">
              <v-text-field v-model="ioc.ip" :label="$t('dialogs.iocSelectionDialog.ip')" outlined></v-text-field>
            </v-col>
            <v-col class="pb-0">
              <v-text-field v-model="ioc.url" :label="$t('dialogs.iocSelectionDialog.url')" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="add" :disabled="invalid || !valid">
            {{ $t('main.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { isNil } from 'lodash'
  import validationMixin from '../../mixins/validationMixin'

  export default {
    name: 'IocSelectionDialog',
    mixins: [validationMixin],
    props: {
      incidentId: {
        type: Number,
        required: true,
      },
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
      ioc: {
        hash: null,
        ip: '',
        url: '',
        host: '',
      },
    }),
    methods: {
      ...mapActions(['addIoc']),
      closeDialog() {
        // Drops component data to initial value
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async add() {
        const params = { id: this.incidentId, params: this.ioc }
        await this.addIoc(params)
        if (isNil(this.lastError)) {
          this.closeDialog()
        }
      },
    },
    computed: {
      ...mapGetters(['lastError']),
      valid() {
        return this.ioc.hash || this.ioc.ip || this.ioc.url
      },
    },
    watch: {
      async isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
