<template>
  <v-container fluid class="pa-0 d-flex flex-row align-center">
    <img class="mt-1 ml-2 mr-4" src="@/../public/im-logo.png" alt="im-logo" height="30" width="40" loading="eager" />
    <v-tabs color="white" v-model="currentTab" ref="tabs">
      <v-tab to="/incidents">{{ $t('navBar.incidents') }}</v-tab>
      <v-tab to="/organizations">{{ $t('navBar.organizations') }}</v-tab>
      <v-tab :disabled="!hasReportAccess" to="/reports">{{ $t('navBar.reports') }}</v-tab>
      <v-tab to="/users">{{ $t('navBar.users') }}</v-tab>
      <v-tab to="/actives">{{ $t('navBar.actives') }}</v-tab>
      <v-tab to="/bulletins">
        <v-badge v-if="showNewBulletinsBadge" dot color="green">{{ $t('navBar.bulletins') }} </v-badge>
        <template v-else>
          {{ $t('navBar.bulletins') }}
        </template>
      </v-tab>
    </v-tabs>
    <div class="d-flex align-center text-center">
      <v-btn class="mr-2" outlined fab x-small color="white" @click="setLocale">
        {{ $i18n.locale }}
      </v-btn>
      <LoggedUserModal />
      <v-btn class="mx-2" outlined fab x-small color="white" @click="logout">
        <v-icon dark> mdi-logout </v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex'
  import LoggedUserModal from '@/components/dialogs/LoggedUserModal'
  import rightsMixin from '@/mixins/rightsMixin'

  export default {
    name: 'NavBar',
    components: {
      LoggedUserModal,
    },
    mixins: [rightsMixin],
    data: () => ({
      currentTab: null,
    }),
    computed: {
      ...mapGetters('operator', ['operator']),
      ...mapState('bulletins', ['hasNewBulletins']),

      showNewBulletinsBadge() {
        if (this.operator.isSuperuser) {
          return false
        }

        return this.hasNewBulletins
      },
    },
    methods: {
      ...mapActions('operator', ['logoutUser']),
      ...mapActions('ui', ['changeLocale']),
      setLocale() {
        this.changeLocale()
        this.$refs.tabs.onResize() // force resize to redraw v-tab slider
      },
      logout() {
        this.logoutUser()
        this.$router.push({ name: 'login' })
      },
    },
  }
</script>
<style scoped lang="scss"></style>
