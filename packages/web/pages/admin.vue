<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})
</script>

<template>
  <div>
    <AdminMainHero />
  </div>
</template>
