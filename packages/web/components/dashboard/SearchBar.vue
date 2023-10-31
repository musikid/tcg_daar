<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

interface Props {
  icon?: string
}

const props = defineProps<Props>()
const icon = computed(() => props.icon ?? 'i-mdi-magnify')

const { class: cssClass, ...restAttrs } = useAttrs()
</script>

<template>
  <div :class="cssClass" class="relative font-sans text-white">
    <label for="search" class="sr-only"> Search </label>

    <input type="text" id="search" v-bind="restAttrs" placeholder="Search for..."
      class="w-full rounded-3xl border-0 focus:(border-none outline-none ring-none shadow-none) bg-stone-950 border-stone-9 py-2.5 pe-10 sm:text-sm" />

    <span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
      <button type="button" class="text-gray-600 hover:text-gray-700 h-6 w-6">
        <span class="sr-only">Search</span>

        <div class="h-100% w-100% font-black" :class="icon"></div>
      </button>
    </span>
  </div>
</template>
