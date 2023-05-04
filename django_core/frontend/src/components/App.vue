<template>
  <v-app id="inspire" class="app-container">
    <v-main class="fill-height overflow-hidden">
      <NavBar v-if="showNavBar" class="navbar-container" />
      <transition name="scale" mode="out-in">
        <router-view :class="mainContainerClass" v-if="showMainContainer" />
        <v-container v-else fluid :class="mainContainerClass" class="flex-column justify-center align-center">
          <h4 class="mb-4">{{ $t('main.wait') }}</h4>
          <v-progress-circular indeterminate color="white"></v-progress-circular>
        </v-container>
      </transition>
    </v-main>
    <AlertBar />
  </v-app>
</template>

<script>
  import NavBar from '@/components/NavBar'
  import AlertBar from '@/components/AlertBar'
  import { mapGetters, mapState } from 'vuex'
  import { connectSentry } from '@/utils'
  import { getSubscriptionUrl } from '@/subsctiprion/socket_connector'

  export default {
    name: 'App',
    components: {
      NavBar,
      AlertBar,
    },
    computed: {
      ...mapGetters('ui', ['startDataLoaded']),
      ...mapState('operator', ['isLogged']),
      showNavBar() {
        return this.startDataLoaded && !['login', 'notfound', 'password_change'].includes(this.$route.name)
      },
      showMainContainer() {
        return this.startDataLoaded || ['login', 'notfound', 'password_change'].includes(this.$route.name)
      },
      mainContainerClass() {
        return this.showNavBar ? 'main-with-nav' : 'fill-height'
      },
    },
    watch: {
      isLogged(logged) {
        if (logged) {
          this.$connect(getSubscriptionUrl())
        } else {
          this.$disconnect()
        }
      },
    },
    created() {
      if (this.isLogged) {
        this.$connect()
      }

      this.unwatchVersion = this.$store.watch(
        (state) => state.ui.releaseVersion,
        (version) => {
          if (version) {
            connectSentry(version)
            this.unwatchVersion()
          }
        }
      )
    },
  }
</script>
<style lang="scss" src="../styles/main.scss"></style>
<style>
  @import '../../public/fonts/roboto/roboto.css';
</style>
