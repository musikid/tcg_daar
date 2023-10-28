<script setup lang="ts">
const { appName } = useAppConfig()
</script>

<template>
  <nav class="p-8 bg-neutral9/95 border-b-4 border-neutral8/20 backdrop-blur">
    <div class="flex items-center justify-around flex-row">
      <div>
        <a href="#">
          <img src="" :alt="`${appName} Logo`">
        </a>
      </div>
      <div class="flex items-center gap-16 justify-self-end">
        <LandingSignInButton class="flex-1 w-100%" />
        <a href="https://github.com/musikid/tcg_daar" target="_blank" rel="noopener noreferrer">
          <div class="i-mdi-github w-10 h-10 hover:color-primary transition-color">
          </div>
        </a>
      </div>
    </div>
  </nav>
</template>
