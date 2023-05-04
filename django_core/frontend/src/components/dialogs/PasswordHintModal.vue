<template>
  <div class="d-flex flex-column flex-wrap max-width-250">
    <span v-for="rule in getPasswordRules()" :key="rule.id">
      {{ `- ${rule.text}` }}
    </span>
  </div>
</template>

<script>
  import { getPasswordRules } from '@/constants/constants'

  export default {
    name: 'PasswordHintModal',
    data: () => ({}),
    methods: {
      getPasswordRules,
    },
  }
</script>
<style scoped></style>
