<script setup lang="ts">
defineEmits(['menuTo'])
</script>

<template>
  <div class="flex w-100% py-4 px-8 h-24 items-center border-[#1B1B1B] border-l-2 bg-background-element">
    <div class="flex lg:hidden myauto">
      <button type="button" @click="$emit('menuTo')" class="hfull wfull myauto h-8 w-8 text-white i-mdi-menu">
      </button>
    </div>
    <div class="mx-auto my-auto">
      <DashboardSearchBar />
    </div>
  </div>
</template>
