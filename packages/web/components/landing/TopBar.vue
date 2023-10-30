<script setup lang="ts">
interface Props {
  appName: string
  appLogo: string
}

const { appName, appLogo } = defineProps<Props>()
</script>

<template>
  <nav class="p-8 bg-neutral9/95 border-b-4 border-neutral8/20 backdrop-blur">
    <div class="flex items-center justify-around flex-row">
      <div>
        <NuxtLink href="/">
          <img :src="appLogo" :alt="`${appName} Logo`">
        </NuxtLink>
      </div>
      <div class="flex items-center gap-16 justify-self-end">
        <LandingStatusButton />
        <NuxtLink href="https://github.com/musikid/tcg_daar" target="_blank" rel="noopener noreferrer">
          <div class="i-mdi-github w-10 h-10 hover:color-primary transition-color">
          </div>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
