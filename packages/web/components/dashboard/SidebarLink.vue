<script setup lang="ts">
interface Props {
  icon: string
  text: string
}

const { icon, text } = defineProps<Props>()
</script>

<template>
  <NuxtLink class="inline-flex py-2 px-4 gap-3 rounded-lg text-[#94A3B8] hover:(bg-white/5 text-[#e0e7ff]) transition-all"
    active-class="bg-white/10 text-[#e0e7ff]">
    <span class="min-h-5 min-w-5 self-center" :class="icon"></span>
    <p class="font-sans grow-0 font-semibold text-xl">{{ text }}</p>
  </NuxtLink>
</template>