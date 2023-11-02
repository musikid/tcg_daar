<script setup lang="ts">
useSeoMeta({
  description: 'Dashboard',
  titleTemplate: title => title ? `${title} - Dashboard` : 'Dashboard',
})
definePageMeta({
  name: 'Dashboard',
  layout: 'dashboard',
})
</script>

<template>
  <div class="flex h-full w-full">
    <NuxtPage class="w-full overflow-y-auto" />
  </div>
</template>
