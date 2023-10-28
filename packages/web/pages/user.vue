<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'user',
})
</script>

<template>
  <div>
    <User />
  </div>
</template>
