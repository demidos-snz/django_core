<template>
  <component :is="currentComponent"> </component>
</template>

<script>
  import IncidentPage from '@/components/Incidents/IncidentPage'
  import Incidents from '@/components/Incidents/Incidents'

  export default {
    name: 'IncidentPageWrapper',
    components: {
      IncidentPage,
      Incidents,
    },
    computed: {
      currentComponent() {
        return this.$route.params.incidentId ? IncidentPage : Incidents
      },
    },
  }
</script>
