<script setup lang="ts">
useSeoMeta({
  description: 'Dashboard',
  titleTemplate: (title) => title ? `${title} - Dashboard` : 'Dashboard',
})
definePageMeta({
  name: 'Dashboard',
  layout: 'dashboard',
})

</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
