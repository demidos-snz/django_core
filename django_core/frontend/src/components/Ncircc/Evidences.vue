<template>
  <div>
    <v-data-table
      fixed-header
      calculate-widths
      :headers="tableConstants.evidenceTableHeaders"
      :items="incident.ncircc.evidences"
      item-key="id"
      dense
      :multi-sort="false"
      height="calc(100vh - 210px)"
      class="elevation-0"
    >
      <template v-for="h in tableConstants.evidenceTableHeaders" v-slot:[`header.${h.value}`]="{ header }">
        {{ $t(`ncircc.evidences.table.${header.value}`) }}
      </template>
      <template v-slot:[`item.created`]="{ item }">
        {{ item.created }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon small color="green" :href="item.file" :disabled="!item.file" target="_blank" download class="mr-1">
          <v-icon dark> mdi-download </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import Incident from '@/store/models/incident'
  import { tableConstants } from '@/constants/constants'
  import rightsMixin from '@/mixins/rightsMixin'
  import tableFiltersMixin from '@/mixins/tableFiltersMixin'

  export default {
    name: 'Evidences',
    props: {
      incident: {
        type: Incident,
        required: true,
      },
    },
    mixins: [tableFiltersMixin, rightsMixin],
    data: () => ({
      tableConstants: tableConstants,
    }),
  }
</script>
