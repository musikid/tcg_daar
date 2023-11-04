<script setup lang="ts">
import type { ToastParams } from '~/stores/toast';

useSeoMeta({
  description: 'Dashboard',
  titleTemplate: title => title ? `${title} - Dashboard` : 'Dashboard',
})
definePageMeta({
  name: 'Dashboard',
  layout: 'dashboard',
})

const { error: createToast } = useToast()

const error = useError()
watch(error, (value) => {
  if (value) {
    const payload: Omit<ToastParams, 'type'> = value instanceof Error
      ? { title: value.name, description: value.message, onClose: clearError }
      : { title: value.message, description: value.description, onClose: clearError }

    createToast(payload)
    console.error(value)
  }
})
</script>

<template>
  <div class="flex h-full w-full relative">
    <NuxtPage class="w-full overflow-y-auto" />
    <div class="absolute bottom-10% z2 w-50% left-25%">
      <Transition>
        <Toast />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>