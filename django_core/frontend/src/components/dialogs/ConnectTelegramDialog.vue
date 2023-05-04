<template>
  <v-dialog v-model="isActive" max-width="400px" persistent>
    <template v-slot:activator="{ on, attrs }" v-if="!operator.telegramChatId">
      <v-btn color="success" v-bind="attrs" v-on="on" icon small>
        <v-icon class="connect-telegram" color="success" dark v-bind="attrs" v-on="on">
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title class="white--text headline">
        <span class="headline">{{ $t('dialogs.loggedUserModal.connect_telegram') }}</span>
      </v-card-title>
      <v-card-text class="py-4 text-center">
        <img v-if="qrCodeImg" width="350" :src="qrCodeImg" alt="" />
        <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
      </v-card-text>
      <v-card-actions class="pb-5 px-4">
        <v-spacer></v-spacer>
        <v-btn color="red" outlined @click="closeDialog">
          {{ $t('main.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getQrCode } from '@/api/auth'

  export default {
    name: 'ConnectTelegramDialog',
    data: () => ({
      isActive: false,
      qrCodeImg: null,
    }),
    computed: {
      ...mapGetters('operator', ['operator']),
    },
    methods: {
      closeDialog() {
        this.isActive = false
      },

      getImageSrc() {
        getQrCode().then((payload) => {
          const [error, response] = payload
          if (!error) {
            const data = response.data
            this.$set(this, 'qrCodeImg', data)
          }
        })
      },
    },
    watch: {
      'isActive'(newVal) {
        if (newVal) {
          this.getImageSrc()
        }
      },
      'operator.telegramChatId'(chatId) {
        if (chatId) {
          this.closeDialog()
        }
      },
    },
  }
</script>
