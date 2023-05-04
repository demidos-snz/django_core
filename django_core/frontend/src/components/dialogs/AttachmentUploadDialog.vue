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
          <span class="headline">{{ $t('dialogs.attachmentUpload.attachment_upload') }}</span>
        </v-card-title>
        <v-card-text class="py-4">
          <v-row class="d-flex flex-column">
            <v-col class="pb-0">
              <validation-provider name="Description" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="newAttachment.description"
                  :label="$t('dialogs.attachmentUpload.description')"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pb-0">
              <validation-provider name="File" rules="required" v-slot="{ errors }">
                <v-file-input
                  v-model="newAttachment.file"
                  type="file"
                  counter
                  :label="$t('dialogs.attachmentUpload.attachment')"
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
          <v-btn color="green" outlined @click="addFile" :disabled="invalid">
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

  const NEW_ATTACHMENT = {
    description: '',
    file: null,
  }

  export default {
    name: 'AttachmentUploadDialog',
    mixins: [validationMixin],
    props: {
      disabled: {
        type: Boolean,
        required: true,
      },
    },
    data: () => ({
      isActive: false,
      newAttachment: { ...NEW_ATTACHMENT },
      saveDisabled: false,
    }),
    methods: {
      ...mapActions('incidents', ['createAttachment']),
      closeDialog() {
        Object.assign(this.$data, this.$options.data.apply(this))
      },
      async addFile() {
        this.saveDisabled = true
        const [error, response] = await this.createAttachment(this.newAttachment)
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
