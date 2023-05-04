<template>
  <div class="notifications-comments fill-height">
    <v-row class="my-0 px-3 py-2 d-flex flex-column">
      <v-col class="message-history-col" cols="9" ref="msgList">
        <v-timeline class="pb-1 pt-0">
          <v-timeline-item
            class="pb-1"
            color="blue darken-4"
            v-for="comment in incident.ncircc.comments"
            :key="comment.id"
            :left="!comment.isImUserAuthor"
            :right="comment.isImUserAuthor"
            small
          >
            <span slot="opposite">{{ comment.createdDatetime }}</span>
            <v-card outlined>
              <v-card-title
                class="h-3 pb-2 pt-1"
                :class="comment.isImUserAuthor ? 'justify-space-between' : 'justify-start'"
              >
                <span class="subtitle-2">
                  {{ comment.user.fullName }}
                </span>
              </v-card-title>
              <v-card-text class="pb-2 text-left">
                <div v-for="(text, index) in comment.text.split('\n')" :key="index">
                  {{ text }}
                </div>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-col class="message-input-col" cols="9">
        <v-textarea
          outlined
          rows="2"
          no-resize
          v-model="commentText"
          hide-details
          clear-icon="mdi-close-circle"
          class="text-wrap"
          :label="$t('incidents.incidentTableData.commentsTab.message')"
          type="text"
          @keyup.ctrl.enter="sendComment"
          @click:clear="clearComment"
          :placeholder="$t('incidents.incidentTableData.commentsTab.ctrlEnter')"
        >
          <template v-slot:append-outer>
            <v-btn icon v-if="!sending" @click="sendComment">
              <v-icon> mdi-send </v-icon>
            </v-btn>
            <v-progress-circular class="mr-4" indeterminate v-else />
          </template>
        </v-textarea>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import Incident from '@/store/models/incident'
  import { mapActions } from 'vuex'

  export default {
    name: 'Comments',
    props: {
      incident: {
        type: Incident,
        required: true,
      },
    },
    data: () => ({
      sending: false,
      commentText: '',
    }),
    methods: {
      ...mapActions('incidents', ['createNcirccNotificationComment']),

      async sendComment() {
        if (this.commentText) {
          this.sending = true
          const [error, response] = await this.createNcirccNotificationComment(this.commentText)
          if (!error && response.status === 201) {
            this.clearComment()
          }
          this.sending = false
        }
      },

      clearComment() {
        this.$set(this, 'commentText', '')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .notifications-comments {
    .message-input-col {
      position: absolute;
      bottom: 80px;
      height: 80px;
    }

    .message-history-col {
      position: absolute;
      bottom: 150px;
      overflow-y: auto;
      height: calc(100% - 210px);
    }
  }
</style>
