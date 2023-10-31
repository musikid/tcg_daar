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
    <h2 class="font-sans text-4xl">Dashboard</h2>
    <NuxtPage />
  </div>
</template>
