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
        <a href="/">
          <img :src="appLogo" :alt="`${appName} Logo`">
        </a>
      </div>
      <div class="flex items-center gap-16 justify-self-end">
        <LandingStatusButton />
        <a href="https://github.com/musikid/tcg_daar" target="_blank" rel="noopener noreferrer">
          <div class="i-mdi-github w-10 h-10 hover:color-primary transition-color">
          </div>
        </a>
      </div>
    </div>
  </nav>
</template>
