<script setup lang="ts">
interface Props {
    icon?: string
}

defineProps<Props>()
</script>
<template>
    <button type="button" class="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-md text-white font-bold
        transition-all hover:(shadow-lg filter-saturate-150) active:(scale-95) focus:outline-none">
        <span class="min-h-4 min-w-4" :class="[icon]"></span>
        <p class="text-4">
            <slot />
        </p>
    </button>
</template>