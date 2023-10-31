<script setup lang="ts">
interface Props {
  icon: string
  text: string
}

const { icon, text } = defineProps<Props>()
</script>

<template>
  <NuxtLink class="inline-flex py-2 px-4 gap-2 rounded-lg text-[#94A3B8] hover:(bg-white/5 text-[#e0e7ff]) transition-all"
    active-class="bg-white/10 text-[#e0e7ff]">
    <span class="h-5 w-5 self-center" :class="icon"></span>
    <p class="font-sans font-semibold text-xl">{{ text }}</p>
  </NuxtLink>
</template>