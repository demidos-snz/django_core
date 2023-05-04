<template>
  <v-container fluid class="custom-table-content fill-height">
    <v-row class="fill-height">
      <v-col class="fill-height left-list-panel py-0" cols="3">
        <v-card outlined class="fill-height" elevation="24">
          <v-card-title class="justify-space-between title">
            {{ $t('users.users') }}
            <UserCreationDialog :disabled="!canCreateUser" />
          </v-card-title>
          <v-col class="d-flex flex-row pa-2 ma-0 filter-field">
            <v-checkbox
              :input-value="getActivenessFilterValue(activenessTypes.ACTIVE)"
              @change="handleActivenessFilter(activenessTypes.ACTIVE, $event)"
              :label="$t('users.activenessTypes.active')"
              class="d-flex align-center px-3 ma-0 text-no-wrap text-truncate"
              hide-details
            ></v-checkbox>
            <v-checkbox
              :input-value="getActivenessFilterValue(activenessTypes.INACTIVE)"
              @change="handleActivenessFilter(activenessTypes.INACTIVE, $event)"
              :label="$t('users.activenessTypes.inactive')"
              class="d-flex align-center px-3 ma-0"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col class="d-flex flex row pa-0 ma-0">
            <v-text-field
              v-model="search"
              :label="$t('users.search')"
              outlined
              clearable
              hide-details
              class="px-3 py-2 search-field"
            ></v-text-field>
            <v-col cols="auto" class="d-flex align-center justify-center pl-0"><UsersFilterModal /></v-col>
          </v-col>

          <v-list shaped class="item-list overflow-auto">
            <v-list-item-group :value="selectedUserId" color="primary">
              <v-list-item
                :value="user.id"
                v-for="user in filteredUsers"
                :key="user.id"
                @click.prevent="setSelectedUser(user.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ user.fullName }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col class="fill-height py-0" cols="9">
        <v-card outlined class="fill-height" elevation="24">
          <UserData />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import UserCreationDialog from '@/components/dialogs/UserCreationDialog'
  import UserData from '@/components/Users/UserData'
  import { mapGetters, mapActions, mapState } from 'vuex'
  import { sortBy, isEmpty } from 'lodash'
  import rightsMixin from '@/mixins/rightsMixin'
  import UsersFilterModal from '@/components/dialogs/UsersFilterModal'
  import { ACTIVENESS_TYPE } from '@/constants/enums'
  import { toStorage, fromStorage } from '@/store/utils'

  export default {
    name: 'Users',
    components: {
      UserCreationDialog,
      UserData,
      UsersFilterModal,
    },
    mixins: [rightsMixin],
    data: () => ({
      search: '',
      activenessTypes: ACTIVENESS_TYPE,
    }),
    methods: {
      ...mapActions('users', ['selectUserId', 'deselectUserId', 'setActivenessFilter']),
      setSelectedUser(id) {
        if (this.selectedUserId === id) {
          this.deselectUserId()
        } else {
          this.selectUserId(id)
        }
      },
      getActivenessFilterValue(type) {
        return this.activenessFilter.includes(type)
      },
      handleActivenessFilter(type, value) {
        let filterData = [...this.activenessFilter]
        if (!value && filterData.includes(type) && filterData.length == 1) {
          // Keeping active at least one checkbox
          switch (type) {
            case this.activenessTypes.ACTIVE:
              filterData = [this.activenessTypes.INACTIVE]
              break
            case this.activenessTypes.INACTIVE:
              filterData = [this.activenessTypes.ACTIVE]
              break
            default:
              break
          }
        } else {
          if (value) {
            if (!filterData.includes(type)) {
              filterData.push(type)
            }
          } else {
            if (filterData.includes(type)) {
              filterData = filterData.filter((item) => item !== type)
            }
          }
        }

        this.setActivenessFilter(filterData)
      },
      loadFilters() {
        const key = `userActivenessFilter${this.operator.id}`
        const filters = fromStorage(key)
        const parsedFilters = JSON.parse(filters)

        if (parsedFilters) {
          this.setActivenessFilter(parsedFilters)
        }
      },
      storeFilters() {
        const key = `userActivenessFilter${this.operator.id}`
        const stringifiedFilters = JSON.stringify(this.activenessFilter)

        toStorage(key, stringifiedFilters)
      },
    },
    computed: {
      ...mapGetters('users', ['users']),
      ...mapState('users', ['selectedUserId', 'activenessFilter', 'filters']),
      filteredUsers() {
        let filteredUsers = Object.values(this.users)
        filteredUsers = filteredUsers.filter((item) => {
          if (item.isActive && !this.activenessFilter.includes(this.activenessTypes.ACTIVE)) return false
          if (!item.isActive && !this.activenessFilter.includes(this.activenessTypes.INACTIVE)) return false

          if (!isEmpty(this.filters)) {
            if (this.filters.roles) {
              if (!this.filters.roles.includes(item.role)) return false
            }
          }

          if (this.search) {
            const nameMatch = item.fullName.toLowerCase().includes(this.search.toLowerCase())
            const organizationMatch = item.organizations.some((org) =>
              org.name.toLowerCase().includes(this.search.toLowerCase())
            )
            const emailMatch = item.email.toLowerCase().includes(this.search.toLowerCase())
            const resultMatch = nameMatch || organizationMatch || emailMatch
            return resultMatch
          }

          return true
        })

        return sortBy(filteredUsers, 'fullName')
      },
    },
    created() {
      window.addEventListener('unload', this.storeFilters)
      this.loadFilters()
    },
    beforeDestroy() {
      this.storeFilters()
    },
  }
</script>
<style lang="scss"></style>
