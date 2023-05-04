<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined color="green" v-bind="attrs" v-on="on">
        {{ $t('ncircc.evidences.add') }}
      </v-btn>
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }" v-if="isActive">
      <v-card outlined>
        <v-progress-linear :active="sending" indeterminate absolute top></v-progress-linear>
        <v-card-title class="white--text headline">
          <span class="headline">{{ $t('ncircc.evidences.upload') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="file" rules="required" v-slot="{ errors }">
                <v-file-input
                  v-model="newEvidence.file"
                  type="file"
                  counter
                  :label="$t('ncircc.evidences.file')"
                  prepend-icon="mdi-paperclip"
                  outlined
                  :error-messages="errors"
                  :show-size="1000"
                ></v-file-input>
              </validation-provider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5 px-4">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeDialog">
            {{ $t('main.cancel') }}
          </v-btn>
          <v-btn color="green" outlined @click="addFile" :disabled="sending || invalid">
            {{ $t('main.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
  import validationMixin from '@/mixins/validationMixin'
  import { mapActions } from 'vuex'

  const NEW_EVIDENCE = {
    file: null,
  }

  export default {
    name: 'EvidenceUploadDialog',
    mixins: [validationMixin],
    data: () => ({
      newEvidence: { ...NEW_EVIDENCE },
      isActive: false,
      sending: false,
    }),
    methods: {
      ...mapActions('incidents', ['createEvidence']),

      closeDialog() {
        Object.assign(this.$data, this.$options.data.apply(this))
      },

      async addFile() {
        this.sending = true
        const [error, response] = await this.createEvidence(this.newEvidence)
        if (!error && response.status === 201) {
          this.closeDialog()
        }
        this.sending = false
      },
    },
    watch: {
      isActive(newVal) {
        newVal || this.closeDialog()
      },
    },
  }
</script>
