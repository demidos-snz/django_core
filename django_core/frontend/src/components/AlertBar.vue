<template>
  <div class="alerts">
    <transition-group name="alert-transition" class="alert-transition" tag="div">
      <div class="alert-container" v-for="alert in alerts" :key="alert.id">
        <v-dialog v-if="alert.isDialog" scrollable :value="true" persistent max-width="60%">
          <v-card outlined>
            <v-progress-linear
              height="6"
              v-if="alert.expiring"
              :value="alert.progress"
              :buffer-value="alert.buffer"
              class="alert-progress"
              color="blue lighten-5"
            />
            <v-card-title class="text-h5"> {{ alert.title }} </v-card-title>
            <v-card-text v-html="alert.markdownText"></v-card-text>
            <v-card-actions>
              <template v-if="alert.needConfirmation">
                <v-checkbox :label="$i18n.t('main.notification_confirm')" @change="alert.confirm($event)"></v-checkbox>
              </template>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="alert.close()"> {{ $t('main.close') }} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <template v-else>
          <v-progress-linear
            height="6"
            v-if="alert.expiring"
            :value="alert.progress"
            :buffer-value="alert.buffer"
            class="alert-progress"
            color="blue lighten-5"
          />
          <v-alert class="alert-item" :type="alert.type" dense dismissible @input="alert.confirmAndClose()">
            <h4>{{ alert.title }}</h4>
            {{ alert.message }}
            <template v-if="alert.expiring" v-slot:append>
              <v-btn v-if="alert.paused" small rounded icon class="ml-3" @click="alert.start()">
                <v-icon>mdi-play-circle-outline</v-icon>
              </v-btn>
              <v-btn v-else small rounded icon class="ml-3" @click="alert.pause()">
                <v-icon>mdi-pause-circle-outline</v-icon>
              </v-btn>
            </template>
          </v-alert>
        </template>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'AlertBar',
    data: () => ({}),
    methods: {},
    computed: {
      ...mapState('alerts', ['alerts']),
    },
  }
</script>
<style lang="scss">
  .alerts,
  .alert-container,
  .alert-transition {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .alerts {
    position: absolute;
    bottom: 0;
    z-index: 210;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;

    .v-alert {
      max-width: 33vw;
      border-radius: 6px;
      .v-alert__content {
        text-overflow: ellipsis;
        display: block;
        overflow: hidden;
        white-space: nowrap;

        @supports (-webkit-line-clamp: 6) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: initial;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
        }
      }
    }

    .alert-transition {
      .alert-transition-enter-active,
      .alert-transition-leave-active {
        transition: all 0.4s;
      }
      .alert-transition-enter,
      .alert-transition-leave-to {
        opacity: 0;
      }
    }

    .alert-progress {
      width: 100%;
      top: 6px;
      z-index: 206;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
</style>
