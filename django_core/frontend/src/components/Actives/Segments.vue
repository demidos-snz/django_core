<template>
  <v-scroll-y-transition mode="out-in">
    <v-card class="d-flex flex-column fill-height pa-0 ma-0">
      <v-row class="d-flex flex-row ma-0 mt-2">
        <v-col class="pa-3" cols="3">
          <v-text-field v-model="search" :label="$t('main.search')" outlined clearable hide-details></v-text-field>
        </v-col>
        <v-col class="d-flex pa-3" cols="auto">
          <v-checkbox
            v-model="isOcii"
            :label="$t('actives.only_cii_objects')"
            class="ma-0 pa-0"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col class="d-flex align-center justify-end pa-3">
          <SegmentCreationDialogInActives :disabled="!canCreateActives" />
        </v-col>
      </v-row>
      <v-row class="ma-0 mt-2 fill-height overflow-y-auto justify-center">
        <v-col v-if="filteredSegments.length > 0">
          <SegmentCard :segment="segment" v-for="segment in filteredSegments" :key="segment.id" />
        </v-col>
        <div
          v-else
          class="d-flex fill-height title align-center justify-center grey--text text--lighten-1 font-weight-light"
        >
          {{ $t('actives.segmentsTab.no_segments') }}
        </div>
      </v-row>
    </v-card>
  </v-scroll-y-transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightsMixin from '@/mixins/rightsMixin'
  import SegmentCard from '@/components/Actives/SegmentCard'
  import SegmentCreationDialogInActives from '@/components/dialogs/SegmentCreationDialogInActives'

  export default {
    name: 'Segments',
    data: () => ({
      search: '',
      isOcii: false,
    }),
    mixins: [rightsMixin],
    components: {
      SegmentCard,
      SegmentCreationDialogInActives,
    },
    computed: {
      ...mapGetters('organizations', ['selectedOrganizationSegmentsInActives']),
      filteredSegments() {
        let segments = Object.values(this.selectedOrganizationSegmentsInActives)
        segments = segments.filter((item) => {
          let result = true
          if (this.isOcii && !item.isOcii) return false
          if (this.search) {
            const match = item.name.toLowerCase().includes(this.search.toLowerCase())
            result = result && match
          }

          return result
        })

        return segments
      },
    },
  }
</script>
<style lang="scss"></style>
