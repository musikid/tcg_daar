<script setup lang="ts">
const { appName, appLogo } = useAppConfig()
</script>

<template>
  <img :src="appLogo" :alt="`${appName} logo`">
</template>
