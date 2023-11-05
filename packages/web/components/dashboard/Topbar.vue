<script setup lang="ts">
defineEmits(['menuTo'])
defineProps<{ disconnect: () => void }>()
</script>

<template>
  <div class="flex w-100% py-4 px-8 h-20 items-center border-[#1B1B1B] border-l-2 bg-background-element">
    <div class="flex lg:hidden myauto">
      <button type="button" @click="$emit('menuTo')" class="hfull wfull myauto h-8 w-8 text-white i-mdi-menu">
      </button>
    </div>
    <div class="my-auto flex-1 flex">
      <DashboardSearchBar class="m-auto" />
      <button type="button" class="self-end m-auto flex-1 flex justify-end" @click="disconnect">
        <div class="i-mdi:logout  h-10 w-10"></div>
      </button>
    </div>
  </div>
</template>
